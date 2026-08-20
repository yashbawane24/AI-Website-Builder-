// ============================================
// Templates Page
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutTemplate, ArrowRight, Search } from 'lucide-react';
import api from '../../services/api';

const CATEGORIES = ['All', 'portfolio', 'business', 'restaurant', 'agency', 'healthcare', 'education', 'fitness', 'realestate', 'ecommerce', 'travel', 'photography', 'finance', 'saas', 'blog', 'resume'];

const Templates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const params = {};
        if (category !== 'All') params.category = category;
        const { data } = await api.get('/templates', { params });
        setTemplates(data.data);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, [category]);

  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const useTemplate = (template) => {
    navigate('/dashboard/generate', { state: { prompt: template.prompt } });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>Templates</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Start from a professionally designed template.</p>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates..." className="input pl-10" />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`btn btn-sm whitespace-nowrap ${category === c ? 'btn-primary' : 'btn-ghost'}`}
          >
            {c === 'All' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card p-4 animate-pulse">
              <div className="h-40 rounded-lg mb-3" style={{ background: 'var(--color-surface-300)' }} />
              <div className="h-4 w-2/3 rounded mb-2" style={{ background: 'var(--color-surface-300)' }} />
              <div className="h-3 w-full rounded" style={{ background: 'var(--color-surface-300)' }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((template, i) => (
            <motion.div
              key={template.id}
              className="glass-card overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ y: -3 }}
            >
              <div className="h-40 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-surface-300), var(--color-surface-200))' }}>
                <LayoutTemplate size={36} style={{ color: 'var(--color-primary-400)', opacity: 0.5 }} />
              </div>
              <div className="p-4">
                <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--color-primary-400)' }}>
                  {template.category}
                </span>
                <h3 className="font-semibold mt-2 mb-1" style={{ color: 'var(--color-text-primary)' }}>{template.name}</h3>
                <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>{template.description}</p>
                <button onClick={() => useTemplate(template)} className="btn btn-primary btn-sm w-full">
                  Use Template <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Templates;
