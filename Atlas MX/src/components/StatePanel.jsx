import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Utensils, 
  Landmark, 
  Waves, 
  Navigation,
  ExternalLink,
  Search,
  BookOpen
} from 'lucide-react';
import { vecinos, estado as getEstadoByCve } from '@webrek/mx-geo';
import { formatArea, formatPopulation, getRegionInfo } from '../utils/map';
import { TOURISM_DATA } from '../data/states';
import { MEXICAN_PHOTOS } from '../data/placesData';

export default function StatePanel({ 
  selectedState, 
  onSelectState, 
  onExploreState,
  onOpenLocationMap 
}) {
  const [activeTab, setActiveTab] = useState('destinos');

  if (!selectedState) {
    return (
      <aside className="atlas-sidebar" aria-label="Información del estado seleccionado">
        <div className="state-empty-view">
          <div className="empty-radar" aria-hidden="true">
            <Compass size={38} />
          </div>
          <h2 className="empty-title">EXPLORADOR DE ENTIDADES</h2>
          <p className="empty-desc">
            Selecciona un estado en el mapa o en el buscador superior para ver sus fotografías, destinos turísticos, historia viva y gastronomía típica.
          </p>
        </div>
      </aside>
    );
  }

  const stateData = TOURISM_DATA[selectedState.cve] || {};
  const tourism = stateData.turismo || {
    destinos: [
      { nombre: 'Centro Histórico', descripcion: 'Calles tradicionales y arquitectura virreinal.', imagen: MEXICAN_PHOTOS.pueblo_colonial },
      { nombre: 'Plaza de Armas', descripcion: 'Punto de reunión cívico y cultural.', imagen: MEXICAN_PHOTOS.iglesia_colonial }
    ],
    pueblosMagicos: [],
    arqueologia: [],
    playas: [],
    gastronomia: [
      { nombre: 'Platillos regionales', descripcion: 'Gastronomía típica elaborada con ingredientes del estado.', imagen: MEXICAN_PHOTOS.tacos }
    ],
    clima: 'Clima característico de la región'
  };

  const lema = stateData.lema;
  const resumen = stateData.resumen;
  const heroImage = stateData.heroImage || MEXICAN_PHOTOS.pueblo_colonial;
  const neighborKeys = vecinos(selectedState.cve) || [];
  const regionInfo = getRegionInfo(selectedState.region);

  // Manejador para abrir la sección estilo Google Maps con fotos e información
  const handleLocationClick = (item, category) => {
    const placeName = typeof item === 'string' ? item : item.nombre;
    if (onOpenLocationMap) {
      onOpenLocationMap(placeName, selectedState.nombre, category);
    }
  };

  // Búsqueda limpia en Google solicitada por el usuario:
  // Solo se busca el nombre esencial (ej. "Torta ahogada") sin texto redundante
  const handleCleanWebSearch = (item) => {
    const cleanName = typeof item === 'string' ? item : item.nombre;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanName)}`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside className="atlas-sidebar" aria-label={`Información detallada de ${selectedState.nombre}`}>
      <div className="state-content-view">
        
        {/* Cabecera del estado con portada fotográfica panorámica */}
        <div className="state-header-card with-hero">
          <div className="state-hero-banner">
            <img src={heroImage} alt={`Paisaje representativo de ${selectedState.nombre}`} />
            <div className="state-hero-overlay" />
            <span className="state-iso-tag">{selectedState.iso}</span>
          </div>

          <div className="state-header-inner">
            <div className="state-header-top">
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                CLAVE INEGI: {selectedState.cve}
              </span>
              <span className="state-region-badge" style={{ color: 'var(--mexico-green)' }}>
                {selectedState.region ? selectedState.region.toUpperCase() : 'FEDERAL'}
              </span>
            </div>

            <h2 className="state-name-display">{selectedState.nombre}</h2>
            
            <div className="state-capital-display">
              <MapPin size={15} color="var(--mexico-brown)" />
              <span>Capital: <strong>{selectedState.capital}</strong></span>
            </div>

            {lema && (
              <div 
                className="state-lema-quote" 
                onClick={() => handleCleanWebSearch(selectedState.nombre)}
                title={`Buscar más información sobre ${selectedState.nombre} en Google`}
              >
                «{lema}»
              </div>
            )}
          </div>
        </div>

        {/* Métricas territoriales y geográficas */}
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-label">Población (2020)</div>
            <div className="stat-value">{formatPopulation(selectedState.poblacion)}</div>
          </div>

          <div className="stat-box">
            <div className="stat-label">Superficie</div>
            <div className="stat-value">{formatArea(selectedState.superficie)}</div>
          </div>

          <div className="stat-box">
            <div className="stat-label">Huso Horario</div>
            <div className="stat-value" style={{ fontSize: '0.74rem', wordBreak: 'break-all' }}>
              {selectedState.huso || 'America/Mexico_City'}
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-label">Clima Predominante</div>
            <div className="stat-value" style={{ fontSize: '0.76rem' }}>
              {tourism.clima ? tourism.clima.split('(')[0].trim() : 'Templado'}
            </div>
          </div>
        </div>

        {/* Resumen geográfico e histórico extenso */}
        {resumen && (
          <div 
            className="state-summary-card"
            onClick={() => handleCleanWebSearch(selectedState.nombre)}
            title={`Buscar historia de ${selectedState.nombre} en Google`}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--mexico-brown)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '3px' }}>
                  Perfil del Estado
                </span>
                <p style={{ margin: 0 }}>{resumen}</p>
              </div>
              <ExternalLink size={14} style={{ flexShrink: 0, color: 'var(--mexico-terracotta)', marginTop: '4px' }} />
            </div>
          </div>
        )}

        {/* Sección de arquitectura turística estructurada con tarjetas enriquecidas */}
        <div className="tourism-section">
          <div className="tourism-header-bar">
            <span className="tourism-header-title">Patrimonio, Lugares y Cocina</span>
            <Sparkles size={15} color="var(--mexico-gold)" />
          </div>

          <div className="tourism-tabs" role="tablist">
            <button
              type="button"
              className={`tourism-tab-btn ${activeTab === 'destinos' ? 'active' : ''}`}
              onClick={() => setActiveTab('destinos')}
              role="tab"
              aria-selected={activeTab === 'destinos'}
            >
              Destinos ({tourism.destinos.length + (tourism.playas ? tourism.playas.length : 0)})
            </button>
            <button
              type="button"
              className={`tourism-tab-btn ${activeTab === 'magicos' ? 'active' : ''}`}
              onClick={() => setActiveTab('magicos')}
              role="tab"
              aria-selected={activeTab === 'magicos'}
            >
              Pueblos ({tourism.pueblosMagicos ? tourism.pueblosMagicos.length : 0})
            </button>
            <button
              type="button"
              className={`tourism-tab-btn ${activeTab === 'arqueologia' ? 'active' : ''}`}
              onClick={() => setActiveTab('arqueologia')}
              role="tab"
              aria-selected={activeTab === 'arqueologia'}
            >
              Historia ({tourism.arqueologia ? tourism.arqueologia.length : 0})
            </button>
            <button
              type="button"
              className={`tourism-tab-btn ${activeTab === 'gastronomia' ? 'active' : ''}`}
              onClick={() => setActiveTab('gastronomia')}
              role="tab"
              aria-selected={activeTab === 'gastronomia'}
            >
              Cocina ({tourism.gastronomia ? tourism.gastronomia.length : 0})
            </button>
          </div>

          <div className="tourism-tab-content">
            {/* Pestaña Destinos y Playas */}
            {activeTab === 'destinos' && (
              <div className="rich-place-cards-list">
                {tourism.destinos.map((dest, idx) => {
                  const name = typeof dest === 'string' ? dest : dest.nombre;
                  const desc = typeof dest === 'string' ? 'Destino turístico emblemático del estado.' : dest.descripcion;
                  const img = dest.imagen || MEXICAN_PHOTOS.canon_sumidero;
                  return (
                    <div 
                      key={idx} 
                      className="rich-place-card"
                      onClick={() => handleLocationClick(dest, 'Destino Turístico')}
                      title={`Ver ${name} en Google Maps con fotos e información`}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="rich-place-thumb">
                        <img src={img} alt={name} />
                      </div>
                      <div className="rich-place-content">
                        <div className="rich-place-title-row">
                          <span className="rich-place-name">{name}</span>
                          <span className="rich-place-badge map">Maps</span>
                        </div>
                        <p className="rich-place-desc">{desc}</p>
                      </div>
                    </div>
                  );
                })}

                {tourism.playas && tourism.playas.length > 0 && (
                  tourism.playas.map((playa, idx) => {
                    const name = typeof playa === 'string' ? playa : playa.nombre;
                    const desc = typeof playa === 'string' ? 'Hermosa zona costera con aguas del litoral mexicano.' : playa.descripcion;
                    const img = playa.imagen || MEXICAN_PHOTOS.tulum;
                    return (
                      <div 
                        key={`pl-${idx}`} 
                        className="rich-place-card"
                        onClick={() => handleLocationClick(playa, 'Playa')}
                        title={`Ver ${name} en Google Maps con fotos e información`}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="rich-place-thumb">
                          <img src={img} alt={name} />
                        </div>
                        <div className="rich-place-content">
                          <div className="rich-place-title-row">
                            <span className="rich-place-name">{name}</span>
                            <span className="rich-place-badge beach">Playa</span>
                          </div>
                          <p className="rich-place-desc">{desc}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Pestaña Pueblos Mágicos */}
            {activeTab === 'magicos' && (
              <div className="rich-place-cards-list">
                {tourism.pueblosMagicos && tourism.pueblosMagicos.length > 0 ? (
                  tourism.pueblosMagicos.map((pueblo, idx) => {
                    const name = typeof pueblo === 'string' ? pueblo : pueblo.nombre;
                    const desc = typeof pueblo === 'string' ? 'Pueblo de arraigadas tradiciones y arquitectura colonial.' : pueblo.descripcion;
                    const img = pueblo.imagen || MEXICAN_PHOTOS.pueblo_colonial;
                    return (
                      <div 
                        key={idx} 
                        className="rich-place-card"
                        onClick={() => handleLocationClick(pueblo, 'Pueblo Mágico')}
                        title={`Ver ${name} en Google Maps con fotos e información`}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="rich-place-thumb">
                          <img src={img} alt={name} />
                        </div>
                        <div className="rich-place-content">
                          <div className="rich-place-title-row">
                            <span className="rich-place-name">★ {name}</span>
                            <span className="rich-place-badge magic">Pueblo Mágico</span>
                          </div>
                          <p className="rich-place-desc">{desc}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-tab-hint">Sin denominación de Pueblo Mágico registrada.</div>
                )}
              </div>
            )}

            {/* Pestaña Historia y Arqueología */}
            {activeTab === 'arqueologia' && (
              <div className="rich-place-cards-list">
                {tourism.arqueologia && tourism.arqueologia.length > 0 ? (
                  tourism.arqueologia.map((zona, idx) => {
                    const name = typeof zona === 'string' ? zona : zona.nombre;
                    const desc = typeof zona === 'string' ? 'Zona de inestimable valor arqueológico e histórico.' : zona.descripcion;
                    const img = zona.imagen || MEXICAN_PHOTOS.chichen_itza;
                    return (
                      <div 
                        key={idx} 
                        className="rich-place-card"
                        onClick={() => handleCleanWebSearch(name)}
                        title={`Buscar "${name}" en Google`}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="rich-place-thumb">
                          <img src={img} alt={name} />
                        </div>
                        <div className="rich-place-content">
                          <div className="rich-place-title-row">
                            <span className="rich-place-name">{name}</span>
                            <span className="rich-place-badge history">Buscar</span>
                          </div>
                          <p className="rich-place-desc">{desc}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-tab-hint">Sitios arqueológicos e históricos en catalogación continua.</div>
                )}
              </div>
            )}

            {/* Pestaña Cocina y Gastronomía */}
            {activeTab === 'gastronomia' && (
              <div className="rich-place-cards-list">
                {tourism.gastronomia && tourism.gastronomia.length > 0 ? (
                  tourism.gastronomia.map((platillo, idx) => {
                    const name = typeof platillo === 'string' ? platillo : platillo.nombre;
                    const desc = typeof platillo === 'string' ? 'Receta tradicional con ingredientes regionales de México.' : platillo.descripcion;
                    const img = platillo.imagen || MEXICAN_PHOTOS.tacos;
                    return (
                      <div 
                        key={idx} 
                        className="rich-place-card"
                        onClick={() => handleCleanWebSearch(name)}
                        title={`Buscar receta de "${name}" en Google`}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="rich-place-thumb">
                          <img src={img} alt={name} />
                        </div>
                        <div className="rich-place-content">
                          <div className="rich-place-title-row">
                            <span className="rich-place-name">{name}</span>
                            <span className="rich-place-badge food">Receta</span>
                          </div>
                          <p className="rich-place-desc">{desc}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-tab-hint">Gastronomía tradicional en recopilación.</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Estados colindantes con acceso rápido */}
        {neighborKeys.length > 0 && (
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--mexico-brown)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', fontWeight: 700 }}>
              Estados Colindantes
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {neighborKeys.map((cve) => {
                const nState = getEstadoByCve(cve);
                if (!nState) return null;
                return (
                  <button
                    key={cve}
                    type="button"
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--border-warm)',
                      borderRadius: '6px',
                      color: 'var(--text-main)',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      cursor: 'pointer',
                      transition: 'all 0.16s ease',
                      boxShadow: 'var(--shadow-warm-sm)'
                    }}
                    onClick={() => onSelectState(nState)}
                    title={`Ver estado de ${nState.nombreCorto}`}
                  >
                    {nState.nombreCorto}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Botón para ver la división municipal */}
        <button
          type="button"
          className="explore-action-btn"
          onClick={() => onExploreState(selectedState)}
          aria-label={`Ver división municipal de ${selectedState.nombre}`}
        >
          <Compass size={18} />
          <span>Explorar Municipios de {selectedState.nombreCorto}</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </aside>
  );
}
