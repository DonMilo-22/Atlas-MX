import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { estado as getEstadoByCve } from '@webrek/mx-geo';
import Header from './components/Header';
import MexicoMap from './components/MexicoMap';
import MapControls from './components/MapControls';
import StatePanel from './components/StatePanelV2';
import TourismFilters from './components/TourismFilters';
import TouristRoutesPanel from './components/TouristRoutesPanel';
import ExperienceDock from './components/ExperienceDock';
import Footer from './components/Footer';
import useFavorites from './hooks/useFavorites';
import usePassport from './hooks/usePassport';
import { TOURIST_ROUTES } from './data/touristRoutes';

// Los modales se cargan bajo demanda: reducen el JavaScript inicial y se montan
// solo cuando se abren, de modo que siempre reciben el estado seleccionado actual.
const MunicipalityModal = lazy(() => import('./components/MunicipalityModalV2'));
const GoogleMapsModal = lazy(() => import('./components/GoogleMapsModalV2'));
const FavoritesDrawer = lazy(() => import('./components/FavoritesDrawer'));
const PassportDrawer = lazy(() => import('./components/PassportDrawer'));
const TravelPlanner = lazy(() => import('./components/TravelPlanner'));
const StateComparisonModal = lazy(() => import('./components/StateComparisonModal'));
const DestinationQuiz = lazy(() => import('./components/DestinationQuiz'));
const CulturalCalendarModal = lazy(() => import('./components/CulturalCalendarModal'));
const AboutModal = lazy(() => import('./components/AboutModal'));

const MIN_ZOOM = 0.8;
const MAX_ZOOM = 6;

function readStateFromUrl() {
  if (typeof window === 'undefined') return null;
  const code = new URLSearchParams(window.location.search).get('estado');
  return code ? getEstadoByCve(code.padStart(2, '0')) || null : null;
}

