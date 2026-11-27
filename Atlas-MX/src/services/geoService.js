/**
 * Atlas MX — ubicación real de lugares.
 * Orden: coordenadas dadas → Wikidata (P625) → artículo exacto de Wikipedia → búsqueda.
 * En la búsqueda, un poblado se ubica primero con OpenStreetMap (nodo del pueblo, no el
 * centro del contorno municipal) y un sitio primero con el artículo de Wikipedia cuyo título
 * coincide exactamente. Cada resultado se valida contra la geometría del INEGI: si no cae
 * dentro del estado esperado se descarta, para no mostrar un lugar homónimo de otra parte.
 */
import { estadoDeCoordenada } from '@webrek/mx-geo';
import { CAPITAL_COORDS } from '../data/capitals.js';
import { fetchWikiByTitle, fetchWikidataEntity, stateCodeFromName, titleMatchesPlace, wikiSearch } from './wikiService.js';

export { stateCodeFromName };
import { fetchWithTimeout } from './http.js';

// v2: se descartan los puntos guardados con la lógica anterior (centros de municipio, homónimos).
const STORAGE_KEY = 'atlas-mx:geo:v2';
const TTL_MS = 14 * 24 * 60 * 60 * 1000;
const memory = new Map();
const pending = new Map();
let loaded = false;

function load() {
  loaded = true;
  try {
    localStorage.removeItem('atlas-mx:geo:v1');
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    Object.entries(raw).forEach(([key, entry]) => { if (Date.now() - entry.t < TTL_MS) memory.set(key, entry.v); });
  } catch { /* sin almacenamiento */ }
}
function save(key, value) {
  memory.set(key, value);
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    raw[key] = { t: Date.now(), v: value };
    const entries = Object.entries(raw).sort((a, b) => b[1].t - a[1].t).slice(0, 300);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch { /* cuota llena */ }
}

