# 🇲🇽 Atlas MX

**Atlas MX** es una aplicación web interactiva diseñada para explorar la riqueza geográfica, cultural, histórica, turística y gastronómica de México.

El proyecto presenta un mapa interactivo de los **32 estados de la República Mexicana**, permitiendo seleccionar cada entidad y descubrir información relevante sobre sus principales destinos, pueblos y localidades, sitios históricos, gastronomía y municipios.

---

## 🗺️ Características

- 🇲🇽 Mapa interactivo de los **32 estados de México**
- 🔍 Selección y exploración individual de cada estado
- 🏛️ Sitios históricos y culturales
- 🌴 Destinos y atractivos turísticos
- 🏘️ Pueblos y localidades destacadas
- 🌮 Gastronomía típica de cada estado
- 🏖️ Playas y atractivos naturales
- 📍 Exploración de municipios
- 🖼️ Fotografías reales obtenidas mediante Wikipedia y Wikimedia Commons
- 🗺️ Integración con Google Maps
- 🏨 Búsqueda de hoteles cercanos
- 🌤️ Acceso a información climática
- 🔎 Enlaces para ampliar información de cada lugar
- ✨ Interfaz interactiva inspirada en atlas geográficos

---

## 🖥️ Vista general

Atlas MX utiliza un mapa SVG interactivo basado en información geográfica de México. Al seleccionar un estado, la aplicación muestra un panel con información turística organizada en diferentes categorías.

Los municipios también pueden explorarse individualmente mediante una ventana inspirada en Google Maps, desde donde es posible consultar fotografías, ubicación y servicios relacionados.

---

## 🛠️ Tecnologías utilizadas

- **React**
- **Vite**
- **JavaScript**
- **CSS**
- **SVG**
- **Lucide React**
- **@webrek/mx-geo**
- **Wikipedia API**
- **Wikimedia Commons API**
- **Google Maps**

---

## 📂 Estructura del proyecto

```text
Atlas-MX/
├── public/
├── scripts/
├── src/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

---

## 🚀 Instalación

Para ejecutar el proyecto de manera local necesitas tener instalado **Node.js**.

Clona el repositorio:

```bash
git clone https://github.com/DonMilo-22/Atlas-MX.git
```

Entra a la carpeta:

```bash
cd Atlas-MX
```

Instala las dependencias:

```bash
npm install
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Vite mostrará una dirección local desde la cual podrás abrir Atlas MX en el navegador.

---

## 🏗️ Compilar el proyecto

Para generar la versión de producción:

```bash
npm run build
```

Los archivos compilados se generarán dentro de:

```text
dist/
```

Para comprobar localmente la versión de producción:

```bash
npm run preview
```

---

## 📊 Validación de datos

Atlas MX incluye un script para comprobar que la información turística principal de los estados esté correctamente estructurada.

Puedes ejecutarlo con:

```bash
npm run check:data
```

---

## 📸 Fotografías

Las fotografías de destinos y lugares son consultadas dinámicamente utilizando fuentes públicas como:

- Wikipedia
- Wikimedia Commons

Cuando no se encuentra una fotografía adecuada para un lugar determinado, la aplicación utiliza un marcador visual en lugar de mostrar una imagen que no corresponda al sitio.

---

## 🗺️ Información geográfica

La representación territorial de México utiliza datos proporcionados por la librería `@webrek/mx-geo`, incluyendo información geográfica de estados y municipios.

La aplicación utiliza estos datos para construir el mapa SVG interactivo y permitir la navegación territorial.

---

## 🌐 Despliegue

El proyecto está preparado para ser desplegado utilizando **Vercel**.

Configuración principal:

```text
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

---

## 🎯 Objetivo del proyecto

Atlas MX busca ofrecer una manera visual e interactiva de conocer México, combinando información territorial con elementos turísticos, culturales, históricos y gastronómicos.

El proyecto fue desarrollado con fines **educativos y de divulgación turística**.

---

## 👨‍💻 Autor

Desarrollado por **Emiliano Guzmán**.

Proyecto académico — Ingeniería en Sistemas Computacionales.

---

## 📄 Licencia

Este proyecto fue desarrollado principalmente con fines educativos.

Los datos, fotografías y servicios externos utilizados pertenecen a sus respectivos autores y proveedores y están sujetos a sus propias condiciones de uso.
