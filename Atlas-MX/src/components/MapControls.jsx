import React from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';

export default function MapControls({ zoom, onZoomIn, onZoomOut, onReset, canReset }) {
  return (
    <div className="map-controls" role="toolbar" aria-label="Controles del mapa">
      <button type="button" onClick={onZoomIn} title="Acercar (+)" aria-label="Acercar" disabled={zoom >= 6}><Plus size={17} /></button>
      <button type="button" onClick={onZoomOut} title="Alejar (-)" aria-label="Alejar" disabled={zoom <= 0.8}><Minus size={17} /></button>
      {canReset && <button type="button" onClick={onReset} title="Volver a todo México" aria-label="Volver a la vista de todo México"><RotateCcw size={16} /></button>}
    </div>
  );
}
