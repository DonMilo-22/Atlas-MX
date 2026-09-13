import { MEXICAN_PHOTOS } from './placesData';

/**
 * Atlas MX — Información territorial, histórica, turística y gastronómica enriquecida
 * para las 32 entidades federativas de la República Mexicana.
 * Cada estado tiene: lema, heroImage, resumen, y turismo con:
 *   destinos (≥5), pueblosMagicos (≥3), arqueologia (≥3), playas (si aplica), gastronomia (≥5)
 */

export const TOURISM_DATA = {
  "01": {
    lema: "Tierra de la Gente Buena",
    heroImage: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=1000&q=80",
    resumen: "Corazón ferrocarrilero e industrial de México, célebre por su arquitectura cantera rosa, la legendaria Feria Nacional de San Marcos y sus valles vitivinícolas en Calvillo.",
    turismo: {
      destinos: [
        { nombre: "Complejo Ferrocarrilero Tres Centurias", descripcion: "Histórico recinto industrial y museo vivo del ferrocarril en México.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Barrio y Jardín de San Marcos", descripcion: "Escenario central de la feria más importante de América Latina, con balaustrada colonial.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Catedral Basílica de Nuestra Señora de la Asunción", descripcion: "Joya arquitectónica de estilo barroco salomónico en cantera.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Museo José Guadalupe Posada", descripcion: "Homenaje al creador gráfico de 'La Catrina' y grabador cumbre del país.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Presa Plutarco Elías Calles", descripcion: "Impresionante embalse con el Santuario del Cristo Roto de 25 metros.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Sierra Fría", descripcion: "Reserva ecológica con bosques de pino y encino ideal para ecoturismo.", imagen: MEXICAN_PHOTOS.barrancas_cobre }
      ],
      pueblosMagicos: [
        { nombre: "Calvillo", descripcion: "Capital mundial de la guayaba, arquitectura colonial y cascadas de Los Alisos.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Real de Asientos", descripcion: "Pueblo minero virreinal con túneles subterráneos del siglo XVIII y acueductos.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "San José de Gracia", descripcion: "Ubicado frente al embalse de la Presa Calles, hogar del santuario del Cristo Roto.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Pabellón de Hidalgo", descripcion: "Cuna histórica de la Insurgencia y sede del Museo de la Insurgencia.", imagen: MEXICAN_PHOTOS.pueblo_colonial }
      ],
      arqueologia: [
        { nombre: "El Ocote", descripcion: "Zona arqueológica con pinturas rupestres ceremoniales en abrigos rocosos.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Cerro de Santiago", descripcion: "Antiguo mirador y asentamiento prehispánico de tribus nómadas chichimecas.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Tepozán", descripcion: "Antiguo convento y vestigios mineros del periodo virreinal temprano.", imagen: MEXICAN_PHOTOS.iglesia_colonial }
      ],
      playas: [],
      gastronomia: [
        { nombre: "Chile Aguascalentense", descripcion: "Chile ancho relleno de carne de res y cerdo con frutos secos bañado en salsa de guayaba.", imagen: MEXICAN_PHOTOS.mole },
        { nombre: "Birria de carnero", descripcion: "Tradicional carnero horneado al horno de tierra con adobo de chiles secos.", imagen: MEXICAN_PHOTOS.barbacoa },
        { nombre: "Gorditas de maíz picadas", descripcion: "Rellenas de chicharrón prensado, deshebrada, moronga o frijoles con queso.", imagen: MEXICAN_PHOTOS.tamales },
        { nombre: "Dulces de guayaba de Calvillo", descripcion: "Ates, rollos rellenos de cajeta y licor artesanal de guayaba criolla.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Lechón al horno", descripcion: "Crocante carne tierna adobada servida con salsa martajada y tortillas de comal.", imagen: MEXICAN_PHOTOS.tacos }
      ],
      clima: "Semiseco templado (18°C promedio)"
    }
  },
  "02": {
    lema: "Tierra de Oportunidades",
    heroImage: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1000&q=80",
    resumen: "Punta de lanza del noroeste mexicano, hogar de la ruta enológica del Valle de Guadalupe, acantilados del Pacífico y vanguardia gastronómica.",
    turismo: {
      destinos: [
        { nombre: "Valle de Guadalupe", descripcion: "El valle enológico más premiado de México, cuna de vinos de autor y cocina de huerto.", imagen: MEXICAN_PHOTOS.valle_guadalupe },
        { nombre: "La Bufadora", descripcion: "Uno de los géiseres marinos más grandes del mundo, expulsando agua hasta 30 metros.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Centro Cultural Tijuana (CECUT)", descripcion: "Ícono arquitectónico vanguardista esférico y epicentro del arte fronterizo.", imagen: MEXICAN_PHOTOS.centro_cdmx },
        { nombre: "Parque Nacional Sierra de San Pedro Mártir", descripcion: "Cumbre boscosa y hogar del Observatorio Astronómico Nacional.", imagen: MEXICAN_PHOTOS.barrancas_cobre },
        { nombre: "Bahía de los Ángeles", descripcion: "Paraíso costero en el Mar de Cortés para el nado con el tiburón ballena.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "La Rumorosa", descripcion: "Formaciones rocosas colosales donde el viento genera míticos silbidos naturales.", imagen: MEXICAN_PHOTOS.cuatro_cienegas }
      ],
      pueblosMagicos: [
        { nombre: "Tecate", descripcion: "Pueblo mágico fronterizo cuna de la famosa cerveza, panaderías artesanales y el cerro Cuchumá.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Ensenada", descripcion: "Puerto vinícola con la mejor gastronomía del noroeste y avistamiento de ballenas.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "San Quintín", descripcion: "Bahía con volcanes de arena negra y humedales marinos espectaculares.", imagen: MEXICAN_PHOTOS.tulum }
      ],
      arqueologia: [
        { nombre: "Pinturas Rupestres de Cataviña", descripcion: "Impresionantes trazos milenarios protegidos bajo abrigos de granito en el desierto central.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Vallecitos", descripcion: "Sitio arqueológico sagrado kumiai con petrograbados que marcan el solsticio de invierno.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "El Vallecito", descripcion: "Arte rupestre kumiai con la figura del Diablito y alineaciones astronómicas.", imagen: MEXICAN_PHOTOS.chichen_itza }
      ],
      playas: [
        { nombre: "Playas de Rosarito", descripcion: "Extensas playas ideales para surfistas y atardeceres dorados frente al Océano Pacífico.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "San Felipe", descripcion: "Aguas cálidas y tranquilas del Mar de Cortés, capital del camarón gigante.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "San Quintín", descripcion: "Bahía de humedales marinos y volcanes extintos de arena negra.", imagen: MEXICAN_PHOTOS.tulum }
      ],
      gastronomia: [
        { nombre: "Tacos de pescado estilo Ensenada", descripcion: "Pescado fresco capeado con orégano, mayonesa, col fresca y pico de gallo.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Ensalada Caesar original", descripcion: "Creada en el Hotel Caesar's de Tijuana en 1924 con aderezo emulsionado al instante.", imagen: MEXICAN_PHOTOS.torta_ahogada },
        { nombre: "Langosta estilo Puerto Nuevo", descripcion: "Dorada en manteca servida con frijoles refritos, arroz rojo y tortillas de harina gigantes.", imagen: MEXICAN_PHOTOS.mariscos },
        { nombre: "Tostadas de erizo y almeja pismo", descripcion: "Especialidad de las carretas de mariscos de Ensenada reconocidas mundialmente.", imagen: MEXICAN_PHOTOS.ceviche },
        { nombre: "Vino tinto del Valle de Guadalupe", descripcion: "Vinos distinguidos con medallas internacionales procedentes de viñas de altura.", imagen: MEXICAN_PHOTOS.valle_guadalupe }
      ],
      clima: "Mediterráneo y árido costero"
    }
  },
  "03": {
    lema: "Donde el desierto abraza al mar",
    heroImage: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1000&q=80",
    resumen: "El acuario del mundo según Jacques Cousteau, santuario invernal de la ballena gris y refugio de playas cristalinas turquesa y desiertos de cardones.",
    turismo: {
      destinos: [
        { nombre: "El Arco de Cabo San Lucas", descripcion: "Monumento natural donde se unen las aguas del Golfo de California con el Océano Pacífico.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "Playa Balandra", descripcion: "Reconocida internacionalmente como una de las playas más hermosas del planeta.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Reserva de la Biósfera El Vizcaíno", descripcion: "Área natural protegida más grande de Latinoamérica y santuario de la ballena gris.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Isla Espíritu Santo", descripcion: "Patrimonio Natural de la Humanidad con colonias de lobos marinos y arrecifes de coral.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "Cabo Pulmo", descripcion: "Uno de los arrecifes de coral vivo más antiguos del Pacífico oriental.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Malecón de La Paz", descripcion: "Paseo costero con esculturas de bronce frente a atardeceres arrebolados.", imagen: MEXICAN_PHOTOS.centro_cdmx }
      ],
      pueblosMagicos: [
        { nombre: "Todos Santos", descripcion: "Oasis bohemio con galerías de arte, huertos orgánicos y el mítico Hotel California.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Loreto", descripcion: "Antigua capital de las Californias, fundada en 1697 con la primera misión jesuita.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Santa Rosalía", descripcion: "Poblado minero de herencia francesa con la Iglesia diseñada por Gustave Eiffel.", imagen: MEXICAN_PHOTOS.pueblo_colonial }
      ],
      arqueologia: [
        { nombre: "Pinturas Rupestres de la Sierra de San Francisco", descripcion: "Patrimonio de la Humanidad UNESCO, figuras monumentales de más de 10,000 años.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Cueva de las Flechas", descripcion: "Abrigo rocoso con arte rupestre de escenas de caza y rituales.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Museo Regional de Antropología e Historia", descripcion: "Colección de restos fósiles marinos y herramientas de pueblos pericúes.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      playas: [
        { nombre: "Playa del Amor", descripcion: "Escondida junto a las formaciones rocosas del fin de la tierra en Cabo San Lucas.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "Bahía Concepción", descripcion: "Ensenadas paradisíacas de aguas tibias ideales para kayak y campismo.", imagen: MEXICAN_PHOTOS.tulum }
      ],
      gastronomia: [
        { nombre: "Almejas chocolatadas tatemadas", descripcion: "Cocinadas sobre un lecho de grava y ramas secas de romerillo al calor de la leña.", imagen: MEXICAN_PHOTOS.mariscos },
        { nombre: "Machaca de res o mantarraya", descripcion: "Carne deshidratada al sol, rehogada con cebolla, jitomate y chile verde.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Tacos de mariscos capeados", descripcion: "Camarón y calamar fresco fritos crujientes con salsa de chipotle casera.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Langosta de Puerto Nuevo", descripcion: "Langosta del Pacífico dorada en manteca servida con frijoles y tortillas.", imagen: MEXICAN_PHOTOS.mariscos },
        { nombre: "Pitahaya dulce del desierto", descripcion: "Fruto del cardón gigante, de pulpa roja dulce y refrescante.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      clima: "Seco desértico cálido"
    }
  },
  "04": {
    lema: "Baluarte y Selva Maya",
    heroImage: "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1000&q=80",
    resumen: "Ciudad amurallada colonial declarada Patrimonio de la Humanidad por la UNESCO y corazón de la inmensa selva tropical maya de Calakmul.",
    turismo: {
      destinos: [
        { nombre: "Murallas y Fuertes de San José y San Miguel", descripcion: "Sistemas defensivos del siglo XVII para repeler piratas del Caribe.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Centro Histórico de Campeche", descripcion: "Calles empedradas con casonas de fachadas pastel y faroles coloniales.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Reserva de la Biósfera de Calakmul", descripcion: "La segunda extensión de bosque tropical más grande de América.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Malecón de Campeche", descripcion: "Avenida panorámica frente al Golfo de México con la puesta del sol.", imagen: MEXICAN_PHOTOS.centro_cdmx },
        { nombre: "Isla Jaina", descripcion: "Antigua necrópolis maya con figurillas funerarias de arcilla únicas.", imagen: MEXICAN_PHOTOS.chichen_itza }
      ],
      pueblosMagicos: [
        { nombre: "Palizada", descripcion: "Pueblo ribereño de casas de tejas francesas traídas por barcos madereros.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Isla Aguada", descripcion: "Santuario de delfines nariz de botella en la Laguna de Términos.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Candelaria", descripcion: "Puerta de entrada a los ríos mayas y los saltos de agua cristalina.", imagen: MEXICAN_PHOTOS.canon_sumidero }
      ],
      arqueologia: [
        { nombre: "Calakmul", descripcion: "La mayor metrópoli del periodo clásico maya con pirámides sobre la selva.", imagen: MEXICAN_PHOTOS.palenque },
        { nombre: "Edzná", descripcion: "Majestuoso Edificio de los Cinco Pisos con avanzada arquitectura hidráulica.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Becán", descripcion: "Ciudad fortaleza maya rodeada por un foso perimetral artificial defensivo.", imagen: MEXICAN_PHOTOS.teotihuacan }
      ],
      playas: [
        { nombre: "Playa Bonita", descripcion: "Playa tranquila con palapas y aguas mansas en Lerma.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Seybaplaya", descripcion: "Costa esmeralda con caletas naturales y restaurantes de pescadores.", imagen: MEXICAN_PHOTOS.tulum }
      ],
      gastronomia: [
        { nombre: "Pan de cazón", descripcion: "Capas de tortilla con frijoles y carne de cazón bañadas en salsa chiltomate.", imagen: MEXICAN_PHOTOS.mole },
        { nombre: "Camarones al coco", descripcion: "Camarones del Golfo empanizados con coco fresco y salsa de mango.", imagen: MEXICAN_PHOTOS.mariscos },
        { nombre: "Pámpano empapelado", descripcion: "Pescado fino sazonado con achiote cocido lentamente en hoja de plátano.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Cochinita pibil campechana", descripcion: "Cerdo tierno horneado bajo tierra con achiote y naranja agria.", imagen: MEXICAN_PHOTOS.cochinita },
        { nombre: "Dulce de nance y ciruela", descripcion: "Conservas tradicionales de frutas silvestres cocidas con piloncillo.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      clima: "Cálido subhúmedo tropical"
    }
  },
  "05": {
    lema: "Unidos en el Tiempo y el Esfuerzo",
    heroImage: MEXICAN_PHOTOS.cuatro_cienegas,
    resumen: "Vasta extensión desértica del norte que alberga el sorprendente oasis de Cuatro Ciénegas, viñedos de Parras, minas históricas y una poderosa tradición industrial.",
    turismo: {
      destinos: [
        { nombre: "Cuatro Ciénegas", descripcion: "Oasis de pozas azules con estromatolitos vivos, vestigios del origen de la vida en la Tierra.", imagen: MEXICAN_PHOTOS.cuatro_cienegas },
        { nombre: "Dunas de Yeso de Cuatro Ciénegas", descripcion: "Extenso campo de dunas blancas de yeso en medio del desierto chihuahuense.", imagen: MEXICAN_PHOTOS.cuatro_cienegas },
        { nombre: "Parras de la Fuente", descripcion: "La región vitivinícola más antigua de América, con la Casa Madero fundada en 1597.", imagen: MEXICAN_PHOTOS.valle_guadalupe },
        { nombre: "Museo del Desierto en Saltillo", descripcion: "Uno de los mejores museos de ciencias naturales de Latinoamérica con fósiles de dinosaurios.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Catedral de Santiago Apóstol de Saltillo", descripcion: "Obra maestra del barroco churrigueresco con fachada de cantera tallada.", imagen: MEXICAN_PHOTOS.iglesia_colonial }
      ],
      pueblosMagicos: [
        { nombre: "Arteaga", descripcion: "La Suiza de México, bosques de coníferas con nieve invernal y cabañas alpinas.", imagen: MEXICAN_PHOTOS.barrancas_cobre },
        { nombre: "Cuatro Ciénegas", descripcion: "Pueblo mágico con pozas de agua cristalina y biodiversidad endémica única.", imagen: MEXICAN_PHOTOS.cuatro_cienegas },
        { nombre: "Parras de la Fuente", descripcion: "Viñedos centenarios, nogaleras y haciendas coloniales.", imagen: MEXICAN_PHOTOS.valle_guadalupe },
        { nombre: "Viesca", descripcion: "Pueblo histórico rodeado de dunas de arena y lagunas secas milenarias.", imagen: MEXICAN_PHOTOS.cuatro_cienegas },
        { nombre: "Candela", descripcion: "Pueblo serrano de senderos naturales y cuevas con pinturas rupestres.", imagen: MEXICAN_PHOTOS.pueblo_colonial }
      ],
      arqueologia: [
        { nombre: "Boca de Potrerillos", descripcion: "Más de 3,000 petrograbados de culturas nómadas del desierto en un cañón rocoso.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Cueva de la Candelaria", descripcion: "Entierros prehispánicos con textiles y ofrendas de pueblos del desierto.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Paredón", descripcion: "Yacimiento de fósiles de dinosaurios y huellas prehistóricas en piedra.", imagen: MEXICAN_PHOTOS.teotihuacan }
      ],
      playas: [],
      gastronomia: [
        { nombre: "Cabrito al pastor", descripcion: "Cabrito tierno asado lentamente al carbón, platillo insignia del norte de México.", imagen: MEXICAN_PHOTOS.barbacoa },
        { nombre: "Pan de pulque coahuilense", descripcion: "Pan esponjoso fermentado con pulque, tradición de panaderías centenarias.", imagen: MEXICAN_PHOTOS.tamales },
        { nombre: "Carne asada norteña", descripcion: "Cortes premium de res asados a las brasas con tortillas de harina y guacamole.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Vinos de Parras", descripcion: "Vinos artesanales de la bodega más antigua de América, Casa Madero.", imagen: MEXICAN_PHOTOS.valle_guadalupe },
        { nombre: "Gorditas de horno", descripcion: "Masa de maíz con piloncillo cocida en horno de leña, dulces y crujientes.", imagen: MEXICAN_PHOTOS.tamales }
      ],
      clima: "Seco semicálido y árido (20°C promedio)"
    }
  },
  "06": {
    lema: "La Tierra del Fuego y del Pacífico",
    heroImage: MEXICAN_PHOTOS.tulum,
    resumen: "Pequeño estado del Pacífico con volcanes activos, playas vírgenes, lagunas costeras y el vibrante puerto de Manzanillo, capital mundial del pez vela.",
    turismo: {
      destinos: [
        { nombre: "Volcán de Colima (Volcán de Fuego)", descripcion: "Uno de los volcanes más activos de América con impresionantes columnas de ceniza.", imagen: MEXICAN_PHOTOS.barrancas_cobre },
        { nombre: "Playas de Manzanillo", descripcion: "Puerto turístico con bahías doradas y capital mundial del pez vela.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Laguna de Cuyutlán", descripcion: "Enorme laguna costera con salinas artesanales y el Tortugario de Cuyutlán.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "Parque Nacional Nevado de Colima", descripcion: "Bosques de niebla y pinos a más de 4,000 metros con senderos alpinos.", imagen: MEXICAN_PHOTOS.barrancas_cobre },
        { nombre: "Centro Histórico de Colima", descripcion: "Ciudad de las palmeras con portales, jardines y el Museo de las Culturas de Occidente.", imagen: MEXICAN_PHOTOS.pueblo_colonial }
      ],
      pueblosMagicos: [
        { nombre: "Comala", descripcion: "El Pueblo Blanco de América, inspiración de Juan Rulfo para 'Pedro Páramo'.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Nogueras", descripcion: "Comunidad artesanal rodeada de cafetales y la hacienda de Alejandro Rangel Hidalgo.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Suchitlán", descripcion: "Pueblo de máscaras tradicionales con talleres artesanales de madera.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      arqueologia: [
        { nombre: "La Campana", descripcion: "Zona arqueológica prehispánica con plazas ceremoniales y tumbas de tiro.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "El Chanal", descripcion: "Centro ceremonial con esculturas del dios del viento Ehécatl.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Museo de las Culturas de Occidente", descripcion: "Colección de figuras prehispánicas de barro conocidas como 'perros de Colima'.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      playas: [
        { nombre: "Playa La Audiencia", descripcion: "Caleta protegida ideal para snorkel en Manzanillo.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "El Paraíso", descripcion: "Arena dorada y oleaje suave con cocoteros y palapas.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "Playa de Oro", descripcion: "Extensa playa para surf y pesca deportiva.", imagen: MEXICAN_PHOTOS.tulum }
      ],
      gastronomia: [
        { nombre: "Sopitos colimenses", descripcion: "Tortillas gruesas con carne deshebrada, salsa roja y verdura fresca.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Tatemado de cerdo", descripcion: "Cerdo guisado lentamente en chiles anchos y especias, platillo de fiesta.", imagen: MEXICAN_PHOTOS.mole },
        { nombre: "Ceviche de Manzanillo", descripcion: "Pescado fresco marinado en limón con jitomate, cebolla y aguacate.", imagen: MEXICAN_PHOTOS.ceviche },
        { nombre: "Pepena", descripcion: "Guiso de vísceras de res en salsa de chiles secos y hierbas.", imagen: MEXICAN_PHOTOS.barbacoa },
        { nombre: "Ponche de Comala", descripcion: "Bebida refrescante de tuba de palma fermentada con frutas.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      clima: "Cálido subhúmedo costero (25°C promedio)"
    }
  },
  "07": {
    lema: "El Espíritu del Mundo Maya",
    heroImage: MEXICAN_PHOTOS.canon_sumidero,
    resumen: "El estado con mayor biodiversidad y misticismo indígena de México, tierra de cañones monumentales, selvas milenarias y textiles vivos.",
    turismo: {
      destinos: [
        { nombre: "Cañón del Sumidero", descripcion: "Colosal hendidura de más de 1,000 metros de roca sobre el Río Grijalva.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Cascadas de Agua Azul", descripcion: "Escalera de pozas y caídas de agua de color turquesa rodeadas de selva.", imagen: MEXICAN_PHOTOS.cenote_maya },
        { nombre: "Lagos de Montebello", descripcion: "Más de 50 lagunas de tonalidades violetas, esmeraldas y azules.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Cascada El Chifón", descripcion: "Caída de agua de más de 120 metros que forma albercas naturales cristalinas.", imagen: MEXICAN_PHOTOS.cenote_maya },
        { nombre: "Selva Lacandona", descripcion: "Uno de los pulmones biológicos de América, hogar de jaguares y comunidades mayas.", imagen: MEXICAN_PHOTOS.palenque },
        { nombre: "Sima de las Cotorras", descripcion: "Hundimiento cárstico de 140 metros donde anidan miles de cotorras verdes.", imagen: MEXICAN_PHOTOS.canon_sumidero }
      ],
      pueblosMagicos: [
        { nombre: "San Cristóbal de las Casas", descripcion: "Joyel colonial de los altos chiapanecos, andadores empedrados y casonas.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Chiapa de Corzo", descripcion: "Cuna de la fiesta de los Parachicos y la Fuente Colonial Mudéjar.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Palenque", descripcion: "Pueblo mágico portal a la gran urbe arqueológica.", imagen: MEXICAN_PHOTOS.palenque },
        { nombre: "Comitán de Domínguez", descripcion: "Ciudad de los nueve caminos, hogar de haciendas coloniales.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Copainalá", descripcion: "Pueblo zoque de raíces ancestrales y puentes de piedra.", imagen: MEXICAN_PHOTOS.iglesia_colonial }
      ],
      arqueologia: [
        { nombre: "Palenque", descripcion: "Ciudad arqueológica cumbre del arte maya clásico y tumba de Pakal.", imagen: MEXICAN_PHOTOS.palenque },
        { nombre: "Yaxchilán", descripcion: "Metrópoli maya a orillas del Usumacinta accesible solo en lancha.", imagen: MEXICAN_PHOTOS.palenque },
        { nombre: "Bonampak", descripcion: "Mundialmente famosa por sus frescos policromados prehispánicos.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Toniná", descripcion: "Laberinto piramidal de 74 metros con esculturas de piedra arenisca.", imagen: MEXICAN_PHOTOS.teotihuacan }
      ],
      playas: [
        { nombre: "Puerto Arista", descripcion: "Extensa playa de arena volcánica y santuario tortuguero.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Boca del Cielo", descripcion: "Boca de mar entre la laguna y el océano con cabañas rústicas.", imagen: MEXICAN_PHOTOS.cabo_san_lucas }
      ],
      gastronomia: [
        { nombre: "Tamal de chipilín", descripcion: "Masa de maíz con hojas de chipilín silvestre y pollo en salsa de jitomate.", imagen: MEXICAN_PHOTOS.tamales },
        { nombre: "Cochito horneado", descripcion: "Cerdo macerado con achiote y especias asado a fuego lento en cazuela de barro.", imagen: MEXICAN_PHOTOS.mole },
        { nombre: "Café de altura de Chiapas", descripcion: "Granos arábigos cosechados a mano con notas florales y achocolatadas.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Pozol de cacao", descripcion: "Bebida ancestral refrescante de maíz nixtamalizado y cacao tostado.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Sopa de fiesta chiapaneca", descripcion: "Caldo enriquecido con pan de yema, azafrán, plátano macho y pasitas.", imagen: MEXICAN_PHOTOS.torta_ahogada }
      ],
      clima: "Tropical húmedo y templado en los altos"
    }
  },
  "08": {
    lema: "Tierra de Encuentro",
    heroImage: MEXICAN_PHOTOS.barrancas_cobre,
    resumen: "El estado más grande de México, tierra de la Sierra Tarahumara, el tren El Chepe, las Barrancas del Cobre y una fuerte identidad norteña vaquera.",
    turismo: {
      destinos: [
        { nombre: "Barrancas del Cobre", descripcion: "Sistema de seis cañones más extenso y profundo que el Gran Cañón de Arizona.", imagen: MEXICAN_PHOTOS.barrancas_cobre },
        { nombre: "Tren El Chepe", descripcion: "Ruta ferroviaria épica de 653 km entre la sierra y el Pacífico con vistas majestuosas.", imagen: MEXICAN_PHOTOS.barrancas_cobre },
        { nombre: "Cascada de Basaseachi", descripcion: "La segunda cascada más alta de México con 246 metros de caída libre.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Dunas de Samalayuca", descripcion: "Mar de dunas de arena dorada en el desierto chihuahuense.", imagen: MEXICAN_PHOTOS.cuatro_cienegas },
        { nombre: "Catedral de Chihuahua", descripcion: "Obra maestra del barroco novohispano con fachada de cantera tallada.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Lago de Arareko", descripcion: "Lago sagrado rarámuri rodeado de bosques de pino y formaciones rocosas.", imagen: MEXICAN_PHOTOS.canon_sumidero }
      ],
      pueblosMagicos: [
        { nombre: "Creel", descripcion: "Portal a la Sierra Tarahumara con cabañas de madera y cultura rarámuri.", imagen: MEXICAN_PHOTOS.barrancas_cobre },
        { nombre: "Batopilas", descripcion: "Antiguo pueblo minero de plata en el fondo de una barranca tropical.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Casas Grandes", descripcion: "Hogar de la zona arqueológica de Paquimé, Patrimonio de la Humanidad.", imagen: MEXICAN_PHOTOS.chichen_itza }
      ],
      arqueologia: [
        { nombre: "Paquimé (Casas Grandes)", descripcion: "Patrimonio de la Humanidad UNESCO, metrópoli de adobe del norte de Mesoamérica.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Cueva de la Olla", descripcion: "Granero prehispánico tallado en roca con forma de olla invertida.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Cuarenta Casas", descripcion: "Habitaciones trogloditas construidas en acantilados a gran altura.", imagen: MEXICAN_PHOTOS.teotihuacan }
      ],
      playas: [],
      gastronomia: [
        { nombre: "Carne seca chihuahuense", descripcion: "Tiras de res secadas al sol con sal y chile, tradición vaquera.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Burritos de machaca", descripcion: "Tortillas de harina gigantes rellenas de carne deshidratada con huevo.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Queso menonita", descripcion: "Queso artesanal de las comunidades menonitas de Cuauhtémoc.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Chile colorado con carne", descripcion: "Guiso de carne de res en salsa de chiles colorados secos.", imagen: MEXICAN_PHOTOS.mole },
        { nombre: "Sotol", descripcion: "Destilado ancestral de la planta Dasylirion con denominación de origen.", imagen: MEXICAN_PHOTOS.paisaje_agave }
      ],
      clima: "Seco extremoso continental (18°C promedio)"
    }
  },
  "09": {
    lema: "La Ciudad de los Palacios",
    heroImage: MEXICAN_PHOTOS.centro_cdmx,
    resumen: "Corazón político, financiero y cultural de México, una de las ciudades con más museos del mundo y fusión de pasado mexica, virreinal y vanguardia.",
    turismo: {
      destinos: [
        { nombre: "Zócalo Capitalino y Templo Mayor", descripcion: "La plaza central más grande de Hispanoamérica flanqueada por la Catedral y la urbe mexica.", imagen: MEXICAN_PHOTOS.centro_cdmx },
        { nombre: "Bosque y Castillo de Chapultepec", descripcion: "El único castillo monárquico de América Latina sobre una colina con vistas a Reforma.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Museo Nacional de Antropología", descripcion: "Uno de los museos más prestigiosos del planeta con el Calendario Azteca.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Palacio de Bellas Artes", descripcion: "Joya de mármol de Carrara en Art Nouveau y Art Déco con telón Tiffany.", imagen: MEXICAN_PHOTOS.centro_cdmx },
        { nombre: "Canales de Xochimilco", descripcion: "Navegación en trajineras coloridas por chinampas agrícolas prehispánicas.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Coyoacán colonial", descripcion: "Barrio histórico con la Casa Azul de Frida Kahlo y plazas arboladas.", imagen: MEXICAN_PHOTOS.pueblo_colonial }
      ],
      pueblosMagicos: [
        { nombre: "Barrio Mágico de San Ángel", descripcion: "Casas señoriales del siglo XVII, calles empedradas y el Bazar del Sábado.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Villa de Guadalupe", descripcion: "El santuario mariano más visitado de América.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Centro Histórico de Tlalpan", descripcion: "Plaza colonial con conventos dominicos y mercados tradicionales.", imagen: MEXICAN_PHOTOS.pueblo_colonial }
      ],
      arqueologia: [
        { nombre: "Templo Mayor de Tenochtitlan", descripcion: "El corazón del imperio mexica consagrado a Huitzilopochtli y Tláloc.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Tlatelolco y Plaza de las Tres Culturas", descripcion: "Gran mercado prehispánico con templos aztecas e iglesia virreinal.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Cuicuilco", descripcion: "Pirámide circular más antigua del Valle de México sepultada por lava.", imagen: MEXICAN_PHOTOS.chichen_itza }
      ],
      playas: [],
      gastronomia: [
        { nombre: "Tacos al pastor con piña", descripcion: "Carne de cerdo marinada en achiote asada al trompo vertical con piña asada.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Guajolota de tamal verde", descripcion: "El clásico desayuno chilango: tamal caliente envuelto en bolillo.", imagen: MEXICAN_PHOTOS.tamales },
        { nombre: "Chicharrones preparados", descripcion: "Harina crujiente con crema, cueritos, jitomate, col y salsa Valentina.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Caldo de tlalpeño", descripcion: "Caldo de pollo con chipotle, aguacate, queso Oaxaca y garbanzos.", imagen: MEXICAN_PHOTOS.mole },
        { nombre: "Churros con chocolate caliente", descripcion: "Fritos en aceite, espolvoreados con azúcar y canela molida.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      clima: "Templado de montaña (16°C promedio)"
    }
  },
  "10": {
    lema: "Tierra de Cine",
    heroImage: MEXICAN_PHOTOS.barrancas_cobre,
    resumen: "Estado de vastos cañones, bosques de la Sierra Madre Occidental y escenarios cinematográficos. Tierra de Pancho Villa, mezcal duranguense y paisajes del viejo oeste.",
    turismo: {
      destinos: [
        { nombre: "Espinazo del Diablo", descripcion: "Tramo montañoso de la carretera Mazatlán-Durango con curvas entre abismos y niebla.", imagen: MEXICAN_PHOTOS.barrancas_cobre },
        { nombre: "Puente Baluarte Bicentenario", descripcion: "El puente atirantado más alto del mundo con 402 metros de altura.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Catedral Basílica Menor de Durango", descripcion: "Imponente catedral barroca de cantera con interiores neoclásicos.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Parque Guadiana", descripcion: "Extenso parque urbano con lago artificial y jardín botánico.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Mexiquillo", descripcion: "Parque natural de formaciones rocosas volcánicas y cascadas en la Sierra Madre.", imagen: MEXICAN_PHOTOS.canon_sumidero }
      ],
      pueblosMagicos: [
        { nombre: "Mapimí", descripcion: "Antiguo real de minas con la misteriosa Zona del Silencio cercana.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "El Mezquital", descripcion: "Comunidad del pueblo tepehuano con tradiciones ancestrales.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Villa Unión", descripcion: "Pueblo de tradición agrícola con arquitectura de adobe y cantera.", imagen: MEXICAN_PHOTOS.pueblo_colonial }
      ],
      arqueologia: [
        { nombre: "Zona del Silencio", descripcion: "Área desértica con fenómenos electromagnéticos y meteoritos.", imagen: MEXICAN_PHOTOS.cuatro_cienegas },
        { nombre: "La Ferrería", descripcion: "Centro ceremonial chalchihuites con plataformas y petrograbados.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Museo de la Ciudad de Durango", descripcion: "Acervo arqueológico de la cultura chalchihuites y lozeros.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      playas: [],
      gastronomia: [
        { nombre: "Caldillo duranguense", descripcion: "Caldo de carne de res con chile verde pasilla y papa, platillo insignia.", imagen: MEXICAN_PHOTOS.mole },
        { nombre: "Mezcal duranguense", descripcion: "Destilado artesanal de agave cenizo de la Sierra Madre Occidental.", imagen: MEXICAN_PHOTOS.paisaje_agave },
        { nombre: "Barbacoa de res", descripcion: "Res cocida lentamente en horno de tierra con pencas de maguey.", imagen: MEXICAN_PHOTOS.barbacoa },
        { nombre: "Tacos laguneros", descripcion: "Tacos de carne asada con guacamole, frijoles y salsa borracha.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Gorditas de harina norteñas", descripcion: "Gorditas de harina de trigo rellenas de frijol con queso y chicharrón.", imagen: MEXICAN_PHOTOS.tamales }
      ],
      clima: "Semiseco templado (18°C promedio)"
    }
  },
  "11": {
    lema: "Grandeza de México",
    heroImage: MEXICAN_PHOTOS.guanajuato,
    resumen: "Estado de colores vibrantes, callejones coloniales y una de las ciudades más bellas del mundo. Cuna de la Independencia de México y del Festival Cervantino.",
    turismo: {
      destinos: [
        { nombre: "Ciudad de Guanajuato", descripcion: "Patrimonio de la Humanidad con callejones subterráneos, plazuelas y casas multicolores.", imagen: MEXICAN_PHOTOS.guanajuato },
        { nombre: "Callejón del Beso", descripcion: "Estrecho callejón donde las leyendas de amor y los balcones se encuentran a 68 cm.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Alhóndiga de Granaditas", descripcion: "Fortaleza colonial escenario de la primera gran victoria insurgente de 1810.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Teatro Juárez", descripcion: "Majestuoso teatro de estilo neoclásico con interior morisco y escalinata monumental.", imagen: MEXICAN_PHOTOS.centro_cdmx },
        { nombre: "Mina de Valenciana", descripcion: "La mina de plata más rica de la historia colonial y su magnífica iglesia barroca.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Momias de Guanajuato", descripcion: "Colección de cuerpos momificados naturalmente por las condiciones del suelo.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      pueblosMagicos: [
        { nombre: "San Miguel de Allende", descripcion: "Declarada la mejor ciudad del mundo, con la icónica Parroquia neogótica rosa.", imagen: MEXICAN_PHOTOS.san_miguel_allende },
        { nombre: "Dolores Hidalgo", descripcion: "Cuna de la Independencia donde el cura Hidalgo dio el Grito de 1810.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Mineral de Pozos", descripcion: "Pueblo fantasma minero rehabilitado con galerías de arte y viñedos.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Jalpa de Cánovas", descripcion: "Hacienda señorial con acueducto y templo neogótico en ruinas románticas.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Salvatierra", descripcion: "Primera ciudad de la región con conventos y haciendas virreinales.", imagen: MEXICAN_PHOTOS.iglesia_colonial }
      ],
      arqueologia: [
        { nombre: "Cañada de la Virgen", descripcion: "Observatorio astronómico otomí con pirámides orientadas a Venus.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Plazuelas", descripcion: "Centro ceremonial chupícuaro con canchas de pelota y terrazas.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Peralta", descripcion: "Complejo de plazas hundidas y basamentos piramidales.", imagen: MEXICAN_PHOTOS.teotihuacan }
      ],
      playas: [],
      gastronomia: [
        { nombre: "Enchiladas mineras", descripcion: "Enchiladas en salsa de guajillo con papas y zanahorias de las minas coloniales.", imagen: MEXICAN_PHOTOS.mole },
        { nombre: "Guacamayas", descripcion: "Bolillo crujiente con chicharrón, salsa roja y aguacate, antojito leonés.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Nieves de Dolores Hidalgo", descripcion: "Helados artesanales de sabores únicos: mole, queso, tequila, nopal.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Cajeta de Celaya", descripcion: "Dulce de leche de cabra caramelizado, denominación de origen de Celaya.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Fiambre guanajuatense", descripcion: "Ensalada fría de carnes, verduras y frutas aderezada con vinagreta.", imagen: MEXICAN_PHOTOS.ceviche }
      ],
      clima: "Semiseco templado (20°C promedio)"
    }
  },
  "12": {
    lema: "Contigo, Guerrero es Grande",
    heroImage: MEXICAN_PHOTOS.tulum,
    resumen: "Estado del Pacífico mexicano con Acapulco, la Riviera Diamante, Ixtapa-Zihuatanejo, y la rica herencia de los pueblos amuzgo, mixteco y nahua.",
    turismo: {
      destinos: [
        { nombre: "Acapulco y La Quebrada", descripcion: "Bahía legendaria con los famosos clavadistas que se lanzan desde 35 metros de altura.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Ixtapa-Zihuatanejo", descripcion: "Dualidad de resort moderno y pueblo pesquero con playas de arena dorada.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "Taxco de Alarcón", descripcion: "Ciudad colonial de plata con calles empedradas, iglesia de Santa Prisca y talleres artesanales.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Grutas de Cacahuamilpa", descripcion: "Una de las redes de cavernas más grandes del mundo con formaciones estalactíticas.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Playa La Ropa en Zihuatanejo", descripcion: "Playa de arenas suaves y aguas tranquilas color turquesa.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Laguna de Tres Palos", descripcion: "Laguna costera con manglares y pesca artesanal.", imagen: MEXICAN_PHOTOS.cabo_san_lucas }
      ],
      pueblosMagicos: [
        { nombre: "Taxco", descripcion: "Ciudad de la plata con joyerías artesanales y la iglesia barroca de Santa Prisca.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Olinalá", descripcion: "Pueblo de los cofres lacados con la técnica prehispánica del rayado.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Ixcateopan de Cuauhtémoc", descripcion: "Donde reposan los restos del último tlatoani mexica.", imagen: MEXICAN_PHOTOS.chichen_itza }
      ],
      arqueologia: [
        { nombre: "Zona Arqueológica de Teopantecuanitlán", descripcion: "Centro ceremonial olmeca con esculturas monolíticas y sistema hidráulico.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Cuetlajuchitlán", descripcion: "Sitio mezcala con terrazas agrícolas y plataformas ceremoniales.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "La Organera-Xochipala", descripcion: "Zona con magníficas figurillas de cerámica realistas.", imagen: MEXICAN_PHOTOS.teotihuacan }
      ],
      playas: [
        { nombre: "Playa Diamante en Acapulco", descripcion: "Arena dorada y oleaje del Pacífico con resorts de lujo.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Barra de Potosí", descripcion: "Bahía virgen con manglares y avistamiento de cocodrilos.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "Playa Larga en Zihuatanejo", descripcion: "Playa extensa ideal para surf y caminatas al atardecer.", imagen: MEXICAN_PHOTOS.tulum }
      ],
      gastronomia: [
        { nombre: "Pozole blanco guerrerense", descripcion: "Caldo de maíz cacahuazintle con carne de cerdo, orégano y tostadas.", imagen: MEXICAN_PHOTOS.mole },
        { nombre: "Mole rojo de Chilapa", descripcion: "Mole elaborado con chiles secos, chocolate y especias de la Montaña.", imagen: MEXICAN_PHOTOS.mole },
        { nombre: "Jumiles", descripcion: "Chinches de monte comestibles, tradición prehispánica de Taxco.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Pescado a la talla", descripcion: "Huachinango abierto untado con mayonesa y chiles asado a las brasas.", imagen: MEXICAN_PHOTOS.mariscos },
        { nombre: "Chilate de Guerrero", descripcion: "Bebida ancestral de cacao, arroz y canela servida fría en jícara.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      clima: "Cálido subhúmedo tropical (27°C promedio)"
    }
  },
  "13": {
    lema: "Con el viento en favor",
    heroImage: MEXICAN_PHOTOS.pueblo_colonial,
    resumen: "Estado de contrastes geográficos con balnearios de aguas termales, haciendas pulqueras, bosques de niebla, Prismas Basálticos y la herencia otomí-tepehua.",
    turismo: {
      destinos: [
        { nombre: "Prismas Basálticos de Santa María Regla", descripcion: "Columnas hexagonales de basalto de 40 metros con cascadas de agua.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Grutas de Tolantongo", descripcion: "Cañón con aguas termales turquesa, cuevas de vapor y pozas escalonadas.", imagen: MEXICAN_PHOTOS.cenote_maya },
        { nombre: "Centro Histórico de Pachuca", descripcion: "Reloj Monumental y museo de la fotografía en la antigua casa de moneda.", imagen: MEXICAN_PHOTOS.centro_cdmx },
        { nombre: "Ex Convento de San Agustín Acolman", descripcion: "Magnífico ejemplo de arquitectura plateresca del siglo XVI.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Sierra Gorda de Hidalgo", descripcion: "Bosques de niebla con cascadas, grutas y comunidades indígenas.", imagen: MEXICAN_PHOTOS.barrancas_cobre }
      ],
      pueblosMagicos: [
        { nombre: "Real del Monte", descripcion: "Pueblo minero con herencia cornish (pastes), cementerio inglés y minas de plata.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Huasca de Ocampo", descripcion: "Primer Pueblo Mágico de México con haciendas, presas y los Prismas Basálticos.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Mineral del Chico", descripcion: "Parque Nacional con escalada en roca, bosques de oyamel y cabañas.", imagen: MEXICAN_PHOTOS.barrancas_cobre },
        { nombre: "Huichapan", descripcion: "Arcos virreinales, chapitel del reloj y baños termales.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Tecozautla", descripcion: "Géiser natural y balnearios de aguas termales curativas.", imagen: MEXICAN_PHOTOS.cenote_maya }
      ],
      arqueologia: [
        { nombre: "Tula de Allende", descripcion: "Capital del imperio tolteca con los icónicos Atlantes de 4.6 metros de altura.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Huapalcalco", descripcion: "Pequeña zona con pinturas rupestres en cuevas de origen otomí.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Pahñú", descripcion: "Zona otomí con pirámide y observatorio astronómico en la Sierra Gorda.", imagen: MEXICAN_PHOTOS.teotihuacan }
      ],
      playas: [],
      gastronomia: [
        { nombre: "Pastes de Real del Monte", descripcion: "Empanadas de origen cornish rellenas de papa con carne y perejil.", imagen: MEXICAN_PHOTOS.tamales },
        { nombre: "Barbacoa de borrego hidalguense", descripcion: "Borrego envuelto en pencas de maguey horneado en horno de tierra.", imagen: MEXICAN_PHOTOS.barbacoa },
        { nombre: "Pulque de Apan", descripcion: "Bebida fermentada del maguey pulquero, tradición de haciendas centenarias.", imagen: MEXICAN_PHOTOS.paisaje_agave },
        { nombre: "Escamoles", descripcion: "Larvas de hormiga arriera salteadas con mantequilla y epazote.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Gusanos de maguey", descripcion: "Chinicuiles y gusanos blancos fritos, delicadeza prehispánica.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      clima: "Templado semiseco (16°C promedio)"
    }
  },
  "14": {
    lema: "Jalisco es México",
    heroImage: MEXICAN_PHOTOS.paisaje_agave,
    resumen: "Cuna de los símbolos que dan identidad a México en el mundo: el mariachi, el tequila y la charrería, con costas del Pacífico y metrópoli tecnológica.",
    turismo: {
      destinos: [
        { nombre: "Centro Histórico de Guadalajara", descripcion: "Catedral Metropolitana, Teatro Degollado y murales de Orozco.", imagen: MEXICAN_PHOTOS.guadalajara },
        { nombre: "Hospicio Cabañas", descripcion: "Patrimonio UNESCO con la cúpula 'El Hombre de Fuego' de Orozco.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Lago de Chapala", descripcion: "El lago natural más extenso de la República Mexicana.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "Puerto Vallarta Malecón", descripcion: "Paseo de esculturas marítimas frente a la Bahía de Banderas.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Barranca de Huentitán", descripcion: "Cañón natural de 500 metros con miradores y senderismo.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Ruta del Tequila", descripcion: "Paisajes agaveros azules declarados Patrimonio Mundial UNESCO.", imagen: MEXICAN_PHOTOS.paisaje_agave }
      ],
      pueblosMagicos: [
        { nombre: "Tequila", descripcion: "Cuna de la bebida espirituosa con haciendas centenarias.", imagen: MEXICAN_PHOTOS.paisaje_agave },
        { nombre: "Mazamitla", descripcion: "La Suiza Mexicana con cabañas de madera y cascadas.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Tapalpa", descripcion: "Calles empedradas y las formaciones rocosas de Las Piedrotas.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "San Sebastián del Oeste", descripcion: "Pueblo minero entre la neblina de la Sierra Madre.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Lagos de Moreno", descripcion: "Patrimonio cultural con iglesias barrocas virreinales.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Ajijic", descripcion: "Comunidad artística bohemia a orillas del Lago de Chapala.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      arqueologia: [
        { nombre: "Guachimontones", descripcion: "Pirámides cónicas circulares únicas de la Tradición Teuchitlán.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "El Chanal de Jalisco", descripcion: "Vestigios ceremoniales de plazas y juegos de pelota.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Ixtépete", descripcion: "Zona arqueológica con pirámides y cerámica prehispánica en Guadalajara.", imagen: MEXICAN_PHOTOS.teotihuacan }
      ],
      playas: [
        { nombre: "Playa Los Muertos", descripcion: "La playa más célebre de Puerto Vallarta con muelle iluminado.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Costalegre", descripcion: "Corredor de caletas vírgenes y reservas ecológicas.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "Mismaloya", descripcion: "Caleta donde se filmó 'La Noche de la Iguana'.", imagen: MEXICAN_PHOTOS.tulum }
      ],
      gastronomia: [
        { nombre: "Torta ahogada", descripcion: "Birote salado relleno de carnitas ahogado en salsa de chile de árbol.", imagen: MEXICAN_PHOTOS.torta_ahogada },
        { nombre: "Birria de chivo estilo Jalisco", descripcion: "Chivo horneado en adobo de chiles guajillo y especias.", imagen: MEXICAN_PHOTOS.barbacoa },
        { nombre: "Carne en su jugo", descripcion: "Bistec de res en consomé de tocino con frijoles y cilantro.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Tequila 100% de Agave", descripcion: "Denominación de origen en blanco, reposado, añejo y extra añejo.", imagen: MEXICAN_PHOTOS.valle_guadalupe },
        { nombre: "Jericalla tapatía", descripcion: "Postre de leche quemada, vainilla y canela con capa dorada.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      clima: "Semiseco a cálido subhúmedo (21°C promedio)"
    }
  },
  "15": {
    lema: "Estado Libre y Soberano de México",
    heroImage: MEXICAN_PHOTOS.teotihuacan,
    resumen: "El estado más poblado de México, hogar de Teotihuacán, volcanes nevados, bosques de coníferas y una inmensa diversidad cultural entre lo prehispánico y lo moderno.",
    turismo: {
      destinos: [
        { nombre: "Teotihuacán", descripcion: "Ciudad de los Dioses con las monumentales Pirámides del Sol y la Luna.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Nevado de Toluca", descripcion: "Volcán extinto con dos lagunas de agua cristalina en su cráter a 4,690 metros.", imagen: MEXICAN_PHOTOS.barrancas_cobre },
        { nombre: "Valle de Bravo", descripcion: "Lago artificial rodeado de bosques con deportes acuáticos y parapente.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Cosmovitral de Toluca", descripcion: "Jardín botánico dentro de un vitral artístico de 3,200 metros cuadrados.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Santuario de la Mariposa Monarca", descripcion: "Bosques donde millones de mariposas monarca hibernan cada invierno.", imagen: MEXICAN_PHOTOS.barrancas_cobre }
      ],
      pueblosMagicos: [
        { nombre: "Valle de Bravo", descripcion: "Pueblo de casas con techos de teja junto a un lago de montaña.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Tepotzotlán", descripcion: "Ex convento jesuita con retablos barrocos churriguerescos espectaculares.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Malinalco", descripcion: "Zona arqueológica con templo monolítico tallado en roca viva.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Ixtapan de la Sal", descripcion: "Balneario de aguas termales y parques acuáticos entre montañas.", imagen: MEXICAN_PHOTOS.cenote_maya },
        { nombre: "El Oro", descripcion: "Pueblo minero con teatro art nouveau y palacio municipal de estilo europeo.", imagen: MEXICAN_PHOTOS.pueblo_colonial }
      ],
      arqueologia: [
        { nombre: "Teotihuacán", descripcion: "Metrópoli prehispánica con más de 125,000 habitantes en su apogeo.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Malinalco", descripcion: "Templo monolítico del Águila tallado en la roca de la montaña.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Calixtlahuaca", descripcion: "Templo circular dedicado a Ehécatl, dios del viento.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Teotenango", descripcion: "Fortaleza matlatzinca en la cumbre de un cerro con vistas al valle.", imagen: MEXICAN_PHOTOS.teotihuacan }
      ],
      playas: [],
      gastronomia: [
        { nombre: "Chorizo verde de Toluca", descripcion: "Embutido artesanal con hierbas frescas y chiles verdes, único en México.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Tacos de barbacoa de Texcoco", descripcion: "Borrego envuelto en maguey horneado en horno de tierra.", imagen: MEXICAN_PHOTOS.barbacoa },
        { nombre: "Mixiotes de carnero", descripcion: "Carne adobada envuelta en la cutícula del maguey y cocida al vapor.", imagen: MEXICAN_PHOTOS.mole },
        { nombre: "Licor de mosco", descripcion: "Bebida dulce artesanal tradicional de Toluca con hierbas y frutas.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Tamales de charal", descripcion: "Tamales con charales del lago y salsa verde de la región lacustre.", imagen: MEXICAN_PHOTOS.tamales }
      ],
      clima: "Templado subhúmedo (15°C promedio)"
    }
  },
  "16": {
    lema: "La Joya de México",
    heroImage: MEXICAN_PHOTOS.pueblo_colonial,
    resumen: "Estado de lagos, volcanes y tradiciones vivas: la Noche de Muertos en Pátzcuaro, la mariposa monarca, las artesanías purépechas y el aguacate michoacano.",
    turismo: {
      destinos: [
        { nombre: "Morelia Centro Histórico", descripcion: "Patrimonio de la Humanidad con catedral de cantera rosa y acueducto colonial.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Lago de Pátzcuaro", descripcion: "Lago sagrado purépecha con la isla de Janitzio y la Noche de Muertos.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Santuario de la Mariposa Monarca", descripcion: "Bosques de oyamel donde millones de mariposas migran desde Canadá.", imagen: MEXICAN_PHOTOS.barrancas_cobre },
        { nombre: "Cascada de Tzararacua", descripcion: "Caída de agua de 40 metros en un entorno de vegetación tropical.", imagen: MEXICAN_PHOTOS.cenote_maya },
        { nombre: "Volcán Paricutín", descripcion: "Volcán nacido en 1943 que sepultó un pueblo, solo queda la torre de la iglesia.", imagen: MEXICAN_PHOTOS.barrancas_cobre }
      ],
      pueblosMagicos: [
        { nombre: "Pátzcuaro", descripcion: "Corazón purépecha con plaza colonial, la Basílica y el Día de Muertos.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Santa Clara del Cobre", descripcion: "Capital nacional del cobre martillado con talleres artesanales.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Tlalpujahua", descripcion: "Pueblo minero famoso por esferas navideñas sopladas a mano.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Angangueo", descripcion: "Portal a los santuarios de la mariposa monarca en la Sierra Chincua.", imagen: MEXICAN_PHOTOS.barrancas_cobre },
        { nombre: "Cuitzeo", descripcion: "Pueblo junto al lago con ex convento agustino del siglo XVI.", imagen: MEXICAN_PHOTOS.iglesia_colonial }
      ],
      arqueologia: [
        { nombre: "Tzintzuntzan", descripcion: "Capital del imperio purépecha con cinco yácatas (pirámides escalonadas).", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Ihuatzio", descripcion: "Centro ceremonial con plazas y pirámides junto al lago de Pátzcuaro.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Tingambato", descripcion: "Zona con tumba subterránea y juego de pelota prehispánico.", imagen: MEXICAN_PHOTOS.teotihuacan }
      ],
      playas: [
        { nombre: "Playa Azul", descripcion: "Playa del Pacífico michoacano con oleaje fuerte y arena dorada.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Maruata", descripcion: "Playa virgen nahua con bahía protegida y santuario tortuguero.", imagen: MEXICAN_PHOTOS.cabo_san_lucas }
      ],
      gastronomia: [
        { nombre: "Carnitas de Quiroga", descripcion: "Cerdo frito lentamente en su propia manteca en cazos de cobre.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Corundas", descripcion: "Tamales triangulares purépechas envueltos en hoja de milpa con crema.", imagen: MEXICAN_PHOTOS.tamales },
        { nombre: "Uchepos", descripcion: "Tamales dulces de elote tierno envueltos en hoja de maíz con crema.", imagen: MEXICAN_PHOTOS.tamales },
        { nombre: "Sopa tarasca", descripcion: "Crema de frijol con chile pasilla, tortilla frita y queso.", imagen: MEXICAN_PHOTOS.mole },
        { nombre: "Gazpacho moreliano", descripcion: "Ensalada de frutas con queso fresco, chile y jugo de naranja.", imagen: MEXICAN_PHOTOS.ceviche }
      ],
      clima: "Templado a cálido subhúmedo (20°C promedio)"
    }
  },
  "17": {
    lema: "Tierra de Libertad",
    heroImage: MEXICAN_PHOTOS.pueblo_colonial,
    resumen: "Estado de la eterna primavera con conventos del siglo XVI declarados Patrimonio de la Humanidad, balnearios de aguas termales y el legado de Zapata.",
    turismo: {
      destinos: [
        { nombre: "Palacio de Cortés en Cuernavaca", descripcion: "Fortaleza-palacio del conquistador con murales de Diego Rivera.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Jardines de Cuernavaca", descripcion: "Jardín Borda y jardines tropicales que inspiraron a Maximiliano de Habsburgo.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Las Estacas", descripcion: "Parque natural con río de aguas cristalinas y manantiales.", imagen: MEXICAN_PHOTOS.cenote_maya },
        { nombre: "Lago de Tequesquitengo", descripcion: "Lago para deportes acuáticos con un pueblo sumergido bajo sus aguas.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "Catedral de la Asunción de Cuernavaca", descripcion: "Convento franciscano del siglo XVI con frescos recientemente descubiertos.", imagen: MEXICAN_PHOTOS.iglesia_colonial }
      ],
      pueblosMagicos: [
        { nombre: "Tepoztlán", descripcion: "Pueblo místico con pirámide en la cima del cerro del Tepozteco y mercado artesanal.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Tlayacapan", descripcion: "Ex convento agustino Patrimonio UNESCO y tradiciones de chinelos.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Amacuzac", descripcion: "Río de aguas cristalinas para rafting y cascadas naturales.", imagen: MEXICAN_PHOTOS.cenote_maya }
      ],
      arqueologia: [
        { nombre: "Xochicalco", descripcion: "Patrimonio de la Humanidad con la Pirámide de la Serpiente Emplumada.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Tepozteco", descripcion: "Templo azteca en la cima del cerro dedicado a Ometochtli, dios del pulque.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Teopanzolco", descripcion: "Pirámide dual estilo Templo Mayor en pleno Cuernavaca.", imagen: MEXICAN_PHOTOS.teotihuacan }
      ],
      playas: [],
      gastronomia: [
        { nombre: "Tacos acorazados", descripcion: "Tortilla con arroz, guisado, rajas y mole, comida de obreros cuernavacenses.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Cecina de Yecapixtla", descripcion: "Carne de res salada y oreada al sol, asada al carbón con guacamole.", imagen: MEXICAN_PHOTOS.barbacoa },
        { nombre: "Pipián verde", descripcion: "Salsa espesa de pepita de calabaza, chile verde y hierbas.", imagen: MEXICAN_PHOTOS.mole },
        { nombre: "Itacate de Tepoztlán", descripcion: "Gordita de maíz azul rellena de frijol y queso de la sierra.", imagen: MEXICAN_PHOTOS.tamales },
        { nombre: "Helados de Tepoztlán", descripcion: "Nieves artesanales de sabores exóticos como tepeztate y elote.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      clima: "Cálido subhúmedo (22°C promedio)"
    }
  },
  "18": {
    lema: "Un Lugar para Todos",
    heroImage: MEXICAN_PHOTOS.tulum,
    resumen: "Costa del Pacífico con la Riviera Nayarit, islas volcánicas habitadas por miles de aves marinas, la cultura huichol y playas paradisíacas escondidas.",
    turismo: {
      destinos: [
        { nombre: "Islas Marietas", descripcion: "Reserva de la biósfera con la famosa Playa Escondida dentro de un cráter.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "Sayulita", descripcion: "Pueblo surfero bohemio con oleaje perfecto y arte callejero.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "San Blas", descripcion: "Puerto histórico colonial con manglares, cocodrilos y la Tovara.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Riviera Nayarit", descripcion: "Corredor turístico de lujo con playas vírgenes y campos de golf.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "Isla Mexcaltitán", descripcion: "La Venecia mexicana, posible cuna mítica de los aztecas.", imagen: MEXICAN_PHOTOS.pueblo_colonial }
      ],
      pueblosMagicos: [
        { nombre: "Sayulita", descripcion: "Pueblo surfero con ambiente relajado y galerías de arte huichol.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Jala", descripcion: "Pueblo mágico con la basílica lateranense y el elote gigante de Jala.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Compostela", descripcion: "Ciudad colonial fundada en 1540 con templos y plazas históricas.", imagen: MEXICAN_PHOTOS.pueblo_colonial }
      ],
      arqueologia: [
        { nombre: "Los Toriles de Ixtlán del Río", descripcion: "Templo circular dedicado a Quetzalcóatl-Ehécatl con planta redonda.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Altavista", descripcion: "Observatorio astronómico chalchihuites alineado con el trópico de Cáncer.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Petroglifos de la Sierra Huichola", descripcion: "Arte rupestre sagrado wixárika en sitios ceremoniales.", imagen: MEXICAN_PHOTOS.teotihuacan }
      ],
      playas: [
        { nombre: "Playa Escondida (Islas Marietas)", descripcion: "Playa dentro de un cráter volcánico accesible nadando.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "San Pancho", descripcion: "Playa tranquila con oleaje moderado y comunidad artística.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Lo de Marcos", descripcion: "Caleta virgen con arenas doradas y cocoteros.", imagen: MEXICAN_PHOTOS.tulum }
      ],
      gastronomia: [
        { nombre: "Pescado zarandeado", descripcion: "Pargo fresco abierto untado con mayonesa y chiles asado al carbón.", imagen: MEXICAN_PHOTOS.mariscos },
        { nombre: "Camarones a la diabla nayaritas", descripcion: "Camarones gigantes en salsa de chiles de árbol y guajillo.", imagen: MEXICAN_PHOTOS.mariscos },
        { nombre: "Tlaxtihuilli", descripcion: "Atole de maíz con camarón seco, chile ancho y epazote.", imagen: MEXICAN_PHOTOS.mole },
        { nombre: "Tuba de Nayarit", descripcion: "Bebida refrescante de savia de palma de coco con frutas.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Ceviche de camarón nayarita", descripcion: "Camarón crudo marinado en limón con pepino, cebolla y chile serrano.", imagen: MEXICAN_PHOTOS.ceviche }
      ],
      clima: "Cálido subhúmedo costero (24°C promedio)"
    }
  },
  "19": {
    lema: "Nuevo León, Progreso en Unidad",
    heroImage: MEXICAN_PHOTOS.centro_cdmx,
    resumen: "La capital industrial y tecnológica de México, con Monterrey como metrópoli cosmopolita, la Sierra Madre Oriental, cabrito al pastor y el Cerro de la Silla como emblema.",
    turismo: {
      destinos: [
        { nombre: "Cerro de la Silla", descripcion: "Ícono natural de Monterrey con perfil de silla de montar visible desde toda la ciudad.", imagen: MEXICAN_PHOTOS.barrancas_cobre },
        { nombre: "Parque Fundidora", descripcion: "Parque industrial reconvertido en espacio cultural con museos y lago.", imagen: MEXICAN_PHOTOS.centro_cdmx },
        { nombre: "Grutas de García", descripcion: "Cavernas de más de 60 millones de años con estalactitas y un teleférico.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Museo de Arte Contemporáneo (MARCO)", descripcion: "Ícono arquitectónico con la paloma gigante de Juan Soriano.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Cascada Cola de Caballo", descripcion: "Caída de agua de 25 metros en cañón boscoso de la Sierra Madre.", imagen: MEXICAN_PHOTOS.cenote_maya },
        { nombre: "Paseo Santa Lucía", descripcion: "Canal artificial navegable que conecta el centro con Parque Fundidora.", imagen: MEXICAN_PHOTOS.centro_cdmx }
      ],
      pueblosMagicos: [
        { nombre: "Santiago", descripcion: "Pueblo serrano con cascada Cola de Caballo y presa La Boca.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Bustamante", descripcion: "Grutas de palmito con formaciones cristalinas y tradiciones ganaderas.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Linares", descripcion: "Cuna de la música norteña con dulces de leche y nuez.", imagen: MEXICAN_PHOTOS.pueblo_colonial }
      ],
      arqueologia: [
        { nombre: "Boca de Potrerillos", descripcion: "Miles de petrograbados en roca de culturas nómadas prehispánicas.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Museo de Historia Mexicana", descripcion: "Recorrido por la historia de México desde el periodo prehispánico.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Cueva de la Boca", descripcion: "Caverna con colonia de millones de murciélagos y fósiles.", imagen: MEXICAN_PHOTOS.canon_sumidero }
      ],
      playas: [],
      gastronomia: [
        { nombre: "Cabrito al pastor", descripcion: "Cabrito tierno asado lentamente al carbón de mezquite, insignia regiomontana.", imagen: MEXICAN_PHOTOS.barbacoa },
        { nombre: "Machacado con huevo", descripcion: "Carne seca deshebrada con huevo revuelto, platillo de desayuno norteño.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Carne asada regiomontana", descripcion: "Arrachera y cortes premium asados al carbón con guacamole y frijoles charros.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Frijoles con veneno", descripcion: "Frijoles guisados con chorizo y cerveza, tradición de carnes asadas.", imagen: MEXICAN_PHOTOS.mole },
        { nombre: "Glorias de Linares", descripcion: "Dulces de leche quemada con nuez pacana envueltos en celofán.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      clima: "Seco extremoso (22°C promedio)"
    }
  },
  "20": {
    lema: "Tierra de Magia y Tradición",
    heroImage: MEXICAN_PHOTOS.oaxaca_centro,
    resumen: "Capital gastronómica y artesanal de México, tierra del barro negro, los alebrijes, las ocho regiones de la Guelaguetza y el mezcal ancestral.",
    turismo: {
      destinos: [
        { nombre: "Templo de Santo Domingo de Guzmán", descripcion: "Obra cumbre del barroco novohispano con bóvedas doradas en hoja de oro.", imagen: MEXICAN_PHOTOS.oaxaca_centro },
        { nombre: "Hierve el Agua", descripcion: "Cascadas petrificadas de roca caliza con albercas naturales.", imagen: MEXICAN_PHOTOS.hierve_el_agua },
        { nombre: "Árbol del Tule", descripcion: "El ahuehuete con el tronco más ancho del mundo, más de 2,000 años.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Mercado 20 de Noviembre", descripcion: "El pasillo de humo con tasajo asado al carbón y cecina.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "San Antonio Arrazola", descripcion: "Cuna de los alebrijes tallados en madera de copal.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "San Bartolo Coyotepec", descripcion: "Hogar de la alfarería del barro negro pulido a mano.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      pueblosMagicos: [
        { nombre: "Capulálpam de Méndez", descripcion: "Pueblo ecoturístico en la Sierra Norte con bosques de niebla.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Mazunte", descripcion: "Playa bohemia y Centro Mexicano de la Tortuga.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "San Pablo Villa de Mitla", descripcion: "Hogar de la Ciudad de los Muertos zapoteca con mosaicos geométricos.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "San Pedro y San Pablo Teposcolula", descripcion: "La Capilla Abierta más grande de América Latina.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Santa Catarina Juquila", descripcion: "Centro de peregrinación de la Virgen de Juquila.", imagen: MEXICAN_PHOTOS.pueblo_colonial }
      ],
      arqueologia: [
        { nombre: "Monte Albán", descripcion: "Capital monumental zapoteco sobre una meseta artificial.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Mitla", descripcion: "Centro ceremonial zapoteca-mixteco con grecas talladas en piedra.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Yagul", descripcion: "Fortaleza prehispánica con cuevas prehistóricas Patrimonio UNESCO.", imagen: MEXICAN_PHOTOS.teotihuacan }
      ],
      playas: [
        { nombre: "Puerto Escondido (Zicatela)", descripcion: "Meca mundial del surf con tubos colosales.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Bahías de Huatulco", descripcion: "Nueve bahías cristalinas con arrecifes protegidos.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "Zipolite", descripcion: "Célebre playa de descanso libre y atardeceres dorados.", imagen: MEXICAN_PHOTOS.tulum }
      ],
      gastronomia: [
        { nombre: "Mole Negro Oaxaqueño", descripcion: "Elaborado con chiles chilhuacles quemados, chocolate y más de 30 ingredientes.", imagen: MEXICAN_PHOTOS.mole },
        { nombre: "Tlayuda con tasajo", descripcion: "Tortilla gigante con asiento, frijol negro, quesillo y tasajo asado.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Mezcal de maguey Espadín", descripcion: "Destilado ancestral en ollas de barro y hornos de tierra.", imagen: MEXICAN_PHOTOS.paisaje_agave },
        { nombre: "Quesillo oaxaca artesanal", descripcion: "Queso de hebra enrollado en madeja con leche fresca.", imagen: MEXICAN_PHOTOS.torta_ahogada },
        { nombre: "Chapulines al mojo de ajo", descripcion: "Insectos tostados en comal con ajo, chile piquín y sal.", imagen: MEXICAN_PHOTOS.tacos }
      ],
      clima: "Cálido y templado según altitud (22°C promedio)"
    }
  },
  "21": {
    lema: "Relicario de América",
    heroImage: MEXICAN_PHOTOS.puebla_centro,
    resumen: "Tierra de cúpulas de talavera, cuna del mole poblano y los chiles en nogada, custodiada por los volcanes Popocatépetl e Iztaccíhuatl.",
    turismo: {
      destinos: [
        { nombre: "Catedral de Puebla", descripcion: "Las torres de cantera más altas de México con altar de Manuel Tolsá.", imagen: MEXICAN_PHOTOS.puebla_centro },
        { nombre: "Capilla del Rosario", descripcion: "Considerada la octava maravilla del mundo por su pan de oro.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Biblioteca Palafoxiana", descripcion: "Primera biblioteca pública de América establecida en 1646.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Callejón de los Sapos", descripcion: "Pasaje virreinal de anticuarios y talavera.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Estrella de Puebla", descripcion: "Rueda de observación gigante con vistas a los volcanes.", imagen: MEXICAN_PHOTOS.centro_cdmx },
        { nombre: "Africam Safari", descripcion: "Parque de conservación de fauna en semilibertad.", imagen: MEXICAN_PHOTOS.canon_sumidero }
      ],
      pueblosMagicos: [
        { nombre: "Cholula", descripcion: "Gran pirámide con la base más ancha del mundo coronada por santuario.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Cuetzalan del Progreso", descripcion: "Pueblo en la neblina serrana con danzas de voladores.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Zacatlán de las Manzanas", descripcion: "Museo de Relojería y mirador de cristal de la barranca.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Chignahuapan", descripcion: "Esferas navideñas de vidrio soplado y aguas termales.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Atlixco de las Flores", descripcion: "Pueblo florícola a las faldas del volcán con arquitectura franciscana.", imagen: MEXICAN_PHOTOS.pueblo_colonial }
      ],
      arqueologia: [
        { nombre: "Gran Pirámide de Cholula", descripcion: "El mayor basamento piramidal del planeta con túneles explorables.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Cantona", descripcion: "Antigua metrópoli militar con 27 canchas de juego de pelota.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Yohualichan", descripcion: "Zona con nichos estilo Tajín en la Sierra Norte.", imagen: MEXICAN_PHOTOS.tajin }
      ],
      playas: [],
      gastronomia: [
        { nombre: "Mole Poblano tradicional", descripcion: "Sinfonía barroca con chocolate, chiles secos y especias.", imagen: MEXICAN_PHOTOS.mole },
        { nombre: "Chiles en Nogada", descripcion: "Chile poblano relleno con picadillo, salsa de nuez y granada.", imagen: MEXICAN_PHOTOS.chiles_nogada },
        { nombre: "Cemitas poblanas", descripcion: "Pan con sésamo, milanesa, quesillo, pápalo y chipotle.", imagen: MEXICAN_PHOTOS.torta_ahogada },
        { nombre: "Chalupas poblanas", descripcion: "Tortillas fritas con salsa, hebras de res y cebolla.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Dulces de Santa Clara", descripcion: "Tortitas con pepita de calabaza y camotes aromatizados.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      clima: "Templado subhúmedo (17°C promedio)"
    }
  },
  "22": {
    lema: "¡Aquí el Esplendor de México!",
    heroImage: MEXICAN_PHOTOS.pueblo_colonial,
    resumen: "Estado del Bajío con arquitectura barroca espectacular, viñedos en crecimiento, la Peña de Bernal y la ruta del queso y el vino.",
    turismo: {
      destinos: [
        { nombre: "Centro Histórico de Querétaro", descripcion: "Patrimonio de la Humanidad con acueducto de 74 arcos y templos barrocos.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Peña de Bernal", descripcion: "El tercer monolito más grande del mundo con 350 metros de altura.", imagen: MEXICAN_PHOTOS.barrancas_cobre },
        { nombre: "Acueducto de Querétaro", descripcion: "74 arcos de cantera rosa construidos en el siglo XVIII.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Sierra Gorda de Querétaro", descripcion: "Reserva de la Biósfera con cinco misiones franciscanas Patrimonio UNESCO.", imagen: MEXICAN_PHOTOS.barrancas_cobre },
        { nombre: "Viñedos de Querétaro", descripcion: "Ruta del vino y el queso con bodegas boutique y catas.", imagen: MEXICAN_PHOTOS.valle_guadalupe }
      ],
      pueblosMagicos: [
        { nombre: "Bernal", descripcion: "Pueblo mágico al pie del monolito con dulces de cajeta y tiendas artesanales.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Jalpan de Serra", descripcion: "Misión franciscana fundada por Fray Junípero Serra en la Sierra Gorda.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Cadereyta de Montes", descripcion: "Jardín botánico de cactáceas y misión del siglo XVIII.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Tequisquiapan", descripcion: "Villa termal con mercado artesanal y Festival del Queso y Vino.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "San Joaquín", descripcion: "Pueblo serrano con grutas y la danza de los viejos otomíes.", imagen: MEXICAN_PHOTOS.canon_sumidero }
      ],
      arqueologia: [
        { nombre: "El Cerrito", descripcion: "Pirámide prehispánica tolteca-chichimeca en la ciudad de Querétaro.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Ranas", descripcion: "Centro minero prehispánico con plataformas y juego de pelota en la Sierra Gorda.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Toluquilla", descripcion: "Zona arqueológica serrana con estructuras ceremoniales de la cultura serrana.", imagen: MEXICAN_PHOTOS.teotihuacan }
      ],
      playas: [],
      gastronomia: [
        { nombre: "Enchiladas queretanas", descripcion: "Enchiladas en salsa de chile ancho con zanahoria y papa.", imagen: MEXICAN_PHOTOS.mole },
        { nombre: "Gorditas de migajas", descripcion: "Masa de maíz con chicharrón prensado fritas en comal.", imagen: MEXICAN_PHOTOS.tamales },
        { nombre: "Queso de Tequisquiapan", descripcion: "Quesos artesanales madurados con hierbas y chiles.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Nopal en penca", descripcion: "Nopal asado directamente en la penca con queso y salsa.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Vino espumoso queretano", descripcion: "Vinos espumosos de método tradicional de las bodegas del Bajío.", imagen: MEXICAN_PHOTOS.valle_guadalupe }
      ],
      clima: "Semiseco templado (18°C promedio)"
    }
  },
  "23": {
    lema: "El Caribe Mexicano",
    heroImage: MEXICAN_PHOTOS.tulum,
    resumen: "Principal polo turístico de México y del Caribe, con playas de arena blanca coralina, aguas turquesa, la barrera arrecifal maya y ruinas frente al mar.",
    turismo: {
      destinos: [
        { nombre: "Tulum frente al Mar", descripcion: "Ciudad amurallada maya sobre acantilados frente al mar Caribe.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Parque Xcaret", descripcion: "Parque ecoarqueológico con ríos subterráneos y show de gala.", imagen: MEXICAN_PHOTOS.cenote_maya },
        { nombre: "Laguna de Bacalar", descripcion: "Laguna de siete tonalidades de azul turquesa con estromatolitos.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "Isla Holbox", descripcion: "Isla caribeña de calles de arena sin automóviles con bioluminiscencia.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Cenotes de la Riviera Maya", descripcion: "Pozas subterráneas de agua cristalina conectadas a ríos.", imagen: MEXICAN_PHOTOS.cenote_maya },
        { nombre: "Arrecife de Cozumel", descripcion: "Paraíso del buceo con paredes de coral negro.", imagen: MEXICAN_PHOTOS.cabo_san_lucas }
      ],
      pueblosMagicos: [
        { nombre: "Bacalar", descripcion: "Fuerte virreinal a orillas de la laguna de los siete colores.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "Isla Mujeres", descripcion: "Punta Sur con acantilados y Playa Norte.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Tulum Pueblo", descripcion: "Ambiente bohemio y eco-chic entre cenotes y restaurantes de autor.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Cozumel", descripcion: "Isla de las golondrinas con parques marinos protegidos.", imagen: MEXICAN_PHOTOS.cabo_san_lucas }
      ],
      arqueologia: [
        { nombre: "Tulum Arqueológico", descripcion: "El Castillo y el Templo de los Frescos vigilando el mar.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Cobá", descripcion: "Pirámide Nohoch Mul de 42 metros oculta en la selva.", imagen: MEXICAN_PHOTOS.palenque },
        { nombre: "San Gervasio en Cozumel", descripcion: "Santuario de la diosa maya Ixchel.", imagen: MEXICAN_PHOTOS.chichen_itza }
      ],
      playas: [
        { nombre: "Playa Delfines en Cancún", descripcion: "Playa pública con el famoso parador fotográfico.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Playa Norte en Isla Mujeres", descripcion: "Aguas tranquilas catalogada entre las mejores del mundo.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Akumal", descripcion: "Bahía para nado respetuoso junto a tortugas verdes.", imagen: MEXICAN_PHOTOS.cabo_san_lucas }
      ],
      gastronomia: [
        { nombre: "Cochinita Pibil tradicional", descripcion: "Cerdo adobado con achiote horneado bajo tierra en hoja de plátano.", imagen: MEXICAN_PHOTOS.cochinita },
        { nombre: "Tikin Xic de pescado", descripcion: "Pescado marinado en achiote asado a las brasas de coco.", imagen: MEXICAN_PHOTOS.mariscos },
        { nombre: "Ceviche de caracol rosado", descripcion: "Marinado con limón, cebolla morada y chile habanero.", imagen: MEXICAN_PHOTOS.ceviche },
        { nombre: "Marquesitas con queso de bola", descripcion: "Barquillo caliente relleno de queso Edam.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Tacos de lechón al horno", descripcion: "Cerdo crujiente horneado servido en tortillas con salsa verde.", imagen: MEXICAN_PHOTOS.tacos }
      ],
      clima: "Cálido subhúmedo caribeño (26°C promedio)"
    }
  },
  "24": {
    lema: "San Luis es de Todos",
    heroImage: MEXICAN_PHOTOS.pueblo_colonial,
    resumen: "Estado de contrastes entre el desierto potosino, la exuberante Huasteca con cascadas turquesa y una capital con arquitectura barroca de cantera rosa.",
    turismo: {
      destinos: [
        { nombre: "Cascada de Tamul", descripcion: "Espectacular caída de agua de 105 metros en la Huasteca Potosina.", imagen: MEXICAN_PHOTOS.cenote_maya },
        { nombre: "Sótano de las Golondrinas", descripcion: "Abismo de 512 metros de profundidad donde anidan vencejos.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Centro Histórico de SLP", descripcion: "Catedral barroca, Teatro de la Paz y jardines coloniales.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Puente de Dios", descripcion: "Formación natural con piscina de agua turquesa cristalina.", imagen: MEXICAN_PHOTOS.cenote_maya },
        { nombre: "Real de Catorce", descripcion: "Pueblo fantasma minero de plata accesible por túnel de 2 km.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Cascadas de Minas Viejas", descripcion: "Caída doble de agua sobre pozas color esmeralda.", imagen: MEXICAN_PHOTOS.cenote_maya }
      ],
      pueblosMagicos: [
        { nombre: "Real de Catorce", descripcion: "Pueblo fantasma minero con centro ceremonial wixárika en el desierto.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Xilitla", descripcion: "Jardín surrealista de Edward James con esculturas en la selva.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Aquismón", descripcion: "Portal a las cascadas y sótanos de la Huasteca.", imagen: MEXICAN_PHOTOS.cenote_maya }
      ],
      arqueologia: [
        { nombre: "Tamtoc", descripcion: "Centro ceremonial huasteco con la escultura de la Mujer Escarificada.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "El Consuelo", descripcion: "Zona huasteca con pirámides y ofrendas de la cultura teenek.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Cueva del Salitre", descripcion: "Abrigo rocoso con pinturas rupestres de culturas nómadas.", imagen: MEXICAN_PHOTOS.teotihuacan }
      ],
      playas: [],
      gastronomia: [
        { nombre: "Enchiladas potosinas", descripcion: "Tortillas de chile ancho rellenas de queso y oreadas al comal.", imagen: MEXICAN_PHOTOS.mole },
        { nombre: "Zacahuil", descripcion: "Tamal gigante de más de un metro para ceremonias huastecas.", imagen: MEXICAN_PHOTOS.tamales },
        { nombre: "Queso de tuna", descripcion: "Dulce artesanal de tuna cardona del desierto potosino.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Bocoles huastecos", descripcion: "Gorditas gruesas de maíz rellenas de frijol, queso y salsa.", imagen: MEXICAN_PHOTOS.tamales },
        { nombre: "Asado de boda potosino", descripcion: "Carne de cerdo en salsa roja de chiles secos para celebraciones.", imagen: MEXICAN_PHOTOS.mole }
      ],
      clima: "Seco y semiseco a cálido húmedo en la Huasteca"
    }
  },
  "25": {
    lema: "Sinaloa, un Estado que Progresa",
    heroImage: MEXICAN_PHOTOS.tulum,
    resumen: "Costa del Pacífico con Mazatlán como perla turística, rica tradición pesquera de camarón y atún, banda sinaloense y una gastronomía de mariscos inigualable.",
    turismo: {
      destinos: [
        { nombre: "Malecón de Mazatlán", descripcion: "Uno de los malecones más largos del mundo con 21 km frente al Pacífico.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Centro Histórico de Mazatlán", descripcion: "Barrio colonial restaurado con teatros, plazuelas y catedral.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Isla de la Piedra", descripcion: "Extensa playa virgen accesible en lancha con palapas y mariscos.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "Cañón del Diablo", descripcion: "Cañón selvático con pozas de agua y senderos de aventura.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Altata-El Tambor", descripcion: "Bahía con manglares y pesca artesanal de camarón.", imagen: MEXICAN_PHOTOS.cabo_san_lucas }
      ],
      pueblosMagicos: [
        { nombre: "El Rosario", descripcion: "Pueblo colonial con la iglesia barroca más ornamentada del noroeste.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Cosalá", descripcion: "Real de minas con arquitectura virreinal y cascadas.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "El Quelite", descripcion: "Pueblo sindicatura con tradiciones campesinas y taberna El Mesteño.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Mocorito", descripcion: "La Atenas de Sinaloa, pueblo de poetas y músicos.", imagen: MEXICAN_PHOTOS.pueblo_colonial }
      ],
      arqueologia: [
        { nombre: "Petroglifos de Las Labradas", descripcion: "Más de 600 petrograbados en roca volcánica frente al océano.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Chametla", descripcion: "Sitio arqueológico de la cultura aztatlán con cerámica policromada.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Museo Arqueológico de Mazatlán", descripcion: "Colección de piezas de las culturas aztatlán y totorames.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      playas: [
        { nombre: "Playa Brujas en Mazatlán", descripcion: "Playa de oleaje moderado con formaciones rocosas y surf.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Playa Cerritos", descripcion: "Arena dorada con oleaje suave ideal para familias.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "Teacapán", descripcion: "Bahía virgen con manglares, cocodrilos y pesca deportiva.", imagen: MEXICAN_PHOTOS.tulum }
      ],
      gastronomia: [
        { nombre: "Aguachile sinaloense", descripcion: "Camarón crudo en jugo de limón con chiles, pepino y cebolla morada.", imagen: MEXICAN_PHOTOS.ceviche },
        { nombre: "Marlín ahumado", descripcion: "Pescado ahumado deshebrado con mayonesa, el taco insignia de Mazatlán.", imagen: MEXICAN_PHOTOS.mariscos },
        { nombre: "Camarones a la diabla", descripcion: "Camarones gigantes del Pacífico en salsa de chiles de árbol.", imagen: MEXICAN_PHOTOS.mariscos },
        { nombre: "Chilorio", descripcion: "Carne de cerdo deshebrada frita en chile ancho y comino.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Tamales barbones", descripcion: "Tamales de camarón con bigotes de antenas asomando de la masa.", imagen: MEXICAN_PHOTOS.tamales }
      ],
      clima: "Cálido subhúmedo costero (25°C promedio)"
    }
  },
  "26": {
    lema: "Dios, Unión y Trabajo",
    heroImage: MEXICAN_PHOTOS.cuatro_cienegas,
    resumen: "Segundo estado más grande de México con el desierto de Altar, la cultura yaqui-mayo, playas del Mar de Cortés y las misiones jesuitas del siglo XVII.",
    turismo: {
      destinos: [
        { nombre: "Reserva de la Biósfera El Pinacate", descripcion: "Paisaje lunar con cráteres volcánicos y dunas, Patrimonio UNESCO.", imagen: MEXICAN_PHOTOS.cuatro_cienegas },
        { nombre: "Bahía de Kino", descripcion: "Aguas tranquilas del Mar de Cortés con la Isla del Tiburón.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "San Carlos Nuevo Guaymas", descripcion: "Bahía con montañas de roca y playas cristalinas.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Alamos", descripcion: "Ciudad colonial de portales y casas señoriales en cantera.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Cerro de la Campana en Hermosillo", descripcion: "Mirador panorámico con museo y vistas a toda la ciudad.", imagen: MEXICAN_PHOTOS.centro_cdmx }
      ],
      pueblosMagicos: [
        { nombre: "Álamos", descripcion: "Joya colonial del noroeste con portales y haciendas restauradas.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Magdalena de Kino", descripcion: "Tumba del padre Eusebio Kino, misionero jesuita de la Pimería Alta.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "San Pedro de la Cueva", descripcion: "Pueblo serrano con pinturas rupestres y paisajes de cañones.", imagen: MEXICAN_PHOTOS.canon_sumidero }
      ],
      arqueologia: [
        { nombre: "La Pintada", descripcion: "Abrigo rocoso con más de 2,000 pinturas rupestres policromas.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Trincheras", descripcion: "Cerro con terrazas defensivas de piedra de la cultura homónima.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Museo de Sonora", descripcion: "Historia natural y cultural del estado en la antigua penitenciaría.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      playas: [
        { nombre: "Puerto Peñasco (Rocky Point)", descripcion: "Playas del Golfo de California con piscinas de marea.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "Huatabampo", descripcion: "Costa mayo con playas vírgenes y pesca artesanal.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Playa Los Algodones", descripcion: "Arena blanca fina con oleaje tranquilo en San Carlos.", imagen: MEXICAN_PHOTOS.tulum }
      ],
      gastronomia: [
        { nombre: "Carne asada sonorense", descripcion: "Cortes de res de primera calidad asados al carbón de mezquite.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Machaca con huevo", descripcion: "Carne seca deshebrada con huevo, clásico desayuno del norte.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Coyotas", descripcion: "Empanadas de harina de trigo rellenas de piloncillo y nuez.", imagen: MEXICAN_PHOTOS.tamales },
        { nombre: "Cahuamanta", descripcion: "Caldo de mantarraya con chile colorado y verduras.", imagen: MEXICAN_PHOTOS.mariscos },
        { nombre: "Bacanora", descripcion: "Destilado de agave silvestre con denominación de origen sonorense.", imagen: MEXICAN_PHOTOS.paisaje_agave }
      ],
      clima: "Seco desértico a cálido (24°C promedio)"
    }
  },
  "27": {
    lema: "De México, lo Mejor",
    heroImage: MEXICAN_PHOTOS.canon_sumidero,
    resumen: "Estado tropical con extensas llanuras inundables, ríos caudalosos, la cultura olmeca madre y la mayor producción de cacao de México.",
    turismo: {
      destinos: [
        { nombre: "Parque-Museo La Venta", descripcion: "Museo al aire libre con colosales cabezas olmecas y altares originales.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Pantanos de Centla", descripcion: "La reserva de humedales más grande de Norteamérica.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Cascadas de Reforma (Roberto Barrios)", descripcion: "Cascadas escalonadas de agua turquesa en la selva.", imagen: MEXICAN_PHOTOS.cenote_maya },
        { nombre: "Tapijulapa", descripcion: "Pueblo de casas con techos de teja roja junto al río Oxolotán.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Villahermosa Centro Histórico", descripcion: "Capital con parques, museos y paseo ribereño del Grijalva.", imagen: MEXICAN_PHOTOS.centro_cdmx }
      ],
      pueblosMagicos: [
        { nombre: "Tapijulapa", descripcion: "Pueblo enclavado en la selva con ríos de agua cristalina y cuevas.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Villa Luz (Cueva de las Sardinas)", descripcion: "Cueva con ríos de azufre y peces ciegos endémicos.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Teapa", descripcion: "Pueblo de balnearios naturales y grutas de Cocona.", imagen: MEXICAN_PHOTOS.cenote_maya }
      ],
      arqueologia: [
        { nombre: "La Venta", descripcion: "Capital olmeca original con pirámides de arcilla y esculturas monumentales.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Comalcalco", descripcion: "Única ciudad maya construida con ladrillo cocido en vez de piedra.", imagen: MEXICAN_PHOTOS.palenque },
        { nombre: "Malpasito", descripcion: "Centro zoque con petroglitos y juego de pelota en la sierra.", imagen: MEXICAN_PHOTOS.teotihuacan }
      ],
      playas: [
        { nombre: "Playa El Paraíso en Paraíso", descripcion: "Playa del Golfo con oleaje moderado y manglares.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Puerto Ceiba", descripcion: "Costa con manglares y pesca artesanal de ostión.", imagen: MEXICAN_PHOTOS.cabo_san_lucas }
      ],
      gastronomia: [
        { nombre: "Pejelagarto asado", descripcion: "Pez prehistórico de agua dulce asado al carbón.", imagen: MEXICAN_PHOTOS.mariscos },
        { nombre: "Chocolatería tabasqueña", descripcion: "Cacao nativo procesado artesanalmente, origen del chocolate.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Tamales de chipilín", descripcion: "Masa con hierba chipilín rellenos de pollo y salsa.", imagen: MEXICAN_PHOTOS.tamales },
        { nombre: "Tortillas de plátano macho", descripcion: "Tortillas dulces de plátano verde fritas en manteca.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Pozol tabasqueño", descripcion: "Bebida ancestral de maíz y cacao molidos en jícara.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      clima: "Cálido húmedo tropical (27°C promedio)"
    }
  },
  "28": {
    lema: "Tamaulipas, Tierra de Gente Valiente",
    heroImage: MEXICAN_PHOTOS.tulum,
    resumen: "Estado fronterizo del noreste con costas del Golfo de México, la Reserva de la Biósfera El Cielo, centros coloniales y una fuerte tradición ganadera.",
    turismo: {
      destinos: [
        { nombre: "Reserva de la Biósfera El Cielo", descripcion: "Selvas de niebla con cuatro ecosistemas desde el tropical al templado.", imagen: MEXICAN_PHOTOS.barrancas_cobre },
        { nombre: "Playa Miramar en Ciudad Madero", descripcion: "Playa urbana del Golfo con arena dorada y paseo peatonal.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Zona Colonial de Tula", descripcion: "Arquitectura virreinal con iglesias y plazas del siglo XVIII.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Laguna Madre", descripcion: "Extensa laguna costera con avistamiento de aves migratorias.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "Barra del Tordo", descripcion: "Playa virgen con santuario de tortuga lora.", imagen: MEXICAN_PHOTOS.tulum }
      ],
      pueblosMagicos: [
        { nombre: "Tula", descripcion: "Pueblo colonial con arquitectura virreinal y tradiciones ganaderas.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Mier", descripcion: "Antigua villa fronteriza con plaza colonial y fuerte.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Bustamante", descripcion: "Grutas con formaciones de cristal y tradiciones campesinas.", imagen: MEXICAN_PHOTOS.canon_sumidero }
      ],
      arqueologia: [
        { nombre: "Museo Regional de Tamaulipas", descripcion: "Acervo de las culturas huastecas del noreste de México.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Las Flores", descripcion: "Zona huasteca con montículos ceremoniales.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Sierra de Tamaulipas", descripcion: "Cuevas con evidencia de las primeras plantas cultivadas de América.", imagen: MEXICAN_PHOTOS.chichen_itza }
      ],
      playas: [
        { nombre: "Playa Miramar", descripcion: "Playa principal del Golfo en Ciudad Madero.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Playa Tesoro", descripcion: "Playa tranquila con palapas y restaurantes de mariscos.", imagen: MEXICAN_PHOTOS.cabo_san_lucas },
        { nombre: "Playa Bagdad", descripcion: "Extensa playa histórica cerca de la desembocadura del Río Bravo.", imagen: MEXICAN_PHOTOS.tulum }
      ],
      gastronomia: [
        { nombre: "Carne asada tamaulipeca", descripcion: "Cortes de res asados al carbón de mezquite con tortillas de harina.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Jaiba rellena", descripcion: "Caparazón de jaiba relleno con su carne guisada con especias.", imagen: MEXICAN_PHOTOS.mariscos },
        { nombre: "Gorditas norteñas", descripcion: "Gorditas de harina de trigo rellenas de machacado y frijol.", imagen: MEXICAN_PHOTOS.tamales },
        { nombre: "Cabrito al horno", descripcion: "Cabrito tierno horneado con hierbas de la tradición norteña.", imagen: MEXICAN_PHOTOS.barbacoa },
        { nombre: "Dulce de leche quemada", descripcion: "Caramelo de leche de cabra, tradición repostera del noreste.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      clima: "Cálido subhúmedo a seco (24°C promedio)"
    }
  },
  "29": {
    lema: "Cuna de la Nación",
    heroImage: MEXICAN_PHOTOS.puebla_centro,
    resumen: "El estado más pequeño de la República, pero cuna de la democracia, el mestizaje y el maíz. Rico en haciendas pulqueras, conventos y festividades ancestrales.",
    turismo: {
      destinos: [
        { nombre: "Basílica de Nuestra Señora de Ocotlán", descripcion: "Obra cumbre del barroco novohispano con torres y fachada de argamasa blanca.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Murales del Palacio de Gobierno", descripcion: "Ciclo pictórico de Desiderio Hernández Xochitiotzin sobre la historia de Tlaxcala.", imagen: MEXICAN_PHOTOS.centro_cdmx },
        { nombre: "Parque Nacional La Malinche", descripcion: "Volcán extinto con bosques de coníferas y senderos alpinos.", imagen: MEXICAN_PHOTOS.barrancas_cobre },
        { nombre: "Val'Quirico", descripcion: "Pueblo de estilo toscano con viñedos, restaurantes y artesanías.", imagen: MEXICAN_PHOTOS.valle_guadalupe },
        { nombre: "Feria de Tlaxcala", descripcion: "Una de las ferias más antiguas del país con corridas, música y artesanías.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      pueblosMagicos: [
        { nombre: "Huamantla", descripcion: "Pueblo de la Noche que Nadie Duerme con alfombras florales y huamantlada.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Tlaxco", descripcion: "Pueblo de fábricas textiles históricas y quesos artesanales.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Atlihetzía", descripcion: "Comunidad con la procesión de viernes santo más concurrida.", imagen: MEXICAN_PHOTOS.iglesia_colonial }
      ],
      arqueologia: [
        { nombre: "Cacaxtla", descripcion: "Murales policromados con guerreros águila y jaguar prehispánicos.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Xochitécatl", descripcion: "Pirámide circular con ofrendas de fertilidad junto a Cacaxtla.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Tizatlán", descripcion: "Capital del señorío tlaxcalteca con altares policromados.", imagen: MEXICAN_PHOTOS.teotihuacan }
      ],
      playas: [],
      gastronomia: [
        { nombre: "Mole prieto tlaxcalteca", descripcion: "Mole de masa quemada de maíz con chile ancho y carnes.", imagen: MEXICAN_PHOTOS.mole },
        { nombre: "Tlatloyos de frijol y haba", descripcion: "Gorditas rellenas con forma de barco, cocidas en comal.", imagen: MEXICAN_PHOTOS.tamales },
        { nombre: "Mixiotes de carnero", descripcion: "Carne envuelta en cutícula de maguey con adobo de chiles.", imagen: MEXICAN_PHOTOS.barbacoa },
        { nombre: "Pulque de Tlaxcala", descripcion: "Bebida ancestral del maguey pulquero en tinacales centenarios.", imagen: MEXICAN_PHOTOS.paisaje_agave },
        { nombre: "Muéganos de Huamantla", descripcion: "Dulce de bolitas de masa frita cubiertas de piloncillo.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      clima: "Templado subhúmedo (15°C promedio)"
    }
  },
  "30": {
    lema: "Veracruz, Puerto de Entrada al Nuevo Mundo",
    heroImage: MEXICAN_PHOTOS.tajin,
    resumen: "Estado con la mayor biodiversidad de México, costa del Golfo con el puerto más antiguo de América, el son jarocho, la vainilla y el café de altura.",
    turismo: {
      destinos: [
        { nombre: "Puerto de Veracruz y Malecón", descripcion: "Puerto histórico con el fuerte de San Juan de Ulúa y carnaval.", imagen: MEXICAN_PHOTOS.centro_cdmx },
        { nombre: "Xalapa capital y Museo de Antropología", descripcion: "Ciudad de la niebla con uno de los museos arqueológicos más ricos.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Cascada de Texolo", descripcion: "Caída de agua de 80 metros en un cañón de neblina tropical.", imagen: MEXICAN_PHOTOS.cenote_maya },
        { nombre: "Pico de Orizaba (Citlaltépetl)", descripcion: "La montaña más alta de México con 5,636 metros y glaciares.", imagen: MEXICAN_PHOTOS.barrancas_cobre },
        { nombre: "Los Tuxtlas", descripcion: "Selva tropical con lagos volcánicos y el cerro de San Martín.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Tlacotalpan", descripcion: "Pueblo ribereño Patrimonio UNESCO con casas de colores y la Candelaria.", imagen: MEXICAN_PHOTOS.pueblo_colonial }
      ],
      pueblosMagicos: [
        { nombre: "Coatepec", descripcion: "Capital del café de altura con casas señoriales y orquídeas.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Xico", descripcion: "Pueblo de cascada y procesiones con alfombras de aserrín.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Papantla", descripcion: "Capital de la vainilla y los Voladores de Papantla.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Coscomatepec", descripcion: "Pueblo a las faldas del Pico de Orizaba con café y neblina.", imagen: MEXICAN_PHOTOS.barrancas_cobre },
        { nombre: "Zozocolco de Hidalgo", descripcion: "Pueblo totonaca con huapango y casas de colores.", imagen: MEXICAN_PHOTOS.pueblo_colonial }
      ],
      arqueologia: [
        { nombre: "El Tajín", descripcion: "Ciudad de los truenos con la Pirámide de los Nichos de 365 huecos.", imagen: MEXICAN_PHOTOS.tajin },
        { nombre: "Cempoala", descripcion: "Última capital totonaca donde Cortés forjó alianzas contra los mexicas.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Tres Zapotes", descripcion: "Sitio olmeca con una de las primeras escrituras de Mesoamérica.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "San Lorenzo Tenochtitlán", descripcion: "Centro olmeca original con cabezas colosales de basalto.", imagen: MEXICAN_PHOTOS.chichen_itza }
      ],
      playas: [
        { nombre: "Costa Esmeralda", descripcion: "Corredor de playas de arena blanca entre Tecolutla y Nautla.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Playa Mocambo", descripcion: "La playa más emblemática del puerto de Veracruz.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Playa de Tuxpan", descripcion: "Arena dorada con oleaje suave del Golfo.", imagen: MEXICAN_PHOTOS.cabo_san_lucas }
      ],
      gastronomia: [
        { nombre: "Huachinango a la veracruzana", descripcion: "Pescado en salsa de jitomate con aceitunas, alcaparras y chiles güeros.", imagen: MEXICAN_PHOTOS.mariscos },
        { nombre: "Zacahuil veracruzano", descripcion: "Tamal gigante de más de un metro cocido en horno de leña.", imagen: MEXICAN_PHOTOS.tamales },
        { nombre: "Café de Coatepec", descripcion: "Aromático café de altura con notas achocolatadas y afrutadas.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Picadas veracruzanas", descripcion: "Tortillas gruesas pellizcadas con salsa, queso y cebolla.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Dulce de vainilla de Papantla", descripcion: "Vainas de vainilla totonaca, la mejor del mundo.", imagen: MEXICAN_PHOTOS.artesanias }
      ],
      clima: "Cálido húmedo a templado de montaña"
    }
  },
  "31": {
    lema: "Tierra de Maravillas Mayas",
    heroImage: MEXICAN_PHOTOS.chichen_itza,
    resumen: "Cuna del esplendor astronómico maya, haciendas henequeneras, la blanca Mérida colonial y cenotes sagrados de aguas turquesas.",
    turismo: {
      destinos: [
        { nombre: "Chichén Itzá", descripcion: "Maravilla del Mundo Moderno con el Templo de Kukulcán.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Paseo de Montejo en Mérida", descripcion: "Avenida señorial con palacetes porfirianos.", imagen: MEXICAN_PHOTOS.centro_cdmx },
        { nombre: "Cenote Ik Kil", descripcion: "Poza natural sagrada a cielo abierto con lianas colgantes.", imagen: MEXICAN_PHOTOS.cenote_maya },
        { nombre: "Ruta Puuc y Grutas de Loltún", descripcion: "Arquitectura maya con mosaicos de piedra y mascarones de Chaac.", imagen: MEXICAN_PHOTOS.palenque },
        { nombre: "Ría Celestún", descripcion: "Santuario de flamencos rosados entre manglares.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Las Coloradas", descripcion: "Lagunas rosadas de salmuera con tonalidades de ensueño.", imagen: MEXICAN_PHOTOS.cabo_san_lucas }
      ],
      pueblosMagicos: [
        { nombre: "Izamal", descripcion: "La Ciudad Amarilla con el Convento de San Antonio sobre pirámide maya.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Valladolid", descripcion: "Encantadora urbe colonial con cenote Zací en pleno centro.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Maní", descripcion: "Bordados mayas y cuna del Poc Chuc.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Sisal", descripcion: "Histórico puerto henequenero con playas apacibles.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "Tekax", descripcion: "Capital del ecoturismo subterráneo con cavernas y senderos.", imagen: MEXICAN_PHOTOS.canon_sumidero }
      ],
      arqueologia: [
        { nombre: "Chichén Itzá", descripcion: "Metrópoli sagrada maya con juego de pelota monumental.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "Uxmal", descripcion: "Patrimonio UNESCO con la Pirámide del Adivino redondeada.", imagen: MEXICAN_PHOTOS.palenque },
        { nombre: "Mayapán", descripcion: "Última gran capital confederada maya.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Dzibilchaltún", descripcion: "Templo de las Siete Muñecas con alineación solar.", imagen: MEXICAN_PHOTOS.chichen_itza }
      ],
      playas: [
        { nombre: "Puerto Progreso", descripcion: "Malecón con el muelle de atraque más largo del mundo.", imagen: MEXICAN_PHOTOS.tulum },
        { nombre: "El Cuyo", descripcion: "Pueblo pesquero para kitesurf y arena blanca.", imagen: MEXICAN_PHOTOS.cabo_san_lucas }
      ],
      gastronomia: [
        { nombre: "Cochinita Pibil", descripcion: "Cerdo horneado en pozo de tierra con achiote y cebolla curtida.", imagen: MEXICAN_PHOTOS.cochinita },
        { nombre: "Sopa de lima", descripcion: "Caldo de pavo con rodajas de lima agria yucateca.", imagen: MEXICAN_PHOTOS.torta_ahogada },
        { nombre: "Papadzules", descripcion: "Tortillas rellenas de huevo en salsa verde de pepita.", imagen: MEXICAN_PHOTOS.tamales },
        { nombre: "Panuchos y salbutes", descripcion: "Tortillas rellenas de frijol con pavo y aguacate.", imagen: MEXICAN_PHOTOS.tacos },
        { nombre: "Poc Chuc", descripcion: "Filetes de cerdo marinados en naranja agria asados al carbón.", imagen: MEXICAN_PHOTOS.tacos }
      ],
      clima: "Cálido subhúmedo con lluvias en verano"
    }
  },
  "32": {
    lema: "La Plata de México",
    heroImage: MEXICAN_PHOTOS.pueblo_colonial,
    resumen: "Estado minero por excelencia con una capital Patrimonio de la Humanidad, cantera rosa, minas de plata centenarias y una tradición cultural vibrante.",
    turismo: {
      destinos: [
        { nombre: "Centro Histórico de Zacatecas", descripcion: "Patrimonio de la Humanidad con catedral barroca churrigueresca de cantera rosa.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Mina El Edén", descripcion: "Mina colonial reconvertida en museo y discoteca subterránea.", imagen: MEXICAN_PHOTOS.canon_sumidero },
        { nombre: "Cerro de la Bufa", descripcion: "Mirador emblemático con teleférico y museo de la Toma de Zacatecas.", imagen: MEXICAN_PHOTOS.barrancas_cobre },
        { nombre: "Templo de Guadalupe", descripcion: "Museo virreinal con colección de pinturas coloniales.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Acueducto de Zacatecas", descripcion: "Construcción colonial que cruza la ciudad entre cerros.", imagen: MEXICAN_PHOTOS.centro_cdmx }
      ],
      pueblosMagicos: [
        { nombre: "Jerez de García Salinas", descripcion: "Pueblo de poetas con teatro neoclásico y queso de tuna.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Sombrerete", descripcion: "Real de minas con conventos franciscanos del siglo XVI.", imagen: MEXICAN_PHOTOS.iglesia_colonial },
        { nombre: "Pinos", descripcion: "Pueblo minero con haciendas y templos de cantera rosa.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Nochistlán de Mejía", descripcion: "Sitio de la primera fundación de Guadalajara en 1532.", imagen: MEXICAN_PHOTOS.pueblo_colonial },
        { nombre: "Teúl de González Ortega", descripcion: "Pueblo prehispánico caxcán con zona arqueológica en el cerro.", imagen: MEXICAN_PHOTOS.chichen_itza }
      ],
      arqueologia: [
        { nombre: "La Quemada", descripcion: "Fortaleza prehispánica sobre un cerro con murallas y Salón de las Columnas.", imagen: MEXICAN_PHOTOS.teotihuacan },
        { nombre: "Altavista-Chalchihuites", descripcion: "Observatorio astronómico en el trópico de Cáncer.", imagen: MEXICAN_PHOTOS.chichen_itza },
        { nombre: "El Teúl", descripcion: "Zona arqueológica caxcán con templos y plataformas ceremoniales.", imagen: MEXICAN_PHOTOS.teotihuacan }
      ],
      playas: [],
      gastronomia: [
        { nombre: "Asado de boda zacatecano", descripcion: "Carne de cerdo en salsa roja de chiles secos con chocolate, platillo nupcial.", imagen: MEXICAN_PHOTOS.mole },
        { nombre: "Enchiladas zacatecanas", descripcion: "Enchiladas en salsa de chile guajillo con pollo y aguacate.", imagen: MEXICAN_PHOTOS.mole },
        { nombre: "Queso de tuna", descripcion: "Dulce artesanal de tuna cardona deshidratada del semidesierto.", imagen: MEXICAN_PHOTOS.artesanias },
        { nombre: "Mezcal zacatecano", descripcion: "Destilado de agave silvestre de las sierras.", imagen: MEXICAN_PHOTOS.paisaje_agave },
        { nombre: "Birria de res zacatecana", descripcion: "Carne de res en adobo de chiles secos horneada lentamente.", imagen: MEXICAN_PHOTOS.barbacoa }
      ],
      clima: "Semiseco templado (16°C promedio)"
    }
  }
};
