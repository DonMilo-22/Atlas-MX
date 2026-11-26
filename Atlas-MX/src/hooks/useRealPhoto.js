import { useEffect, useState } from 'react';
import { fetchEntityPhotos, fetchRealPhoto, fetchRealPhotos, getCachedPhoto, PLACEHOLDER } from '../services/photoService';

/**
 * Foto principal de un lugar.
 * @param {string} placeName
 * @param {string} [fallbackUrl]
 * @param {string} [stateName]
 * @param {{image?: string|null, placeId?: string|null}} [options] datos verificados (archivo de Commons / QID)
 */
export function useRealPhoto(placeName, fallbackUrl = '', stateName = '', options = {}) {
  const image = options?.image || null;
  const placeId = options?.placeId || null;
  const cached = getCachedPhoto(placeName, stateName, { image, placeId });
  const [result, setResult] = useState({ key: '', url: '' });
  const key = `${placeName}|${stateName}|${placeId || ''}|${image || ''}`;
  const hasSubject = Boolean(placeName || placeId || image);

  useEffect(() => {
    if (!hasSubject || getCachedPhoto(placeName, stateName, { image, placeId })) return undefined;
    let cancelled = false;
    fetchRealPhoto(placeName, fallbackUrl, { stateName, image, placeId }).then((url) => {
      if (!cancelled) setResult({ key, url: url || PLACEHOLDER });
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, fallbackUrl]);

  // Nunca se muestra la foto de otro lugar mientras carga la nueva.
  if (!hasSubject) return { photoUrl: fallbackUrl || PLACEHOLDER, isLoading: false };
  if (cached) return { photoUrl: cached, isLoading: false };
  if (result.key === key) return { photoUrl: result.url, isLoading: false };
  return { photoUrl: fallbackUrl || PLACEHOLDER, isLoading: true };
}

function useGallery(key, loader) {
  const [result, setResult] = useState({ key: '', photos: [] });
  useEffect(() => {
    if (!key) return undefined;
    let cancelled = false;
    loader()
      .then((urls) => { if (!cancelled) setResult({ key, photos: urls }); })
      .catch(() => { if (!cancelled) setResult({ key, photos: [] }); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  if (!key) return { photos: [], isLoading: false };
  if (result.key !== key) return { photos: [], isLoading: true };
  return { photos: result.photos, isLoading: false };
}

/**
 * Galería de un elemento verificado: `image` primero, luego P18 y la categoría de Commons (P373)
 * del elemento de Wikidata. Sin búsquedas de texto libre.
 * @returns {{photos: string[], isLoading: boolean}}
 */
export function useEntityGallery(placeId, image = null, limit = 6) {
  const key = placeId || image ? `entity|${placeId || ''}|${image || ''}|${limit}` : null;
  return useGallery(key, () => fetchEntityPhotos({ placeId, image, limit }));
}

/**
 * Galería de un lugar. Con `options.placeId` / `options.image` usa solo las fuentes del propio
 * elemento; sin ellos, el artículo de Wikipedia cuyo título coincide exactamente con el lugar.
 * @returns {{photos: string[], isLoading: boolean}}
 */
export function useRealPhotoGallery(placeName, stateName = '', limit = 5, options = {}) {
  const placeId = options?.placeId || null;
  const image = options?.image || null;
  const key = placeName || placeId || image ? `${placeName}|${stateName}|${limit}|${placeId || ''}|${image || ''}` : null;
  return useGallery(key, () => fetchRealPhotos(placeName, { stateName, limit, placeId, image }));
}
