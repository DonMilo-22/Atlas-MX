const SUPPLEMENTS = {
  '01': {
    pueblos: [['Tepezalá','Antiguo poblado minero del norte de Aguascalientes, rodeado por el semidesierto.'],['Rincón de Romos','Municipio histórico ligado al Camino Real y a la vida agrícola del valle.'],['Jesús María','Municipio con tradiciones artesanales y comunidades cercanas a la Sierra Fría.']],
    historia: [['Museo Nacional de la Muerte','Colección universitaria dedicada a la iconografía y tradiciones mexicanas en torno a la muerte.'],['Museo de Aguascalientes','Museo de arte instalado en un edificio neoclásico, con obra de Saturnino Herrán y otros artistas.'],['Templo de San Antonio','Templo ecléctico de cantera diseñado por Refugio Reyes, uno de los iconos arquitectónicos de la capital.']]
  },
  '02': {
    pueblos: [['Mexicali','Capital fronteriza conocida por su valle agrícola, gastronomía china-mexicana y cultura del desierto.'],['Rosarito','Ciudad costera del Pacífico conocida por sus playas, gastronomía y actividades acuáticas.'],['La Rumorosa','Localidad serrana célebre por sus enormes formaciones graníticas y vistas del desierto.']],
    historia: [['Misión de San Vicente Ferrer','Misión dominica del siglo XVIII y sitio histórico de la colonización de la península.'],['Museo Histórico Regional de Ensenada','Recinto que conserva memoria regional en el antiguo cuartel de la Compañía Fija.'],['Museo Comunitario Kumiai','Espacio dedicado a la presencia y tradiciones del pueblo kumiai en Baja California.']]
  },
  '03': {
    pueblos: [['Mulegé','Oasis histórico junto al río Santa Rosalía, rodeado de palmeras y misiones.'],['La Paz','Capital costera con malecón, playas e historia ligada al Golfo de California.'],['El Triunfo','Antiguo poblado minero del siglo XIX con vestigios industriales y arquitectura histórica.']],
    historia: [['Misión de Nuestra Señora de Loreto','Misión jesuita fundada en 1697, punto de partida del sistema misional de las Californias.'],['Misión Santa Rosalía de Mulegé','Templo jesuita del siglo XVIII levantado sobre un oasis con vista al valle.'],['Museo de las Misiones de Baja California','Museo en Loreto que documenta la historia de las misiones peninsulares.']]
  },
  '04': {
    pueblos: [['Hecelchakán','Población histórica del Camino Real campechano con tradiciones mayas y arquitectura colonial.'],['Hopelchén','Cabecera de la región de los Chenes y puerta a importantes ciudades mayas.'],['Champotón','Ciudad costera histórica a orillas del río Champotón, escenario de contactos tempranos con los españoles.']],
    historia: [['Fuerte de San Miguel','Fortificación del siglo XVIII que hoy alberga el Museo de Arqueología Maya.'],['Fuerte de San José el Alto','Fortaleza colonial del sistema defensivo de San Francisco de Campeche.'],['Museo de Arquitectura Maya Baluarte de la Soledad','Museo instalado en una fortificación que conserva piezas mayas de distintas regiones del estado.']]
  },
  '05': {
    pueblos: [['General Cepeda','Población histórica rodeada de sitios paleontológicos y paisajes del desierto.'],['Guerrero','Villa del norte con patrimonio misional y cercanía al río Bravo.'],['Múzquiz','Pueblo de tradición minera y presencia cultural kikapú y mascoga.']],
    historia: [['Museo de las Aves de México','Museo de Saltillo dedicado a la diversidad de aves del país.'],['Museo del Sarape y Trajes Mexicanos','Recinto que documenta la tradición textil del sarape de Saltillo.'],['Misión de San Bernardo','Ruinas de una misión franciscana del siglo XVIII en el municipio de Guerrero.']]
  },
  '06': {
    pueblos: [['Villa de Álvarez','Ciudad con tradiciones charro-taurinas y gastronomía del valle de Colima.'],['Cuyutlán','Pueblo costero famoso por sus salinas, playa y el Museo de la Sal.'],['Minatitlán','Municipio serrano con paisajes de montaña y comunidades rurales.']],
    historia: [['Museo Regional de Historia de Colima','Museo del INAH que recorre la historia prehispánica, virreinal y moderna del estado.'],['Hacienda de Nogueras','Antigua hacienda azucarera vinculada al artista Alejandro Rangel Hidalgo.'],['Museo Universitario de Artes Populares María Teresa Pomar','Colección dedicada al arte popular de Colima y otras regiones de México.']]
  },
  '07': {
    pueblos: [['Ocosingo','Ciudad de acceso a la Selva Lacandona y a sitios mayas como Toniná.'],['Comitán de Domínguez','Ciudad histórica de arquitectura colonial y puerta a los Lagos de Montebello.'],['Zinacantán','Comunidad tsotsil reconocida por sus textiles, flores y tradiciones vivas.']],
    historia: [['Toniná','Ciudad maya construida sobre una gran acrópolis escalonada en el valle de Ocosingo.'],['Bonampak','Sitio maya célebre por sus murales del periodo Clásico.'],['Museo de los Altos de Chiapas','Museo en el antiguo convento de Santo Domingo que documenta la historia regional.']]
  },
  '08': {
    pueblos: [['Casas Grandes','Población histórica vecina a Paquimé y a la tradición cerámica de Mata Ortiz.'],['Batopilas','Antiguo pueblo minero en el fondo de las Barrancas del Cobre.'],['Creel','Población serrana y centro de servicios para explorar territorio rarámuri.']],
    historia: [['Paquimé','Zona arqueológica Patrimonio Mundial, principal centro de la cultura Casas Grandes.'],['Museo de la Revolución en la Frontera','Museo de Ciudad Juárez dedicado a la Revolución Mexicana y la historia fronteriza.'],['Hacienda de San Diego','Conjunto histórico de la región de Casas Grandes ligado a la actividad agrícola y ganadera.']]
  },
  '09': {
    pueblos: [['Mixquic','Pueblo originario de Tláhuac famoso por sus celebraciones tradicionales de Día de Muertos.'],['Santa María la Ribera','Barrio histórico porfiriano conocido por el Kiosco Morisco y sus museos.'],['Milpa Alta','Alcaldía de pueblos originarios, nopaleras y tradiciones rurales del sur de la ciudad.']],
    historia: [['Museo del Templo Mayor','Museo arqueológico dedicado al recinto sagrado de México-Tenochtitlan.'],['Museo Nacional de Historia Castillo de Chapultepec','Museo instalado en el Castillo de Chapultepec que recorre etapas clave de la historia nacional.'],['Museo de El Carmen','Antiguo colegio carmelita de San Ángel con arte virreinal y espacios conventuales.']]
  },
  '10': {
    pueblos: [['Nombre de Dios','Pueblo del valle duranguense conocido por mezcal, manantiales y templos históricos.'],['Canatlán','Población agrícola al pie de la sierra, famosa por sus huertas de manzana.'],['El Salto','Ciudad forestal de Pueblo Nuevo rodeada de bosques de la Sierra Madre Occidental.']],
    historia: [['Zona Arqueológica La Ferrería','Asentamiento de tradición chalchihuites con estructuras ceremoniales al sur de la capital.'],['Museo Francisco Villa','Museo dedicado a la Revolución Mexicana y a la figura de Pancho Villa.'],['Museo de Arqueología de Durango Ganot-Peschard','Colección especializada en culturas prehispánicas del norte de México.']]
  },
  '11': {
    pueblos: [['Comonfort','Población del Bajío con tradición artesanal en piedra volcánica y gastronomía regional.'],['Yuriria','Ciudad histórica junto a una laguna artificial del siglo XVI y un monumental exconvento agustino.'],['Acámbaro','Ciudad del sureste de Guanajuato con arquitectura virreinal y tradición panadera.']],
    historia: [['Zona Arqueológica El Cóporo','Asentamiento prehispánico en las estribaciones de la Sierra de Santa Bárbara.'],['Museo Casa de Hidalgo','Casa histórica de Dolores Hidalgo vinculada al inicio de la Independencia.'],['Exconvento de San Agustín de Yuriria','Complejo fortificado del siglo XVI y pieza mayor de la arquitectura novohispana.']]
  },
  '12': {
    pueblos: [['Zihuatanejo','Antiguo pueblo pesquero convertido en destino costero con bahías y mercados tradicionales.'],['Tixtla','Ciudad histórica del centro de Guerrero, vinculada a Vicente Guerrero y a tradiciones musicales.'],['Coyuca de Benítez','Población costera cercana a lagunas, palmares y playas del Pacífico.']],
    historia: [['Museo Histórico de Acapulco Fuerte de San Diego','Fortaleza del siglo XVII que explica la ruta comercial del Galeón de Manila.'],['Zona Arqueológica de Palma Sola','Conjunto de petrograbados en la sierra que domina la bahía de Acapulco.'],['Museo de la Bandera y Santuario de la Patria','Museo de Iguala dedicado a la consumación de la Independencia y la bandera nacional.']]
  },
  '13': {
    pueblos: [['Huichapan','Ciudad histórica de cantera, acueductos y antiguas haciendas del occidente hidalguense.'],['Zempoala','Población vinculada al Acueducto del Padre Tembleque, Patrimonio Mundial.'],['Metztitlán','Pueblo de la sierra junto a una reserva de la biosfera y un convento agustino.']],
    historia: [['Zona Arqueológica de Tula','Capital tolteca famosa por los Atlantes y sus conjuntos ceremoniales.'],['Exconvento de San Nicolás de Tolentino','Monumental convento agustino del siglo XVI en Actopan.'],['Acueducto del Padre Tembleque','Sistema hidráulico del siglo XVI reconocido como Patrimonio Mundial.']]
  },
  '14': {
    pueblos: [['Lagos de Moreno','Ciudad alteña con centro histórico, puentes y arquitectura de cantera.'],['San Sebastián del Oeste','Antiguo pueblo minero de la Sierra Madre Occidental con calles tradicionales.'],['Mazamitla','Población serrana rodeada de bosques, cabañas y cascadas.']],
    historia: [['Hospicio Cabañas','Conjunto neoclásico Patrimonio Mundial con murales de José Clemente Orozco.'],['Guachimontones','Centro arqueológico de tradición Teuchitlán reconocido por sus estructuras circulares.'],['Museo Regional de Guadalajara','Museo del INAH con colecciones arqueológicas, históricas y artísticas de Jalisco.']]
  },
  '15': {
    pueblos: [['Metepec','Ciudad alfarera conocida por los árboles de la vida y su centro tradicional.'],['Valle de Bravo','Población junto a un lago, con arquitectura tradicional y actividades de naturaleza.'],['Malinalco','Pueblo entre montañas con convento agustino y santuario mexica tallado en la roca.']],
    historia: [['Zona Arqueológica de Teotihuacan','Gran metrópoli mesoamericana famosa por las pirámides del Sol y de la Luna.'],['Zona Arqueológica de Malinalco','Santuario mexica tallado directamente en la roca del Cerro de los Ídolos.'],['Museo Nacional del Virreinato','Museo en Tepotzotlán instalado en el antiguo colegio jesuita de San Francisco Javier.']]
  },
  '16': {
    pueblos: [['Santa Clara del Cobre','Población artesanal reconocida por el trabajo tradicional del cobre martillado.'],['Tzintzuntzan','Antigua capital purépecha junto al lago de Pátzcuaro y sus yácatas.'],['Tacámbaro','Ciudad de clima templado rodeada de bosques, lagunas y huertas.']],
    historia: [['Zona Arqueológica de Tzintzuntzan','Principal centro ceremonial del estado purépecha, con plataformas y yácatas.'],['Zona Arqueológica de Ihuatzio','Importante asentamiento purépecha cercano al lago de Pátzcuaro.'],['Museo Casa de Morelos','Casa natal de José María Morelos en Morelia, convertida en museo histórico.']]
  },
  '17': {
    pueblos: [['Tepoztlán','Pueblo al pie del Tepozteco con mercado, convento y una fuerte tradición cultural.'],['Tlayacapan','Población de los Altos de Morelos conocida por capillas de barrio y alfarería.'],['Tlaltizapán','Localidad ligada a la historia zapatista y a tradiciones del sur de Morelos.']],
    historia: [['Zona Arqueológica de Xochicalco','Ciudad fortificada mesoamericana Patrimonio Mundial, célebre por el Templo de las Serpientes Emplumadas.'],['Zona Arqueológica de Teopanzolco','Centro ceremonial tlahuica integrado hoy al área urbana de Cuernavaca.'],['Museo de la Revolución del Sur','Museo de Tlaltizapán dedicado al zapatismo y a la Revolución Mexicana.']]
  },
  '18': {
    pueblos: [['Jala','Pueblo al pie del volcán Ceboruco, conocido por su basílica y maíz gigante.'],['Mexcaltitán','Isla lacustre de traza compacta y tradición pesquera en las marismas nayaritas.'],['Sayulita','Pueblo costero de surf, arte y vida comunitaria en Bahía de Banderas.']],
    historia: [['Zona Arqueológica Los Toriles','Sitio de Ixtlán del Río con un singular templo circular.'],['Museo Regional de Nayarit','Museo del INAH en Tepic con arqueología de las culturas del occidente.'],['Ruinas de Jauja','Vestigios industriales de una antigua fábrica textil vinculada a la historia económica de Tepic.']]
  },
  '19': {
    pueblos: [['Santiago','Población serrana cercana a la Presa de la Boca y cascadas de la Sierra Madre.'],['Bustamante','Pueblo del norte conocido por sus grutas, pan tradicional y paisaje montañoso.'],['Linares','Ciudad histórica citrícola con arquitectura del noreste y dulces de leche.']],
    historia: [['Museo de Historia Mexicana','Museo de Monterrey dedicado a la historia de México desde la época prehispánica hasta el siglo XX.'],['Museo del Noreste','Recinto que explica la historia regional de Nuevo León, Coahuila, Tamaulipas y Texas.'],['Obispado de Monterrey','Palacio episcopal del siglo XVIII y actual museo regional de Nuevo León.']]
  },
  '20': {
    pueblos: [['Huautla de Jiménez','Pueblo mazateco de la Sierra de Flores Magón, conocido por su tradición cultural y paisaje de niebla.'],['Santa María del Tule','Comunidad del valle central conocida por el monumental Árbol del Tule.'],['Teotitlán del Valle','Pueblo zapoteco reconocido por sus tapetes de lana y tintes naturales.']],
    historia: [['Museo de las Culturas de Oaxaca','Museo en el exconvento de Santo Domingo con piezas como el tesoro de la Tumba 7 de Monte Albán.'],['Zona Arqueológica de Dainzú','Antiguo asentamiento zapoteca del Valle de Tlacolula con relieves de jugadores de pelota.'],['Zona Arqueológica de Lambityeco','Sitio zapoteca conocido por tumbas, palacios y relieves de gobernantes.']]
  },
  '21': {
    pueblos: [['Huauchinango','Ciudad serrana rodeada de presas, bosques y tradición florícola.'],['Tetela de Ocampo','Población histórica de la Sierra Norte con arquitectura tradicional y paisajes montañosos.'],['Pahuatlán','Pueblo serrano otomí-nahua conocido por la elaboración de papel amate.']],
    historia: [['Museo Regional de Puebla','Museo del INAH que recorre la historia arqueológica y virreinal del estado.'],['Fuertes de Loreto y Guadalupe','Fortificaciones ligadas a la Batalla de Puebla del 5 de mayo de 1862.'],['Exconvento de Huejotzingo','Conjunto franciscano del siglo XVI reconocido por su arquitectura y arte virreinal.']]
  },
  '22': {
    pueblos: [['Amealco de Bonfil','Pueblo otomí conocido por la muñeca artesanal Lele y comunidades de tradición textil.'],['Pinal de Amoles','Población de la Sierra Gorda rodeada de bosques, miradores y cascadas.'],['Ezequiel Montes','Municipio vinícola del semidesierto queretano y acceso a Bernal.']],
    historia: [['Museo Regional de Querétaro','Museo del INAH en el antiguo convento de San Francisco, con historia regional.'],['Casa de la Corregidora','Edificio histórico vinculado a la conspiración que precedió a la Independencia.'],['Misiones Franciscanas de la Sierra Gorda','Cinco templos del siglo XVIII reconocidos como Patrimonio Mundial.']]
  },
  '23': {
    pueblos: [['Puerto Morelos','Pueblo costero frente al Arrecife Mesoamericano con tradición pesquera.'],['Felipe Carrillo Puerto','Ciudad del centro maya vinculada a la historia de la Guerra de Castas.'],['Mahahual','Población costera del sur con arrecifes, playas y ambiente caribeño.']],
    historia: [['Zona Arqueológica de Cobá','Antigua ciudad maya conectada por sacbés y rodeada de lagunas.'],['Zona Arqueológica de Muyil','Asentamiento maya dentro de la Reserva de la Biosfera Sian Ka’an.'],['Museo de la Cultura Maya','Museo de Chetumal dedicado a la historia y cosmovisión de la civilización maya.']]
  },
  '24': {
    pueblos: [['Aquismón','Pueblo huasteco cercano a sótanos, cascadas y ríos de la Huasteca Potosina.'],['Santa María del Río','Población reconocida por la tradición artesanal del rebozo.'],['Tierra Nueva','Pueblo del centro del estado con arquitectura de cantera y vida rural.']],
    historia: [['Zona Arqueológica de Tamtoc','Importante ciudad huasteca con plazas, esculturas y complejos hidráulicos.'],['Museo Regional Potosino','Museo del INAH con colecciones arqueológicas y una capilla barroca.'],['Centro de las Artes de San Luis Potosí','Antigua penitenciaría transformada en espacio cultural que conserva memoria histórica del edificio.']]
  },
  '25': {
    pueblos: [['Cosalá','Antiguo pueblo minero de calles empedradas en la sierra sinaloense.'],['El Fuerte','Ciudad histórica junto al río Fuerte con arquitectura colonial y tradición yoreme.'],['Mocorito','Pueblo de casonas y tradiciones gastronómicas en el valle del Évora.']],
    historia: [['Las Labradas','Zona arqueológica con cientos de petrograbados tallados en rocas volcánicas junto al Pacífico.'],['Museo Arqueológico de Mazatlán','Museo del INAH dedicado a las culturas prehispánicas del sur de Sinaloa.'],['Museo Regional del Valle del Fuerte','Museo de Los Mochis dedicado a la historia indígena, agrícola y urbana de la región.']]
  },
  '26': {
    pueblos: [['Ures','Antigua capital de Sonora con plaza, casonas y tradición histórica del valle.'],['Banámichi','Población del río Sonora con arquitectura tradicional y rutas serranas.'],['Cananea','Ciudad minera de la sierra, importante en la historia laboral de México.']],
    historia: [['Zona Arqueológica Cerro de Trincheras','Asentamiento prehispánico construido sobre terrazas de piedra en el desierto sonorense.'],['Museo de la Lucha Obrera de Cananea','Museo sobre la huelga de 1906 y la historia minera de Cananea.'],['Misión de San Xavier del Bac','Misión histórica de la región cultural de la Pimería Alta, vinculada a la obra del padre Kino.']]
  },
  '27': {
    pueblos: [['Frontera','Ciudad cercana a la desembocadura de los ríos Grijalva y Usumacinta y a los Pantanos de Centla.'],['Jalpa de Méndez','Población de la Chontalpa conocida por artesanías de jícaras labradas.'],['Cunduacán','Ciudad histórica del área cacaotera con arquitectura religiosa y tradiciones chontales.']],
    historia: [['Zona Arqueológica de Moral-Reforma','Ciudad maya con grandes pirámides y plazas en la cuenca del río San Pedro Mártir.'],['Museo Regional de Antropología Carlos Pellicer Cámara','Museo de Villahermosa con una de las colecciones arqueológicas más importantes del sureste.'],['Casa Museo Carlos Pellicer','Casa histórica dedicada al poeta y museógrafo tabasqueño Carlos Pellicer Cámara.']]
  },
  '28': {
    pueblos: [['Gómez Farías','Población serrana y acceso principal a la Reserva de la Biosfera El Cielo.'],['Jaumave','Villa del altiplano tamaulipeco rodeada de sierras y paisajes semidesérticos.'],['Aldama','Municipio del sur con cenotes, ríos y costa del Golfo de México.']],
    historia: [['Antigua Aduana de Tampico','Edificio portuario histórico de finales del siglo XIX junto al río Pánuco.'],['Museo Regional de Historia de Tamaulipas','Museo de Ciudad Victoria que recorre procesos históricos y culturales del estado.'],['Zona Arqueológica El Sabinito','Asentamiento prehispánico de la Sierra de San Carlos con estructuras de piedra.']]
  },
  '29': {
    pueblos: [['Ixtenco','Pueblo otomí del oriente de Tlaxcala conocido por mosaicos de semillas y tradiciones agrícolas.'],['Nanacamilpa','Población cercana a bosques donde ocurre el avistamiento estacional de luciérnagas.'],['Atlihuetzia','Localidad con patrimonio religioso temprano y paisajes de barrancas.']],
    historia: [['Zona Arqueológica de Cacaxtla','Sitio famoso por murales policromos de gran conservación.'],['Zona Arqueológica de Xochitécatl','Centro ceremonial con basamentos dedicados a rituales y culto femenino.'],['Exconvento de San Francisco de Tlaxcala','Conjunto franciscano del siglo XVI incluido en el Patrimonio Mundial de la UNESCO.']]
  },
  '30': {
    pueblos: [['Orizaba','Ciudad histórica al pie del Pico de Orizaba con arquitectura porfiriana y museos.'],['Tlacotalpan','Ciudad ribereña de arquitectura colorida reconocida como Patrimonio Mundial.'],['Naolinco','Población serrana conocida por su tradición zapatera y celebraciones de Todos Santos.']],
    historia: [['San Juan de Ulúa','Fortaleza insular que funcionó como defensa, puerto, prisión y aduana del Veracruz histórico.'],['Museo de Antropología de Xalapa','Museo universitario con una sobresaliente colección olmeca, totonaca y huasteca.'],['Zona Arqueológica de Quiahuiztlán','Asentamiento totonaca y necrópolis sobre el cerro de los Metates con vista al Golfo.']]
  },
  '31': {
    pueblos: [['Motul','Ciudad histórica del centro-norte de Yucatán, cuna del gobernador Felipe Carrillo Puerto.'],['Espita','Villa colonial del oriente con arquitectura yucateca y tradiciones comunitarias.'],['Progreso','Puerto del Golfo y principal acceso marítimo de Mérida, con malecón y patrimonio costero.']],
    historia: [['Zona Arqueológica de Ek Balam','Ciudad maya del oriente famosa por la Acrópolis y su fachada de estuco.'],['Museo del Mundo Maya de Mérida','Museo dedicado a la historia, arqueología y cultura viva de los pueblos mayas.'],['Hacienda Yaxcopoil','Hacienda henequenera preservada como testimonio del auge del sisal en Yucatán.']]
  },
  '32': {
    pueblos: [['Guadalupe','Ciudad con un importante conjunto franciscano y museo virreinal.'],['Villanueva','Municipio de valles agrícolas cercano a la zona arqueológica de La Quemada.'],['Tepechitlán','Población del sur zacatecano rodeada de presas, sierras y comunidades rurales.']],
    historia: [['Museo Rafael Coronel','Museo instalado en el exconvento de San Francisco con una célebre colección de máscaras mexicanas.'],['Museo Pedro Coronel','Museo de arte universal y prehispánico en un antiguo colegio jesuita de Zacatecas.'],['Museo de la Toma de Zacatecas','Museo en el Cerro de la Bufa dedicado a la batalla de 1914 durante la Revolución Mexicana.']]
  }
};

