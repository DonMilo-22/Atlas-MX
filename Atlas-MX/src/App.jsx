import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import MexicoMap from './components/MexicoMap';
import MapControls from './components/MapControls';
import StatePanel from './components/StatePanelV2';
import Legend from './components/Legend';
import MunicipalityModal from './components/MunicipalityModalV2';
import GoogleMapsModal from './components/GoogleMapsModalV2';
import TourismFilters from './components/TourismFilters';
import MapPlacePreview from './components/MapPlacePreview';
import FavoritesDrawer from './components/FavoritesDrawer';
import useFavorites from './hooks/useFavorites';
import { estado as getEstadoByCve } from '@webrek/mx-geo';
import TouristRoutesPanel from './components/TouristRoutesPanel';
import { TOURIST_ROUTES } from './data/touristRoutes';

export default function App() {
  const [selectedState, setSelectedState] = useState(null);
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showLabels, setShowLabels] = useState(true);
  const [isMunModalOpen, setIsMunModalOpen] = useState(false);
  const [mapsModal, setMapsModal] = useState({ isOpen: false, placeName: '', stateName: '', category: '' });
  const [tourismFilter, setTourismFilter] = useState('todos');
  const [previewPlace, setPreviewPlace] = useState(null);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [activeRoute, setActiveRoute] = useState(null);

  const handleSelectState = useCallback((state) => { setSelectedState(state); setPreviewPlace(null); }, []);
  const handleZoomIn = useCallback(() => setZoom((prev) => Math.min(6.0, prev * 1.3)), []);
  const handleZoomOut = useCallback(() => setZoom((prev) => Math.max(0.8, prev * 0.77)), []);
  const handleReset = useCallback(() => { setZoom(1.0); setPan({ x: 0, y: 0 }); setSelectedState(null); }, []);
  const handleToggleLabels = useCallback(() => setShowLabels((prev) => !prev), []);
  const handleExploreState = useCallback(() => setIsMunModalOpen(true), []);
  const handleOpenLocationMap = useCallback((placeName, stateName, category) => {
    setMapsModal({ isOpen: true, placeName, stateName: stateName || selectedState?.nombre || '', category: category || 'Destino' });
  }, [selectedState]);
  const handlePreviewLocation = useCallback((placeName, stateName, category) => {
    if (!placeName) return setPreviewPlace(null);
    setPreviewPlace({ name: placeName, stateName, category });
  }, []);
  const handleCloseLocationMap = useCallback(() => setMapsModal((prev) => ({ ...prev, isOpen: false })), []);
  const handleOpenFavorite = useCallback((favorite) => {
    const state = getEstadoByCve(favorite.stateCode);
    if (state) setSelectedState(state);
    setFavoritesOpen(false);
    handleOpenLocationMap(favorite.name, favorite.stateName, favorite.category);
  }, [handleOpenLocationMap]);

  return (
    <div className="atlas-app-container">
      <Header onSelectState={handleSelectState} selectedState={selectedState} favoritesCount={favorites.length} onOpenFavorites={() => setFavoritesOpen(true)} onOpenRoutes={() => setActiveRoute((current) => current || TOURIST_ROUTES[0])} />
      <main className="atlas-main">
        <section className="map-section" style={{ position: 'relative', width: '100%', height: '100%' }}>
          <MexicoMap selectedState={selectedState} onSelectState={handleSelectState} zoom={zoom} setZoom={setZoom} pan={pan} setPan={setPan} showLabels={showLabels} tourismFilter={tourismFilter} activeRoute={activeRoute} />
          <TourismFilters activeFilter={tourismFilter} onChange={setTourismFilter} />
          <MapPlacePreview place={previewPlace} onClose={() => setPreviewPlace(null)} onOpen={() => handleOpenLocationMap(previewPlace?.name, previewPlace?.stateName, previewPlace?.category)} />
          <TouristRoutesPanel activeRoute={activeRoute} onSelectRoute={setActiveRoute} onSelectState={handleSelectState} onClose={() => setActiveRoute(null)} />
          <MapControls zoom={zoom} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onReset={handleReset} showLabels={showLabels} onToggleLabels={handleToggleLabels} />
          <Legend />
        </section>
        <StatePanel selectedState={selectedState} onSelectState={handleSelectState} onExploreState={handleExploreState} onOpenLocationMap={handleOpenLocationMap} onPreviewLocation={handlePreviewLocation} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />
      </main>
      {selectedState && <MunicipalityModal state={selectedState} isOpen={isMunModalOpen} onClose={() => setIsMunModalOpen(false)} onOpenLocationMap={handleOpenLocationMap} />}
      <GoogleMapsModal isOpen={mapsModal.isOpen} onClose={handleCloseLocationMap} placeName={mapsModal.placeName} stateName={mapsModal.stateName} category={mapsModal.category} />
      <FavoritesDrawer isOpen={favoritesOpen} favorites={favorites} onClose={() => setFavoritesOpen(false)} onOpenFavorite={handleOpenFavorite} onRemove={toggleFavorite} />
    </div>
  );
}
