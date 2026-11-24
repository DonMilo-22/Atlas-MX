/**
 * Atlas MX — hoteles, restaurantes y atractivos reales cerca de un punto (OpenStreetMap vía Overpass).
 * Se prueban varios servidores públicos de Overpass por si alguno está saturado.
 */
import { fetchWithTimeout } from './http.js';
const ENDPOINTS = ['https://overpass-api.de/api/interpreter', 'https://overpass.private.coffee/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
const cache = new Map();
const pending = new Map();

export const POI_CATEGORIES = {
  hoteles: { label: 'Hoteles', singular: 'Hospedaje' },
  restaurantes: { label: 'Restaurantes', singular: 'Restaurante' },
  atractivos: { label: 'Qué ver', singular: 'Atractivo' }
};

const KIND_LABELS = {
  hotel: 'Hotel', hostel: 'Hostal', guest_house: 'Casa de huéspedes', motel: 'Motel', apartment: 'Departamento',
  restaurant: 'Restaurante', cafe: 'Café', fast_food: 'Comida rápida', bar: 'Bar', ice_cream: 'Nevería',
  museum: 'Museo', attraction: 'Atractivo', viewpoint: 'Mirador', gallery: 'Galería', zoo: 'Zoológico', theme_park: 'Parque temático',
  monument: 'Monumento', archaeological_site: 'Zona arqueológica', castle: 'Castillo', ruins: 'Ruinas', church: 'Templo', cathedral: 'Catedral'
};

function classify(tags) {
  if (['hotel', 'hostel', 'guest_house', 'motel', 'apartment'].includes(tags.tourism)) return ['hoteles', tags.tourism];
  if (['restaurant', 'cafe', 'fast_food', 'bar', 'ice_cream'].includes(tags.amenity)) return ['restaurantes', tags.amenity];
  if (tags.historic) return ['atractivos', tags.historic];
  if (tags.tourism) return ['atractivos', tags.tourism];
  return [null, null];
}

export function distanceMeters(a, b) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function address(tags) {
  const street = [tags['addr:street'], tags['addr:housenumber']].filter(Boolean).join(' ');
  return [street, tags['addr:suburb'] || tags['addr:neighbourhood'], tags['addr:city']].filter(Boolean).join(', ');
}

function normalizeElement(element, center) {
  const tags = element.tags || {};
  if (!tags.name) return null;
  const [category, kind] = classify(tags);
  if (!category) return null;
  const lat = element.lat ?? element.center?.lat;
  const lon = element.lon ?? element.center?.lon;
  if (lat == null || lon == null) return null;
  const stars = Number.parseInt(tags.stars, 10);
  return {
    id: `${element.type}/${element.id}`,
    name: tags.name,
    category,
    kind: KIND_LABELS[kind] || POI_CATEGORIES[category].singular,
    lat,
    lon,
    distance: distanceMeters(center, { lat, lon }),
    stars: Number.isFinite(stars) ? stars : null,
    cuisine: tags.cuisine ? tags.cuisine.split(';').map((c) => c.replace(/_/g, ' ')).join(', ') : '',
    address: address(tags),
    phone: tags.phone || tags['contact:phone'] || '',
    website: tags.website || tags['contact:website'] || '',
    hours: tags.opening_hours || '',
    wikipedia: tags.wikipedia || '',
    osmUrl: `https://www.openstreetmap.org/${element.type}/${element.id}`
  };
}

function buildQuery(lat, lon, radius) {
  const around = `(around:${radius},${lat},${lon})`;
  return `[out:json][timeout:25];(
    nwr["tourism"~"^(hotel|hostel|guest_house|motel|apartment)$"]["name"]${around};
    nwr["amenity"~"^(restaurant|cafe|fast_food|bar|ice_cream)$"]["name"]${around};
    nwr["tourism"~"^(museum|attraction|viewpoint|gallery|zoo|theme_park)$"]["name"]${around};
    nwr["historic"~"^(monument|archaeological_site|castle|ruins|church|cathedral)$"]["name"]${around};
  );out center tags 400;`;
}

async function runQuery(query) {
  let lastError;
  for (const endpoint of ENDPOINTS) {
    try {
      const response = await fetchWithTimeout(endpoint, { method: 'POST', body: new URLSearchParams({ data: query }) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('Overpass no disponible');
}

/**
 * Lugares reales cerca del punto, agrupados por categoría y ordenados por distancia.
 * @returns {Promise<{hoteles: Array, restaurantes: Array, atractivos: Array, radius: number}>}
 */
export async function fetchNearbyPlaces(lat, lon, radius = 1500) {
  const key = `${lat.toFixed(3)},${lon.toFixed(3)},${radius}`;
  if (cache.has(key)) return cache.get(key);
  if (pending.has(key)) return pending.get(key);

  const request = (async () => {
    const center = { lat, lon };
    let data = await runQuery(buildQuery(lat, lon, radius));
    let elements = data.elements || [];
    // Pocos resultados (zona rural): ampliamos el radio una vez.
    let usedRadius = radius;
    if (elements.length < 8 && radius < 6000) {
      usedRadius = 6000;
      data = await runQuery(buildQuery(lat, lon, usedRadius));
      elements = data.elements || [];
    }
    const seen = new Set();
    const grouped = { hoteles: [], restaurantes: [], atractivos: [], radius: usedRadius };
    elements.map((element) => normalizeElement(element, center)).filter(Boolean).forEach((poi) => {
      const dedupe = `${poi.category}|${poi.name.toLocaleLowerCase('es-MX')}`;
      if (seen.has(dedupe)) return;
      seen.add(dedupe);
      grouped[poi.category].push(poi);
    });
    Object.keys(POI_CATEGORIES).forEach((category) => {
      grouped[category].sort((a, b) => a.distance - b.distance);
      grouped[category] = grouped[category].slice(0, 40);
    });
    cache.set(key, grouped);
    return grouped;
  })().finally(() => pending.delete(key));

  pending.set(key, request);
  return request;
}

export function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters / 10) * 10} m`;
  return `${(meters / 1000).toFixed(meters < 10000 ? 1 : 0)} km`;
}
