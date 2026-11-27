/**
 * Atlas MX — información en vivo desde Wikipedia (sin API key).
 * Una sola búsqueda devuelve título, resumen, enlace y miniatura de cada página, de modo que
 * la foto y el texto de un lugar salen de la misma petición.
 */
import { ESTADOS, estadoDeCoordenada } from '@webrek/mx-geo';
import { fetchWithTimeout } from './http.js';
import { commonsThumbUrl } from '../utils/commons';
// v3: se descartan resultados guardados con la regla de relevancia anterior (fotos y resúmenes de otros lugares).
const STORAGE_KEY = 'atlas-mx:wiki:v3';
const TTL_MS = 3 * 24 * 60 * 60 * 1000;
const MAX_STORED = 400;

const memory = new Map();
const pending = new Map();

function loadStore() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const now = Date.now();
    Object.entries(raw).forEach(([key, entry]) => {
      if (entry && now - entry.t < TTL_MS) memory.set(key, entry.v);
    });
  } catch { /* almacenamiento no disponible */ }
}
let loaded = false;
let saveTimer = null;
function persist(key, value) {
  memory.set(key, value);
  if (typeof window === 'undefined') return;
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      raw[key] = { t: Date.now(), v: value };
      const entries = Object.entries(raw).sort((a, b) => b[1].t - a[1].t).slice(0, MAX_STORED);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(entries)));
    } catch { /* cuota llena o almacenamiento bloqueado */ }
  }, 400);
}

const fold = (value = '') => value.toLocaleLowerCase('es-MX').normalize('NFD').replace(/[̀-ͯ]/g, '');
const STOPWORDS = new Set(['de', 'del', 'la', 'las', 'los', 'el', 'en', 'y', 'san', 'santa', 'mexico', 'estado', 'centro', 'zona', 'museo', 'playa', 'parque', 'nacional']);
const keywords = (text) => fold(text).split(/[^a-zñ0-9]+/).filter((word) => word.length >= 4 && !STOPWORDS.has(word));

/** Normaliza una página de la API de Wikipedia al formato que usa la app. */
function toPage(page, lang) {
  return {
    title: page.title || '',
    extract: (page.extract || '').replace(/\s+/g, ' ').trim(),
    url: page.fullurl || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent((page.title || '').replace(/ /g, '_'))}`,
    thumbnail: page?.thumbnail?.source || page?.original?.source || '',
    // Nombre del archivo de la imagen principal (sin "Archivo:"), para descartar mapas y escudos.
    image: page.pageimage || '',
    qid: page?.pageprops?.wikibase_item || null,
    coordinates: page?.coordinates?.[0] ? { lat: page.coordinates[0].lat, lon: page.coordinates[0].lon } : null
  };
}

/**
 * Busca en Wikipedia y devuelve las páginas ordenadas por relevancia.
 * @returns {Promise<Array<{title: string, extract: string, url: string, thumbnail: string}>>}
 */
export async function wikiSearch(term, lang = 'es', limit = 3) {
  if (!term) return [];
  if (!loaded) { loaded = true; loadStore(); }
  const key = `${lang}|${limit}|${fold(term).trim()}`;
  if (memory.has(key)) return memory.get(key);
  if (pending.has(key)) return pending.get(key);

  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: term,
    gsrnamespace: '0',
    gsrlimit: String(limit),
    prop: 'pageimages|extracts|info|coordinates|pageprops',
    piprop: 'thumbnail|original|name',
    ppprop: 'wikibase_item',
    pithumbsize: '1200',
    exintro: '1',
    explaintext: '1',
    exsentences: '3',
    exlimit: String(limit),
    inprop: 'url',
    colimit: String(limit),
    redirects: '1',
    format: 'json',
    origin: '*'
  });

  const request = fetchWithTimeout(`https://${lang}.wikipedia.org/w/api.php?${params}`, { headers: { Accept: 'application/json' } })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      const pages = Object.values(data?.query?.pages || {})
        .sort((a, b) => (a.index ?? 999) - (b.index ?? 999))
        .map((page) => toPage(page, lang));
      persist(key, pages);
      return pages;
    })
    .finally(() => pending.delete(key));

  pending.set(key, request);
  return request;
}

