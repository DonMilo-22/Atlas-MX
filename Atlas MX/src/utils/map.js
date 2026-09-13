/**
 * Atlas MX — Utilidades geoespaciales y formateadores de datos.
 */

/**
 * Formatea un número entero con separadores de miles en español de México.
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return 'N/D';
  return Number(num).toLocaleString('es-MX');
}

/**
 * Formatea la superficie territorial en km².
 * @param {number} km2
 * @returns {string}
 */
export function formatArea(km2) {
  if (!km2) return 'N/D';
  return `${formatNumber(km2)} km²`;
}

/**
 * Formatea la población con sufijo descriptivo.
 * @param {number} pop
 * @returns {string}
 */
export function formatPopulation(pop) {
  if (!pop) return 'N/D';
  return `${formatNumber(pop)} habitantes`;
}

/**
 * Paleta visual de regiones geográficas de México (Banxico).
 */
export const REGION_COLORS = {
  'norte': {
    name: 'Norte',
    color: '#06b6d4', // cian
    bg: 'rgba(6, 182, 212, 0.15)',
    border: '#06b6d4'
  },
  'centro-norte': {
    name: 'Centro Norte',
    color: '#3b82f6', // azul eléctrico
    bg: 'rgba(59, 130, 246, 0.15)',
    border: '#3b82f6'
  },
  'centro': {
    name: 'Centro',
    color: '#8b5cf6', // violeta
    bg: 'rgba(139, 92, 246, 0.15)',
    border: '#8b5cf6'
  },
  'sur': {
    name: 'Sur / Sureste',
    color: '#10b981', // esmeralda
    bg: 'rgba(16, 185, 129, 0.15)',
    border: '#10b981'
  }
};

/**
 * Retorna la información visual de una región.
 * @param {string} regionKey
 */
export function getRegionInfo(regionKey) {
  const key = (regionKey || '').toLowerCase();
  return REGION_COLORS[key] || {
    name: regionKey || 'Región Federal',
    color: '#64748b',
    bg: 'rgba(100, 116, 139, 0.15)',
    border: '#64748b'
  };
}
