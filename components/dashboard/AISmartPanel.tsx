'use client';

import { useState, useEffect } from 'react';
import { Sparkles, X, Send, Bot, Brain, Zap, Cpu } from 'lucide-react';

export default function AISmartPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: 'Hello! I am UrbanPulse AI. How can I assist you with city data today?' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const sendPrompt = () => {
    if (!inputValue.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: inputValue }]);
    setInputValue('');
    
    // Simulating AI response
    setTimeout(() => {
      let response = "I'm analyzing the real-time data from Ahmedabad corridors...";
      if (inputValue.toLowerCase().includes('traffic')) response = "Current traffic index is 68%. Heavy congestion noted on Main St corridor.";
      if (inputValue.toLowerCase().includes('population')) response = "Ahmedabad's population as per last recorded census was 5.63M.";
      
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="glass-card glow-blue"
        style={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(0,180,216,0.15) 100%)',
          border: '1px solid rgba(124,58,237,0.3)',
        }}
      >
        {isOpen ? <X size={24} color="#00b4d8" /> : <Sparkles size={24} color="#7c3aed" className="blink" />}
      </button>

      {/* AI Panel */}
      {isOpen && (
        <div className="glass-card slide-in" style={{
          position: 'fixed',
          bottom: 100,
          right: 30,
          width: 360,
          height: 520,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderColor: 'rgba(124,58,237,0.2)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        }}>
          {/* Header */}
          <div style={{
            padding: '20px',
            background: 'linear-gradient(90deg, rgba(124,58,237,0.1) 0%, rgba(0,180,216,0.1) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, 
              background: 'rgba(124,58,237,0.2)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(124,58,237,0.4)'
            }}>
              <Brain size={20} color="#7c3aed" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#f0f8ff' }}>UrbanPulse Smart AI</div>
              <div style={{ fontSize: 10, color: 'oklch(0.50 0.02 240)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="live-dot" style={{ width: 6, height: 6 }} /> Active Analytical Engine
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: 16 }}>
            {[
              { label: 'Compute', value: '88%', icon: Cpu, color: '#06d6a0' },
              { label: 'Latency', value: '42ms', icon: Zap, color: '#ffd166' }
            ].map((stat, i) => (
              <div key={i} style={{ padding: 10, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <stat.icon size={10} color={stat.color} />
                  <span style={{ fontSize: 9, color: 'oklch(0.40 0.02 240)', fontWeight: 700, textTransform: 'uppercase' }}>{stat.label}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Chat Container */}
          <div style={{ flex: 1, padding: '10px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, scrollbarWidth: 'none' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'ai' ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius: m.role === 'ai' ? '0 16px 16px 16px' : '16px 0 16px 16px',
                background: m.role === 'ai' ? 'rgba(255,255,255,0.04)' : 'rgba(124,58,237,0.15)',
                border: `1px solid ${m.role === 'ai' ? 'rgba(255,255,255,0.06)' : 'rgba(124,58,237,0.2)'}`,
                fontSize: 12,
                lineHeight: 1.5,
                color: m.role === 'ai' ? 'oklch(0.80 0.01 240)' : '#f0f8ff',
              }}>
                {m.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ position: 'relative' }}>
              <input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendPrompt()}
                placeholder="Ask city AI assistant..."
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  padding: '12px 40px 12px 14px',
                  color: '#e0f0ff',
                  fontSize: 12,
                  outline: 'none',
                }}
              />
              <button 
                onClick={sendPrompt}
                style={{ 
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 4
                }}
              >
                <Send size={16} color="#7c3aed" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
