import React, { useState, useMemo } from 'react';
import { X, ExternalLink, MapPin, Navigation, Star, Clock, Info, Search, Image as ImageIcon } from 'lucide-react';
import { getPlaceDetails, getMunicipalityDetails } from '../data/placesData';

export default function GoogleMapsModal({ isOpen, onClose, placeName, stateName, category }) {
  if (!isOpen || !placeName) return null;

  // Obtener perfil detallado del lugar o municipio con imágenes y textos históricos
  const details = useMemo(() => {
    if (category === 'Municipio') {
      return getMunicipalityDetails(placeName, stateName);
    }
    return getPlaceDetails(placeName, stateName, category);
  }, [placeName, stateName, category]);

  const [activePhoto, setActivePhoto] = useState(details.imagen);

  // Actualizar foto activa si cambian los detalles
  React.useEffect(() => {
    setActivePhoto(details.imagen);
  }, [details]);

  const searchQuery = stateName ? `${placeName}, ${stateName}, México` : `${placeName}, México`;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=m&z=13&output=embed&iwloc=near`;
  const directMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;

  const handleOpenDirectMaps = () => {
    window.open(directMapsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCleanWebSearch = () => {
    // Búsqueda limpia solicitada por el usuario: solo el nombre directo sin texto redundante
    const cleanSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(placeName)}`;
    window.open(cleanSearchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog gmaps-view-dialog" onClick={(e) => e.stopPropagation()}>
        
        {/* Barra superior de control */}
        <div className="gmaps-topbar">
          <div className="gmaps-topbar-breadcrumb">
            <MapPin size={15} color="var(--mexico-green)" />
            <span>{stateName ? `${stateName} › ` : ''}<strong>{placeName}</strong></span>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar vista de mapa"
          >
            <X size={20} />
          </button>
        </div>

        {/* Estructura estilo Google Maps: Menú a la izquierda + Mapa interactivo a la derecha */}
        <div className="gmaps-split-container">
          
          {/* Panel Izquierdo: Información detallada e imágenes estilo Google Maps */}
          <aside className="gmaps-info-sidebar">
            {/* Foto principal grande */}
            <div className="gmaps-hero-media">
              <img 
                src={activePhoto} 
                alt={placeName} 
                className="gmaps-hero-img"
              />
              <div className="gmaps-hero-overlay">
                <span className="gmaps-category-chip">{details.categoria || category}</span>
              </div>
            </div>

            <div className="gmaps-sidebar-body">
              {/* Título y valoración */}
              <div className="gmaps-title-section">
                <h2 className="gmaps-place-title">{placeName}</h2>
                <div className="gmaps-rating-bar">
                  <span className="gmaps-rating-score">{details.rating || '4.8'}</span>
                  <div className="gmaps-stars" aria-label="Calificación de 5 estrellas">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <span className="gmaps-reviews-count">({details.resenas || 'Opiniones'})</span>
                </div>
                <div className="gmaps-location-sub">
                  <MapPin size={13} />
                  <span>{stateName}, República Mexicana</span>
                </div>
              </div>

              {/* Botones de acción rápida estilo Google Maps */}
              <div className="gmaps-actions-row">
                <button
                  type="button"
                  className="gmaps-action-button primary"
                  onClick={handleOpenDirectMaps}
                  title="Abrir en pestaña de Google Maps"
                >
                  <Navigation size={14} />
                  <span>Cómo llegar</span>
                </button>
                <button
                  type="button"
                  className="gmaps-action-button secondary"
                  onClick={handleCleanWebSearch}
                  title={`Buscar "${placeName}" en Google`}
                >
                  <Search size={14} />
                  <span>Buscar más</span>
                </button>
              </div>

              {/* Galería de fotos miniatura */}
              {details.galeria && details.galeria.length > 0 && (
                <div className="gmaps-gallery-section">
                  <div className="gmaps-section-label">
                    <ImageIcon size={13} />
                    <span>Fotografías del lugar</span>
                  </div>
                  <div className="gmaps-thumbs-strip">
                    {details.galeria.map((pic, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`gmaps-thumb-btn ${activePhoto === pic ? 'active' : ''}`}
                        onClick={() => setActivePhoto(pic)}
                        title="Ver fotografía"
                      >
                        <img src={pic} alt={`Foto ${idx + 1} de ${placeName}`} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Resumen y Descripción */}
              <div className="gmaps-info-card">
                <div className="gmaps-section-label">
                  <Info size={13} />
                  <span>Acerca de este lugar</span>
                </div>
                <p className="gmaps-description-text">{details.descripcion}</p>
              </div>

              {/* Historia y Contexto */}
              {details.historia && (
                <div className="gmaps-info-card">
                  <div className="gmaps-section-label">
                    <span>Historia y Patrimonio</span>
                  </div>
                  <p className="gmaps-description-text">{details.historia}</p>
                </div>
              )}

              {/* Datos prácticos */}
              <div className="gmaps-meta-card">
                {details.horario && (
                  <div className="gmaps-meta-item">
                    <Clock size={14} color="var(--mexico-brown)" />
                    <span>{details.horario}</span>
                  </div>
                )}
                {details.municipioCercano && (
                  <div className="gmaps-meta-item">
                    <MapPin size={14} color="var(--mexico-green)" />
                    <span>Zona: {details.municipioCercano}</span>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Lienzo Derecho: Google Maps Interactivo */}
          <main className="gmaps-map-canvas">
            <iframe
              title={`Mapa de ${placeName}`}
              width="100%"
              height="100%"
              src={embedUrl}
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </main>
        </div>
      </div>
    </div>
  );
}
