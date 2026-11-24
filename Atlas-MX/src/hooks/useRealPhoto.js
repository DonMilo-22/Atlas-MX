import { useEffect, useState } from 'react';
import { fetchRealPhoto, fetchRealPhotos, getCachedPhoto, PLACEHOLDER } from '../services/photoService';

export function useRealPhoto(placeName, fallbackUrl = '', stateName = '') {
  const cached = getCachedPhoto(placeName, stateName);
  const [result, setResult] = useState({ key: '', url: '' });
  const key = `${placeName}|${stateName}`;

  useEffect(() => {
    if (!placeName || getCachedPhoto(placeName, stateName)) return undefined;
    let cancelled = false;
    fetchRealPhoto(placeName, fallbackUrl, { stateName }).then((url) => {
      if (!cancelled) setResult({ key, url: url || PLACEHOLDER });
    });
    return () => { cancelled = true; };
  }, [key, placeName, fallbackUrl, stateName]);

  // Nunca se muestra la foto de otro lugar mientras carga la nueva.
  if (!placeName) return { photoUrl: fallbackUrl || PLACEHOLDER, isLoading: false };
  if (cached) return { photoUrl: cached, isLoading: false };
  if (result.key === key) return { photoUrl: result.url, isLoading: false };
  return { photoUrl: fallbackUrl || PLACEHOLDER, isLoading: true };
}

export function useRealPhotoGallery(placeName, stateName = '', limit = 5) {
  const key = `${placeName}|${stateName}|${limit}`;
  const [result, setResult] = useState({ key: '', photos: [] });

  useEffect(() => {
    if (!placeName) return undefined;
    let cancelled = false;
    fetchRealPhotos(placeName, { stateName, limit })
      .then((urls) => { if (!cancelled) setResult({ key, photos: urls }); })
      .catch(() => { if (!cancelled) setResult({ key, photos: [] }); });
    return () => { cancelled = true; };
  }, [key, placeName, stateName, limit]);

  if (!placeName) return { photos: [], isLoading: false };
  if (result.key !== key) return { photos: [], isLoading: true };
  return { photos: result.photos, isLoading: false };
}
