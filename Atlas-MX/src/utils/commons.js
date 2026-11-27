// URLs de miniaturas de Wikimedia Commons.
// Se piden directo al CDN (upload.wikimedia.org/…/thumb/a/ab/Archivo.jpg/500px-Archivo.jpg): quedan en caché y
// no pasan por las dos redirecciones de Special:FilePath, que Wikimedia limita con 429 cuando hay muchas fotos.
// Si la miniatura directa falla (p. ej. la foto original es más chica que el ancho pedido), `retryCommons`
// cambia la imagen a Special:FilePath, que sabe devolver el original.

// Anchos estándar de miniaturas de Wikimedia: los demás no están en caché y pueden rechazarse.
const STEPS = [120, 250, 330, 500, 960, 1280, 1920];
const step = (width) => STEPS.find((s) => s >= width) || STEPS[STEPS.length - 1];

/* MD5 compacto (RFC 1321) sobre UTF-8: Commons reparte los archivos en carpetas según el hash del nombre. */
function md5(input) {
  const bytes = new TextEncoder().encode(input);
  const words = new Array(((bytes.length + 8) >> 6) * 16 + 16).fill(0);
  for (let i = 0; i < bytes.length; i += 1) words[i >> 2] |= bytes[i] << ((i % 4) * 8);
  words[bytes.length >> 2] |= 0x80 << ((bytes.length % 4) * 8);
  words[words.length - 2] = bytes.length * 8;
  const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) | 0);
  const R = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
  let [a0, b0, c0, d0] = [0x67452301, 0xefcdab89 | 0, 0x98badcfe | 0, 0x10325476];
  for (let chunk = 0; chunk < words.length; chunk += 16) {
    let [a, b, c, d] = [a0, b0, c0, d0];
    for (let i = 0; i < 64; i += 1) {
      const round = i >> 4;
      let f; let g;
      if (round === 0) { f = (b & c) | (~b & d); g = i; }
      else if (round === 1) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16; }
      else if (round === 2) { f = b ^ c ^ d; g = (3 * i + 5) % 16; }
      else { f = c ^ (b | ~d); g = (7 * i) % 16; }
      const s = R[round * 4 + (i % 4)];
      const sum = (a + f + K[i] + words[chunk + g]) | 0;
      a = d; d = c; c = b;
      b = (b + ((sum << s) | (sum >>> (32 - s)))) | 0;
    }
    a0 = (a0 + a) | 0; b0 = (b0 + b) | 0; c0 = (c0 + c) | 0; d0 = (d0 + d) | 0;
  }
  return [a0, b0, c0, d0].map((n) => Array.from({ length: 4 }, (_, i) => ((n >>> (i * 8)) & 255).toString(16).padStart(2, '0')).join('')).join('');
}

const normalize = (file) => String(file || '').replace(/^(File|Archivo|Imagen|Image):/i, '').trim().replace(/ /g, '_');
const encodePath = (name) => encodeURIComponent(name).replace(/%2C/g, ',').replace(/%28/g, '(').replace(/%29/g, ')');

/** URL de respaldo: Special:FilePath redirige al archivo (o a su miniatura) aunque el original sea pequeño. */
export function commonsRedirectUrl(file, width = 960) {
  const name = normalize(file);
  return name ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}?width=${step(width)}` : '';
}

/** Miniatura directa del CDN de Commons al ancho estándar más cercano (hacia arriba). */
export function commonsThumbUrl(file, width = 960) {
  const name = normalize(file);
  if (!name) return '';
  const ext = (/\.([a-z0-9]+)$/i.exec(name)?.[1] || '').toLowerCase();
  if (!['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return commonsRedirectUrl(name, width);
  const hash = md5(name);
  const thumb = `${step(width)}px-${name}${ext === 'svg' ? '.png' : ''}`;
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${hash[0]}/${hash.slice(0, 2)}/${encodePath(name)}/${encodePath(thumb)}`;
}

/**
 * Para usar en onError: si la imagen era una miniatura directa del CDN, la cambia a Special:FilePath y
 * devuelve true (se reintenta). Devuelve false si ya no hay respaldo.
 */
export function retryCommons(img) {
  const match = /upload\.wikimedia\.org\/wikipedia\/commons\/thumb\/[0-9a-f]\/[0-9a-f]{2}\/([^/]+)\/(\d+)px-/.exec(img?.currentSrc || img?.src || '');
  if (!match) return false;
  img.src = commonsRedirectUrl(decodeURIComponent(match[1]), Number(match[2]));
  return true;
}

