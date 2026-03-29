'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { Car, MapPin, Clock, TrendingUp, Navigation, Activity, Zap, Bus } from 'lucide-react';
import type { MapMarker } from './LeafletMap';

const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false });

const corridors = [
  { corridor: 'Main St', congestion: 82, vehicles: 1850, status: 'critical', speed: 12, lat: 23.0380, lng: 72.5560 },
  { corridor: 'Highway 1', congestion: 45, vehicles: 2100, status: 'normal', speed: 68, lat: 23.0650, lng: 72.5400 },
  { corridor: 'Downtown', congestion: 74, vehicles: 890, status: 'warning', speed: 22, lat: 23.0225, lng: 72.5714 },
  { corridor: 'North Ave', congestion: 38, vehicles: 650, status: 'normal', speed: 75, lat: 23.0100, lng: 72.5850 },
  { corridor: 'East Blvd', congestion: 67, vehicles: 1500, status: 'warning', speed: 34, lat: 23.0530, lng: 72.6200 },
  { corridor: 'Ring Road', congestion: 28, vehicles: 3200, status: 'normal', speed: 95, lat: 22.9950, lng: 72.6100 },
];

const hourlyFlow = [
  { time: '06:00', cars: 620, buses: 45, bikes: 180 },
  { time: '08:00', cars: 1850, buses: 120, bikes: 420 },
  { time: '10:00', cars: 1100, buses: 85, bikes: 280 },
  { time: '12:00', cars: 980, buses: 90, bikes: 310 },
  { time: '14:00', cars: 860, buses: 75, bikes: 240 },
  { time: '16:00', cars: 1450, buses: 110, bikes: 380 },
  { time: '18:00', cars: 2100, buses: 140, bikes: 510 },
  { time: '20:00', cars: 1200, buses: 70, bikes: 220 },
];

const busRoutes = [
  { route: 'Route 42', location: 'Station 7 → CBD', status: 'On Time', delay: 0, passengers: 148 },
  { route: 'Route 15', location: 'Airport → Hub', status: 'Delayed', delay: 8, passengers: 95 },
  { route: 'Metro L1', location: 'East Line', status: 'On Time', delay: 0, passengers: 413 },
  { route: 'Route 88', location: 'North Loop', status: 'Delayed', delay: 12, passengers: 67 },
  { route: 'Metro L2', location: 'West Line', status: 'On Time', delay: 0, passengers: 388 },
];

const statusColor: Record<string, string> = { critical: '#ef476f', warning: '#ffd166', normal: '#06d6a0' };
const TT = { contentStyle: { background: 'oklch(0.12 0.02 250)', border: '1px solid rgba(0,180,216,0.3)', borderRadius: 8 }, labelStyle: { color: '#00b4d8' }, itemStyle: { color: '#e0f0ff' } };

// Transform data for Nivo
const nivoLineData = [
  { id: 'Cars', color: '#00b4d8', data: hourlyFlow.map(d => ({ x: d.time, y: d.cars })) },
  { id: 'Buses', color: '#ffd166', data: hourlyFlow.map(d => ({ x: d.time, y: d.buses })) },
  { id: 'Bikes', color: '#06d6a0', data: hourlyFlow.map(d => ({ x: d.time, y: d.bikes })) }
];

