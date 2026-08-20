// ============================================
// Credits Page
// ============================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coins, Zap, TrendingUp, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const PACKAGES = [
  { id: 'credits_100', credits: 100, price: '$9.99', popular: false },
  { id: 'credits_500', credits: 500, price: '$39.99', popular: true },
  { id: 'credits_1000', credits: 1000, price: '$69.99', popular: false },
];

const Credits = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/payments/transactions?limit=10');
        setTransactions(data.data);
      } catch {}
    };
    load();
  }, []);

  const handlePurchase = async (packageId) => {
    setLoading(true);
    try {
      const { data } = await api.post('/payments/create-checkout', { type: 'credits', packageId });
      window.location.href = data.data.url;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start checkout');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>Credits</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Purchase credits to generate AI-powered websites.</p>
      </motion.div>

      {/* Balance Card */}
      <motion.div className="glass-card p-6" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.05))' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-400))' }}>
            <Coins size={28} color="white" />
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Current Balance</p>
            <p className="text-4xl font-bold gradient-text">{user?.credits ?? 0}</p>
          </div>
          <div className="ml-auto text-right hidden sm:block">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Cost per generation</p>
            <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>2 credits</p>
          </div>
        </div>
      </motion.div>

      {/* Packages */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Buy Credits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              className={`glass-card p-6 text-center relative ${pkg.popular ? 'gradient-border' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              whileHover={{ y: -3 }}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-400))', color: 'white' }}>
                  Most Popular
                </span>
              )}
              <Zap size={28} className="mx-auto mb-3" style={{ color: 'var(--color-primary-400)' }} />
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>{pkg.credits}</p>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>credits</p>
              <p className="text-2xl font-bold mb-4 gradient-text">{pkg.price}</p>
              <button onClick={() => handlePurchase(pkg.id)} disabled={loading} className="btn btn-primary w-full">
                <ShoppingCart size={16} /> Buy Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Recent Transactions</h2>
        <div className="glass-card overflow-hidden">
          {transactions.length === 0 ? (
            <p className="p-8 text-center" style={{ color: 'var(--color-text-muted)' }}>No transactions yet.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Type</th>
                  <th className="px-4 py-3 text-right text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Amount</th>
                  <th className="px-4 py-3 text-right text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>{tx.type.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium" style={{ color: 'var(--color-text-primary)' }}>${tx.amount}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: tx.status === 'COMPLETED' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: tx.status === 'COMPLETED' ? 'var(--color-success)' : 'var(--color-warning)' }}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Credits;
