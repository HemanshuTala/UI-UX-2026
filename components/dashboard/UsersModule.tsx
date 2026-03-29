'use client';

import { useState, useMemo, useCallback } from 'react';
import { Shield, Edit2, Trash2, Plus, Download, Search, X, Check } from 'lucide-react';

const initialUsers = [
  { id: 1, name: 'Rohan Mehta', email: 'r.mehta@citygov.in', role: 'Admin', lastActive: '5 min ago', status: 'online', zone: 'Central' },
  { id: 2, name: 'Sunita Rao', email: 's.rao@citygov.in', role: 'Operator', lastActive: '1h ago', status: 'online', zone: 'North' },
  { id: 3, name: 'Kiran Joshi', email: 'k.joshi@citygov.in', role: 'Analyst', lastActive: '2h ago', status: 'offline', zone: 'East' },
  { id: 4, name: 'Dev Patil', email: 'd.patil@citygov.in', role: 'Operator', lastActive: '3h ago', status: 'offline', zone: 'West' },
  { id: 5, name: 'Meena Agarwal', email: 'm.agarwal@citygov.in', role: 'Analyst', lastActive: 'Yesterday', status: 'offline', zone: 'South' },
  { id: 6, name: 'Amit Shah', email: 'a.shah@citygov.in', role: 'Operator', lastActive: '4h ago', status: 'offline', zone: 'Central' },
  { id: 7, name: 'Priya Desai', email: 'p.desai@citygov.in', role: 'Analyst', lastActive: '6h ago', status: 'offline', zone: 'North' },
];

const rolePermissions: Record<string, string[]> = {
  Admin: ['Full Access', 'User Management', 'API Config', 'Alert Settings', 'Data Export'],
  Operator: ['View Dashboard', 'Manage Incidents', 'Assign Teams', 'Update Status'],
  Analyst: ['View Dashboard', 'Historical Data', 'Reports', 'Export CSV'],
};
const roleColors: Record<string, string> = { Admin: '#7c3aed', Operator: '#00b4d8', Analyst: '#06d6a0' };

type User = typeof initialUsers[0];

