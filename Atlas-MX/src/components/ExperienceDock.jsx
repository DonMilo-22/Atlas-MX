import React from 'react';
import { BarChart3, CalendarDays, CalendarHeart, Sparkles } from 'lucide-react';

export default function ExperienceDock({ onOpenPlanner, onOpenCompare, onOpenQuiz, onOpenCalendar }) {
  return <nav className="experience-dock" aria-label="Herramientas para planear el viaje">
    <button type="button" onClick={onOpenPlanner} title="Planear viaje"><CalendarDays size={15} aria-hidden="true" /><span>Planear viaje</span></button>
    <button type="button" onClick={onOpenCompare} title="Comparar estados"><BarChart3 size={15} aria-hidden="true" /><span>Comparar</span></button>
    <button type="button" onClick={onOpenQuiz} title="Descubre tu destino"><Sparkles size={15} aria-hidden="true" /><span>Descubrir</span></button>
    <button type="button" onClick={onOpenCalendar} title="Agenda cultural"><CalendarHeart size={15} aria-hidden="true" /><span>Agenda</span></button>
  </nav>;
}
