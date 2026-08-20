// ============================================
// Dashboard Page — Premium SaaS Redesigned
// ============================================

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wand2, FolderOpen, Coins, Zap, ArrowRight, Clock, Plus, Folder, FolderPlus, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const StatCard = ({ icon: Icon, label, value, color, delay, trend }) => (
  <motion.div
    className="rounded-2xl border border-gray-800 bg-[#111827]/60 p-6 shadow-lg shadow-black/20 hover:-translate-y-0.5 transition-all duration-200"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-400">{label}</p>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        {trend && (
          <div className="flex items-center gap-1 text-xs text-[#10B981] font-semibold mt-1">
            <TrendingUp size={12} />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className={`rounded-xl p-3`} style={{ background: `${color}15`, color }}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalProjects: 0, totalAiRequests: 0, totalCreditsUsed: 0 });
  const [recentProjects, setRecentProjects] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, projRes] = await Promise.all([
          api.get('/users/stats'),
          api.get('/projects?limit=6'),
        ]);
        setStats(statsRes.data.data);
        setRecentProjects(projRes.data.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleQuickGenerate = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate('/dashboard/generate', { state: { prompt } });
    }
  };

  const samplePrompts = [
    'Modern portfolio',
    'Restaurant website',
    'Startup landing page',
    'Agency homepage',
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-6 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Welcome back, {user?.name?.split(' ')[0] || 'Sample'} 👋
        </h1>
        <p className="text-sm text-gray-400">
          Here's what's happening with your AI website projects today.
        </p>
      </motion.div>

      {/* Quick Generate Hero Card */}
      <motion.div
        className="relative rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 p-8 shadow-xl shadow-purple-500/5 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Wand2 size={20} />
            </div>
            <h2 className="text-xl font-semibold text-white tracking-tight">Quick Generate</h2>
          </div>

          <form onSubmit={handleQuickGenerate} className="flex flex-col sm:flex-row gap-3">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your website... e.g., 'Modern portfolio for a photographer'"
              className="flex-1 h-14 px-5 rounded-xl border border-gray-700 bg-gray-900/60 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-200 text-sm"
            />
            <button
              type="submit"
              className="h-14 px-8 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/25 transition-all duration-200 hover:from-purple-400 hover:to-indigo-400 hover:shadow-purple-500/40 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              Generate <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-gray-500 mr-1">Suggestions:</span>
            {samplePrompts.map((chipText) => (
              <button
                key={chipText}
                type="button"
                onClick={() => setPrompt(chipText)}
                className="px-3 py-1.5 rounded-lg border border-gray-800 bg-[#111827]/40 hover:bg-gray-800/80 hover:text-white text-gray-400 text-xs transition-colors cursor-pointer"
              >
                {chipText}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          icon={Folder}
          label="Total Projects"
          value={isLoading ? '-' : stats.totalProjects}
          color="#8B5CF6"
          delay={0.15}
          trend="+12% this month"
        />
        <StatCard
          icon={Coins}
          label="Credits Remaining"
          value={user?.credits ?? 0}
          color="#06B6D4"
          delay={0.2}
        />
        <StatCard
          icon={Zap}
          label="AI Requests"
          value={isLoading ? '-' : stats.totalAiRequests}
          color="#F59E0B"
          delay={0.25}
          trend="Active now"
        />
        <StatCard
          icon={Coins}
          label="Credits Used"
          value={isLoading ? '-' : stats.totalCreditsUsed}
          color="#10B981"
          delay={0.3}
        />
      </div>

      {/* Recent Projects Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white tracking-tight">Recent Projects</h2>
          <Link
            to="/dashboard/projects"
            className="px-4 py-2 text-sm font-medium border border-gray-700 bg-gray-900/60 hover:bg-gray-800/80 rounded-xl text-gray-300 no-underline transition-all duration-200"
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-gray-800 bg-[#111827]/40 h-44" />
            ))}
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-850 bg-[#111827]/20 py-16 px-4 text-center">
            <div className="mb-4 rounded-full bg-purple-500/10 p-4 text-purple-400">
              <FolderPlus className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-white">No projects yet</h3>
            <p className="mt-2 max-w-sm text-sm text-gray-400 leading-relaxed">
              Generate your first AI-powered website and it will appear here.
            </p>
            <button
              onClick={() => navigate('/dashboard/generate')}
              className="mt-6 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/25 transition-all duration-200 hover:from-purple-400 hover:to-indigo-400 hover:shadow-purple-500/40 active:scale-[0.98] cursor-pointer border-none"
            >
              Create First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProjects.map((project, i) => (
              <motion.div
                key={project.id}
                className="rounded-2xl border border-gray-800 bg-[#111827]/60 p-5 cursor-pointer shadow-md hover:-translate-y-1 transition-all duration-200 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                onClick={() => navigate(`/dashboard/projects/${project.id}`)}
              >
                <div className="h-36 rounded-xl mb-4 flex items-center justify-center bg-gray-900/80 border border-gray-800 overflow-hidden relative">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-355" />
                  ) : (
                    <FolderOpen size={32} className="text-gray-600 group-hover:text-purple-400 transition-colors duration-200" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <span className="px-3 py-1.5 bg-purple-600 rounded-lg text-xs font-semibold text-white shadow-lg">Open Editor</span>
                  </div>
                </div>
                <h3 className="font-semibold text-sm text-white truncate">{project.name}</h3>
                <p className="text-xs mt-1.5 flex items-center gap-1.5 text-gray-500">
                  <Clock size={12} /> {new Date(project.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
