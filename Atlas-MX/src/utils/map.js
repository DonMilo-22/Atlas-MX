export const formatPopulation = (value) => Number(value || 0).toLocaleString('es-MX');
export const formatArea = (value) => `${Number(value || 0).toLocaleString('es-MX')} km²`;
const REGIONS = { norte:'Norte', noroeste:'Noroeste', noreste:'Noreste', occidente:'Occidente', bajio:'Bajío', centro:'Centro', sur:'Sur', sureste:'Sureste' };
export function getRegionInfo(region) { return { name: REGIONS[String(region || '').toLowerCase()] || region || 'México' }; }
