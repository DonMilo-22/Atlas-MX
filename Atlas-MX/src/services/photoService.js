/**
 * Atlas MX — fotos reales mediante Wikipedia y Wikimedia Commons.
 * No requiere API key. Las imágenes se resuelven en el navegador y se cachean en memoria.
 */
import { isRelevantPage, wikiSearch } from './wikiService';

const photoCache = new Map();
const galleryCache = new Map();

// Placeholder neutro en la paleta del sitio (sin texto, para no chocar con lo que va encima).
const PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="700" viewBox="0 0 1000 700">
  <rect fill="#E6EAE7" width="1000" height="700"/>
  <path d="M0 560L230 390l150 105 140-120 480 240v85H0z" fill="#D5DCD7"/>
  <path d="M0 640L300 500l220 110 180-80 300 110v60H0z" fill="#C9D1CB"/>
</svg>`);

const normalize = (value = '') => value.toLocaleLowerCase('es-MX').trim();

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

// Reutiliza la búsqueda de wikiService: la misma petición trae foto y resumen del lugar.
// Solo usa fotos de páginas que de verdad hablan del lugar.
async function queryWikipediaImages(searchTerm, lang = 'es', limit = 5, placeName = '', stateName = '') {
  const pages = await wikiSearch(searchTerm, lang, 3);
  return pages
    .filter((page) => !placeName || isRelevantPage(page, placeName, stateName))
    .map((page) => page.thumbnail).filter(Boolean).slice(0, limit);
}

async function queryCommonsImages(searchTerm, limit = 8) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: `${searchTerm} México`,
    gsrnamespace: '6',
    gsrlimit: String(Math.max(limit * 2, 8)),
    prop: 'imageinfo',
    iiprop: 'url|mime|size',
    iiurlwidth: '1200',
    format: 'json',
    origin: '*'
  });
  const data = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`);
  return Object.values(data?.query?.pages || {})
    .map((page) => page?.imageinfo?.[0])
    .filter((info) => info?.thumburl && /^image\/(jpeg|png|webp)$/i.test(info?.mime || '') && (info.width || 0) >= 500 && (info.height || 0) >= 300)
    .map((info) => info.thumburl)
    .slice(0, limit);
}

function uniqueUrls(urls) {
  return [...new Set(urls.filter(Boolean))];
}

const pendingGalleries = new Map();

/** Obtiene una galería de fotografías reales relacionadas con el lugar. */
export async function fetchRealPhotos(placeName, options = {}) {
  const { stateName = '', limit = 5 } = options;
  if (!placeName) return [];
  const cacheKey = `${normalize(placeName)}|${normalize(stateName)}|${limit}`;
  if (galleryCache.has(cacheKey)) return galleryCache.get(cacheKey);
  // Comparte la misma petición entre tarjetas que piden el mismo lugar al mismo tiempo.
  if (pendingGalleries.has(cacheKey)) return pendingGalleries.get(cacheKey);

  const request = (async () => {
    const broadQuery = stateName ? `${placeName} ${stateName} México` : `${placeName} México`;
    // Las consultas corren en paralelo; si una falla, las demás conservan sus resultados.
    const settled = await Promise.allSettled([
      queryWikipediaImages(broadQuery, 'es', Math.min(limit, 3), placeName, stateName),
      queryWikipediaImages(placeName, 'es', Math.min(limit, 3), placeName, stateName),
      queryCommonsImages(broadQuery, limit)
    ]);
    let failures = settled.filter((item) => item.status === 'rejected').length;
    let urls = uniqueUrls(settled.flatMap((item) => (item.status === 'fulfilled' ? item.value : [])));
    if (urls.length === 0 && failures < settled.length) {
      const fallback = await Promise.allSettled([queryWikipediaImages(broadQuery, 'en', Math.min(limit, 3), placeName, stateName)]);
      failures += fallback.filter((item) => item.status === 'rejected').length;
      urls = uniqueUrls(fallback.flatMap((item) => (item.status === 'fulfilled' ? item.value : [])));
    }
    const result = urls.slice(0, limit);
    // Solo se cachea si hubo resultados o si la red respondió: un fallo temporal se reintenta después.
    if (result.length > 0 || failures === 0) galleryCache.set(cacheKey, result);
    else console.warn(`[Atlas MX] No se pudo cargar la galería de “${placeName}”.`);
    return result;
  })().finally(() => pendingGalleries.delete(cacheKey));

  pendingGalleries.set(cacheKey, request);
  return request;
}

/** Obtiene la mejor fotografía real disponible del lugar. */
export async function fetchRealPhoto(placeName, fallbackUrl = '', options = {}) {
  if (!placeName) return fallbackUrl || PLACEHOLDER;
  const stateName = options?.stateName || '';
  const cacheKey = `${normalize(placeName)}|${normalize(stateName)}`;
  if (photoCache.has(cacheKey)) return photoCache.get(cacheKey);

  try {
    const gallery = await fetchRealPhotos(placeName, { stateName, limit: 4 });
    if (gallery[0]) {
      photoCache.set(cacheKey, gallery[0]);
      return gallery[0];
    }
  } catch (error) {
    console.warn(`[Atlas MX] No se pudo cargar foto real de “${placeName}”.`, error);
  }
  // Evitamos mostrar una foto stock incorrecta como si fuera el lugar real.
  return fallbackUrl || PLACEHOLDER;
}

export function getCachedPhoto(placeName, stateName = '') {
  if (!placeName) return null;
  return photoCache.get(`${normalize(placeName)}|${normalize(stateName)}`) || null;
}

export { PLACEHOLDER };
