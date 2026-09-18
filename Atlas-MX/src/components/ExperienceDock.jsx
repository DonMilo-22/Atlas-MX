import React from 'react';
import { BarChart3, CalendarDays, Sparkles } from 'lucide-react';

export default function ExperienceDock({ onOpenPlanner, onOpenCompare, onOpenQuiz }) {
  return <nav className="experience-dock" aria-label="Herramientas para planear el viaje">
    <button type="button" onClick={onOpenPlanner}><CalendarDays size={15} /><span>Planear viaje</span></button>
    <button type="button" onClick={onOpenCompare}><BarChart3 size={15} /><span>Comparar</span></button>
    <button type="button" onClick={onOpenQuiz}><Sparkles size={15} /><span>Descubrir</span></button>
  </nav>;
}
