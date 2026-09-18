import React, { useEffect, useMemo, useState } from 'react';
import { Building2, CloudSun, ExternalLink, Image as ImageIcon, Info, MapPin, Navigation, Search, X, ZoomIn } from 'lucide-react';
import { getMunicipalityDetails, getPlaceDetails } from '../data/placesData';
import { useRealPhotoGallery } from '../hooks/useRealPhoto';
import { PLACEHOLDER } from '../services/photoService';
import PhotoLightbox from './PhotoLightbox';

export default function GoogleMapsModalV2({ isOpen, onClose, placeName, stateName, category }) {
  const details = useMemo(() => {
    if (!placeName) return {};
    return category === 'Municipio'
      ? getMunicipalityDetails(placeName, stateName)
      : getPlaceDetails(placeName, stateName, category);
  }, [placeName, stateName, category]);

  const { photos, isLoading } = useRealPhotoGallery(placeName, stateName, 6);
  const [activePhoto, setActivePhoto] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    setActivePhoto(photos[0] || '');
  }, [placeName, stateName, photos]);

  if (!isOpen || !placeName) return null;

  const searchQuery = `${placeName}${stateName ? `, ${stateName}` : ''}, México`;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=m&z=13&output=embed&iwloc=near`;
  const directMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;
  const hotelsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`hoteles cerca de ${searchQuery}`)}`;
  const weatherUrl = `https://www.google.com/search?q=${encodeURIComponent(`clima ${searchQuery}`)}`;
  const webUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  const visiblePhoto = activePhoto || photos[0] || PLACEHOLDER;

  const open = (url) => window.open(url, '_blank', 'noopener,noreferrer');

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Información de ${placeName}`}>
      <div className="modal-dialog gmaps-view-dialog" onClick={(event) => event.stopPropagation()}>
        <div className="gmaps-topbar">
          <div className="gmaps-topbar-breadcrumb"><MapPin size={15} color="var(--mexico-green)" /><span>{stateName ? `${stateName} › ` : ''}<strong>{placeName}</strong></span></div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Cerrar vista de mapa"><X size={20} /></button>
        </div>

        <div className="gmaps-split-container">
          <aside className="gmaps-info-sidebar">
            <div className="gmaps-hero-media" onClick={() => photos.length && setLightboxIndex(Math.max(0, photos.indexOf(visiblePhoto)))} role={photos.length ? 'button' : undefined} tabIndex={photos.length ? 0 : undefined} onKeyDown={(event) => { if (photos.length && (event.key === 'Enter' || event.key === ' ')) setLightboxIndex(Math.max(0, photos.indexOf(visiblePhoto))); }}>
              <img src={visiblePhoto} alt={`${placeName}, ${stateName}`} className="gmaps-hero-img" onError={(event) => { event.currentTarget.src = PLACEHOLDER; }} />
              <div className="gmaps-hero-overlay"><span className="gmaps-category-chip">{details.categoria || category || 'Lugar'}</span></div>
              {isLoading && <span style={{ position: 'absolute', left: 12, bottom: 12, padding: '4px 8px', borderRadius: 999, background: 'rgba(0,0,0,.55)', color: '#fff', fontSize: '0.7rem' }}>Buscando fotos reales…</span>}
              {photos.length > 0 && <span className="gmaps-expand-photo"><ZoomIn size={13} /> Ver galería</span>}
            </div>

            <div className="gmaps-sidebar-body">
              <div className="gmaps-title-section">
                <h2 className="gmaps-place-title">{placeName}</h2>
                <div className="gmaps-location-sub"><MapPin size={13} /><span>{stateName ? `${stateName}, ` : ''}México</span></div>
                <div style={{ marginTop: 6, fontSize: '0.7rem', color: 'var(--text-dim)' }}>Fotos: Wikipedia / Wikimedia Commons · mapa y servicios: Google Maps</div>
              </div>

              <div className="gmaps-actions-row" style={{ flexWrap: 'wrap' }}>
                <button type="button" className="gmaps-action-button primary" onClick={() => open(directMapsUrl)}><Navigation size={14} /><span>Abrir Maps</span></button>
                <button type="button" className="gmaps-action-button secondary" onClick={() => open(hotelsUrl)}><Building2 size={14} /><span>Hoteles</span></button>
                <button type="button" className="gmaps-action-button secondary" onClick={() => open(weatherUrl)}><CloudSun size={14} /><span>Clima</span></button>
                <button type="button" className="gmaps-action-button secondary" onClick={() => open(webUrl)}><Search size={14} /><span>Buscar</span></button>
              </div>

              {photos.length > 0 && <div className="gmaps-gallery-section">
                <div className="gmaps-section-label"><ImageIcon size={13} /><span>Fotografías reales</span></div>
                <div className="gmaps-thumbs-strip">
                  {photos.map((photo, index) => <button key={photo} type="button" className={`gmaps-thumb-btn ${visiblePhoto === photo ? 'active' : ''}`} onClick={() => { setActivePhoto(photo); setLightboxIndex(index); }} title={`Ampliar foto ${index + 1} de ${placeName}`}><img src={photo} alt={`Foto ${index + 1} de ${placeName}`} loading="lazy" /></button>)}
                </div>
              </div>}

              <div className="gmaps-info-card">
                <div className="gmaps-section-label"><Info size={13} /><span>Acerca de este lugar</span></div>
                <p className="gmaps-description-text">{details.descripcion || `${placeName} es un punto de interés de ${stateName || 'México'}. Usa Google Maps para consultar información actualizada, horarios, hoteles y servicios cercanos.`}</p>
              </div>

              {details.historia && <div className="gmaps-info-card"><div className="gmaps-section-label"><span>Historia y patrimonio</span></div><p className="gmaps-description-text">{details.historia}</p></div>}

              <button type="button" className="gmaps-action-button secondary" onClick={() => open(directMapsUrl)} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}><ExternalLink size={14} /><span>Ver ficha actualizada en Google Maps</span></button>
            </div>
          </aside>

          <main className="gmaps-map-canvas">
            <iframe title={`Mapa de ${placeName}`} width="100%" height="100%" src={embedUrl} style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </main>
        </div>
      </div>
      {lightboxIndex !== null && <PhotoLightbox photos={photos} initialIndex={lightboxIndex} placeName={placeName} onClose={() => setLightboxIndex(null)} />}
    </div>
  );
}