/**
 * ¿La página realmente habla de este lugar? Evita mostrar el resumen de otro sitio
 * (p. ej. "Bahía San Agustín" no debe traer el artículo de un club deportivo).
 * Reglas: el título debe contener casi todas las palabras clave del lugar, y el texto
 * debe ubicarse en el estado o en México.
 */
export function isRelevantPage(page, placeName, stateName = '') {
  if (!page?.extract || page.extract.length < 40) return false;
  const words = keywords(placeName);
  const title = fold(page.title);
  const titleHits = words.filter((word) => title.includes(word)).length;
  const needed = words.length <= 2 ? words.length : words.length - 1;
  if (words.length === 0 ? !title.includes(fold(placeName).trim()) : titleHits < needed) return false;
  const text = fold(page.extract);
  const placeWords = keywords(stateName).filter((word) => word !== 'estado');
  const located = text.includes('mexic') || placeWords.some((word) => text.includes(word));
  return located;
}

const cleanText = (value = '') => fold(value).replace(/[^a-z0-9ñ]+/g, ' ').trim();

/**
 * Coincidencia ESTRICTA entre el título de una página y el lugar: el título es el nombre
 * (sin acentos ni mayúsculas), o el nombre con el estado como desambiguación:
 * "Valladolid (Yucatán)", "Tequila, Jalisco", "Metepec (estado de México)", "Valladolid (México)".
 * Con `municipality: true` también vale "Municipio de Tequila" (para fotos y resúmenes).
 * Una búsqueda difusa que trae un homónimo, un monumento o una bebida no pasa esta regla.
 */
export function titleMatchesPlace(title, placeName, stateName = '', { municipality = false } = {}) {
  const name = cleanText(placeName);
  if (!title || !name) return false;
  const base = (value) => {
    const text = cleanText(value);
    return municipality ? text.replace(/^municipio (de |del )?/, '') : text;
  };
  if (base(title) === name) return true;
  const match = /^(.*?)\s*(?:\(([^)]*)\)|,\s*(.+))$/.exec(title.trim());
  if (!match || base(match[1]) !== name) return false;
  const qualifier = cleanText(match[2] ?? match[3]).replace(/^estado (de )?/, '');
  const state = cleanText(stateName).replace(/^estado (de )?/, '');
  if (!qualifier || qualifier.length < 4) return false;
  // "Valladolid (México)": desambiguación por país (el texto o las coordenadas confirman el estado).
  if (qualifier === 'mexico') return true;
  if (!state) return false;
  return qualifier.startsWith(state) || state.startsWith(qualifier);
}

/** Relevancia estricta: título exacto del lugar y texto ubicado en México o en el estado. */
export function isStrictMatch(page, placeName, stateName = '', options = {}) {
  return titleMatchesPlace(page?.title, placeName, stateName, options) && isRelevantPage({ ...page, title: placeName }, placeName, stateName);
}

// Clave INEGI del estado a partir de su nombre, tolerante a acentos y a nombres cortos
// ("Michoacán" por "Michoacán de Ocampo", "Estado de México" por "México").
const stateKey = (value = '') => fold(value).replace(/^estado de /, '').trim();
export function stateCodeFromName(stateName = '') {
  const wanted = stateKey(stateName);
  if (!wanted) return '';
  const exact = ESTADOS.find((state) => stateKey(state.nombre) === wanted);
  if (exact) return exact.cve;
  return ESTADOS.find((state) => stateKey(state.nombre).startsWith(`${wanted} `))?.cve || '';
}

