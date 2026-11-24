export function getPlaceDetails(placeName, stateName = '', category = 'Lugar', description = '') {
  return {
    nombre: placeName,
    categoria: category,
    descripcion: description || `${placeName} es un lugar de interés en ${stateName || 'México'}. Consulta Google Maps para ver horarios, reseñas y servicios cercanos.`,
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
