/**
 * Atlas MX — información en vivo desde Wikipedia (sin API key).
 * Una sola búsqueda devuelve título, resumen, enlace y miniatura de cada página, de modo que
 * la foto y el texto de un lugar salen de la misma petición.
 */
import { fetchWithTimeout } from './http.js';
const STORAGE_KEY = 'atlas-mx:wiki:v2';
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
    prop: 'pageimages|extracts|info|coordinates',
    piprop: 'thumbnail|original',
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
        .map((page) => ({
          title: page.title || '',
          extract: (page.extract || '').replace(/\s+/g, ' ').trim(),
          url: page.fullurl || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent((page.title || '').replace(/ /g, '_'))}`,
          thumbnail: page?.thumbnail?.source || page?.original?.source || '',
          coordinates: page?.coordinates?.[0] ? { lat: page.coordinates[0].lat, lon: page.coordinates[0].lon } : null
        }));
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

/**
 * Resumen real de Wikipedia de un lugar.
 * @returns {Promise<{title: string, extract: string, url: string} | null>}
 */
export async function fetchPlaceSummary(placeName, stateName = '') {
  if (!placeName) return null;
  try {
    const query = stateName ? `${placeName} ${stateName} México` : `${placeName} México`;
    const pages = await wikiSearch(query, 'es', 3);
    const match = pages.find((page) => isRelevantPage(page, placeName, stateName));
    if (match) return match;
    const direct = await wikiSearch(placeName, 'es', 3);
    return direct.find((page) => isRelevantPage(page, placeName, stateName)) || null;
  } catch {
    return null;
  }
}

/** Solo para pruebas: vacía la caché en memoria. */
export function __resetWikiCache() { memory.clear(); pending.clear(); }

// Artículo exacto de Wikipedia en español de cada estado (no una búsqueda: así la foto es del estado).
const STATE_ARTICLES = {
  '01': 'Aguascalientes', '02': 'Baja California', '03': 'Baja California Sur', '04': 'Campeche', '05': 'Coahuila',
  '06': 'Colima', '07': 'Chiapas', '08': 'Chihuahua', '09': 'Ciudad de México', '10': 'Durango', '11': 'Guanajuato',
  '12': 'Guerrero', '13': 'Hidalgo (estado)', '14': 'Jalisco', '15': 'Estado de México', '16': 'Michoacán', '17': 'Morelos',
  '18': 'Nayarit', '19': 'Nuevo León', '20': 'Oaxaca', '21': 'Puebla', '22': 'Querétaro', '23': 'Quintana Roo',
  '24': 'San Luis Potosí', '25': 'Sinaloa', '26': 'Sonora', '27': 'Tabasco', '28': 'Tamaulipas', '29': 'Tlaxcala',
  '30': 'Veracruz', '31': 'Yucatán', '32': 'Zacatecas'
};
// Archivos que no son fotografías del lugar: mapas, escudos, banderas, logotipos, gráficas…
const NOT_A_PHOTO = /(mapa|map[_ .-]|locat|ubicaci|escudo|coat[_ ]of|flag|bandera|seal|sello|logo|emblem|signature|firma|grafic|chart|diagram|icon|\.svg|\.png|\.gif)/i;
const isPhotoFile = (name = '') => /\.(jpe?g|webp)$/i.test(name) && !NOT_A_PHOTO.test(name);

function fileName(url = '') {
  try { return decodeURIComponent(url.split('/').pop().split('?')[0]).replace(/^\d+px-/, ''); } catch { return ''; }
}

/**
 * Fotografía real del estado, tomada de su propio artículo en Wikipedia.
 * @returns {Promise<{url: string, page: string} | null>}
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
    const mainParams = new URLSearchParams({ action: 'query', titles: title, redirects: '1', prop: 'pageimages', piprop: 'thumbnail|name', pithumbsize: '1400', format: 'json', origin: '*' });
    const main = await fetchWithTimeout(`https://es.wikipedia.org/w/api.php?${mainParams}`).then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); });
    const page = Object.values(main?.query?.pages || {})[0];
    if (page?.thumbnail?.source && isPhotoFile(page.pageimage || fileName(page.thumbnail.source))) {
      return { url: page.thumbnail.source, page: pageUrl };
    }
    // 2) Otras fotografías del artículo: la más grande en formato horizontal.
    const listParams = new URLSearchParams({ action: 'query', titles: title, redirects: '1', generator: 'images', gimlimit: '60', prop: 'imageinfo', iiprop: 'url|mime|size', iiurlwidth: '1400', format: 'json', origin: '*' });
    const list = await fetchWithTimeout(`https://es.wikipedia.org/w/api.php?${listParams}`).then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); });
    const candidates = Object.values(list?.query?.pages || {})
      .map((item) => ({ name: item.title || '', info: item.imageinfo?.[0] }))
      .filter(({ name, info }) => info?.thumburl && info.mime === 'image/jpeg' && isPhotoFile(name) && info.width >= 900 && info.width >= info.height)
      .sort((a, b) => b.info.width * b.info.height - a.info.width * a.info.height);
    return candidates[0] ? { url: candidates[0].info.thumburl, page: pageUrl } : null;
  })().then((result) => { persist(key, result); return result; }).finally(() => pending.delete(key));

  pending.set(key, request);
  return request;
}
