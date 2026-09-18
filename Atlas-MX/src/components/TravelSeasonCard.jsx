import React from 'react';
import { CalendarRange, Info } from 'lucide-react';
import { getTravelSeason } from '../data/travelSeasons';

const MONTHS = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export default function TravelSeasonCard({ stateCode }) {
  const season = getTravelSeason(stateCode);
  const currentMonth = new Date().getMonth() + 1;

  return (
    <section className="travel-season-card" aria-label="Mejor época para viajar">
      <div className="travel-season-head">
        <span><CalendarRange size={14} /> Mejor época para viajar</span>
        <strong>{season.window}</strong>
      </div>
      <div className="travel-months" aria-label={`Meses recomendados: ${season.window}`}>
        {MONTHS.map((month, index) => {
          const number = index + 1;
          return <span key={`${month}-${number}`} className={`${season.bestMonths.includes(number) ? 'recommended' : ''} ${currentMonth === number ? 'current' : ''}`} title={`${season.bestMonths.includes(number) ? 'Recomendado' : 'Temporada variable'}${currentMonth === number ? ' · Mes actual' : ''}`}>{month}</span>;
        })}
      </div>
      <p>{season.reason}</p>
      <small><Info size={11} /> {season.note} Es una guía climática general; consulta el pronóstico antes del viaje.</small>
    </section>
  );
}
