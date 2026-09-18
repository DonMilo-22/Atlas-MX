import React from 'react';
import { BarChart3, CalendarDays, CalendarHeart, Sparkles, Utensils } from 'lucide-react';

export default function ExperienceDock({ onOpenPlanner, onOpenCompare, onOpenQuiz, onOpenFood, onOpenCalendar }) {
  return <nav className="experience-dock" aria-label="Herramientas para planear el viaje">
    <button type="button" onClick={onOpenPlanner}><CalendarDays size={15} /><span>Planear viaje</span></button>
    <button type="button" onClick={onOpenCompare}><BarChart3 size={15} /><span>Comparar</span></button>
    <button type="button" onClick={onOpenQuiz}><Sparkles size={15} /><span>Descubrir</span></button>
    <button type="button" onClick={onOpenFood}><Utensils size={15} /><span>Sabores</span></button>
    <button type="button" onClick={onOpenCalendar}><CalendarHeart size={15} /><span>Agenda</span></button>
  </nav>;
}
