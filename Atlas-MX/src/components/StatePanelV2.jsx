import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, CalendarDays, Check, Compass, Heart, MapPin, Sparkles, Stamp } from 'lucide-react';
import { vecinos, estado as getEstadoByCve } from '@webrek/mx-geo';
import { formatArea, formatPopulation } from '../utils/map';
import { TOURISM_DATA } from '../data/states';
import { enrichTourismData } from '../data/tourismEnhancer';
import { isGenericDescription } from '../data/placesData';
import RealPhoto from './RealPhoto';
import TravelSeasonCard from './TravelSeasonCard';
import StateStoryCard from './StateStoryCard';

const EMPTY_DATA = {};
const REGION_LABELS = { norte: 'Norte', noroeste: 'Noroeste', noreste: 'Noreste', occidente: 'Occidente', bajio: 'Bajío', centro: 'Centro', sur: 'Sur', sureste: 'Sureste' };

function itemData(item, fallbackDescription) {
  if (typeof item === 'string') return { nombre: item, descripcion: fallbackDescription };
  return { nombre: item?.nombre || 'Lugar', descripcion: item?.descripcion || fallbackDescription };
}

function PlaceCard({ item, stateName, badge, badgeClass, onClick, href, fallbackDescription, favorite, isFavorite, onToggleFavorite }) {
  const data = itemData(item, fallbackDescription);
  const CardElement = href ? 'a' : 'button';
  const linkProps = href
    ? { href, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${data.nombre}: buscar en Google (se abre en otra pestaña)` }
    : { type: 'button', onClick, 'aria-label': `Ver ficha de ${data.nombre}` };

  return (
    <article className="rich-place-card-shell">
      <CardElement className="rich-place-card" {...linkProps}>
        <div className="rich-place-thumb">
          <RealPhoto name={data.nombre} stateName={stateName} alt="" />
        </div>
        <div className="rich-place-content">
          <div className="rich-place-title-row">
            <span className="rich-place-name">{data.nombre}</span>
            <span className={`rich-place-badge ${badgeClass}`}>{badge}</span>
          </div>
          {data.descripcion && !isGenericDescription(data.descripcion) && <p className="rich-place-desc">{data.descripcion}</p>}
        </div>
      </CardElement>
      <button type="button" className={`place-favorite-btn ${isFavorite ? 'active' : ''}`} onClick={() => onToggleFavorite?.(favorite)} aria-pressed={Boolean(isFavorite)} aria-label={`${isFavorite ? 'Quitar' : 'Guardar'} ${data.nombre} ${isFavorite ? 'de' : 'en'} Quiero visitar`} title={isFavorite ? 'Quitar de Quiero visitar' : 'Guardar en Quiero visitar'}><Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} /></button>
    </article>
  );
}

export default function StatePanelV2({ selectedState, onSelectState, onExploreState, onOpenLocationMap, onPlanTrip, isFavorite, onToggleFavorite, isVisited, onToggleVisited }) {
  const [activeTab, setActiveTab] = useState('destinos');
  const panelRef = useRef(null);
  const cve = selectedState?.cve;
  const stateData = cve ? (TOURISM_DATA[cve] || EMPTY_DATA) : EMPTY_DATA;
  const tourism = useMemo(() => (cve ? enrichTourismData(cve, stateData.turismo || EMPTY_DATA) : null), [cve, stateData]);

  // Al cambiar de estado: volver al inicio del panel y a la primera pestaña.
  const firstRender = useRef(true);
  useEffect(() => {
    setActiveTab('destinos');
    panelRef.current?.scrollTo?.({ top: 0 });
    if (firstRender.current) { firstRender.current = false; return; }
    // En móvil el panel queda debajo del mapa: lo llevamos a la vista para que se note la selección.
    if (cve && window.matchMedia?.('(max-width: 760px)').matches) {
      const top = panelRef.current.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  }, [cve]);

  if (!selectedState) {
    return (
      <aside className="atlas-sidebar" id="panel-estado" ref={panelRef} tabIndex={-1} aria-label="Información del estado seleccionado">
        <div className="state-empty-view">
          <div className="empty-radar" aria-hidden="true"><Compass size={38} /></div>
          <h2 className="empty-title">Explora los 32 estados</h2>
          <p className="empty-desc">Selecciona un estado en el mapa o búscalo arriba para descubrir sus destinos, pueblos, historia y cocina.</p>
          <ul className="empty-tips">
            <li>Arrastra para mover el mapa y usa la rueda o pellizca para acercar.</li>
            <li>“Explorar por” resalta los estados con playas, naturaleza, historia y más.</li>
            <li>Guarda lugares con el corazón y marca los estados que ya visitaste.</li>
          </ul>
        </div>
      </aside>
    );
  }

  const neighborKeys = vecinos(selectedState.cve) || [];
  const visited = Boolean(isVisited?.(selectedState.cve));
  const openMap = (item, category) => {
    const name = typeof item === 'string' ? item : item?.nombre;
    if (name) onOpenLocationMap?.(name, selectedState.nombre, category);
  };
  const cardFavoriteProps = (item, category) => {
    const name = typeof item === 'string' ? item : item?.nombre;
    const favorite = { id: `${selectedState.cve}:${category}:${name}`, name, stateName: selectedState.nombre, stateCode: selectedState.cve, category };
    return { favorite, isFavorite: isFavorite?.(favorite.id), onToggleFavorite };
  };
  const getSearchUrl = (item) => {
    const name = typeof item === 'string' ? item : item?.nombre;
    return name ? `https://www.google.com/search?q=${encodeURIComponent(`${name} ${selectedState.nombre} México`)}` : undefined;
  };

  const destinations = [
    ...(tourism.destinos || []).map((item) => ({ item, badge: 'Destino', badgeClass: 'map', category: 'Destino turístico', fallback: 'Destino turístico destacado del estado.' })),
    ...(tourism.playas || []).map((item) => ({ item, badge: 'Playa', badgeClass: 'beach', category: 'Playa', fallback: 'Zona costera destacada del estado.' }))
  ];
  const tabs = [
    { key: 'destinos', label: 'Destinos', items: destinations },
    { key: 'magicos', label: 'Pueblos', items: tourism.pueblosMagicos.map((item) => ({ item, badge: 'Pueblo', badgeClass: 'magic', category: 'Pueblo o localidad', fallback: 'Pueblo o localidad con identidad cultural del estado.' })) },
    { key: 'arqueologia', label: 'Historia', items: tourism.arqueologia.map((item) => ({ item, badge: 'Historia', badgeClass: 'history', category: 'Sitio histórico', fallback: 'Sitio histórico o patrimonial del estado.' })) },
    { key: 'gastronomia', label: 'Cocina', items: tourism.gastronomia.map((item) => ({ item, badge: 'Cocina', badgeClass: 'food', category: 'Gastronomía', fallback: 'Especialidad gastronómica tradicional del estado.', external: true })) }
  ];
  const current = tabs.find((tab) => tab.key === activeTab) || tabs[0];
  const regionLabel = REGION_LABELS[String(selectedState.region || '').toLowerCase()] || selectedState.region || 'México';

  return (
    <aside className="atlas-sidebar" id="panel-estado" ref={panelRef} tabIndex={-1} aria-label={`Información de ${selectedState.nombre}`}>
      <div className="state-content-view">
        <div className="state-header-card">
          <div className="state-hero-banner">
            <RealPhoto name={selectedState.nombre} stateName="México" alt={`Paisaje representativo de ${selectedState.nombre}`} />
            <div className="state-hero-overlay" />
          </div>
          <div className="state-header-inner">
            <div className="state-header-top">
              <span className="state-region-badge">Región {regionLabel}</span>
              {visited && <span className="state-visited-badge"><Check size={12} /> Visitado</span>}
            </div>
            <h2 className="state-name-display">{selectedState.nombre}</h2>
            <div className="state-capital-display"><MapPin size={15} color="var(--mexico-brown)" aria-hidden="true" /><span>Capital: <strong>{selectedState.capital}</strong></span></div>
            {stateData.lema && <div className="state-lema-quote">«{stateData.lema}»</div>}
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-box"><div className="stat-label">Población (2020)</div><div className="stat-value">{formatPopulation(selectedState.poblacion)}</div></div>
          <div className="stat-box"><div className="stat-label">Superficie</div><div className="stat-value">{formatArea(selectedState.superficie)}</div></div>
          <div className="stat-box stat-box-wide"><div className="stat-label">Clima</div><div className="stat-value stat-value-small">{tourism.clima || 'Variable según la región'}</div></div>
        </div>

        {stateData.resumen && <div className="state-summary-card"><span className="section-kicker">Perfil del estado</span><p>{stateData.resumen}</p></div>}

        <div className="tourism-section">
          <div className="tourism-header-bar"><span className="tourism-header-title">Qué visitar y probar</span><Sparkles size={15} color="var(--mexico-gold)" aria-hidden="true" /></div>
          <div className="tourism-tabs" role="tablist" aria-label="Categorías de lugares">
            {tabs.map((tab) => <button key={tab.key} id={`tab-${tab.key}`} type="button" className={`tourism-tab-btn ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)} role="tab" aria-selected={activeTab === tab.key} aria-controls={`tabpanel-${tab.key}`}>{tab.label} ({tab.items.length})</button>)}
          </div>

          <div className="tourism-tab-content" role="tabpanel" id={`tabpanel-${current.key}`} aria-labelledby={`tab-${current.key}`}>
            {current.items.length === 0 ? <p className="tab-empty">Aún no hay lugares en esta categoría.</p> : <div className="rich-place-cards-list">
              {current.items.map(({ item, badge, badgeClass, category, fallback, external }, index) => (
                <PlaceCard
                  key={`${current.key}-${index}`}
                  item={item}
                  stateName={selectedState.nombre}
                  badge={badge}
                  badgeClass={badgeClass}
                  href={external ? getSearchUrl(item) : undefined}
                  onClick={external ? undefined : () => openMap(item, category)}
                  fallbackDescription={fallback}
                  {...cardFavoriteProps(item, category)}
                />
              ))}
            </div>}
          </div>
        </div>

        <TravelSeasonCard stateCode={selectedState.cve} />
        <StateStoryCard key={selectedState.cve} stateCode={selectedState.cve} stateName={selectedState.nombre} />

        {neighborKeys.length > 0 && <div className="neighbors-section">
          <div className="section-kicker">Estados colindantes</div>
          <div className="neighbor-chips">
            {neighborKeys.map((neighborCve) => {
              const nState = getEstadoByCve(neighborCve);
              if (!nState) return null;
              return <button key={neighborCve} type="button" className="neighbor-chip" onClick={() => onSelectState?.(nState)}>{nState.nombreCorto}</button>;
            })}
          </div>
        </div>}

        <div className="state-footer-actions">
          <button type="button" className="plan-state-action" onClick={() => onPlanTrip?.(selectedState)}><CalendarDays size={17} /><span>Planear viaje y presupuesto</span></button>
          <button type="button" className={`passport-state-action ${visited ? 'visited' : ''}`} onClick={() => onToggleVisited?.(selectedState.cve)} aria-pressed={visited}>{visited ? <Check size={17} /> : <Stamp size={17} />}<span>{visited ? 'Sello agregado al pasaporte' : 'Marcar estado como visitado'}</span></button>
          <button type="button" className="explore-action-btn" onClick={() => onExploreState?.(selectedState)}><Compass size={18} /><span>Explorar municipios de {selectedState.nombreCorto}</span><ArrowRight size={17} /></button>
        </div>
      </div>
    </aside>
  );
}
