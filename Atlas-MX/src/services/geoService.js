/**
 * Atlas MX — ubicación real de lugares.
 * Orden: coordenadas del artículo de Wikipedia → búsqueda en OpenStreetMap (Nominatim).
 * Cada resultado se valida contra la geometría del INEGI: si no cae dentro del estado
 * esperado se descarta, para no mostrar un lugar homónimo de otra parte.
 */
import { estadoDeCoordenada } from '@webrek/mx-geo';
import { CAPITAL_COORDS } from '../data/capitals.js';
import { fetchPlaceSummary } from './wikiService.js';
import { fetchWithTimeout } from './http.js';

const STORAGE_KEY = 'atlas-mx:geo:v1';
const TTL_MS = 14 * 24 * 60 * 60 * 1000;
const memory = new Map();
const pending = new Map();
let loaded = false;

function load() {
  loaded = true;
  try {
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
function distanceKm(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const h = Math.sin(toRad(b.lat - a.lat) / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(toRad(b.lon - a.lon) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

export function isInState(lat, lon, stateCode) {
  if (!stateCode) return true;
  try { return estadoDeCoordenada([lon, lat]) === stateCode; } catch { return false; }
}

// Nominatim pide como máximo una petición por segundo.
let nominatimQueue = Promise.resolve();
function nominatimSearch(query) {
  const run = nominatimQueue.then(async () => {
    const params = new URLSearchParams({ q: query, format: 'jsonv2', limit: '6', countrycodes: 'mx', 'accept-language': 'es', addressdetails: '1' });
    const response = await fetchWithTimeout(`https://nominatim.openstreetmap.org/search?${params}`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  });
  nominatimQueue = run.catch(() => null).then(() => new Promise((resolve) => setTimeout(resolve, 1100)));
  return run;
}

/**
 * @returns {Promise<{lat: number, lon: number, precise: boolean, source: 'wikipedia'|'osm'|'capital'|'given', label: string}>}
 */
export async function locatePlace({ name, stateName = '', stateCode = '', coords = null, near = null }) {
  if (coords) return { lat: coords.lat, lon: coords.lon, precise: true, source: 'given', label: name };
  if (!loaded) load();
  const key = `${name}|${stateCode}${near ? `|${near.lat.toFixed(2)},${near.lon.toFixed(2)}` : ''}`;
  // `near`: punto de referencia (p. ej. el centro de un municipio). Un resultado solo vale si está cerca.
  const valid = (lat, lon) => isInState(lat, lon, stateCode) && (!near || distanceKm(near, { lat, lon }) <= NEAR_LIMIT_KM);
  const fallback = () => (near
    ? { lat: near.lat, lon: near.lon, precise: true, source: 'given', label: name }
    : (CAPITAL_COORDS[stateCode] ? { lat: CAPITAL_COORDS[stateCode][0], lon: CAPITAL_COORDS[stateCode][1], precise: false, source: 'capital', label: stateName } : null));
  if (memory.has(key)) return memory.get(key);
  if (pending.has(key)) return pending.get(key);

  const request = (async () => {
    // 1) Coordenadas del artículo de Wikipedia (si es el artículo correcto y cae en el estado).
    try {
      const page = await fetchPlaceSummary(name, stateName);
      const c = page?.coordinates;
      if (c && valid(c.lat, c.lon)) {
        const result = { lat: c.lat, lon: c.lon, precise: true, source: 'wikipedia', label: page.title };
        save(key, result);
        return result;
      }
    } catch { /* seguimos con OpenStreetMap */ }

    // 2) OpenStreetMap: primer resultado que realmente esté dentro del estado.
    try {
      const results = await nominatimSearch(`${name}, ${stateName}, México`);
      // Preferimos poblados (ciudad, pueblo, villa) sobre contornos administrativos: el centro de
      // un contorno municipal suele caer en el campo, lejos de hoteles y restaurantes.
      const rank = (item) => (item.category === 'boundary' ? 2 : near && item.category === 'place' ? 0 : 1);
      const match = (results || [])
        .filter((item) => valid(Number(item.lat), Number(item.lon)))
        .sort((a, b) => rank(a) - rank(b))[0];
      if (match) {
        const result = { lat: Number(match.lat), lon: Number(match.lon), precise: true, source: 'osm', label: match.name || name };
        save(key, result);
        return result;
      }
    } catch {
      // Error de red: no se guarda, para reintentar más tarde.
      return fallback();
    }

    // 3) Sin coincidencias confiables: el punto de referencia o, si no hay, la capital (aproximada).
    const result = fallback();
    save(key, result);
    return result;
  })().finally(() => pending.delete(key));

  pending.set(key, request);
  return request;
}
