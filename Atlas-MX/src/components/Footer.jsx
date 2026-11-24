import React from 'react';
import { Info } from 'lucide-react';

export default function Footer({ onOpenAbout }) {
  return (
    <footer className="atlas-footer">
      <span>© {new Date().getFullYear()} Atlas MX</span>
      <span className="atlas-footer-credits">
        Geografía: <a href="https://www.inegi.org.mx/" target="_blank" rel="noopener noreferrer">INEGI</a> vía <a href="https://www.npmjs.com/package/@webrek/mx-geo" target="_blank" rel="noopener noreferrer">@webrek/mx-geo</a>
        {' · '}Fotos: <a href="https://commons.wikimedia.org/" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a> (licencias CC de sus autores)
        {' · '}Mapas: Google Maps
      </span>
      <button type="button" onClick={onOpenAbout}><Info size={13} aria-hidden="true" /> Acerca de y ayuda</button>
    </footer>
  );
}
