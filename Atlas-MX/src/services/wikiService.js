/**
 * Atlas MX — información en vivo desde Wikipedia (sin API key).
 * Una sola búsqueda devuelve título, resumen, enlace y miniatura de cada página, de modo que
 * la foto y el texto de un lugar salen de la misma petición.
 */
const STORAGE_KEY = 'atlas-mx:wiki:v1';
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
    prop: 'pageimages|extracts|info',
    piprop: 'thumbnail|original',
    pithumbsize: '1200',
    exintro: '1',
    explaintext: '1',
    exsentences: '3',
    exlimit: String(limit),
    inprop: 'url',
    redirects: '1',
    format: 'json',
    origin: '*'
  });

  const request = fetch(`https://${lang}.wikipedia.org/w/api.php?${params}`, { headers: { Accept: 'application/json' } })
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
          thumbnail: page?.thumbnail?.source || page?.original?.source || ''
        }));
      persist(key, pages);
      return pages;
    })
    .finally(() => pending.delete(key));

  pending.set(key, request);
  return request;
}

/** ¿La página realmente habla de este lugar? Evita mostrar el resumen de otro sitio. */
export function isRelevantPage(page, placeName) {
  if (!page?.extract || page.extract.length < 40) return false;
  const words = keywords(placeName);
  if (words.length === 0) return fold(page.title).includes(fold(placeName).trim());
  const haystack = fold(`${page.title} ${page.extract.slice(0, 300)}`);
  const hits = words.filter((word) => haystack.includes(word)).length;
  return hits >= Math.min(2, words.length);
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
    const match = pages.find((page) => isRelevantPage(page, placeName));
    if (match) return match;
    const direct = await wikiSearch(placeName, 'es', 3);
    return direct.find((page) => isRelevantPage(page, placeName)) || null;
  } catch {
    return null;
  }
}

/** Solo para pruebas: vacía la caché en memoria. */
export function __resetWikiCache() { memory.clear(); pending.clear(); }
