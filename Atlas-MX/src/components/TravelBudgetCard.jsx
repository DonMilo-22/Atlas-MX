import React, { useMemo, useState } from 'react';
import { BedDouble, Bus, Soup, Ticket, WalletCards } from 'lucide-react';
import { getBudgetEstimate } from '../data/budgetProfiles';

const LEVELS = [['economico', 'Económico'], ['medio', 'Intermedio'], ['comodo', 'Cómodo']];
const ICONS = { Hospedaje: BedDouble, Alimentos: Soup, Transporte: Bus, Actividades: Ticket };
const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

export default function TravelBudgetCard({ stateCode }) {
  const [level, setLevel] = useState('medio');
  const [days, setDays] = useState(3);
  const estimate = useMemo(() => getBudgetEstimate(stateCode, level, days), [stateCode, level, days]);
  return <section className="travel-budget-card" aria-label="Presupuesto estimado">
    <div className="travel-budget-head"><span><WalletCards size={14} /> Presupuesto orientativo</span><strong>{money.format(estimate.minimum)}–{money.format(estimate.maximum)} / día</strong></div>
    <div className="budget-levels">{LEVELS.map(([id, label]) => <button key={id} type="button" className={level === id ? 'active' : ''} onClick={() => setLevel(id)}>{label}</button>)}</div>
    <div className="budget-breakdown">{Object.entries(estimate.breakdown).map(([name, value]) => { const Icon = ICONS[name]; return <span key={name}><Icon size={12} /><small>{name}</small><b>{money.format(value)}</b></span>; })}</div>
    <label className="budget-days">Duración<input type="range" min="1" max="7" value={days} onChange={(event) => setDays(Number(event.target.value))} /><strong>{days} días · {money.format(estimate.total)}</strong></label>
    <small className="budget-disclaimer">Por persona, sin transporte al destino. Los precios reales cambian según temporada y reservación.</small>
  </section>;
}
