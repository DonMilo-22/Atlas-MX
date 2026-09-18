const PROFILES = {
  highlands: {
    bestMonths: [10, 11, 12, 1, 2, 3, 4],
    window: 'Octubre a abril',
    reason: 'Días templados y, en general, menor probabilidad de lluvia.',
    note: 'Las mañanas y noches pueden ser frías en zonas altas.'
  },
  desert: {
    bestMonths: [10, 11, 12, 1, 2, 3, 4],
    window: 'Octubre a abril',
    reason: 'Temperaturas más cómodas para recorrer desiertos, sierras y ciudades.',
    note: 'Entre mayo y septiembre el calor puede ser extremo en zonas bajas.'
  },
  dryCoast: {
    bestMonths: [10, 11, 12, 1, 2, 3, 4, 5],
    window: 'Octubre a mayo',
    reason: 'Clima cálido con menor humedad y buenas condiciones para actividades al aire libre.',
    note: 'Revisa el pronóstico marítimo antes de realizar actividades acuáticas.'
  },
  pacific: {
    bestMonths: [11, 12, 1, 2, 3, 4],
    window: 'Noviembre a abril',
    reason: 'Coincide con la temporada más seca y temperaturas agradables en la costa.',
    note: 'De junio a noviembre conviene vigilar lluvias y ciclones tropicales.'
  },
  tropical: {
    bestMonths: [11, 12, 1, 2, 3, 4],
    window: 'Noviembre a abril',
    reason: 'Menor humedad y lluvia para combinar ciudades, naturaleza y zonas arqueológicas.',
    note: 'La temporada de lluvias puede modificar caminos y actividades al aire libre.'
  }
};

const STATE_PROFILE = {
  '01': 'highlands', '02': 'dryCoast', '03': 'dryCoast', '04': 'tropical',
  '05': 'desert', '06': 'pacific', '07': 'tropical', '08': 'desert',
  '09': 'highlands', '10': 'desert', '11': 'highlands', '12': 'pacific',
  '13': 'highlands', '14': 'highlands', '15': 'highlands', '16': 'highlands',
  '17': 'highlands', '18': 'pacific', '19': 'desert', '20': 'tropical',
  '21': 'highlands', '22': 'highlands', '23': 'tropical', '24': 'desert',
  '25': 'pacific', '26': 'desert', '27': 'tropical', '28': 'tropical',
  '29': 'highlands', '30': 'tropical', '31': 'tropical', '32': 'highlands'
};

export function getTravelSeason(stateCode) {
  return PROFILES[STATE_PROFILE[stateCode]] || PROFILES.highlands;
}

export { STATE_PROFILE };
