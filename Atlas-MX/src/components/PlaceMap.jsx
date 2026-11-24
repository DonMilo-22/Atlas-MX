import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const CATEGORY_CLASS = { hoteles: 'poi-hotel', restaurantes: 'poi-food', atractivos: 'poi-sight' };

/**
 * Mapa interactivo de OpenStreetMap. Muestra el lugar y los puntos de interés de la
 * categoría activa; al tocar un punto se selecciona y su información aparece en el panel.
 */
export default function PlaceMap({ center, precise, title, pois = [], selectedId, onSelect }) {
  const nodeRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const markersRef = useRef(new Map());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Crear el mapa una sola vez.
  useEffect(() => {
    if (!nodeRef.current || mapRef.current) return undefined;
    const map = L.map(nodeRef.current, { zoomControl: true, attributionControl: true, scrollWheelZoom: true });
    // Mosaicos estándar de OpenStreetMap: sin API key, con la atribución que exige su política de uso.
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    // El modal termina de medir su tamaño después del primer pintado.
    const timer = window.setTimeout(() => { if (mapRef.current) map.invalidateSize(); }, 120);
    // Si el contenedor cambia de tamaño (rotar el teléfono, abrir el modal), recalcular mosaicos.
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { if (mapRef.current) map.invalidateSize({ animate: false }); }) : null;
    observer?.observe(nodeRef.current);
    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
      // Detener animaciones en curso antes de destruir el mapa (evita errores de Leaflet al cerrar).
      map.stop();
      map.off();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Centro y marcador principal.
  const mainRef = useRef(null);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !center) return;
    // Sin animación: un zoom animado que sigue en curso al cerrar el mapa hace fallar a Leaflet.
    map.setView([center.lat, center.lon], precise ? 15 : 12, { animate: false });
    mainRef.current?.remove();
    const icon = L.divIcon({ className: 'place-pin', html: '<span></span>', iconSize: [26, 26], iconAnchor: [13, 26] });
    const group = L.layerGroup([L.marker([center.lat, center.lon], { icon, keyboard: false, title })]);
    // Ubicación aproximada: se dibuja un área en lugar de fingir un punto exacto.
    if (!precise) group.addLayer(L.circle([center.lat, center.lon], { radius: 2500, color: '#D1006B', weight: 1, fillOpacity: 0.05, dashArray: '4 6' }));
    mainRef.current = group.addTo(map);
  }, [center?.lat, center?.lon, precise, title]);

  // Puntos de interés.
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    markersRef.current.clear();
    pois.forEach((poi) => {
      const marker = L.circleMarker([poi.lat, poi.lon], { radius: 7, weight: 2, className: `poi-marker ${CATEGORY_CLASS[poi.category] || ''}` });
      marker.bindTooltip(poi.name, { direction: 'top', offset: [0, -6] });
      marker.on('click', () => onSelectRef.current?.(poi.id));
      marker.addTo(layer);
      markersRef.current.set(poi.id, marker);
    });
    const map = mapRef.current;
    if (map && pois.length && center) {
      const bounds = L.latLngBounds([[center.lat, center.lon], ...pois.slice(0, 15).map((poi) => [poi.lat, poi.lon])]);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16, animate: false });
    }
  }, [pois, center?.lat, center?.lon]);

  // Selección: resaltar y centrar.
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement();
      if (el) el.classList.toggle('is-selected', id === selectedId);
      marker.setRadius(id === selectedId ? 10 : 7);
      if (id === selectedId) marker.bringToFront();
    });
    const selected = markersRef.current.get(selectedId);
    if (selected && mapRef.current) {
      mapRef.current.panTo(selected.getLatLng(), { animate: true });
      selected.openTooltip();
    }
  }, [selectedId, pois]);

  return <div ref={nodeRef} className="place-map" role="region" aria-label={`Mapa de ${title}`} />;
}
