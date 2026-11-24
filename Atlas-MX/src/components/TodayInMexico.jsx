import React, { useMemo, useState } from 'react';
import { ArrowUpRight, CalendarHeart, Compass, MapPin, Shuffle, Sparkles, Sun } from 'lucide-react';
import { ESTADOS, estado as getEstadoByCve } from '@webrek/mx-geo';
import { TOURISM_INDEX } from '../data/tourismIndex';
import { getCategoryLabel } from '../data/tourismCategories';
import { CULTURAL_EVENTS, MONTHS } from '../data/culturalEvents';
import { getTravelSeason } from '../data/travelSeasons';
import { useStateWeather } from '../hooks/useLiveData';
import { describeWeather } from '../services/weatherService';
import RealPhoto from './RealPhoto';
import WikiSummary from './WikiSummary';
import WeatherIcon from './WeatherIcon';

const dateLabel = new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
// Lugares candidatos a "destino del día" (sin platillos, sin repetir nombre).
const CANDIDATES = TOURISM_INDEX.filter((item, index, all) => item.category !== 'gastronomia' && all.findIndex((other) => other.name === item.name && other.stateCode === item.stateCode) === index);

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

  const destination = pick(CANDIDATES, seed + shuffle * 7919);
  const destinationState = getEstadoByCve(destination.stateCode);
  const { data: weather } = useStateWeather(destination.stateCode);
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
    <section className="today-mx" aria-label="Hoy en México">
      <header className="today-head">
        <span className="live-badge"><span className="live-dot" aria-hidden="true" /> Hoy en México</span>
        <h2>{dateLabel.format(today).replace(/^./, (c) => c.toUpperCase())}</h2>
        <p>Una selección que cambia cada día, con información en vivo de Wikipedia y Open-Meteo.</p>
      </header>

      <article className="today-destination">
        <div className="today-destination-media">
          <RealPhoto name={destination.name} stateName={destination.stateName} alt={`${destination.name}, ${destination.stateName}`} />
          <span className="today-chip"><Sparkles size={12} aria-hidden="true" /> Destino del día</span>
          {now && <span className="today-weather"><WeatherIcon icon={now.icon} isDay={weather.current.isDay} size={14} /> {weather.current.temp}° en {destinationState?.capital}</span>}
        </div>
        <div className="today-destination-body">
          <small>{getCategoryLabel(destination.category)} · {destination.stateName}</small>
          <h3>{destination.name}</h3>
          <WikiSummary key={`${destination.name}-${destination.stateName}`} name={destination.name} stateName={destination.stateName} title="Desde Wikipedia" fallback={destination.description && !/^Atractivo emblemático/.test(destination.description) ? <p className="today-fallback">{destination.description}</p> : null} />
          <div className="today-actions">
            <button type="button" className="today-primary" onClick={() => onOpenPlace?.(destination)}><MapPin size={14} /> Ver ficha y mapa</button>
            <button type="button" onClick={() => destinationState && onSelectState?.(destinationState)}><Compass size={14} /> Explorar {destinationState?.nombreCorto}</button>
            <button type="button" onClick={() => setShuffle((value) => value + 1)} aria-label="Mostrar otro destino"><Shuffle size={14} /> Otro</button>
          </div>
        </div>
      </article>

      {event && (
        <article className="today-event">
          <CalendarHeart size={18} aria-hidden="true" />
          <span>
            <small>{monthEvents.length ? `Se celebra en ${MONTHS[month - 1].toLowerCase()}` : `Próximamente, en ${MONTHS[event.month - 1].toLowerCase()}`}</small>
            <strong>{event.name}</strong>
            <em>{event.location}, {eventState?.nombre} · {event.theme}</em>
          </span>
          <button type="button" onClick={() => eventState && onSelectState?.(eventState)} aria-label={`Explorar ${eventState?.nombre}`}><ArrowUpRight size={15} /></button>
        </article>
      )}

      {seasonal.length > 0 && (
        <div className="today-season">
          <span className="section-kicker"><Sun size={12} aria-hidden="true" /> Buena temporada en {MONTHS[month - 1].toLowerCase()}</span>
          <div className="neighbor-chips">
            {seasonal.map((state) => <button key={state.cve} type="button" className="neighbor-chip" onClick={() => onSelectState?.(state)}>{state.nombreCorto}</button>)}
          </div>
        </div>
      )}
    </section>
  );
}