const STATE_NAMES = {
  '01':'Aguascalientes','02':'Baja California','03':'Baja California Sur','04':'Campeche','05':'Coahuila','06':'Colima','07':'Chiapas','08':'Chihuahua','09':'Ciudad de México','10':'Durango','11':'Guanajuato','12':'Guerrero','13':'Hidalgo','14':'Jalisco','15':'Estado de México','16':'Michoacán','17':'Morelos','18':'Nayarit','19':'Nuevo León','20':'Oaxaca','21':'Puebla','22':'Querétaro','23':'Quintana Roo','24':'San Luis Potosí','25':'Sinaloa','26':'Sonora','27':'Tabasco','28':'Tamaulipas','29':'Tlaxcala','30':'Veracruz','31':'Yucatán','32':'Zacatecas'
};

function asItem(entry, kind, stateName) {
  if (typeof entry === 'string') {
    return { nombre: entry, descripcion: `${kind} destacado de ${stateName}.` };
  }
  if (Array.isArray(entry)) return { nombre: entry[0], descripcion: entry[1] };
  return entry;
}

function mergeUnique(base = [], extra = [], kind, stateName) {
  const out = [];
  const seen = new Set();
  [...base, ...extra.map((entry) => asItem(entry, kind, stateName))].forEach((item) => {
    const normalized = typeof item === 'string' ? asItem(item, kind, stateName) : item;
    const key = (normalized?.nombre || '').toLocaleLowerCase('es-MX').trim();
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push(normalized);
  });
  return out;
}

