#!/usr/bin/env node
// Construye el catálogo turístico verificado de Atlas-MX a partir de fuentes públicas:
//   - Wikidata (query.wikidata.org, SPARQL): identidad, tipo, coordenadas, imagen y designaciones.
//   - Wikipedia en español (es.wikipedia.org): descripción (primer párrafo real), categorías y
//     artículos "Gastronomía de <estado>".
//   - Secretaría de Turismo (www.gob.mx/sectur): listado oficial de Pueblos Mágicos (132 + 45 de 2023).
// Nada se redacta a mano: cada campo sale de una de esas fuentes.
//
// Uso:  NODE_USE_ENV_PROXY=1 node scripts/build-tourism-data.mjs [--fresh]
//   --fresh  ignora la caché local (node_modules/.cache/atlas-mx-tourism) y vuelve a descargar todo.
//
// Escribe src/data/generated/estados/XX.json (32 archivos) y src/data/generated/index.json.

import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync, statSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { ESTADOS, estadoDeCoordenada } from '@webrek/mx-geo';

const ROOT = new URL('../', import.meta.url);
const OUT_DIR = new URL('src/data/generated/', ROOT);
const STATES_DIR = new URL('estados/', OUT_DIR);
const CACHE_DIR = new URL('node_modules/.cache/atlas-mx-tourism/', ROOT);
const FRESH = process.argv.includes('--fresh');
const CACHE_TTL_MS = 14 * 24 * 3600 * 1000;
const UA = 'AtlasMX-data/1.0 (educational project)';
const TODAY = new Date().toISOString().slice(0, 10);

const SECTUR_URLS = {
  lista132: 'https://www.gob.mx/sectur/articulos/pueblos-magicos-206528',
  nuevos45: 'https://www.gob.mx/sectur/prensa/mexico-con-45-nuevos-pueblos-magicos',
};

// Elementos de Wikidata marcados como Pueblo Mágico que corresponden a otra localidad homónima
// (verificado contra SECTUR e INEGI). Se tratan como no emparejados y se resuelven vía es.wikipedia.
const WD_PM_ERRORS = {
  Q20263470: 'Ures (localidad de 333 hab. del municipio de Caborca); el Pueblo Mágico es Ures, cabecera del municipio de Ures, Sonora',
};

const LIMITS = { historia: 40, historiaPrioritarios: 45, historiaMinOtros: 10, destinos: 30, destinosCiudades: 8, cocina: 20 };

// ---------------------------------------------------------------------------
// HTTP con caché en disco, reintentos y pausas corteses.
// ---------------------------------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
mkdirSync(CACHE_DIR, { recursive: true });
let lastRequestAt = 0;
const stats = { requests: 0, cached: 0, retries: 0 };

function cachePath(key) {
  return new URL(createHash('sha1').update(key).digest('hex') + '.json', CACHE_DIR);
}

async function fetchText(url, { method = 'GET', body = null, headers = {}, minGapMs = 350, validate = null } = {}) {
  const key = method + ' ' + url + (body ? '\n' + body : '');
  const file = cachePath(key);
  if (!FRESH && existsSync(file) && Date.now() - statSync(file).mtimeMs < CACHE_TTL_MS) {
    const cached = JSON.parse(readFileSync(file, 'utf8')).text;
    let valid = true;
    if (validate) try { validate(cached); } catch { valid = false; }
    if (valid) { stats.cached++; return cached; }
  }
  for (let attempt = 0; attempt < 12; attempt++) {
    const wait = lastRequestAt + minGapMs - Date.now();
    if (wait > 0) await sleep(wait);
    lastRequestAt = Date.now();
    let res;
    try {
      stats.requests++;
      if (stats.requests % 25 === 0) console.log(`  · ${stats.requests} peticiones (${stats.cached} desde caché)`);
      res = await fetch(url, { method, body, headers: { 'User-Agent': UA, ...headers }, signal: AbortSignal.timeout(90000) });
    } catch (err) {
      stats.retries++;
      const backoff = Math.min(60000, 2000 * 2 ** attempt);
      console.warn(`  ! red (${err.cause?.code || err.message}) en ${new URL(url).host}; reintento en ${backoff / 1000}s`);
      await sleep(backoff);
      continue;
    }
    let text;
    try { text = await res.text(); } catch (err) { stats.retries++; console.warn(`  ! cuerpo incompleto (${err.message}); reintento`); await sleep(3000); continue; }
    if (res.ok && validate) {
      try { validate(text); } catch (err) {
        stats.retries++;
        const backoff = Math.min(60000, 5000 * (attempt + 1));
        console.warn(`  ! respuesta inválida/truncada de ${new URL(url).host} (${err.message.slice(0, 60)}); reintento en ${backoff / 1000}s`);
        await sleep(backoff);
        continue;
      }
    }
    if (res.ok) {
      writeFileSync(file, JSON.stringify({ url, text }));
      return text;
    }
    if (res.status === 429 || res.status >= 500) {
      stats.retries++;
      const retryAfter = Number(res.headers.get('retry-after')) || 0;
      const backoff = Math.min(120000, Math.max(retryAfter * 1000 + 500, 2000 * 2 ** attempt));
      console.warn(`  ! HTTP ${res.status} en ${new URL(url).host}; reintento en ${Math.round(backoff / 1000)}s`);
      await sleep(backoff);
      continue;
    }
    throw new Error(`HTTP ${res.status} ${url}\n${text.slice(0, 500)}`);
  }
  throw new Error(`Sin respuesta tras varios intentos: ${url}`);
}

async function sparql(query) {
  const text = await fetchText('https://query.wikidata.org/sparql', {
    method: 'POST',
    body: 'query=' + encodeURIComponent(query),
    headers: { Accept: 'application/sparql-results+json', 'Content-Type': 'application/x-www-form-urlencoded' },
    minGapMs: 1000,
    validate: (t) => JSON.parse(t),
  });
  const json = JSON.parse(text);
  return json.results.bindings.map((b) =>
    Object.fromEntries(Object.entries(b).map(([k, v]) => [k, v.value.replace('http://www.wikidata.org/entity/', '')])),
  );
}

async function wikiApi(params, lang = 'es') {
  const qs = new URLSearchParams({ format: 'json', formatversion: '2', ...params });
  const text = await fetchText(`https://${lang}.wikipedia.org/w/api.php?${qs}`, { headers: { Accept: 'application/json' }, minGapMs: 1200, validate: (t) => { const j = JSON.parse(t); if (j.error) throw new Error(j.error.info || j.error.code); } });
  return JSON.parse(text);
}