export default function App() {
  const [selectedState, setSelectedState] = useState(readStateFromUrl);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showLabels, setShowLabels] = useState(true);
  const [tourismFilter, setTourismFilter] = useState('todos');
  const [activeRoute, setActiveRoute] = useState(null);
  const [mapsModal, setMapsModal] = useState(null);
  // Un único modal de herramienta abierto a la vez: 'municipios' | 'favoritos' | 'pasaporte' | 'planner' | 'comparar' | 'quiz' | 'agenda' | 'about'
  const [openTool, setOpenTool] = useState(null);
  const [plannerState, setPlannerState] = useState(null);
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { visitedStates, isVisited, toggleVisited } = usePassport();

  const closeTool = useCallback(() => setOpenTool(null), []);
  const handleSelectState = useCallback((state) => setSelectedState(state || null), []);

  // Sincroniza el estado seleccionado con la URL (?estado=20) para compartir enlaces y usar "Atrás".
  useEffect(() => {
    const url = new URL(window.location.href);
    const current = url.searchParams.get('estado');
    const next = selectedState?.cve || null;
    if (current === next) return;
    if (next) url.searchParams.set('estado', next); else url.searchParams.delete('estado');
    window.history.pushState({ estado: next }, '', url);
    document.title = selectedState ? `${selectedState.nombre} — Atlas MX` : 'Atlas MX — Explora México';
  }, [selectedState]);

  useEffect(() => {
    const onPopState = () => setSelectedState(readStateFromUrl());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleZoomIn = useCallback(() => setZoom((prev) => Math.min(MAX_ZOOM, prev * 1.3)), []);
  const handleZoomOut = useCallback(() => setZoom((prev) => Math.max(MIN_ZOOM, prev * 0.77)), []);
  const handleReset = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); setSelectedState(null); setTourismFilter('todos'); setActiveRoute(null); }, []);
  const handleToggleLabels = useCallback(() => setShowLabels((prev) => !prev), []);

  // Atajos de teclado del mapa: + / - / 0 (solo si no se está escribiendo ni hay un modal abierto).
  useEffect(() => {
    const onKey = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const tag = event.target?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || document.body.style.overflow === 'hidden') return;
      if (event.key === '+' || event.key === '=') handleZoomIn();
      else if (event.key === '-' || event.key === '_') handleZoomOut();
      else if (event.key === '0') { setZoom(1); setPan({ x: 0, y: 0 }); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleZoomIn, handleZoomOut]);

  const handleOpenLocationMap = useCallback((placeName, stateName, category) => {
    if (!placeName) return;
    setMapsModal({ placeName, stateName: stateName || selectedState?.nombre || '', category: category || 'Destino' });
  }, [selectedState]);
  const handleCloseLocationMap = useCallback(() => setMapsModal(null), []);

  const handleOpenPlace = useCallback((place) => {
    const state = getEstadoByCve(place.stateCode);
    if (state) setSelectedState(state);
    handleOpenLocationMap(place.name, place.stateName, place.category === 'gastronomia' ? 'Gastronomía' : place.category);
  }, [handleOpenLocationMap]);

  const handleOpenFavorite = useCallback((favorite) => {
    closeTool();
    handleOpenPlace(favorite);
  }, [closeTool, handleOpenPlace]);

  const selectAndClose = useCallback((state) => { handleSelectState(state); closeTool(); }, [closeTool, handleSelectState]);
  const openPlanner = useCallback((state) => { setPlannerState(state || selectedState); setOpenTool('planner'); }, [selectedState]);

  return (
    <div className="atlas-app-container">
      <a className="skip-link" href="#panel-estado">Saltar a la información del estado</a>
      <Header
        onSelectState={handleSelectState}
        onOpenPlace={handleOpenPlace}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setOpenTool('favoritos')}
        onOpenRoutes={() => setActiveRoute((current) => current || TOURIST_ROUTES[0])}
        visitedCount={visitedStates.length}
        onOpenPassport={() => setOpenTool('pasaporte')}
      />
      <main className="atlas-main">
        <section className="map-section" aria-label="Mapa interactivo de México">
          <MexicoMap selectedState={selectedState} onSelectState={handleSelectState} zoom={zoom} setZoom={setZoom} pan={pan} setPan={setPan} showLabels={showLabels} tourismFilter={tourismFilter} activeRoute={activeRoute} />
          <TourismFilters activeFilter={tourismFilter} onChange={setTourismFilter} onOpenResult={handleOpenPlace} />
          <TouristRoutesPanel activeRoute={activeRoute} onSelectRoute={setActiveRoute} onSelectState={handleSelectState} onClose={() => setActiveRoute(null)} />
          <ExperienceDock onOpenPlanner={() => openPlanner()} onOpenCompare={() => setOpenTool('comparar')} onOpenQuiz={() => setOpenTool('quiz')} onOpenCalendar={() => setOpenTool('agenda')} />
          <MapControls zoom={zoom} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onReset={handleReset} showLabels={showLabels} onToggleLabels={handleToggleLabels} />
        </section>
        <StatePanel
          selectedState={selectedState}
          onSelectState={handleSelectState}
          onExploreState={() => setOpenTool('municipios')}
          onOpenLocationMap={handleOpenLocationMap}
          onPlanTrip={openPlanner}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          isVisited={isVisited}
          onToggleVisited={toggleVisited}
        />
      </main>
      <Footer onOpenAbout={() => setOpenTool('about')} />

      <Suspense fallback={<div className="lazy-modal-fallback" role="status" aria-live="polite">Cargando…</div>}>
        {openTool === 'municipios' && selectedState && <MunicipalityModal state={selectedState} isOpen onClose={closeTool} onOpenLocationMap={handleOpenLocationMap} />}
        {openTool === 'favoritos' && <FavoritesDrawer isOpen favorites={favorites} onClose={closeTool} onOpenFavorite={handleOpenFavorite} onRemove={toggleFavorite} />}
        {openTool === 'pasaporte' && <PassportDrawer isOpen visitedStates={visitedStates} onToggleVisited={toggleVisited} onSelectState={selectAndClose} onClose={closeTool} />}
        {openTool === 'planner' && <TravelPlanner isOpen initialState={plannerState} onClose={closeTool} onOpenLocation={handleOpenLocationMap} />}
        {openTool === 'comparar' && <StateComparisonModal isOpen initialState={selectedState} onClose={closeTool} onSelectState={selectAndClose} />}
        {openTool === 'quiz' && <DestinationQuiz isOpen onClose={closeTool} onSelectState={selectAndClose} />}
        {openTool === 'agenda' && <CulturalCalendarModal isOpen onClose={closeTool} onSelectState={selectAndClose} />}
        {openTool === 'about' && <AboutModal isOpen onClose={closeTool} />}
        {mapsModal && <GoogleMapsModal isOpen onClose={handleCloseLocationMap} placeName={mapsModal.placeName} stateName={mapsModal.stateName} category={mapsModal.category} />}
      </Suspense>
    </div>
  );
}
