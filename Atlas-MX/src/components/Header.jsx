import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Heart, MapPin, MapPinned, Route, Search, Stamp, X } from 'lucide-react';
import { ESTADOS } from '@webrek/mx-geo';
import { searchPlaces } from '../data/tourismIndex';

const normalize = (value = '') => value.toLocaleLowerCase('es-MX').normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

export default function Header({ onSelectState, onOpenPlace, favoritesCount = 0, onOpenFavorites, onOpenRoutes, visitedCount = 0, onOpenPassport }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef(null);
  const listId = useId();

  const results = useMemo(() => {
    const q = normalize(query);
    if (q.length < 2) return [];
    const states = ESTADOS
      .filter((s) => normalize(`${s.nombre} ${s.nombreCorto} ${s.capital}`).includes(q))
      .slice(0, 5)
      .map((state) => ({ type: 'state', key: `s-${state.cve}`, title: state.nombre, subtitle: `Estado · Capital: ${state.capital}`, state }));
    const places = searchPlaces(query, 6)
      .map((place) => ({ type: 'place', key: `p-${place.stateCode}-${place.name}`, title: place.name, subtitle: `${place.category} · ${place.stateName}`, place }));
    return [...states, ...places];
  }, [query]);

  useEffect(() => { setActiveIndex(0); }, [query]);
  useEffect(() => {
    const onDown = (event) => { if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, []);

  const choose = (result) => {
    if (!result) return;
    if (result.type === 'state') onSelectState?.(result.state);
    else onOpenPlace?.(result.place);
    setQuery('');
    setOpen(false);
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); setActiveIndex((i) => Math.min(results.length - 1, i + 1)); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActiveIndex((i) => Math.max(0, i - 1)); }
    else if (event.key === 'Enter') { event.preventDefault(); choose(results[activeIndex]); }
    else if (event.key === 'Escape') { setOpen(false); }
  };

  const showList = open && query.trim().length >= 2;

  return (
    <header className="atlas-header">
      <h1 className="brand">
        <span className="brand-mark" aria-hidden="true"><MapPinned size={23} /></span>
        <span><span className="brand-title">ATLAS MX</span><span className="brand-sub">México · territorio, cultura y turismo</span></span>
      </h1>
      <div className="search-wrap" ref={wrapRef}>
        <Search size={17} aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Buscar estado, capital o lugar…"
          aria-label="Buscar estado, capital o lugar"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && results[activeIndex] ? `${listId}-${activeIndex}` : undefined}
        />
        {query && <button type="button" className="search-clear" onClick={() => { setQuery(''); setOpen(false); }} aria-label="Limpiar búsqueda"><X size={14} /></button>}
        {showList && (
          <div className="search-results" id={listId} role="listbox" aria-label="Resultados de búsqueda">
            {results.length === 0 && <div className="search-empty">Sin resultados para “{query.trim()}”.</div>}
            {results.map((result, index) => (
              <button
                key={result.key}
                id={`${listId}-${index}`}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={index === activeIndex ? 'active' : ''}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(result)}
              >
                <strong>{result.type === 'place' && <MapPin size={12} aria-hidden="true" />}{result.title}</strong>
                <span>{result.subtitle}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <nav className="header-actions" aria-label="Accesos rápidos">
        <button type="button" className="header-routes" onClick={onOpenRoutes} title="Rutas turísticas"><Route size={16} aria-hidden="true" /><span>Rutas</span></button>
        <button type="button" className="header-favorites" onClick={onOpenFavorites} aria-label={`Quiero visitar: ${favoritesCount} lugares guardados`} title="Quiero visitar"><Heart size={16} fill={favoritesCount ? 'currentColor' : 'none'} aria-hidden="true" /><span>Quiero visitar</span>{favoritesCount > 0 && <b>{favoritesCount}</b>}</button>
        <button type="button" className="header-passport" onClick={onOpenPassport} aria-label={`Pasaporte: ${visitedCount} de 32 estados visitados`} title="Pasaporte"><Stamp size={16} aria-hidden="true" /><span>Pasaporte</span><b>{visitedCount}/32</b></button>
      </nav>
    </header>
  );
}
