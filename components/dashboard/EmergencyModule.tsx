'use client';

import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AlertOctagon, MapPin, Clock, Users, CheckCircle, ChevronRight, Siren, Check, ShieldAlert, Zap, PhoneCall, Info } from 'lucide-react';
import type { MapMarker } from './LeafletMap';

const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false });

const initialIncidents = [
  {
    id: '#INC-2401', type: 'Traffic Accident', location: 'Main St & 5th Ave', status: 'critical',
    time: '08 min ago', mapLat: 23.0380, mapLng: 72.5560, team: 'Unassigned', priority: 'High', reporter: 'Smart Sensor S-42',
    timeline: [
      { t: '14:26', msg: 'Incident reported via sensor', done: true, type: 'report' },
      { t: '14:27', msg: 'Alert dispatched to control room', done: true, type: 'system' },
      { t: '14:28', msg: 'Emergency team notified', done: true, type: 'dispatch' },
      { t: '14:30', msg: 'Unit en route to location', done: false, type: 'action' },
    ],
  },
  {
    id: '#INC-2400', type: 'Building Fire', location: 'East District, Block 4', status: 'critical',
    time: '25 min ago', mapLat: 23.0530, mapLng: 72.6200, team: 'Fire Unit A', priority: 'Urgent', reporter: 'Citizen App (U-102)',
    timeline: [
      { t: '14:00', msg: 'Fire alarm triggered', done: true, type: 'report' },
      { t: '14:01', msg: 'Fire unit A dispatched', done: true, type: 'dispatch' },
      { t: '14:08', msg: 'Unit arrived on scene', done: true, type: 'action' },
      { t: '14:30', msg: 'Containment in progress', done: false, type: 'status' },
    ],
  },
  {
    id: '#INC-2399', type: 'Medical Emergency', location: 'Downtown Hospital, Zone 3', status: 'warning',
    time: '41 min ago', mapLat: 23.0100, mapLng: 72.5850, team: 'Medic Unit B', priority: 'Medium', reporter: '911 Call (Emergency Center)',
    timeline: [
      { t: '13:44', msg: 'Emergency call received', done: true, type: 'report' },
      { t: '13:46', msg: 'Ambulance dispatched', done: true, type: 'dispatch' },
      { t: '13:52', msg: 'Patient stabilized', done: true, type: 'action' },
      { t: '14:10', msg: 'Transfer to ICU', done: true, type: 'status' },
    ],
  },
  {
    id: '#INC-2398', type: 'Power Outage', location: 'Sector 7 Grid Station', status: 'warning',
    time: '1h 12min ago', mapLat: 23.0650, mapLng: 72.5400, team: 'Electric Unit C', priority: 'Medium', reporter: 'Grid Monitor G-7',
    timeline: [
      { t: '13:24', msg: 'Grid failure detected', done: true, type: 'report' },
      { t: '13:26', msg: 'Backup systems engaged', done: true, type: 'system' },
      { t: '13:40', msg: 'Repair crew deployed', done: true, type: 'action' },
      { t: '14:20', msg: 'Partial restoration complete', done: true, type: 'status' },
    ],
  },
];

const teams = ['Unassigned', 'Police Unit A', 'Police Unit B', 'Fire Unit A', 'Fire Unit B', 'Medic Unit A', 'Medic Unit B', 'Electric Unit C'];

const statusColor: Record<string, string> = { critical: '#ef476f', warning: '#ffd166', resolved: '#06d6a0' };

