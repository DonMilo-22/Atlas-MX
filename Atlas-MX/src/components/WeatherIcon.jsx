import React from 'react';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Moon, Sun } from 'lucide-react';

const ICONS = { sun: Sun, 'cloud-sun': CloudSun, cloud: Cloud, fog: CloudFog, drizzle: CloudDrizzle, rain: CloudRain, snow: CloudSnow, storm: CloudLightning };

export default function WeatherIcon({ icon, isDay = true, size = 18, ...props }) {
  const Icon = !isDay && icon === 'sun' ? Moon : (ICONS[icon] || Cloud);
  return <Icon size={size} aria-hidden="true" {...props} />;
}
