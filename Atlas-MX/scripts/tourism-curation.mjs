// Curaduría final del catálogo turístico (revisión manual de la salida de build-tourism-data.mjs):
// fuera lugares que ya no existen y cosas que no son un lugar para visitar; corrige tipos mal inferidos.
const DEFUNCT = /^[^.]{0,140}\b(fue|era) (un|una) (parque|zoológico|feria|acuario|centro)\b/i;
const NOT_A_VISIT = new Set(['Reina Roja']);
const RETYPE = [[/^Plaza (de toros|Monumental)\b/i, 'Plaza de toros'], [/^Auditorio\b/i, 'Auditorio'], [/^Estadio\b/i, 'Estadio']];

/** Devuelve la lista curada; `onDrop(item)` se llama por cada elemento descartado. */
export function curateList(list, { cve, key, stateName, onDrop = () => {} }) {
  return (list || []).filter((it) => {
    const drop = NOT_A_VISIT.has(it.nombre) || DEFUNCT.test(it.descripcion || '')
      // Un municipio entero no es un sitio para visitar (su cabecera ya aparece como ciudad o pueblo).
      || /^Municipio de /i.test(it.nombre)
      // La propia Ciudad de México no es un "destino dentro" de la Ciudad de México.
      || (key === 'destinos' && cve === '09' && it.nombre === stateName);
    if (drop) onDrop(it);
    return !drop;
  }).map((it) => {
    const rule = RETYPE.find(([re]) => re.test(it.nombre));
    return rule ? { ...it, tipo: rule[1] } : it;
  });
}