export default function UsersModule() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRole, setEditRole] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Analyst', zone: 'Central' });
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = filterRole === 'All' || u.role === filterRole;
      return matchSearch && matchRole;
    });
  }, [users, search, filterRole]);

  const handleDelete = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast('User removed successfully.');
  };

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setEditRole(user.role);
  };

  const saveEdit = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: editRole } : u));
    setEditingId(null);
    showToast('Role updated successfully.');
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    const id = Math.max(...users.map(u => u.id)) + 1;
    setUsers(prev => [...prev, { ...newUser, id, lastActive: 'Just now', status: 'online' }]);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: 'Analyst', zone: 'Central' });
    showToast(`User "${newUser.name}" added.`);
  };

  const exportCSV = () => {
    const csv = ['Name,Email,Role,Status,Zone,Last Active',
      ...users.map(u => `${u.name},${u.email},${u.role},${u.status},${u.zone},${u.lastActive}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'users.csv'; a.click();
    showToast('CSV exported.');
  };

  return (
    <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 110, right: 30, zIndex: 200, background: 'rgba(6,214,160,0.15)', border: '1px solid rgba(6,214,160,0.4)', borderRadius: 12, padding: '12px 20px', color: '#06d6a0', fontWeight: 700, fontSize: 13, backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Check size={14} /> {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f0f8ff', margin: 0 }}>User Management</h2>
          <p style={{ color: 'oklch(0.50 0.02 240)', fontSize: 13, margin: '4px 0 0' }}>Role-based access control for {users.length} city administrators</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" onClick={exportCSV}><Download size={14} />Export CSV</button>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}><Plus size={14} />Add User</button>
        </div>
      </div>

      {/* Role Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {Object.entries(rolePermissions).map(([role, perms]) => (
          <div key={role} className="glass-card"
            onClick={() => setFilterRole(filterRole === role ? 'All' : role)}
            style={{ padding: 20, borderColor: filterRole === role ? roleColors[role] : `${roleColors[role]}30`, background: `${roleColors[role]}${filterRole === role ? '14' : '08'}`, cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${roleColors[role]}20`, border: `1px solid ${roleColors[role]}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={16} color={roleColors[role]} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: roleColors[role] }}>{role}</div>
                <div style={{ fontSize: 11, color: 'oklch(0.50 0.02 240)' }}>{users.filter(u => u.role === role).length} user(s) · {filterRole === role ? 'Filtering ✓' : 'Click to filter'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {perms.map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'oklch(0.65 0.01 240)' }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: roleColors[role], flexShrink: 0 }} />
                  {p}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 14px', flex: 1 }}>
          <Search size={14} color="oklch(0.45 0.02 240)" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            style={{ background: 'none', border: 'none', outline: 'none', color: 'oklch(0.85 0.01 240)', fontSize: 13, width: '100%', fontFamily: 'inherit' }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><X size={13} color="oklch(0.45 0.02 240)" /></button>}
        </div>
        {filterRole !== 'All' && (
          <button className="btn-ghost" style={{ whiteSpace: 'nowrap', color: roleColors[filterRole] }} onClick={() => setFilterRole('All')}>
            <X size={12} /> Clear filter
          </button>
        )}
        <span className="badge badge-info">{filtered.length} of {users.length}</span>
      </div>

      {/* Users Table */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f0f8ff', margin: '0 0 16px' }}>All Users</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['User', 'Email', 'Role', 'Zone', 'Last Active', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: 'oklch(0.50 0.02 240)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'oklch(0.45 0.02 240)', fontSize: 13 }}>No users match your search.</td></tr>
              ) : filtered.map(user => (
                <tr key={user.id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '14px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${roleColors[user.role]}50, ${roleColors[user.role]}20)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: roleColors[user.role], flexShrink: 0 }}>
                        {user.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 600, color: '#e0f0ff' }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 14px', color: 'oklch(0.60 0.02 240)', fontSize: 12 }}>{user.email}</td>
                  <td style={{ padding: '14px 14px' }}>
                    {editingId === user.id ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <select value={editRole} onChange={e => setEditRole(e.target.value)}
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(0,180,216,0.3)', borderRadius: 6, padding: '4px 8px', color: '#e0f0ff', fontSize: 12, outline: 'none' }}>
                          {Object.keys(roleColors).map(r => <option key={r} value={r} style={{ background: '#111' }}>{r}</option>)}
                        </select>
                        <button style={{ background: 'rgba(6,214,160,0.15)', border: '1px solid rgba(6,214,160,0.3)', borderRadius: 6, padding: '4px 8px', color: '#06d6a0', cursor: 'pointer' }} onClick={() => saveEdit(user.id)}><Check size={11} /></button>
                        <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '4px 8px', color: 'oklch(0.55 0.02 240)', cursor: 'pointer' }} onClick={() => setEditingId(null)}><X size={11} /></button>
                      </div>
                    ) : (
                      <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: `${roleColors[user.role]}18`, color: roleColors[user.role], border: `1px solid ${roleColors[user.role]}35` }}>
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 14px', color: 'oklch(0.65 0.02 240)', fontSize: 12 }}>{user.zone}</td>
                  <td style={{ padding: '14px 14px', color: 'oklch(0.55 0.02 240)', fontSize: 12 }}>{user.lastActive}</td>
                  <td style={{ padding: '14px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: user.status === 'online' ? '#06d6a0' : 'oklch(0.35 0.02 240)', boxShadow: user.status === 'online' ? '0 0 8px #06d6a0' : 'none' }} />
                      <span style={{ fontSize: 12, color: user.status === 'online' ? '#06d6a0' : 'oklch(0.45 0.02 240)', fontWeight: 600 }}>{user.status}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-ghost" style={{ padding: '5px 10px', fontSize: 11 }} onClick={() => startEdit(user)}>
                        <Edit2 size={11} /> Edit
                      </button>
                      <button className="btn-ghost" style={{ padding: '5px 10px', fontSize: 11, borderColor: 'rgba(239,71,111,0.3)', color: '#ef476f' }} onClick={() => handleDelete(user.id)}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ width: 420, padding: 32, borderColor: 'rgba(0,180,216,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f0f8ff', margin: 0 }}>Add New User</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'oklch(0.50 0.02 240)' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Full Name', key: 'name', placeholder: 'e.g. Vijay Sharma' },
                { label: 'Email', key: 'email', placeholder: 'v.sharma@citygov.in' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'oklch(0.50 0.02 240)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                  <input value={(newUser as any)[key]} onChange={e => setNewUser(n => ({ ...n, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 9, padding: '10px 14px', color: '#e0f0ff', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                </div>
              ))}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'oklch(0.50 0.02 240)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</div>
                <select value={newUser.role} onChange={e => setNewUser(n => ({ ...n, role: e.target.value }))}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 9, padding: '10px 14px', color: '#e0f0ff', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}>
                  {Object.keys(roleColors).map(r => <option key={r} value={r} style={{ background: '#111' }}>{r}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'oklch(0.50 0.02 240)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Zone</div>
                <select value={newUser.zone} onChange={e => setNewUser(n => ({ ...n, zone: e.target.value }))}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 9, padding: '10px 14px', color: '#e0f0ff', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}>
                  {['Central', 'North', 'South', 'East', 'West'].map(z => <option key={z} value={z} style={{ background: '#111' }}>{z}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleAddUser}>
                <Plus size={14} /> Add User
              </button>
              <button className="btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
