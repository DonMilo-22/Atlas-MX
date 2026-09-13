import React from 'react';
import { Compass } from 'lucide-react';
import SearchState from './SearchState';

export default function Header({ onSelectState, selectedState }) {
  return (
    <header className="atlas-header" role="banner">
      <div className="header-brand">
        <div className="brand-icon-wrapper" aria-hidden="true">
          <Compass size={22} />
        </div>
        <div className="brand-text">
          <h1>
            Atlas <span>MX</span>
          </h1>
          <div className="brand-subtitle">Explorador geográfico y cultural de México</div>
        </div>
      </div>

      <div className="header-center">
        <SearchState onSelectState={onSelectState} selectedState={selectedState} />
      </div>

      <div className="header-meta">
        <div className="meta-badge" title="División política federal de la República Mexicana">
          <span className="pulse-dot" aria-hidden="true"></span>
          <span>32 ENTIDADES</span>
        </div>
      </div>
    </header>
  );
}
