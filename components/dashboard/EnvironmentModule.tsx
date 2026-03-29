'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useWeather, weatherCodeToLabel, weatherCodeToIcon } from '../../hooks/useWeather';
import { Wind, Droplets, Thermometer, Eye, AlertTriangle, CloudRain, Activity } from 'lucide-react';
import type { MapMarker } from './LeafletMap';

const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false });

const aqiTrend = [
  { time: '00:00', pm25: 48, pm10: 62, o3: 35 },
  { time: '03:00', pm25: 42, pm10: 55, o3: 30 },
  { time: '06:00', pm25: 58, pm10: 74, o3: 40 },
  { time: '09:00', pm25: 72, pm10: 88, o3: 52 },
  { time: '12:00', pm25: 65, pm10: 80, o3: 58 },
  { time: '15:00', pm25: 60, pm10: 76, o3: 55 },
  { time: '18:00', pm25: 80, pm10: 95, o3: 48 },
  { time: '21:00', pm25: 70, pm10: 85, o3: 42 },
];

const pollutants = [
  { name: 'PM2.5', value: 72, limit: 60, unit: 'µg/m³', status: 'warning' },
  { name: 'PM10', value: 88, limit: 100, unit: 'µg/m³', status: 'normal' },
  { name: 'O₃ (Ozone)', value: 55, limit: 100, unit: 'µg/m³', status: 'normal' },
  { name: 'NO₂', value: 38, limit: 40, unit: 'µg/m³', status: 'normal' },
  { name: 'SO₂', value: 20, limit: 20, unit: 'µg/m³', status: 'critical' },
  { name: 'CO', value: 8, limit: 10, unit: 'mg/m³', status: 'normal' },
];

const monitoringNodes: MapMarker[] = [
  { lat: 23.0380, lng: 72.5560, color: '#ef476f', label: 'Node A (AQI 142)', pulse: true },
  { lat: 23.0100, lng: 72.5850, color: '#ffd166', label: 'Node B (AQI 88)', pulse: false },
  { lat: 23.0530, lng: 72.6200, color: '#06d6a0', label: 'Node C (AQI 42)', pulse: false },
  { lat: 23.0650, lng: 72.5400, color: '#ef476f', label: 'Node D (AQI 156)', pulse: true },
  { lat: 22.9950, lng: 72.6100, color: '#06d6a0', label: 'Node E (AQI 38)', pulse: false },
];

const statusColor: Record<string, string> = { normal: '#06d6a0', warning: '#ffd166', critical: '#ef476f' };
const TT = { contentStyle: { background: 'oklch(0.12 0.02 250)', border: '1px solid rgba(0,180,216,0.3)', borderRadius: 8 }, labelStyle: { color: '#00b4d8' }, itemStyle: { color: '#e0f0ff' } };

