// Catálogo turístico verificado (generado por scripts/build-tourism-data.mjs a partir de
// Wikidata, Wikipedia en español y el listado oficial de Pueblos Mágicos de SECTUR).
import { ESTADOS } from '@webrek/mx-geo';
import { commonsThumbUrl } from '../utils/commons';

// Carga perezosa por estado (code splitting de Vite)
const loaders = import.meta.glob('./generated/estados/*.json');
const cache = new Map();

export async function loadStateTourism(cve) {
  if (!cve) return null;
  const code = String(cve).padStart(2, '0');
  const loader = loaders[`./generated/estados/${code}.json`];
  if (!loader) return null;
  if (!cache.has(code)) {
    cache.set(
      code,
      loader()
        .then((mod) => mod.default ?? mod)
        .catch((err) => {
          cache.delete(code);
          throw err;
        }),
    );
  }
  return cache.get(code);
}

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

export const CATEGORY_META = {
  pueblos: { label: 'Pueblos Mágicos', single: 'Pueblo Mágico', count: (n) => plural(n, 'pueblo mágico', 'pueblos mágicos') },
  historia: { label: 'Historia', single: 'Sitio histórico', count: (n) => plural(n, 'sitio histórico', 'sitios históricos') },
  destinos: { label: 'Destinos', single: 'Destino', count: (n) => plural(n, 'destino', 'destinos') },
  cocina: { label: 'Cocina', single: 'Platillo típico', count: (n) => plural(n, 'platillo típico', 'platillos típicos') },
};

export function commonsThumb(fileName, width = 640) {
  return fileName ? commonsThumbUrl(fileName, width) : null;
}

export function wikipediaUrl(title) {
  if (!title) return null;
  return `https://es.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;
}

const STATE_NAME = Object.fromEntries(ESTADOS.map((e) => [e.cve, e.nombre]));

export function toPlace(item, category, stateCode, stateName) {
  return {
    id: item.id,
    name: item.nombre,
    category,
    tipo: item.tipo,
    stateCode,
    stateName: stateName || STATE_NAME[stateCode] || '',
    lat: item.lat ?? null,
    lon: item.lon ?? null,
    imagen: item.imagen ?? null,
    wiki: item.wiki ?? null,
    descripcion: item.descripcion ?? '',
  };
}
