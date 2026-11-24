import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Building2, Compass, Hotel, MapPin, Search, Trees, Utensils, X } from 'lucide-react';
import { MapaMunicipios, municipios } from '@webrek/mx-geo/municipios';
import { getMunicipalityDetails } from '../data/placesData';
import RealPhoto from './RealPhoto';
import { TOURISM_INDEX } from '../data/tourismIndex';
import { getCategoryLabel } from '../data/tourismCategories';
import useDialog from '../hooks/useDialog';

export default function MunicipalityModalV2({ state, isOpen, onClose, onOpenLocationMap }) {
  const [selectedMun, setSelectedMun] = useState(null);
  const [hoveredMun, setHoveredMun] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const mapWrapperRef = useRef(null);
  const dialogRef = useDialog(isOpen, onClose);
  useEffect(() => { setSelectedMun(null); setSearchQuery(''); setHoveredMun(null); }, [state?.cve]);

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
  const stateRecommendations = useMemo(() => {
    if (!state || !selectedMun) return [];
    const items = TOURISM_INDEX.filter((item) => item.stateCode === state.cve && item.category !== 'gastronomia');
    return items.filter((item, index, all) => all.findIndex((other) => other.name === item.name) === index).slice(0, 4);
  }, [state, selectedMun]);

  if (!isOpen || !state) return null;

  const openMunicipality = (mun) => {
    if (!mun) return;
    setSelectedMun(mun);
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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog modal-municipios-dialog" ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="municipios-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div><h2 className="modal-title" id="municipios-title">{state.nombre} — Territorio y Municipios</h2><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>División de {munList.length} municipios (INEGI) · Selecciona uno para descubrir qué hacer</div></div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal de municipios"><X size={20} /></button>
        </div>

        <div className="modal-body">
          <div className="municipios-layout-grid">
            <div className="municipios-map-wrapper" ref={mapWrapperRef} onMouseMove={handleMapMouseMove} onMouseLeave={() => setHoveredMun(null)}>
              <MapaMunicipios estado={state.cve} zoom paleta="verde" emptyColor="#f4eee5" stroke="#b59f88" etiquetas={(mun) => selectedMun?.cvegeo === mun.cvegeo ? mun.nombre : ''} colorEtiqueta="#1c140e" onSelect={openMunicipality} />
              {hoveredMun && <div className="municipio-hover-tooltip" style={{ left: hoveredMun.x, top: hoveredMun.y }}><div className="tooltip-mun-name">{hoveredMun.nombre}</div></div>}
            </div>

            <div className="municipios-sidebar-selector">
              <div style={{ position: 'relative' }}><Search size={15} style={{ position: 'absolute', left: 10, top: 12, color: 'var(--text-dim)' }} /><input type="text" className="municipios-search-input" placeholder="Buscar municipio…" aria-label="Buscar municipio" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} /></div>
              <div className="municipios-list-scroll">
                {filteredMuns.map((mun) => <div key={mun.cvegeo} className={`municipio-list-item ${selectedMun?.cvegeo === mun.cvegeo ? 'selected' : ''}`} onClick={() => openMunicipality(mun)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openMunicipality(mun); } }} role="button" tabIndex={0} aria-pressed={selectedMun?.cvegeo === mun.cvegeo}><span style={{ fontWeight: selectedMun?.cvegeo === mun.cvegeo ? 700 : 500 }}>{mun.nombre}</span></div>)}
              </div>
            </div>
          </div>

          {selectedDetails ? <div className="municipio-card-expanded">
            <div className="municipio-media-thumb"><RealPhoto name={selectedDetails.nombre} stateName={state.nombre} fallback={selectedDetails.imagen || ''} alt={`${selectedDetails.nombre}, ${state.nombre}`} /></div>
            <div className="municipio-expanded-info">
              <div className="municipio-expanded-header"><div><h3 className="municipio-expanded-name">{selectedDetails.nombre}</h3><div className="municipio-expanded-state">{state.nombre}, México</div></div><button type="button" className="btn-open-google-maps" onClick={() => directMaps(selectedMun)}><MapPin size={15} /><span>Abrir Google Maps</span></button></div>
              <p className="municipio-expanded-desc">{selectedDetails.descripcion}</p>
              <div className="municipio-service-actions">
                <button type="button" onClick={() => onOpenLocationMap?.(`atractivos turísticos en ${selectedMun.nombre}`, state.nombre, 'Atractivos')}><Trees size={14} /> Atractivos</button>
                <button type="button" onClick={() => onOpenLocationMap?.(`comida típica en ${selectedMun.nombre}`, state.nombre, 'Gastronomía')}><Utensils size={14} /> Dónde comer</button>
                <button type="button" onClick={() => onOpenLocationMap?.(`hoteles en ${selectedMun.nombre}`, state.nombre, 'Hospedaje')}><Hotel size={14} /> Hospedaje</button>
              </div>
            </div>
          </div> : <div className="municipio-selected-banner placeholder"><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Compass size={22} color="var(--mexico-brown)" /><span>Selecciona un municipio para ver su fotografía, ubicación, servicios y recomendaciones.</span></div></div>}
          {selectedMun && <section className="municipio-recommendations"><div className="municipio-recommendations-head"><Building2 size={15} /><span>Más lugares para visitar en {state.nombre}</span></div><div>{stateRecommendations.map((item) => <button key={item.id} type="button" onClick={() => onOpenLocationMap?.(item.name, state.nombre, getCategoryLabel(item.category))}><small>{getCategoryLabel(item.category)}</small><strong>{item.name}</strong><span><MapPin size={10} /> Ver en mapa</span></button>)}</div></section>}
        </div>
      </div>
    </div>
  );
}
