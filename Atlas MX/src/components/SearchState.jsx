import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { ESTADOS } from '@webrek/mx-geo';

export default function SearchState({ onSelectState, selectedState }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef(null);

  // Filtrar catálogo oficial de los 32 estados
  const filteredStates = query.trim()
    ? ESTADOS.filter((st) => {
        const q = query.toLowerCase().trim();
        const matchName = st.nombre.toLowerCase().includes(q);
        const matchShort = st.nombreCorto.toLowerCase().includes(q);
        const matchCapital = st.capital.toLowerCase().includes(q);
        const matchCve = st.cve === q || st.cve === q.padStart(2, '0');
        const matchIso = st.iso.toLowerCase().includes(q);
        const matchAlias = st.alias?.some((a) => a.toLowerCase().includes(q));
        return matchName || matchShort || matchCapital || matchCve || matchIso || matchAlias;
      })
    : [];

  useEffect(() => {
    // Cerrar menú al hacer clic fuera
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (state) => {
    onSelectState(state);
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || filteredStates.length === 0) {
      if (e.key === 'ArrowDown' && query.trim()) setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % filteredStates.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + filteredStates.length) % filteredStates.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredStates[highlightedIndex]) {
        handleSelect(filteredStates[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="search-container" ref={containerRef}>
      <div className="search-input-wrapper">
        <Search size={16} className="search-icon" aria-hidden="true" />
        <input
          type="text"
          className="search-input"
          placeholder="Buscar estado (ej. Campeche, Jalisco, 09...)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          aria-label="Buscar estado en el atlas"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            aria-label="Limpiar búsqueda"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {isOpen && filteredStates.length > 0 && (
        <div className="search-dropdown" role="listbox">
          {filteredStates.map((st, index) => (
            <div
              key={st.cve}
              role="option"
              aria-selected={selectedState?.cve === st.cve}
              className={`search-item ${index === highlightedIndex ? 'highlighted' : ''}`}
              onClick={() => handleSelect(st)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <div className="search-item-info">
                <span className="search-item-name">{st.nombreCorto}</span>
                <span className="search-item-sub">Capital: {st.capital}</span>
              </div>
              <span className="search-item-badge">{st.iso}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
