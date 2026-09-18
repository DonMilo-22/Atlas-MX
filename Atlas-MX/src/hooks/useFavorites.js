import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'atlas-mx:favorites:v1';

function readFavorites() {
  if (typeof localStorage === 'undefined') return [];
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export default function useFavorites() {
  const [favorites, setFavorites] = useState(readFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // La experiencia principal sigue funcionando aunque el navegador bloquee el almacenamiento.
    }
  }, [favorites]);

  const isFavorite = useCallback((id) => favorites.some((favorite) => favorite.id === id), [favorites]);
  const toggleFavorite = useCallback((place) => {
    setFavorites((current) => current.some((favorite) => favorite.id === place.id)
      ? current.filter((favorite) => favorite.id !== place.id)
      : [{ ...place, addedAt: Date.now() }, ...current]);
  }, []);

  return { favorites, isFavorite, toggleFavorite };
}
