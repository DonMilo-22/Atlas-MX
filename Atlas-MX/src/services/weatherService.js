/**
 * Atlas MX — clima en vivo con Open-Meteo (gratuito, sin API key).
 * https://open-meteo.com/en/docs
 */
import { CAPITAL_COORDS } from '../data/capitals.js';

const TTL_MS = 30 * 60 * 1000;
const cache = new Map();
const pending = new Map();

// Códigos meteorológicos WMO → descripción e ícono.
const WMO = [
  [[0], 'Despejado', 'sun'],
  [[1], 'Mayormente despejado', 'sun'],
  [[2], 'Parcialmente nublado', 'cloud-sun'],
  [[3], 'Nublado', 'cloud'],
  [[45, 48], 'Niebla', 'fog'],
  [[51, 53, 55, 56, 57], 'Llovizna', 'drizzle'],
  [[61, 63, 65, 66, 67, 80, 81, 82], 'Lluvia', 'rain'],
  [[71, 73, 75, 77, 85, 86], 'Nieve', 'snow'],
  [[95, 96, 99], 'Tormenta eléctrica', 'storm']
];

export function describeWeather(code) {
  const match = WMO.find(([codes]) => codes.includes(code));
  return match ? { label: match[1], icon: match[2] } : { label: 'Variable', icon: 'cloud' };
}

/**
 * Clima actual y pronóstico de 7 días de la capital del estado.
 * @returns {Promise<{current: {temp, feels, code, wind, humidity, isDay}, daily: Array<{date, max, min, code, rain}>, fetchedAt: number} | null>}
 */
export async function fetchStateWeather(stateCode) {
  const coords = CAPITAL_COORDS[stateCode];
  if (!coords) return null;
  const hit = cache.get(stateCode);
  if (hit && Date.now() - hit.fetchedAt < TTL_MS) return hit;
  if (pending.has(stateCode)) return pending.get(stateCode);

  const params = new URLSearchParams({
    latitude: String(coords[0]),
    longitude: String(coords[1]),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '7'
  });

  const request = fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      const c = data.current || {};
      const d = data.daily || {};
      const result = {
        current: {
          temp: Math.round(c.temperature_2m),
          feels: Math.round(c.apparent_temperature),
          humidity: c.relative_humidity_2m,
          wind: Math.round(c.wind_speed_10m),
          code: c.weather_code,
          isDay: c.is_day === 1
        },
        daily: (d.time || []).map((date, index) => ({
          date,
          max: Math.round(d.temperature_2m_max?.[index]),
          min: Math.round(d.temperature_2m_min?.[index]),
          code: d.weather_code?.[index],
          rain: d.precipitation_probability_max?.[index] ?? null
        })),
        fetchedAt: Date.now()
      };
      cache.set(stateCode, result);
      return result;
    })
    .catch(() => null)
    .finally(() => pending.delete(stateCode));

  pending.set(stateCode, request);
  return request;
}
