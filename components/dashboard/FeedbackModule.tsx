'use client';

import React, { useState, useMemo } from 'react';
import { MessageSquare, Tag, Clock, ChevronRight, CheckCircle, AlertTriangle, Droplets, Construction, Check, Reply, ArrowUpRight, Shield } from 'lucide-react';

const initialComplaints = [
  { id: 'C-1041', title: 'Pothole on MG Road', category: 'Road', priority: 'high', status: 'open', time: '2h ago', user: 'Ravi Kumar', desc: 'Large pothole near Junction 4 causing accidents.' },
  { id: 'C-1040', title: 'Garbage not collected 3 days', category: 'Waste', priority: 'medium', status: 'in-review', time: '5h ago', user: 'Priya Shah', desc: 'No garbage collection in Block C for 3 consecutive days.' },
  { id: 'C-1039', title: 'Street light out — North Ave', category: 'Electricity', priority: 'low', status: 'resolved', time: '1d ago', user: 'Ajay Mehta', desc: 'Three street lights non-functional near school zone.' },
  { id: 'C-1038', title: 'Water pipeline burst', category: 'Water', priority: 'high', status: 'open', time: '1d ago', user: 'Sonia Das', desc: 'Water leaking from main supply line, road flooding.' },
  { id: 'C-1037', title: 'Illegal dumping at park', category: 'Waste', priority: 'medium', status: 'in-review', time: '2d ago', user: 'Mohammed Ali', desc: 'Unauthorized dumping of construction waste.' },
  { id: 'C-1036', title: 'Broken footpath slab', category: 'Road', priority: 'low', status: 'resolved', time: '3d ago', user: 'Anita Joshi', desc: 'Footpath tiles broken outside school, safety hazard.' },
];

const categories = ['All', 'Road', 'Water', 'Waste', 'Electricity', 'Energy'];
const priorities: Record<string, string> = { high: '#ef476f', medium: '#ffd166', low: '#06d6a0' };
const statusIcons: Record<string, React.ReactNode> = {
  open: <AlertTriangle size={12} color="#ef476f" />,
  'in-review': <Clock size={12} color="#ffd166" />,
  resolved: <CheckCircle size={12} color="#06d6a0" />,
};
const catIcons: Record<string, React.ReactNode> = {
  Road: <Construction size={12} />, Water: <Droplets size={12} />,
  Waste: <Tag size={12} />, Electricity: <Tag size={12} />,
  Energy: <ArrowUpRight size={12} />
};

