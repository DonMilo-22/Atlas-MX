import React from 'react';
import { Info, Keyboard, MousePointer2, ShieldCheck, X } from 'lucide-react';
import useDialog from '../hooks/useDialog';

export default function AboutModal({ isOpen, onClose }) {
  const ref = useDialog(isOpen, onClose);
  if (!isOpen) return null;
  return (
    <div className="experience-modal-layer" role="dialog" aria-modal="true" aria-labelledby="about-title">
      <button type="button" className="experience-modal-backdrop" onClick={onClose} aria-label="Cerrar" tabIndex={-1} />
      <section className="experience-modal about-modal" ref={ref} tabIndex={-1}>
        <header className="experience-modal-head">
          <div><span><Info size={13} /> Atlas MX</span><h2 id="about-title">Acerca de y ayuda</h2><p>Un atlas interactivo para explorar los 32 estados de México.</p></div>
          <button type="button" onClick={onClose} aria-label="Cerrar"><X size={19} /></button>
        </header>
        <div className="about-body">
          <section>
            <h3><MousePointer2 size={15} /> Cómo usar el mapa</h3>
            <ul>
              <li>Haz clic o toca un estado para ver destinos, pueblos, historia y cocina.</li>
              <li>Arrastra para mover el mapa; usa la rueda del ratón o pellizca para acercar.</li>
              <li>Usa “Explorar por” para resaltar estados por categoría y buscar lugares.</li>
              <li>El enlace del navegador cambia con cada estado: puedes compartirlo.</li>
            </ul>
          </section>
          <section>
            <h3><Keyboard size={15} /> Atajos de teclado</h3>
            <ul>
              <li><kbd>Tab</kbd> recorre los estados y <kbd>Enter</kbd> los selecciona.</li>
              <li><kbd>+</kbd> / <kbd>-</kbd> acercan y alejan; <kbd>0</kbd> centra el mapa.</li>
              <li><kbd>Esc</kbd> cierra cualquier ventana.</li>
            </ul>
          </section>
          <section>
            <h3><ShieldCheck size={15} /> Fuentes y créditos</h3>
            <ul>
              <li>Límites estatales y municipales, población y superficie: INEGI, mediante la librería <a href="https://www.npmjs.com/package/@webrek/mx-geo" target="_blank" rel="noopener noreferrer">@webrek/mx-geo</a>.</li>
              <li>Fotografías: <a href="https://www.wikipedia.org/" target="_blank" rel="noopener noreferrer">Wikipedia</a> y <a href="https://commons.wikimedia.org/" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a>. Cada imagen pertenece a su autor bajo su licencia Creative Commons; consulta la página del archivo para la atribución completa.</li>
              <li>Mapas, hoteles y clima: enlaces a Google Maps y Google Search.</li>
              <li>Presupuestos, temporadas y fechas de festividades son orientativos; verifica con fuentes oficiales antes de viajar.</li>
              <li>Tus favoritos y tu pasaporte se guardan solo en este navegador.</li>
            </ul>
          </section>
        </div>
      </section>
    </div>
  );
}
