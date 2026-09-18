import React, { useMemo, useState } from 'react';
import { ArrowRight, Compass, ExternalLink, MapPin, Sparkles } from 'lucide-react';
import { vecinos, estado as getEstadoByCve } from '@webrek/mx-geo';
import { formatArea, formatPopulation } from '../utils/map';
import { TOURISM_DATA } from '../data/states';
import { enrichTourismData } from '../data/tourismEnhancer';
import RealPhoto from './RealPhoto';

function itemData(item, fallbackDescription) {
  if (typeof item === 'string') return { nombre: item, descripcion: fallbackDescription };
  return { nombre: item?.nombre || 'Lugar', descripcion: item?.descripcion || fallbackDescription, imagen: item?.imagen || '' };
}

function PlaceCard({ item, stateName, badge, badgeClass = 'map', onClick, onPreview, href, fallbackDescription }) {
  const data = itemData(item, fallbackDescription);
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };
  const CardElement = href ? 'a' : 'div';

  return (
    <CardElement
      className="rich-place-card"
      href={href || undefined}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      onClick={href ? undefined : onClick}
      onKeyDown={href ? undefined : handleKeyDown}
      role={href ? undefined : 'button'}
      tabIndex={href ? undefined : 0}
      title={`Explorar ${data.nombre}`}
      onMouseEnter={href ? undefined : () => onPreview?.(data.nombre)}
      onMouseLeave={href ? undefined : () => onPreview?.('')}
      onFocus={href ? undefined : () => onPreview?.(data.nombre)}
      onBlur={href ? undefined : () => onPreview?.('')}
    >
      <div className="rich-place-thumb">
        <RealPhoto name={data.nombre} stateName={stateName} fallback={data.imagen} alt={`${data.nombre}, ${stateName}`} />
      </div>
      <div className="rich-place-content">
        <div className="rich-place-title-row">
          <span className="rich-place-name">{data.nombre}</span>
          <span className={`rich-place-badge ${badgeClass}`}>{badge}</span>
        </div>
        <p className="rich-place-desc">{data.descripcion}</p>
      </div>
    </CardElement>
  );
}

