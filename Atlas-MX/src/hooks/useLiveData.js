import { useEffect, useState } from 'react';
import { fetchPlaceSummary } from '../services/wikiService';
import { fetchStateWeather, fetchWeatherAt } from '../services/weatherService';
import { locatePlace } from '../services/geoService';
import { fetchNearbyPlaces } from '../services/poiService';

// Patrón común: resultado asociado a su clave para no mostrar datos de otra consulta mientras carga.
function useAsync(key, loader) {
  const [state, setState] = useState({ key: null, value: null, error: false });
  useEffect(() => {
    if (!key) return undefined;
    let cancelled = false;
    loader()
      .then((value) => { if (!cancelled) setState({ key, value, error: false }); })
      .catch(() => { if (!cancelled) setState({ key, value: null, error: true }); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  if (!key) return { data: null, isLoading: false, error: false };
  if (state.key !== key) return { data: null, isLoading: true, error: false };
  return { data: state.value, isLoading: false, error: state.error };
}

/** Resumen real de Wikipedia de un lugar (o null si no hay una página relevante). */
export function useWikiSummary(placeName, stateName = '', enabled = true) {
  const key = enabled && placeName ? `${placeName}|${stateName}` : null;
  return useAsync(key, () => fetchPlaceSummary(placeName, stateName));
}

/** Clima en vivo de la capital del estado. */
export function useStateWeather(stateCode) {
  return useAsync(stateCode || null, () => fetchStateWeather(stateCode));
}

/** Ubicación real y validada de un lugar. */
export function useLocatePlace({ name, stateName, stateCode, coords, near }) {
  const key = name ? `${name}|${stateCode}|${coords ? `${coords.lat},${coords.lon}` : ''}|${near ? `${near.lat},${near.lon}` : ''}` : null;
  return useAsync(key, () => locatePlace({ name, stateName, stateCode, coords, near }));
}

/** Hoteles, restaurantes y atractivos reales cerca de un punto. */
export function useNearbyPlaces(location, attempt = 0) {
  const key = location ? `${location.lat.toFixed(4)},${location.lon.toFixed(4)},${location.precise ? 1500 : 3000},${attempt}` : null;
  return useAsync(key, () => fetchNearbyPlaces(location.lat, location.lon, location.precise ? 1500 : 3000));
}

/** Clima en vivo en un punto. */
export function useWeatherAt(location) {
  const key = location ? `${location.lat.toFixed(2)},${location.lon.toFixed(2)}` : null;
  return useAsync(key, () => fetchWeatherAt(location.lat, location.lon));
}
