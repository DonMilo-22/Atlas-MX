import { useEffect, useMemo, useState } from 'react';
import { fetchRealPhoto, fetchRealPhotos, getCachedPhoto, PLACEHOLDER } from '../services/photoService';

export function useRealPhoto(placeName, fallbackUrl = '', stateName = '') {
  const cached = getCachedPhoto(placeName, stateName);
  const [photoUrl, setPhotoUrl] = useState(cached || fallbackUrl || PLACEHOLDER);
  const [isLoading, setIsLoading] = useState(!cached);

  useEffect(() => {
    let cancelled = false;
    const existing = getCachedPhoto(placeName, stateName);
    if (existing) {
      setPhotoUrl(existing);
      setIsLoading(false);
      return undefined;
    }
    if (!placeName) {
      setPhotoUrl(fallbackUrl || PLACEHOLDER);
      setIsLoading(false);
      return undefined;
    }
    setIsLoading(true);
    fetchRealPhoto(placeName, fallbackUrl, { stateName }).then((url) => {
      if (!cancelled) {
        setPhotoUrl(url || PLACEHOLDER);
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [placeName, fallbackUrl, stateName]);

  return { photoUrl, isLoading };
}

export function useRealPhotoGallery(placeName, stateName = '', limit = 5) {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(placeName));
  useEffect(() => {
    let cancelled = false;
    if (!placeName) {
      setPhotos([]);
      setIsLoading(false);
      return undefined;
    }
    setIsLoading(true);
    fetchRealPhotos(placeName, { stateName, limit }).then((urls) => {
      if (!cancelled) {
        setPhotos(urls);
        setIsLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setPhotos([]);
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [placeName, stateName, limit]);
  return { photos, isLoading };
}

export function useRealPhotoBatch(items, stateName = '') {
  const stableNames = useMemo(() => (items || []).map((item) => typeof item === 'string' ? item : item?.nombre).filter(Boolean), [items]);
  const [photos, setPhotos] = useState(new Map());
  const [isLoading, setIsLoading] = useState(stableNames.length > 0);
  useEffect(() => {
    let cancelled = false;
    if (!stableNames.length) {
      setPhotos(new Map());
      setIsLoading(false);
      return undefined;
    }
    setIsLoading(true);
    Promise.all(stableNames.map(async (name) => [name, await fetchRealPhoto(name, '', { stateName })])).then((entries) => {
      if (!cancelled) {
        setPhotos(new Map(entries));
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [stableNames.join('|'), stateName]);
  return { photos, isLoading };
}