// action=query con continuación automática; fusiona `pages` por título.
async function wikiQueryAll(params) {
  const pages = new Map();
  const redirects = [];
  const normalized = [];
  const lists = {};
  let cont = {};
  for (let i = 0; i < 50; i++) {
    const json = await wikiApi({ action: 'query', ...params, ...cont });
    for (const p of json.query?.pages || []) pages.set(p.title, { ...(pages.get(p.title) || {}), ...p });
    redirects.push(...(json.query?.redirects || []));
    normalized.push(...(json.query?.normalized || []));
    for (const [k, v] of Object.entries(json.query || {})) if (Array.isArray(v) && !['pages', 'redirects', 'normalized'].includes(k)) (lists[k] ||= []).push(...v);
    if (!json.continue) break;
    cont = json.continue;
  }
  return { pages: [...pages.values()], redirects, normalized, lists };
}

// ---------------------------------------------------------------------------
// Utilidades de texto y geografía.
// ---------------------------------------------------------------------------
const stripAccents = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const norm = (s) => stripAccents(String(s || '')).toLowerCase().replace(/\(.*?\)/g, ' ').replace(/[^a-z0-9ñ ]/g, ' ').replace(/\s+/g, ' ').trim();
const STOP = new Set(['de', 'del', 'la', 'las', 'los', 'el', 'y', 'san', 'santa', 'santo', 'ciudad', 'villa', 'heroica', 'h']);
const tokens = (s) => norm(s).split(' ').filter((t) => t && !STOP.has(t));
const compact = (s) => norm(s).replace(/ /g, '');
const ucfirst = (s) => (s ? s.charAt(0).toLocaleUpperCase('es') + s.slice(1) : s);
const cleanName = (s) => ucfirst(String(s || '').replace(/\s*\([^)]*\)\s*$/, '').trim());
const fileFromCommonsUrl = (u) => (u ? decodeURIComponent(u.replace(/^https?:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\//, '')) : null);

function nameSimilarity(a, b) {
  if (compact(a) && compact(a) === compact(b)) return 2;
  const A = tokens(a), B = tokens(b);
  if (!A.length || !B.length) return 0;
  const inter = A.filter((t) => B.includes(t)).length;
  return inter / Math.min(A.length, B.length);
}

function parsePoint(wkt) {
  const m = /Point\(([-\d.eE]+) ([-\d.eE]+)\)/.exec(wkt || '');
  return m ? { lon: +m[1], lat: +m[2] } : null;
}

const round = (n) => Math.round(n * 1e5) / 1e5;

// Estado de un punto; si cae en el mar (geometría simplificada) busca tierra en anillos cercanos.
function stateOfPoint(p) {
  const direct = estadoDeCoordenada([p.lon, p.lat]);
  if (direct) return { cve: direct, exact: true };
  for (const r of [0.02, 0.05, 0.1, 0.2]) {
    const hits = new Map();
    for (let k = 0; k < 16; k++) {
      const a = (k * Math.PI) / 8;
      const c = estadoDeCoordenada([p.lon + r * Math.cos(a), p.lat + r * Math.sin(a)]);
      if (c) hits.set(c, (hits.get(c) || 0) + 1);
    }
    if (hits.size) return { cve: [...hits.entries()].sort((x, y) => y[1] - x[1])[0][0], exact: false, near: [...hits.keys()] };
  }
  return null;
}

const ABBREV = new Set(['a', 'c', 'd', 'aprox', 'etc', 'sr', 'sra', 'dr', 'gral', 'st', 'núm', 'no', 'av', 'col', 'msnm', 'snm', 'km', 'hab', 'ej', 'lic', 'ing', 'fr', 'sta', 'sto', 'cía', 'ca', 'pág', 'vol', 'mpio']);

// Primeras 1–2 oraciones (≤ max caracteres) del texto, cortando en límite de oración.
function firstSentences(text, max = 320) {
  if (!text) return '';
  const para = text
    .split('\n')
    .map((s) => s.replace(/\(\s*[;,:]?\s*\)/g, '').replace(/\s+([,.;:])/g, '$1').replace(/\s{2,}/g, ' ').trim())
    .find((s) => s.length > 20);
  if (!para) return '';
  const sentences = [];
  let start = 0;
  const re = /[.!?…]+["»”')]?\s+(?=[A-ZÁÉÍÓÚÑ¿¡«"“0-9])/g;
  let m;
  while ((m = re.exec(para))) {
    const before = para.slice(start, m.index);
    const lastWord = (before.match(/([\p{L}]+)$/u) || [, ''])[1].toLowerCase();
    if (lastWord.length === 1 || ABBREV.has(lastWord)) continue;
    sentences.push(para.slice(start, m.index + m[0].trimEnd().length).trim());
    start = m.index + m[0].length;
  }
  sentences.push(para.slice(start).trim());
  let out = sentences[0];
  if (out.length > max) {
    const cut = out.slice(0, max - 1);
    return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:\s]+$/, '') + '…';
  }
  if (sentences[1] && out.length + 1 + sentences[1].length <= max) out += ' ' + sentences[1];
  return out;
}

const BAD_IMAGE = /mapa|map|escudo|coat|flag|bandera|logo|locator|location|\.svg$|\.png$|\.gif$|\.tiff?$/i;
const isPhoto = (f) => !!f && /\.jpe?g$/i.test(f) && !BAD_IMAGE.test(f);

const decodeEntities = (s) =>
  s.replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : +e.slice(1));
    return { aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú', Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú', ntilde: 'ñ', Ntilde: 'Ñ', uuml: 'ü', Uuml: 'Ü', nbsp: ' ', amp: '&', quot: '"', ordf: 'ª', ordm: 'º', ldquo: '"', rdquo: '"', lsquo: "'", rsquo: "'", ndash: '–', mdash: '—' }[e] ?? m;
  });
const htmlLines = (html) =>
  decodeEntities(html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, '\n'))
    .split('\n')
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

const chunk = (arr, n) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));
const log = (...a) => console.log(...a);

// ---------------------------------------------------------------------------
// Estados.
// ---------------------------------------------------------------------------
const STATE_BY_CVE = Object.fromEntries(ESTADOS.map((e) => [e.cve, e]));
const STATE_NAME_TO_CVE = new Map();
for (const e of ESTADOS) for (const n of [e.nombre, e.nombreCorto, ...(e.alias || [])]) STATE_NAME_TO_CVE.set(norm(n), e.cve);
for (const [n, c] of [['estado de mexico', '15'], ['edo de mexico', '15'], ['mexico', '15'], ['coahuila', '05'], ['michoacan', '16'], ['veracruz', '30'], ['queretaro', '22'], ['distrito federal', '09']]) STATE_NAME_TO_CVE.set(n, c);

async function loadStates() {
  const rows = await sparql(`SELECT ?st ?iso ?title WHERE {
    ?st wdt:P300 ?iso . FILTER(STRSTARTS(?iso, "MX-"))
    { ?st wdt:P31 wd:Q15149663 } UNION { VALUES ?st { wd:Q1489 } }
    OPTIONAL { ?a schema:about ?st ; schema:isPartOf <https://es.wikipedia.org/> ; schema:name ?title }
  }`);
  const qidToCve = {}, cveToQid = {}, cveToTitle = {};
  for (const r of rows) {
    const e = ESTADOS.find((x) => x.iso === r.iso);
    if (!e) continue;
    qidToCve[r.st] = e.cve;
    cveToQid[e.cve] = r.st;
    if (r.title) cveToTitle[e.cve] = r.title;
  }
  const missing = ESTADOS.filter((e) => !cveToQid[e.cve]);
  if (missing.length) throw new Error('Estados sin QID en Wikidata: ' + missing.map((e) => e.nombre).join(', '));
  return { qidToCve, cveToQid, cveToTitle };
}

