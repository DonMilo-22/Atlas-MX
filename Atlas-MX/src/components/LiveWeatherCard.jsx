import React from 'react';
import { Droplets, RefreshCw, Wind } from 'lucide-react';
import { useStateWeather } from '../hooks/useLiveData';
import { describeWeather } from '../services/weatherService';
import WeatherIcon from './WeatherIcon';

const dayName = new Intl.DateTimeFormat('es-MX', { weekday: 'short' });

export default function LiveWeatherCard({ stateCode, capital }) {
  const { data, isLoading } = useStateWeather(stateCode);

  if (isLoading) {
    return <section className="live-weather-card is-skeleton" aria-busy="true" aria-label="Cargando clima"><div className="skeleton-line wide" /><div className="skeleton-line" /></section>;
  }
  if (!data) return null;

  const now = describeWeather(data.current.code);
  return (
    <section className="live-weather-card" aria-label={`Clima ahora en ${capital}`}>
      <div className="live-weather-head">
        <span className="live-badge"><span className="live-dot" aria-hidden="true" /> En vivo</span>
        <span className="live-weather-place">Ahora en {capital}</span>
      </div>
      <div className="live-weather-now">
        <WeatherIcon icon={now.icon} isDay={data.current.isDay} size={34} />
        <strong>{data.current.temp}°</strong>
        <span><b>{now.label}</b><small>Sensación {data.current.feels}° · <Droplets size={11} aria-hidden="true" /> {data.current.humidity}% · <Wind size={11} aria-hidden="true" /> {data.current.wind} km/h</small></span>
      </div>
      <ol className="live-weather-days" aria-label="Pronóstico de 7 días">
        {data.daily.map((day, index) => {
          const info = describeWeather(day.code);
          const label = index === 0 ? 'Hoy' : dayName.format(new Date(`${day.date}T12:00:00`)).replace('.', '');
          return (
            <li key={day.date} title={`${info.label}${day.rain != null ? ` · ${day.rain}% de lluvia` : ''}`}>
              <small>{label}</small>
              <WeatherIcon icon={info.icon} size={16} />
              <b>{day.max}°</b>
              <span>{day.min}°</span>
            </li>
          );
        })}
      </ol>
      <small className="live-source"><RefreshCw size={10} aria-hidden="true" /> Datos de Open-Meteo, actualizados cada 30 min.</small>
    </section>
  );
}
