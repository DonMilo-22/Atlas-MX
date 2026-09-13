import React from 'react';
import { Plus, Minus, RotateCcw, Tags } from 'lucide-react';
export default function MapControls({zoom,onZoomIn,onZoomOut,onReset,showLabels,onToggleLabels}){
 return <div className="map-controls" aria-label="Controles del mapa">
  <button onClick={onZoomIn} title="Acercar"><Plus size={18}/></button><button onClick={onZoomOut} title="Alejar"><Minus size={18}/></button><button onClick={onReset} title="Reiniciar"><RotateCcw size={17}/></button><button className={showLabels?'active':''} onClick={onToggleLabels} title="Etiquetas"><Tags size={17}/></button><span>{zoom.toFixed(1)}×</span>
 </div>;
}
