'use client';

import { Bell, Search, RefreshCw, ChevronDown, Sparkles, Wind, Droplets, Settings, Menu } from 'lucide-react';
import { useWeather, weatherCodeToLabel, weatherCodeToIcon, weatherCodeToColor } from '@/hooks/useWeather';

export default function Header({ currentTime }: { currentTime: string }) {
  const weather = useWeather();

  const tempColor = weatherCodeToColor(weather.weathercode);
  const icon = weatherCodeToIcon(weather.weathercode);
  const label = weatherCodeToLabel(weather.weathercode);

  return (
    <header style={{
      height: 72,
      background: 'linear-gradient(135deg, rgba(9, 9, 11, 0.95) 0%, rgba(15, 15, 20, 0.98) 100%)',
      borderBottom: '1px solid rgba(0, 180, 216, 0.15)',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 1px rgba(0, 180, 216, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'fixed',
      top: 0,
      left: 240,
      right: 0,
      zIndex: 40,
      backdropFilter: 'blur(24px) saturate(180%)',
    }}>
      {/* Left Section - Search */}
      <div style={{ flex: 1, maxWidth: 420 }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12, 
          background: 'rgba(255,255,255,0.06)', 
          border: '1px solid rgba(0, 180, 216, 0.2)', 
          borderRadius: 12, 
          padding: '10px 16px',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.borderColor = 'rgba(0, 180, 216, 0.4)';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 180, 216, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
          e.currentTarget.style.borderColor = 'rgba(0, 180, 216, 0.2)';
          e.currentTarget.style.boxShadow = 'none';
        }}>
          <Search size={16} color="#00b4d8" strokeWidth={2.5} />
          <input
            placeholder="Search incidents, zones, metrics..."
            style={{ 
              background: 'none', 
              border: 'none', 
              outline: 'none', 
              color: '#e0f0ff', 
              fontSize: 14, 
              fontWeight: 500,
              width: '100%', 
              fontFamily: 'inherit',
              letterSpacing: '-0.01em'
            }}
          />
          <kbd style={{
            padding: '2px 6px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 4,
            fontSize: 10,
            color: 'oklch(0.50 0.02 240)',
            fontWeight: 600,
            fontFamily: 'monospace'
          }}>⌘K</kbd>
        </div>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

        {/* Live Weather Card */}
        <div className="glass-card" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: `linear-gradient(135deg, ${tempColor}15, ${tempColor}08)`,
          border: `1px solid ${tempColor}35`,
          borderRadius: 12,
          padding: '8px 16px',
          cursor: 'default',
          boxShadow: `0 4px 12px ${tempColor}20`,
        }}>
          <div style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 10, 
            background: `${tempColor}20`,
            border: `1px solid ${tempColor}40`,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: 20
          }}>
            {weather.loading ? '⏳' : icon}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: tempColor, lineHeight: 1, letterSpacing: '-0.02em' }}>
              {weather.loading ? '—' : `${weather.temperature}°C`}
            </span>
            <span style={{ fontSize: 10, color: 'oklch(0.50 0.02 240)', fontWeight: 600, letterSpacing: '0.05em' }}>
              {weather.loading ? 'LOADING...' : label.toUpperCase()}
            </span>
          </div>
          {!weather.loading && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 4, 
              borderLeft: '1px solid rgba(255,255,255,0.1)', 
              paddingLeft: 12, 
              marginLeft: 4 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Droplets size={11} color="#48cae4" />
                <span style={{ fontSize: 11, color: '#48cae4', fontWeight: 700 }}>{weather.humidity}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Wind size={11} color="#06d6a0" />
                <span style={{ fontSize: 11, color: '#06d6a0', fontWeight: 700 }}>{weather.windspeed}km/h</span>
              </div>
            </div>
          )}
        </div>

        {/* Time Display */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-end',
          padding: '6px 12px',
          background: 'rgba(0, 180, 216, 0.05)',
          borderRadius: 10,
          border: '1px solid rgba(0, 180, 216, 0.15)'
        }}>
          <div style={{ 
            fontSize: 16, 
            fontWeight: 800, 
            color: '#00b4d8', 
            lineHeight: 1,
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums'
          }}>
            {currentTime.split(' · ')[0]}
          </div>
          <div style={{ 
            fontSize: 9, 
            color: 'oklch(0.45 0.02 240)', 
            letterSpacing: '0.08em',
            fontWeight: 600,
            marginTop: 3
          }}>
            IST · LIVE
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.08)' }} />

        {/* AI Intel Button */}
        <button style={{
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13,
          fontWeight: 700,
          color: '#a78bfa',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.08))',
          border: '1px solid rgba(124,58,237,0.35)',
          borderRadius: 10,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(124,58,237,0.15)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(124,58,237,0.15))';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.08))';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(124,58,237,0.15)';
        }}>
          <Sparkles size={15} strokeWidth={2.5} /> AI Intel
        </button>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-ghost" style={{ 
            padding: '8px', 
            borderRadius: 10,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <RefreshCw size={16} strokeWidth={2.5} />
          </button>

          <button style={{ 
            position: 'relative', 
            background: 'rgba(255,255,255,0.04)', 
            border: '1px solid rgba(255,255,255,0.08)', 
            borderRadius: 10, 
            padding: '8px', 
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239,71,111,0.1)';
            e.currentTarget.style.borderColor = 'rgba(239,71,111,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          }}>
            <Bell size={16} color="oklch(0.65 0.02 240)" strokeWidth={2.5} />
            <span className="blink" style={{
              position: 'absolute', 
              top: 6, 
              right: 6, 
              width: 8, 
              height: 8,
              background: '#ef476f', 
              borderRadius: '50%', 
              border: '1.5px solid oklch(0.09 0.015 250)',
              boxShadow: '0 0 12px #ef476f',
            }} />
          </button>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.08)' }} />

        {/* User Profile */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 10, 
          cursor: 'pointer',
          padding: '6px 12px 6px 6px',
          borderRadius: 10,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0,180,216,0.08)';
          e.currentTarget.style.borderColor = 'rgba(0,180,216,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        }}>
          <div style={{ 
            width: 36, 
            height: 36, 
            borderRadius: 10, 
            background: 'linear-gradient(135deg,#7c3aed,#00b4d8)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: 14, 
            fontWeight: 800, 
            color: 'white',
            boxShadow: '0 4px 12px rgba(0,180,216,0.3)'
          }}>A</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#e0f0ff', lineHeight: 1 }}>Admin</span>
            <span style={{ fontSize: 10, color: 'oklch(0.45 0.02 240)', fontWeight: 500 }}>Administrator</span>
          </div>
          <ChevronDown size={14} color="oklch(0.45 0.02 240)" strokeWidth={2.5} />
        </div>
      </div>
    </header>
  );
}
