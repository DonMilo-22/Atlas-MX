import { BUDGET_LEVELS } from '../utils/planner.js';

const HIGH_COST = new Set(['03', '09', '14', '23', '31']);
const VALUE_COST = new Set(['01', '05', '10', '13', '17', '24', '27', '28', '29', '32']);

export function getBudgetEstimate(stateCode, level = 'medio', days = 1) {
  const base = BUDGET_LEVELS[level] || BUDGET_LEVELS.medio;
  const multiplier = HIGH_COST.has(stateCode) ? 1.2 : VALUE_COST.has(stateCode) ? 0.86 : 1;
  const round = (value) => Math.round((value * multiplier) / 50) * 50;
  const daily = round(base.daily);
  return {
    label: base.label,
    daily,
    minimum: round(base.daily * 0.85),
    maximum: round(base.daily * 1.15),
    total: daily * days,
    breakdown: {
      Hospedaje: round(base.lodging),
      Alimentos: round(base.food),
      Transporte: round(base.transport),
      Actividades: round(base.activities)
    }
  };
}
