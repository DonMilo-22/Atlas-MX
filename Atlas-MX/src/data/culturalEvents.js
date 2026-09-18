export const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const RAW_EVENTS = [
  ['01',4,'Feria Nacional de San Marcos','Aguascalientes','Feria y cultura popular'],
  ['02',8,'Fiestas de la Vendimia','Valle de Guadalupe','Vino y gastronomía'],
  ['03',2,'Carnaval de La Paz','La Paz','Carnaval costero'],
  ['04',2,'Carnaval de Campeche','San Francisco de Campeche','Carnaval histórico'],
  ['05',8,'Feria de la Uva y el Vino','Parras','Tradición vitivinícola'],
  ['06',2,'Fiestas Charrotaurinas','Villa de Álvarez','Tradición regional'],
  ['07',1,'Fiesta Grande de Chiapa de Corzo','Chiapa de Corzo','Parachicos y tradición'],
  ['08',10,'Festival Internacional Chihuahua','Chihuahua','Arte y espectáculos'],
  ['09',11,'Celebraciones de Día de Muertos','Ciudad de México','Ofrendas y cultura comunitaria'],
  ['10',7,'Feria Nacional de Durango','Victoria de Durango','Feria estatal'],
  ['11',10,'Festival Internacional Cervantino','Guanajuato','Artes escénicas'],
  ['12',4,'Semana Santa en Taxco','Taxco','Tradición religiosa'],
  ['13',10,'Feria de San Francisco','Pachuca','Feria y cultura popular'],
  ['14',9,'Encuentro Internacional del Mariachi','Guadalajara','Música mexicana'],
  ['15',3,'Festival del Quinto Sol','Diversos municipios','Equinoccio y culturas originarias'],
  ['16',11,'Noche de Muertos','Región de Pátzcuaro','Memoria y ofrendas'],
  ['17',2,'Carnavales de Chinelos','Tepoztlán y Tlayacapan','Danza y música'],
  ['18',3,'Feria Nayarit','Tepic','Feria estatal'],
  ['19',9,'Festival Internacional Santa Lucía','Monterrey','Arte en espacios públicos'],
  ['20',7,'Guelaguetza','Oaxaca de Juárez','Danza y reciprocidad comunitaria'],
  ['21',5,'Feria de Puebla','Puebla','Feria, historia y espectáculos'],
  ['22',9,'Hay Festival Querétaro','Santiago de Querétaro','Ideas, literatura y conversación'],
  ['23',5,'Travesía Sagrada Maya','Riviera Maya y Cozumel','Recreación histórica maya'],
  ['24',8,'Feria Nacional Potosina','San Luis Potosí','Feria estatal'],
  ['25',2,'Carnaval Internacional de Mazatlán','Mazatlán','Música y desfiles'],
  ['26',1,'Festival Alfonso Ortiz Tirado','Álamos','Música y canto operístico'],
  ['27',4,'Feria Tabasco','Villahermosa','Identidad y exposición estatal'],
  ['28',10,'Festival Internacional de la Costa del Seno Mexicano','Diversas ciudades','Música y artes escénicas'],
  ['29',8,'La Noche que Nadie Duerme','Huamantla','Tapetes y tradición religiosa'],
  ['30',3,'Cumbre Tajín','Papantla','Cultura totonaca'],
  ['31',1,'Mérida Fest','Mérida','Aniversario, música y artes'],
  ['32',8,'Morismas de Bracho','Zacatecas','Representación histórica comunitaria']
];

export const CULTURAL_EVENTS = RAW_EVENTS.map(([stateCode, month, name, location, theme]) => ({ stateCode, month, name, location, theme }));
