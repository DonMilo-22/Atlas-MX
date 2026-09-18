import React from 'react';
import { ArrowUpRight, MapPin, X } from 'lucide-react';

export default function MapPlacePreview({ place, onOpen, onClose }) {
  if (!place?.name) return null;

  const searchQuery = `${place.name}, ${place.stateName}, México`;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=m&z=12&output=embed&iwloc=near`;

  return (
    <aside className="map-place-preview" aria-live="polite" aria-label={`Vista previa de ${place.name} en Google Maps`}>
      <div className="map-place-preview-head">
        <div>
          <span className="map-place-preview-eyebrow"><MapPin size={11} /> Vista previa en Maps</span>
          <strong>{place.name}</strong>
          <small>{place.stateName} · {place.category}</small>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar vista previa"><X size={15} /></button>
      </div>
      <button type="button" className="map-place-preview-canvas" onClick={onOpen} aria-label={`Abrir ficha completa de ${place.name}`}>
        <iframe title={`Vista previa del mapa de ${place.name}`} src={embedUrl} loading="lazy" tabIndex="-1" />
        <span>Ver ubicación y fotografías <ArrowUpRight size={13} /></span>
      </button>
    </aside>
  );
}
