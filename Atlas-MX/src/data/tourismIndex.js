import { ESTADOS } from '@webrek/mx-geo';
import { TOURISM_DATA } from './states.js';
import { enrichTourismData } from './tourismEnhancer.js';

const NATURE_WORDS = ['bosque', 'biosfera', 'cañón', 'cañon', 'cascada', 'cascadas', 'cenote', 'cenotes', 'cerro', 'desierto', 'gruta', 'grutas', 'hierve', 'isla', 'islas', 'laguna', 'lagunas', 'lago', 'lagos', 'montaña', 'nevado', 'parque', 'pico', 'reserva', 'río', 'sierra', 'sótano', 'volcán', 'barrancas', 'manglar', 'manglares', 'selva'];
const COAST_WORDS = ['playa', 'playas', 'bahía', 'bahías', 'costa', 'costera', 'malecón', 'arrecife', 'arrecifes', 'caribe', 'litoral'];

const normalize = (value = '') => value.toLocaleLowerCase('es-MX');
// Para búsquedas: sin acentos, así "cancun" encuentra "Cancún".
const fold = (value = '') => normalize(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
// Coincidencia por palabra completa: evita que "mar" coincida con "San Marcos" o "Mariposa".
const wordsOf = (text) => new Set(normalize(text).split(/[^a-záéíóúüñ]+/i).filter(Boolean));
const matches = (item, words) => {
  const tokens = wordsOf(`${item?.nombre || ''} ${item?.descripcion || ''}`);
  return words.some((word) => tokens.has(word));
};

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
  addItems(results, tourism.destinos, state, 'naturaleza', (item) => matches(item, NATURE_WORDS));
  addItems(results, tourism.playas, state, 'playas');
  addItems(results, tourism.destinos, state, 'playas', (item) => matches(item, COAST_WORDS));
  addItems(results, tourism.pueblosMagicos, state, 'pueblos');
  addItems(results, tourism.arqueologia, state, 'historia');
  addItems(results, tourism.gastronomia, state, 'gastronomia');
  return results;
}).filter((item, index, all) => all.findIndex((candidate) => candidate.id === item.id) === index);

export function searchTourism(category, query = '') {
  const normalizedQuery = fold(query);
  return TOURISM_INDEX.filter((item) => {
    if (category !== 'todos' && item.category !== category) return false;
    if (!normalizedQuery) return true;
    return fold(`${item.name} ${item.stateName} ${item.description}`).includes(normalizedQuery);
  });
}

// Índice de todos los lugares (incluidos destinos sin categoría temática) para mostrar su descripción.
const PLACE_LOOKUP = new Map();
const KIND_BY_LIST = new Map();
ESTADOS.forEach((state) => {
  const tourism = enrichTourismData(state.cve, TOURISM_DATA[state.cve]?.turismo || {});
  [['destinos', 'Destino turístico'], ['playas', 'Playa'], ['pueblosMagicos', 'Pueblo o localidad'], ['arqueologia', 'Sitio histórico'], ['gastronomia', 'Gastronomía']]
    .forEach(([list, label]) => (tourism[list] || []).forEach((item) => { if (!KIND_BY_LIST.has(item)) KIND_BY_LIST.set(item, label); }));
  [...tourism.destinos, ...tourism.playas, ...tourism.pueblosMagicos, ...tourism.arqueologia, ...tourism.gastronomia].forEach((item) => {
    if (!item?.nombre) return;
    const key = `${normalize(item.nombre)}|${state.nombre}`;
    if (!PLACE_LOOKUP.has(key)) PLACE_LOOKUP.set(key, { name: item.nombre, description: item.descripcion || '', stateName: state.nombre, stateCode: state.cve, category: KIND_BY_LIST.get(item) || 'Destino turístico' });
  });
});

/** Búsqueda global de lugares (todas las categorías, sin distinguir acentos). */
export function searchPlaces(query, limit = 6) {
  const q = fold(query);
  if (q.length < 2) return [];
  const starts = [];
  const contains = [];
  PLACE_LOOKUP.forEach((place) => {
    const name = fold(place.name);
    if (name.startsWith(q)) starts.push(place);
    else if (name.includes(q)) contains.push(place);
  });
  return [...starts, ...contains].slice(0, limit);
}

/** Busca la descripción conocida de un lugar para mostrarla en su ficha. */
export function findPlace(name, stateName) {
  if (!name) return null;
  const key = normalize(name);
  if (stateName) return PLACE_LOOKUP.get(`${key}|${stateName}`) || null;
  for (const [entryKey, value] of PLACE_LOOKUP) if (entryKey.startsWith(`${key}|`)) return value;
  return null;
}
