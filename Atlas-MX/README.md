# Atlas MX

Atlas interactivo de México con los 32 estados, información turística, pueblos y localidades, historia, gastronomía, municipios, fotografías reales y acceso a Google Maps.

## Ejecutar

```bash
npm install
npm run dev
```

Para compilar:

```bash
npm run check:data
npm run build
```

## Fotografías reales

Las fotografías se consultan en tiempo real desde **Wikipedia y Wikimedia Commons**, sin API key. El servicio usa búsqueda contextual por lugar + estado y caché en memoria. Si no encuentra una imagen verificable, muestra un placeholder neutro en lugar de una fotografía stock incorrecta.

No se extraen ni copian fotografías de Google Maps. Las fotos de Google Maps/Places requieren el uso de los servicios oficiales de Google y sus condiciones de atribución/facturación. Atlas MX integra Google Maps mediante mapa embebido y enlaces oficiales de búsqueda.

## Ficha tipo Google Maps

Al abrir un destino, localidad, sitio histórico o municipio se muestra:
- galería de fotografías reales de Wikipedia/Wikimedia Commons;
- mapa embebido de Google Maps;
- botón para abrir el lugar en Google Maps;
- acceso a hoteles cercanos;
- búsqueda de clima;
- búsqueda web complementaria.

## Cobertura

Los 32 estados contienen al menos 5 elementos visibles en cada sección principal: **Destinos, Pueblos y lugares, Historia y patrimonio, Cocina**. El comando `npm run check:data` valida automáticamente esa cobertura.

## Estructura relevante

- `src/data/states.js`: datos de los 32 estados.
- `src/data/tourismEnhancer.js`: normalización y validación de cobertura.
- `src/services/photoService.js`: Wikipedia/Wikimedia API.
- `src/hooks/useRealPhoto.js`: hooks para foto y galería.
- `src/components/RealPhoto.jsx`: imagen real reutilizable.
- `src/components/GoogleMapsModalV2.jsx`: ficha estilo Maps.
- `src/components/MunicipalityModalV2.jsx`: explorador municipal.
