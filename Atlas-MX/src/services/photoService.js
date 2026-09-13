/**
 * Atlas MX — fotos reales mediante Wikipedia y Wikimedia Commons.
 * No requiere API key. Las imágenes se resuelven en el navegador y se cachean en memoria.
 */
const photoCache = new Map();
const galleryCache = new Map();

const PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="700" viewBox="0 0 1000 700">
  <rect fill="#f4eee5" width="1000" height="700"/>
  <path d="M0 510L250 330l160 120 130-100 460 310v40H0z" fill="#d8cabb"/>
  <circle cx="785" cy="165" r="62" fill="#e4b65d" opacity=".65"/>
  <text x="500" y="625" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" fill="#715b49">Fotografía no disponible</text>
</svg>`);

const normalize = (value = '') => value.toLocaleLowerCase('es-MX').trim();

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function queryWikipediaImages(searchTerm, lang = 'es', limit = 5) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: searchTerm,
    gsrnamespace: '0',
    gsrlimit: String(Math.max(limit, 3)),
    prop: 'pageimages',
    piprop: 'thumbnail|original',
    pithumbsize: '1200',
    format: 'json',
    origin: '*'
  });
  const data = await fetchJson(`https://${lang}.wikipedia.org/w/api.php?${params}`);
  const pages = Object.values(data?.query?.pages || {});
  return pages
    .sort((a, b) => (a.index ?? 999) - (b.index ?? 999))
    .map((page) => page?.thumbnail?.source || page?.original?.source)
    .filter(Boolean)
    .slice(0, limit);
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

/** Obtiene una galería de fotografías reales relacionadas con el lugar. */
export async function fetchRealPhotos(placeName, options = {}) {
  const { stateName = '', limit = 5 } = options;
  if (!placeName) return [PLACEHOLDER];
  const cacheKey = `${normalize(placeName)}|${normalize(stateName)}|${limit}`;
  if (galleryCache.has(cacheKey)) return galleryCache.get(cacheKey);

  const broadQuery = stateName ? `${placeName} ${stateName} México` : `${placeName} México`;
  let urls = [];
  try {
    urls = uniqueUrls([
      ...(await queryWikipediaImages(placeName, 'es', Math.min(limit, 3))),
      ...(await queryWikipediaImages(broadQuery, 'es', Math.min(limit, 3))),
      ...(await queryCommonsImages(broadQuery, limit))
    ]);
    if (urls.length === 0) {
      urls = uniqueUrls([
        ...(await queryWikipediaImages(placeName, 'en', Math.min(limit, 3))),
        ...(await queryCommonsImages(placeName, limit))
      ]);
    }
  } catch (error) {
    console.warn(`[Atlas MX] No se pudo cargar la galería de “${placeName}”.`, error);
  }

  const result = urls.slice(0, limit);
  galleryCache.set(cacheKey, result);
  return result;
}

/** Obtiene la mejor fotografía real disponible del lugar. */
export async function fetchRealPhoto(placeName, fallbackUrl = '', options = {}) {
  if (!placeName) return fallbackUrl || PLACEHOLDER;
  const stateName = options?.stateName || '';
  const cacheKey = `${normalize(placeName)}|${normalize(stateName)}`;
  if (photoCache.has(cacheKey)) return photoCache.get(cacheKey);

  try {
    const gallery = await fetchRealPhotos(placeName, { stateName, limit: 4 });
    const result = gallery[0] || PLACEHOLDER;
    photoCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.warn(`[Atlas MX] No se pudo cargar foto real de “${placeName}”.`, error);
    // Evitamos mostrar una foto stock incorrecta como si fuera el lugar real.
    return PLACEHOLDER;
  }
}

export async function prefetchPhotos(items, stateName = '') {
  const results = new Map();
  await Promise.allSettled((items || []).map(async (item) => {
    const name = typeof item === 'string' ? item : item?.nombre;
    if (!name) return;
    results.set(name, await fetchRealPhoto(name, '', { stateName }));
  }));
  return results;
}

export function getCachedPhoto(placeName, stateName = '') {
  if (!placeName) return null;
  return photoCache.get(`${normalize(placeName)}|${normalize(stateName)}`) || null;
}

export { PLACEHOLDER };
