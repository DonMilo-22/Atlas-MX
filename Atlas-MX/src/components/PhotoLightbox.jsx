import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react';

export default function PhotoLightbox({ photos, initialIndex = 0, placeName, onClose }) {
  const [index, setIndex] = useState(initialIndex);
  useEffect(() => setIndex(initialIndex), [initialIndex]);
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose?.();
      if (event.key === 'ArrowLeft') setIndex((current) => (current - 1 + photos.length) % photos.length);
      if (event.key === 'ArrowRight') setIndex((current) => (current + 1) % photos.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [photos.length, onClose]);
  if (!photos.length) return null;

  return <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label={`Galería de ${placeName}`} onClick={(event) => event.stopPropagation()}>
    <div className="photo-lightbox-top"><span><Images size={15} /> {placeName}<small>{index + 1} de {photos.length} · Wikipedia / Wikimedia Commons</small></span><button type="button" onClick={onClose} aria-label="Cerrar galería"><X size={21} /></button></div>
    <div className="photo-lightbox-stage"><button type="button" onClick={() => setIndex((current) => (current - 1 + photos.length) % photos.length)} aria-label="Fotografía anterior"><ChevronLeft size={30} /></button><img src={photos[index]} alt={`${placeName}, fotografía ${index + 1}`} /><button type="button" onClick={() => setIndex((current) => (current + 1) % photos.length)} aria-label="Fotografía siguiente"><ChevronRight size={30} /></button></div>
    <div className="photo-lightbox-thumbs">{photos.map((photo, photoIndex) => <button key={photo} type="button" className={photoIndex === index ? 'active' : ''} onClick={() => setIndex(photoIndex)}><img src={photo} alt={`Miniatura ${photoIndex + 1}`} /></button>)}</div>
  </div>;
}
