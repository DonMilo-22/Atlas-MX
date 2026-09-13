import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import MexicoMap from './components/MexicoMap';
import MapControls from './components/MapControls';
import StatePanel from './components/StatePanelV2';
import Legend from './components/Legend';
import MunicipalityModal from './components/MunicipalityModalV2';
import GoogleMapsModal from './components/GoogleMapsModalV2';

export default function App() {
  const [selectedState, setSelectedState] = useState(null);
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showLabels, setShowLabels] = useState(true);
  const [isMunModalOpen, setIsMunModalOpen] = useState(false);
  const [mapsModal, setMapsModal] = useState({ isOpen: false, placeName: '', stateName: '', category: '' });

  const handleSelectState = useCallback((state) => setSelectedState(state), []);
  const handleZoomIn = useCallback(() => setZoom((prev) => Math.min(6.0, prev * 1.3)), []);
  const handleZoomOut = useCallback(() => setZoom((prev) => Math.max(0.8, prev * 0.77)), []);
  const handleReset = useCallback(() => { setZoom(1.0); setPan({ x: 0, y: 0 }); setSelectedState(null); }, []);
  const handleToggleLabels = useCallback(() => setShowLabels((prev) => !prev), []);
  const handleExploreState = useCallback(() => setIsMunModalOpen(true), []);
  const handleOpenLocationMap = useCallback((placeName, stateName, category) => {
    setMapsModal({ isOpen: true, placeName, stateName: stateName || selectedState?.nombre || '', category: category || 'Destino' });
  }, [selectedState]);
  const handleCloseLocationMap = useCallback(() => setMapsModal((prev) => ({ ...prev, isOpen: false })), []);

  return (
    <div className="atlas-app-container">
      <Header onSelectState={handleSelectState} selectedState={selectedState} />
      <main className="atlas-main">
        <section className="map-section" style={{ position: 'relative', width: '100%', height: '100%' }}>
          <MexicoMap selectedState={selectedState} onSelectState={handleSelectState} zoom={zoom} setZoom={setZoom} pan={pan} setPan={setPan} showLabels={showLabels} />
          <MapControls zoom={zoom} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onReset={handleReset} showLabels={showLabels} onToggleLabels={handleToggleLabels} />
          <Legend />
        </section>
        <StatePanel selectedState={selectedState} onSelectState={handleSelectState} onExploreState={handleExploreState} onOpenLocationMap={handleOpenLocationMap} />
      </main>
      {selectedState && <MunicipalityModal state={selectedState} isOpen={isMunModalOpen} onClose={() => setIsMunModalOpen(false)} onOpenLocationMap={handleOpenLocationMap} />}
      <GoogleMapsModal isOpen={mapsModal.isOpen} onClose={handleCloseLocationMap} placeName={mapsModal.placeName} stateName={mapsModal.stateName} category={mapsModal.category} />
    </div>
  );
}