/**
 * ¿Las coordenadas del artículo caen en el estado (o en México, si no se sabe el estado)?
 * Separa "Tequila (Jalisco)" del artículo de la bebida, que no tiene coordenadas.
 */
export function isPageInState(page, stateName = '') {
  const c = page?.coordinates;
  if (!c) return false;
  try {
    const code = estadoDeCoordenada([c.lon, c.lat]);
    const wanted = stateCodeFromName(stateName);
    return wanted ? code === wanted : Boolean(code);
  } catch {
    return false;
  }
}

/**
 * Resumen real de Wikipedia de un lugar. Primero se busca una página cuyo título coincida
 * exactamente con el lugar; si no hay, se acepta la regla de relevancia general.
 * @returns {Promise<{title: string, extract: string, url: string} | null>}
 */
export async function fetchPlaceSummary(placeName, stateName = '') {
  if (!placeName) return null;
  try {
    const query = stateName ? `${placeName} ${stateName} México` : `${placeName} México`;
    const [broad, direct] = await Promise.all([wikiSearch(query, 'es', 3), wikiSearch(placeName, 'es', 3).catch(() => [])]);
    const pages = [...broad, ...direct];
    const strict = (page) => isStrictMatch(page, placeName, stateName, { municipality: true });
    const loose = (page) => isRelevantPage(page, placeName, stateName);
    // Primero el artículo que además está ubicado en el estado (un pueblo, no la bebida homónima).
    return pages.find((page) => strict(page) && isPageInState(page, stateName))
      || pages.find((page) => loose(page) && isPageInState(page, stateName))
      || pages.find(strict)
      || pages.find(loose)
      || null;
  } catch {
    return null;
  }
}

/**
 * Página de Wikipedia por su título EXACTO (sin búsqueda). Sigue redirecciones.
 * @returns {Promise<{title: string, extract: string, url: string, thumbnail: string, image: string, qid: string|null, coordinates: {lat: number, lon: number}|null} | null>}
 */
export async function fetchWikiByTitle(title, lang = 'es') {
  if (!title) return null;
  if (!loaded) { loaded = true; loadStore(); }
  const key = `title|${lang}|${title}`;
  if (memory.has(key)) return memory.get(key);
  if (pending.has(key)) return pending.get(key);
  const params = new URLSearchParams({
    action: 'query',
    titles: title,
    redirects: '1',
    prop: 'pageimages|extracts|info|coordinates|pageprops',
    piprop: 'thumbnail|original|name',
    pithumbsize: '1200',
    ppprop: 'wikibase_item',
    exintro: '1',
    explaintext: '1',
    exsentences: '3',
    inprop: 'url',
    format: 'json',
    origin: '*'
  });
  const request = fetchWithTimeout(`https://${lang}.wikipedia.org/w/api.php?${params}`, { headers: { Accept: 'application/json' } })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      const page = Object.values(data?.query?.pages || {})[0];
      const result = page && !('missing' in page) && !('invalid' in page) ? toPage(page, lang) : null;
      persist(key, result);
      return result;
    })
    .finally(() => pending.delete(key));
  pending.set(key, request);
  return request;
}

const entityMemory = new Map();
/**
 * Datos verificados de un elemento de Wikidata: coordenadas (P625), imagen (P18) y
 * categoría de Commons (P373). Solo en memoria: son pocos datos y cambian poco.
 * @returns {Promise<{qid: string, coords: {lat: number, lon: number}|null, images: string[], commonsCategory: string|null}>}
 */
