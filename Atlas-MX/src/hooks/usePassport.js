import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'atlas-mx:passport:v1';

function readVisitedStates() {
  if (typeof localStorage === 'undefined') return [];
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export default function usePassport() {
  const [visitedStates, setVisitedStates] = useState(readVisitedStates);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visitedStates));
    } catch {
      // El pasaporte sigue disponible durante la sesión si el almacenamiento está bloqueado.
    }
  }, [visitedStates]);

  const isVisited = useCallback((stateCode) => visitedStates.includes(stateCode), [visitedStates]);
  const toggleVisited = useCallback((stateCode) => {
    setVisitedStates((current) => current.includes(stateCode)
      ? current.filter((code) => code !== stateCode)
      : [...current, stateCode]);
  }, []);

  return { visitedStates, isVisited, toggleVisited };
}
