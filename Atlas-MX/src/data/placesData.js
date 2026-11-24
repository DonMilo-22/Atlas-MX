// Frases de relleno que se repiten en todos los estados; no aportan información al usuario.
const GENERIC_PATTERNS = [/^Atractivo emblemático de /, /^Especialidad tradicional de /];
export const isGenericDescription = (text = '') => GENERIC_PATTERNS.some((pattern) => pattern.test(text));

export function getPlaceDetails(placeName, stateName = '', category = 'Lugar', description = '') {
  return {
    nombre: placeName,
    categoria: category,
    descripcion: (description && !isGenericDescription(description) && description) || `${placeName} es un lugar de interés en ${stateName || 'México'}. Consulta Google Maps para ver horarios, reseñas y servicios cercanos.`,
    historia: ''
  };
}

export function getMunicipalityDetails(name, stateName = '', cvegeo = '') {
  return {
    nombre: name,
    cvegeo,
    categoria: 'Municipio',
    descripcion: `${name} es un municipio de ${stateName}. Usa los accesos de abajo para encontrar atractivos, lugares para comer y hospedaje.`
  };
}
