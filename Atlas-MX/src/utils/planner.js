import { TOURISM_INDEX } from '../data/tourismIndex.js';

export const BUDGET_LEVELS = {
  economico: { label: 'Económico', daily: 950, lodging: 380, food: 270, transport: 180, activities: 120 },
  medio: { label: 'Intermedio', daily: 1950, lodging: 850, food: 480, transport: 320, activities: 300 },
  comodo: { label: 'Cómodo', daily: 3650, lodging: 1800, food: 750, transport: 600, activities: 500 }
};

export const INTERESTS = [
  { id: 'variado', label: 'Un poco de todo' },
  { id: 'naturaleza', label: 'Naturaleza' },
  { id: 'playas', label: 'Playas' },
  { id: 'pueblos', label: 'Pueblos' },
  { id: 'historia', label: 'Historia' },
  { id: 'gastronomia', label: 'Gastronomía' }
];

export function createItinerary({ stateCode, days, interest, budget }) {
  const stateItems = TOURISM_INDEX.filter((item) => item.stateCode === stateCode);
  const preferred = interest === 'variado' ? stateItems : stateItems.filter((item) => item.category === interest);
  const pool = [...preferred, ...stateItems].filter((item, index, all) => all.findIndex((candidate) => candidate.name === item.name) === index);
  const meals = stateItems.filter((item) => item.category === 'gastronomia');
  const dayCount = Math.max(1, Math.min(7, Number(days) || 1));
  const itinerary = Array.from({ length: dayCount }, (_, index) => ({
    day: index + 1,
    morning: pool[(index * 2) % pool.length],
    afternoon: pool[((index * 2) + 1) % pool.length],
    food: meals[index % Math.max(1, meals.length)]
  }));
  const budgetData = BUDGET_LEVELS[budget] || BUDGET_LEVELS.medio;
  return { itinerary, budgetData, total: budgetData.daily * dayCount };
}
