import React from 'react';
import { Layers, Info } from 'lucide-react';

export default function Legend() {
  return (
    <div className="atlas-legend-hud" role="region" aria-label="Leyenda de navegación cartográfica">
      <div className="legend-title">
        <Layers size={13} />
        <span>Cartografía / Leyenda</span>
      </div>

      <ul className="legend-list">
        <li className="legend-item">
          <span className="legend-swatch" style={{ background: '#f4eee5', border: '1px solid #b59f88' }}></span>
          <span>Entidad federativa (32 estados)</span>
        </li>
        <li className="legend-item">
          <span className="legend-swatch" style={{ background: '#e3efe6', border: '1.5px solid #006847' }}></span>
          <span>Enfoque al pasar el cursor</span>
        </li>
        <li className="legend-item">
          <span className="legend-swatch" style={{ background: '#ce1126', border: '1.5px solid #ffd700', boxShadow: '0 0 5px rgba(206, 17, 38, 0.4)' }}></span>
          <span>Estado seleccionado</span>
        </li>
        <li className="legend-item" style={{ marginTop: '4px', opacity: 0.8, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <Info size={12} style={{ flexShrink: 0, color: 'var(--mexico-brown)' }} />
          <span>Haz clic en un estado para ver su información y municipios.</span>
        </li>
      </ul>
    </div>
  );
}
