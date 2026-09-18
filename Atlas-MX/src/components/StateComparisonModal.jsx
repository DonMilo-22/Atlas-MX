import React, { useMemo, useState } from 'react';
import { ArrowRight, BarChart3, CalendarRange, MapPin, X } from 'lucide-react';
import { ESTADOS } from '@webrek/mx-geo';
import { TOURISM_DATA } from '../data/states';
import { TOURISM_INDEX } from '../data/tourismIndex';
import { getTravelSeason } from '../data/travelSeasons';
import { formatArea, formatPopulation } from '../utils/map';

const CATEGORIES = [['naturaleza', 'Naturaleza'], ['playas', 'Playas'], ['pueblos', 'Pueblos'], ['historia', 'Historia'], ['gastronomia', 'Gastronomía']];

function profile(state) {
  const items = TOURISM_INDEX.filter((item) => item.stateCode === state.cve);
  return {
    state,
    climate: TOURISM_DATA[state.cve]?.turismo?.clima || 'Clima regional variable',
    season: getTravelSeason(state.cve),
    counts: Object.fromEntries(CATEGORIES.map(([id]) => [id, items.filter((item) => item.category === id).length]))
  };
}

export default function StateComparisonModal({ isOpen, initialState, onClose, onSelectState }) {
  const [leftCode, setLeftCode] = useState(initialState?.cve || '20');
  const [rightCode, setRightCode] = useState(initialState?.cve === '31' ? '14' : '31');
  const left = useMemo(() => profile(ESTADOS.find((state) => state.cve === leftCode) || ESTADOS[0]), [leftCode]);
  const right = useMemo(() => profile(ESTADOS.find((state) => state.cve === rightCode) || ESTADOS[1]), [rightCode]);
  if (!isOpen) return null;

  const cells = [
    ['Capital', left.state.capital, right.state.capital],
    ['Población', formatPopulation(left.state.poblacion), formatPopulation(right.state.poblacion)],
    ['Superficie', formatArea(left.state.superficie), formatArea(right.state.superficie)],
    ['Clima', left.climate, right.climate],
    ['Mejor temporada', left.season.window, right.season.window]
  ];

  return <div className="experience-modal-layer" role="dialog" aria-modal="true" aria-label="Comparador de estados">
    <button type="button" className="experience-modal-backdrop" onClick={onClose} aria-label="Cerrar comparador" />
    <section className="experience-modal comparison-modal">
      <header className="experience-modal-head"><div><span><BarChart3 size={13} /> Comparador Atlas MX</span><h2>¿Qué estado visitar?</h2><p>Contrasta territorio, clima y variedad turística.</p></div><button type="button" onClick={onClose} aria-label="Cerrar comparador"><X size={19} /></button></header>
      <div className="comparison-selectors"><label>Destino A<select value={leftCode} onChange={(event) => setLeftCode(event.target.value)}>{ESTADOS.map((state) => <option key={state.cve} value={state.cve}>{state.nombre}</option>)}</select></label><span>VS</span><label>Destino B<select value={rightCode} onChange={(event) => setRightCode(event.target.value)}>{ESTADOS.map((state) => <option key={state.cve} value={state.cve}>{state.nombre}</option>)}</select></label></div>
      <div className="comparison-table">
        <div className="comparison-state-head"><span /><div><MapPin size={15} /><strong>{left.state.nombre}</strong></div><div><MapPin size={15} /><strong>{right.state.nombre}</strong></div></div>
        {cells.map(([label, leftValue, rightValue]) => <div className="comparison-row" key={label}><b>{label}</b><span>{leftValue}</span><span>{rightValue}</span></div>)}
        {CATEGORIES.map(([id, label]) => <div className="comparison-row comparison-count" key={id}><b>{label}</b><span><i style={{ width: `${Math.min(100, left.counts[id] * 12)}%` }} />{left.counts[id]} opciones</span><span><i style={{ width: `${Math.min(100, right.counts[id] * 12)}%` }} />{right.counts[id]} opciones</span></div>)}
      </div>
      <div className="comparison-actions"><small><CalendarRange size={12} /> Los conteos usan los lugares disponibles actualmente en Atlas MX.</small><div><button type="button" onClick={() => onSelectState?.(left.state)}>Explorar {left.state.nombreCorto}<ArrowRight size={13} /></button><button type="button" onClick={() => onSelectState?.(right.state)}>Explorar {right.state.nombreCorto}<ArrowRight size={13} /></button></div></div>
    </section>
  </div>;
}
