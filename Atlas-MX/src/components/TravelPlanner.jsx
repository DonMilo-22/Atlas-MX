import React, { useMemo, useState } from 'react';
import { CalendarDays, Clock3, MapPin, WalletCards, X } from 'lucide-react';
import { ESTADOS } from '@webrek/mx-geo';
import { BUDGET_LEVELS, createItinerary, INTERESTS } from '../utils/planner';

const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

export default function TravelPlanner({ isOpen, initialState, onClose, onOpenLocation }) {
  const [stateCode, setStateCode] = useState(initialState?.cve || '31');
  const [days, setDays] = useState(3);
  const [interest, setInterest] = useState('variado');
  const [budget, setBudget] = useState('medio');
  const selectedState = ESTADOS.find((state) => state.cve === stateCode) || ESTADOS[0];
  const plan = useMemo(() => createItinerary({ stateCode, days, interest, budget }), [stateCode, days, interest, budget]);

  if (!isOpen) return null;
  return <div className="experience-modal-layer" role="dialog" aria-modal="true" aria-label="Planificador de viaje">
    <button type="button" className="experience-modal-backdrop" onClick={onClose} aria-label="Cerrar planificador" />
    <section className="experience-modal planner-modal">
      <header className="experience-modal-head"><div><span><CalendarDays size={13} /> Herramienta Atlas MX</span><h2>Planifica tu viaje</h2><p>Crea una ruta sencilla con lugares reales del estado.</p></div><button type="button" onClick={onClose} aria-label="Cerrar planificador"><X size={19} /></button></header>
      <div className="planner-layout">
        <aside className="planner-controls">
          <label>Estado<select value={stateCode} onChange={(event) => setStateCode(event.target.value)}>{ESTADOS.map((state) => <option key={state.cve} value={state.cve}>{state.nombre}</option>)}</select></label>
          <label>Días<input type="range" min="1" max="7" value={days} onChange={(event) => setDays(event.target.value)} /><strong>{days} {Number(days) === 1 ? 'día' : 'días'}</strong></label>
          <label>Tipo de viaje<select value={interest} onChange={(event) => setInterest(event.target.value)}>{INTERESTS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
          <label>Presupuesto<select value={budget} onChange={(event) => setBudget(event.target.value)}>{Object.entries(BUDGET_LEVELS).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}</select></label>
          <div className="planner-budget-card"><WalletCards size={18} /><span>Estimado para {days} días<strong>{money.format(plan.total)}</strong><small>{money.format(plan.budgetData.daily)} por persona al día</small></span></div>
          <p className="estimate-note">Estimación orientativa en pesos mexicanos. No incluye transporte hasta el estado.</p>
        </aside>
        <main className="planner-days">
          <div className="planner-days-title"><div><span>Tu recorrido sugerido</span><h3>{selectedState.nombre}</h3></div><span><Clock3 size={13} /> {days} días</span></div>
          {plan.itinerary.map((day) => <article key={day.day} className="planner-day-card">
            <b>DÍA {day.day}</b><div>
              {[['Mañana', day.morning], ['Tarde', day.afternoon], ['Sabor local', day.food]].map(([label, place]) => place && <button key={label} type="button" onClick={() => onOpenLocation?.(place.name, selectedState.nombre, place.category)}><span>{label}</span><strong>{place.name}</strong><small><MapPin size={10} /> Ver ubicación</small></button>)}
            </div>
          </article>)}
        </main>
      </div>
    </section>
  </div>;
}