export function fetchWikidataEntity(qid) {
  if (!/^Q\d+$/.test(qid || '')) return Promise.resolve(null);
  if (entityMemory.has(qid)) return entityMemory.get(qid);
  // Solo las tres propiedades que se usan (wbgetclaims): el elemento completo de un estado pesa
  // decenas de KB y tarda mucho más.
  const claimsOf = (property) => {
    const params = new URLSearchParams({ action: 'wbgetclaims', entity: qid, property, format: 'json', origin: '*' });
    return fetchWithTimeout(`https://www.wikidata.org/w/api.php?${params}`, { headers: { Accept: 'application/json' } })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => (data?.claims?.[property] || [])
        .filter((claim) => claim.rank !== 'deprecated')
        .sort((a, b) => (b.rank === 'preferred') - (a.rank === 'preferred'))
        .map((claim) => claim?.mainsnak?.datavalue?.value)
        .filter((value) => value != null));
  };
  const request = Promise.all([claimsOf('P625'), claimsOf('P18'), claimsOf('P373')])
    .then(([coordValues, images, categories]) => {
      const coord = coordValues[0];
      return {
        qid,
        coords: coord && Number.isFinite(coord.latitude) ? { lat: coord.latitude, lon: coord.longitude } : null,
        images: images.filter((value) => typeof value === 'string'),
        commonsCategory: categories.find((value) => typeof value === 'string') || null
      };
    });
  // Un fallo de red no se queda en caché: se reintenta en la siguiente consulta.
  entityMemory.set(qid, request);
  request.catch(() => entityMemory.delete(qid));
  return request;
}

/** Solo para pruebas: vacía la caché en memoria. */
export function __resetWikiCache() { memory.clear(); pending.clear(); entityMemory.clear(); }

// Artículo exacto de Wikipedia en español de cada estado (no una búsqueda: así la foto es del estado).
const STATE_ARTICLES = {
  '01': 'Aguascalientes', '02': 'Baja California', '03': 'Baja California Sur', '04': 'Campeche', '05': 'Coahuila',
  '06': 'Colima', '07': 'Chiapas', '08': 'Chihuahua', '09': 'Ciudad de México', '10': 'Durango', '11': 'Guanajuato',
  '12': 'Estado de Guerrero', '13': 'Hidalgo (estado)', '14': 'Jalisco', '15': 'Estado de México', '16': 'Michoacán', '17': 'Morelos',
  '18': 'Nayarit', '19': 'Nuevo León', '20': 'Oaxaca', '21': 'Puebla', '22': 'Querétaro', '23': 'Quintana Roo',
  '24': 'San Luis Potosí', '25': 'Sinaloa', '26': 'Sonora', '27': 'Tabasco', '28': 'Tamaulipas', '29': 'Tlaxcala',
  '30': 'Veracruz de Ignacio de la Llave', '31': 'Yucatán', '32': 'Zacatecas'
};
// Elemento de Wikidata de cada estado: su imagen (P18) es otra candidata verificada.
const STATE_QIDS = {
  '01': 'Q79952', '02': 'Q58731', '03': 'Q46508', '04': 'Q80908', '05': 'Q53079', '06': 'Q61309', '07': 'Q60123', '08': 'Q655',
  '09': 'Q1489', '10': 'Q79918', '11': 'Q46475', '12': 'Q60158', '13': 'Q80903', '14': 'Q13160', '15': 'Q82112', '16': 'Q79861',
  '17': 'Q66117', '18': 'Q79920', '19': 'Q15282', '20': 'Q34110', '21': 'Q79923', '22': 'Q79754', '23': 'Q80245', '24': 'Q78980',
  '25': 'Q80252', '26': 'Q46422', '27': 'Q80914', '28': 'Q80007', '29': 'Q82681', '30': 'Q60130', '31': 'Q60176', '32': 'Q80269'
};

