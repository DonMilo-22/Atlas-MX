import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, CalendarDays, Check, Compass, Heart, Stamp } from 'lucide-react';
import { vecinos, estado as getEstadoByCve } from '@webrek/mx-geo';
import { formatArea, formatPopulation } from '../utils/map';
import { TOURISM_DATA } from '../data/states';
import { enrichTourismData } from '../data/tourismEnhancer';
import { isGenericDescription } from '../data/placesData';
import RealPhoto from './RealPhoto';
import StatePhoto from './StatePhoto';
import { getTravelSeason } from '../data/travelSeasons';
import LiveWeatherCard from './LiveWeatherCard';
import WikiSummary from './WikiSummary';
import TodayInMexico from './TodayInMexico';
import { useWikiSummary } from '../hooks/useLiveData';

const EMPTY_DATA = {};
const REGION_LABELS = { norte: 'Norte', noroeste: 'Noroeste', noreste: 'Noreste', occidente: 'Occidente', bajio: 'Bajío', centro: 'Centro', sur: 'Sur', sureste: 'Sureste' };

function itemData(item, fallbackDescription) {
  if (typeof item === 'string') return { nombre: item, descripcion: fallbackDescription };
  return { nombre: item?.nombre || 'Lugar', descripcion: item?.descripcion || fallbackDescription };
}

// Descripción real de Wikipedia; mientras carga o si no hay página relevante, la del catálogo.
function CardDescription({ name, stateName, fallback }) {
  const { data, isLoading } = useWikiSummary(name, stateName);
  if (data?.extract) return <p className="place-row-desc" title="Resumen de Wikipedia">{data.extract}</p>;
  if (isLoading) return <span className="skeleton-line" aria-hidden="true" />;
  return fallback && !isGenericDescription(fallback) ? <p className="place-row-desc">{fallback}</p> : null;
}

