// ============================================
// Admin Dashboard
// ============================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FolderOpen, DollarSign, Zap, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

const mockChartData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  revenue: Math.floor(Math.random() * 5000) + 1000,
  users: Math.floor(Math.random() * 200) + 50,
}));

const StatCard = ({ icon: Icon, label, value, color, change, delay }) => (
  <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
    <div className="flex items-center justify-between mb-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
        <Icon size={20} style={{ color }} />
      </div>
      {change && (
        <span className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--color-success)' }}>
          <TrendingUp size={12} /> {change}
        </span>
      )}
    </div>
    <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{value}</p>
    <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalProjects: 0, totalRevenue: 0, totalAiRequests: 0, newUsersLast30Days: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data.data);
      } catch {}
    };
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Admin Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="var(--color-primary-500)" change={`+${stats.newUsersLast30Days} this month`} delay={0.1} />
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} color="var(--color-success)" change="+12%" delay={0.15} />
        <StatCard icon={FolderOpen} label="Total Projects" value={stats.totalProjects} color="var(--color-accent-500)" delay={0.2} />
        <StatCard icon={Zap} label="AI Requests" value={stats.totalAiRequests} color="var(--color-warning)" delay={0.25} />
      </div>

      {/* Revenue Chart */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Revenue Overview</h3>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockChartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }} />
              <Area type="monotone" dataKey="revenue" stroke="#7c3aed" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
