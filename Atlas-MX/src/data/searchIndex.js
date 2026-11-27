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

// Singular aproximado palabra por palabra ("chiles en nogada" encuentra "Chile en nogada").
const singular = (key) => key.split(' ').map((w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w)).join(' ');

const ENTRIES = INDEX.map((e) => {
  const key = fold(e.n);
  const sing = singular(key);
  return { e, key, words: key.split(' '), sing, singWords: sing.split(' ') };
});

function rankOf(key, words, q) {
  if (key === q) return 0;
  if (key.startsWith(q)) return 1;
  if (words.some((w) => w.startsWith(q))) return 2;
  if (key.includes(q)) return 3;
  return null;
}

export function searchPlaces(query, limit = 6) {
  const q = fold(query);
  if (!q) return [];
  const qs = singular(q);
  const scored = [];
  for (const it of ENTRIES) {
    let rank = rankOf(it.key, it.words, q);
    if (rank === null) { const r = rankOf(it.sing, it.singWords, qs); rank = r === null ? null : r + 0.5; }
    if (rank === null) continue;
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
