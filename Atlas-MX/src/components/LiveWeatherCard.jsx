import React from 'react';
import { useStateWeather } from '../hooks/useLiveData';
import { describeWeather } from '../services/weatherService';
import WeatherIcon from './WeatherIcon';

const dayName = new Intl.DateTimeFormat('es-MX', { weekday: 'short' });

export default function LiveWeatherCard({ stateCode, capital }) {
  const { data, isLoading } = useStateWeather(stateCode);

  if (isLoading) return <section className="sp-section live-weather is-skeleton" aria-busy="true" aria-label="Cargando clima"><span className="skeleton-line wide" /><span className="skeleton-line" /></section>;
  if (!data) return null;

  const now = describeWeather(data.current.code);
  return (
    <section className="sp-section live-weather" aria-label={`Clima ahora en ${capital}`}>
      <div className="live-weather-now">
        <WeatherIcon icon={now.icon} isDay={data.current.isDay} size={26} />
        <strong>{data.current.temp}°</strong>
        <span><b>{now.label} en {capital}</b><small><span className="live-dot" aria-hidden="true" /> En vivo: sensación de {data.current.feels}°, humedad {data.current.humidity}%</small></span>
      </div>
      <ol className="live-weather-days" aria-label="Pronóstico de 7 días">
        {data.daily.map((day, index) => {
          const info = describeWeather(day.code);
          const label = index === 0 ? 'Hoy' : dayName.format(new Date(`${day.date}T12:00:00`)).replace('.', '');
          return (
            <li key={day.date} title={`${info.label}${day.rain != null ? `, ${day.rain}% de probabilidad de lluvia` : ''}`}>
              <small>{label}</small>
              <WeatherIcon icon={info.icon} size={15} />
              <b>{day.max}°</b>
              <span>{day.min}°</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
