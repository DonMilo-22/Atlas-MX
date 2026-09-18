import React from 'react';
import { CalendarDays } from 'lucide-react';

export default function ExperienceDock({ onOpenPlanner }) {
  return <nav className="experience-dock" aria-label="Herramientas para planear el viaje">
    <button type="button" onClick={onOpenPlanner}><CalendarDays size={15} /><span>Planear viaje</span></button>
  </nav>;
}
