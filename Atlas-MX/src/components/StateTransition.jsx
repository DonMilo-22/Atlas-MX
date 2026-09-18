import React, { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import RealPhoto from './RealPhoto';

export default function StateTransition({ state, onDone }) {
  useEffect(() => {
    if (!state) return undefined;
    const timer = window.setTimeout(() => onDone?.(), 1250);
    return () => window.clearTimeout(timer);
  }, [state, onDone]);
  if (!state) return null;

  return <div className="state-cinematic-transition" aria-live="polite" aria-label={`Explorando ${state.nombre}`}>
    <RealPhoto name={state.nombre} stateName="México" alt={`Paisaje de ${state.nombre}`} />
    <div className="state-cinematic-shade" />
    <div className="state-cinematic-copy"><span>Atlas MX presenta</span><h2>{state.nombre}</h2><p><MapPin size={14} /> Capital: {state.capital}</p><i /></div>
    <div className="state-cinematic-wipe" />
  </div>;
}
