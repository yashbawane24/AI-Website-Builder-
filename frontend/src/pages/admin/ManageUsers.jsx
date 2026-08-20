// ============================================
// Manage Users — Admin
// ============================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, UserCircle, Coins } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      const { data } = await api.get('/admin/users', { params });
      setUsers(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page, search]);

  const handleRoleChange = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}`, { role });
      toast.success('Role updated');
      fetchUsers();
    } catch { toast.error('Update failed'); }
  };

  const handleCreditAdjust = async (userId, amount) => {
    const credits = prompt(`Enter new credit amount:`);
    if (credits === null) return;
    try {
      await api.put(`/admin/users/${userId}`, { credits: parseInt(credits) });
      toast.success('Credits updated');
      fetchUsers();
    } catch { toast.error('Update failed'); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Manage Users
      </motion.h1>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search users..." className="input pl-10" />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['User', 'Email', 'Role', 'Credits', 'Projects', 'Plan', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center" style={{ color: 'var(--color-text-muted)' }}>Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center" style={{ color: 'var(--color-text-muted)' }}>No users found.</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--color-surface-400)', color: 'var(--color-text-primary)' }}>
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="text-xs px-2 py-1 rounded border-none cursor-pointer"
                      style={{ background: u.role === 'ADMIN' ? 'rgba(124,58,237,0.15)' : 'var(--color-surface-300)', color: u.role === 'ADMIN' ? 'var(--color-primary-400)' : 'var(--color-text-secondary)' }}
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{u.credits}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{u._count?.projects ?? 0}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--color-primary-400)' }}>
                      {u.subscriptions?.[0]?.plan || 'FREE'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleCreditAdjust(u.id)} className="btn btn-ghost btn-sm">
                      <Coins size={14} /> Adjust
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4" style={{ borderTop: '1px solid var(--color-border)' }}>
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="btn btn-ghost btn-sm">Previous</button>
            <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="btn btn-ghost btn-sm">Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