/**
 * Completa las categorías que históricamente tenían solo 3 elementos.
 * No altera el objeto original de states.js y evita duplicados por nombre.
 */
export function enrichTourismData(stateCode, baseTourism = {}) {
  const stateName = STATE_NAMES[stateCode] || 'México';
  const supplement = SUPPLEMENTS[stateCode] || { pueblos: [], historia: [] };

  const destinos = mergeUnique(baseTourism.destinos || [], [], 'Destino turístico', stateName);
  const pueblosMagicos = mergeUnique(baseTourism.pueblosMagicos || [], supplement.pueblos, 'Pueblo o localidad', stateName);
  const arqueologia = mergeUnique(baseTourism.arqueologia || [], supplement.historia, 'Sitio histórico', stateName);
  const gastronomia = mergeUnique(baseTourism.gastronomia || [], [], 'Especialidad gastronómica', stateName);
  const playas = mergeUnique(baseTourism.playas || [], [], 'Playa', stateName);

  return {
    ...baseTourism,
    destinos: destinos.slice(0, Math.max(5, destinos.length)),
    pueblosMagicos: pueblosMagicos.slice(0, Math.max(5, pueblosMagicos.length)),
    arqueologia: arqueologia.slice(0, Math.max(5, arqueologia.length)),
    gastronomia: gastronomia.slice(0, Math.max(5, gastronomia.length)),
    playas
  };
}

export function validateTourismData(stateCode, tourism) {
  return {
    stateCode,
    destinos: tourism?.destinos?.length || 0,
    pueblos: tourism?.pueblosMagicos?.length || 0,
    historia: tourism?.arqueologia?.length || 0,
    cocina: tourism?.gastronomia?.length || 0,
    valid: (tourism?.destinos?.length || 0) >= 5 && (tourism?.pueblosMagicos?.length || 0) >= 5 && (tourism?.arqueologia?.length || 0) >= 5 && (tourism?.gastronomia?.length || 0) >= 5
  };
}

export { SUPPLEMENTS };
