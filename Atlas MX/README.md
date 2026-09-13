# Atlas MX — Explorador Geográfico de México

Atlas geográfico e interactivo de los 32 estados de la República Mexicana, desarrollado con **React**, **Vite** y **`@webrek/mx-geo`**. Diseñado para proyectos educativos, turísticos y de análisis territorial con una estética tecnológica moderna y oscura.

---

## 🚀 Características Principales

- **Mapa SVG 100% Vectorial e Interactivo:** Geometrías precisas de los 32 estados obtenidas directamente del Marco Geoestadístico de INEGI mediante `@webrek/mx-geo`.
- **Interacción Fluida:**
  - *Hover* suave con resaltado luminoso y tarjeta flotante (tooltip) con datos clave.
  - *Selección por clic* con halo de resplandor cian y activación del panel lateral.
- **Buscador Predictivo Sincronizado:** Permite localizar cualquier estado por nombre, clave oficial INEGI ("09", "14"), abreviatura o alias.
- **Controles de Zoom y Pan:**
  - Acercar `[ + ]` y Alejar `[ − ]` con control de escala.
  - Arrastre táctil/ratón (pan) y zoom con la rueda.
  - Botón `[ Reiniciar ]` para volver a la escala inicial 1.0x y limpiar la selección.
  - Conmutador de etiquetas de abreviaturas.
- **Panel Lateral Informativo:** Muestra capital, región (Banxico), población oficial del Censo 2020, superficie territorial en km², huso horario oficial y estados colindantes interactivos.
- **Arquitectura para Turismo:** Secciones estructuradas para Destinos, Pueblos Mágicos, Zonas Arqueológicas y Gastronomía.
- **Navegación Municipal Integrada:** Botón *"Explorar estado"* que despliega la división de municipios usando `@webrek/mx-geo/municipios`.

---

## 🛠️ Tecnologías

- **React 19**
- **Vite 6**
- **`@webrek/mx-geo` (0.9.1)** — Geometrías TopoJSON oficiales, catálogo INEGI y componente municipal.
- **d3-geo** — Proyecciones cartográficas Mercator adaptadas a México.
- **topojson-client** — Decodificación de topologías vectoriales.
- **Lucide React** — Iconografía tecnológica.
- **Vanilla CSS** — Sistema de diseño propio con variables, glassmorphism y efectos de iluminación.

---

## 📦 Instalación y Ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en modo de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

3. **Compilar para producción:**
   ```bash
   npm run build
   ```

4. **Previsualizar compilación de producción:**
   ```bash
   npm run preview
   ```

---

## 📁 Estructura del Proyecto

```text
atlas-mx/
├── package.json
├── index.html
├── vite.config.js
├── README.md
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles/
    │   └── main.css
    ├── components/
    │   ├── Header.jsx           # Barra superior con logo, buscador e indicador de estados
    │   ├── MexicoMap.jsx        # Mapa SVG interactivo con zoom, pan, hover y selección
    │   ├── MapControls.jsx      # Controles de navegación cartográfica
    │   ├── SearchState.jsx      # Buscador con autocompletado en vivo
    │   ├── StatePanel.jsx       # Panel lateral de datos geográficos y turismo
    │   ├── Legend.jsx           # Leyenda informativa y capas
    │   └── MunicipalityModal.jsx # Explorador municipal a demanda
    ├── data/
    │   └── states.js            # Base de datos turística y cultural estructurada
    └── utils/
        └── map.js               # Formateadores numéricos y paletas regionales
```

---

## 🗺️ Futura Evolución

La arquitectura modular está lista para escalar hacia:
1. **Fichas turísticas completas:** Carga de galerías fotográficas, clima en tiempo real y guías de viaje.
2. **Capas temáticas adicionales:** Conmutar entre división política, regiones económicas, densidad demográfica y relieve topográfico.
3. **Exploración profunda de municipios:** Carga de datos socioeconómicos y atractivos por municipio mediante `@webrek/mx-geo/municipios`.
