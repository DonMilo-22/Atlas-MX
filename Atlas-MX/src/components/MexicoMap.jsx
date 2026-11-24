import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import { estadosTopoJSON, ESTADOS, CENTROIDES_ESTADOS, estado as getEstadoByCve } from '@webrek/mx-geo';
import { formatPopulation } from '../utils/map';
import { getFilterLabel, getStateCategoryStats } from '../data/tourismCategories';

const WIDTH = 960;
const HEIGHT = 640;
const MIN_ZOOM = 0.8;
const MAX_ZOOM = 6;
const DRAG_THRESHOLD = 5;
const clampZoom = (value) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));

// La geometría es estática: se calcula una sola vez para todas las instancias del mapa.
let geometryCache = null;
function getGeometry() {
  if (geometryCache) return geometryCache;
  const fc = feature(estadosTopoJSON, estadosTopoJSON.objects.estados);
  const projection = geoMercator().fitExtent([[34, 34], [WIDTH - 34, HEIGHT - 34]], fc);
  const path = geoPath(projection);
  const paths = {};
  const centroids = {};
  fc.features.forEach((f) => { paths[f.properties.cve] = path(f); });
  Object.entries(CENTROIDES_ESTADOS).forEach(([cve, lonLat]) => {
    const point = projection(lonLat);
    if (point) centroids[cve] = point;
  });
  geometryCache = { paths, centroids };
  return geometryCache;
}

