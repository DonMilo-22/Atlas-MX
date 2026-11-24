import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BedDouble, Clock, CloudSun, ExternalLink, Globe, Images, Landmark, MapPin, Navigation, Phone, RefreshCw, Star, UtensilsCrossed, X } from 'lucide-react';
import { ESTADOS } from '@webrek/mx-geo';
import { getCategoryLabel } from '../data/tourismCategories';
import { useLocatePlace, useNearbyPlaces, useWeatherAt } from '../hooks/useLiveData';
import { useRealPhotoGallery } from '../hooks/useRealPhoto';
import useDialog from '../hooks/useDialog';
import { describeWeather } from '../services/weatherService';
import { formatDistance } from '../services/poiService';
import { PLACEHOLDER } from '../services/photoService';
import PlaceMap from './PlaceMap';
import WikiSummary from './WikiSummary';
import WeatherIcon from './WeatherIcon';
import PhotoLightbox from './PhotoLightbox';

const TABS = [
  { id: 'resumen', label: 'Resumen', icon: MapPin },
  { id: 'hoteles', label: 'Hoteles', icon: BedDouble },
  { id: 'restaurantes', label: 'Restaurantes', icon: UtensilsCrossed },
  { id: 'atractivos', label: 'Qué ver', icon: Landmark },
  { id: 'clima', label: 'Clima', icon: CloudSun }
];
const EMPTY_TEXT = { hoteles: 'hospedajes', restaurantes: 'restaurantes ni cafés', atractivos: 'museos, monumentos ni atractivos' };
const dayName = new Intl.DateTimeFormat('es-MX', { weekday: 'long' });

