// ============================================
// Billing Page
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Check, Crown, Rocket, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PLANS = [
  { id: 'free', name: 'Free', price: '$0', interval: 'forever', icon: CreditCard, features: ['20 Free Credits', 'Basic Templates', 'HTML Export', 'Community Support'], credits: 20 },
  { id: 'pro', name: 'Pro', price: '$19.99', interval: '/month', icon: Rocket, features: ['500 Credits/month', 'All Templates', 'React Export', 'Priority Support', 'Version History', 'Custom Domains'], credits: 500, popular: true },
  { id: 'enterprise', name: 'Enterprise', price: '$49.99', interval: '/month', icon: Building2, features: ['2000 Credits/month', 'Everything in Pro', 'Team Collaboration', 'API Access', 'Dedicated Support', 'White Label', 'Analytics'], credits: 2000 },
];

const Billing = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(null);

  const handleSubscribe = async (planId) => {
    if (planId === 'free') return;
    setLoading(planId);
    try {
      const { data } = await api.post('/payments/create-checkout', { type: 'subscription', packageId: planId });
      window.location.href = data.data.url;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start checkout');
    } finally { setLoading(null); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>Billing & Plans</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Manage your subscription and billing.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan, i) => {
          const Icon = plan.icon;
          return (
            <motion.div
              key={plan.id}
              className={`glass-card p-6 relative ${plan.popular ? 'gradient-border' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -3 }}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-400))', color: 'white' }}>
                  Recommended
                </span>
              )}
              <Icon size={28} className="mb-4" style={{ color: 'var(--color-primary-400)' }} />
              <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold gradient-text">{plan.price}</span>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{plan.interval}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <Check size={16} style={{ color: 'var(--color-success)' }} /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id || plan.id === 'free'}
                className={`btn w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
              >
                {loading === plan.id ? <div className="spinner" /> : plan.id === 'free' ? 'Current Plan' : 'Subscribe'}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Billing;
