import React, { useMemo, useState } from 'react';
import { ArrowUpRight, CalendarHeart, Compass, ExternalLink, MapPin, Shuffle } from 'lucide-react';
import { ESTADOS, estado as getEstadoByCve } from '@webrek/mx-geo';
import SEARCH_INDEX from '../data/generated/index.json';
import { commonsThumb, toPlace, wikipediaUrl } from '../data/tourism';
import useStateTourism from '../hooks/useStateTourism';
import { CULTURAL_EVENTS, MONTHS } from '../data/culturalEvents';
import { getTravelSeason } from '../data/travelSeasons';
import { useStateWeather } from '../hooks/useLiveData';
import { describeWeather } from '../services/weatherService';
import { PLACEHOLDER } from '../services/photoService';
import WeatherIcon from './WeatherIcon';

const dateLabel = new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
// Candidatos a "destino del día": lugares verificados con foto y descripción (sin platillos).
const WITH_PHOTO = SEARCH_INDEX.filter((item) => item.p && item.c !== 'cocina');
const CANDIDATES = WITH_PHOTO.length ? WITH_PHOTO : SEARCH_INDEX.filter((item) => item.c !== 'cocina');

function dayOfYear(date) {
  return Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
}
// Mezcla determinista: el mismo día muestra lo mismo a todos, y cambia al día siguiente.
const pick = (list, seed) => list[((seed * 2654435761) >>> 0) % list.length];

export default function TodayInMexico({ onSelectState, onOpenPlace }) {
  const today = useMemo(() => new Date(), []);
  const seed = dayOfYear(today) + today.getFullYear() * 366;
  const month = today.getMonth() + 1;
  const [shuffle, setShuffle] = useState(0);

  const entry = pick(CANDIDATES, seed + shuffle * 7919);
  const destinationState = getEstadoByCve(entry.s);
  const { data: stateData } = useStateTourism(entry.s);
  const item = stateData?.categorias?.[entry.c]?.find((candidate) => candidate.id === entry.id) || null;
  const destination = item ? toPlace(item, entry.c, entry.s, destinationState?.nombre) : { id: entry.id, name: entry.n, category: entry.c, stateCode: entry.s, stateName: destinationState?.nombre || '' };
  const [failedImage, setFailedImage] = useState('');
  const imageUrl = item?.imagen && failedImage !== item.imagen ? commonsThumb(item.imagen, 1000) : PLACEHOLDER;
  const { data: weather } = useStateWeather(entry.s);
  const now = weather ? describeWeather(weather.current.code) : null;

  const monthEvents = CULTURAL_EVENTS.filter((event) => event.month === month);
  const upcoming = monthEvents.length ? monthEvents : CULTURAL_EVENTS.filter((event) => event.month === (month % 12) + 1);
  const event = upcoming.length ? pick(upcoming, seed) : null;
  const eventState = event ? getEstadoByCve(event.stateCode) : null;

  const seasonal = useMemo(() => {
    const list = ESTADOS.filter((state) => getTravelSeason(state.cve).bestMonths.includes(month));
    const offset = seed % Math.max(1, list.length);
    return [...list.slice(offset), ...list.slice(0, offset)].slice(0, 8);
  }, [month, seed]);

  return (
    <section className="today-mx" aria-labelledby="today-title">
      <figure className="sp-hero today-hero">
        <img src={imageUrl} alt={`${destination.name}, ${destination.stateName}`} decoding="async" onError={() => setFailedImage(item?.imagen || '')} />
        {now && <figcaption className="today-weather"><WeatherIcon icon={now.icon} isDay={weather.current.isDay} size={14} /> {weather.current.temp}° ahora en {destinationState?.capital}</figcaption>}
      </figure>

      <div className="sp-body">
        <header className="sp-head">
          <p className="sp-region"><span className="live-dot" aria-hidden="true" /> {dateLabel.format(today).replace(/^./, (c) => c.toUpperCase())}</p>
          <h2 className="sp-name today-name" id="today-title">{destination.name}</h2>
          <p className="sp-capital">{item?.tipo ? `${item.tipo} en ${destination.stateName}` : `Destino del día en ${destination.stateName}`}</p>
        </header>

        {item ? (
          item.descripcion && <div className="wiki-summary sp-section">
            <p>{item.descripcion}</p>
            {item.wiki && <a href={wikipediaUrl(item.wiki)} target="_blank" rel="noopener noreferrer">Leer más en Wikipedia <ExternalLink size={11} aria-hidden="true" /></a>}
          </div>
        ) : <div className="wiki-summary is-skeleton sp-section" aria-busy="true"><div className="skeleton-line wide" /><div className="skeleton-line wide" /><div className="skeleton-line" /></div>}

        <div className="sp-actions">
          <button type="button" className="sp-primary" onClick={() => onOpenPlace?.(destination)} disabled={!item}><MapPin size={17} aria-hidden="true" /><span>Ver ficha y mapa</span><ArrowUpRight size={16} aria-hidden="true" /></button>
          <div className="sp-secondary">
            <button type="button" onClick={() => destinationState && onSelectState?.(destinationState)}><Compass size={16} aria-hidden="true" /> Explorar {destinationState?.nombreCorto}</button>
            <button type="button" onClick={() => setShuffle((value) => value + 1)}><Shuffle size={16} aria-hidden="true" /> Otro destino</button>
          </div>
        </div>

        {event && (
          <p className="sp-section today-event-line">
            <CalendarHeart size={16} aria-hidden="true" />
            <span>{monthEvents.length ? `Este mes se celebra ` : `En ${MONTHS[event.month - 1].toLowerCase()} se celebra `}<button type="button" onClick={() => eventState && onSelectState?.(eventState)}>{event.name}</button>, en {event.location}.</span>
          </p>
        )}

        {seasonal.length > 0 && (
          <p className="sp-neighbors">
            Buena época ahora:{' '}
            {seasonal.slice(0, 6).map((state, index, list) => (
              <React.Fragment key={state.cve}><button type="button" onClick={() => onSelectState?.(state)}>{state.nombreCorto}</button>{index === list.length - 1 ? '.' : index === list.length - 2 ? ' y ' : ', '}</React.Fragment>
            ))}
          </p>
        )}

        <p className="sp-hint">Elige un estado en el mapa o búscalo arriba.</p>
      </div>
    </section>
  );
}
