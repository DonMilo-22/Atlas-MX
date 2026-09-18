import React from 'react';
import { Heart, MapPin, Trash2, X } from 'lucide-react';

export default function FavoritesDrawer({ isOpen, favorites, onClose, onOpenFavorite, onRemove }) {
  if (!isOpen) return null;

  return (
    <div className="favorites-layer" role="dialog" aria-modal="true" aria-label="Lugares que quiero visitar">
      <button type="button" className="favorites-backdrop" onClick={onClose} aria-label="Cerrar favoritos" />
      <aside className="favorites-drawer">
        <header className="favorites-drawer-head">
          <div><span>Mi colección</span><h2>Quiero visitar</h2><p>{favorites.length} {favorites.length === 1 ? 'lugar guardado' : 'lugares guardados'}</p></div>
          <button type="button" onClick={onClose} aria-label="Cerrar favoritos"><X size={19} /></button>
        </header>
        <div className="favorites-list">
          {favorites.length === 0 ? (
            <div className="favorites-empty"><Heart size={34} /><strong>Tu lista está esperando</strong><p>Usa el corazón de cualquier destino para guardarlo aquí. La lista permanecerá en este navegador.</p></div>
          ) : favorites.map((favorite) => (
            <article key={favorite.id} className="favorite-row">
              <button type="button" className="favorite-row-main" onClick={() => onOpenFavorite?.(favorite)}>
                <span className="favorite-row-icon"><MapPin size={16} /></span>
                <span><strong>{favorite.name}</strong><small>{favorite.stateName} · {favorite.category}</small></span>
              </button>
              <button type="button" className="favorite-remove" onClick={() => onRemove?.(favorite)} aria-label={`Quitar ${favorite.name} de favoritos`}><Trash2 size={15} /></button>
            </article>
          ))}
        </div>
      </aside>
    </div>
  );
}
