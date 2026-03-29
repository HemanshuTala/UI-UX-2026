'use client';

import { LayoutDashboard, Car, Wind, Zap, AlertOctagon, MessageSquare, BarChart3, Users, Settings, Radio, Sparkles } from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'traffic', label: 'Traffic & Transport', icon: Car },
  { id: 'environment', label: 'Environment', icon: Wind },
  { id: 'utilities', label: 'Utilities', icon: Zap },
  { id: 'emergency', label: 'Emergency', icon: AlertOctagon },
  { id: 'feedback', label: 'Citizen Feedback', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const adminItems = [
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return (
    <aside style={{
      width: 240,
      minWidth: 240,
      height: '100vh',
      background: 'linear-gradient(180deg, oklch(0.09 0.015 250) 0%, oklch(0.07 0.01 250) 100%)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 50,
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: 'linear-gradient(135deg, #00b4d8, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0,180,216,0.3)',
          }}>
            <Radio size={20} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>UrbanPulse</div>
            <div style={{ fontSize: 10, color: '#00b4d8', letterSpacing: '0.1em', fontWeight: 800, textTransform: 'uppercase' }}>Smart City OS</div>
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(6,214,160,0.05)', borderRadius: 10, padding: '8px 12px', border: '1px solid rgba(6,214,160,0.1)' }}>
          <span className="live-dot" />
          <span style={{ fontSize: 11, color: '#06d6a0', fontWeight: 700, letterSpacing: '0.02em' }}>LIVE DATA STREAM</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '8px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'oklch(0.45 0.02 240)', letterSpacing: '0.15em', padding: '12px 10px 6px', textTransform: 'uppercase' }}>Operational</div>
        {navItems.map(({ id, label, icon: Icon }) => (
          <div
            key={id}
            className={`sidebar-item ${active === id ? 'active' : ''}`}
            onClick={() => onSelect(id)}
            style={{ padding: '10px 14px' }}
          >
            <Icon size={18} opacity={active === id ? 1 : 0.6} />
            <span style={{ fontWeight: active === id ? 700 : 500 }}>{label}</span>
            {id === 'emergency' && (
              <span style={{
                marginLeft: 'auto', background: '#ef476f', color: 'white',
                borderRadius: 100, fontSize: 10, fontWeight: 800,
                padding: '2px 8px', minWidth: 20, textAlign: 'center',
                boxShadow: '0 0 10px rgba(239, 71, 111, 0.4)'
              }}>3</span>
            )}
          </div>
        ))}

        <div style={{ fontSize: 10, fontWeight: 800, color: 'oklch(0.45 0.02 240)', letterSpacing: '0.15em', padding: '24px 10px 6px', textTransform: 'uppercase' }}>Administration</div>
        {adminItems.map(({ id, label, icon: Icon }) => (
          <div
            key={id}
            className={`sidebar-item ${active === id ? 'active' : ''}`}
            onClick={() => onSelect(id)}
            style={{ padding: '10px 14px' }}
          >
            <Icon size={18} opacity={active === id ? 1 : 0.6} />
            <span style={{ fontWeight: active === id ? 700 : 500 }}>{label}</span>
          </div>
        ))}

        {/* AI Insight Sidebar Hook */}
        <div style={{ marginTop: 'auto', padding: '8px' }}>
          <div className="glass-card" style={{ 
            padding: '16px', 
            background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(0,180,216,0.1))',
            borderColor: 'rgba(124,58,237,0.2)',
            borderRadius: 14
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={14} color="#a78bfa" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#e0f0ff' }}>AI Smart Panel</span>
            </div>
            <p style={{ fontSize: 11, color: 'oklch(0.55 0.02 240)', margin: 0, lineHeight: 1.4 }}>
              Intelligent city-wide insights are available. Click the sparkles icon below.
            </p>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#00b4d8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: 'white' }}>A</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>A. Sharma</div>
            <div style={{ fontSize: 10, color: 'oklch(0.45 0.02 240)', fontWeight: 600 }}>City Commissioner</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
