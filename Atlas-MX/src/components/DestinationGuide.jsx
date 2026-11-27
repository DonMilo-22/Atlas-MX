import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, BookOpen, ExternalLink, Heart, Landmark, MapPin, Mountain, Search, Sparkles, UtensilsCrossed, X } from 'lucide-react';
import useDialog from '../hooks/useDialog';
import useStateTourism from '../hooks/useStateTourism';
import { CATEGORY_META, commonsThumb, toPlace, wikipediaUrl } from '../data/tourism';
import { CAPITAL_COORDS } from '../data/capitals';
import '../styles/guide.css';

const fold = (value = '') => value.toLocaleLowerCase('es-MX').normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

export const GUIDE_CATEGORIES = [
  { key: 'pueblos', label: 'Pueblos Mágicos', icon: Sparkles, count: CATEGORY_META.pueblos.count, empty: 'Este estado aún no tiene localidades en el programa Pueblos Mágicos.', source: 'Localidades con nombramiento del programa Pueblos Mágicos de la Secretaría de Turismo.' },
  { key: 'historia', label: 'Historia', icon: Landmark, count: CATEGORY_META.historia.count, empty: 'No encontramos sitios históricos con información verificable.', source: 'Zonas arqueológicas, patrimonio de la humanidad, templos, museos y monumentos registrados en Wikidata.' },
  { key: 'destinos', label: 'Destinos', icon: Mountain, count: CATEGORY_META.destinos.count, empty: 'No encontramos destinos con información verificable.', source: 'Ciudades, playas y áreas naturales protegidas registradas en Wikidata, ordenadas por relevancia.' },
  { key: 'cocina', label: 'Cocina', icon: UtensilsCrossed, count: CATEGORY_META.cocina.count, empty: 'No encontramos platillos con información verificable.', source: 'Platillos, bebidas y dulces vinculados al estado en Wikipedia y Wikidata.' }
];
const CATEGORY_BY_KEY = Object.fromEntries(GUIDE_CATEGORIES.map((c) => [c.key, c]));

function Photo({ file, width, alt = '', className = '' }) {
  const [failed, setFailed] = useState(false);
  if (!file || failed) return <span className={`guide-photo-empty ${className}`} aria-hidden="true" />;
  return <img className={className} src={commonsThumb(file, width)} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}

function names(list, max = 3) {
  const shown = list.slice(0, max).map((item) => item.nombre);
  const rest = list.length - shown.length;
  if (!shown.length) return '';
  if (rest > 0) return `${shown.join(', ')} y ${rest} más`;
  return shown.length > 1 ? `${shown.slice(0, -1).join(', ')} y ${shown[shown.length - 1]}` : shown[0];
}