const NEAR_LIMIT_KM = 35;
export function distanceKm(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const h = Math.sin(toRad(b.lat - a.lat) / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(toRad(b.lon - a.lon) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

export function isInState(lat, lon, stateCode) {
  if (!stateCode) return true;
  try { return estadoDeCoordenada([lon, lat]) === stateCode; } catch { return false; }
}

const fold = (value = '') => value.toLocaleLowerCase('es-MX').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ]+/g, ' ').trim();

/**
 * Qué clase de lugar se busca, según la categoría con la que se abrió.
 * - settlement: pueblo, ciudad, municipio, localidad… (se quiere el centro del poblado)
 * - site: monumento, zona arqueológica, museo, playa, parque… (se quiere el sitio en sí)
 * - any: "Destino" y categorías desconocidas
 */
export function placeKind(category = '') {
  const text = fold(category);
  if (/(pueblo|ciudad|municip|localidad|alcaldia|cabecera|villa|poblado|town|city|capital)/.test(text)) return 'settlement';
  if (/(arqueolog|hist|monument|museo|sitio|playa|naturaleza|parque|reserva|cenote|cascada|gruta|iglesia|templo|catedral|convento|hacienda|volcan|lago|laguna|canon|isla|zona|mirador|gastronom|mercado)/.test(text)) return 'site';
  return 'any';
}

// Nominatim pide como máximo una petición por segundo.
let nominatimQueue = Promise.resolve();
function nominatimSearch(query, extra = {}) {
  const run = nominatimQueue.then(async () => {
    const params = new URLSearchParams({ q: query, format: 'jsonv2', limit: '8', countrycodes: 'mx', 'accept-language': 'es', addressdetails: '1', ...extra });
    const response = await fetchWithTimeout(`https://nominatim.openstreetmap.org/search?${params}`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  });
  nominatimQueue = run.catch(() => null).then(() => new Promise((resolve) => setTimeout(resolve, 1100)));
  return run;
}

const SETTLEMENT_TYPES = new Set(['city', 'town', 'village', 'hamlet', 'suburb', 'quarter', 'neighbourhood', 'locality', 'isolated_dwelling']);
const SITE_CLASSES = new Set(['tourism', 'historic', 'amenity', 'natural', 'leisure', 'building', 'man_made', 'heritage', 'waterway', 'water']);
// El contorno de un poblado (addresstype town/city/village) sí tiene el centro en el pueblo;
// el de un municipio (addresstype county) no.
const isTownBoundary = (item) => item.category === 'boundary' && item.type === 'administrative' && SETTLEMENT_TYPES.has(item.addresstype);
const isSettlement = (item) => (item.category === 'place' && SETTLEMENT_TYPES.has(item.type)) || isTownBoundary(item);
const isAdminBoundary = (item) => item.category === 'boundary' && item.type === 'administrative' && !isTownBoundary(item);

/**
 * 0: el nombre es exactamente el buscado · 1: empieza por él ("Tlalpujahua de Rayón")
 * 2: lo contiene, o es su forma corta ("San Cristóbal" por "San Cristóbal de las Casas") · 3: otro.
 */
function nameScore(item, name) {
  const wanted = fold(name);
  const names = [item.name, (item.display_name || '').split(',')[0]].filter(Boolean).map(fold);
  if (names.some((value) => value === wanted)) return 0;
  if (names.some((value) => value.startsWith(`${wanted} `))) return 1;
  if (names.some((value) => value.includes(wanted) || (value.length >= 4 && wanted.startsWith(`${value} `)))) return 2;
  return 3;
}

function classScore(item, kind) {
  if (isAdminBoundary(item)) return 6; // el centro de un contorno municipal suele caer lejos del pueblo
  if (kind === 'settlement') {
    if (isSettlement(item)) return 0;
    if (item.category === 'place') return 1;
    if (SITE_CLASSES.has(item.category)) return 3;
    return 4;
  }
  if (kind === 'site') {
    if (SITE_CLASSES.has(item.category)) return 0;
    if (item.category === 'boundary') return 1; // áreas protegidas, parques nacionales
    if (item.category === 'place') return 2;
    return 3;
  }
  if (isSettlement(item) || item.category === 'tourism' || item.category === 'historic') return 0;
  if (SITE_CLASSES.has(item.category) || item.category === 'place') return 1;
  return 3;
}

/** Ordena los resultados de Nominatim; devuelve el mejor junto con su puntaje de nombre. */
function bestOsmMatch(results, { name, kind, valid, near }) {
  const scored = (results || [])
    .map((item) => ({ item, lat: Number(item.lat), lon: Number(item.lon) }))
    .filter(({ lat, lon }) => Number.isFinite(lat) && valid(lat, lon))
    .map((entry, order) => ({ ...entry, order, name: nameScore(entry.item, name), cls: classScore(entry.item, kind) }));
  // Nunca el centro de un contorno si existe un poblado con el mismo nombre.
  const hasPlaceNode = scored.some((entry) => entry.name <= 2 && isSettlement(entry.item));
  const candidates = scored.filter((entry) => !(hasPlaceNode && isAdminBoundary(entry.item)));
  candidates.sort((a, b) => (a.name - b.name) || (a.cls - b.cls)
    || (near ? distanceKm(near, a) - distanceKm(near, b) : 0) || (a.order - b.order));
  return candidates[0] || null;
}

const osmResult = (match, name) => ({ lat: match.lat, lon: match.lon, precise: true, source: 'osm', label: match.item.name || name });

/**
 * Coordenadas de un artículo de Wikipedia solo si su título es exactamente el del lugar.
 * Con `cabecera`, también vale el nombre completo de la cabecera ("Tlalpujahua de Rayón"),
 * pero solo si cae dentro del contorno del municipio (`valid` lo comprueba).
 */
const isCabeceraTitle = (title, name) => fold(title.replace(/\s*\(.*\)$/, '')).startsWith(`${fold(name)} de `) || fold(title).startsWith(`${fold(name)} del `);
// Artículo propio de un sitio: "Zona arqueológica de Palenque", "Parque nacional Palenque".
const SITE_TITLE = /^(zona arqueologica|sitio arqueologico|ruinas|parque nacional)( de| del)? (.+)$/;
function isSiteTitle(title, name) {
  const text = fold(title); // sin acentos ni signos: "Palenque (zona arqueológica)" → "palenque zona arqueologica"
  const wanted = fold(name);
  const prefixed = SITE_TITLE.exec(text);
  if (prefixed && prefixed[3] === wanted) return true;
  return text === `${wanted} zona arqueologica` || text === `${wanted} sitio arqueologico`;
}

async function wikipediaCoords(name, stateName, valid, { cabecera = false, kind = 'any' } = {}) {
  const queries = [stateName ? `${name} ${stateName}` : name, name];
  const titleOk = (title) => titleMatchesPlace(title, name, stateName) || (cabecera && isCabeceraTitle(title, name)) || (kind === 'site' && isSiteTitle(title, name));
  const matches = [];
  for (const query of queries) {
    const pages = await wikiSearch(query, 'es', 5);
    pages.forEach((item) => {
      if (item.coordinates && titleOk(item.title) && valid(item.coordinates.lat, item.coordinates.lon) && !matches.some((m) => m.title === item.title)) matches.push(item);
    });
  }
  // "Palenque" a secas es la zona arqueológica; "Palenque (Chiapas)", la ciudad. Los destinos
  // ("any") suelen ser poblados, así que solo un sitio prefiere el título sin desambiguar.
  const qualified = (title) => /\(|,/.test(title);
  const rank = (title) => {
    if (kind !== 'site') return qualified(title) ? 0 : 1;
    if (isSiteTitle(title, name)) return 0; // el artículo del sitio
    return qualified(title) ? 2 : 1;
  };
  const page = matches.sort((a, b) => rank(a.title) - rank(b.title))[0];
  return page ? { lat: page.coordinates.lat, lon: page.coordinates.lon, precise: true, source: 'wikipedia', label: page.title } : null;
}

/**
 * @param {{name: string, stateName?: string, stateCode?: string, category?: string, coords?: {lat:number, lon:number}|null,
 *   near?: {lat:number, lon:number}|null, placeId?: string|null, wikiTitle?: string|null}} query
 * @returns {Promise<{lat: number, lon: number, precise: boolean, source: 'given'|'wikidata'|'wikipedia'|'osm'|'capital', label: string}>}
 */
export async function locatePlace({ name, stateName = '', stateCode = '', category = '', coords = null, near = null, placeId = null, wikiTitle = null }) {
  // Sin clave explícita se deduce del nombre: sin ella no se podría validar el estado.
  stateCode = stateCode || stateCodeFromName(stateName);
  if (coords && Number.isFinite(Number(coords.lat)) && Number.isFinite(Number(coords.lon))) {
    return { lat: Number(coords.lat), lon: Number(coords.lon), precise: true, source: 'given', label: name };
  }
  if (!loaded) load();
  const kind = placeKind(category);
  const key = [name, stateCode, kind, placeId || '', wikiTitle || '', near ? `${near.lat.toFixed(2)},${near.lon.toFixed(2)}` : ''].join('|');
  // `near`: punto de referencia (p. ej. el centro de un municipio). Un resultado solo vale si está cerca.
  const valid = (lat, lon) => isInState(lat, lon, stateCode) && (!near || distanceKm(near, { lat, lon }) <= NEAR_LIMIT_KM);
  const fallback = () => (near
    ? { lat: near.lat, lon: near.lon, precise: true, source: 'given', label: name }
    : (CAPITAL_COORDS[stateCode] ? { lat: CAPITAL_COORDS[stateCode][0], lon: CAPITAL_COORDS[stateCode][1], precise: false, source: 'capital', label: stateName } : null));
  if (memory.has(key)) return memory.get(key);
  if (pending.has(key)) return pending.get(key);

  const request = (async () => {
    let networkError = false;
    const attempt = async (step) => {
      try { return await step(); } catch { networkError = true; return null; }
    };
    // Si algún paso falló por la red, el resultado puede no ser el mejor: se usa, pero no se guarda.
    const done = (result) => { if (!networkError) save(key, result); return result; };

    // 1) Datos verificados: coordenadas del elemento de Wikidata o del artículo exacto.
    if (placeId) {
      const entity = await attempt(() => fetchWikidataEntity(placeId));
      if (entity?.coords && valid(entity.coords.lat, entity.coords.lon)) return done({ ...entity.coords, precise: true, source: 'wikidata', label: name });
    }
    if (wikiTitle) {
      const page = await attempt(() => fetchWikiByTitle(wikiTitle));
      const c = page?.coordinates;
      if (c && valid(c.lat, c.lon)) return done({ lat: c.lat, lon: c.lon, precise: true, source: 'wikipedia', label: page.title });
    }

    const base = stateName ? `${name}, ${stateName}, México` : `${name}, México`;
    const ctx = { name, kind, valid, near };
    let loose = null; // mejor resultado de OSM cuyo nombre no coincide del todo (último recurso)
    const consider = (match) => {
      if (!match) return null;
      if (match.name <= 1) return match;
      if (!loose || match.name < loose.name || (match.name === loose.name && match.cls < loose.cls)) loose = match;
      return null;
    };

    // Si solo apareció el contorno del municipio, se busca su cabecera ("Tlalpujahua de Rayón")
    // dentro de ese contorno, en lugar de usar su centro geométrico (que suele caer en el campo).
    const resolveBoundary = async (match) => {
      const box = isAdminBoundary(match.item) ? match.item.boundingbox?.map(Number) : null;
      if (box?.length === 4) {
        const inBox = (lat, lon) => valid(lat, lon) && lat >= box[0] && lat <= box[1] && lon >= box[2] && lon <= box[3];
        const seat = await attempt(() => wikipediaCoords(name, stateName, inBox, { cabecera: true, kind: 'settlement' }));
        if (seat) return seat;
      }
      return osmResult(match, name);
    };

    if (kind === 'settlement') {
      // 2a) Poblado: el nodo del pueblo en OpenStreetMap, no el centro del municipio.
      const settlement = consider(bestOsmMatch(await attempt(() => nominatimSearch(base, { featuretype: 'settlement' })), ctx));
      if (settlement && settlement.cls <= 1) return done(osmResult(settlement, name));
      const wiki = await attempt(() => wikipediaCoords(name, stateName, valid, { kind }));
      if (wiki) return done(wiki);
      const general = consider(bestOsmMatch(await attempt(() => nominatimSearch(base)), ctx));
      const best = [settlement, general].filter(Boolean).sort((a, b) => (a.name - b.name) || (a.cls - b.cls))[0];
      if (best) return done(await resolveBoundary(best));
    } else {
      // 2b) Sitio o destino: el artículo exacto de Wikipedia tiene las coordenadas del sitio.
      const wiki = await attempt(() => wikipediaCoords(name, stateName, valid, { kind }));
      if (wiki) return done(wiki);
      const general = consider(bestOsmMatch(await attempt(() => nominatimSearch(base)), ctx));
      if (general && (kind === 'site' || general.cls === 0)) return done(await resolveBoundary(general));
      let best = general;
      if (kind === 'any') {
        const settlement = consider(bestOsmMatch(await attempt(() => nominatimSearch(base, { featuretype: 'settlement' })), ctx));
        best = [general, settlement].filter(Boolean).sort((a, b) => (a.name - b.name) || (a.cls - b.cls))[0];
      }
      if (best) return done(await resolveBoundary(best));
    }

    if (loose) return done(await resolveBoundary(loose));
    // Error de red sin ningún resultado: no se guarda, para reintentar más tarde.
    if (networkError) return fallback();
    // 3) Sin coincidencias confiables: el punto de referencia o, si no hay, la capital (aproximada).
    return done(fallback());
  })().finally(() => pending.delete(key));

  pending.set(key, request);
  return request;
}
