import { ESTADOS } from '@webrek/mx-geo';
import { TOURISM_INDEX } from '../data/tourismIndex.js';
import { STATE_PROFILE } from '../data/travelSeasons.js';
import { TOURIST_ROUTES } from '../data/touristRoutes.js';

const POPULAR = new Set(['09', '11', '14', '20', '21', '23', '31']);
const CLIMATE_MATCH = {
  calido: new Set(['tropical', 'pacific', 'dryCoast']),
  templado: new Set(['highlands']),
  seco: new Set(['desert', 'dryCoast'])
};

export const MATCH_QUESTIONS = [
  { id: 'interest', title: '¿Qué quieres vivir?', options: [['playas', 'Mar y playas'], ['naturaleza', 'Naturaleza'], ['historia', 'Historia'], ['gastronomia', 'Comer increíble'], ['pueblos', 'Pueblos con encanto']] },
  { id: 'climate', title: '¿Qué clima prefieres?', options: [['calido', 'Cálido'], ['templado', 'Templado'], ['seco', 'Seco o desértico']] },
  { id: 'vibe', title: '¿Qué ritmo te atrae?', options: [['popular', 'Grandes imperdibles'], ['tranquilo', 'Lugares tranquilos'], ['ruta', 'Recorrer varios destinos']] }
];

export function matchDestinations(answers) {
  return ESTADOS.map((state) => {
    const categoryCount = TOURISM_INDEX.filter((item) => item.stateCode === state.cve && item.category === answers.interest).length;
    let score = categoryCount * 3;
    const climateSet = CLIMATE_MATCH[answers.climate];
    if (climateSet?.has(STATE_PROFILE[state.cve])) score += 8;
    if (answers.vibe === 'popular' && POPULAR.has(state.cve)) score += 6;
    if (answers.vibe === 'tranquilo' && !POPULAR.has(state.cve)) score += 4;
    if (answers.vibe === 'ruta') score += TOURIST_ROUTES.filter((route) => route.stateCodes.includes(state.cve)).length * 3;
    return { state, score, categoryCount };
  }).sort((a, b) => b.score - a.score || b.categoryCount - a.categoryCount).slice(0, 3);
}
