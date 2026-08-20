// ============================================
// Project Editor Page
// ============================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Download, RefreshCw, Monitor, Tablet, Smartphone, Eye, Code, History } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import LivePreview from '../../components/preview/LivePreview';
import CodeEditor from '../../components/editor/CodeEditor';

const ProjectEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('preview');
  const [deviceView, setDeviceView] = useState('desktop');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        setProject(data.data);
      } catch { navigate('/dashboard/projects'); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/projects/${id}`, {
        htmlCode: project.htmlCode,
        cssCode: project.cssCode,
        jsCode: project.jsCode,
        reactCode: project.reactCode,
      });
      toast.success('Saved!');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const handleCodeChange = (type, value) => {
    setProject((prev) => (prev ? { ...prev, [type]: value } : prev));
  };

  if (loading) return (
    <div className="flex items-center justify-center" style={{ minHeight: 400 }}>
      <div className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  );

  if (!project) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard/projects')} className="btn btn-ghost btn-sm"><ArrowLeft size={16} /></button>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{project.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'preview' && (
            <div className="flex items-center gap-1 mr-2" style={{ background: 'var(--color-surface-200)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
              {[{ k: 'desktop', i: Monitor }, { k: 'tablet', i: Tablet }, { k: 'mobile', i: Smartphone }].map(({ k, i: Icon }) => (
                <button key={k} onClick={() => setDeviceView(k)} className="btn-icon border-none cursor-pointer" style={{ background: deviceView === k ? 'var(--color-surface-400)' : 'transparent', color: deviceView === k ? 'var(--color-text-primary)' : 'var(--color-text-muted)', borderRadius: 'var(--radius-sm)', padding: '6px' }}>
                  <Icon size={16} />
                </button>
              ))}
            </div>
          )}
          <button onClick={() => setActiveTab(activeTab === 'preview' ? 'code' : 'preview')} className="btn btn-secondary btn-sm">
            {activeTab === 'preview' ? <><Code size={14} /> Code</> : <><Eye size={14} /> Preview</>}
          </button>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm">
            {saving ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <Save size={14} />} Save
          </button>
          <button onClick={() => window.open(`/api/projects/${id}/download?format=html`, '_blank')} className="btn btn-secondary btn-sm">
            <Download size={14} />
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden" style={{ minHeight: 600 }}>
        {activeTab === 'preview' ? (
          <LivePreview html={project.htmlCode} css={project.cssCode} js={project.jsCode} deviceView={deviceView} />
        ) : (
          <CodeEditor html={project.htmlCode} css={project.cssCode} js={project.jsCode} react={project.reactCode} onChange={handleCodeChange} />
        )}
      </div>
    </div>
  );
};

export default ProjectEditor;
