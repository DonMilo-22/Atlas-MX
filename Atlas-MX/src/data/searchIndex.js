// Búsqueda local sobre el índice compacto del catálogo turístico (src/data/generated/index.json).
import { ESTADOS } from '@webrek/mx-geo';
import INDEX from './generated/index.json';

const STATE_NAME = Object.fromEntries(ESTADOS.map((e) => [e.cve, e.nombre]));
const fold = (s) =>
  String(s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const ENTRIES = INDEX.map((e) => {
  const key = fold(e.n);
  return { e, key, words: key.split(' ') };
});

export function searchPlaces(query, limit = 6) {
  const q = fold(query);
  if (!q) return [];
  const scored = [];
  for (const it of ENTRIES) {
    let rank;
    if (it.key === q) rank = 0;
    else if (it.key.startsWith(q)) rank = 1;
    else if (it.words.some((w) => w.startsWith(q))) rank = 2;
    else if (it.key.includes(q)) rank = 3;
    else continue;
    scored.push({ it, rank });
  }
  scored.sort((a, b) => a.rank - b.rank || a.it.key.length - b.it.key.length || a.it.key.localeCompare(b.it.key));
  const out = [];
  const seen = new Set();
  for (const { it } of scored) {
    const k = it.e.id + it.e.s + it.e.c;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ id: it.e.id, name: it.e.n, stateCode: it.e.s, stateName: STATE_NAME[it.e.s] || '', category: it.e.c });
    if (out.length >= limit) break;
  }
  return out;
}
