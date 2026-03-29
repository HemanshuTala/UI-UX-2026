'use client';

import { useState } from 'react';
import { Settings, Bell, Key, Link2, Save, Check, Wifi, WifiOff, Shield, Database, Zap, Globe, Lock, RefreshCw, Download, Upload } from 'lucide-react';

const initialIntegrations = [
  { name: 'OpenWeatherMap', status: 'connected', key: 'owm_••••••••••••abcd', color: '#00b4d8' },
  { name: 'Open-Meteo', status: 'connected', key: 'Free API (no key needed)', color: '#06d6a0' },
  { name: 'Mapbox', status: 'disconnected', key: 'Not configured', color: '#ef476f' },
  { name: 'GTFS Feed', status: 'connected', key: 'gtfs.citybus.in/v2/feed', color: '#06d6a0' },
];

const initialThresholds = [
  { label: 'AQI Alert Threshold', current: 100, max: 300, unit: 'AQI', color: '#ffd166' },
  { label: 'Traffic Congestion Alert', current: 75, max: 100, unit: '%', color: '#f4a261' },
  { label: 'Power Usage Critical', current: 1100, max: 1500, unit: 'MW', color: '#ef476f' },
  { label: 'Reservoir Low Level', current: 40, max: 100, unit: '%', color: '#00b4d8' },
];

const initialNotifChannels = [
  { label: 'SMS Alerts', enabled: true, desc: 'Critical alerts via SMS to registered phones' },
  { label: 'Email Digest', enabled: true, desc: 'Daily summary & urgent alerts to operators' },
  { label: 'Push Notifications', enabled: false, desc: 'Browser/app push for on-call staff' },
  { label: 'Slack Integration', enabled: false, desc: 'Post incidents to #city-ops channel' },
];

