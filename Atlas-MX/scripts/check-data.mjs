// Verifica el catálogo turístico generado (npm run data:build) antes de publicar.
import { readFileSync, readdirSync } from 'node:fs';
import { ESTADOS, estadoDeCoordenada } from '@webrek/mx-geo';
import { getTravelSeason, STATE_PROFILE } from '../src/data/travelSeasons.js';
import { CULTURAL_EVENTS } from '../src/data/culturalEvents.js';

const dir = new URL('../src/data/generated/estados/', import.meta.url);
const files = readdirSync(dir).filter((name) => name.endsWith('.json'));
if (files.length !== 32) throw new Error(`Se esperaban 32 archivos de estado y hay ${files.length}`);

const CATEGORIES = ['pueblos', 'historia', 'destinos', 'cocina'];
const errors = [];
let pueblos = 0;
for (const state of ESTADOS) {
  const data = JSON.parse(readFileSync(new URL(`${state.cve}.json`, dir), 'utf8'));
  if (data.cve !== state.cve) errors.push(`${state.cve}: cve distinto (${data.cve})`);
  for (const key of CATEGORIES) {
    const list = data.categorias?.[key];
    if (!Array.isArray(list)) { errors.push(`${state.cve}: falta la categoría ${key}`); continue; }
    const ids = new Set();
    for (const item of list) {
      if (!/^Q\d+$/.test(item.id || '')) errors.push(`${state.cve}/${key}: id inválido ${item.id}`);
      if (ids.has(item.id)) errors.push(`${state.cve}/${key}: id repetido ${item.id}`);
      ids.add(item.id);
      if (!item.nombre) errors.push(`${state.cve}/${key}: ${item.id} sin nombre`);
      if (/Atractivo emblemático|Localidad de .* con identidad regional/.test(item.descripcion || '')) errors.push(`${state.cve}/${key}: descripción genérica en ${item.nombre}`);
      if (key !== 'cocina' && typeof item.lat === 'number') {
        const inside = estadoDeCoordenada([item.lon, item.lat]);
        if (inside !== state.cve) errors.push(`${state.cve}/${key}: ${item.nombre} cae en ${inside || 'ningún estado'}`);
      }
    }
  }
  pueblos += data.categorias?.pueblos?.length || 0;
}
for (const state of ESTADOS) {
  const season = getTravelSeason(state.cve);
  if (!STATE_PROFILE[state.cve] || season.bestMonths.length < 1) errors.push(`Temporada de viaje incompleta para ${state.cve}`);
}
if (!CULTURAL_EVENTS.length) errors.push('Agenda cultural vacía');
JSON.parse(readFileSync(new URL('../src/data/generated/index.json', import.meta.url), 'utf8'));

if (errors.length) { console.error(errors.slice(0, 50).join('\n')); console.error(`${errors.length} errores`); process.exit(1); }
console.log(`OK: 32 estados, ${pueblos} Pueblos Mágicos; todas las coordenadas caen en su estado.`);