// ---------------------------------------------------------------------------
// SECTUR: listado oficial de Pueblos Mágicos.
// ---------------------------------------------------------------------------
async function loadSectur() {
  const out = [];
  const a = htmlLines(await fetchText(SECTUR_URLS.lista132));
  const i0 = a.findIndex((l) => /listados a continuaci/i.test(l));
  if (i0 < 0) throw new Error('No se encontró la lista de 132 Pueblos Mágicos en ' + SECTUR_URLS.lista132);
  for (let i = i0 + 1; i < a.length; i++) {
    const m = /^(.*),\s*([^,]+)$/.exec(a[i]);
    if (!m) break;
    const cve = STATE_NAME_TO_CVE.get(norm(m[2]));
    if (!cve) throw new Error('Estado no reconocido en lista SECTUR: ' + a[i]);
    out.push({ nombre: m[1].trim(), cve, fuente: SECTUR_URLS.lista132 });
  }
  const b = htmlLines(await fetchText(SECTUR_URLS.nuevos45));
  const j0 = b.findIndex((l) => /Los nuevos Pueblos M[aá]gicos son/i.test(l));
  if (j0 < 0) throw new Error('No se encontró la lista de 45 nuevos Pueblos Mágicos en ' + SECTUR_URLS.nuevos45);
  let cur = null;
  let added = 0;
  for (let i = j0 + 1; i < b.length; i++) {
    const l = b[i];
    if (l.length > 60) break;
    const cve = STATE_NAME_TO_CVE.get(norm(l));
    if (cve) { cur = cve; continue; }
    if (!cur) continue;
    out.push({ nombre: l, cve: cur, fuente: SECTUR_URLS.nuevos45 });
    added++;
  }
  log(`SECTUR: ${out.length - added} (lista 2020/2021) + ${added} (nombramientos 2023) = ${out.length} Pueblos Mágicos`);
  return out;
}

// ---------------------------------------------------------------------------
// Detalle de entidades Wikidata (etiqueta, descripción, clases, imagen, municipio, designaciones).
// ---------------------------------------------------------------------------
const UNESCO = new Set(['Q9259', 'Q43113623']);
const detailCache = new Map();

async function wikidataDetails(ids, qidToCve) {
  const todo = [...new Set(ids)].filter((id) => !detailCache.has(id));
  for (const part of chunk(todo, 120)) {
    const rows = await sparql(`SELECT ?x ?label ?enlabel ?desc ?c ?h ?img ?coord ?title ?sl ?mun ?st WHERE {
      VALUES ?x { ${part.map((q) => 'wd:' + q).join(' ')} }
      ?x wikibase:sitelinks ?sl .
      OPTIONAL { ?x rdfs:label ?label FILTER(lang(?label) = "es") }
      OPTIONAL { ?x rdfs:label ?enlabel FILTER(lang(?enlabel) = "en") }
      OPTIONAL { ?x schema:description ?desc FILTER(lang(?desc) = "es") }
      OPTIONAL { ?x wdt:P31 ?c }
      OPTIONAL { ?x wdt:P1435 ?h }
      OPTIONAL { ?x wdt:P18 ?img }
      OPTIONAL { ?x wdt:P625 ?coord }
      OPTIONAL { ?a schema:about ?x ; schema:isPartOf <https://es.wikipedia.org/> ; schema:name ?title }
      OPTIONAL { ?x wdt:P131/wdt:P131? ?m . ?m wdt:P31 ?mc . VALUES ?mc { wd:Q1952852 wd:Q2734310 } ?m rdfs:label ?mun FILTER(lang(?mun) = "es") }
      OPTIONAL { ?x wdt:P131+ ?st . VALUES ?st { ${Object.keys(qidToCve).map((q) => 'wd:' + q).join(' ')} } }
    }`);
    const by = new Map();
    for (const r of rows) {
      const d = by.get(r.x) || { id: r.x, classes: new Set(), heritage: new Set(), images: [], coords: [], states: new Set(), munis: new Set() };
      d.label ??= r.label; d.enlabel ??= r.enlabel; d.desc ??= r.desc; d.title ??= r.title; d.sitelinks = +r.sl;
      if (r.c) d.classes.add(r.c);
      if (r.h) d.heritage.add(r.h);
      if (r.img && !d.images.includes(r.img)) d.images.push(r.img);
      if (r.coord && !d.coords.includes(r.coord)) d.coords.push(r.coord);
      if (r.st) d.states.add(qidToCve[r.st]);
      if (r.mun) d.munis.add(r.mun);
      by.set(r.x, d);
    }
    for (const id of part) detailCache.set(id, by.get(id) || null);
  }
  return ids.map((id) => detailCache.get(id));
}

