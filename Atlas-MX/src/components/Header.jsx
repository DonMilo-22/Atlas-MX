import React, { useMemo, useState } from 'react';
import { Heart, Search, MapPinned } from 'lucide-react';
import { ESTADOS } from '@webrek/mx-geo';

export default function Header({ onSelectState, selectedState, favoritesCount = 0, onOpenFavorites }) {
  const [query,setQuery]=useState('');
  const results=useMemo(()=>{
    const q=query.toLocaleLowerCase('es-MX').trim();
    if(!q) return [];
    return ESTADOS.filter(s => `${s.nombre} ${s.nombreCorto} ${s.capital}`.toLocaleLowerCase('es-MX').includes(q)).slice(0,8);
  },[query]);
  const choose=(s)=>{ onSelectState?.(s); setQuery(''); };
  return <header className="atlas-header">
    <div className="brand"><div className="brand-mark"><MapPinned size={23}/></div><div><div className="brand-title">ATLAS MX</div><div className="brand-sub">México · territorio, cultura y turismo</div></div></div>
    <div className="search-wrap">
      <Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar estado o capital…" aria-label="Buscar estado" />
      {results.length>0 && <div className="search-results">{results.map(s=><button key={s.cve} onClick={()=>choose(s)}><strong>{s.nombre}</strong><span>{s.capital}</span></button>)}</div>}
    </div>
    <button type="button" className="header-favorites" onClick={onOpenFavorites} aria-label={`Abrir ${favoritesCount} lugares favoritos`}><Heart size={16} fill={favoritesCount ? 'currentColor' : 'none'} /><span>Quiero visitar</span>{favoritesCount > 0 && <b>{favoritesCount}</b>}</button>
    <div className="header-status">{selectedState ? selectedState.nombre : '32 entidades'}</div>
  </header>;
}
