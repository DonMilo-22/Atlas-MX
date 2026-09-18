import { TOURISM_DATA } from './states.js';
import { enrichTourismData } from './tourismEnhancer.js';

export const TOURISM_FILTERS = [
  { id: 'todos', label: 'Todo México', shortLabel: 'Todo' },
  { id: 'naturaleza', label: 'Naturaleza', shortLabel: 'Naturaleza' },
  { id: 'playas', label: 'Playas', shortLabel: 'Playas' },
  { id: 'pueblos', label: 'Pueblos', shortLabel: 'Pueblos' },
  { id: 'historia', label: 'Historia', shortLabel: 'Historia' },
  { id: 'gastronomia', label: 'Gastronomía', shortLabel: 'Cocina' }
];

const NATURE_WORDS = [
  'bosque', 'biosfera', 'cañón', 'cascada', 'cenote', 'cerro', 'desierto', 'gruta',
  'isla', 'laguna', 'lago', 'montaña', 'nevado', 'parque', 'pico', 'reserva',
  'río', 'sierra', 'sótano', 'volcán'
];
const COAST_WORDS = ['playa', 'bahía', 'cabo', 'costa', 'malecón', 'mar', 'arrecife', 'puerto'];
const COASTAL_STATES = new Set(['02', '03', '04', '06', '07', '12', '14', '16', '18', '20', '23', '25', '26', '27', '28', '30', '31']);

function normalize(value = '') {
  return value.toLocaleLowerCase('es-MX');
}

function countMatching(items = [], words = []) {
  return items.filter((item) => {
    const searchable = normalize(`${item?.nombre || item || ''} ${item?.descripcion || ''}`);
    return words.some((word) => searchable.includes(word));
  }).length;
}

export function getStateCategoryStats(stateCode) {
  const source = TOURISM_DATA[stateCode]?.turismo || {};
  const tourism = enrichTourismData(stateCode, source);
  const destinations = tourism.destinos || [];
  const beaches = tourism.playas || [];

  return {
    todos: destinations.length + beaches.length + tourism.pueblosMagicos.length + tourism.arqueologia.length + tourism.gastronomia.length,
    naturaleza: countMatching([...destinations, ...beaches], NATURE_WORDS),
    playas: COASTAL_STATES.has(stateCode) ? Math.max(1, beaches.length + countMatching(destinations, COAST_WORDS)) : beaches.length,
    pueblos: tourism.pueblosMagicos.length,
    historia: tourism.arqueologia.length,
    gastronomia: tourism.gastronomia.length
  };
}

export function getFilterLabel(filterId) {
  return TOURISM_FILTERS.find((filter) => filter.id === filterId)?.label || 'Todo México';
}