function CategoryMosaic({ data, onPick }) {
  return (
    <div className="guide-mosaic">
      {GUIDE_CATEGORIES.map((cat) => {
        const list = data.categorias?.[cat.key] || [];
        const cover = list.find((item) => item.imagen);
        return (
          <button key={cat.key} type="button" className={`guide-tile guide-tile-${cat.key}`} onClick={() => onPick(cat.key)} disabled={!list.length} aria-label={`${cat.label}: ${cat.count(list.length)}`}>
            <Photo file={cover?.imagen} width={cat.key === 'pueblos' ? 900 : 640} className="guide-tile-img" />
            <span className="guide-tile-text">
              <span className="guide-tile-name">{cat.label}</span>
              <span className="guide-tile-list">{list.length ? names(list) : cat.empty}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ItemRow({ item, category, onOpen, favorite, isFavorite, onToggleFavorite }) {
  const meta = [item.tipo, item.municipio && item.municipio !== item.nombre ? item.municipio : null].filter(Boolean).join(', ');
  return (
    <li className="guide-row">
      <button type="button" className="guide-row-main" onClick={() => onOpen(item)}>
        <Photo file={item.imagen} width={240} className="guide-row-img" />
        <span className="guide-row-text">
          <span className="guide-row-name">{item.nombre}</span>
          {meta && <span className="guide-row-meta">{meta}</span>}
          {item.descripcion && <span className="guide-row-desc">{item.descripcion}</span>}
        </span>
      </button>
      <button type="button" className={`guide-row-save ${isFavorite ? 'active' : ''}`} onClick={() => onToggleFavorite?.(favorite)} aria-pressed={Boolean(isFavorite)} aria-label={`${isFavorite ? 'Quitar' : 'Guardar'} ${item.nombre} ${isFavorite ? 'de' : 'en'} Quiero visitar`} title={isFavorite ? 'Quitar de Quiero visitar' : 'Guardar en Quiero visitar'}>
        <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} aria-hidden="true" />
      </button>
      {category !== 'cocina' && <MapPin size={14} className="guide-row-pin" aria-hidden="true" />}
    </li>
  );
}

function DishDetail({ item, state, onFindRestaurants }) {
  const url = wikipediaUrl(item.wiki);
  return (
    <article className="guide-dish" aria-live="polite">
      <div className="guide-dish-body">
        <figure className="guide-dish-photo"><Photo file={item.imagen} width={960} alt={item.nombre} /></figure>
        <div className="guide-dish-text">
          {item.tipo && <p className="guide-dish-type">{item.tipo}</p>}
          {item.descripcion ? <p className="guide-dish-desc">{item.descripcion}</p> : <p className="guide-dish-desc is-muted">Sin descripción disponible.</p>}
          <div className="guide-dish-actions">
            <button type="button" className="guide-primary" onClick={onFindRestaurants}><UtensilsCrossed size={16} aria-hidden="true" /> Restaurantes en {state.capital}</button>
            {url && <a href={url} target="_blank" rel="noopener noreferrer"><BookOpen size={15} aria-hidden="true" /> Leer en Wikipedia <ExternalLink size={12} aria-hidden="true" /></a>}
            {item.fuente && <a href={item.fuente} target="_blank" rel="noopener noreferrer">Ficha en Wikidata <ExternalLink size={12} aria-hidden="true" /></a>}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function DestinationGuide({ state, isOpen, onClose, initialCategory = null, initialItemId = null, onOpenPlace, onOpenLocationMap, isFavorite, onToggleFavorite }) {
  const ref = useDialog(isOpen, onClose);
  const { data, isLoading, error } = useStateTourism(state.cve);
  const [category, setCategory] = useState(initialCategory && CATEGORY_BY_KEY[initialCategory] ? initialCategory : null);
  const [dishId, setDishId] = useState(initialCategory === 'cocina' ? initialItemId : null);
  const [query, setQuery] = useState('');
  const bodyRef = useRef(null);

  useEffect(() => { setQuery(''); bodyRef.current?.scrollTo?.({ top: 0 }); }, [category, dishId]);

  const list = useMemo(() => {
    const items = data?.categorias?.[category] || [];
    const sorted = category === 'pueblos' ? [...items].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')) : items;
    const q = fold(query);
    return q ? sorted.filter((item) => fold(`${item.nombre} ${item.tipo || ''} ${item.municipio || ''}`).includes(q)) : sorted;
  }, [data, category, query]);

  if (!isOpen) return null;
  const cat = category ? CATEGORY_BY_KEY[category] : null;
  const total = data?.categorias?.[category]?.length || 0;
  const dish = dishId ? data?.categorias?.cocina?.find((item) => item.id === dishId) : null;

  const favoriteFor = (item, key) => ({ ...toPlace(item, key, state.cve, state.nombre), id: `${state.cve}:${key}:${item.id}`, qid: item.id });
  const openItem = (item) => {
    if (category === 'cocina') { setDishId(item.id); return; }
    onOpenPlace?.(toPlace(item, category, state.cve, state.nombre));
  };
  const findRestaurants = () => {
    const c = CAPITAL_COORDS[state.cve];
    onOpenLocationMap?.(state.capital, state.nombre, 'Ciudad', { coords: c ? { lat: c[0], lon: c[1] } : null, initialTab: 'restaurantes' });
  };

  return (
    <div className="guide-layer" role="dialog" aria-modal="true" aria-labelledby="guide-title">
      <button type="button" className="guide-backdrop" onClick={onClose} aria-label="Cerrar guía" tabIndex={-1} />
      <section className="guide" ref={ref} tabIndex={-1}>
        <header className="guide-head">
          <div className="guide-head-text">
            {cat || dish ? (
              <button type="button" className="guide-back" onClick={() => (dish ? setDishId(null) : setCategory(null))}>
                <ArrowLeft size={15} aria-hidden="true" /> {dish ? `Cocina de ${state.nombreCorto}` : `Guía de ${state.nombreCorto}`}
              </button>
            ) : null}
            <h2 id="guide-title">{dish ? dish.nombre : cat ? cat.label : `Guía de ${state.nombre}`}</h2>
            {!cat && !dish && <p>Elige qué quieres conocer. Todo viene de fuentes verificables y cada lugar abre su mapa con hoteles, restaurantes y clima.</p>}
            {cat && !dish && <p>{cat.count(total)} en {state.nombre}</p>}
          </div>
          <button type="button" className="guide-close" onClick={onClose} aria-label="Cerrar guía" data-autofocus><X size={20} aria-hidden="true" /></button>
        </header>

        {cat && !dish && (
          <nav className="guide-switch" aria-label="Categorías">
            {GUIDE_CATEGORIES.map((c) => {
              const n = data?.categorias?.[c.key]?.length || 0;
              return <button key={c.key} type="button" className={c.key === category ? 'active' : ''} aria-current={c.key === category ? 'true' : undefined} disabled={!n} onClick={() => setCategory(c.key)}><c.icon size={15} aria-hidden="true" /> {c.label}</button>;
            })}
          </nav>
        )}

        <div className="guide-body" ref={bodyRef}>
          {isLoading && <div className="guide-loading" aria-busy="true"><span /><span /><span /><span /></div>}
          {!isLoading && (error || !data) && <p className="guide-empty">No se pudo cargar la guía de {state.nombre}. Cierra la ventana e inténtalo de nuevo.</p>}

          {data && !cat && <CategoryMosaic data={data} onPick={setCategory} />}

          {data && dish && <DishDetail item={dish} state={state} onFindRestaurants={findRestaurants} />}

          {data && cat && !dish && (
            <>
              {total > 8 && (
                <label className="guide-filter">
                  <Search size={15} aria-hidden="true" />
                  <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Filtrar ${cat.count(total)}`} aria-label={`Filtrar ${cat.label.toLocaleLowerCase('es-MX')}`} />
                </label>
              )}
              {total === 0 && <p className="guide-empty">{cat.empty}</p>}
              {total > 0 && list.length === 0 && <p className="guide-empty">Ningún resultado para “{query.trim()}”.</p>}
              <ul className="guide-list">
                {list.map((item) => {
                  const favorite = favoriteFor(item, category);
                  return <ItemRow key={item.id} item={item} category={category} onOpen={openItem} favorite={favorite} isFavorite={isFavorite?.(favorite.id)} onToggleFavorite={onToggleFavorite} />;
                })}
              </ul>
              <p className="guide-source">{cat.source}</p>
            </>
          )}
        </div>

        <footer className="guide-foot">
          Fuentes: <a href="https://www.gob.mx/sectur" target="_blank" rel="noopener noreferrer">Secretaría de Turismo</a>, <a href="https://www.wikidata.org" target="_blank" rel="noopener noreferrer">Wikidata</a> y <a href="https://es.wikipedia.org" target="_blank" rel="noopener noreferrer">Wikipedia</a>. Fotos de Wikimedia Commons.
        </footer>
      </section>
    </div>
  );
}