export default function EmergencyModule() {
  const [incidents, setIncidents] = useState(initialIncidents);
  const [selectedId, setSelectedId] = useState(initialIncidents[0].id);
  const [assignTeamName, setAssignTeamName] = useState('Unassigned');
  const [toast, setToast] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);

  const selected = useMemo(() => 
    incidents.find(i => i.id === selectedId) || incidents[0],
    [incidents, selectedId]
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAssignTeam = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIncidents(prev => prev.map(inc => 
        inc.id === selectedId ? { ...inc, team: assignTeamName } : inc
      ));
      setIsDispatching(false);
      showToast(`Team ${assignTeamName} successfully dispatched to ${selectedId}`);
    }, 1200);
  };

  const handleResolve = () => {
    setIncidents(prev => prev.map(inc => 
      inc.id === selectedId ? { ...inc, status: 'resolved' } : inc
    ));
    showToast(`Incident ${selectedId} marked as resolved and closed.`);
  };

  const handleEscalate = () => {
    setIncidents(prev => prev.map(inc => 
      inc.id === selectedId ? { ...inc, status: 'critical', priority: 'Urgent' } : inc
    ));
    showToast(`Incident ${selectedId} escalated to CRITICAL priority.`);
  };

  // Build single marker for currently selected incident
  const incidentMarkers: MapMarker[] = useMemo(() => [{
    lat: selected.mapLat,
    lng: selected.mapLng,
    color: statusColor[selected.status] || '#00b4d8',
    label: selected.type,
    pulse: selected.status !== 'resolved',
    popupHtml: `<b style="color:${statusColor[selected.status]}">${selected.type}</b><br/>${selected.location}<br/><small>${selected.time} · ${selected.status.toUpperCase()}</small>`,
  }], [selected]);

  return (
    <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 110, right: 30, zIndex: 1000, background: 'rgba(0,180,216,0.15)', border: '1px solid rgba(0,180,216,0.4)', borderRadius: 12, padding: '12px 24px', color: '#00b4d8', fontWeight: 800, fontSize: 13, backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 32px rgba(0,180,216,0.2)' }}>
          <Check size={16} strokeWidth={3} /> {toast}
        </div>
      )}

      {/* Header with improved visuals */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#f0f8ff', margin: 0, display: 'flex', alignItems: 'center', gap: 14, letterSpacing: '-0.03em' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, rgba(239,71,111,0.2), rgba(239,71,111,0.1))', border: '1px solid rgba(239,71,111,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(239,71,111,0.2)' }}>
              <Siren size={24} color="#ef476f" className="blink" />
            </div>
            Emergency Operations Center
          </h2>
          <p style={{ color: 'oklch(0.55 0.02 240)', fontSize: 14, margin: '8px 0 0 62px', fontWeight: 500 }}>Real-time spatial incident command & resource dispatching</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
             <div style={{ display: 'flex', gap: 6 }}>
                <span className="badge badge-critical blink" style={{ padding: '4px 12px', fontSize: 11 }}>{incidents.filter(i => i.status === 'critical').length} CRITICAL</span>
                <span className="badge badge-warning" style={{ padding: '4px 12px', fontSize: 11 }}>{incidents.filter(i => i.status === 'warning').length} WARNING</span>
             </div>
             <span style={{ fontSize: 10, color: 'oklch(0.40 0.02 240)', marginTop: 4, fontWeight: 700 }}>LAST UPDATED: JUST NOW</span>
          </div>
        </div>
      </div>

      {/* Stats Row with better cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Active Incidents', value: incidents.filter(i => i.status !== 'resolved').length.toString(), color: '#ef476f', icon: AlertOctagon, desc: 'High priority' },
          { label: 'Avg Response', value: '4.2 min', color: '#ffd166', icon: Clock, desc: '98% target' },
          { label: 'Units Deployed', value: '12', color: '#00b4d8', icon: Users, desc: 'Across 4 zones' },
          { label: 'Resolved Today', value: (18 + incidents.filter(i => i.status === 'resolved').length).toString(), color: '#06d6a0', icon: CheckCircle, desc: '+12% from avg' },
        ].map(({ label, value, color, icon: Icon, desc }) => (
          <div key={label} className="glass-card" style={{ padding: 20, background: `linear-gradient(135deg, ${color}10, transparent)`, borderColor: `${color}25`, transition: 'transform 0.2s ease', cursor: 'default' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}30` }}>
                <Icon size={16} color={color} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'oklch(0.45 0.02 240)', letterSpacing: '0.05em' }}>{desc.toUpperCase()}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color, letterSpacing: '-0.02em' }}>{value}</div>
            <div style={{ fontSize: 12, color: 'oklch(0.70 0.01 240)', marginTop: 4, fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Main Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Incident List with better styling */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h3 style={{ fontSize: 12, fontWeight: 800, color: 'oklch(0.60 0.01 240)', margin: 0, letterSpacing: '0.1em' }}>LIVE INCIDENT FEED</h3>
             <div className="live-dot" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', maxHeight: 600, overflowY: 'auto' }}>
            {incidents.map(inc => (
              <div
                key={inc.id}
                onClick={() => {
                  setSelectedId(inc.id);
                  setAssignTeamName(inc.team);
                }}
                style={{
                  padding: '18px 20px',
                  background: selectedId === inc.id
                    ? `linear-gradient(90deg, ${statusColor[inc.status]}15, rgba(0,180,216,0.05))`
                    : 'transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  borderLeft: `4px solid ${selectedId === inc.id ? statusColor[inc.status] : 'transparent'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {selectedId === inc.id && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `linear-gradient(135deg, ${statusColor[inc.status]}05, transparent)`, pointerEvents: 'none' }} />
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: statusColor[inc.status], letterSpacing: '0.08em' }}>{inc.id}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                     <span style={{ fontSize: 9, fontWeight: 800, color: 'oklch(0.45 0.02 240)', textTransform: 'uppercase' }}>{inc.time}</span>
                     <ChevronRight size={14} color={selectedId === inc.id ? statusColor[inc.status] : 'oklch(0.25 0.02 240)'} />
                  </div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: selectedId === inc.id ? '#f0f8ff' : '#cbd5e1', marginTop: 6, position: 'relative', zIndex: 1 }}>{inc.type}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6, position: 'relative', zIndex: 1 }}>
                  <MapPin size={11} color="oklch(0.40 0.02 240)" />
                  <span style={{ fontSize: 12, color: 'oklch(0.55 0.02 240)', fontWeight: 500 }}>{inc.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                     <span className={`badge badge-${inc.status}`} style={{ fontSize: 9, padding: '2px 8px' }}>{inc.status.toUpperCase()}</span>
                     {inc.team !== 'Unassigned' && (
                        <span style={{ fontSize: 9, background: 'rgba(0,180,255,0.1)', color: '#00b4d8', padding: '2px 8px', borderRadius: 4, fontWeight: 700, border: '1px solid rgba(0,180,255,0.2)' }}>{inc.team}</span>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Detail with PREMIUM styling */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Main Detail Header */}
          <div className="glass-card" style={{ padding: 24, border: `1px solid ${statusColor[selected.status]}40`, background: `linear-gradient(135deg, ${statusColor[selected.status]}08, rgba(0,0,0,0.2))` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: statusColor[selected.status], boxShadow: `0 0 10px ${statusColor[selected.status]}` }} />
                  <span style={{ fontSize: 12, fontWeight: 800, color: statusColor[selected.status], letterSpacing: '0.12em' }}>{selected.id}</span>
                  <span className={`badge badge-${selected.status} ${selected.status !== 'resolved' ? 'blink' : ''}`} style={{ padding: '3px 10px', fontSize: 11 }}>{selected.status.toUpperCase()}</span>
                </div>
                <h3 style={{ fontSize: 26, fontWeight: 900, color: '#f8fafc', margin: '0 0 8px', letterSpacing: '-0.02em' }}>{selected.type}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={15} color="#00b4d8" strokeWidth={2.5} />
                    <span style={{ fontSize: 14, color: 'oklch(0.80 0.01 240)', fontWeight: 600 }}>{selected.location}</span>
                  </div>
                  <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldAlert size={14} color={selected.priority === 'High' || selected.priority === 'Urgent' ? '#ef476f' : '#ffd166'} />
                    <span style={{ fontSize: 13, color: 'oklch(0.60 0.02 240)', fontWeight: 600 }}>{selected.priority} Priority</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', color: 'oklch(0.50 0.02 240)' }}>
                   <Clock size={14} />
                   <span style={{ fontSize: 13, fontWeight: 700 }}>{selected.time}</span>
                </div>
                <span style={{ fontSize: 10, color: 'oklch(0.40 0.02 240)', fontWeight: 700 }}>REPORTED AT {selected.timeline[0].t}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
               {/* Team Management */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: 'oklch(0.50 0.02 240)', letterSpacing: '0.05em' }}>RESOURCE ALLOCATION</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select
                      value={assignTeamName}
                      onChange={e => setAssignTeamName(e.target.value)}
                      style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,180,216,0.3)', borderRadius: 10, padding: '10px 14px', color: '#e0f0ff', fontSize: 14, fontWeight: 600, outline: 'none', cursor: 'pointer', appearance: 'none' }}
                    >
                      {teams.map(t => <option key={t} value={t} style={{ background: '#111' }}>{t}</option>)}
                    </select>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '0 20px', minWidth: 140 }} 
                      onClick={handleAssignTeam}
                      disabled={isDispatching}
                    >
                      {isDispatching ? <><div className="live-dot" style={{ margin: 0 }} /> Dispatching...</> : <><Users size={15} /> Dispatch</>}
                    </button>
                  </div>
               </div>
               
               {/* Incident Actions */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: 'oklch(0.50 0.02 240)', letterSpacing: '0.05em' }}>INCIDENT CONTROL</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {selected.status !== 'resolved' && (
                      <>
                        <button className="btn-ghost" style={{ flex: 1, borderColor: 'rgba(239,71,111,0.3)', color: '#ef476f' }} onClick={handleEscalate}>
                          <ShieldAlert size={14} /> Escalate
                        </button>
                        <button className="btn-ghost" style={{ flex: 1, borderColor: 'rgba(6,214,160,0.3)', color: '#06d6a0' }} onClick={handleResolve}>
                          <Check size={14} /> Resolve
                        </button>
                      </>
                    )}
                    {selected.status === 'resolved' && (
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(6,214,160,0.1)', borderRadius: 10, color: '#06d6a0', fontWeight: 700, fontSize: 14, border: '1px solid rgba(6,214,160,0.2)' }}>
                        <CheckCircle size={16} /> CASE CLOSED
                      </div>
                    )}
                  </div>
               </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
            {/* Real Leaflet Map */}
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden', position: 'relative', height: 340, borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 1000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', borderRadius: 10, padding: '8px 14px', border: '1px solid rgba(0,180,216,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="live-dot" />
                <span style={{ fontSize: 11, color: '#e0f0ff', fontWeight: 700, letterSpacing: '0.02em' }}>LIVE TACTICAL VIEW</span>
              </div>
              <LeafletMap
                lat={selected.mapLat}
                lng={selected.mapLng}
                zoom={16}
                height={340}
                markers={incidentMarkers}
              />
            </div>

            {/* Information & Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
               {/* Metadata Card */}
               <div className="glass-card" style={{ padding: 18, background: 'rgba(0,180,216,0.03)' }}>
                  <h4 style={{ fontSize: 11, fontWeight: 800, color: '#00b4d8', margin: '0 0 14px', letterSpacing: '0.05em' }}>INCIDENT DATA</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                     <div>
                        <div style={{ fontSize: 9, color: 'oklch(0.45 0.02 240)', textTransform: 'uppercase', marginBottom: 2 }}>Reporter</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 4 }}>
                           <PhoneCall size={10} color="#00b4d8" /> {selected.reporter}
                        </div>
                     </div>
                     <div>
                        <div style={{ fontSize: 9, color: 'oklch(0.45 0.02 240)', textTransform: 'uppercase', marginBottom: 2 }}>Assigned Unit</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: selected.team === 'Unassigned' ? '#ffd166' : '#06d6a0' }}>{selected.team}</div>
                     </div>
                  </div>
               </div>

               {/* Timeline Card */}
               <div className="glass-card" style={{ padding: 20, flex: 1, maxHeight: 240, overflowY: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                     <Clock size={14} color="#00b4d8" />
                     <h4 style={{ fontSize: 13, fontWeight: 700, color: '#f0f8ff', margin: 0 }}>Incident Timeline</h4>
                  </div>
                  <div style={{ position: 'relative', paddingLeft: 24 }}>
                    <div style={{ position: 'absolute', left: 7, top: 5, bottom: 5, width: 2, background: 'rgba(255,255,255,0.06)' }} />
                    {selected.timeline.map((step, i) => (
                      <div key={i} style={{ position: 'relative', marginBottom: 20, display: 'flex', gap: 12 }}>
                        <div style={{
                          position: 'absolute', left: -24, top: 3,
                          width: 16, height: 16, borderRadius: '50%',
                          background: (step.done || selected.status === 'resolved') ? statusColor[selected.status] : 'rgba(255,255,255,0.05)',
                          border: `3px solid ${ (step.done || selected.status === 'resolved') ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.1)'}`,
                          boxShadow: (step.done || selected.status === 'resolved') ? `0 0 10px ${statusColor[selected.status]}50` : 'none',
                          zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                           {(step.done || selected.status === 'resolved') && <Check size={8} color="#000" strokeWidth={4} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 10, color: (step.done || selected.status === 'resolved') ? '#00b4d8' : 'oklch(0.40 0.02 240)', fontWeight: 800 }}>{step.t}</span>
                            <span style={{ fontSize: 8, textTransform: 'uppercase', fontWeight: 800, color: 'oklch(0.35 0.02 240)' }}>{step.type}</span>
                          </div>
                          <p style={{ fontSize: 13, color: (step.done || selected.status === 'resolved') ? 'oklch(0.85 0.01 240)' : 'oklch(0.45 0.02 240)', margin: '4px 0 0', fontWeight: (step.done || selected.status === 'resolved') ? 600 : 500, lineHeight: 1.4 }}>{step.msg}</p>
                        </div>
                      </div>
                    ))}
                    {selected.status === 'resolved' && (
                      <div style={{ position: 'relative', display: 'flex', gap: 12 }}>
                         <div style={{
                          position: 'absolute', left: -24, top: 3,
                          width: 16, height: 16, borderRadius: '50%',
                          background: '#06d6a0', border: '3px solid rgba(0,0,0,0.5)',
                          boxShadow: '0 0 10px rgba(6,214,160,0.5)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                           <Check size={8} color="#000" strokeWidth={4} />
                        </div>
                         <div>
                          <span style={{ fontSize: 10, color: '#06d6a0', fontWeight: 800 }}>JUST NOW</span>
                          <p style={{ fontSize: 13, color: '#06d6a0', margin: '4px 0 0', fontWeight: 700 }}>Incident archived. Resources released.</p>
                        </div>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
