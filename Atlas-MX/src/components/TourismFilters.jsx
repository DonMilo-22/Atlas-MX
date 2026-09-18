import React from 'react';
import { Castle, Compass, Trees, Utensils, Waves, Waypoints } from 'lucide-react';
import { TOURISM_FILTERS } from '../data/tourismCategories';

const ICONS = {
  todos: Compass,
  naturaleza: Trees,
  playas: Waves,
  pueblos: Waypoints,
  historia: Castle,
  gastronomia: Utensils
};

export default function TourismFilters({ activeFilter, onChange }) {
  return (
    <div className="tourism-map-filters" aria-label="Filtrar el mapa por tipo de turismo">
      <span className="tourism-map-filters-title">Explorar por</span>
      <div className="tourism-map-filter-list" role="toolbar" aria-label="Categorías turísticas">
        {TOURISM_FILTERS.map((filter) => {
          const Icon = ICONS[filter.id];
          const isActive = activeFilter === filter.id;
          return (
            <button key={filter.id} type="button" className={`tourism-map-filter ${isActive ? 'active' : ''}`} onClick={() => onChange?.(filter.id)} aria-pressed={isActive} title={`Mostrar ${filter.label.toLocaleLowerCase('es-MX')}`}>
              <Icon size={14} aria-hidden="true" />
              <span>{filter.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
