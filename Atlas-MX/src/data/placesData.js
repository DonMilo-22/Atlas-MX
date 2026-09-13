import { PLACEHOLDER } from '../services/photoService';
export const MEXICAN_PHOTOS = new Proxy({}, { get: () => PLACEHOLDER });
export function getPlaceDetails(placeName, stateName = '', category = 'Lugar') {
  return {
    nombre: placeName,
    categoria: category,
    imagen: PLACEHOLDER,
    galeria: [],
    descripcion: `${placeName} es un lugar de interés en ${stateName || 'México'}. La ficha integra fotografías reales consultadas en Wikipedia/Wikimedia Commons y un mapa interactivo de Google Maps.`,
    historia: category?.toLowerCase().includes('hist') ? `Este sitio forma parte del patrimonio histórico y cultural de ${stateName || 'México'}.` : '',
    municipioCercano: stateName
  };
}
export function getMunicipalityDetails(name, stateName = '', cvegeo = '') {
  return {
    nombre: name,
    cvegeo,
    categoria: 'Municipio',
    imagen: PLACEHOLDER,
    descripcion: `${name} es un municipio de ${stateName}. Consulta el mapa para localizar su cabecera, atractivos, hoteles y servicios cercanos.`,
    historia: `La información visual se obtiene dinámicamente de fuentes abiertas y el mapa permite explorar ${name} directamente en Google Maps.`
  };
}
