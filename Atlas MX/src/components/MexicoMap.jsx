import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import { estadosTopoJSON, ESTADOS, CENTROIDES_ESTADOS, estado as getEstadoByCve } from '@webrek/mx-geo';
import { Compass } from 'lucide-react';
import { formatPopulation, getRegionInfo } from '../utils/map';

const WIDTH = 960;
const HEIGHT = 640;

export default function MexicoMap({
  selectedState,
  onSelectState,
  zoom,
  setZoom,
  pan,
  setPan,
  showLabels,
  onHoverStateChange
}) {
  const [hoveredCve, setHoveredCve] = useState(null);
  const [tooltip, setTooltip] = useState(null); // { x, y, state }
  const [coords, setCoords] = useState({ lon: -102.5, lat: 23.6 });
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startPan = useRef({ x: 0, y: 0 });

  // 1. Proyección geoespacial Mercator sobre las geometrías oficiales de INEGI
  const { paths, boundsMap, centroids } = useMemo(() => {
    const fc = feature(estadosTopoJSON, estadosTopoJSON.objects.estados);
    const projection = geoMercator().fitExtent(
      [
        [36, 36],
        [WIDTH - 36, HEIGHT - 36]
      ],
      fc
    );
    const pathGen = geoPath(projection);

    const pathsMap = {};
    const bMap = {};
    const cMap = {};

    fc.features.forEach((feat) => {
      const cve = feat.properties.cve;
      pathsMap[cve] = pathGen(feat);
      bMap[cve] = pathGen.bounds(feat);
    });

    // Proyectar centroides
    for (const [cve, lonlat] of Object.entries(CENTROIDES_ESTADOS)) {
      const pt = projection(lonlat);
      if (pt) cMap[cve] = pt;
    }

    return { paths: pathsMap, boundsMap: bMap, centroids: cMap };
  }, []);

  // Manejo de zoom con la rueda del ratón
  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      setZoom((prev) => {
        const next = Math.max(0.8, Math.min(6.0, prev * zoomFactor));
        return next;
      });
    },
    [setZoom]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Arrastre del mapa (Pan)
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // solo click izquierdo
    isDragging.current = true;
    startPan.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      setPan({
        x: e.clientX - startPan.current.x,
        y: e.clientY - startPan.current.y
      });
    }

    // Actualizar coordenadas HUD simuladas según posición en el mapa
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width;
      const normY = (e.clientY - rect.top) / rect.height;
      const lon = -118 + normX * 32;
      const lat = 32 - normY * 18;
      setCoords({ lon: lon.toFixed(2), lat: lat.toFixed(2) });
    }

    // Actualizar posición del tooltip si hay hover
    if (tooltip && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltip((prev) =>
        prev
          ? {
              ...prev,
              x: e.clientX - rect.left,
              y: e.clientY - rect.top
            }
          : null
      );
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleStateMouseEnter = (cve, e) => {
    setHoveredCve(cve);
    const st = getEstadoByCve(cve);
    if (st && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltip({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        state: st
      });
      if (onHoverStateChange) onHoverStateChange(st);
    }
  };

  const handleStateMouseLeave = (cve) => {
    if (hoveredCve === cve) {
      setHoveredCve(null);
      setTooltip(null);
      if (onHoverStateChange) onHoverStateChange(null);
    }
  };

  const handleStateClick = (cve) => {
    const st = getEstadoByCve(cve);
    if (st) {
      onSelectState(st);
    }
  };

  return (
    <div
      className="map-viewport"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        handleMouseUp();
        setTooltip(null);
        setHoveredCve(null);
      }}
      role="region"
      aria-label="Mapa interactivo de la República Mexicana"
    >
      {/* Rosa de los vientos tradicional mexicana */}
      <div className="compass-rose" aria-hidden="true">
        <svg width="76" height="76" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="#ba9c7d" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="36" fill="none" stroke="#dfd3c1" strokeWidth="0.8" />
          <circle cx="50" cy="50" r="4" fill="#6b3513" />
          <line x1="50" y1="6" x2="50" y2="94" stroke="#ba9c7d" strokeWidth="1" />
          <line x1="6" y1="50" x2="94" y2="50" stroke="#ba9c7d" strokeWidth="1" />
          {/* Norte Verde Patrio */}
          <polygon points="50,10 54,46 50,42 46,46" fill="#006847" />
          {/* Sur Rojo Carmín */}
          <polygon points="50,90 54,54 50,58 46,54" fill="#ce1126" />
          {/* Este y Oeste Terracota */}
          <polygon points="90,50 54,54 58,50 54,46" fill="#b45309" />
          <polygon points="10,50 46,54 42,50 46,46" fill="#b45309" />
          <text x="50" y="8" fill="#006847" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="var(--font-display)">N</text>
        </svg>
      </div>

      {/* Coordenadas HUD cartográficas */}
      <div className="hud-coordinates">
        <span>LON: {coords.lon}° W</span>
        <span>LAT: {coords.lat}° N</span>
        <span>PROYECCIÓN: MERCATOR (INEGI)</span>
      </div>

      {/* Tooltip flotante interactivo */}
      {tooltip && tooltip.state && (
        <div
          className="map-tooltip-hud"
          style={{ left: tooltip.x, top: tooltip.y }}
          role="tooltip"
        >
          <div className="tooltip-title">
            <span>{tooltip.state.nombre}</span>
            <span className="tooltip-cve">{tooltip.state.iso}</span>
          </div>
          <div className="tooltip-detail">
            Capital: <strong style={{ color: 'var(--mexico-brown)' }}>{tooltip.state.capital}</strong> • Región: {getRegionInfo(tooltip.state.region).name}
          </div>
          <div className="tooltip-detail" style={{ fontSize: '0.74rem', color: 'var(--mexico-green)', fontWeight: 600, marginTop: '2px' }}>
            Población: {formatPopulation(tooltip.state.poblacion)}
          </div>
        </div>
      )}

      {/* Contenedor SVG con transformaciones de Zoom y Pan */}
      <div className="map-svg-container">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="map-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Filtro de resplandor cálido para estado seleccionado */}
            <filter id="warmGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#ce1126" floodOpacity="0.4" />
            </filter>

            {/* Sombra de relieve sutil */}
            <filter id="reliefShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="1" dy="3" stdDeviation="3" floodColor="#4a301a" floodOpacity="0.15" />
            </filter>

            {/* Patrón de cuadrícula de paralelos y meridianos */}
            <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(180, 150, 120, 0.08)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Capa de fondo con cuadrícula */}
          <rect width={WIDTH} height={HEIGHT} fill="url(#grid)" pointerEvents="none" />

          {/* Grupo principal escalado y desplazado */}
          <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
            {/* 1. Dibujar todos los estados no seleccionados primero */}
            {ESTADOS.map((st) => {
              const d = paths[st.cve];
              if (!d) return null;
              const isSelected = selectedState?.cve === st.cve;
              if (isSelected) return null; // se renderiza en la capa superior

              return (
                <path
                  key={st.cve}
                  id={st.iso}
                  data-cve={st.cve}
                  d={d}
                  className="state-path state-normal"
                  tabIndex={0}
                  role="button"
                  aria-label={`${st.nombreCorto}, Capital: ${st.capital}`}
                  onMouseEnter={(e) => handleStateMouseEnter(st.cve, e)}
                  onMouseMove={(e) => handleStateMouseEnter(st.cve, e)}
                  onMouseLeave={() => handleStateMouseLeave(st.cve)}
                  onClick={() => handleStateClick(st.cve)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleStateClick(st.cve);
                    }
                  }}
                />
              );
            })}

            {/* 2. Dibujar el estado seleccionado en la capa superior con glow y elevación */}
            {selectedState && paths[selectedState.cve] && (
              <path
                id={`selected-${selectedState.iso}`}
                data-cve={selectedState.cve}
                d={paths[selectedState.cve]}
                className="state-path state-selected"
                filter="url(#warmGlow)"
                tabIndex={0}
                role="button"
                aria-label={`Seleccionado: ${selectedState.nombre}`}
                onClick={() => handleStateClick(selectedState.cve)}
              />
            )}

            {/* 3. Etiquetas tipográficas de los estados (opcionales o activables) */}
            {showLabels &&
              ESTADOS.map((st) => {
                const pt = centroids[st.cve];
                if (!pt) return null;
                const isSelected = selectedState?.cve === st.cve;
                return (
                  <text
                    key={`label-${st.cve}`}
                    x={pt[0]}
                    y={pt[1]}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={isSelected ? 10 : 8}
                    fontWeight={isSelected ? 700 : 600}
                    fill={isSelected ? '#ffffff' : '#3d281a'}
                    style={{
                      pointerEvents: 'none',
                      userSelect: 'none',
                      textShadow: isSelected 
                        ? '0 1px 4px rgba(0,0,0,0.8)' 
                        : '0 0 3px #ffffff, 0 0 3px #ffffff, 0 0 4px #faf6f0'
                    }}
                  >
                    {st.abreviatura}
                  </text>
                );
              })}
          </g>
        </svg>
      </div>
    </div>
  );
}
