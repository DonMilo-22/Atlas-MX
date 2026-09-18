import React, { useMemo, useState } from 'react';
import { ChefHat, MapPin, Utensils, X } from 'lucide-react';
import { estado as getEstadoByCve } from '@webrek/mx-geo';
import MexicoMap from './MexicoMap';
import RealPhoto from './RealPhoto';
import { TOURISM_INDEX } from '../data/tourismIndex';

export default function GastronomyMapModal({ isOpen, initialState, onClose, onOpenLocation }) {
  const [selected, setSelected] = useState(initialState || getEstadoByCve('20'));
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dishes = useMemo(() => TOURISM_INDEX.filter((item) => item.stateCode === selected?.cve && item.category === 'gastronomia'), [selected]);
  if (!isOpen) return null;
  return <div className="experience-modal-layer" role="dialog" aria-modal="true" aria-label="Mapa gastronómico de México">
    <button type="button" className="experience-modal-backdrop" onClick={onClose} aria-label="Cerrar mapa gastronómico" />
    <section className="experience-modal gastronomy-modal">
      <header className="experience-modal-head"><div><span><ChefHat size={13} /> Sabores de México</span><h2>Mapa gastronómico</h2><p>Selecciona un estado y descubre qué probar.</p></div><button type="button" onClick={onClose} aria-label="Cerrar mapa gastronómico"><X size={19} /></button></header>
      <div className="gastronomy-layout">
        <div className="gastronomy-map"><MexicoMap selectedState={selected} onSelectState={setSelected} zoom={zoom} setZoom={setZoom} pan={pan} setPan={setPan} showLabels tourismFilter="gastronomia" /></div>
        <aside className="gastronomy-dishes"><div className="gastronomy-dishes-head"><span><Utensils size={13} /> Cocina regional</span><h3>{selected?.nombre}</h3><p>Platillos y productos tradicionales documentados en Atlas MX.</p></div><div>{dishes.map((dish) => <button key={dish.id} type="button" onClick={() => onOpenLocation?.(dish.name, selected.nombre, 'Gastronomía')}><RealPhoto name={dish.name} stateName={selected.nombre} alt={`${dish.name}, ${selected.nombre}`} /><span><strong>{dish.name}</strong><small><MapPin size={10} /> Buscar dónde probarlo</small></span></button>)}</div></aside>
      </div>
    </section>
  </div>;
}
