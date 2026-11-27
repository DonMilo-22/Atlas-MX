/**
 * Atlas MX — fotos reales mediante Wikidata, Wikimedia Commons y Wikipedia.
 * No requiere API key. Las imágenes se resuelven en el navegador y se cachean en memoria.
 *
 * Regla: una foto que falta es mejor que una foto equivocada.
 * - Con un elemento de Wikidata (QID) o un archivo verificado, la galería sale SOLO de ese
 *   elemento: su imagen (P18) y los archivos de su propia categoría de Commons (P373).
 * - Sin datos verificados, solo vale la imagen principal de un artículo de Wikipedia cuyo
 *   título coincide exactamente con el lugar y cuyas coordenadas caen en el estado (y la
 *   galería del elemento de Wikidata de ese artículo), nunca una búsqueda de texto libre en Commons.
 */
import { commonsFileUrl, fetchWikidataEntity, isPageInState, isPhotoFile, isStrictMatch, wikiSearch } from './wikiService';
import { fetchWithTimeout } from './http.js';

const photoCache = new Map();
const galleryCache = new Map();
const PHOTO_WIDTH = 1280;

// Placeholder neutro en la paleta del sitio (sin texto, para no chocar con lo que va encima).
const PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="700" viewBox="0 0 1000 700">
  <rect fill="#E6EAE7" width="1000" height="700"/>
  <path d="M0 560L230 390l150 105 140-120 480 240v85H0z" fill="#D5DCD7"/>
  <path d="M0 640L300 500l220 110 180-80 300 110v60H0z" fill="#C9D1CB"/>
</svg>`);

const normalize = (value = '') => value.toLocaleLowerCase('es-MX').trim();
const fileKey = (name = '') => name.replace(/^(File|Archivo):/i, '').replace(/_/g, ' ').trim().toLocaleLowerCase('es-MX');
// Un archivo curado (P18 del conjunto verificado) se acepta salvo que sea un mapa, escudo o bandera.
const NOT_A_PLACE_IMAGE = /(mapa|map[_ .-]|locator|location|ubicaci|escudo|coat[_ ]of|flag|bandera|seal|sello|logo|emblem|satel|landsat|\bISS\d|\bESA\d|\.svg$|\.gif$)/i;
const isCuratedPhoto = (name = '') => Boolean(name) && !NOT_A_PLACE_IMAGE.test(name);

async function fetchJson(url) {
  const response = await fetchWithTimeout(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

/** Fotografías de una categoría de Commons (solo archivos de esa categoría, sin subcategorías). */
async function queryCommonsCategory(category, limit = 8) {
  if (!category) return [];
  const params = new URLSearchParams({
    action: 'query',
    generator: 'categorymembers',
    gcmtitle: `Category:${category.replace(/^(Category|Categoría):/i, '')}`,
    gcmtype: 'file',
    gcmlimit: String(Math.min(Math.max(limit * 4, 20), 50)),
    prop: 'imageinfo',
    iiprop: 'url|mime|size',
    iiurlwidth: String(PHOTO_WIDTH),
    format: 'json',
    origin: '*'
  });
  const data = await fetchJson(`https://commons.wikimedia.org/w/api.php?${params}`);
  return Object.values(data?.query?.pages || {})
    .map((page) => ({ file: (page.title || '').replace(/^File:/, ''), info: page?.imageinfo?.[0] }))
    .filter(({ file, info }) => info?.thumburl && /^image\/(jpeg|webp)$/i.test(info.mime || '') && isPhotoFile(file)
      && (info.width || 0) >= 640 && (info.height || 0) >= 400)
    // Primero las horizontales grandes: suelen ser vistas del lugar y no detalles.
    .sort((a, b) => (b.info.width >= b.info.height) - (a.info.width >= a.info.height) || b.info.width * b.info.height - a.info.width * a.info.height)
    .slice(0, limit)
    .map(({ file, info }) => ({ file, url: info.thumburl }));
}

