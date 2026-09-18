import React, { useMemo, useState } from 'react';
import { CalendarHeart, MapPin, Search, X } from 'lucide-react';
import { ESTADOS } from '@webrek/mx-geo';
import { CULTURAL_EVENTS, MONTHS } from '../data/culturalEvents';

export default function CulturalCalendarModal({ isOpen, onClose, onSelectState }) {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [query, setQuery] = useState('');
  const results = useMemo(() => CULTURAL_EVENTS.filter((event) => {
    const state = ESTADOS.find((item) => item.cve === event.stateCode);
    const text = `${event.name} ${event.location} ${event.theme} ${state?.nombre || ''}`.toLocaleLowerCase('es-MX');
    return event.month === month && text.includes(query.toLocaleLowerCase('es-MX').trim());
  }), [month, query]);
  if (!isOpen) return null;

  return <div className="experience-modal-layer" role="dialog" aria-modal="true" aria-label="Agenda cultural de México">
    <button type="button" className="experience-modal-backdrop" onClick={onClose} aria-label="Cerrar agenda cultural" />
    <section className="experience-modal cultural-modal">
      <header className="experience-modal-head"><div><span><CalendarHeart size={13} /> Calendario anual</span><h2>Agenda cultural de México</h2><p>Encuentra una celebración representativa de cada estado.</p></div><button type="button" onClick={onClose} aria-label="Cerrar agenda cultural"><X size={19} /></button></header>
      <div className="cultural-months">{MONTHS.map((name, index) => <button key={name} type="button" className={month === index + 1 ? 'active' : ''} onClick={() => setMonth(index + 1)}>{name.slice(0,3)}</button>)}</div>
      <div className="cultural-tools"><div><strong>{MONTHS[month - 1]}</strong><span>{results.length} eventos destacados</span></div><label><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar estado o celebración…" /></label></div>
      <div className="cultural-events">{results.length ? results.map((event) => { const state = ESTADOS.find((item) => item.cve === event.stateCode); return <article key={event.stateCode}><time>{String(event.month).padStart(2,'0')}</time><span><small>{state?.nombre}</small><strong>{event.name}</strong><p>{event.theme}</p><b><MapPin size={11} /> {event.location}</b></span><button type="button" onClick={() => state && onSelectState?.(state)}>Explorar estado</button></article>; }) : <div className="cultural-empty">No hay coincidencias en este mes. Prueba otra búsqueda.</div>}</div>
      <footer className="cultural-note">Los meses son habituales y pueden cambiar cada año. Consulta las fuentes oficiales antes de organizar un viaje.</footer>
    </section>
  </div>;
}