function AQIGauge({ value }: { value: number }) {
  const pct = Math.min(value / 300, 1);
  const color = value < 50 ? '#06d6a0' : value < 100 ? '#ffd166' : value < 150 ? '#f4a261' : '#ef476f';
  const label = value < 50 ? 'Good' : value < 100 ? 'Moderate' : value < 150 ? 'Unhealthy' : 'Very Unhealthy';
  return (
    <div style={{ textAlign: 'center', padding: '10px 0' }}>
      <div style={{ position: 'relative', width: 140, height: 80, margin: '0 auto' }}>
        <svg viewBox="0 0 160 90" style={{ width: '100%', height: '100%' }}>
          <path d="M 10 80 A 70 70 0 0 1 150 80" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" strokeLinecap="round" />
          <path d="M 10 80 A 70 70 0 0 1 150 80" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
            strokeDasharray={`${pct * 219.9} 219.9`} style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 8px ${color}60)` }} />
        </svg>
        <div style={{ position: 'absolute', bottom: 4, left: 0, right: 0, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 900, color, letterSpacing: '-0.02em' }}>{value}</div>
          <div style={{ fontSize: 10, color: 'oklch(0.50 0.02 240)', fontWeight: 700 }}>AQI SCORE</div>
        </div>
      </div>
      <span className="badge" style={{ background: `${color}15`, color, border: `1px solid ${color}30`, marginTop: 8 }}>{label.toUpperCase()}</span>
    </div>
  );
}

export default function EnvironmentModule() {
  const weather = useWeather();

  return (
    <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#f0f8ff', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, rgba(6,214,160,0.2), rgba(6,214,160,0.1))', border: '1px solid rgba(6,214,160,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wind size={22} color="#06d6a0" strokeWidth={2.5} />
            </div>
            Environmental Monitoring
          </h2>
          <p style={{ color: 'oklch(0.55 0.02 240)', fontSize: 13, margin: '6px 0 0 56px' }}>Atmospheric analysis and pollutant tracking via Open-Meteo SDK</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
           <span className="badge badge-critical blink">2 NODES CRITICAL</span>
           <span className="badge badge-info">5 SENSORS ACTIVE</span>
        </div>
      </div>

      {/* Stats Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { icon: Thermometer, label: 'Temperature', value: weather.loading ? '—' : `${weather.temperature}°C`, color: '#f4a261' },
          { icon: Droplets, label: 'Humidity', value: weather.loading ? '–' : `${weather.humidity}%`, color: '#00b4d8' },
          { icon: Wind, label: 'Wind Speed', value: weather.loading ? '–' : `${weather.windspeed} km/h`, color: '#48cae4' },
          { icon: CloudRain, label: 'Precipitation', value: '0.0 mm', color: '#06d6a0' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="glass-card" style={{ padding: 20, background: `${color}08`, borderColor: `${color}25` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Icon size={16} color={color} />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'oklch(0.50 0.02 240)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
              <span className="live-dot" style={{ marginLeft: 'auto' }} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color, letterSpacing: '-0.02em' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Tactical Environmental View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
         {/* Map Panel */}
         <div className="glass-card" style={{ padding: 0, overflow: 'hidden', position: 'relative', height: 400, borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', borderRadius: 10, padding: '8px 14px', border: '1px solid rgba(6,214,160,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
               <Activity size={14} color="#06d6a0" />
               <span style={{ fontSize: 11, color: '#e0f0ff', fontWeight: 700, letterSpacing: '0.02em' }}>LIVE AIR QUALITY MAPPING</span>
            </div>
            <LeafletMap
              lat={23.0225}
              lng={72.5714}
              zoom={12}
              height={400}
              markers={monitoringNodes}
            />
         </div>

         {/* Info Card Sidebar */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="glass-card" style={{ padding: 20 }}>
               <h3 style={{ fontSize: 13, fontWeight: 800, color: '#f0f8ff', marginBottom: 16 }}>ZONE ANALYSIS</h3>
               <AQIGauge value={72} />
               <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ padding: 12, background: 'rgba(239,71,111,0.08)', borderRadius: 10, border: '1px solid rgba(239,71,111,0.2)' }}>
                     <div style={{ fontSize: 10, fontWeight: 700, color: '#ef476f', marginBottom: 4 }}>CRITICAL ALERT</div>
                     <p style={{ fontSize: 11, color: 'oklch(0.75 0.01 240)', margin: 0, lineHeight: 1.4 }}>SO₂ levels at industrial nodes D & A exceed safety thresholds.</p>
                  </div>
                  <div style={{ padding: 12, background: 'rgba(255,180,216,0.05)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                     <div style={{ fontSize: 10, fontWeight: 700, color: 'oklch(0.50 0.02 240)', marginBottom: 4 }}>RECOMMENDATION</div>
                     <p style={{ fontSize: 11, color: 'oklch(0.65 0.02 240)', margin: 0, lineHeight: 1.4 }}>Activate industrial filtration units in Sector 7 & 4.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Detailed Analysis Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
         {/* Pollutants Breakdown */}
         <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#f0f8ff', marginBottom: 20 }}>Atmospheric Pollutants</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
               {pollutants.map(p => (
                 <div key={p.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                       <span style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>{p.name}</span>
                       <span style={{ fontSize: 13, fontWeight: 800, color: statusColor[p.status] }}>{p.value} {p.unit}</span>
                    </div>
                    <div className="progress-bar">
                       <div className="progress-fill" style={{ width: `${(p.value / p.limit) * 100}%`, background: statusColor[p.status] }} />
                    </div>
                    <div style={{ fontSize: 10, color: 'oklch(0.40 0.02 240)', marginTop: 4 }}>THRESHOLD: {p.limit} {p.unit}</div>
                 </div>
               ))}
            </div>
         </div>

         {/* Forecasting Charts */}
         <div className="glass-card" style={{ padding: 24, background: 'rgba(244,162,97,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
               <h3 style={{ fontSize: 15, fontWeight: 800, color: '#f0f8ff' }}>Hourly Temp Forecast</h3>
               <Activity size={14} color="#f4a261" />
            </div>
            {weather.todayForecast.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={weather.todayForecast}>
                  <defs>
                    <linearGradient id="tempG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f4a261" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f4a261" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} />
                  <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} />
                  <Tooltip {...TT} />
                  <Area type="monotone" dataKey="temp" stroke="#f4a261" strokeWidth={2.5} fill="url(#tempG)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="skeleton" style={{ width: '100%', height: 220, borderRadius: 16 }} />
            )}
         </div>
      </div>
    </div>
  );
}
