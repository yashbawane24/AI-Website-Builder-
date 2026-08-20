// ============================================
// Projects Page
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, FolderOpen, Star, Archive, MoreVertical, Copy, Trash2, Download, Clock, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [menuOpen, setMenuOpen] = useState(null);

  const fetchProjects = async () => {
    try {
      const params = { limit: 50 };
      if (search) params.search = search;
      if (filter === 'favorites') params.favorite = 'true';
      if (filter === 'archived') params.archived = 'true';
      const { data } = await api.get('/projects', { params });
      setProjects(data.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, [search, filter]);

  const handleAction = async (action, project) => {
    setMenuOpen(null);
    try {
      if (action === 'duplicate') {
        await api.post(`/projects/${project.id}/duplicate`);
        toast.success('Project duplicated');
        fetchProjects();
      } else if (action === 'favorite') {
        await api.put(`/projects/${project.id}/favorite`);
        fetchProjects();
      } else if (action === 'archive') {
        await api.put(`/projects/${project.id}/archive`);
        toast.success(project.isArchived ? 'Unarchived' : 'Archived');
        fetchProjects();
      } else if (action === 'delete') {
        if (confirm('Delete this project? This cannot be undone.')) {
          await api.delete(`/projects/${project.id}`);
          toast.success('Project deleted');
          fetchProjects();
        }
      } else if (action === 'download') {
        window.open(`/api/projects/${project.id}/download?format=html`, '_blank');
      }
    } catch (err) { toast.error('Action failed'); }
  };

  const filters = [
    { key: 'all', label: 'All Projects' },
    { key: 'favorites', label: 'Favorites' },
    { key: 'archived', label: 'Archived' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <motion.h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Projects
        </motion.h1>
        <button onClick={() => navigate('/dashboard/generate')} className="btn btn-primary">
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="input pl-10"
          />
        </div>
        <div className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`btn btn-sm ${filter === f.key ? 'btn-primary' : 'btn-ghost'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card p-4 animate-pulse">
              <div className="h-36 rounded-lg mb-3" style={{ background: 'var(--color-surface-300)' }} />
              <div className="h-4 w-3/4 rounded mb-2" style={{ background: 'var(--color-surface-300)' }} />
              <div className="h-3 w-1/2 rounded" style={{ background: 'var(--color-surface-300)' }} />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <FolderOpen size={48} className="mx-auto mb-4" style={{ color: 'var(--color-text-dim)' }} />
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>No projects found</h2>
          <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>Generate your first website to see it here.</p>
          <button onClick={() => navigate('/dashboard/generate')} className="btn btn-primary">
            <Plus size={16} /> Generate Website
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className="glass-card overflow-hidden cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ y: -2 }}
            >
              <div
                className="h-36 flex items-center justify-center relative"
                style={{ background: 'var(--color-surface-300)' }}
                onClick={() => navigate(`/dashboard/projects/${project.id}`)}
              >
                <FolderOpen size={32} style={{ color: 'var(--color-text-dim)' }} />
                {/* Favorite star */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleAction('favorite', project); }}
                  className="absolute top-2 right-2 bg-transparent border-none cursor-pointer p-1"
                >
                  <Star size={18} fill={project.isFavorite ? 'var(--color-warning)' : 'none'} style={{ color: project.isFavorite ? 'var(--color-warning)' : 'var(--color-text-dim)' }} />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0" onClick={() => navigate(`/dashboard/projects/${project.id}`)}>
                    <h3 className="font-medium text-sm truncate" style={{ color: 'var(--color-text-primary)' }}>{project.name}</h3>
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
                      <Clock size={12} /> {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === project.id ? null : project.id); }}
                      className="btn-icon bg-transparent border-none cursor-pointer"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      <MoreVertical size={16} />
                    </button>
                    {menuOpen === project.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
                        <div className="absolute right-0 top-full mt-1 w-40 rounded-lg py-1 z-50" style={{ background: 'var(--color-surface-200)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-elevated)' }}>
                          {[
                            { action: 'duplicate', icon: Copy, label: 'Duplicate' },
                            { action: 'archive', icon: Archive, label: project.isArchived ? 'Unarchive' : 'Archive' },
                            { action: 'download', icon: Download, label: 'Download' },
                            { action: 'delete', icon: Trash2, label: 'Delete', danger: true },
                          ].map((item) => (
                            <button
                              key={item.action}
                              onClick={() => handleAction(item.action, project)}
                              className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 cursor-pointer bg-transparent border-none"
                              style={{ color: item.danger ? 'var(--color-danger)' : 'var(--color-text-secondary)' }}
                              onMouseEnter={(e) => { e.target.style.background = item.danger ? 'rgba(239,68,68,0.1)' : 'var(--color-surface-300)'; }}
                              onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
                            >
                              <item.icon size={14} /> {item.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
