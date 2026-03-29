'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, AlertTriangle, Droplets, Zap, Car, Wind, TrendingUp, TrendingDown, MapPin, CloudSun, Check, Cpu, ShieldAlert, ZapOff } from 'lucide-react';
import type { MapMarker } from './LeafletMap';

const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false });

const energyData = [
  { time: '00:00', usage: 620 }, { time: '02:00', usage: 550 }, { time: '04:00', usage: 490 },
  { time: '06:00', usage: 680 }, { time: '08:00', usage: 820 }, { time: '10:00', usage: 910 },
  { time: '12:00', usage: 950 }, { time: '14:00', usage: 930 }, { time: '16:00', usage: 870 },
  { time: '18:00', usage: 1050 }, { time: '20:00', usage: 980 }, { time: '22:00', usage: 720 },
];

const systemHealth = [
  { name: 'Operational', value: 85, color: '#06d6a0' },
  { name: 'Warning', value: 10, color: '#ffd166' },
  { name: 'Critical', value: 5, color: '#ef476f' },
];

const kpis = [
  { label: 'City Health Score', value: '78', unit: '/100', icon: Activity, color: '#06d6a0', bg: 'rgba(6,214,160,0.08)', border: 'rgba(6,214,160,0.25)', trend: '+3', up: true, desc: 'Good standing' },
  { label: 'Active Alerts', value: '3', unit: '', icon: AlertTriangle, color: '#ef476f', bg: 'rgba(239,71,111,0.08)', border: 'rgba(239,71,111,0.25)', trend: '+1', up: false, desc: 'Needs attention' },
  { label: 'Traffic Index', value: '68', unit: '%', icon: Car, color: '#ffd166', bg: 'rgba(255,209,102,0.08)', border: 'rgba(255,209,102,0.25)', trend: '-5%', up: true, desc: 'Moderate flow' },
  { label: 'AQI Level', value: '62', unit: ' AQI', icon: Wind, color: '#00b4d8', bg: 'rgba(0,180,216,0.08)', border: 'rgba(0,180,216,0.25)', trend: '+2', up: false, desc: 'Moderate' },
  { label: 'Power Usage', value: '847', unit: ' MW', icon: Zap, color: '#f4a261', bg: 'rgba(244,162,97,0.08)', border: 'rgba(244,162,97,0.25)', trend: '-3%', up: true, desc: 'Below peak' },
  { label: 'Water Supply', value: '92', unit: '%', icon: Droplets, color: '#48cae4', bg: 'rgba(72,202,228,0.08)', border: 'rgba(72,202,228,0.25)', trend: '+1%', up: true, desc: 'Reservoir full' },
];

const alerts = [
  { type: 'Traffic Accident', location: 'Main St & 5th Ave', time: '8 min ago', sev: 'critical' },
  { type: 'AQI Spike', location: 'Industrial Zone North', time: '23 min ago', sev: 'warning' },
  { type: 'Power Fluctuation', location: 'Sector 7 Grid Station', time: '41 min ago', sev: 'warning' },
];

const mapMarkers: MapMarker[] = [
  { lat: 23.0380, lng: 72.5560, color: '#ef476f', label: 'Traffic Accident', pulse: true, popupHtml: '<b style="color:#ef476f">🚗 Traffic Accident</b><br/>Main St & 5th Ave<br/><small>8 min ago · CRITICAL</small>' },
  { lat: 23.0450, lng: 72.6100, color: '#ffd166', label: 'AQI Spike', pulse: true, popupHtml: '<b style="color:#ffd166">💨 AQI Spike</b><br/>Industrial Zone North<br/><small>23 min ago · WARNING</small>' },
  { lat: 23.0100, lng: 72.5900, color: '#06d6a0', label: 'Fire Station', pulse: false, popupHtml: '<b style="color:#06d6a0">🏥 Fire Station</b><br/>Station No. 7<br/><small>Operational</small>' },
  { lat: 23.0280, lng: 72.5300, color: '#00b4d8', label: 'AQI Sensor', pulse: false, popupHtml: '<b style="color:#00b4d8">📡 AQI Sensor</b><br/>Sector 4 Node<br/><small>AQI: 62 · Live</small>' },
  { lat: 23.0600, lng: 72.5714, color: '#ffd166', label: 'Power Alert', pulse: true, popupHtml: '<b style="color:#ffd166">⚡ Power Fluctuation</b><br/>Sector 7 Grid<br/><small>41 min ago · WARNING</small>' },
  { lat: 22.9950, lng: 72.6200, color: '#06d6a0', label: 'Hospital', pulse: false, popupHtml: '<b style="color:#06d6a0">🏥 City Hospital</b><br/>South Zone<br/><small>All systems normal</small>' },
];