export default function TrafficModule() {
  const [selectedCorridor, setSelectedCorridor] = useState(corridors[0]);

  const trafficMarkers: MapMarker[] = useMemo(() => corridors.map(c => ({
    lat: c.lat,
    lng: c.lng,
    color: statusColor[c.status],
    label: `${c.corridor} (${c.congestion}%)`,
    pulse: c.status === 'critical',
    popupHtml: `<b style="color:${statusColor[c.status]}">${c.corridor}</b><br/>Congestion: ${c.congestion}%<br/>Avg Speed: ${c.speed} km/h`
  })), []);

  return (
    <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#f0f8ff', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, rgba(0,180,216,0.2), rgba(0,180,216,0.1))', border: '1px solid rgba(0,180,216,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Car size={22} color="#00b4d8" strokeWidth={2.5} />
            </div>
            Mobility & Traffic Control
          </h2>
          <p style={{ color: 'oklch(0.55 0.02 240)', fontSize: 13, margin: '6px 0 0 56px' }}>Real-time spatial analysis of city-wide transit corridors</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <span className="badge badge-critical blink">1 HEAVY CONGESTION</span>
          <span className="badge badge-info">2 NODES MONITORED</span>
        </div>
      </div>

      {/* Grid: Map + stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Animated Map Panel */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden', position: 'relative', height: 440, borderRadius: 20 }}>
          <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', borderRadius: 10, padding: '10px 16px', border: '1px solid rgba(0,180,216,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
             <div className="live-dot" />
             <span style={{ fontSize: 11, fontWeight: 700, color: '#00b4d8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Traffic Density</span>
          </div>

          {/* Map Overlay Stats */}
          <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 1000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', borderRadius: 12, padding: 18, border: '1px solid rgba(255,255,255,0.1)', width: 240 }}>
             <div style={{ fontSize: 12, fontWeight: 800, color: '#cbd5e1', marginBottom: 12 }}>CURRENT FOCUS: {selectedCorridor.corridor}</div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: 'oklch(0.50 0.02 240)' }}>CONGESTION</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: statusColor[selectedCorridor.status] }}>{selectedCorridor.congestion}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${selectedCorridor.congestion}%`, background: statusColor[selectedCorridor.status] }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                   <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: 9, color: 'oklch(0.40 0.02 240)' }}>SPEED</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{selectedCorridor.speed}<span style={{ fontSize: 9, marginLeft: 2 }}>KM/H</span></div>
                   </div>
                   <div style={{ padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: 9, color: 'oklch(0.40 0.02 240)' }}>VOLUME</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{selectedCorridor.vehicles}</div>
                   </div>
                </div>
             </div>
          </div>

          <LeafletMap
            lat={selectedCorridor.lat}
            lng={selectedCorridor.lng}
            zoom={15}
            height={440}
            markers={trafficMarkers}
          />
        </div>

        {/* Corridor List */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
           <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontWeight: 800, fontSize: 11, color: 'oklch(0.50 0.02 240)', letterSpacing: '0.08em' }}>SELECT CORRIDOR</div>
           <div style={{ maxHeight: 375, overflowY: 'auto' }}>
              {corridors.map((c, i) => (
                <div key={i} onClick={() => setSelectedCorridor(c)} style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                  background: selectedCorridor.corridor === c.corridor ? 'rgba(0,180,216,0.08)' : 'transparent',
                  borderLeft: `4px solid ${selectedCorridor.corridor === c.corridor ? statusColor[c.status] : 'transparent'}`,
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ fontSize: 14, fontWeight: 700, color: '#e0f0ff' }}>{c.corridor}</span>
                     <span style={{ fontSize: 10, fontWeight: 700, color: statusColor[c.status] }}>{c.congestion}%</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                     <span style={{ fontSize: 11, color: 'oklch(0.45 0.02 240)' }}>{c.vehicles} vehicles</span>
                     <span style={{ fontSize: 11, color: 'oklch(0.45 0.02 240)' }}>•</span>
                     <span style={{ fontSize: 11, color: 'oklch(0.45 0.02 240)' }}>{c.speed} km/h</span>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Transit tracking */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { icon: Car, label: 'Congestion Index', value: '42.8%', color: '#ffd166' },
          { icon: Bus, label: 'Buses Active', value: '942/1050', color: '#06d6a0' },
          { icon: Activity, label: 'System Uptime', value: '99.98%', color: '#00b4d8' },
          { icon: Navigation, label: 'Navigation Nodes', value: '1,280', color: '#7c3aed' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="glass-card" style={{ padding: 20, background: `${color}08`, borderColor: `${color}25` }}>
             <Icon size={18} color={color} style={{ marginBottom: 12 }} />
             <div style={{ fontSize: 11, fontWeight: 700, color: 'oklch(0.45 0.02 240)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
             <div style={{ fontSize: 24, fontWeight: 900, color, marginTop: 4 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Analytics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
         {/* Live Flow Chart */}
         <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#f0f8ff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
               <Activity size={16} color="#00b4d8" /> Hourly Mobility Demand
            </h3>
            <div style={{ height: 260 }}>
              <ResponsiveLine
                data={nivoLineData}
                margin={{ top: 10, right: 30, bottom: 40, left: 50 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'TIME OF DAY', legendOffset: 30, legendPosition: 'middle' }}
                axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'VEHICLE COUNT', legendOffset: -40, legendPosition: 'middle' }}
                colors={(d) => d.color}
                pointSize={6}
                pointColor={{ from: 'color' }}
                pointBorderWidth={3}
                pointBorderColor={{ from: 'serieColor' }}
                useMesh={true}
                enableGridX={false}
                theme={{
                  background: 'transparent',
                  text: { fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 },
                  axis: { domain: { line: { stroke: 'rgba(255,255,255,0.1)' } } },
                  grid: { line: { stroke: 'rgba(255,255,255,0.05)' } }
                }}
              />
            </div>
         </div>

         {/* Transit Status */}
         <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#f0f8ff', marginBottom: 20 }}>🚌 Smart Transit Feed</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
               {busRoutes.map((r, i) => (
                 <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                       <div style={{ width: 40, height: 40, borderRadius: 10, background: r.delay > 0 ? 'rgba(255,209,102,0.1)' : 'rgba(0,180,216,0.1)', border: `1px solid ${r.delay > 0 ? '#ffd16640' : '#00b4d840'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: r.delay > 0 ? '#ffd166' : '#00b4d8', fontWeight: 800 }}>{r.route.slice(0, 1)}</div>
                       <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{r.route}</div>
                          <div style={{ fontSize: 11, color: 'oklch(0.50 0.02 240)' }}>{r.location}</div>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: 12, fontWeight: 700, color: r.delay > 0 ? '#ffd166' : '#06d6a0' }}>{r.status.toUpperCase()}</div>
                       {r.delay > 0 && <div style={{ fontSize: 10, color: '#ef476f' }}>+{r.delay} MINS</div>}
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
