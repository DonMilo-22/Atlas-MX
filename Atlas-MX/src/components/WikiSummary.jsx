import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';
import { useWikiByTitle, useWikiSummary } from '../hooks/useLiveData';

/**
 * Resumen de Wikipedia con su fuente; si no hay página relevante, muestra `fallback`.
 * Con `wikiTitle` se lee ese artículo exacto (sin búsqueda); `title` es el rótulo de la sección.
 */
export default function WikiSummary({ name, stateName, wikiTitle = null, fallback = null, title = 'Sobre este lugar', className = '' }) {
  const exact = useWikiByTitle(wikiTitle, Boolean(wikiTitle));
  const searched = useWikiSummary(name, stateName, !wikiTitle);
  const { data: page, isLoading } = wikiTitle ? exact : searched;
  const data = page?.extract ? page : null;
  if (isLoading) {
    return <div className={`wiki-summary is-skeleton ${className}`} aria-busy="true"><div className="skeleton-line wide" /><div className="skeleton-line wide" /><div className="skeleton-line" /></div>;
  }
  if (!data) return fallback;
  return (
    <div className={`wiki-summary ${className}`}>
      <span className="section-kicker"><BookOpen size={12} aria-hidden="true" /> {title}</span>
      <p>{data.extract}</p>
      <a href={data.url} target="_blank" rel="noopener noreferrer">Leer más en Wikipedia <ExternalLink size={11} aria-hidden="true" /></a>
    </div>
  );
}
