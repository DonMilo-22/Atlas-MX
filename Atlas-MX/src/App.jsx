import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { estado as getEstadoByCve } from '@webrek/mx-geo';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import MexicoMap from './components/MexicoMap';
import MapControls from './components/MapControls';
import StatePanel from './components/StatePanelV2';
import useFavorites from './hooks/useFavorites';
import { loadStateTourism, toPlace } from './data/tourism';

// Los modales se cargan bajo demanda: reducen el JavaScript inicial y se montan
// solo cuando se abren, de modo que siempre reciben el estado seleccionado actual.
const MunicipalityModal = lazy(() => import('./components/MunicipalityModalV2'));
const PlaceExplorer = lazy(() => import('./components/PlaceExplorer'));
const DestinationGuide = lazy(() => import('./components/DestinationGuide'));
const FavoritesDrawer = lazy(() => import('./components/FavoritesDrawer'));

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
  const [mapsModal, setMapsModal] = useState(null);
  // Un único panel abierto a la vez: 'municipios' | 'guia' | 'favoritos'. El explorador de lugares se abre encima.
  const [openTool, setOpenTool] = useState(null);
  const [guideCategory, setGuideCategory] = useState(null);
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

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
  const handleReset = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); setSelectedState(null); }, []);

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

  // options: { coords: {lat, lon} exactas, near: {lat, lon} de referencia, initialTab, placeId (Wikidata), image (Commons), wikiTitle, description }
  const handleOpenLocationMap = useCallback((placeName, stateName, category, options = {}) => {
    if (!placeName) return;
    setMapsModal({
      placeName,
      stateName: stateName || selectedState?.nombre || '',
      category: category || 'Destino',
      coords: options.coords || null,
      near: options.near || null,
      initialTab: options.initialTab || 'resumen',
      placeId: options.placeId || null,
      image: options.image || null,
      wikiTitle: options.wikiTitle || null,
      description: options.description || null
    });
  }, [selectedState]);
  const handleCloseLocationMap = useCallback(() => setMapsModal(null), []);

  // Abre un lugar del catálogo verificado (búsqueda, favoritos, destino del día).
  // Los platillos no tienen ubicación: se abren en la guía del estado, en su ficha.
  const handleOpenPlace = useCallback(function handleOpenPlace(place) {
    const state = getEstadoByCve(place.stateCode);
    if (state) setSelectedState(state);
    if (place.category === 'cocina') {
      setGuideCategory({ category: 'cocina', itemId: place.qid || place.id || null });
      setOpenTool('guia');
      return;
    }
    if (typeof place.lat !== 'number') {
      // Resultado del buscador: solo trae el id; la ficha completa está en los datos del estado.
      if (place.id && place.stateCode) {
        loadStateTourism(place.stateCode).then((data) => {
          const item = data?.categorias?.[place.category]?.find((entry) => entry.id === place.id);
          if (item && typeof item.lat === 'number') handleOpenPlace(toPlace(item, place.category, place.stateCode, place.stateName));
          else handleOpenLocationMap(place.name, place.stateName || state?.nombre, place.category);
        }).catch(() => handleOpenLocationMap(place.name, place.stateName || state?.nombre, place.category));
        return;
      }
      // Favoritos guardados con la versión anterior: sin coordenadas, se ubican por nombre.
      handleOpenLocationMap(place.name, place.stateName || state?.nombre, place.category);
      return;
    }
    handleOpenLocationMap(place.name, place.stateName || state?.nombre, place.tipo || place.category, {
      coords: { lat: place.lat, lon: place.lon }, placeId: place.id, image: place.imagen, wikiTitle: place.wiki, description: place.descripcion
    });
  }, [handleOpenLocationMap]);
  const openGuide = useCallback((category = null) => { setGuideCategory(category ? { category, itemId: null } : null); setOpenTool('guia'); }, []);

  const handleOpenFavorite = useCallback((favorite) => {
    closeTool();
    handleOpenPlace(favorite);
  }, [closeTool, handleOpenPlace]);


  return (
    <div className="atlas-app-container">
      <a className="skip-link" href="#panel-estado">Saltar a la información del estado</a>
      <Header
        onSelectState={handleSelectState}
        onOpenPlace={handleOpenPlace}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setOpenTool('favoritos')}
      />
      <main className="atlas-main">
        <section className="map-section" aria-label="Mapa interactivo de México">
          <MexicoMap selectedState={selectedState} onSelectState={handleSelectState} zoom={zoom} setZoom={setZoom} pan={pan} setPan={setPan} showLabels />
          <MapControls zoom={zoom} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onReset={handleReset} canReset={Boolean(selectedState || zoom !== 1 || pan.x || pan.y)} />
        </section>
        <StatePanel
          selectedState={selectedState}
          onSelectState={handleSelectState}
          onOpenPlace={handleOpenPlace}
          onExploreState={() => setOpenTool('municipios')}
          onOpenGuide={openGuide}
        />
      </main>

      <ErrorBoundary key={`${openTool}-${selectedState?.cve || ''}`} onReset={() => { setOpenTool(null); setMapsModal(null); }}>
      <Suspense fallback={<div className="lazy-modal-fallback" role="status" aria-live="polite">Cargando…</div>}>
        {openTool === 'municipios' && selectedState && <MunicipalityModal state={selectedState} isOpen onClose={closeTool} onOpenLocationMap={handleOpenLocationMap} />}
        {openTool === 'guia' && selectedState && <DestinationGuide key={selectedState.cve} state={selectedState} isOpen initialCategory={guideCategory?.category || null} initialItemId={guideCategory?.itemId || null} onClose={closeTool} onOpenPlace={handleOpenPlace} onOpenLocationMap={handleOpenLocationMap} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />}
        {openTool === 'favoritos' && <FavoritesDrawer isOpen favorites={favorites} onClose={closeTool} onOpenFavorite={handleOpenFavorite} onRemove={toggleFavorite} />}
      </Suspense>
      </ErrorBoundary>
      <ErrorBoundary key={`explorer-${mapsModal?.placeName || ''}`} onReset={() => setMapsModal(null)}>
      <Suspense fallback={<div className="lazy-modal-fallback" role="status" aria-live="polite">Cargando…</div>}>
        {mapsModal && <PlaceExplorer isOpen onClose={handleCloseLocationMap} placeName={mapsModal.placeName} stateName={mapsModal.stateName} category={mapsModal.category} coords={mapsModal.coords} near={mapsModal.near} initialTab={mapsModal.initialTab} placeId={mapsModal.placeId} image={mapsModal.image} wikiTitle={mapsModal.wikiTitle} description={mapsModal.description} />}
      </Suspense>
      </ErrorBoundary>
    </div>
  );
}
