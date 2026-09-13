import { useState, useEffect } from 'react';
import { fetchRealPhoto, getCachedPhoto, PLACEHOLDER } from '../services/photoService';

/**
 * Hook de React para obtener la foto real de un lugar desde Wikipedia.
 * Maneja carga, cache y fallback automáticamente.
 * 
 * @param {string} placeName - Nombre del lugar
 * @param {string} fallbackUrl - URL de fallback mientras carga o si falla
 * @returns {{ photoUrl: string, isLoading: boolean }}
 */
export function useRealPhoto(placeName, fallbackUrl = '') {
  const [photoUrl, setPhotoUrl] = useState(() => {
    // Intentar obtener del cache primero (render síncrono)
    const cached = getCachedPhoto(placeName);
    return cached || fallbackUrl || PLACEHOLDER;
  });
  const [isLoading, setIsLoading] = useState(() => !getCachedPhoto(placeName));

  useEffect(() => {
    if (!placeName) {
      setPhotoUrl(fallbackUrl || PLACEHOLDER);
      setIsLoading(false);
      return;
    }

    // Si ya está en cache, usar directamente
    const cached = getCachedPhoto(placeName);
    if (cached) {
      setPhotoUrl(cached);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    fetchRealPhoto(placeName, fallbackUrl).then((url) => {
      if (!cancelled) {
        setPhotoUrl(url);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [placeName, fallbackUrl]);

  return { photoUrl, isLoading };
}

/**
 * Hook que pre-carga fotos para una lista de items y devuelve un Map de resultados.
 * Útil para pre-cargar todas las fotos de una pestaña al mismo tiempo.
 * 
 * @param {Array} items - Lista de objetos con propiedad `nombre`
 * @returns {{ photos: Map<string, string>, isLoading: boolean }}
 */
export function useRealPhotoBatch(items) {
  const [photos, setPhotos] = useState(new Map());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!items || items.length === 0) {
      setPhotos(new Map());
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    const fetchAll = async () => {
      const results = new Map();
      const promises = items.map(async (item) => {
        const name = typeof item === 'string' ? item : item.nombre;
        if (!name) return;
        try {
          const url = await fetchRealPhoto(name, item.imagen || '');
          results.set(name, url);
        } catch {
          results.set(name, item.imagen || PLACEHOLDER);
        }
      });
      await Promise.allSettled(promises);
      if (!cancelled) {
        setPhotos(results);
        setIsLoading(false);
      }
    };

    fetchAll();

    return () => {
      cancelled = true;
    };
  }, [items]);

  return { photos, isLoading };
}