function PlaceCard({ item, stateName, badge, badgeClass, onClick, href, fallbackDescription, favorite, isFavorite, onToggleFavorite }) {
  const data = itemData(item, fallbackDescription);
  const CardElement = href ? 'a' : 'button';
  const linkProps = href
    ? { href, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${data.nombre}: buscar en Google (se abre en otra pestaña)` }
    : { type: 'button', onClick, 'aria-label': `Ver ficha de ${data.nombre}` };

  return (
    <article className="place-row">
      <CardElement className="place-row-main" {...linkProps}>
        <span className="place-row-thumb"><RealPhoto name={data.nombre} stateName={stateName} alt="" /></span>
        <span className="place-row-text">
          <span className="place-row-name">{data.nombre}{badge && <em className={`place-row-badge ${badgeClass}`}>{badge}</em>}</span>
          <CardDescription name={data.nombre} stateName={stateName} fallback={data.descripcion} />
        </span>
      </CardElement>
      <button type="button" className={`place-row-save ${isFavorite ? 'active' : ''}`} onClick={() => onToggleFavorite?.(favorite)} aria-pressed={Boolean(isFavorite)} aria-label={`${isFavorite ? 'Quitar' : 'Guardar'} ${data.nombre} ${isFavorite ? 'de' : 'en'} Quiero visitar`} title={isFavorite ? 'Quitar de Quiero visitar' : 'Guardar en Quiero visitar'}><Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} /></button>
    </article>
  );
}

export default function StatePanelV2({ selectedState, onSelectState, onOpenPlace, onExploreState, onOpenLocationMap, onPlanTrip, isFavorite, onToggleFavorite, isVisited, onToggleVisited }) {
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
      <aside className="atlas-sidebar sp" id="panel-estado" ref={panelRef} tabIndex={-1} aria-label="Hoy en México">
        <TodayInMexico onSelectState={onSelectState} onOpenPlace={onOpenPlace} />
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

  const season = getTravelSeason(selectedState.cve);

  return (
    <aside className="atlas-sidebar sp" id="panel-estado" ref={panelRef} tabIndex={-1} aria-label={`Información de ${selectedState.nombre}`}>
      <figure className="sp-hero">
        <StatePhoto key={selectedState.cve} stateCode={selectedState.cve} stateName={selectedState.nombre} />
      </figure>

      <div className="sp-body">
        <header className="sp-head">
          <p className="sp-region">Región {regionLabel}{visited && <span className="sp-visited"><Check size={13} aria-hidden="true" /> Ya lo visitaste</span>}</p>
          <h2 className="sp-name">{selectedState.nombre}</h2>
          <p className="sp-capital">Capital: {selectedState.capital}</p>
          {stateData.lema && <p className="sp-motto">«{stateData.lema}»</p>}
        </header>

        <dl className="sp-facts">
          <div><dt>Población</dt><dd>{formatPopulation(selectedState.poblacion)}</dd></div>
          <div><dt>Superficie</dt><dd>{formatArea(selectedState.superficie)}</dd></div>
          <div><dt>Mejor época</dt><dd>{season.window}</dd></div>
        </dl>

        <LiveWeatherCard stateCode={selectedState.cve} capital={selectedState.capital} />

        <WikiSummary
          key={`wiki-${selectedState.cve}`}
          name={selectedState.nombre}
          stateName="estado"
          title={`Sobre ${selectedState.nombreCorto}`}
          className="sp-section"
          fallback={stateData.resumen ? <div className="wiki-summary sp-section"><p>{stateData.resumen}</p></div> : null}
        />

        <section className="sp-section sp-places" aria-labelledby="sp-places-title">
          <h3 id="sp-places-title" className="sp-title">Qué visitar y probar</h3>
          <div className="sp-tabs" role="tablist" aria-label="Categorías de lugares">
            {tabs.map((tab) => <button key={tab.key} id={`tab-${tab.key}`} type="button" className={activeTab === tab.key ? 'active' : ''} onClick={() => setActiveTab(tab.key)} role="tab" aria-selected={activeTab === tab.key} aria-controls={`tabpanel-${tab.key}`}>{tab.label} <span>{tab.items.length}</span></button>)}
          </div>
          <div role="tabpanel" id={`tabpanel-${current.key}`} aria-labelledby={`tab-${current.key}`}>
            {current.items.length === 0 ? <p className="tab-empty">Aún no hay lugares en esta categoría.</p> : <div className="sp-list">
              {current.items.map(({ item, badge, badgeClass, category, fallback, external }, index) => (
                <PlaceCard
                  key={`${current.key}-${index}`}
                  item={item}
                  stateName={selectedState.nombre}
                  badge={badge === 'Playa' ? badge : null}
                  badgeClass={badgeClass}
                  href={external ? getSearchUrl(item) : undefined}
                  onClick={external ? undefined : () => openMap(item, category)}
                  fallbackDescription={fallback}
                  {...cardFavoriteProps(item, category)}
                />
              ))}
            </div>}
          </div>
        </section>

        {neighborKeys.length > 0 && <p className="sp-neighbors">
          Colinda con{' '}
          {neighborKeys.map((neighborCve, index) => {
            const nState = getEstadoByCve(neighborCve);
            if (!nState) return null;
            const separator = index === neighborKeys.length - 1 ? '' : index === neighborKeys.length - 2 ? ' y ' : ', ';
            return <React.Fragment key={neighborCve}><button type="button" onClick={() => onSelectState?.(nState)}>{nState.nombreCorto}</button>{separator}</React.Fragment>;
          })}.
        </p>}

        <div className="sp-actions">
          <button type="button" className="sp-primary" onClick={() => onExploreState?.(selectedState)}><Compass size={17} aria-hidden="true" /><span>Explorar sus {selectedState.cve === '09' ? 'alcaldías' : 'municipios'}</span><ArrowRight size={16} aria-hidden="true" /></button>
          <div className="sp-secondary">
            <button type="button" onClick={() => onPlanTrip?.(selectedState)}><CalendarDays size={16} aria-hidden="true" /> Planear viaje</button>
            <button type="button" className={visited ? 'is-on' : ''} onClick={() => onToggleVisited?.(selectedState.cve)} aria-pressed={visited}>{visited ? <Check size={16} aria-hidden="true" /> : <Stamp size={16} aria-hidden="true" />} {visited ? 'Visitado' : 'Marcar visitado'}</button>
          </div>
        </div>
      </div>
    </aside>
  );
}