/** Miniatura de un archivo de Wikimedia Commons al ancho pedido (sin pasar por la API). */
export function commonsFileUrl(file, width = 1200) {
  return commonsThumbUrl(file, width);
}
// Archivos que no son fotografías del lugar: mapas, escudos, banderas, logotipos, gráficas…
// También imágenes de satélite (ISS, ESA, Landsat…): no son una vista del lugar.
const NOT_A_PHOTO = /(mapa|map[_ .-]|locat|ubicaci|escudo|coat[_ ]of|flag|bandera|seal|sello|logo|emblem|signature|firma|grafic|chart|diagram|icon|satel|landsat|modis|\bISS\d|\bESA\d|\.svg|\.png|\.gif)/i;
export const isPhotoFile = (name = '') => /\.(jpe?g|webp)$/i.test(name) && !NOT_A_PHOTO.test(name);

function fileName(url = '') {
  try { return decodeURIComponent(url.split('/').pop().split('?')[0]).replace(/^\d+px-/, ''); } catch { return ''; }
}

/**
 * Fotografía real del estado: la imagen principal de su artículo en Wikipedia, la imagen
 * de su elemento de Wikidata (P18) o, en último caso, la foto horizontal más grande del artículo.
 * @returns {Promise<{url: string, page: string, file: string} | null>}
 */
export async function fetchStatePhoto(stateCode) {
  const title = STATE_ARTICLES[stateCode];
  if (!title) return null;
  if (!loaded) { loaded = true; loadStore(); }
  const key = `statephoto|${stateCode}`;
  if (memory.has(key)) return memory.get(key);
  if (pending.has(key)) return pending.get(key);
  const pageUrl = `https://es.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;

  const request = (async () => {
    // 1) Imagen principal del artículo, si es una fotografía.
    const mainParams = new URLSearchParams({ action: 'query', titles: title, redirects: '1', prop: 'pageimages|pageprops', piprop: 'thumbnail|name', pithumbsize: '1400', ppprop: 'wikibase_item', format: 'json', origin: '*' });
    const main = await fetchWithTimeout(`https://es.wikipedia.org/w/api.php?${mainParams}`).then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); });
    const page = Object.values(main?.query?.pages || {})[0];
    // El artículo debe ser el del estado (su elemento de Wikidata): "Guerrero" a secas es otro tema.
    const isStateArticle = page?.pageprops?.wikibase_item === STATE_QIDS[stateCode];
    if (isStateArticle && page?.thumbnail?.source && isPhotoFile(page.pageimage || fileName(page.thumbnail.source))) {
      return { url: page.thumbnail.source, page: pageUrl, file: page.pageimage || fileName(page.thumbnail.source) };
    }
    // 2) Imagen del estado en Wikidata (P18), si es una fotografía y no un mapa o una bandera.
    try {
      const entity = await fetchWikidataEntity(STATE_QIDS[stateCode]);
      const file = entity?.images?.find((name) => isPhotoFile(name));
      if (file) return { url: commonsFileUrl(file, 1400), page: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, '_'))}`, file };
    } catch { /* seguimos con las demás fotos del artículo */ }
    // 3) Otras fotografías del artículo: la más grande en formato horizontal.
    if (!isStateArticle) return null;
    const listParams = new URLSearchParams({ action: 'query', titles: title, redirects: '1', generator: 'images', gimlimit: '60', prop: 'imageinfo', iiprop: 'url|mime|size', iiurlwidth: '1400', format: 'json', origin: '*' });
    const list = await fetchWithTimeout(`https://es.wikipedia.org/w/api.php?${listParams}`).then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); });
    const candidates = Object.values(list?.query?.pages || {})
      .map((item) => ({ name: item.title || '', info: item.imageinfo?.[0] }))
      .filter(({ name, info }) => info?.thumburl && info.mime === 'image/jpeg' && isPhotoFile(name) && info.width >= 900 && info.width >= info.height)
      .sort((a, b) => b.info.width * b.info.height - a.info.width * a.info.height);
    return candidates[0] ? { url: candidates[0].info.thumburl, page: pageUrl, file: candidates[0].name.replace(/^(File|Archivo):/i, '') } : null;
  })().then((result) => { persist(key, result); return result; }).finally(() => pending.delete(key));

  pending.set(key, request);
  return request;
}
