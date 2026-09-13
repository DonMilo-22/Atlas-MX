import React from 'react';
import { Plus, Minus, RotateCcw, Tag } from 'lucide-react';

export default function MapControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  showLabels,
  onToggleLabels
}) {
  return (
    <div className="map-controls-group" role="toolbar" aria-label="Controles del mapa">
      <button
        type="button"
        className="control-btn"
        onClick={onZoomIn}
        title="Acercar mapa (+)"
        aria-label="Acercar mapa"
      >
        <Plus size={18} />
      </button>

      <button
        type="button"
        className="control-btn"
        onClick={onZoomOut}
        title="Alejar mapa (−)"
        aria-label="Alejar mapa"
      >
        <Minus size={18} />
      </button>

      <div className="zoom-indicator" title="Nivel de magnificación">
        {zoom.toFixed(1)}x
      </div>

      <button
        type="button"
        className={`control-btn ${showLabels ? 'active' : ''}`}
        onClick={onToggleLabels}
        title="Alternar nombres de estados"
        aria-label="Alternar nombres de estados"
      >
        <Tag size={16} />
      </button>

      <button
        type="button"
        className="control-btn btn-reset"
        onClick={onReset}
        title="Reiniciar zoom y vista general"
        aria-label="Reiniciar zoom y deseleccionar estado"
      >
        <RotateCcw size={14} />
        <span>Reiniciar</span>
      </button>
    </div>
  );
}
