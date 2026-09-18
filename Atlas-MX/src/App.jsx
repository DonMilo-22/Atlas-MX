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
import PassportDrawer from './components/PassportDrawer';
import usePassport from './hooks/usePassport';
import ExperienceDock from './components/ExperienceDock';
import TravelPlanner from './components/TravelPlanner';
import StateComparisonModal from './components/StateComparisonModal';
import DestinationQuiz from './components/DestinationQuiz';
import GastronomyMapModal from './components/GastronomyMapModal';
import CulturalCalendarModal from './components/CulturalCalendarModal';

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
  const [passportOpen, setPassportOpen] = useState(false);
  const { visitedStates, isVisited, toggleVisited } = usePassport();
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [foodOpen, setFoodOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

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
  const handleOpenTourismResult = useCallback((result) => {
    const state = getEstadoByCve(result.stateCode);
    if (state) setSelectedState(state);
    handleOpenLocationMap(result.name, result.stateName, result.category === 'gastronomia' ? 'Gastronomía' : result.category);
  }, [handleOpenLocationMap]);
  const handleOpenFavorite = useCallback((favorite) => {
    const state = getEstadoByCve(favorite.stateCode);
    if (state) setSelectedState(state);
    setFavoritesOpen(false);
    handleOpenLocationMap(favorite.name, favorite.stateName, favorite.category);
  }, [handleOpenLocationMap]);

  return (
    <div className="atlas-app-container">
      <Header onSelectState={handleSelectState} selectedState={selectedState} favoritesCount={favorites.length} onOpenFavorites={() => setFavoritesOpen(true)} onOpenRoutes={() => setActiveRoute((current) => current || TOURIST_ROUTES[0])} visitedCount={visitedStates.length} onOpenPassport={() => setPassportOpen(true)} />
      <main className="atlas-main">
        <section className="map-section" style={{ position: 'relative', width: '100%', height: '100%' }}>
          <MexicoMap selectedState={selectedState} onSelectState={handleSelectState} zoom={zoom} setZoom={setZoom} pan={pan} setPan={setPan} showLabels={showLabels} tourismFilter={tourismFilter} activeRoute={activeRoute} />
          <TourismFilters activeFilter={tourismFilter} onChange={setTourismFilter} onOpenResult={handleOpenTourismResult} />
          <MapPlacePreview place={previewPlace} onClose={() => setPreviewPlace(null)} onOpen={() => handleOpenLocationMap(previewPlace?.name, previewPlace?.stateName, previewPlace?.category)} />
          <TouristRoutesPanel activeRoute={activeRoute} onSelectRoute={setActiveRoute} onSelectState={handleSelectState} onClose={() => setActiveRoute(null)} />
          <ExperienceDock onOpenPlanner={() => setPlannerOpen(true)} onOpenCompare={() => setCompareOpen(true)} onOpenQuiz={() => setQuizOpen(true)} onOpenFood={() => setFoodOpen(true)} onOpenCalendar={() => setCalendarOpen(true)} />
          <MapControls zoom={zoom} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onReset={handleReset} showLabels={showLabels} onToggleLabels={handleToggleLabels} />
          <Legend />
        </section>
        <StatePanel selectedState={selectedState} onSelectState={handleSelectState} onExploreState={handleExploreState} onOpenLocationMap={handleOpenLocationMap} onPreviewLocation={handlePreviewLocation} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} isVisited={isVisited} onToggleVisited={toggleVisited} />
      </main>
      {selectedState && <MunicipalityModal state={selectedState} isOpen={isMunModalOpen} onClose={() => setIsMunModalOpen(false)} onOpenLocationMap={handleOpenLocationMap} />}
      <GoogleMapsModal isOpen={mapsModal.isOpen} onClose={handleCloseLocationMap} placeName={mapsModal.placeName} stateName={mapsModal.stateName} category={mapsModal.category} />
      <FavoritesDrawer isOpen={favoritesOpen} favorites={favorites} onClose={() => setFavoritesOpen(false)} onOpenFavorite={handleOpenFavorite} onRemove={toggleFavorite} />
      <PassportDrawer isOpen={passportOpen} visitedStates={visitedStates} onToggleVisited={toggleVisited} onSelectState={(state) => { handleSelectState(state); setPassportOpen(false); }} onClose={() => setPassportOpen(false)} />
      <TravelPlanner isOpen={plannerOpen} initialState={selectedState} onClose={() => setPlannerOpen(false)} onOpenLocation={handleOpenLocationMap} />
      <StateComparisonModal isOpen={compareOpen} initialState={selectedState} onClose={() => setCompareOpen(false)} onSelectState={(state) => { handleSelectState(state); setCompareOpen(false); }} />
      <DestinationQuiz isOpen={quizOpen} onClose={() => setQuizOpen(false)} onSelectState={(state) => { handleSelectState(state); setQuizOpen(false); }} />
      <GastronomyMapModal isOpen={foodOpen} initialState={selectedState} onClose={() => setFoodOpen(false)} onOpenLocation={handleOpenLocationMap} />
      <CulturalCalendarModal isOpen={calendarOpen} onClose={() => setCalendarOpen(false)} onSelectState={(state) => { handleSelectState(state); setCalendarOpen(false); }} />
    </div>
  );
}
