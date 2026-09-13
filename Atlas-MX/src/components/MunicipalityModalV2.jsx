import React, { useMemo, useRef, useState } from 'react';
import { Compass, MapPin, Search, X } from 'lucide-react';
import { MapaMunicipios, municipios } from '@webrek/mx-geo/municipios';
import { getMunicipalityDetails } from '../data/placesData';
import RealPhoto from './RealPhoto';

export default function MunicipalityModalV2({ state, isOpen, onClose, onOpenLocationMap }) {
  const [selectedMun, setSelectedMun] = useState(null);
  const [hoveredMun, setHoveredMun] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const mapWrapperRef = useRef(null);

  const munList = useMemo(() => {
    if (!state) return [];
    try { return municipios(state.cve) || []; } catch { return []; }
  }, [state]);

  const filteredMuns = useMemo(() => {
    const q = searchQuery.toLocaleLowerCase('es-MX').trim();
    if (!q) return munList;
    return munList.filter((mun) => mun.nombre.toLocaleLowerCase('es-MX').includes(q) || mun.cvegeo.includes(q));
  }, [munList, searchQuery]);

  const selectedDetails = useMemo(() => {
    if (!selectedMun || !state) return null;
    return getMunicipalityDetails(selectedMun.nombre, state.nombre, selectedMun.cvegeo);
  }, [selectedMun, state]);

  if (!isOpen || !state) return null;

  const openMunicipality = (mun) => {
    if (!mun) return;
    setSelectedMun(mun);
    // El clic abre inmediatamente la ficha tipo Maps solicitada por el usuario.
    onOpenLocationMap?.(mun.nombre, state.nombre, 'Municipio');
  };

  const handleMapMouseMove = (event) => {
    const path = event.target.closest?.('[data-cvegeo]');
    if (!path || !mapWrapperRef.current) {
      setHoveredMun(null);
      return;
    }
    const cvegeo = path.getAttribute('data-cvegeo');
    const found = munList.find((mun) => mun.cvegeo === cvegeo);
    const rect = mapWrapperRef.current.getBoundingClientRect();
    setHoveredMun({ ...(found || { cvegeo, nombre: path.getAttribute('aria-label') || 'Municipio' }), x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  const directMaps = (mun) => {
    const q = `${mun.nombre}, ${state.nombre}, México`;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog modal-municipios-dialog" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div><div className="modal-title">{state.nombre} — Territorio y Municipios</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>División de {munList.length} municipios (INEGI) · Haz clic para abrir fotos reales y Google Maps</div></div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal de municipios"><X size={20} /></button>
        </div>

        <div className="modal-body">
          <div className="municipios-layout-grid">
            <div className="municipios-map-wrapper" ref={mapWrapperRef} onMouseMove={handleMapMouseMove} onMouseLeave={() => setHoveredMun(null)}>
              <MapaMunicipios estado={state.cve} zoom paleta="verde" emptyColor="#f4eee5" stroke="#b59f88" etiquetas={(mun) => selectedMun?.cvegeo === mun.cvegeo ? mun.nombre : ''} colorEtiqueta="#1c140e" onSelect={openMunicipality} />
              {hoveredMun && <div className="municipio-hover-tooltip" style={{ left: hoveredMun.x, top: hoveredMun.y }}><div className="tooltip-mun-name">{hoveredMun.nombre}</div><div className="tooltip-mun-cve">CVEGEO: {hoveredMun.cvegeo}</div></div>}
            </div>

            <div className="municipios-sidebar-selector">
              <div style={{ position: 'relative' }}><Search size={15} style={{ position: 'absolute', left: 10, top: 12, color: 'var(--text-dim)' }} /><input type="text" className="municipios-search-input" placeholder="Buscar por nombre…" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} /></div>
              <div className="municipios-list-scroll">
                {filteredMuns.map((mun) => <div key={mun.cvegeo} className={`municipio-list-item ${selectedMun?.cvegeo === mun.cvegeo ? 'selected' : ''}`} onClick={() => openMunicipality(mun)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') openMunicipality(mun); }} role="button" tabIndex={0}><span style={{ fontWeight: selectedMun?.cvegeo === mun.cvegeo ? 700 : 500 }}>{mun.nombre}</span><span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{mun.cvegeo}</span></div>)}
              </div>
            </div>
          </div>

          {selectedDetails ? <div className="municipio-card-expanded">
            <div className="municipio-media-thumb"><RealPhoto name={selectedDetails.nombre} stateName={state.nombre} fallback={selectedDetails.imagen || ''} alt={`${selectedDetails.nombre}, ${state.nombre}`} /><span className="municipio-photo-tag">Foto real · Wikimedia</span></div>
            <div className="municipio-expanded-info">
              <div className="municipio-expanded-header"><div><span className="municipio-cve-badge">CVEGEO: {selectedDetails.cvegeo}</span><h3 className="municipio-expanded-name">{selectedDetails.nombre}</h3><div className="municipio-expanded-state">{state.nombre}, México</div></div><button type="button" className="btn-open-google-maps" onClick={() => directMaps(selectedMun)}><MapPin size={15} /><span>Abrir Google Maps</span></button></div>
              <p className="municipio-expanded-desc">{selectedDetails.descripcion}</p>{selectedDetails.historia && <div className="municipio-expanded-history">{selectedDetails.historia}</div>}
            </div>
          </div> : <div className="municipio-selected-banner placeholder"><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Compass size={22} color="var(--mexico-brown)" /><span>Selecciona un municipio para abrir su ficha con fotografía real, mapa y accesos a servicios.</span></div></div>}
        </div>
      </div>
    </div>
  );
}
