import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Castle, Compass, Search, Trees, Utensils, Waves, Waypoints, X } from 'lucide-react';
import { TOURISM_FILTERS } from '../data/tourismCategories';
import { searchTourism } from '../data/tourismIndex';

const ICONS = {
  todos: Compass,
  naturaleza: Trees,
  playas: Waves,
  pueblos: Waypoints,
  historia: Castle,
  gastronomia: Utensils
};

export default function TourismFilters({ activeFilter, onChange, onOpenResult }) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchTourism(activeFilter, query), [activeFilter, query]);
  const visibleResults = results.slice(0, 12);
  const chooseFilter = (filterId) => { setQuery(''); onChange?.(filterId); };

  return (
    <div className={`tourism-map-filters ${activeFilter !== 'todos' ? 'expanded' : ''}`} aria-label="Explorador turístico por categoría">
      <span className="tourism-map-filters-title">Explorar por</span>
      <div className="tourism-map-filter-list" role="toolbar" aria-label="Categorías turísticas">
        {TOURISM_FILTERS.map((filter) => {
          const Icon = ICONS[filter.id];
          const isActive = activeFilter === filter.id;
          return (
            <button key={filter.id} type="button" className={`tourism-map-filter ${isActive ? 'active' : ''}`} onClick={() => chooseFilter(filter.id)} aria-pressed={isActive} title={`Mostrar ${filter.label.toLocaleLowerCase('es-MX')}`}>
              <Icon size={14} aria-hidden="true" />
              <span>{filter.shortLabel}</span>
            </button>
          );
        })}
      </div>
      {activeFilter !== 'todos' && <div className="tourism-discovery-results">
        <div className="tourism-discovery-head">
          <label><Search size={13} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar lugar o estado…" aria-label="Buscar dentro de la categoría" /></label>
          <span>{results.length} resultados reales</span>
          <button type="button" onClick={() => chooseFilter('todos')} aria-label="Cerrar explorador"><X size={14} /></button>
        </div>
        {visibleResults.length > 0 ? <div className="tourism-result-strip">
          {visibleResults.map((result) => <button key={result.id} type="button" onClick={() => onOpenResult?.(result)}><span>{result.stateName}</span><strong>{result.name}</strong><small>Explorar <ArrowUpRight size={10} /></small></button>)}
        </div> : <div className="tourism-results-empty">No encontramos coincidencias. Prueba con otro lugar o estado.</div>}
      </div>}
    </div>
  );
}
