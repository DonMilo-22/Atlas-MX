import React, { useEffect, useRef } from 'react';
import { ArrowRight, Map as MapIcon } from 'lucide-react';
import { vecinos, estado as getEstadoByCve } from '@webrek/mx-geo';
import { formatArea, formatPopulation } from '../utils/map';
import { CATEGORY_META, commonsThumb } from '../data/tourism';
import { retryCommons } from '../utils/commons';
import useStateTourism from '../hooks/useStateTourism';
import StatePhoto from './StatePhoto';
import { getTravelSeason } from '../data/travelSeasons';
import LiveWeatherCard from './LiveWeatherCard';
import WikiSummary from './WikiSummary';
import TodayInMexico from './TodayInMexico';

const REGION_LABELS = { norte: 'Norte', 'centro-norte': 'Centro-norte', centro: 'Centro', sur: 'Sur' };
const GUIDE_ORDER = ['pueblos', 'historia', 'destinos', 'cocina'];

// Hasta tres fotos reales del catálogo del estado para la portada del botón de la guía.
function guidePreview(data) {
  const photos = [];
  GUIDE_ORDER.forEach((key) => {
    const item = (data?.categorias?.[key] || []).find((entry) => entry.imagen && !photos.some((p) => p.id === entry.id));
    if (item && photos.length < 3) photos.push(item);
  });
  return photos;
}

function GuideButton({ state, onOpen }) {
  const { data, isLoading } = useStateTourism(state.cve);
  const counts = GUIDE_ORDER.map((key) => [key, data?.categorias?.[key]?.length || 0]).filter(([, n]) => n > 0);
  const photos = guidePreview(data);
  const parts = counts.map(([key, n]) => CATEGORY_META[key].count(n));
  const summary = parts.length > 1 ? `${parts.slice(0, -1).join(', ')} y ${parts[parts.length - 1]}` : parts[0] || '';
  return (
    <button type="button" className="guide-cta" onClick={() => onOpen?.()} aria-label={`Qué visitar en ${state.nombre}: pueblos mágicos, historia, destinos y cocina`}>
      <span className={`guide-cta-photos n${photos.length}`} aria-hidden="true">
        {photos.length ? photos.map((item) => <img key={item.id} src={commonsThumb(item.imagen, 330)} alt="" loading="lazy" decoding="async" onError={(event) => { if (!retryCommons(event.currentTarget)) event.currentTarget.style.visibility = 'hidden'; }} />) : <span className="guide-cta-empty" />}
      </span>
      <span className="guide-cta-row">
        <span className="guide-cta-text">
          <strong>Qué visitar en {state.nombreCorto}</strong>
          <span>{isLoading ? 'Cargando la guía…' : summary || 'Pueblos, historia, destinos y cocina'}</span>
        </span>
        <ArrowRight size={18} aria-hidden="true" className="guide-cta-arrow" />
      </span>
    </button>
  );
}

export default function StatePanelV2({ selectedState, onSelectState, onOpenPlace, onExploreState, onOpenGuide }) {
  const panelRef = useRef(null);
  const cve = selectedState?.cve;

  // Al cambiar de estado: volver al inicio del panel.
  const firstRender = useRef(true);
  useEffect(() => {
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
  const regionLabel = REGION_LABELS[String(selectedState.region || '').toLowerCase()] || selectedState.region || 'México';

  const season = getTravelSeason(selectedState.cve);

  return (
    <aside className="atlas-sidebar sp" id="panel-estado" ref={panelRef} tabIndex={-1} aria-label={`Información de ${selectedState.nombre}`}>
      <figure className="sp-hero">
        <StatePhoto key={selectedState.cve} stateCode={selectedState.cve} stateName={selectedState.nombre} />
      </figure>

      <div className="sp-body">
        <header className="sp-head">
          <p className="sp-region">Región {regionLabel}</p>
          <h2 className="sp-name">{selectedState.nombre}</h2>
          <p className="sp-capital">Capital: {selectedState.capital}</p>
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
        />

        <div className="sp-actions">
          <GuideButton state={selectedState} onOpen={() => onOpenGuide?.()} />
          <button type="button" className="sp-mun-btn" onClick={() => onExploreState?.(selectedState)}><MapIcon size={17} aria-hidden="true" /><span>Mapa de {selectedState.cve === '09' ? 'alcaldías' : 'municipios'}</span><ArrowRight size={16} aria-hidden="true" /></button>
        </div>

        {neighborKeys.length > 0 && <p className="sp-neighbors">
          Colinda con{' '}
          {neighborKeys.map((neighborCve, index) => {
            const nState = getEstadoByCve(neighborCve);
            if (!nState) return null;
            const separator = index === neighborKeys.length - 1 ? '' : index === neighborKeys.length - 2 ? ' y ' : ', ';
            return <React.Fragment key={neighborCve}><button type="button" onClick={() => onSelectState?.(nState)}>{nState.nombreCorto}</button>{separator}</React.Fragment>;
          })}.
        </p>}

      </div>
    </aside>
  );
}