function uniqueByFile(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = fileKey(item.file) || item.url;
    if (!item.url || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const pendingGalleries = new Map();
function cached(cacheKey, loader) {
  if (galleryCache.has(cacheKey)) return Promise.resolve(galleryCache.get(cacheKey));
  // Comparte la misma petición entre tarjetas que piden el mismo lugar al mismo tiempo.
  if (pendingGalleries.has(cacheKey)) return pendingGalleries.get(cacheKey);
  const request = loader().finally(() => pendingGalleries.delete(cacheKey));
  pendingGalleries.set(cacheKey, request);
  return request;
}

/**
 * Galería de un elemento verificado: el archivo dado, la(s) imagen(es) P18 del elemento y los
 * archivos de su categoría de Commons (P373). Nada de búsquedas de texto libre.
 * @param {{placeId?: string|null, image?: string|null, limit?: number}} options
 * @returns {Promise<string[]>} URLs de las fotos (la primera es `image` si se dio)
 */
export function fetchEntityPhotos({ placeId = null, image = null, limit = 6 } = {}) {
  if (!placeId && !image) return Promise.resolve([]);
  const cacheKey = `entity|${placeId || ''}|${fileKey(image || '')}|${limit}`;
  return cached(cacheKey, async () => {
    const items = [];
    if (isCuratedPhoto(image)) items.push({ file: image, url: commonsFileUrl(image, PHOTO_WIDTH) });
    let failed = false;
    if (placeId) {
      try {
        const entity = await fetchWikidataEntity(placeId);
        (entity?.images || []).filter(isCuratedPhoto).forEach((file) => items.push({ file, url: commonsFileUrl(file, PHOTO_WIDTH) }));
        if (entity?.commonsCategory && uniqueByFile(items).length < limit) items.push(...await queryCommonsCategory(entity.commonsCategory, limit));
      } catch {
        failed = true;
      }
    }
    const result = uniqueByFile(items).slice(0, limit).map((item) => item.url);
    // Un fallo temporal no se cachea (salvo que ya tengamos la foto verificada).
    if (!failed || result.length) galleryCache.set(cacheKey, result);
    return result;
  });
}

/** Imagen principal de una página de Wikipedia, solo si es una fotografía (no mapa, escudo, logo…). */
function pagePhoto(page) {
  if (!page?.thumbnail) return null;
  const file = page.image || decodeURIComponent(page.thumbnail.split('/').pop() || '').replace(/^\d+px-/, '');
  return isPhotoFile(file) ? { file, url: page.thumbnail } : null;
}

/**
 * Búsqueda por nombre (sin datos verificados): la foto del artículo de Wikipedia cuyo título
 * es exactamente el del lugar y, si ese artículo tiene elemento de Wikidata, su galería.
 */
async function fetchPhotosByName(placeName, stateName, limit) {
  const broadQuery = stateName ? `${placeName} ${stateName} México` : `${placeName} México`;
  const settled = await Promise.allSettled([wikiSearch(broadQuery, 'es', 5), wikiSearch(placeName, 'es', 5)]);
  const failures = settled.filter((item) => item.status === 'rejected').length;
  const pages = settled.flatMap((item) => (item.status === 'fulfilled' ? item.value : []));
  // Título exacto + coordenadas dentro del estado: así un homónimo (la bebida "Tequila", otro
  // "Santiago") nunca aporta la foto.
  const page = pages.find((item) => isStrictMatch(item, placeName, stateName, { municipality: true }) && isPageInState(item, stateName));
  if (!page) return { urls: [], failed: failures === settled.length };
  const items = [];
  const main = pagePhoto(page);
  if (main) items.push(main);
  let failed = false;
  // Para una sola foto (tarjetas) basta la del artículo: no se consulta la galería.
  if (page.qid && items.length < limit) {
    try {
      const entity = await fetchWikidataEntity(page.qid);
      (entity?.images || []).filter((file) => isPhotoFile(file)).forEach((file) => items.push({ file, url: commonsFileUrl(file, PHOTO_WIDTH) }));
      if (entity?.commonsCategory && uniqueByFile(items).length < limit) items.push(...await queryCommonsCategory(entity.commonsCategory, limit));
    } catch {
      failed = true;
    }
  }
  // Si falló la galería del elemento se devuelve lo que hay, pero no se cachea (se reintenta).
  return { urls: uniqueByFile(items).slice(0, limit).map((item) => item.url), failed };
}

/**
 * Obtiene una galería de fotografías reales del lugar.
 * @param {string} placeName
 * @param {{stateName?: string, limit?: number, placeId?: string|null, image?: string|null}} options
 */
export async function fetchRealPhotos(placeName, options = {}) {
  const { stateName = '', limit = 5, placeId = null, image = null } = options;
  if (placeId || image) return fetchEntityPhotos({ placeId, image, limit });
  if (!placeName) return [];
  const cacheKey = `name|${normalize(placeName)}|${normalize(stateName)}|${limit}`;
  return cached(cacheKey, async () => {
    const { urls, failed } = await fetchPhotosByName(placeName, stateName, limit);
    // Solo se cachea si la red respondió: un fallo temporal se reintenta después.
    if (!failed) galleryCache.set(cacheKey, urls);
    else if (!urls.length) console.warn(`[Atlas MX] No se pudo cargar la galería de “${placeName}”.`);
    return urls;
  });
}

const photoKey = (placeName, stateName, image) => (image ? `file|${fileKey(image)}` : `${normalize(placeName)}|${normalize(stateName)}`);

/**
 * Obtiene la mejor fotografía real disponible del lugar.
 * @param {string} placeName
 * @param {string} fallbackUrl
 * @param {{stateName?: string, image?: string|null, placeId?: string|null}} options
 */
export async function fetchRealPhoto(placeName, fallbackUrl = '', options = {}) {
  const { stateName = '', image = null, placeId = null } = options || {};
  // Archivo verificado: se usa tal cual, sin ninguna consulta.
  if (isCuratedPhoto(image)) {
    const url = commonsFileUrl(image, PHOTO_WIDTH);
    photoCache.set(photoKey(placeName, stateName, image), url);
    return url;
  }
  if (!placeName && !placeId) return fallbackUrl || PLACEHOLDER;
  const cacheKey = placeId ? `qid|${placeId}` : photoKey(placeName, stateName);
  if (photoCache.has(cacheKey)) return photoCache.get(cacheKey);

  try {
    const gallery = await fetchRealPhotos(placeName, { stateName, limit: 1, placeId });
    if (gallery[0]) {
      photoCache.set(cacheKey, gallery[0]);
      return gallery[0];
    }
  } catch (error) {
    console.warn(`[Atlas MX] No se pudo cargar foto real de “${placeName}”.`, error);
  }
  // Evitamos mostrar una foto incorrecta como si fuera el lugar real.
  return fallbackUrl || PLACEHOLDER;
}

export function getCachedPhoto(placeName, stateName = '', options = {}) {
  const { image = null, placeId = null } = options || {};
  if (isCuratedPhoto(image)) return commonsFileUrl(image, PHOTO_WIDTH);
  if (placeId) return photoCache.get(`qid|${placeId}`) || null;
  if (!placeName) return null;
  return photoCache.get(photoKey(placeName, stateName)) || null;
}

export { PLACEHOLDER };
