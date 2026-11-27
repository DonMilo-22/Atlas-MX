import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Heart, MapPin, Search, X } from 'lucide-react';
import { ESTADOS } from '@webrek/mx-geo';
import { searchPlaces } from '../data/searchIndex';
import { CATEGORY_META } from '../data/tourism';

const normalize = (value = '') => value.toLocaleLowerCase('es-MX').normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

// Abreviaturas comunes con las que la gente busca un estado.
const STATE_ALIASES = { '02': 'bc', '03': 'bcs', '09': 'cdmx df distrito federal', '15': 'edomex', '19': 'nl', '22': 'qro', '23': 'qroo q roo', '24': 'slp' };

export default function Header({ onSelectState, onOpenPlace, favoritesCount = 0, onOpenFavorites }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef(null);
  const listId = useId();

  const results = useMemo(() => {
    const q = normalize(query);
    if (q.length < 2) return [];
    const states = ESTADOS
      .filter((s) => normalize(`${s.nombre} ${s.nombreCorto} ${s.capital} ${STATE_ALIASES[s.cve] || ''}`).includes(q))
      .slice(0, 5)
      .map((state) => ({ type: 'state', key: `s-${state.cve}`, title: state.nombre, subtitle: `Estado, capital ${state.capital}`, state }));
    const places = searchPlaces(query, 6)
      .map((place) => ({ type: 'place', key: `p-${place.stateCode}-${place.category}-${place.id}`, title: place.name, subtitle: `${CATEGORY_META[place.category]?.single || CATEGORY_META[place.category]?.label || ''}, ${place.stateName}`, place }));
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
      <h1 className="brand"><span className="brand-title">Atlas<span aria-hidden="true">·</span>MX</span><span className="visually-hidden"> — Explora México</span></h1>
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
        <button type="button" className="icon-btn" onClick={onOpenFavorites} aria-label={`Quiero visitar: ${favoritesCount} lugares guardados`} title="Quiero visitar"><Heart size={18} fill={favoritesCount ? 'currentColor' : 'none'} aria-hidden="true" />{favoritesCount > 0 && <b className="icon-count">{favoritesCount}</b>}</button>
      </nav>
    </header>
  );
}
