'use client';

import { useState, useEffect } from 'react';

export interface WeatherData {
  temperature: number;
  minTemp: number;
  maxTemp: number;
  humidity: number;
  windspeed: number;
  weathercode: number;
  hourlyForecast: { time: string; temp: number; hour: number }[];
  todayForecast: { time: string; temp: number }[];
  loading: boolean;
  error: string | null;
  lastUpdated: string;
}

// Ahmedabad exact coordinates from the API response
const LAT = 23.0;
const LON = 72.625;

export function useWeather(): WeatherData {
  const [data, setData] = useState<WeatherData>({
    temperature: 0,
    minTemp: 0,
    maxTemp: 0,
    humidity: 55,
    windspeed: 0,
    weathercode: 0,
    hourlyForecast: [],
    todayForecast: [],
    loading: true,
    error: null,
    lastUpdated: '',
  });

  const fetchWeather = async () => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&hourly=temperature_2m&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&forecast_days=7&timezone=Asia%2FKolkata`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      const times: string[] = json.hourly.time;
      const temps: number[] = json.hourly.temperature_2m;

      // Get current temperature from the `current` block
      const currentTemp: number = Math.round(json.current.temperature_2m * 10) / 10;
      const humidity: number = json.current.relative_humidity_2m ?? 55;
      const windspeed: number = json.current.wind_speed_10m ?? 0;
      const weathercode: number = json.current.weather_code ?? 0;

      // Find "today" slice (first 24 entries)
      const todayTemps = temps.slice(0, 24);
      const minTemp = Math.min(...todayTemps);
      const maxTemp = Math.max(...todayTemps);

      // Build next-24h forecast from current hour
      const nowHour = new Date().getHours();
      const todayDateStr = times[0].slice(0, 10); // e.g. "2026-03-29"
      const currentHourStr = `${todayDateStr}T${String(nowHour).padStart(2, '0')}:00`;
      let startIdx = times.findIndex(t => t === currentHourStr);
      if (startIdx === -1) startIdx = 0;

      const todayForecast = times.slice(startIdx, startIdx + 24).map((t, i) => {
        const hourLabel = t.slice(11, 16); // "HH:mm"
        return { time: hourLabel, temp: Math.round(temps[startIdx + i] * 10) / 10 };
      });

      // Full hourly array for charts
      const hourlyForecast = times.slice(0, 168).map((t, i) => ({
        time: t.slice(11, 16),
        temp: Math.round(temps[i] * 10) / 10,
        hour: parseInt(t.slice(11, 13), 10),
      }));

      setData({
        temperature: currentTemp,
        minTemp: Math.round(minTemp * 10) / 10,
        maxTemp: Math.round(maxTemp * 10) / 10,
        humidity,
        windspeed: Math.round(windspeed * 10) / 10,
        weathercode,
        hourlyForecast,
        todayForecast,
        loading: false,
        error: null,
        lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
      });
    } catch (err: unknown) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch weather',
      }));
    }
  };

  useEffect(() => {
    fetchWeather();
    const id = setInterval(fetchWeather, 10 * 60 * 1000); // refresh every 10 min
    return () => clearInterval(id);
  }, []);

  return data;
}

export function weatherCodeToLabel(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 9) return 'Overcast';
  if (code <= 19) return 'Foggy';
  if (code <= 29) return 'Drizzle';
  if (code <= 39) return 'Rainy';
  if (code <= 49) return 'Freezing Drizzle';
  if (code <= 59) return 'Heavy Rain';
  if (code <= 69) return 'Snow';
  if (code <= 79) return 'Rain Showers';
  if (code <= 89) return 'Thunderstorm';
  return 'Severe Storm';
}

export function weatherCodeToIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 9) return '☁️';
  if (code <= 19) return '🌫️';
  if (code <= 39) return '🌧️';
  if (code <= 59) return '🌧️';
  if (code <= 79) return '🌨️';
  if (code <= 89) return '⛈️';
  return '🌪️';
}

export function weatherCodeToColor(code: number): string {
  if (code === 0) return '#ffd166';       // sunny - yellow
  if (code <= 3) return '#00b4d8';         // partly cloudy - blue
  if (code <= 9) return '#6b7280';         // overcast - grey
  if (code <= 29) return '#48cae4';        // rain - cyan
  if (code <= 79) return '#7c3aed';        // heavy/snow - purple
  return '#ef476f';                        // storm - red
}
