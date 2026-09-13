/**
 * Atlas MX — Servicio de Fotos Reales
 * Obtiene imágenes auténticas de Wikipedia/Wikimedia Commons API
 * sin necesidad de API key. Incluye caché en memoria y fallback.
 */

// Cache en memoria para evitar re-fetches
const photoCache = new Map();

// Placeholder cálido mexicano mientras carga
const PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect fill="#f4eee5" width="800" height="600"/>
  <text x="400" y="290" text-anchor="middle" font-family="serif" font-size="18" fill="#b59f88">Cargando foto...</text>
  <circle cx="400" cy="250" r="30" fill="none" stroke="#006847" stroke-width="2" opacity="0.4"/>
  <path d="M388 250 L400 235 L412 250 L406 250 L406 265 L394 265 L394 250 Z" fill="#006847" opacity="0.3"/>
</svg>`);

/**
 * Obtiene la foto real de un lugar desde la Wikipedia en español.
 * Si no la encuentra, busca en Wikipedia en inglés.
 * Devuelve la URL de la miniatura en alta resolución.
 * 
 * @param {string} placeName - Nombre del lugar (ej: "Chichén Itzá")
 * @param {string} fallbackUrl - URL de fallback si no se encuentra foto
 * @returns {Promise<string>} URL de la foto real
 */
export async function fetchRealPhoto(placeName, fallbackUrl = '') {
  if (!placeName) return fallbackUrl || PLACEHOLDER;

  // Revisar cache primero
  const cacheKey = placeName.toLowerCase().trim();
  if (photoCache.has(cacheKey)) {
    return photoCache.get(cacheKey);
  }

  try {
    // Intentar primero con Wikipedia en español
    let photoUrl = await queryWikipediaImage(placeName, 'es');
    
    if (!photoUrl) {
      // Fallback: Wikipedia en inglés
      photoUrl = await queryWikipediaImage(placeName, 'en');
    }

    if (!photoUrl) {
      // Fallback: búsqueda en Wikimedia Commons
      photoUrl = await queryCommonsImage(placeName);
    }

    const result = photoUrl || fallbackUrl || PLACEHOLDER;
    photoCache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.warn(`[PhotoService] Error fetching photo for "${placeName}":`, err);
    const result = fallbackUrl || PLACEHOLDER;
    photoCache.set(cacheKey, result);
    return result;
  }
}

/**
 * Consulta la API de Wikipedia para obtener la imagen principal del artículo.
 */
async function queryWikipediaImage(title, lang = 'es') {
  const apiUrl = `https://${lang}.wikipedia.org/w/api.php?` + new URLSearchParams({
    action: 'query',
    titles: title,
    prop: 'pageimages',
    format: 'json',
    pithumbsize: '800',
    origin: '*'
  });

  const res = await fetch(apiUrl);
  if (!res.ok) return null;

  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) return null;

  for (const pageId of Object.keys(pages)) {
    if (pageId === '-1') continue;
    const thumb = pages[pageId]?.thumbnail?.source;
    if (thumb) return thumb;
  }
  return null;
}

/**
 * Búsqueda en Wikimedia Commons para fotos de lugares.
 */
async function queryCommonsImage(searchTerm) {
  const apiUrl = `https://commons.wikimedia.org/w/api.php?` + new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: `${searchTerm} Mexico`,
    gsrlimit: '3',
    prop: 'imageinfo',
    iiprop: 'url|size',
    iiurlwidth: '800',
    format: 'json',
    origin: '*'
  });

  const res = await fetch(apiUrl);
  if (!res.ok) return null;

  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) return null;

  // Buscar la primera imagen válida (no SVG, con tamaño razonable)
  for (const pageId of Object.keys(pages)) {
    const info = pages[pageId]?.imageinfo?.[0];
    if (info && info.thumburl && info.width > 200) {
      return info.thumburl;
    }
  }
  return null;
}

/**
 * Pre-carga un lote de fotos en paralelo (útil al seleccionar un estado).
 * @param {Array<{nombre: string}>} items - Lista de destinos/platillos/etc.
 * @returns {Promise<Map<string, string>>} Map nombre → URL foto real
 */
export async function prefetchPhotos(items) {
  const results = new Map();
  if (!items || items.length === 0) return results;

  const promises = items.map(async (item) => {
    const name = typeof item === 'string' ? item : item.nombre;
    const url = await fetchRealPhoto(name);
    results.set(name, url);
  });

  await Promise.allSettled(promises);
  return results;
}

/**
 * Obtiene la URL de la foto desde el cache sin hacer fetch.
 * Retorna null si no está cacheada.
 */
export function getCachedPhoto(placeName) {
  if (!placeName) return null;
  return photoCache.get(placeName.toLowerCase().trim()) || null;
}

export { PLACEHOLDER };
