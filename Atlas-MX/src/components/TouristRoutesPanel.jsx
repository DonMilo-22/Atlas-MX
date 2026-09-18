import React from 'react';
import { Clock3, MapPin, Route, X } from 'lucide-react';
import { estado as getEstadoByCve } from '@webrek/mx-geo';
import { TOURIST_ROUTES } from '../data/touristRoutes';

export default function TouristRoutesPanel({ activeRoute, onSelectRoute, onSelectState, onClose }) {
  if (!activeRoute) return null;

  return (
    <section className="tourist-routes-panel" aria-label="Rutas turísticas temáticas">
      <header className="routes-panel-head">
        <div><span><Route size={12} /> Rutas Atlas MX</span><strong>Recorre México por historias</strong></div>
        <button type="button" onClick={onClose} aria-label="Cerrar rutas turísticas"><X size={17} /></button>
      </header>
      <div className="routes-selector" role="tablist" aria-label="Seleccionar ruta">
        {TOURIST_ROUTES.map((route) => <button key={route.id} type="button" className={activeRoute.id === route.id ? 'active' : ''} onClick={() => onSelectRoute?.(route)} role="tab" aria-selected={activeRoute.id === route.id}>{route.name}</button>)}
      </div>
      <div className="route-summary">
        <div className="route-summary-title"><div><span>{activeRoute.theme}</span><h3>{activeRoute.name}</h3></div><span className="route-duration"><Clock3 size={12} /> {activeRoute.duration}</span></div>
        <p>{activeRoute.summary}</p>
        <div className="route-stops">
          {activeRoute.stateCodes.map((code, index) => {
            const state = getEstadoByCve(code);
            return <button key={code} type="button" onClick={() => state && onSelectState?.(state)}><b>{index + 1}</b><span><strong>{activeRoute.stops[index]}</strong><small><MapPin size={10} /> {state?.nombre || 'México'}</small></span></button>;
          })}
        </div>
      </div>
    </section>
  );
}
