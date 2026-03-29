'use client';

import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Droplets, AlertTriangle, TrendingDown } from 'lucide-react';

const powerUsage = [
  { time: '00', usage: 620, solar: 0 }, { time: '02', usage: 550, solar: 0 },
  { time: '04', usage: 490, solar: 0 }, { time: '06', usage: 680, solar: 80 },
  { time: '08', usage: 820, solar: 320 }, { time: '10', usage: 910, solar: 480 },
  { time: '12', usage: 950, solar: 520 }, { time: '14', usage: 930, solar: 490 },
  { time: '16', usage: 870, solar: 380 }, { time: '18', usage: 1050, solar: 120 },
  { time: '20', usage: 980, solar: 0 }, { time: '22', usage: 720, solar: 0 },
];

const waterUsage = [
  { zone: 'North', supply: 82, demand: 78 }, { zone: 'South', supply: 91, demand: 89 },
  { zone: 'East', supply: 75, demand: 80 }, { zone: 'West', supply: 95, demand: 88 },
  { zone: 'CBD', supply: 88, demand: 92 }, { zone: 'Industrial', supply: 70, demand: 68 },
];

const reservoirs = [
  { name: 'Reservoir A', level: 78, capacity: 100, status: 'normal' },
  { name: 'Reservoir B', level: 45, capacity: 100, status: 'warning' },
  { name: 'Reservoir C', level: 92, capacity: 100, status: 'normal' },
  { name: 'Borewell 12', level: 34, capacity: 100, status: 'critical' },
];

const TT = { contentStyle: { background: 'oklch(0.12 0.02 250)', border: '1px solid rgba(0,180,216,0.3)', borderRadius: 8 }, labelStyle: { color: '#00b4d8' }, itemStyle: { color: '#e0f0ff' } };
const statusColor: Record<string, string> = { normal: '#06d6a0', warning: '#ffd166', critical: '#ef476f' };

export default function UtilitiesModule() {
  return (
    <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f8ff', margin: 0 }}>Utilities — Water & Energy</h2>
        <p style={{ color: 'oklch(0.50 0.02 240)', fontSize: 13, margin: '4px 0 0' }}>City-wide infrastructure consumption monitoring</p>
      </div>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Power', value: '847 MW', sub: 'City demand now', color: '#f4a261', icon: Zap },
          { label: 'Solar Harvest', value: '290 MW', sub: '34% of supply', color: '#ffd166', icon: Zap },
          { label: 'Water Supply', value: '420 MLD', sub: 'Megalitres/day', color: '#00b4d8', icon: Droplets },
          { label: 'Leakage Detected', value: '2 zones', sub: 'East & CBD', color: '#ef476f', icon: AlertTriangle },
        ].map(({ label, value, sub, color, icon: Icon }) => (
          <div key={label} className="glass-card" style={{ padding: 18, background: `${color}08`, borderColor: `${color}25` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Icon size={14} color={color} />
              <span style={{ fontSize: 11, color: 'oklch(0.50 0.02 240)' }}>{label}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: 11, color: 'oklch(0.45 0.02 240)', marginTop: 4 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Power Chart */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f0f8ff', margin: 0 }}>Power Consumption vs Solar Generation</h3>
            <p style={{ fontSize: 12, color: 'oklch(0.50 0.02 240)', margin: '4px 0 0' }}>MW · 24h overview</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {[['#f4a261', 'Grid Usage'], ['#ffd166', 'Solar']].map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
                <span style={{ fontSize: 11, color: 'oklch(0.55 0.02 240)' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={powerUsage}>
            <defs>
              <linearGradient id="pgrid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f4a261" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f4a261" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="psolar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffd166" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#ffd166" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} />
            <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} />
            <Tooltip {...TT} />
            <Area type="monotone" dataKey="usage" name="Grid (MW)" stroke="#f4a261" strokeWidth={2.5} fill="url(#pgrid)" dot={false} />
            <Area type="monotone" dataKey="solar" name="Solar (MW)" stroke="#ffd166" strokeWidth={2} fill="url(#psolar)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Water section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Reservoir levels */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f0f8ff', margin: '0 0 18px' }}>💧 Reservoir Levels</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {reservoirs.map(r => (
              <div key={r.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'oklch(0.80 0.01 240)' }}>{r.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: statusColor[r.status] }}>{r.level}%</span>
                    <span className={`badge badge-${r.status}`} style={{ fontSize: 9 }}>{r.status}</span>
                  </div>
                </div>
                <div className="progress-bar" style={{ height: 8 }}>
                  <div className="progress-fill" style={{ width: `${r.level}%`, background: `linear-gradient(90deg, ${statusColor[r.status]}80, ${statusColor[r.status]})` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zone supply vs demand */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f0f8ff', margin: '0 0 4px' }}>Water Supply vs Demand by Zone</h3>
          <p style={{ fontSize: 11, color: 'oklch(0.45 0.02 240)', margin: '0 0 16px' }}>MLD per zone</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={waterUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="zone" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} />
              <Tooltip {...TT} />
              <Bar dataKey="supply" name="Supply" fill="#00b4d8" radius={[3, 3, 0, 0]} opacity={0.9} />
              <Bar dataKey="demand" name="Demand" fill="#ef476f" radius={[3, 3, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Outage alerts */}
      <div className="glass-card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f0f8ff', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingDown size={15} color="#ef476f" /> Detected Anomalies
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { zone: 'East Sector', type: 'Water leakage', val: '-12 MLD loss', color: '#ef476f' },
            { zone: 'CBD Grid', type: 'Power fluctuation', val: '±8% instability', color: '#ffd166' },
            { zone: 'North Reservoir', type: 'Low water level', val: '45% — refill needed', color: '#ffd166' },
          ].map(a => (
            <div key={a.zone} style={{ padding: 14, borderRadius: 10, background: `${a.color}08`, border: `1px solid ${a.color}25` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: a.color }}>{a.type}</div>
              <div style={{ fontSize: 12, color: 'oklch(0.70 0.01 240)', margin: '4px 0 2px' }}>{a.zone}</div>
              <div style={{ fontSize: 11, color: 'oklch(0.50 0.02 240)' }}>{a.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
