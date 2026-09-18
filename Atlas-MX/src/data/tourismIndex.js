import { ESTADOS } from '@webrek/mx-geo';
import { TOURISM_DATA } from './states.js';
import { enrichTourismData } from './tourismEnhancer.js';

const NATURE_WORDS = ['bosque', 'biosfera', 'cañón', 'cascada', 'cenote', 'cerro', 'desierto', 'gruta', 'hierve', 'isla', 'laguna', 'lago', 'montaña', 'nevado', 'parque', 'pico', 'reserva', 'río', 'sierra', 'sótano', 'volcán'];
const COAST_WORDS = ['playa', 'bahía', 'cabo', 'costa', 'malecón', 'mar', 'arrecife', 'puerto', 'celestún', 'coloradas'];
const normalize = (value = '') => value.toLocaleLowerCase('es-MX');
const matches = (item, words) => words.some((word) => normalize(`${item?.nombre || ''} ${item?.descripcion || ''}`).includes(word));

function addItems(target, items, state, category, predicate = () => true) {
  items.filter(predicate).forEach((item, index) => target.push({
    id: `${state.cve}:${category}:${item?.nombre || index}`,
    name: item?.nombre || String(item),
    description: item?.descripcion || '',
    stateCode: state.cve,
    stateName: state.nombre,
    category
  }));
}

export const TOURISM_INDEX = ESTADOS.flatMap((state) => {
  const tourism = enrichTourismData(state.cve, TOURISM_DATA[state.cve]?.turismo || {});
  const results = [];
  addItems(results, [...tourism.destinos, ...tourism.playas], state, 'naturaleza', (item) => matches(item, NATURE_WORDS));
  addItems(results, [...tourism.playas, ...tourism.destinos], state, 'playas', (item) => matches(item, COAST_WORDS));
  addItems(results, tourism.pueblosMagicos, state, 'pueblos');
  addItems(results, tourism.arqueologia, state, 'historia');
  addItems(results, tourism.gastronomia, state, 'gastronomia');
  return results;
}).filter((item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index);

export function searchTourism(category, query = '') {
  const normalizedQuery = normalize(query.trim());
  return TOURISM_INDEX.filter((item) => {
    if (category !== 'todos' && item.category !== category) return false;
    if (!normalizedQuery) return true;
    return normalize(`${item.name} ${item.stateName} ${item.description}`).includes(normalizedQuery);
  });
}
