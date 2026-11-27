// Mapas de Google embebidos para hoteles, restaurantes y atractivos: muestran los negocios reales de Google
// (calificaciones, fotos, horarios, cómo llegar) alrededor del punto verificado del lugar.
// Con VITE_GOOGLE_MAPS_EMBED_KEY (Maps Embed API, gratuita y sin límite de uso) se usa la versión oficial;
// sin clave, la inserción clásica de maps.google.com, que no la requiere.
const KEY = import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY;

export function googleEmbedUrl({ query, lat = null, lon = null, zoom = 15 }) {
  const hasPoint = Number.isFinite(lat) && Number.isFinite(lon);
  if (KEY) {
    const params = new URLSearchParams({ key: KEY, q: query, language: 'es', region: 'MX' });
    if (hasPoint) { params.set('center', `${lat},${lon}`); params.set('zoom', String(zoom)); }
    return `https://www.google.com/maps/embed/v1/search?${params}`;
  }
  const params = new URLSearchParams({ q: query, hl: 'es', z: String(zoom), output: 'embed' });
  if (hasPoint) params.set('ll', `${lat},${lon}`);
  return `https://maps.google.com/maps?${params}`;
}

/** Enlace a la búsqueda completa en Google Maps (app o web). */
export function googleSearchUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
