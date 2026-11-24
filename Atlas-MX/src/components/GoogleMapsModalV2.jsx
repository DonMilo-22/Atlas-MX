import React, { useEffect, useMemo, useState } from 'react';
import { Building2, CloudSun, Image as ImageIcon, Info, MapPin, Navigation, Search, X, ZoomIn } from 'lucide-react';
import { getPlaceDetails } from '../data/placesData';
import { findPlace } from '../data/tourismIndex';
import { getCategoryLabel } from '../data/tourismCategories';
import { useRealPhotoGallery } from '../hooks/useRealPhoto';
import useDialog from '../hooks/useDialog';
import { PLACEHOLDER } from '../services/photoService';
import PhotoLightbox from './PhotoLightbox';
import WikiSummary from './WikiSummary';

export default function GoogleMapsModalV2({ isOpen, onClose, placeName, stateName, category }) {
  const categoryLabel = getCategoryLabel(category);
  const details = useMemo(() => {
    if (!placeName) return {};
    const known = findPlace(placeName, stateName);
    return getPlaceDetails(placeName, stateName, categoryLabel, known?.description);
  }, [placeName, stateName, categoryLabel]);

  const { photos, isLoading } = useRealPhotoGallery(placeName, stateName, 6);
  const [activePhoto, setActivePhoto] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const ref = useDialog(isOpen, onClose);

  useEffect(() => {
    setActivePhoto('');
    setLightboxIndex(null);
    setMapLoaded(false);
  }, [placeName, stateName]);

  if (!isOpen || !placeName) return null;

  const searchQuery = `${placeName}${stateName ? `, ${stateName}` : ''}, México`;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=m&z=13&output=embed&iwloc=near`;
  const directMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;
  const hotelsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`hoteles cerca de ${searchQuery}`)}`;
  const weatherUrl = `https://www.google.com/search?q=${encodeURIComponent(`clima ${searchQuery}`)}`;
  const webUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  const visiblePhoto = (activePhoto && photos.includes(activePhoto) ? activePhoto : photos[0]) || PLACEHOLDER;
  const openGallery = () => { if (photos.length) setLightboxIndex(Math.max(0, photos.indexOf(visiblePhoto))); };

  return (
    <div className="modal-backdrop gmaps-backdrop" onClick={onClose}>
      <div className="modal-dialog gmaps-view-dialog" ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="gmaps-title" onClick={(event) => event.stopPropagation()}>
        <div className="gmaps-topbar">
          <div className="gmaps-topbar-breadcrumb"><MapPin size={15} color="var(--mexico-green)" aria-hidden="true" /><span>{stateName ? `${stateName} › ` : ''}<strong>{placeName}</strong></span></div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Cerrar ficha del lugar"><X size={20} /></button>
        </div>

        <div className="gmaps-split-container">
          <aside className="gmaps-info-sidebar">
            <div className={`gmaps-hero-media ${isLoading ? 'is-loading' : ''}`} onClick={openGallery} role={photos.length ? 'button' : undefined} tabIndex={photos.length ? 0 : undefined} aria-label={photos.length ? `Abrir galería de ${placeName}` : undefined} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openGallery(); } }}>
              <img src={visiblePhoto} alt={photos.length ? `${placeName}, ${stateName}` : 'Fotografía no disponible'} className="gmaps-hero-img" onError={(event) => { event.currentTarget.src = PLACEHOLDER; }} />
              <div className="gmaps-hero-overlay"><span className="gmaps-category-chip">{details.categoria || 'Lugar'}</span></div>
              {isLoading && <span className="gmaps-photo-status" role="status">Buscando fotos reales…</span>}
              {photos.length > 0 && <span className="gmaps-expand-photo"><ZoomIn size={13} /> Ver galería</span>}
            </div>

            <div className="gmaps-sidebar-body">
              <div className="gmaps-title-section">
                <h2 className="gmaps-place-title" id="gmaps-title">{placeName}</h2>
                <div className="gmaps-location-sub"><MapPin size={13} aria-hidden="true" /><span>{stateName ? `${stateName}, ` : ''}México</span></div>
              </div>

              <div className="gmaps-actions-row">
                <a className="gmaps-action-button primary" href={directMapsUrl} target="_blank" rel="noopener noreferrer"><Navigation size={14} /><span>Abrir en Google Maps</span></a>
                <a className="gmaps-action-button secondary" href={hotelsUrl} target="_blank" rel="noopener noreferrer"><Building2 size={14} /><span>Hoteles</span></a>
                <a className="gmaps-action-button secondary" href={weatherUrl} target="_blank" rel="noopener noreferrer"><CloudSun size={14} /><span>Clima</span></a>
                <a className="gmaps-action-button secondary" href={webUrl} target="_blank" rel="noopener noreferrer"><Search size={14} /><span>Buscar</span></a>
              </div>

              {photos.length > 1 && <div className="gmaps-gallery-section">
                <div className="gmaps-section-label"><ImageIcon size={13} /><span>Fotografías reales</span></div>
                <div className="gmaps-thumbs-strip">
                  {photos.map((photo, index) => <button key={photo} type="button" className={`gmaps-thumb-btn ${visiblePhoto === photo ? 'active' : ''}`} onClick={() => { setActivePhoto(photo); setLightboxIndex(index); }} aria-label={`Ampliar foto ${index + 1} de ${placeName}`}><img src={photo} alt="" loading="lazy" /></button>)}
                </div>
              </div>}

              <div className="gmaps-info-card">
                <WikiSummary
                  name={placeName}
                  stateName={stateName}
                  title="Acerca de este lugar"
                  fallback={<><div className="gmaps-section-label"><Info size={13} /><span>Acerca de este lugar</span></div><p className="gmaps-description-text">{details.descripcion}</p></>}
                />
              </div>
            </div>
          </aside>

          <div className="gmaps-map-canvas">
            {!mapLoaded && <div className="gmaps-map-loading" aria-hidden="true">Cargando mapa… <a href={directMapsUrl} target="_blank" rel="noopener noreferrer">Abrir en Google Maps</a></div>}
            <a className="gmaps-map-open" href={directMapsUrl} target="_blank" rel="noopener noreferrer"><Navigation size={13} /> Ver en Google Maps</a>
            <iframe title={`Mapa de ${placeName}`} width="100%" height="100%" src={embedUrl} style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" onLoad={() => setMapLoaded(true)} />
          </div>
        </div>
      </div>
      {lightboxIndex !== null && <PhotoLightbox photos={photos} initialIndex={lightboxIndex} placeName={placeName} onClose={() => setLightboxIndex(null)} />}
    </div>
  );
}
