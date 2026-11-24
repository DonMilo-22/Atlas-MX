import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, BedDouble, CloudSun, Landmark, MapPin, Search, UtensilsCrossed, X } from 'lucide-react';
import { feature } from 'topojson-client';
import { geoCentroid } from 'd3-geo';
import { MapaMunicipios, cargaMunicipios, municipios } from '@webrek/mx-geo/municipios';
import useDialog from '../hooks/useDialog';
import RealPhoto from './RealPhoto';
import WikiSummary from './WikiSummary';

const CLICK_TOLERANCE = 6;

/** Centro geográfico real de cada municipio, calculado con la geometría del INEGI. */
function useMunicipalityCentroids(stateCode) {
  const [centroids, setCentroids] = useState({ code: null, map: {} });
  useEffect(() => {
    let cancelled = false;
    cargaMunicipios(stateCode).then((topo) => {
      if (cancelled) return;
      const map = {};
      Object.values(topo.objects).forEach((object) => {
        const collection = feature(topo, object);
        (collection.features || []).forEach((f) => {
          const [lon, lat] = geoCentroid(f);
          if (f.properties?.cvegeo && Number.isFinite(lat)) map[f.properties.cvegeo] = { lat, lon };
        });
      });
      setCentroids({ code: stateCode, map });
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [stateCode]);
  return centroids.code === stateCode ? centroids.map : {};
}

export default function MunicipalityModalV2({ state, isOpen, onClose, onOpenLocationMap }) {
  const [selectedMun, setSelectedMun] = useState(null);
  const [hoveredMun, setHoveredMun] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const mapWrapperRef = useRef(null);
  const pointerStart = useRef(null);
  const detailRef = useRef(null);
  const dialogRef = useDialog(isOpen, onClose);
  const centroids = useMunicipalityCentroids(state?.cve);
  useEffect(() => { setSelectedMun(null); setSearchQuery(''); setHoveredMun(null); }, [state?.cve]);

  const munList = useMemo(() => {
    if (!state) return [];
    try { return municipios(state.cve) || []; } catch { return []; }
  }, [state]);
  const byCode = useMemo(() => new Map(munList.map((mun) => [mun.cvegeo, mun])), [munList]);

  const filteredMuns = useMemo(() => {
    const q = searchQuery.toLocaleLowerCase('es-MX').normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
    if (!q) return munList;
    return munList.filter((mun) => mun.nombre.toLocaleLowerCase('es-MX').normalize('NFD').replace(/[̀-ͯ]/g, '').includes(q));
  }, [munList, searchQuery]);

  useEffect(() => { if (selectedMun) detailRef.current?.focus({ preventScroll: true }); }, [selectedMun]);

  if (!isOpen || !state) return null;
  const unit = state.cve === '09' ? 'alcaldía' : 'municipio';
  const units = state.cve === '09' ? 'alcaldías' : 'municipios';

  // La librería captura el puntero para arrastrar, y eso impide que el clic llegue al municipio.
  // Detectamos el clic nosotros: si el puntero casi no se movió, buscamos el municipio bajo el cursor.
  const onPointerDown = (event) => { pointerStart.current = { x: event.clientX, y: event.clientY }; };
  const onPointerUp = (event) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start || Math.hypot(event.clientX - start.x, event.clientY - start.y) > CLICK_TOLERANCE) return;
    const hit = document.elementsFromPoint(event.clientX, event.clientY).find((el) => el.getAttribute?.('data-cvegeo'));
    const mun = hit && byCode.get(hit.getAttribute('data-cvegeo'));
    if (mun) setSelectedMun(mun);
  };

  const handleMapMouseMove = (event) => {
    const path = event.target.closest?.('[data-cvegeo]');
    if (!path || !mapWrapperRef.current) { setHoveredMun(null); return; }
    const found = byCode.get(path.getAttribute('data-cvegeo'));
    const rect = mapWrapperRef.current.getBoundingClientRect();
    if (found) setHoveredMun({ ...found, x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  const openExplorer = (initialTab) => {
    // El centro geométrico sirve de referencia: se busca la cabecera municipal cerca de él.
    const near = centroids[selectedMun.cvegeo] || null;
    onOpenLocationMap?.(selectedMun.nombre, state.nombre, 'Municipio', { near, initialTab });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog modal-municipios-dialog mun-dialog" ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="municipios-title" onClick={(event) => event.stopPropagation()}>
        <header className="mun-head">
          <div>
            <h2 id="municipios-title">{units.replace(/^./, (c) => c.toUpperCase())} de {state.nombre}</h2>
            <p>{munList.length} {units}. Toca uno en el mapa o búscalo en la lista.</p>
          </div>
          <button type="button" className="explorer-close" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
        </header>

        <div className="mun-layout">
          <div className="mun-map" ref={mapWrapperRef} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onMouseMove={handleMapMouseMove} onMouseLeave={() => setHoveredMun(null)}>
            <MapaMunicipios
              estado={state.cve}
              zoom
              data={selectedMun ? { [selectedMun.cvegeo]: 1 } : undefined}
              colorRange={['#D1006B', '#D1006B']}
              paleta={['#D1006B', '#D1006B']}
              emptyColor="#D9DFDA"
              stroke="#F5F6F3"
              ariaLabel={`Mapa de ${units} de ${state.nombre}`}
              etiquetas={(mun) => (selectedMun?.cvegeo === mun.cvegeo ? mun.nombre : '')}
              colorEtiqueta="#1E2A27"
              onSelect={setSelectedMun}
            />
            {hoveredMun && <div className="mun-tooltip" style={{ left: hoveredMun.x, top: hoveredMun.y }}>{hoveredMun.nombre}</div>}
          </div>

          <aside className="mun-side">
            {selectedMun ? (
              <article className="mun-detail" ref={detailRef} tabIndex={-1} aria-live="polite">
                <button type="button" className="poi-back" onClick={() => setSelectedMun(null)}><ArrowLeft size={15} aria-hidden="true" /> Todos los {units}</button>
                <div className="mun-photo"><RealPhoto name={selectedMun.nombre} stateName={state.nombre} alt={`${selectedMun.nombre}, ${state.nombre}`} /></div>
                <h3>{selectedMun.nombre}</h3>
                <p className="mun-sub">{unit.replace(/^./, (c) => c.toUpperCase())} de {state.nombre}</p>
                <WikiSummary key={selectedMun.cvegeo} name={selectedMun.nombre} stateName={state.nombre} title="De Wikipedia" fallback={null} />
                <button type="button" className="sp-primary" onClick={() => openExplorer('resumen')}><MapPin size={17} aria-hidden="true" /><span>Ver en el mapa con puntos de interés</span></button>
                <div className="mun-quick">
                  <button type="button" onClick={() => openExplorer('hoteles')}><BedDouble size={16} aria-hidden="true" /> Hoteles</button>
                  <button type="button" onClick={() => openExplorer('restaurantes')}><UtensilsCrossed size={16} aria-hidden="true" /> Restaurantes</button>
                  <button type="button" onClick={() => openExplorer('atractivos')}><Landmark size={16} aria-hidden="true" /> Qué ver</button>
                  <button type="button" onClick={() => openExplorer('clima')}><CloudSun size={16} aria-hidden="true" /> Clima</button>
                </div>
              </article>
            ) : (
              <>
                <label className="mun-search"><Search size={15} aria-hidden="true" /><input type="search" placeholder={`Buscar ${unit}…`} aria-label={`Buscar ${unit}`} value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} /></label>
                <ul className="mun-list">
                  {filteredMuns.length === 0 && <li className="municipios-empty">Ningún {unit} coincide con “{searchQuery.trim()}”.</li>}
                  {filteredMuns.map((mun) => <li key={mun.cvegeo}><button type="button" onClick={() => setSelectedMun(mun)}>{mun.nombre}</button></li>)}
                </ul>
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
