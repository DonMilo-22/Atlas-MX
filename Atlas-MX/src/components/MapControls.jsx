import React from 'react';
import { Minus, Plus, RotateCcw, Tags } from 'lucide-react';

export default function MapControls({ zoom, onZoomIn, onZoomOut, onReset, showLabels, onToggleLabels }) {
  return (
    <div className="map-controls" role="toolbar" aria-label="Controles del mapa">
      <button type="button" onClick={onZoomIn} title="Acercar (+)" aria-label="Acercar"><Plus size={18} /></button>
      <button type="button" onClick={onZoomOut} title="Alejar (-)" aria-label="Alejar"><Minus size={18} /></button>
      <button type="button" onClick={onReset} title="Reiniciar vista" aria-label="Reiniciar vista y selección"><RotateCcw size={17} /></button>
      <button type="button" className={showLabels ? 'active' : ''} onClick={onToggleLabels} title="Mostrar u ocultar abreviaturas" aria-label="Mostrar abreviaturas de los estados" aria-pressed={showLabels}><Tags size={17} /></button>
      <span aria-live="polite" aria-label={`Zoom ${zoom.toFixed(1)} aumentos`}>{zoom.toFixed(1)}×</span>
    </div>
  );
}
