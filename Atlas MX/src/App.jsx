import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import MexicoMap from './components/MexicoMap';
import MapControls from './components/MapControls';
import StatePanel from './components/StatePanel';
import Legend from './components/Legend';
import MunicipalityModal from './components/MunicipalityModal';
import GoogleMapsModal from './components/GoogleMapsModal';

export default function App() {
  const [selectedState, setSelectedState] = useState(null);
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showLabels, setShowLabels] = useState(true);
  const [isMunModalOpen, setIsMunModalOpen] = useState(false);

  // Estado para la sección interactiva de Google Maps
  const [mapsModal, setMapsModal] = useState({
    isOpen: false,
    placeName: '',
    stateName: '',
    category: ''
  });

  // Manejador de selección sincronizado para Mapa y Buscador
  const handleSelectState = useCallback((state) => {
    setSelectedState(state);
  }, []);

  // Controles de zoom
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(6.0, prev * 1.3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(0.8, prev * 0.77));
  }, []);

  // Botón Reiniciar: restaura zoom a 1x, centra la vista y limpia la selección
  const handleReset = useCallback(() => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
    setSelectedState(null);
  }, []);

  const handleToggleLabels = useCallback(() => {
    setShowLabels((prev) => !prev);
  }, []);

  const handleExploreState = useCallback(() => {
    setIsMunModalOpen(true);
  }, []);

  // Apertura de Google Maps para destinos, playas, pueblos mágicos y municipios
  const handleOpenLocationMap = useCallback((placeName, stateName, category) => {
    setMapsModal({
      isOpen: true,
      placeName,
      stateName: stateName || (selectedState ? selectedState.nombre : ''),
      category: category || 'Destino'
    });
  }, [selectedState]);

  const handleCloseLocationMap = useCallback(() => {
    setMapsModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <div className="atlas-app-container">
      {/* Encabezado con título Atlas MX y buscador principal */}
      <Header
        onSelectState={handleSelectState}
        selectedState={selectedState}
      />

      {/* Cuerpo principal: Mapa de México + Panel Lateral */}
      <main className="atlas-main">
        {/* Sección del Mapa */}
        <section className="map-section" style={{ position: 'relative', width: '100%', height: '100%' }}>
          <MexicoMap
            selectedState={selectedState}
            onSelectState={handleSelectState}
            zoom={zoom}
            setZoom={setZoom}
            pan={pan}
            setPan={setPan}
            showLabels={showLabels}
          />

          {/* Controles de mapa flotantes: [+], [-], [Reiniciar] y etiquetas */}
          <MapControls
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onReset={handleReset}
            showLabels={showLabels}
            onToggleLabels={handleToggleLabels}
          />

          {/* Leyenda y capas cartográficas */}
          <Legend />
        </section>

        {/* Panel lateral: Información territorial, demografía y arquitectura turística */}
        <StatePanel
          selectedState={selectedState}
          onSelectState={handleSelectState}
          onExploreState={handleExploreState}
          onOpenLocationMap={handleOpenLocationMap}
        />
      </main>

      {/* Modal de navegación a nivel municipios */}
      {selectedState && (
        <MunicipalityModal
          state={selectedState}
          isOpen={isMunModalOpen}
          onClose={() => setIsMunModalOpen(false)}
          onOpenLocationMap={handleOpenLocationMap}
        />
      )}

      {/* Modal interactivo de Google Maps embebido */}
      <GoogleMapsModal
        isOpen={mapsModal.isOpen}
        onClose={handleCloseLocationMap}
        placeName={mapsModal.placeName}
        stateName={mapsModal.stateName}
        category={mapsModal.category}
      />
    </div>
  );
}