const TT = { contentStyle: { background: 'oklch(0.12 0.02 250)', border: '1px solid rgba(0,180,216,0.3)', borderRadius: 8 }, labelStyle: { color: '#00b4d8' }, itemStyle: { color: '#e0f0ff' } };

export default function OverviewModule() {
  const [toast, setToast] = useState('');
  const [systemLoad, setSystemLoad] = useState(64);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Simulate dynamic load
  useEffect(() => {
    const itv = setInterval(() => {
      setSystemLoad(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(Math.max(prev + delta, 60), 85);
      });
    }, 4000);
    return () => clearInterval(itv);
  }, []);

  return (
    <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 110, right: 30, zIndex: 200, background: 'rgba(0,180,216,0.15)', border: '1px solid rgba(0,180,216,0.4)', borderRadius: 12, padding: '12px 20px', color: '#00b4d8', fontWeight: 700, fontSize: 13, backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Check size={14} /> {toast}
        </div>
      )}

      {/* Page title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f8ff', margin: 0, letterSpacing: '-0.02em' }}>City Overview</h2>
          <p style={{ color: 'oklch(0.50 0.02 240)', fontSize: 13, margin: '4px 0 0' }}>Real-time urban infrastructure monitoring • 9 sectors active</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" onClick={() => showToast('Historical data range updated.')}><span>Last 24h</span></button>
          <button className="btn-primary" onClick={() => showToast('Live satellite view engaged.')}><Activity size={13} />Live View</button>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {kpis.map(({ label, value, unit, icon: Icon, color, bg, border, trend, up, desc }, idx) => (
          <div 
            key={label} 
            className="glass-card kpi-card" 
            style={{ 
              background: bg, 
              borderColor: border,
              animation: `slideInUp 0.4s ease forwards ${idx * 0.1}s`,
              opacity: 0,
              padding: 22
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ 
                width: 44, 
                height: 44, 
                borderRadius: 12, 
                background: `${color}20`, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                border: `1px solid ${color}40`,
                boxShadow: `0 4px 12px ${color}20`
              }}>
                <Icon size={20} color={color} />
              </div>
              <span style={{ 
                fontSize: 11, 
                fontWeight: 600, 
                color: up ? '#06d6a0' : '#ef476f', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 3,
                padding: '3px 8px',
                borderRadius: 6,
                background: up ? 'rgba(6,214,160,0.1)' : 'rgba(239,71,111,0.1)'
              }}>
                {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}{trend}
              </span>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.02em' }}>
                {value}<span style={{ fontSize: 16, fontWeight: 500, color: 'oklch(0.55 0.02 240)', marginLeft: 2 }}>{unit}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'oklch(0.80 0.01 240)', marginTop: 6 }}>{label}</div>
              <div style={{ fontSize: 11, color: 'oklch(0.50 0.02 240)', marginTop: 3 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Map + Alerts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Real Leaflet Map */}
        <div className="glass-card" style={{ position: 'relative', overflow: 'hidden', padding: 0, minHeight: 400, borderRadius: 16 }}>
          <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 1000, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '6px 12px' }}>
            <span className="live-dot" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#e0f0ff' }}>Live City Map</span>
          </div>
          
          {/* Unique Command Center Overlay */}
          <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 1000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', borderRadius: 10, padding: 14, border: '1px solid rgba(0,180,216,0.3)', minWidth: 200 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Cpu size={16} color="#00b4d8" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#00b4d8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Infrastructure Core</span>
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 10, color: 'oklch(0.40 0.02 240)' }}>Processing Load</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: systemLoad > 80 ? '#ef476f' : '#06d6a0' }}>{systemLoad}%</span>
                   </div>
                   <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                      <div style={{ width: `${systemLoad}%`, height: '100%', background: systemLoad > 80 ? '#ef476f' : '#06d6a0', borderRadius: 2, transition: 'all 0.5s ease' }} />
                   </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                   <div style={{ padding: '6px 8px', background: 'rgba(0,180,216,0.1)', borderRadius: 6, border: '1px solid rgba(0,180,216,0.2)' }}>
                      <div style={{ fontSize: 8, color: '#00b4d8' }}>NODES</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>2,481</div>
                   </div>
                   <div style={{ padding: '6px 8px', background: 'rgba(124,58,237,0.1)', borderRadius: 6, border: '1px solid rgba(124,58,237,0.2)' }}>
                      <div style={{ fontSize: 8, color: '#a78bfa' }}>HEALTH</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>98.2%</div>
                   </div>
                </div>
             </div>
          </div>

          <LeafletMap
            lat={23.0225}
            lng={72.5714}
            zoom={12}
            height={400}
            markers={mapMarkers}
          />
        </div>

        {/* Alerts and Health */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#f0f8ff', marginBottom: 14 }}>🚨 Critical Alerts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {alerts.map((a, i) => (
                <div key={i} className={`incident-card ${a.sev}`} style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }} onClick={() => showToast(`Zooming into ${a.location}`)}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: a.sev === 'critical' ? '#ef476f' : '#ffd166' }}>{a.type}</div>
                  <div style={{ fontSize: 10, color: 'oklch(0.50 0.02 240)', marginTop: 4 }}>{a.location}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#f0f8ff', marginBottom: 14 }}>System Health</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <ResponsiveContainer width={80} height={80}>
                <PieChart>
                  <Pie data={systemHealth} cx="50%" cy="50%" innerRadius={24} outerRadius={36} dataKey="value" strokeWidth={0}>
                    {systemHealth.map((s, i) => <Cell key={i} fill={s.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {systemHealth.map(s => (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 1, background: s.color }} />
                    <span style={{ flex: 1, color: 'oklch(0.60 0.02 240)' }}>{s.name}</span>
                    <span style={{ fontWeight: 700, color: s.color }}>{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row: Weather + Citizen Pulse */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
        {/* Weather & AQI Detailed */}
        <div className="glass-card" style={{ padding: 24, background: 'linear-gradient(135deg, rgba(72,202,228,0.1), rgba(0,180,216,0.05))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,180,216,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CloudSun size={18} color="#00b4d8" />
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f0f8ff', margin: 0 }}>Climate & Air</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#e0f0ff' }}>24°C</div>
                <div style={{ fontSize: 12, color: 'oklch(0.50 0.02 240)' }}>Ahmedabad · Sunny</div>
              </div>
              <CloudSun size={48} color="#00b4d8" opacity={0.5} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                <div style={{ fontSize: 10, color: 'oklch(0.40 0.02 240)', marginBottom: 4 }}>HUMIDITY</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#06d6a0' }}>42%</div>
              </div>
              <div style={{ padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                <div style={{ fontSize: 10, color: 'oklch(0.40 0.02 240)', marginBottom: 4 }}>UV INDEX</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#ffd166' }}>High 7</div>
              </div>
            </div>
            
            <div className="glass-card" style={{ padding: 16, background: 'rgba(6,214,160,0.08)', borderColor: 'rgba(6,214,160,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#06d6a0' }}>AQI: Good</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#06d6a0' }}>62</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '62%', background: '#06d6a0' }} />
              </div>
              <p style={{ fontSize: 10, color: 'oklch(0.50 0.02 240)', margin: '8px 0 0' }}>Perfect for outdoor maintenance work.</p>
            </div>
          </div>
        </div>

        {/* Citizen Engagement Feed */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f0f8ff', margin: 0 }}>Citizen Pulse & Engagement</h3>
              <p style={{ fontSize: 12, color: 'oklch(0.50 0.02 240)', margin: '4px 0 0' }}>Real-time public sentiment and reports</p>
            </div>
            <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: 11 }} onClick={() => showToast('Navigating to Citizen Feedback module...')}>View All Feedback</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { user: 'Amit S.', msg: 'New metro line L2 is very efficient. Saves 15 mins!', time: '2m ago', score: 92, type: 'positive' },
              { user: 'Priya K.', msg: 'Traffic light at Sector 4 seems out of sync.', time: '14m ago', score: 45, type: 'negative' },
              { user: 'Vikram R.', msg: 'Public park Wi-Fi in North Zone is finally live.', time: '38m ago', score: 88, type: 'positive' },
            ].map((feed, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: 12, 
                padding: '12px 14px', 
                background: 'rgba(255,255,255,0.02)', 
                borderRadius: 12,
                border: `1px solid ${feed.type === 'positive' ? 'rgba(6,214,160,0.1)' : 'rgba(239,71,111,0.1)'}`,
                cursor: 'pointer'
              }} onClick={() => showToast(`Opening response thread for ${feed.user}`)}>
                <div style={{ 
                  width: 32, height: 32, borderRadius: 8, 
                  background: feed.type === 'positive' ? 'rgba(6,214,160,0.15)' : 'rgba(239,71,111,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: feed.type === 'positive' ? '#06d6a0' : '#ef476f',
                  flexShrink: 0
                }}>
                  {feed.user.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#e0f0ff' }}>{feed.user}</span>
                    <span style={{ fontSize: 10, color: 'oklch(0.40 0.02 240)' }}>{feed.time}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'oklch(0.65 0.02 240)', margin: 0 }}>{feed.msg}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: feed.type === 'positive' ? '#06d6a0' : '#ef476f' }}>{feed.score}%</div>
                  <div style={{ fontSize: 9, color: 'oklch(0.40 0.02 240)', textTransform: 'uppercase' }}>TRUST</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Energy and Quick Stats Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* City Energy Consumption */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f0f8ff', margin: 0 }}>Energy Consumption (24h)</h3>
              <p style={{ fontSize: 12, color: 'oklch(0.50 0.02 240)', margin: '4px 0 0' }}>City-wide power demand in MW</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="badge badge-info"><Zap size={10} />Peak: 1050 MW at 18:00</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={energyData}>
              <defs>
                <linearGradient id="egGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f4a261" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f4a261" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} />
              <Tooltip {...TT} />
              <Area type="monotone" dataKey="usage" stroke="#f4a261" strokeWidth={2.5} fill="url(#egGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: 24, background: 'rgba(0,180,216,0.03)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f0f8ff', marginBottom: 16 }}>🏙️ Ahmedabad Quick Stats</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Population', value: '5.63M', color: '#00b4d8' },
              { label: 'Bus Stops', value: '940', color: '#f4a261' },
              { label: 'Disable Soft', value: '141', color: '#06d6a0' },
              { label: 'Active Zones', value: '12', color: '#ef476f' },
            ].map((stat, i) => (
              <div key={i} style={{ padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: 10, color: 'oklch(0.50 0.02 240)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 8, fontSize: 11, color: 'oklch(0.60 0.02 240)', lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700, color: '#e0f0ff' }}>Core Infrastructure Note:</span><br/>
            Plan focuses on increasing disable-friendly stop density.
          </div>
        </div>
      </div>
    </div>
  );
}