export default function StatePanelV2({ selectedState, onSelectState, onExploreState, onOpenLocationMap, onPreviewLocation }) {
  const [activeTab, setActiveTab] = useState('destinos');

  const stateData = selectedState ? (TOURISM_DATA[selectedState.cve] || {}) : {};
  const tourism = useMemo(() => {
    if (!selectedState) return null;
    return enrichTourismData(selectedState.cve, stateData.turismo || {});
  }, [selectedState?.cve, stateData]);

  if (!selectedState) {
    return (
      <aside className="atlas-sidebar" aria-label="Información del estado seleccionado">
        <div className="state-empty-view">
          <div className="empty-radar" aria-hidden="true"><Compass size={38} /></div>
          <h2 className="empty-title">EXPLORADOR DE ENTIDADES</h2>
          <p className="empty-desc">Selecciona un estado para descubrir destinos, pueblos, historia y cocina con fotografías reales consultadas desde Wikipedia y Wikimedia Commons.</p>
        </div>
      </aside>
    );
  }

  const neighborKeys = vecinos(selectedState.cve) || [];
  const openMap = (item, category) => {
    const name = typeof item === 'string' ? item : item?.nombre;
    if (name) onOpenLocationMap?.(name, selectedState.nombre, category);
  };
  const previewMap = (name, category) => onPreviewLocation?.(name, selectedState.nombre, category);
  const getSearchUrl = (item) => {
    const name = typeof item === 'string' ? item : item?.nombre;
    return name
      ? `https://www.google.com/search?q=${encodeURIComponent(`${name} ${selectedState.nombre} México`)}`
      : undefined;
  };

  const destinations = [...(tourism.destinos || []), ...(tourism.playas || [])];
  const tabs = [
    ['destinos', `Destinos (${destinations.length})`],
    ['magicos', `Pueblos (${tourism.pueblosMagicos.length})`],
    ['arqueologia', `Historia (${tourism.arqueologia.length})`],
    ['gastronomia', `Cocina (${tourism.gastronomia.length})`]
  ];

  return (
    <aside className="atlas-sidebar" aria-label={`Información detallada de ${selectedState.nombre}`}>
      <div className="state-content-view">
        <div className="state-header-card with-hero">
          <div className="state-hero-banner">
            <RealPhoto name={selectedState.nombre} stateName="México" fallback={stateData.heroImage || ''} alt={`Paisaje representativo de ${selectedState.nombre}`} />
            <div className="state-hero-overlay" />
            <span className="state-iso-tag">{selectedState.iso}</span>
          </div>
          <div className="state-header-inner">
            <div className="state-header-top">
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>CLAVE INEGI: {selectedState.cve}</span>
              <span className="state-region-badge" style={{ color: 'var(--mexico-green)' }}>{selectedState.region ? selectedState.region.toUpperCase() : 'FEDERAL'}</span>
            </div>
            <h2 className="state-name-display">{selectedState.nombre}</h2>
            <div className="state-capital-display"><MapPin size={15} color="var(--mexico-brown)" /><span>Capital: <strong>{selectedState.capital}</strong></span></div>
            {stateData.lema && <div className="state-lema-quote">«{stateData.lema}»</div>}
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-box"><div className="stat-label">Población (2020)</div><div className="stat-value">{formatPopulation(selectedState.poblacion)}</div></div>
          <div className="stat-box"><div className="stat-label">Superficie</div><div className="stat-value">{formatArea(selectedState.superficie)}</div></div>
          <div className="stat-box"><div className="stat-label">Huso Horario</div><div className="stat-value" style={{ fontSize: '0.74rem', wordBreak: 'break-all' }}>{selectedState.huso || 'America/Mexico_City'}</div></div>
          <div className="stat-box"><div className="stat-label">Clima</div><div className="stat-value" style={{ fontSize: '0.76rem' }}>{tourism.clima || 'Variable según la región'}</div></div>
        </div>

        {stateData.resumen && <div className="state-summary-card"><span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--mexico-brown)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '3px' }}>Perfil del Estado</span><p style={{ margin: 0 }}>{stateData.resumen}</p></div>}

        <div className="tourism-section">
          <div className="tourism-header-bar"><span className="tourism-header-title">Patrimonio, Lugares y Cocina</span><Sparkles size={15} color="var(--mexico-gold)" /></div>
          <div className="tourism-tabs" role="tablist">
            {tabs.map(([key, label]) => <button key={key} type="button" className={`tourism-tab-btn ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)} role="tab" aria-selected={activeTab === key}>{label}</button>)}
          </div>

          <div className="tourism-tab-content">
            {activeTab === 'destinos' && <div className="rich-place-cards-list">
              {(tourism.destinos || []).map((item, index) => <PlaceCard key={`d-${index}`} item={item} stateName={selectedState.nombre} badge="Maps" badgeClass="map" onClick={() => openMap(item, 'Destino turístico')} onPreview={(name) => previewMap(name, 'Destino turístico')} fallbackDescription="Destino turístico destacado del estado." />)}
              {(tourism.playas || []).map((item, index) => <PlaceCard key={`p-${index}`} item={item} stateName={selectedState.nombre} badge="Playa" badgeClass="beach" onClick={() => openMap(item, 'Playa')} onPreview={(name) => previewMap(name, 'Playa')} fallbackDescription="Zona costera destacada del estado." />)}
            </div>}

            {activeTab === 'magicos' && <div className="rich-place-cards-list">
              {tourism.pueblosMagicos.map((item, index) => <PlaceCard key={`m-${index}`} item={item} stateName={selectedState.nombre} badge="Pueblo" badgeClass="magic" onClick={() => openMap(item, 'Pueblo o localidad')} onPreview={(name) => previewMap(name, 'Pueblo o localidad')} fallbackDescription="Pueblo o localidad con identidad cultural del estado." />)}
            </div>}

            {activeTab === 'arqueologia' && <div className="rich-place-cards-list">
              {tourism.arqueologia.map((item, index) => <PlaceCard key={`h-${index}`} item={item} stateName={selectedState.nombre} badge="Historia" badgeClass="history" onClick={() => openMap(item, 'Sitio histórico')} onPreview={(name) => previewMap(name, 'Sitio histórico')} fallbackDescription="Sitio histórico o patrimonial del estado." />)}
            </div>}

            {activeTab === 'gastronomia' && <div className="rich-place-cards-list">
              {tourism.gastronomia.map((item, index) => <PlaceCard key={`g-${index}`} item={item} stateName={selectedState.nombre} badge="Cocina" badgeClass="food" href={getSearchUrl(item)} fallbackDescription="Especialidad gastronómica tradicional del estado." />)}
            </div>}
          </div>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}><ExternalLink size={11} /> Fotografías consultadas dinámicamente en Wikipedia/Wikimedia Commons; los lugares abren Google Maps.</div>
        </div>

        {neighborKeys.length > 0 && <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--mexico-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', fontWeight: 700 }}>Estados Colindantes</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {neighborKeys.map((cve) => {
              const nState = getEstadoByCve(cve);
              if (!nState) return null;
              return <button key={cve} type="button" style={{ background: '#fff', border: '1px solid var(--border-warm)', borderRadius: '6px', color: 'var(--text-main)', fontSize: '0.76rem', fontWeight: 600, padding: '4px 10px', cursor: 'pointer', boxShadow: 'var(--shadow-warm-sm)' }} onClick={() => onSelectState?.(nState)}>{nState.nombreCorto}</button>;
            })}
          </div>
        </div>}

        <button type="button" className="explore-action-btn" onClick={() => onExploreState?.(selectedState)} aria-label={`Ver división municipal de ${selectedState.nombre}`}><Compass size={18} /><span>Explorar Municipios de {selectedState.nombreCorto}</span><ArrowRight size={17} /></button>
      </div>
    </aside>
  );
}