export default function FeedbackModule() {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedId, setSelectedId] = useState(initialComplaints[0].id);
  const [toast, setToast] = useState('');

  const selected = useMemo(() => 
    complaints.find(c => c.id === selectedId) || complaints[0],
    [complaints, selectedId]
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleResolve = () => {
    setComplaints(prev => prev.map(c => 
      c.id === selectedId ? { ...c, status: 'resolved' } : c
    ));
    showToast(`Complaint ${selectedId} marked as resolved.`);
  };

  const handleStatusChange = (status: string) => {
    setComplaints(prev => prev.map(c => 
      c.id === selectedId ? { ...c, status } : c
    ));
    showToast(`Status updated to ${status}.`);
  };

  const filtered = complaints.filter(c => selectedCat === 'All' || c.category === selectedCat);

  return (
    <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 110, right: 30, zIndex: 200, background: 'rgba(6,214,160,0.15)', border: '1px solid rgba(6,214,160,0.4)', borderRadius: 12, padding: '12px 20px', color: '#06d6a0', fontWeight: 700, fontSize: 13, backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 32px rgba(6,214,160,0.2)' }}>
          <Check size={14} /> {toast}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f8ff', margin: 0 }}>Citizen Feedback Inbox</h2>
          <p style={{ color: 'oklch(0.50 0.02 240)', fontSize: 13, margin: '4px 0 0' }}>Community-reported issues and complaint management</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge badge-critical">{complaints.filter(c => c.status === 'open').length} Open</span>
          <span className="badge badge-warning">{complaints.filter(c => c.status === 'in-review').length} In Review</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Received', value: complaints.length.toString(), color: '#00b4d8' },
          { label: 'Resolved Today', value: (18 + complaints.filter(c => c.status === 'resolved').length).toString(), color: '#06d6a0' },
          { label: 'Avg Resolution', value: '4.2h', color: '#ffd166' },
          { label: 'Satisfaction', value: '87%', color: '#7c3aed' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card" style={{ padding: 18, background: `${color}08`, borderColor: `${color}25` }}>
            <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: 12, color: 'oklch(0.50 0.02 240)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button key={c} onClick={() => setSelectedCat(c)}
            style={{
              padding: '6px 16px', borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: selectedCat === c ? 'linear-gradient(135deg,#00b4d8,#0096b7)' : 'rgba(255,255,255,0.04)',
              color: selectedCat === c ? 'white' : 'oklch(0.55 0.02 240)',
              border: selectedCat === c ? 'none' : '1px solid rgba(255,255,255,0.07)',
              boxShadow: selectedCat === c ? '0 4px 12px rgba(0,180,216,0.3)' : 'none',
              transform: selectedCat === c ? 'translateY(-1px)' : 'none'
            }}>
            {c}
          </button>
        ))}
      </div>

      {/* Inbox layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20, alignItems: 'start' }}>
        {/* List */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden', height: 460, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 12, fontWeight: 700, color: 'oklch(0.50 0.02 240)', letterSpacing: '0.05em' }}>
            FEEDBACK STREAM
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'oklch(0.40 0.02 240)', fontSize: 12 }}>No feedback in this category</div>
            ) : filtered.map((c, i) => (
              <div key={c.id} onClick={() => setSelectedId(c.id)}
                style={{
                  padding: '16px', cursor: 'pointer', transition: 'all 0.15s',
                  background: selected.id === c.id ? 'rgba(0,180,216,0.08)' : 'transparent',
                  borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  borderLeft: selected.id === c.id ? '3px solid #00b4d8' : '3px solid transparent',
                  position: 'relative'
                }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10, color: '#00b4d8', fontWeight: 700 }}>{c.id}</span>
                    <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 4, background: `${priorities[c.priority]}18`, color: priorities[c.priority], fontWeight: 700, border: `1px solid ${priorities[c.priority]}30`, textTransform: 'uppercase' }}>{c.priority}</span>
                  </span>
                  <ChevronRight size={12} color={selected.id === c.id ? '#00b4d8' : 'oklch(0.35 0.02 240)'} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: selected.id === c.id ? '#f0f8ff' : '#cbd5e1' }}>{c.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'oklch(0.50 0.02 240)' }}>
                    {catIcons[c.category]} {c.category}
                  </span>
                  <span style={{ fontSize: 11, color: 'oklch(0.40 0.02 240)' }}>· {c.time}</span>
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>{statusIcons[c.status]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail pane */}
        <div className="glass-card" style={{ padding: 28, minHeight: 460, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#00b4d8', letterSpacing: '0.08em' }}>{selected.id}</span>
                <span style={{ padding: '2px 8px', borderRadius: 6, background: `${priorities[selected.priority]}18`, color: priorities[selected.priority], fontSize: 10, fontWeight: 800, border: `1px solid ${priorities[selected.priority]}30`, textTransform: 'uppercase' }}>{selected.priority} priority</span>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: '#f0f8ff', margin: 0, letterSpacing: '-0.02em' }}>{selected.title}</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: 8 }}>
              {statusIcons[selected.status]}
              <span style={{ fontSize: 13, color: selected.status === 'resolved' ? '#06d6a0' : selected.status === 'in-review' ? '#ffd166' : '#ef476f', fontWeight: 700, textTransform: 'capitalize' }}>{selected.status}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'oklch(0.65 0.01 240)' }}>
              <Tag size={14} color="#00b4d8" strokeWidth={2.5} /> <span style={{ fontWeight: 600 }}>{selected.category}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'oklch(0.65 0.01 240)' }}>
              <Clock size={14} color="#00b4d8" strokeWidth={2.5} /> Reported {selected.time}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'oklch(0.65 0.01 240)' }}>
              <MessageSquare size={14} color="#00b4d8" strokeWidth={2.5} /> <span style={{ fontWeight: 600 }}>By {selected.user}</span>
            </div>
          </div>

          <div style={{ background: 'rgba(0,180,216,0.04)', border: '1px solid rgba(0,180,216,0.12)', borderRadius: 14, padding: 20, marginBottom: 30, flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#00b4d8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>DESCRIPTION</div>
            <p style={{ fontSize: 15, color: 'oklch(0.85 0.01 240)', margin: 0, lineHeight: 1.6, fontWeight: 450 }}>{selected.desc}</p>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
            {selected.status !== 'resolved' && (
              <button className="btn-primary" onClick={handleResolve}>
                <CheckCircle size={15} /> Mark Resolved
              </button>
            )}
            {selected.status === 'open' && (
              <button className="btn-ghost" onClick={() => handleStatusChange('in-review')}>
                <Clock size={15} /> Start Review
              </button>
            )}
            <button className="btn-ghost" onClick={() => showToast('Escalated to Department Head')}>
              <Shield size={14} /> Assign Dept
            </button>
            <button className="btn-ghost" onClick={() => showToast('Drafting reply to ' + selected.user)}>
              <Reply size={14} /> Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
