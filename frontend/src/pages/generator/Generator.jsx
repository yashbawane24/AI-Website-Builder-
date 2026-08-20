// ============================================
// AI Generator Page
// ============================================

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Sparkles, RefreshCw, Download, Save, Monitor, Tablet, Smartphone, Maximize2, Code, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LivePreview from '../../components/preview/LivePreview';
import CodeEditor from '../../components/editor/CodeEditor';

const SUGGESTIONS = [
  'Modern portfolio website for a software engineer',
  'Restaurant website with menu and reservation section',
  'SaaS landing page with pricing and testimonials',
  'Photography portfolio with fullscreen gallery',
  'Startup landing page with animated hero section',
  'E-commerce product showcase page',
];

const Generator = () => {
  const location = useLocation();
  const { user, updateUser } = useAuth();
  const [prompt, setPrompt] = useState(location.state?.prompt || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [activeTab, setActiveTab] = useState('preview'); // preview | code
  const [deviceView, setDeviceView] = useState('desktop');
  const [loadingStage, setLoadingStage] = useState(0);

  const stages = ['Analyzing your prompt...', 'Designing layout...', 'Writing HTML & CSS...', 'Adding interactivity...', 'Polishing design...'];

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setLoadingStage((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
      }, 3000);
      return () => clearInterval(interval);
    }
    setLoadingStage(0);
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return toast.error('Please enter a prompt');
    if ((user?.credits ?? 0) < 2) return toast.error('Insufficient credits. Please purchase more.');

    setIsGenerating(true);
    setGenerated(null);

    try {
      const { data } = await api.post('/generate', {
        prompt,
        projectName: prompt.substring(0, 50),
      });
      setGenerated(data.data.project);
      updateUser({ credits: (user?.credits ?? 0) - 2 });
      toast.success('Website generated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!generated?.id) return;
    if ((user?.credits ?? 0) < 2) return toast.error('Insufficient credits');

    setIsGenerating(true);
    try {
      const { data } = await api.post(`/generate/regenerate/${generated.id}`, { prompt });
      setGenerated(data.data.project);
      updateUser({ credits: (user?.credits ?? 0) - 2 });
      toast.success('Website regenerated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Regeneration failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generated) return;
    try {
      await api.put(`/projects/${generated.id}`, {
        htmlCode: generated.htmlCode,
        cssCode: generated.cssCode,
        jsCode: generated.jsCode,
        reactCode: generated.reactCode,
      });
      toast.success('Project saved!');
    } catch { toast.error('Failed to save'); }
  };

  const handleDownload = () => {
    if (!generated?.id) return;
    window.open(`/api/projects/${generated.id}/download?format=html`, '_blank');
  };

  const handleCodeChange = (type, value) => {
    setGenerated((prev) => (prev ? { ...prev, [type]: value } : prev));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          AI Website Generator
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
          Describe your website and let AI build it for you. Costs 2 credits per generation.
        </p>
      </motion.div>

      {/* Prompt Input */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the website you want to create..."
          rows={4}
          className="input resize-none mb-4"
          style={{ fontSize: '15px', lineHeight: '1.6' }}
        />

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => setPrompt(s)}
              className="px-3 py-1.5 rounded-full text-xs cursor-pointer border-none transition-colors"
              style={{ background: 'var(--color-surface-300)', color: 'var(--color-text-secondary)' }}
              onMouseEnter={(e) => { e.target.style.background = 'var(--color-surface-400)'; }}
              onMouseLeave={(e) => { e.target.style.background = 'var(--color-surface-300)'; }}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="btn btn-primary btn-lg"
          >
            {isGenerating ? <div className="spinner" /> : <Wand2 size={18} />}
            {isGenerating ? 'Generating...' : 'Generate Website'}
          </button>
          <span className="text-sm" style={{ color: 'var(--color-text-dim)' }}>
            Cost: 2 credits • Balance: {user?.credits ?? 0}
          </span>
        </div>
      </motion.div>

      {/* Loading Animation */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            className="glass-card p-8 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="relative w-20 h-20 mx-auto mb-6">
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: '3px solid var(--color-border)' }}
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: '3px solid transparent', borderTopColor: 'var(--color-primary-500)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={24} style={{ color: 'var(--color-primary-400)' }} />
              </div>
            </div>
            <motion.p
              key={loadingStage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-medium"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {stages[loadingStage]}
            </motion.p>
            <div className="flex justify-center gap-1 mt-4">
              {stages.map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full transition-colors"
                  style={{ background: i <= loadingStage ? 'var(--color-primary-500)' : 'var(--color-surface-400)' }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Result */}
      {generated && !isGenerating && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('preview')}
                className={`btn ${activeTab === 'preview' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              >
                <Eye size={14} /> Preview
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`btn ${activeTab === 'code' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              >
                <Code size={14} /> Code
              </button>
            </div>

            <div className="flex items-center gap-2">
              {activeTab === 'preview' && (
                <div className="flex items-center gap-1 mr-2" style={{ background: 'var(--color-surface-200)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
                  {[
                    { key: 'desktop', icon: Monitor },
                    { key: 'tablet', icon: Tablet },
                    { key: 'mobile', icon: Smartphone },
                  ].map(({ key, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setDeviceView(key)}
                      className="btn-icon border-none cursor-pointer"
                      style={{
                        background: deviceView === key ? 'var(--color-surface-400)' : 'transparent',
                        color: deviceView === key ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px',
                      }}
                    >
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
              )}
              <button onClick={handleRegenerate} className="btn btn-secondary btn-sm"><RefreshCw size={14} /> Regenerate</button>
              <button onClick={handleSave} className="btn btn-secondary btn-sm"><Save size={14} /> Save</button>
              <button onClick={handleDownload} className="btn btn-secondary btn-sm"><Download size={14} /> Download</button>
            </div>
          </div>

          {/* Content Area */}
          <div className="glass-card overflow-hidden" style={{ minHeight: 500 }}>
            {activeTab === 'preview' ? (
              <LivePreview
                html={generated.htmlCode}
                css={generated.cssCode}
                js={generated.jsCode}
                deviceView={deviceView}
              />
            ) : (
              <CodeEditor
                html={generated.htmlCode}
                css={generated.cssCode}
                js={generated.jsCode}
                react={generated.reactCode}
                onChange={handleCodeChange}
              />
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Generator;
