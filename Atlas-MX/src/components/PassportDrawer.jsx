import React from 'react';
import { Award, Compass, Stamp, X } from 'lucide-react';
import { ESTADOS } from '@webrek/mx-geo';

const MILESTONES = [
  { count: 1, label: 'Primer sello' },
  { count: 5, label: 'Explorador regional' },
  { count: 10, label: 'Diez destinos' },
  { count: 16, label: 'Medio México' },
  { count: 24, label: 'Gran viajero' },
  { count: 32, label: 'México completo' }
];

export default function PassportDrawer({ isOpen, visitedStates, onToggleVisited, onSelectState, onClose }) {
  if (!isOpen) return null;
  const visitedCount = visitedStates.length;
  const progress = Math.round((visitedCount / 32) * 100);

  return (
    <div className="passport-layer" role="dialog" aria-modal="true" aria-label="Pasaporte Atlas MX">
      <button type="button" className="passport-backdrop" onClick={onClose} aria-label="Cerrar pasaporte" />
      <section className="passport-drawer">
        <header className="passport-head">
          <div className="passport-emblem"><Stamp size={28} /></div>
          <div><span>Documento de exploración</span><h2>Pasaporte Atlas MX</h2><p>Marca únicamente los estados que realmente has visitado.</p></div>
          <button type="button" onClick={onClose} aria-label="Cerrar pasaporte"><X size={19} /></button>
        </header>
        <div className="passport-progress-wrap">
          <div className="passport-progress-label"><strong>{visitedCount} de 32 estados</strong><span>{progress}% de México recorrido</span></div>
          <div className="passport-progress"><span style={{ width: `${progress}%` }} /></div>
          <div className="passport-milestones">
            {MILESTONES.map((milestone) => <span key={milestone.count} className={visitedCount >= milestone.count ? 'unlocked' : ''} title={`${milestone.label}: ${milestone.count} estados`}><Award size={14} /><small>{milestone.count}</small></span>)}
          </div>
        </div>
        <div className="passport-grid">
          {ESTADOS.map((state) => {
            const visited = visitedStates.includes(state.cve);
            return (
              <article key={state.cve} className={`passport-state ${visited ? 'visited' : ''}`}>
                <button type="button" className="passport-stamp-action" onClick={() => onToggleVisited?.(state.cve)} aria-pressed={visited} aria-label={`${visited ? 'Quitar sello de' : 'Sellar'} ${state.nombre}`}>
                  <span className="passport-stamp-mark"><Stamp size={21} /></span>
                  <strong>{state.nombreCorto}</strong>
                  <small>{visited ? 'VISITADO' : 'Sin sello'}</small>
                </button>
                <button type="button" className="passport-explore-state" onClick={() => onSelectState?.(state)}><Compass size={11} /> Explorar</button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
