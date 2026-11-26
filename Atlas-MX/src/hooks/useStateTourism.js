import { useEffect, useState } from 'react';
import { loadStateTourism } from '../data/tourism';

/** Datos turísticos verificados de un estado (se cargan bajo demanda, un archivo por estado). */
export default function useStateTourism(cve) {
  const [state, setState] = useState({ cve: null, data: null, error: false });
  useEffect(() => {
    if (!cve) return undefined;
    let cancelled = false;
    loadStateTourism(cve)
      .then((data) => { if (!cancelled) setState({ cve, data, error: !data }); })
      .catch(() => { if (!cancelled) setState({ cve, data: null, error: true }); });
    return () => { cancelled = true; };
  }, [cve]);
  if (!cve) return { data: null, isLoading: false, error: false };
  if (state.cve !== cve) return { data: null, isLoading: true, error: false };
  return { data: state.data, isLoading: false, error: state.error };
}