export default function SettingsModule() {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [thresholds, setThresholds] = useState(initialThresholds);
  const [notifChannels, setNotifChannels] = useState(initialNotifChannels);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('integrations');

  const toggleChannel = (idx: number) => {
    setNotifChannels(prev => prev.map((ch, i) => i === idx ? { ...ch, enabled: !ch.enabled } : ch));
  };

  const toggleIntegration = (idx: number) => {
    setIntegrations(prev => prev.map((int, i) => i === idx
      ? { ...int, status: int.status === 'connected' ? 'disconnected' : 'connected', color: int.status === 'connected' ? '#ef476f' : '#06d6a0' }
      : int));
  };

  const handleThresholdChange = (idx: number, value: number) => {
    setThresholds(prev => prev.map((t, i) => i === idx ? { ...t, current: value } : t));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sections = [
    { id: 'integrations', label: 'Integrations', icon: Link2 },
    { id: 'thresholds', label: 'Thresholds', icon: Bell },
    { id: 'notifications', label: 'Notifications', icon: Zap },
    { id: 'system', label: 'System Info', icon: Database },
  ];

  return (
    <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Enhanced Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#f0f8ff', margin: 0, display: 'flex', alignItems: 'center', gap: 12, letterSpacing: '-0.03em' }}>
            <div style={{ 
              width: 48, 
              height: 48, 
              borderRadius: 12, 
              background: 'linear-gradient(135deg, rgba(0,180,216,0.2), rgba(0,180,216,0.1))',
              border: '1px solid rgba(0,180,216,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,180,216,0.2)'
            }}>
              <Settings size={24} color="#00b4d8" strokeWidth={2.5} />
            </div>
            ⚙️ Settings & Configuration
          </h2>
          <p style={{ color: 'oklch(0.55 0.02 240)', fontSize: 14, margin: '8px 0 0 60px', fontWeight: 500 }}>
            Manage integrations, alerts, and system preferences
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" style={{ padding: '8px 14px' }}>
            <Upload size={14} />Import
          </button>
          <button className="btn-ghost" style={{ padding: '8px 14px' }}>
            <Download size={14} />Export
          </button>
          <button 
            className="btn-primary" 
            style={{ padding: '8px 16px' }}
            onClick={handleSave}
          >
            {saved ? <><Check size={14} />Saved!</> : <><Save size={14} />Save All</>}
          </button>
        </div>
      </div>

      {/* Section Navigation */}
      <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 4 }}>
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            style={{
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: 700,
              borderRadius: '10px 10px 0 0',
              background: activeSection === id ? 'rgba(0,180,216,0.1)' : 'transparent',
              color: activeSection === id ? '#00b4d8' : 'oklch(0.60 0.02 240)',
              border: 'none',
              borderBottom: activeSection === id ? '2px solid #00b4d8' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Icon size={15} strokeWidth={2.5} />
            {label}
          </button>
        ))}
      </div>

      {/* API Integrations Section */}
      {activeSection === 'integrations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="glass-card" style={{ padding: 28, background: 'linear-gradient(135deg, rgba(0,180,216,0.05), rgba(0,180,216,0.02))' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f0f8ff', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Link2 size={18} color="#00b4d8" strokeWidth={2.5} /> Data Source Integrations
                </h3>
                <p style={{ fontSize: 12, color: 'oklch(0.50 0.02 240)', margin: '6px 0 0' }}>Connect and manage external data providers</p>
              </div>
              <span className="badge badge-info">{integrations.filter(i => i.status === 'connected').length} Active</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {integrations.map((int, idx) => (
                <div 
                  key={int.name} 
                  className="glass-card"
                  style={{ 
                    padding: 20, 
                    background: `linear-gradient(135deg, ${int.color}12, ${int.color}05)`,
                    borderColor: `${int.color}30`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ 
                      width: 44, 
                      height: 44, 
                      borderRadius: 10, 
                      background: `${int.color}20`,
                      border: `1px solid ${int.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 4px 12px ${int.color}20`
                    }}>
                      {int.status === 'connected' ? <Wifi size={20} color={int.color} /> : <WifiOff size={20} color={int.color} />}
                    </div>
                    <div style={{ 
                      padding: '4px 10px', 
                      borderRadius: 8, 
                      background: `${int.color}15`,
                      border: `1px solid ${int.color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: int.color, boxShadow: `0 0 8px ${int.color}` }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: int.color, textTransform: 'capitalize' }}>{int.status}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#e0f0ff', marginBottom: 6 }}>{int.name}</div>
                  <div style={{ fontSize: 11, color: 'oklch(0.45 0.02 240)', fontFamily: 'monospace', marginBottom: 14, wordBreak: 'break-all' }}>{int.key}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button 
                      className="btn-ghost" 
                      style={{ flex: 1, padding: '8px 12px', fontSize: 12 }} 
                      onClick={() => toggleIntegration(idx)}
                    >
                      {int.status === 'connected' ? <><WifiOff size={12} />Disconnect</> : <><Wifi size={12} />Connect</>}
                    </button>
                    <button className="btn-ghost" style={{ padding: '8px 12px', fontSize: 12 }}>
                      <Key size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alert Thresholds Section */}
      {activeSection === 'thresholds' && (
        <div className="glass-card" style={{ padding: 28, background: 'linear-gradient(135deg, rgba(255,209,102,0.05), rgba(255,209,102,0.02))' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f0f8ff', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Bell size={18} color="#ffd166" strokeWidth={2.5} /> Alert Thresholds
              </h3>
              <p style={{ fontSize: 12, color: 'oklch(0.50 0.02 240)', margin: '6px 0 0' }}>Configure trigger points for automated alerts</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {thresholds.map((t, idx) => (
              <div key={t.label} className="glass-card" style={{ padding: 20, background: `${t.color}08`, borderColor: `${t.color}25` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'oklch(0.80 0.01 240)' }}>{t.label}</span>
                  <div style={{ 
                    padding: '6px 14px', 
                    borderRadius: 8, 
                    background: `${t.color}20`,
                    border: `1px solid ${t.color}40`
                  }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: t.color, letterSpacing: '-0.02em' }}>{t.current}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'oklch(0.60 0.02 240)', marginLeft: 4 }}>{t.unit}</span>
                  </div>
                </div>
                <input
                  type="range" 
                  min={0} 
                  max={t.max} 
                  value={t.current}
                  onChange={e => handleThresholdChange(idx, Number(e.target.value))}
                  style={{ 
                    width: '100%', 
                    height: 8,
                    accentColor: t.color, 
                    cursor: 'pointer',
                    borderRadius: 4
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ fontSize: 11, color: 'oklch(0.45 0.02 240)', fontWeight: 600 }}>0</span>
                  <span style={{ fontSize: 11, color: 'oklch(0.45 0.02 240)', fontWeight: 600 }}>{t.max} {t.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notification Channels Section */}
      {activeSection === 'notifications' && (
        <div className="glass-card" style={{ padding: 28, background: 'linear-gradient(135deg, rgba(6,214,160,0.05), rgba(6,214,160,0.02))' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f0f8ff', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Zap size={18} color="#06d6a0" strokeWidth={2.5} /> Notification Channels
              </h3>
              <p style={{ fontSize: 12, color: 'oklch(0.50 0.02 240)', margin: '6px 0 0' }}>Enable or disable notification delivery methods</p>
            </div>
            <span className="badge badge-normal">{notifChannels.filter(n => n.enabled).length} Enabled</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {notifChannels.map((ch, idx) => (
              <div 
                key={ch.label}
                onClick={() => toggleChannel(idx)}
                className="glass-card"
                style={{ 
                  padding: 20, 
                  background: ch.enabled ? 'linear-gradient(135deg, rgba(6,214,160,0.12), rgba(6,214,160,0.05))' : 'rgba(255,255,255,0.02)',
                  borderColor: ch.enabled ? 'rgba(6,214,160,0.3)' : 'rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: ch.enabled ? '#e0f0ff' : 'oklch(0.60 0.01 240)', marginBottom: 6 }}>{ch.label}</div>
                    <div style={{ fontSize: 11, color: 'oklch(0.45 0.02 240)', lineHeight: 1.5 }}>{ch.desc}</div>
                  </div>
                  {/* Enhanced Toggle */}
                  <div style={{ 
                    width: 44, 
                    height: 24, 
                    borderRadius: 100, 
                    background: ch.enabled ? '#06d6a0' : 'rgba(255,255,255,0.1)',
                    border: `2px solid ${ch.enabled ? '#06d6a0' : 'rgba(255,255,255,0.15)'}`,
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    boxShadow: ch.enabled ? '0 0 16px rgba(6,214,160,0.4)' : 'none',
                    flexShrink: 0,
                    marginLeft: 12
                  }}>
                    <div style={{ 
                      position: 'absolute', 
                      top: 2, 
                      left: ch.enabled ? 22 : 2, 
                      width: 16, 
                      height: 16, 
                      borderRadius: '50%', 
                      background: 'white',
                      transition: 'left 0.3s ease',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Info Section */}
      {activeSection === 'system' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="glass-card" style={{ padding: 28, background: 'linear-gradient(135deg, rgba(124,58,237,0.05), rgba(124,58,237,0.02))' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f0f8ff', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Database size={18} color="#7c3aed" strokeWidth={2.5} /> System Information
                </h3>
                <p style={{ fontSize: 12, color: 'oklch(0.50 0.02 240)', margin: '6px 0 0' }}>Platform metrics and performance data</p>
              </div>
              <button className="btn-ghost" style={{ padding: '8px 14px' }}>
                <RefreshCw size={13} />Refresh
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { label: 'Platform Version', value: 'UrbanPulse v2.5.0', icon: Globe, color: '#00b4d8' },
                { label: 'Data Refresh Rate', value: 'Real-time (1s)', icon: RefreshCw, color: '#06d6a0' },
                { label: 'Cache Layer', value: 'Redis Active', icon: Database, color: '#ffd166' },
                { label: 'API Latency', value: '< 120ms avg', icon: Zap, color: '#f4a261' },
                { label: 'Uptime', value: '99.94% (30d)', icon: Shield, color: '#7c3aed' },
                { label: 'Data Stored', value: '2.4 TB (6mo)', icon: Database, color: '#ef476f' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="glass-card" style={{ padding: 18, background: `${color}08`, borderColor: `${color}25` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ 
                      width: 36, 
                      height: 36, 
                      borderRadius: 8, 
                      background: `${color}20`,
                      border: `1px solid ${color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={16} color={color} strokeWidth={2.5} />
                    </div>
                    <div style={{ fontSize: 10, color: 'oklch(0.50 0.02 240)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color, letterSpacing: '-0.02em' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Section */}
          <div className="glass-card" style={{ padding: 28, background: 'linear-gradient(135deg, rgba(239,71,111,0.05), rgba(239,71,111,0.02))' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f0f8ff', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Lock size={18} color="#ef476f" strokeWidth={2.5} /> Security & Access
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Two-Factor Auth', status: 'Enabled', color: '#06d6a0' },
                { label: 'API Rate Limiting', status: 'Active', color: '#06d6a0' },
                { label: 'SSL Certificate', status: 'Valid', color: '#06d6a0' },
                { label: 'Last Security Audit', status: '7 days ago', color: '#00b4d8' },
              ].map(({ label, status, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'oklch(0.75 0.01 240)' }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color, padding: '4px 10px', background: `${color}15`, borderRadius: 6, border: `1px solid ${color}30` }}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
