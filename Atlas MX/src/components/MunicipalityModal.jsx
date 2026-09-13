import React, { useState, useMemo, useRef } from 'react';
import { X, MapPin, Search, ExternalLink, Navigation, Compass, Star, Info, Image as ImageIcon } from 'lucide-react';
import { MapaMunicipios, municipios } from '@webrek/mx-geo/municipios';
import { getMunicipalityDetails } from '../data/placesData';

export default function MunicipalityModal({ state, isOpen, onClose, onOpenLocationMap }) {
  const [selectedMun, setSelectedMun] = useState(null);
  const [hoveredMun, setHoveredMun] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const mapWrapperRef = useRef(null);

  // Obtener lista oficial de municipios del estado
  const munList = useMemo(() => {
    if (!state) return [];
    try {
      return municipios(state.cve) || [];
    } catch (e) {
      return [];
    }
  }, [state]);

  // Filtrar municipios por término de búsqueda
  const filteredMuns = useMemo(() => {
    if (!searchQuery.trim()) return munList;
    const q = searchQuery.toLowerCase().trim();
    return munList.filter((m) => m.nombre.toLowerCase().includes(q) || m.cvegeo.includes(q));
  }, [munList, searchQuery]);

  // Ficha rica del municipio seleccionado
  const selectedDetails = useMemo(() => {
    if (!selectedMun || !state) return null;
    return getMunicipalityDetails(selectedMun.nombre, state.nombre, selectedMun.cvegeo);
  }, [selectedMun, state]);

  if (!isOpen || !state) return null;

  const handleSelectMun = (mun) => {
    setSelectedMun(mun);
  };

  // Detección instantánea al pasar el cursor (Hover) sobre cualquier polígono municipal
  const handleMapMouseMove = (e) => {
    const path = e.target.closest('[data-cvegeo]');
    if (path && mapWrapperRef.current) {
      const cvegeo = path.getAttribute('data-cvegeo');
      const found = munList.find((m) => m.cvegeo === cvegeo);
      const munData = found || { cvegeo, nombre: path.getAttribute('aria-label') || 'Municipio' };
      const rect = mapWrapperRef.current.getBoundingClientRect();
      setHoveredMun({
        ...munData,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    } else {
      setHoveredMun(null);
    }
  };

  const handleMapMouseLeave = () => {
    setHoveredMun(null);
  };

  const handleOpenInMaps = (munTarget) => {
    const target = munTarget || selectedMun;
    if (!target) return;
    if (onOpenLocationMap) {
      onOpenLocationMap(target.nombre, state.nombre, 'Municipio');
    } else {
      const q = `${target.nombre}, ${state.nombre}, México`;
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog modal-municipios-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Encabezado del modal */}
        <div className="modal-header">
          <div>
            <div className="modal-title">
              {state.nombre} — Territorio y Municipios
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              División de {munList.length} municipios (INEGI) • Pasa el cursor para ver el nombre y haz clic para seleccionarlo
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar modal de municipios"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo del modal */}
        <div className="modal-body">
          <div className="municipios-layout-grid">
            {/* Mapa de municipios con captura de hover instantáneo */}
            <div 
              className="municipios-map-wrapper"
              ref={mapWrapperRef}
              onMouseMove={handleMapMouseMove}
              onMouseLeave={handleMapMouseLeave}
            >
              <MapaMunicipios
                estado={state.cve}
                zoom={true}
                paleta="verde"
                emptyColor="#f4eee5"
                stroke="#b59f88"
                // Solo dibuja la etiqueta para el municipio seleccionado o enfocado evitando sobreposición de nombres
                etiquetas={(m) => (selectedMun && selectedMun.cvegeo === m.cvegeo ? m.nombre : '')}
                colorEtiqueta="#1c140e"
                onSelect={handleSelectMun}
              />

              {/* Tooltip flotante instantáneo al hacer hover */}
              {hoveredMun && (
                <div 
                  className="municipio-hover-tooltip"
                  style={{ left: hoveredMun.x, top: hoveredMun.y }}
                >
                  <div className="tooltip-mun-name">{hoveredMun.nombre}</div>
                  <div className="tooltip-mun-cve">CVEGEO: {hoveredMun.cvegeo}</div>
                </div>
              )}
            </div>

            {/* Selector y buscador lateral de municipios */}
            <div className="municipios-sidebar-selector">
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  className="municipios-search-input"
                  placeholder="Buscar por nombre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="municipios-list-scroll">
                {filteredMuns.map((mun) => {
                  const isSel = selectedMun?.cvegeo === mun.cvegeo;
                  return (
                    <div
                      key={mun.cvegeo}
                      className={`municipio-list-item ${isSel ? 'selected' : ''}`}
                      onClick={() => handleSelectMun(mun)}
                      role="button"
                      tabIndex={0}
                    >
                      <span style={{ fontWeight: isSel ? 700 : 500 }}>{mun.nombre}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        {mun.cvegeo}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Ficha informativa completa del municipio seleccionado con imágenes y Google Maps */}
          {selectedDetails ? (
            <div className="municipio-card-expanded">
              <div className="municipio-media-thumb">
                <img src={selectedDetails.imagen} alt={selectedDetails.nombre} />
                <span className="municipio-photo-tag">Cabecera Municipal</span>
              </div>

              <div className="municipio-expanded-info">
                <div className="municipio-expanded-header">
                  <div>
                    <span className="municipio-cve-badge">CVEGEO: {selectedDetails.cvegeo}</span>
                    <h3 className="municipio-expanded-name">{selectedDetails.nombre}</h3>
                    <div className="municipio-expanded-state">{state.nombre}, México</div>
                  </div>

                  <button
                    type="button"
                    className="btn-open-google-maps"
                    onClick={() => handleOpenInMaps(selectedMun)}
                    title={`Abrir ${selectedDetails.nombre} en Google Maps`}
                  >
                    <MapPin size={15} />
                    <span>Ver en Google Maps</span>
                  </button>
                </div>

                <p className="municipio-expanded-desc">{selectedDetails.descripcion}</p>
                <div className="municipio-expanded-history">{selectedDetails.historia}</div>
              </div>
            </div>
          ) : (
            <div className="municipio-selected-banner placeholder">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Compass size={22} color="var(--mexico-brown)" />
                <span>Haz clic en cualquier municipio en el mapa o en la lista para ver su información, imágenes y Google Maps.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
