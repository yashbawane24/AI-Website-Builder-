// ============================================
// Manage Payments — Admin
// ============================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/admin/payments', { params: { page, limit: 20 } });
        setPayments(data.data);
        setTotalPages(data.pagination.totalPages);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Payments
      </motion.h1>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['User', 'Type', 'Amount', 'Credits', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center" style={{ color: 'var(--color-text-muted)' }}>Loading...</td></tr>
              ) : payments.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-primary)' }}>{p.user?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{p.type.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>${p.amount}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{p.credits}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{
                      background: p.status === 'COMPLETED' ? 'rgba(34,197,94,0.1)' : p.status === 'PENDING' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                      color: p.status === 'COMPLETED' ? 'var(--color-success)' : p.status === 'PENDING' ? 'var(--color-warning)' : 'var(--color-danger)',
                    }}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
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

export default ManagePayments;
