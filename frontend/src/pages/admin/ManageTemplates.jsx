// ============================================
// Manage Templates — Admin
// ============================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, LayoutTemplate } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ManageTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', description: '', prompt: '' });

  const fetchTemplates = async () => {
    try {
      const { data } = await api.get('/templates');
      setTemplates(data.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchTemplates(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/admin/templates/${editId}`, form);
        toast.success('Template updated');
      } else {
        await api.post('/admin/templates', form);
        toast.success('Template created');
      }
      setShowForm(false);
      setEditId(null);
      setForm({ name: '', category: '', description: '', prompt: '' });
      fetchTemplates();
    } catch { toast.error('Failed to save template'); }
  };

  const handleEdit = (t) => {
    setForm({ name: t.name, category: t.category, description: t.description, prompt: t.prompt });
    setEditId(t.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this template?')) return;
    try {
      await api.delete(`/admin/templates/${id}`);
      toast.success('Template deleted');
      fetchTemplates();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <motion.h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Manage Templates
        </motion.h1>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: '', category: '', description: '', prompt: '' }); }} className="btn btn-primary">
          <Plus size={16} /> Add Template
        </button>
      </div>

      {showForm && (
        <motion.div className="glass-card p-6" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            {editId ? 'Edit Template' : 'New Template'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Template Name" className="input" required />
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category (e.g. portfolio)" className="input" required />
            </div>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description" className="input" required />
            <textarea value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })} placeholder="AI generation prompt..." rows={4} className="input resize-none" required />
            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Create'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <div key={t.id} className="glass-card p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <LayoutTemplate size={18} style={{ color: 'var(--color-primary-400)' }} />
                <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>{t.name}</h3>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(t)} className="btn-icon bg-transparent border-none cursor-pointer" style={{ color: 'var(--color-text-muted)' }}>
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDelete(t.id)} className="btn-icon bg-transparent border-none cursor-pointer" style={{ color: 'var(--color-danger)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--color-primary-400)' }}>{t.category}</span>
            <p className="text-sm mt-2 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>{t.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageTemplates;
