import { ESTADOS } from '@webrek/mx-geo';
import { TOURISM_INDEX } from './tourismIndex.js';

export const TOURISM_FILTERS = [
  { id: 'todos', label: 'Todo México', shortLabel: 'Todo' },
  { id: 'naturaleza', label: 'Naturaleza', shortLabel: 'Naturaleza' },
  { id: 'playas', label: 'Playas', shortLabel: 'Playas' },
  { id: 'pueblos', label: 'Pueblos', shortLabel: 'Pueblos' },
  { id: 'historia', label: 'Historia', shortLabel: 'Historia' },
  { id: 'gastronomia', label: 'Gastronomía', shortLabel: 'Cocina' }
];

export const CATEGORY_LABELS = {
  naturaleza: 'Naturaleza',
  playas: 'Playa',
  pueblos: 'Pueblo o localidad',
  historia: 'Sitio histórico',
  gastronomia: 'Gastronomía'
};

// Conteos calculados una sola vez a partir del mismo índice que alimenta las listas,
// para que el mapa y los resultados nunca muestren cifras distintas.
const STATS = Object.fromEntries(ESTADOS.map((state) => {
  const items = TOURISM_INDEX.filter((item) => item.stateCode === state.cve);
  const counts = { todos: new Set(items.map((item) => item.name)).size };
  TOURISM_FILTERS.slice(1).forEach(({ id }) => { counts[id] = items.filter((item) => item.category === id).length; });
  return [state.cve, counts];
}));

const EMPTY = { todos: 0, naturaleza: 0, playas: 0, pueblos: 0, historia: 0, gastronomia: 0 };

export function getStateCategoryStats(stateCode) {
  return STATS[stateCode] || EMPTY;
}

export function getFilterLabel(filterId) {
  return TOURISM_FILTERS.find((filter) => filter.id === filterId)?.label || 'Todo México';
}

export function getCategoryLabel(categoryId) {
  return CATEGORY_LABELS[categoryId] || categoryId;
}