function PoiDetail({ poi, onBack }) {
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${poi.lat},${poi.lon}`;
  const prices = `https://www.google.com/travel/search?q=${encodeURIComponent(`${poi.name} ${poi.address}`)}`;
  return (
    <article className="poi-detail" aria-live="polite">
      <button type="button" className="poi-back" onClick={onBack}><ArrowLeft size={15} aria-hidden="true" /> Volver a la lista</button>
      <h3>{poi.name}</h3>
      <p className="poi-detail-kind">
        {poi.kind}{poi.stars ? <span className="poi-stars" aria-label={`${poi.stars} estrellas`}>{' '}{'★'.repeat(Math.min(poi.stars, 5))}</span> : null}
        {' '}a {formatDistance(poi.distance)}
      </p>
      <dl className="poi-facts">
        {poi.cuisine && <div><dt>Cocina</dt><dd>{poi.cuisine}</dd></div>}
        {poi.address && <div><dt>Dirección</dt><dd>{poi.address}</dd></div>}
        {poi.hours && <div><dt><Clock size={13} aria-hidden="true" /> Horario</dt><dd>{poi.hours}</dd></div>}
        {poi.phone && <div><dt><Phone size={13} aria-hidden="true" /> Teléfono</dt><dd><a href={`tel:${poi.phone.replace(/\s+/g, '')}`}>{poi.phone}</a></dd></div>}
        {poi.website && <div><dt><Globe size={13} aria-hidden="true" /> Sitio web</dt><dd><a href={poi.website} target="_blank" rel="noopener noreferrer">{poi.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</a></dd></div>}
      </dl>
      {!poi.address && !poi.hours && !poi.phone && !poi.website && <p className="poi-note">OpenStreetMap aún no tiene horario ni contacto de este lugar.</p>}
      <div className="poi-links">
        <a href={directions} target="_blank" rel="noopener noreferrer"><Navigation size={14} aria-hidden="true" /> Cómo llegar</a>
        {poi.category === 'hoteles' && <a href={prices} target="_blank" rel="noopener noreferrer"><ExternalLink size={14} aria-hidden="true" /> Ver precios</a>}
        <a href={poi.osmUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={14} aria-hidden="true" /> OpenStreetMap</a>
      </div>
    </article>
  );
}

function PoiList({ category, nearby, onSelect, onRetry }) {
  if (nearby.isLoading) return <div className="poi-loading" aria-busy="true"><span className="skeleton-line wide" /><span className="skeleton-line" /><span className="skeleton-line wide" /><span className="skeleton-line" /></div>;
  if (nearby.error || !nearby.data) {
    return <div className="poi-empty"><p>No pudimos consultar OpenStreetMap en este momento.</p><button type="button" onClick={onRetry}><RefreshCw size={14} aria-hidden="true" /> Reintentar</button></div>;
  }
  const items = nearby.data[category] || [];
  if (!items.length) return <div className="poi-empty"><p>OpenStreetMap no registra {EMPTY_TEXT[category]} a menos de {formatDistance(nearby.data.radius)}.</p></div>;
  return (
    <ul className="poi-list">
      {items.map((poi) => (
        <li key={poi.id}>
          <button type="button" onClick={() => onSelect(poi.id)}>
            <span className="poi-row-name">{poi.name}</span>
            <span className="poi-row-meta">{poi.kind}{poi.stars ? `, ${poi.stars}★` : ''}{poi.cuisine ? `, ${poi.cuisine}` : ''}</span>
            <span className="poi-row-distance">{formatDistance(poi.distance)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function PlaceWeather({ location }) {
  const { data, isLoading } = useWeatherAt(location);
  if (isLoading) return <div className="poi-loading" aria-busy="true"><span className="skeleton-line wide" /><span className="skeleton-line" /></div>;
  if (!data) return <div className="poi-empty"><p>No pudimos consultar el clima en este momento.</p></div>;
  const now = describeWeather(data.current.code);
  return (
    <section className="place-weather">
      <div className="live-weather-now">
        <WeatherIcon icon={now.icon} isDay={data.current.isDay} size={30} />
        <strong>{data.current.temp}°</strong>
        <span><b>{now.label}</b><small><span className="live-dot" aria-hidden="true" /> En vivo: sensación de {data.current.feels}°, humedad {data.current.humidity}%, viento {data.current.wind} km/h</small></span>
      </div>
      <ol className="place-weather-days">
        {data.daily.map((day, index) => {
          const info = describeWeather(day.code);
          return (
            <li key={day.date}>
              <span className="place-weather-day">{index === 0 ? 'Hoy' : dayName.format(new Date(`${day.date}T12:00:00`))}</span>
              <WeatherIcon icon={info.icon} size={16} />
              <span className="place-weather-label">{info.label}{day.rain != null ? `, ${day.rain}% lluvia` : ''}</span>
              <b>{day.max}°</b><span className="place-weather-min">{day.min}°</span>
            </li>
          );
        })}
      </ol>
      <p className="poi-note">Pronóstico de Open-Meteo para este punto exacto.</p>
    </section>
  );
}

export default function PlaceExplorer({ isOpen, onClose, placeName, stateName, category, coords = null, near = null, initialTab = 'resumen' }) {
  const stateCode = useMemo(() => ESTADOS.find((state) => state.nombre === stateName)?.cve || '', [stateName]);
  const [tab, setTab] = useState(initialTab);
  const [selectedId, setSelectedId] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const ref = useDialog(isOpen, onClose);

  const located = useLocatePlace({ name: placeName, stateName, stateCode, coords, near });
  const location = located.data;
  const nearby = useNearbyPlaces(location, attempt);
  const { photos, isLoading: photosLoading } = useRealPhotoGallery(placeName, stateName, 6);

  useEffect(() => { setTab(initialTab); setSelectedId(null); setLightboxIndex(null); }, [placeName, stateName, initialTab]);

  const activeList = ['hoteles', 'restaurantes', 'atractivos'].includes(tab) && nearby.data ? nearby.data[tab] : [];
  const selected = activeList.find((poi) => poi.id === selectedId) || null;
  const categoryLabel = getCategoryLabel(category) || 'Lugar';
  const googleUrl = location?.precise
    ? `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lon}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${placeName}, ${stateName}, México`)}`;

  if (!isOpen || !placeName) return null;

  const countFor = (id) => (nearby.data && nearby.data[id] ? nearby.data[id].length : null);
  const selectTab = (id) => { setTab(id); setSelectedId(null); };

  return (
    <div className="modal-backdrop explorer-backdrop" onClick={onClose}>
      <div className="explorer-dialog" ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="explorer-title" onClick={(event) => event.stopPropagation()}>
        <aside className="explorer-side">
          <header className="explorer-head">
            <div>
              <p className="explorer-kicker">{categoryLabel} en {stateName}</p>
              <h2 id="explorer-title">{placeName}</h2>
              {located.isLoading && <p className="explorer-precision">Ubicando el lugar…</p>}
              {location && !location.precise && <p className="explorer-precision is-approx">No encontramos el punto exacto; el mapa muestra la zona de {stateName}.</p>}
            </div>
            <button type="button" className="explorer-close" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
          </header>

          <div className="explorer-tabs" role="tablist" aria-label="Información del lugar">
            {TABS.map(({ id, label, icon: Icon }) => {
              const count = countFor(id);
              return (
                <button key={id} type="button" role="tab" id={`xtab-${id}`} aria-selected={tab === id} aria-controls="explorer-panel" className={tab === id ? 'active' : ''} onClick={() => selectTab(id)}>
                  <Icon size={15} aria-hidden="true" /> {label}{count != null && <span>{count}</span>}
                </button>
              );
            })}
          </div>

          <div className="explorer-panel" id="explorer-panel" role="tabpanel" aria-labelledby={`xtab-${tab}`}>
            {tab === 'resumen' && (
              <>
                <button type="button" className={`explorer-photo ${photosLoading ? 'is-loading' : ''}`} onClick={() => photos.length && setLightboxIndex(0)} disabled={!photos.length} aria-label={photos.length ? `Ver ${photos.length} fotos de ${placeName}` : 'Sin fotografías'}>
                  <img src={photos[0] || PLACEHOLDER} alt="" />
                  {photos.length > 1 && <span><Images size={13} aria-hidden="true" /> {photos.length} fotos</span>}
                </button>
                <WikiSummary name={placeName} stateName={stateName} title="De Wikipedia" fallback={<p className="poi-note">Wikipedia no tiene un artículo sobre este lugar. Revisa las pestañas de hoteles, restaurantes y qué ver para explorar la zona.</p>} />
                <div className="explorer-quick">
                  {['hoteles', 'restaurantes', 'atractivos'].map((id) => (
                    <button key={id} type="button" onClick={() => selectTab(id)}>
                      <strong>{countFor(id) ?? '…'}</strong>
                      <span>{TABS.find((item) => item.id === id).label.toLocaleLowerCase('es-MX')} cerca</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            {['hoteles', 'restaurantes', 'atractivos'].includes(tab) && (
              selected
                ? <PoiDetail poi={selected} onBack={() => setSelectedId(null)} />
                : <PoiList category={tab} nearby={nearby} onSelect={setSelectedId} onRetry={() => setAttempt((value) => value + 1)} />
            )}
            {tab === 'clima' && location && <PlaceWeather location={location} />}
          </div>

          <footer className="explorer-foot">
            <span>Datos de OpenStreetMap, Wikipedia y Open-Meteo.</span>
            <a href={googleUrl} target="_blank" rel="noopener noreferrer">Abrir en Google Maps <ExternalLink size={12} aria-hidden="true" /></a>
          </footer>
        </aside>

        <div className="explorer-map">
          {location
            ? <PlaceMap center={location} precise={location.precise} title={placeName} pois={activeList} selectedId={selectedId} onSelect={setSelectedId} />
            : <div className="explorer-map-loading" aria-hidden="true">Ubicando…</div>}
        </div>
      </div>
      {lightboxIndex !== null && <PhotoLightbox photos={photos} initialIndex={lightboxIndex} placeName={placeName} onClose={() => setLightboxIndex(null)} />}
    </div>
  );
}