export default function MexicoMap({ selectedState, onSelectState, zoom, setZoom, pan, setPan, showLabels, tourismFilter = 'todos', activeRoute, showTitle = true }) {
  const viewportRef = useRef(null);
  const svgRef = useRef(null);
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const suppressClick = useRef(false);
  const view = useRef({ zoom, pan });
  view.current = { zoom, pan };
  const [tip, setTip] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const { paths, centroids } = useMemo(getGeometry, []);

  // Convierte coordenadas de pantalla a coordenadas del viewBox del SVG.
  const toViewBox = useCallback((clientX, clientY) => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!ctm) return { x: WIDTH / 2, y: HEIGHT / 2, scale: 1 };
    return { x: (clientX - ctm.e) / ctm.a, y: (clientY - ctm.f) / ctm.d, scale: ctm.a };
  }, []);

  // Zoom manteniendo fijo el punto bajo el cursor / dedos.
  const zoomAround = useCallback((nextZoom, clientX, clientY) => {
    const { zoom: currentZoom, pan: currentPan } = view.current;
    const target = clampZoom(nextZoom);
    if (target === currentZoom) return;
    const point = toViewBox(clientX, clientY);
    const cx = WIDTH / 2;
    const cy = HEIGHT / 2;
    const modelX = (point.x - cx - currentPan.x) / currentZoom + cx;
    const modelY = (point.y - cy - currentPan.y) / currentZoom + cy;
    setZoom(target);
    setPan({ x: point.x - cx - (modelX - cx) * target, y: point.y - cy - (modelY - cy) * target });
  }, [setPan, setZoom, toViewBox]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return undefined;
    const onWheel = (event) => {
      event.preventDefault();
      const factor = event.deltaY < 0 ? 1.15 : 0.87;
      zoomAround(view.current.zoom * factor, event.clientX, event.clientY);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomAround]);

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    suppressClick.current = false;
    const list = [...pointers.current.values()];
    if (list.length === 1) {
      gesture.current = { type: 'pan', startX: event.clientX, startY: event.clientY, startPan: view.current.pan, moved: false };
    } else if (list.length === 2) {
      const [a, b] = list;
      gesture.current = { type: 'pinch', startDistance: Math.hypot(a.x - b.x, a.y - b.y) || 1, startZoom: view.current.zoom, moved: true };
      suppressClick.current = true;
    }
  };

  const handlePointerMove = (event) => {
    if (tip && viewportRef.current && event.pointerType === 'mouse') {
      const rect = viewportRef.current.getBoundingClientRect();
      setTip((current) => current && { ...current, x: event.clientX - rect.left, y: event.clientY - rect.top });
    }
    if (!pointers.current.has(event.pointerId) || !gesture.current) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const g = gesture.current;
    if (g.type === 'pan') {
      const dx = event.clientX - g.startX;
      const dy = event.clientY - g.startY;
      if (!g.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      if (!g.moved) {
        g.moved = true;
        setIsDragging(true);
        try { viewportRef.current?.setPointerCapture(event.pointerId); } catch { /* sin captura disponible */ }
      }
      const scale = toViewBox(0, 0).scale || 1;
      setPan({ x: g.startPan.x + dx / scale, y: g.startPan.y + dy / scale });
    } else if (g.type === 'pinch') {
      const [a, b] = [...pointers.current.values()];
      if (!a || !b) return;
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAround(g.startZoom * (distance / g.startDistance), (a.x + b.x) / 2, (a.y + b.y) / 2);
    }
  };

  const endPointer = (event) => {
    pointers.current.delete(event.pointerId);
    if (gesture.current?.moved) suppressClick.current = true;
    if (pointers.current.size === 0) {
      gesture.current = null;
      setIsDragging(false);
    } else if (pointers.current.size === 1) {
      const [remaining] = [...pointers.current.values()];
      gesture.current = { type: 'pan', startX: remaining.x, startY: remaining.y, startPan: view.current.pan, moved: true };
    }
  };

  const showTip = (cve, event) => {
    const state = getEstadoByCve(cve);
    if (!state || !viewportRef.current || gesture.current?.moved) return;
    const rect = viewportRef.current.getBoundingClientRect();
    setTip({ x: event.clientX - rect.left, y: event.clientY - rect.top, state });
  };

  const selectState = (cve) => {
    if (suppressClick.current) { suppressClick.current = false; return; }
    onSelectState?.(getEstadoByCve(cve));
  };

  const filterLabel = getFilterLabel(tourismFilter);
  const filtered = tourismFilter !== 'todos';
  const routePoints = (activeRoute?.stateCodes || []).map((code) => centroids[code]).filter(Boolean);
  const transform = `translate(${WIDTH / 2 + pan.x} ${HEIGHT / 2 + pan.y}) scale(${zoom}) translate(${-WIDTH / 2} ${-HEIGHT / 2})`;

  return (
    <div
      className={`map-viewport ${isDragging ? 'is-dragging' : ''}`}
      ref={viewportRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onPointerLeave={(event) => { if (event.pointerType === 'mouse') setTip(null); }}
    >
      {showTitle && <div className="map-title-card"><strong>República Mexicana</strong><span>{filtered ? `Capa: ${filterLabel}` : 'Mapa interactivo · INEGI'}</span></div>}
      {tip && <div className="map-tooltip-hud" style={{ left: tip.x, top: tip.y }}><strong>{tip.state.nombre}</strong><span>{tip.state.capital} · {formatPopulation(tip.state.poblacion)} hab.</span>{filtered && <span className="map-tooltip-category">{getStateCategoryStats(tip.state.cve)[tourismFilter] || 0} opciones de {filterLabel.toLocaleLowerCase('es-MX')}</span>}</div>}
      <svg ref={svgRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="map-svg" role="group" aria-label="Mapa de los 32 estados de México. Usa Tab para recorrer los estados y Enter para seleccionarlos.">
        <defs><filter id="glow"><feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#ef4444" floodOpacity=".5" /></filter></defs>
        <g transform={transform}>
          {ESTADOS.map((s) => {
            if (!paths[s.cve]) return null;
            const count = getStateCategoryStats(s.cve)[tourismFilter] || 0;
            const isSelected = selectedState?.cve === s.cve;
            const inRoute = activeRoute?.stateCodes?.includes(s.cve);
            const className = ['state-path', isSelected && 'state-selected', filtered && (count > 0 ? 'state-filter-match' : 'state-filter-muted'), inRoute && 'state-route'].filter(Boolean).join(' ');
            return (
              <path
                key={s.cve}
                d={paths[s.cve]}
                className={className}
                style={filtered ? { '--category-strength': Math.min(1, 0.32 + count * 0.11) } : undefined}
                filter={isSelected ? 'url(#glow)' : undefined}
                onPointerEnter={(event) => event.pointerType === 'mouse' && showTip(s.cve, event)}
                onPointerLeave={() => setTip(null)}
                onFocus={(event) => {
                  const rect = viewportRef.current?.getBoundingClientRect();
                  const box = event.currentTarget.getBoundingClientRect();
                  if (rect) setTip({ x: box.left + box.width / 2 - rect.left, y: box.top + box.height / 2 - rect.top, state: s });
                }}
                onBlur={() => setTip(null)}
                onClick={() => selectState(s.cve)}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`${s.nombre}${filtered ? `, ${count} opciones de ${filterLabel}` : ''}`}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelectState?.(getEstadoByCve(s.cve));
                  }
                }}
              />
            );
          })}
          {routePoints.length > 1 && <g className="tourist-route-layer" aria-hidden="true"><polyline points={routePoints.map((point) => point.join(',')).join(' ')} /><g>{routePoints.map((point) => <circle key={`${point[0]}-${point[1]}`} cx={point[0]} cy={point[1]} r="5" />)}</g></g>}
          {showLabels && ESTADOS.map((s) => {
            const pt = centroids[s.cve];
            if (!pt) return null;
            return <text key={s.cve} x={pt[0]} y={pt[1]} textAnchor="middle" dominantBaseline="middle" className={`state-label ${selectedState?.cve === s.cve ? 'selected' : ''}`} aria-hidden="true">{s.abreviatura}</text>;
          })}
        </g>
      </svg>
    </div>
  );
}