// Elige la primera coordenada que cae (exactamente) dentro del estado.
function coordsInState(detail, cve) {
  for (const c of detail.coords) {
    const p = parsePoint(c);
    if (p && estadoDeCoordenada([p.lon, p.lat]) === cve) return { lat: round(p.lat), lon: round(p.lon) };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Wikipedia: extractos, imagen de página y título final.
// ---------------------------------------------------------------------------
const wikiInfo = new Map(); // título solicitado -> { title, extract, pageimage, qid }

async function loadWikiInfo(titles) {
  const todo = [...new Set(titles.filter(Boolean))].filter((t) => !wikiInfo.has(t));
  for (const part of chunk(todo, 20)) {
    const res = await wikiQueryAll({ titles: part.join('|'), prop: 'extracts|pageimages|pageprops', exintro: '1', explaintext: '1', exlimit: '20', piprop: 'name', ppprop: 'wikibase_item|disambiguation', redirects: '1' });
    const map = new Map(part.map((t) => [t, t]));
    for (const n of res.normalized) for (const [k, v] of map) if (v === n.from) map.set(k, n.to);
    for (const r of res.redirects) for (const [k, v] of map) if (v === r.from) map.set(k, r.to);
    const byTitle = new Map(res.pages.map((p) => [p.title, p]));
    for (const [asked, final] of map) {
      const p = byTitle.get(final);
      wikiInfo.set(asked, p && !p.missing ? { title: p.title, extract: p.extract || '', pageimage: p.pageimage || null, qid: p.pageprops?.wikibase_item || null, disambiguation: p.pageprops && 'disambiguation' in p.pageprops } : null);
    }
  }
}

// ---------------------------------------------------------------------------
// Construcción de un Item del esquema.
// ---------------------------------------------------------------------------
function buildItem(detail, { cve, tipo, distinciones = [], fuente, nombre, withCoords = true }) {
  const info = detail.title ? wikiInfo.get(detail.title) : null;
  let descripcion = info?.extract ? firstSentences(info.extract) : '';
  if (!descripcion && detail.desc) descripcion = ucfirst(detail.desc);
  let imagen = fileFromCommonsUrl(detail.images.find((u) => isPhoto(fileFromCommonsUrl(u))) || detail.images[0]);
  if (!imagen && info?.pageimage && isPhoto(info.pageimage)) imagen = info.pageimage;
  const coords = withCoords ? coordsInState(detail, cve) : null;
  const item = {
    id: detail.id,
    nombre: nombre || cleanName(detail.label || (info?.title ?? detail.title) || detail.enlabel || detail.id),
    tipo,
    descripcion: descripcion || null,
    lat: coords?.lat ?? null,
    lon: coords?.lon ?? null,
    imagen: imagen || null,
    wiki: info?.title ?? detail.title ?? null,
  };
  const mun = [...detail.munis][0];
  if (mun && withCoords) item.municipio = mun.replace(/^municipio de /i, '');
  const dist = new Set(distinciones);
  if ([...detail.heritage].some((h) => UNESCO.has(h))) dist.add('Patrimonio de la Humanidad (UNESCO)');
  if (detail.heritage.has('Q268998')) dist.add('Pueblo Mágico');
  if (detail.heritage.has('Q19683138')) dist.add('Sitio Ramsar');
  if (dist.size) item.distinciones = [...dist];
  item.fuente = fuente || `https://www.wikidata.org/wiki/${detail.id}`;
  return item;
}

// ---------------------------------------------------------------------------
// 1. Pueblos Mágicos.
// ---------------------------------------------------------------------------
const SETTLEMENT_CLASSES = ['Q20202352', 'Q1952852', 'Q486972', 'Q515', 'Q3957', 'Q532', 'Q2734310'];

async function isSettlement(ids) {
  if (!ids.length) return new Set();
  const rows = await sparql(`SELECT DISTINCT ?x WHERE { VALUES ?x { ${ids.map((q) => 'wd:' + q).join(' ')} }
    ?x wdt:P31/wdt:P279* ?c . VALUES ?c { ${SETTLEMENT_CLASSES.map((q) => 'wd:' + q).join(' ')} } }`);
  return new Set(rows.map((r) => r.x));
}

async function buildPueblos(sectur, states) {
  const rows = await sparql(`SELECT ?x ?label ?title ?st (GROUP_CONCAT(DISTINCT ?al; separator="|") AS ?als) (SAMPLE(?coord) AS ?c) WHERE {
    ?x p:P1435/ps:P1435 wd:Q268998 .
    OPTIONAL { ?x rdfs:label ?label FILTER(lang(?label) = "es") }
    OPTIONAL { ?x skos:altLabel ?al FILTER(lang(?al) = "es") }
    OPTIONAL { ?x wdt:P625 ?coord }
    OPTIONAL { ?a schema:about ?x ; schema:isPartOf <https://es.wikipedia.org/> ; schema:name ?title }
    OPTIONAL { ?x wdt:P131+ ?st . VALUES ?st { ${Object.keys(states.qidToCve).map((q) => 'wd:' + q).join(' ')} } }
  } GROUP BY ?x ?label ?title ?st`);
  const wd = new Map();
  for (const r of rows) {
    const o = wd.get(r.x) || { id: r.x, label: r.label, title: r.title, names: new Set(), states: new Set(), coord: r.c };
    for (const n of [r.label, r.title, ...(r.als ? r.als.split('|') : [])]) if (n) o.names.add(n);
    if (r.st) o.states.add(states.qidToCve[r.st]);
    wd.set(r.x, o);
  }
  // Estado de cada PM: P131+ → coordenada → (si no hay) se decide al emparejar con SECTUR.
  for (const id of Object.keys(WD_PM_ERRORS)) if (wd.has(id)) wd.get(id).error = WD_PM_ERRORS[id];
  for (const o of wd.values()) {
    o.cve = o.states.size === 1 ? [...o.states][0] : null;
    if (!o.cve && o.coord) o.cve = stateOfPoint(parsePoint(o.coord))?.cve ?? null;
  }
  log(`Wikidata: ${wd.size} elementos con P1435 = Pueblo Mágico (Q268998)`);

  // Emparejamiento global SECTUR ↔ Wikidata dentro del mismo estado (mejor puntaje primero).
  const pairs = [];
  sectur.forEach((s, si) => {
    for (const o of wd.values()) {
      if (o.cve !== s.cve || o.error) continue;
      const score = Math.max(...[...o.names].map((n) => nameSimilarity(n, s.nombre)));
      if (score >= 0.99) pairs.push({ si, id: o.id, score });
    }
  });
  pairs.sort((a, b) => b.score - a.score);
  const sToW = new Map(), usedW = new Set();
  for (const p of pairs) if (!sToW.has(p.si) && !usedW.has(p.id)) { sToW.set(p.si, p.id); usedW.add(p.id); }

  const discrepancies = [];
  const chosen = []; // { s, id, fuente }
  const toResolve = [];
  sectur.forEach((s, si) => {
    const id = sToW.get(si);
    if (id && wd.get(id).title) chosen.push({ s, id, wdPM: id });
    else toResolve.push({ s, si, wdPM: id || null });
  });

  // Resolución vía es.wikipedia de los nombres SECTUR sin elemento PM utilizable en Wikidata.
  for (const r of toResolve) {
    const e = STATE_BY_CVE[r.s.cve];
    const cands = [`${r.s.nombre} (${e.nombreCorto})`, `${r.s.nombre} (${e.nombre})`, r.s.nombre];
    const search = await wikiApi({ action: 'query', list: 'search', srsearch: `${r.s.nombre} ${e.nombreCorto}`, srlimit: '5', srnamespace: '0' });
    for (const h of search.query?.search || []) cands.push(h.title);
    await loadWikiInfo(cands);
    const qids = [...new Set(cands.map((t) => wikiInfo.get(t)).filter((w) => w?.qid && !w.disambiguation && nameSimilarity(w.title, r.s.nombre) >= 0.99).map((w) => w.qid))];
    const settle = await isSettlement(qids);
    const dets = await wikidataDetails(qids, states.qidToCve);
    let pick = null;
    for (const d of dets) {
      if (!d || !settle.has(d.id) || !d.title) continue;
      const inState = d.states.has(r.s.cve) || d.coords.some((c) => stateOfPoint(parsePoint(c))?.cve === r.s.cve);
      if (inState) { pick = d; break; }
    }
    if (pick) {
      chosen.push({ s: r.s, id: pick.id, wdPM: r.wdPM, fuente: r.s.fuente });
      discrepancies.push(r.wdPM
        ? `${e.nombre}: «${r.s.nombre}» — el elemento PM de Wikidata ${r.wdPM} no tiene artículo en es.wikipedia; se usa ${pick.id} («${pick.title}»)`
        : `${e.nombre}: «${r.s.nombre}» (SECTUR) no tiene elemento con P1435=Pueblo Mágico en Wikidata; se resolvió como ${pick.id} («${pick.title}»)`);
    } else if (r.wdPM) {
      chosen.push({ s: r.s, id: r.wdPM, wdPM: r.wdPM });
      discrepancies.push(`${e.nombre}: «${r.s.nombre}» — elemento ${r.wdPM} sin artículo en es.wikipedia (se conserva)`);
    } else {
      discrepancies.push(`${e.nombre}: «${r.s.nombre}» (SECTUR) NO se pudo resolver en Wikidata/Wikipedia`);
    }
  }
  const chosenIds = new Set(chosen.map((c) => c.wdPM).filter(Boolean));
  for (const o of wd.values()) {
    if (chosenIds.has(o.id)) continue;
    const st = o.cve ? STATE_BY_CVE[o.cve].nombre : 'sin estado';
    if (o.error) { discrepancies.push(`Wikidata ${o.id} marcado como Pueblo Mágico es otra localidad: ${o.error} — excluido`); continue; }
    discrepancies.push(`Wikidata ${o.id} «${o.label || [...o.names][0] || 'sin etiqueta'}» (${st}) está marcado como Pueblo Mágico pero no figura en el listado SECTUR de ese estado — excluido`);
  }

  const dets = await wikidataDetails(chosen.map((c) => c.id), states.qidToCve);
  await loadWikiInfo(dets.filter(Boolean).map((d) => d.title));
  const byState = Object.fromEntries(ESTADOS.map((e) => [e.cve, []]));
  const coordsDropped = [];
  chosen.forEach((c, i) => {
    const d = dets[i];
    const item = buildItem(d, { cve: c.s.cve, tipo: 'Pueblo Mágico', distinciones: ['Pueblo Mágico'], nombre: cleanName(c.s.nombre), fuente: c.fuente });
    if (item.lat == null && d.coords.length) coordsDropped.push(`${item.nombre} (${STATE_BY_CVE[c.s.cve].nombre})`);
    if (!byState[c.s.cve].some((x) => x.id === item.id)) byState[c.s.cve].push(item);
  });
  for (const list of Object.values(byState)) list.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return { byState, discrepancies, coordsDropped, wdCount: wd.size };
}

// ---------------------------------------------------------------------------
// 2–3. Historia y destinos: grupos de clases de Wikidata con artículo en es.wikipedia y P625.
// ---------------------------------------------------------------------------
const HISTORIA_ROOTS = [
  ['Q839954', 'Zona arqueológica'],
  ['Q676050', 'Centro histórico'],
  ['Q2977', 'Catedral'],
  ['Q94483283', 'Ex convento'],
  ['Q1128397', 'Convento'],
  ['Q44613', 'Convento'],
  ['Q30651197', 'Misión'],
  ['Q1564373', 'Misión'],
  ['Q10631691', 'Santuario'],
  ['Q16970', 'Templo'],
  ['Q44539', 'Templo'],
  ['Q917730', 'Hacienda'],
  ['Q1785071', 'Fuerte'],
  ['Q57821', 'Fortificación'],
  ['Q33506', 'Museo'],
  ['Q16560', 'Palacio'],
  ['Q474', 'Acueducto'],
  ['Q24354', 'Teatro'],
  ['Q4989906', 'Monumento'],
];
const DESTINOS_ROOTS = [
  ['Q158454', 'Reserva de la biosfera'],
  ['Q46169', 'Parque nacional'],
  ['Q6825971', 'Área natural protegida'],
  ['Q473972', 'Área natural protegida'],
  ['Q40080', 'Playa'],
  ['Q34038', 'Cascada'],
  ['Q334743', 'Cenote'],
  ['Q187223', 'Laguna'],
  ['Q4990444', 'Laguna'],
  ['Q23397', 'Lago'],
  ['Q150784', 'Cañón'],
  ['Q8072', 'Volcán'],
  ['Q8502', 'Montaña'],
  ['Q46831', 'Sierra'],
  ['Q23442', 'Isla'],
  ['Q39594', 'Bahía'],
  ['Q35509', 'Gruta'],
  ['Q184358', 'Arrecife'],
  ['Q124714', 'Manantial'],
  ['Q1021711', 'Destino de playa'],
  ['Q317548', 'Destino turístico'],
  ['Q2416723', 'Parque temático'],
  ['Q740326', 'Parque acuático'],
  ['Q167346', 'Jardín botánico'],
  ['Q570116', 'Atractivo turístico'],
];
// Ciudades: localidades/ciudades con artículo y ≥ 12 enlaces interwiki (notoriedad).
const CITY_MIN_SITELINKS = 12;
const NATURAL_TIPOS = new Set(DESTINOS_ROOTS.map(([, t]) => t));

async function pool(root, extra = '') {
  return sparql(`SELECT ?x ?sl ?coord ?title WHERE {
    ?x wdt:P31/wdt:P279* wd:${root} ; wdt:P17 wd:Q96 ; wdt:P625 ?coord ; wikibase:sitelinks ?sl .
    ?a schema:about ?x ; schema:isPartOf <https://es.wikipedia.org/> ; schema:name ?title .
    ${extra}
  }`);
}

async function loadPools() {
  const items = new Map(); // id -> { id, sl, coords[], title, roots:Set, tipos:[], unesco, city }
  const add = (rows, fn) => {
    for (const r of rows) {
      const o = items.get(r.x) || { id: r.x, sl: +r.sl, coords: [], title: r.title, tiposH: [], tiposD: [], unesco: false, city: false };
      if (!o.coords.includes(r.coord)) o.coords.push(r.coord);
      fn(o);
      items.set(r.x, o);
    }
  };
  for (const [root, tipo] of HISTORIA_ROOTS) {
    const rows = await pool(root);
    add(rows, (o) => { if (!o.tiposH.includes(tipo)) o.tiposH.push(tipo); });
    log(`  historia · ${tipo} (${root}): ${new Set(rows.map((r) => r.x)).size}`);
  }
  const unesco = await sparql(`SELECT ?x ?sl ?coord ?title WHERE {
    ?x wdt:P1435 ?h . VALUES ?h { wd:Q9259 wd:Q43113623 } ?x wdt:P17 wd:Q96 ; wdt:P625 ?coord ; wikibase:sitelinks ?sl .
    ?a schema:about ?x ; schema:isPartOf <https://es.wikipedia.org/> ; schema:name ?title . }`);
  add(unesco, (o) => { o.unesco = true; });
  log(`  historia · UNESCO: ${new Set(unesco.map((r) => r.x)).size}`);
  for (const [root, tipo] of DESTINOS_ROOTS) {
    const rows = await pool(root);
    add(rows, (o) => { if (!o.tiposD.includes(tipo)) o.tiposD.push(tipo); });
    log(`  destinos · ${tipo} (${root}): ${new Set(rows.map((r) => r.x)).size}`);
  }
  for (const root of ['Q515', 'Q20202352']) {
    const rows = await pool(root, `FILTER(?sl >= ${CITY_MIN_SITELINKS})`);
    add(rows, (o) => { o.city = true; });
    log(`  destinos · ciudades (${root}, ≥${CITY_MIN_SITELINKS} sitelinks): ${new Set(rows.map((r) => r.x)).size}`);
  }
  return items;
}

function assignState(o) {
  for (const c of o.coords) {
    const p = parsePoint(c);
    if (!p) continue;
    const s = stateOfPoint(p);
    if (s) return s;
  }
  return null;
}

async function buildHistoriaDestinos(items, states, pueblosIds) {
  const historia = Object.fromEntries(ESTADOS.map((e) => [e.cve, []]));
  const destinos = Object.fromEntries(ESTADOS.map((e) => [e.cve, []]));
  const rejected = { border: 0, outside: 0 };
  // Asignación de estado por coordenada (y concordancia con P131 cuando Wikidata lo tiene).
  for (const o of items.values()) o.state = assignState(o);
  const all = [...items.values()].filter((o) => o.state && !pueblosIds.has(o.id));
  // Detalle sólo de candidatos plausibles (orden por notoriedad, tope generoso por estado).
  const perState = new Map();
  for (const o of all.sort((a, b) => b.sl - a.sl)) {
    const list = perState.get(o.state.cve) || [];
    list.push(o);
    perState.set(o.state.cve, list);
  }
  const candidates = [];
  for (const [cve, list] of perState) {
    const hPri = list.filter((o) => o.unesco || o.tiposH.includes('Zona arqueológica'));
    const hRest = list.filter((o) => o.tiposH.length && !hPri.includes(o)).slice(0, 80);
    const dNat = list.filter((o) => o.tiposD.length).slice(0, 90);
    const dCity = list.filter((o) => o.city && !o.tiposD.length).slice(0, 15);
    candidates.push(...new Set([...hPri, ...hRest, ...dNat, ...dCity]));
  }
  const details = await wikidataDetails(candidates.map((o) => o.id), states.qidToCve);
  const detailById = new Map(details.filter(Boolean).map((d) => [d.id, d]));
  const ok = [];
  for (const o of candidates) {
    const d = detailById.get(o.id);
    if (!d || !d.title) continue;
    const cve = o.state.cve;
    // Si Wikidata ubica el elemento (P131) en otro estado, la coordenada es dudosa: se descarta.
    if (d.states.size && !d.states.has(cve)) { rejected.border++; continue; }
    o.d = d;
    o.cve = cve;
    ok.push(o);
  }
  // Clasificación: patrimonio natural UNESCO y áreas protegidas → destinos; el resto del patrimonio → historia.
  for (const e of ESTADOS) {
    const list = ok.filter((o) => o.cve === e.cve);
    const isNatural = (o) => o.tiposD.length && !o.tiposH.length;
    const hAll = list.filter((o) => (o.tiposH.length || o.unesco) && !isNatural(o) && !o.city);
    const pri = hAll.filter((o) => o.unesco || o.tiposH.includes('Zona arqueológica')).sort((a, b) => (b.unesco - a.unesco) || (b.sl - a.sl));
    const rest = hAll.filter((o) => !pri.includes(o)).sort((a, b) => b.sl - a.sl);
    const nPri = Math.min(pri.length, LIMITS.historiaPrioritarios);
    const nRest = Math.max(LIMITS.historia - nPri, LIMITS.historiaMinOtros);
    const hSel = [...pri.slice(0, nPri), ...rest.slice(0, nRest)];
    const hIds = new Set(hSel.map((o) => o.id));
    const dCand = list.filter((o) => !hIds.has(o.id) && (o.tiposD.length || o.city || (o.unesco && isNatural(o))));
    const cities = dCand.filter((o) => o.city && !o.tiposD.length).sort((a, b) => b.sl - a.sl).slice(0, LIMITS.destinosCiudades);
    const natural = dCand.filter((o) => o.tiposD.length).sort((a, b) => (b.unesco - a.unesco) || (b.sl - a.sl));
    const dSel = [...cities, ...natural].sort((a, b) => (b.unesco - a.unesco) || (b.sl - a.sl)).slice(0, LIMITS.destinos);
    historia[e.cve] = hSel;
    destinos[e.cve] = dSel;
  }
  await loadWikiInfo([...Object.values(historia), ...Object.values(destinos)].flat().map((o) => o.d.title));
  const toItems = (bucket, kind) => {
    for (const e of ESTADOS) {
      bucket[e.cve] = bucket[e.cve]
        .map((o) => {
          const tipo = kind === 'historia'
            ? o.tiposH[0] || (o.unesco ? 'Patrimonio de la Humanidad' : 'Sitio histórico')
            : o.tiposD.length ? o.tiposD[0] : 'Ciudad';
          const it = buildItem(o.d, { cve: e.cve, tipo });
          // Punto en el mar/costa según el polígono simplificado: se conserva el lugar sin coordenada.
          if (it.lat == null) rejected.outside++;
          return it;
        });
    }
  };
  toItems(historia, 'historia');
  toItems(destinos, 'destinos');
  return { historia, destinos, rejected };
}

// ---------------------------------------------------------------------------
// 4. Cocina: categoría «Gastronomía de <estado>», artículo «Gastronomía de <estado>», sección de
// gastronomía del artículo del estado y propiedades de origen en Wikidata; filtrado a alimentos/bebidas.
// ---------------------------------------------------------------------------
const FOOD_ROOTS = ['Q2095', 'Q746549', 'Q40050', 'Q19861951', 'Q5159627', 'Q182940', 'Q185583', 'Q7802', 'Q178359', 'Q10943', 'Q41415', 'Q154'];
const NOT_FOOD = ['Q16521', 'Q4886', 'Q1968435', 'Q11707', 'Q4830453', 'Q43229', 'Q5', 'Q13406463', 'Q4167410', 'Q17537576'];
const TIPO_FOOD = [
  ['Q154', 'Bebida'], ['Q40050', 'Bebida'],
  ['Q182940', 'Dulce'], ['Q5159627', 'Dulce'], ['Q185583', 'Dulce'],
  ['Q7802', 'Pan'], ['Q178359', 'Salsa'], ['Q10943', 'Queso'], ['Q41415', 'Sopa'],
];

function gastroArticleCandidates(e) {
  const names = [...new Set([e.nombre, e.nombreCorto])];
  const t = [];
  if (e.cve === '15') t.push('Gastronomía del Estado de México');
  else if (e.cve === '09') t.push('Gastronomía de la Ciudad de México');
  else for (const n of names) t.push(`Gastronomía de ${n}`, `Gastronomía del estado de ${n}`);
  return t;
}
function gastroCategoryCandidates(e) {
  if (e.cve === '15') return ['Categoría:Gastronomía del estado de México', 'Categoría:Gastronomía del Estado de México'];
  if (e.cve === '09') return ['Categoría:Gastronomía de la Ciudad de México'];
  const names = [...new Set([e.nombre, e.nombreCorto])];
  return names.flatMap((n) => [`Categoría:Gastronomía de ${n}`, `Categoría:Gastronomía del estado de ${n}`]);
}

async function existingTitles(titles) {
  await loadWikiInfo(titles);
  return [...new Set(titles.map((t) => wikiInfo.get(t)?.title).filter(Boolean))];
}

async function linksOf(title) {
  const res = await wikiQueryAll({ titles: title, prop: 'links', plnamespace: '0', pllimit: 'max', redirects: '1' });
  return res.pages.flatMap((p) => (p.links || []).map((l) => l.title));
}

async function categoryMembers(cat, depth = 1) {
  const res = await wikiQueryAll({ list: 'categorymembers', cmtitle: cat, cmtype: 'page|subcat', cmlimit: 'max' });
  const out = [];
  for (const m of res.lists.categorymembers || []) {
    if (m.ns === 0) out.push(m.title);
    else if (m.ns === 14 && depth > 0) out.push(...(await categoryMembers(m.title, depth - 1)));
  }
  return out;
}

async function stateGastroSectionLinks(stateTitle) {
  if (!stateTitle) return [];
  const sec = await wikiApi({ action: 'parse', page: stateTitle, prop: 'sections', redirects: '1' });
  const hits = (sec.parse?.sections || []).filter((s) => /gastronom|cocina|comida/i.test(s.line));
  const out = [];
  for (const s of hits) {
    const p = await wikiApi({ action: 'parse', page: stateTitle, prop: 'links', section: s.index, redirects: '1' });
    out.push(...(p.parse?.links || []).filter((l) => l.ns === 0 && l.exists).map((l) => l.title));
  }
  return out;
}

async function titlesToQids(titles) {
  await loadWikiInfo(titles);
  const m = new Map();
  for (const t of titles) {
    const w = wikiInfo.get(t);
    if (w?.qid && !w.disambiguation) m.set(t, w.qid);
  }
  return m;
}

async function foodFilter(qids) {
  const out = new Map(); // qid -> tipo
  for (const part of chunk([...new Set(qids)], 150)) {
    const rows = await sparql(`SELECT ?x ?root WHERE {
      VALUES ?x { ${part.map((q) => 'wd:' + q).join(' ')} }
      ?x (wdt:P31|wdt:P279)/wdt:P279* ?root . VALUES ?root { ${FOOD_ROOTS.map((q) => 'wd:' + q).join(' ')} }
      FILTER NOT EXISTS { ?x wdt:P31 ?bad . VALUES ?bad { ${NOT_FOOD.map((q) => 'wd:' + q).join(' ')} } }
    }`);
    const roots = new Map();
    for (const r of rows) roots.set(r.x, (roots.get(r.x) || new Set()).add(r.root));
    for (const [x, rs] of roots) out.set(x, (TIPO_FOOD.find(([q]) => rs.has(q)) || [, 'Platillo'])[1]);
  }
  return out;
}

async function wikidataOriginFoods(states) {
  // Alimentos/bebidas cuyo lugar de creación (P1071), ubicación (P131/P276), origen (P495) o
  // cultura (P2596) es un lugar dentro de un estado (P131*).
  const rows = await sparql(`SELECT DISTINCT ?x ?place WHERE {
    ?x ?p ?place . VALUES ?p { wdt:P1071 wdt:P131 wdt:P276 wdt:P183 wdt:P2596 wdt:P495 }
    ?place wdt:P17 wd:Q96 . FILTER(?place != wd:Q96)
    ?a schema:about ?x ; schema:isPartOf <https://es.wikipedia.org/> .
    ?x (wdt:P31|wdt:P279)/wdt:P279* wd:Q2095 .
  }`);
  const places = [...new Set(rows.map((r) => r.place))];
  const pst = places.length
    ? await sparql(`SELECT ?place ?st WHERE { VALUES ?place { ${places.map((q) => 'wd:' + q).join(' ')} }
        ?place wdt:P131* ?st . VALUES ?st { ${Object.keys(states.qidToCve).map((q) => 'wd:' + q).join(' ')} } }`)
    : [];
  const placeState = new Map(pst.map((r) => [r.place, states.qidToCve[r.st]]));
  const out = Object.fromEntries(ESTADOS.map((e) => [e.cve, new Set()]));
  for (const r of rows) { const c = placeState.get(r.place); if (c) out[c].add(r.x); }
  return out;
}

async function buildCocina(states) {
  const sources = {}; // cve -> Map(qid -> {cat, art, sec, wd})
  const report = {};
  const origin = await wikidataOriginFoods(states);
  for (const e of ESTADOS) {
    const src = new Map();
    const mark = (qid, k) => { const o = src.get(qid) || {}; o[k] = true; src.set(qid, o); };
    const cats = (await existingTitles(gastroCategoryCandidates(e)));
    const catTitles = [];
    for (const c of cats) catTitles.push(...(await categoryMembers(c)));
    const arts = (await existingTitles(gastroArticleCandidates(e)));
    const artTitles = [];
    for (const a of arts) artTitles.push(...(await linksOf(a)));
    const secTitles = await stateGastroSectionLinks(states.cveToTitle[e.cve]);
    const all = [...new Set([...catTitles, ...artTitles, ...secTitles])];
    const t2q = await titlesToQids(all);
    for (const t of catTitles) if (t2q.has(t)) mark(t2q.get(t), 'cat');
    for (const t of artTitles) if (t2q.has(t)) mark(t2q.get(t), 'art');
    for (const t of secTitles) if (t2q.has(t)) mark(t2q.get(t), 'sec');
    for (const q of origin[e.cve]) mark(q, 'wd');
    sources[e.cve] = src;
    report[e.cve] = { categoria: cats[0] || null, articulo: arts[0] || null, seccion: secTitles.length > 0 };
  }
  const allQ = [...new Set(Object.values(sources).flatMap((m) => [...m.keys()]))];
  const food = await foodFilter(allQ);
  // Frecuencia entre estados de los enlaces "sueltos" (artículo/sección): los muy repetidos son genéricos.
  const df = new Map();
  for (const m of Object.values(sources)) for (const q of m.keys()) df.set(q, (df.get(q) || 0) + 1);
  const cocina = {};
  const picked = {};
  for (const e of ESTADOS) {
    const list = [];
    for (const [q, s] of sources[e.cve]) {
      if (!food.has(q)) continue;
      const strong = s.cat || s.wd;
      const both = s.art && s.sec;
      if (!strong && !both && (df.get(q) || 0) > 6) continue; // genérico nacional (tortilla, frijol…)
      const score = (s.cat ? 4 : 0) + (s.wd ? 4 : 0) + (s.art ? 2 : 0) + (s.sec ? 2 : 0) - Math.max(0, (df.get(q) || 1) - 3) * 0.5;
      list.push({ q, score, tipo: food.get(q) });
    }
    picked[e.cve] = list;
  }
  const dets = await wikidataDetails([...new Set(Object.values(picked).flat().map((x) => x.q))], states.qidToCve);
  const det = new Map(dets.filter(Boolean).map((d) => [d.id, d]));
  for (const e of ESTADOS) {
    const ranked = picked[e.cve].filter((x) => det.get(x.q)?.title).sort((a, b) => b.score - a.score || det.get(b.q).sitelinks - det.get(a.q).sitelinks).slice(0, LIMITS.cocina);
    picked[e.cve] = ranked;
  }
  await loadWikiInfo(Object.values(picked).flat().map((x) => det.get(x.q).title));
  for (const e of ESTADOS) cocina[e.cve] = picked[e.cve].map((x) => buildItem(det.get(x.q), { cve: e.cve, tipo: x.tipo, withCoords: false }));
  return { cocina, report };
}

// ---------------------------------------------------------------------------
// Principal.
// ---------------------------------------------------------------------------
async function main() {
  log(`Atlas-MX · catálogo turístico verificado (${TODAY})${FRESH ? ' · sin caché' : ''}`);
  const states = await loadStates();
  const sectur = await loadSectur();

  log('\n[1/4] Pueblos Mágicos');
  const pm = await buildPueblos(sectur, states);
  const pueblosIds = new Set(Object.values(pm.byState).flat().map((x) => x.id));

  log('\n[2-3/4] Historia y destinos (grupos de Wikidata)');
  const pools = await loadPools();
  const hd = await buildHistoriaDestinos(pools, states, pueblosIds);

  log('\n[4/4] Cocina');
  const ck = await buildCocina(states);

  // Escritura.
  rmSync(STATES_DIR, { recursive: true, force: true });
  mkdirSync(STATES_DIR, { recursive: true });
  const index = [];
  const errors = [];
  const table = [];
  let missingImg = 0, missingDesc = 0, totalItems = 0;
  for (const e of ESTADOS) {
    const cats = { pueblos: pm.byState[e.cve], historia: hd.historia[e.cve], destinos: hd.destinos[e.cve], cocina: ck.cocina[e.cve] };
    // Sin duplicados entre categorías (prioridad pueblos > historia > destinos); cocina es independiente.
    const seen = new Set();
    for (const k of ['pueblos', 'historia', 'destinos']) cats[k] = cats[k].filter((it) => (seen.has(it.id) ? false : (seen.add(it.id), true)));
    for (const [k, list] of Object.entries(cats)) {
      const ids = new Set();
      for (const it of list) {
        if (ids.has(it.id)) errors.push(`${e.cve}/${k}: id repetido ${it.id}`);
        ids.add(it.id);
        if (it.lat != null && estadoDeCoordenada([it.lon, it.lat]) !== e.cve) errors.push(`${e.cve}/${k}: ${it.nombre} (${it.lat}, ${it.lon}) cae fuera de ${e.nombre}`);
        if (!it.imagen) missingImg++;
        if (!it.descripcion) missingDesc++;
        totalItems++;
        const entry = { id: it.id, n: it.nombre, c: k, s: e.cve };
        if (it.imagen && it.descripcion) entry.p = 1;
        index.push(entry);
      }
    }
    const sectCount = sectur.filter((s) => s.cve === e.cve).length;
    if (sectCount > 0 && cats.pueblos.length === 0) errors.push(`${e.nombre}: SECTUR lista ${sectCount} Pueblos Mágicos y el catálogo tiene 0`);
    if (cats.pueblos.length !== sectCount) errors.push(`${e.nombre}: ${cats.pueblos.length} Pueblos Mágicos en catálogo vs ${sectCount} en SECTUR`);
    const data = { cve: e.cve, estado: e.nombre, wikidata: states.cveToQid[e.cve], generado: TODAY, categorias: cats };
    writeFileSync(new URL(`${e.cve}.json`, STATES_DIR), JSON.stringify(data, null, 1) + '\n');
    table.push({ cve: e.cve, estado: e.nombreCorto, pueblos: cats.pueblos.length, sectur: sectCount, historia: cats.historia.length, destinos: cats.destinos.length, cocina: cats.cocina.length });
  }
  writeFileSync(new URL('index.json', OUT_DIR), JSON.stringify(index) + '\n');

  // Informe.
  log('\n=== Conteos por estado ===');
  log('cve estado                 pueblos(SECTUR) historia destinos cocina');
  for (const r of table) log(`${r.cve}  ${r.estado.padEnd(22)} ${String(r.pueblos).padStart(3)} (${String(r.sectur).padStart(2)})      ${String(r.historia).padStart(3)}      ${String(r.destinos).padStart(3)}    ${String(r.cocina).padStart(3)}`);
  const sum = (k) => table.reduce((a, r) => a + r[k], 0);
  log(`TOTAL                      ${sum('pueblos')} (${sum('sectur')})     ${sum('historia')}     ${sum('destinos')}   ${sum('cocina')}`);
  log(`\nPueblos Mágicos: ${sum('pueblos')} en catálogo · ${sectur.length} en SECTUR · ${pm.wdCount} con P1435 en Wikidata`);
  log(`Elementos: ${totalItems} · sin imagen: ${missingImg} · sin descripción: ${missingDesc}`);
  log(`Historia/destinos: ${hd.rejected.border} candidatos descartados por P131 en otro estado; ${hd.rejected.outside} conservados sin coordenada (punto costero fuera del polígono)`);
  if (pm.coordsDropped.length) log(`Pueblos Mágicos con coordenada anulada (cae fuera del polígono simplificado): ${pm.coordsDropped.join(', ')}`);
  log('\n=== Discrepancias Wikidata vs SECTUR ===');
  for (const d of pm.discrepancies) log(' - ' + d);
  log('\n=== Fuentes de cocina por estado ===');
  for (const e of ESTADOS) { const r = ck.report[e.cve]; log(` ${e.cve} ${e.nombreCorto}: ${[r.categoria, r.articulo, r.seccion ? 'sección del artículo del estado' : null].filter(Boolean).join(' · ') || 'sólo Wikidata'}`); }
  const size = [...readdirSync(STATES_DIR)].reduce((a, f) => a + statSync(new URL(f, STATES_DIR)).size, 0) + statSync(new URL('index.json', OUT_DIR)).size;
  log(`\nTamaño de src/data/generated: ${(size / 1024 / 1024).toFixed(2)} MB · peticiones HTTP: ${stats.requests} (caché: ${stats.cached}, reintentos: ${stats.retries})`);
  if (errors.length) {
    console.error('\n✖ ERRORES DE CALIDAD:\n' + errors.map((x) => ' - ' + x).join('\n'));
    process.exit(1);
  }
  log('\n✔ Puertas de calidad superadas.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
