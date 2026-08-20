// ============================================
// Settings Page
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Monitor, Globe, Bell, BellOff, Shield, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [theme, setTheme] = useState(user?.theme || 'dark');
  const [language, setLanguage] = useState(user?.language || 'en');
  const [notifyEmail, setNotifyEmail] = useState(user?.notifyEmail ?? true);
  const [notifyBrowser, setNotifyBrowser] = useState(user?.notifyBrowser ?? true);
  const [saving, setSaving] = useState(false);

  const themes = [
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ja', label: '日本語' },
    { code: 'hi', label: 'हिन्दी' },
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', { theme, language, notifyEmail, notifyBrowser });
      updateUser(data.data);
      toast.success('Settings saved!');
    } catch { toast.error('Failed to save settings'); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Settings
      </motion.h1>

      {/* Theme */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Appearance</h3>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>Choose your preferred theme.</p>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer border-none transition-all"
                style={{
                  background: theme === t.id ? 'rgba(124,58,237,0.12)' : 'var(--color-surface-200)',
                  border: theme === t.id ? '2px solid var(--color-primary-500)' : '2px solid transparent',
                  color: theme === t.id ? 'var(--color-primary-400)' : 'var(--color-text-secondary)',
                }}
              >
                <Icon size={24} />
                <span className="text-sm font-medium">{t.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Language */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          <Globe size={18} className="inline mr-2" />Language
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>Select your preferred language.</p>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="input max-w-xs"
          style={{ cursor: 'pointer' }}
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </motion.div>

      {/* Notifications */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          <Bell size={18} className="inline mr-2" />Notifications
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>Manage your notification preferences.</p>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Email Notifications</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Receive updates and alerts via email</p>
            </div>
            <div
              className="w-11 h-6 rounded-full relative cursor-pointer transition-colors"
              style={{ background: notifyEmail ? 'var(--color-primary-500)' : 'var(--color-surface-400)' }}
              onClick={() => setNotifyEmail(!notifyEmail)}
            >
              <div className="absolute w-5 h-5 rounded-full top-0.5 transition-all" style={{ background: 'white', left: notifyEmail ? '22px' : '2px' }} />
            </div>
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Browser Notifications</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Receive push notifications in browser</p>
            </div>
            <div
              className="w-11 h-6 rounded-full relative cursor-pointer transition-colors"
              style={{ background: notifyBrowser ? 'var(--color-primary-500)' : 'var(--color-surface-400)' }}
              onClick={() => setNotifyBrowser(!notifyBrowser)}
            >
              <div className="absolute w-5 h-5 rounded-full top-0.5 transition-all" style={{ background: 'white', left: notifyBrowser ? '22px' : '2px' }} />
            </div>
          </label>
        </div>
      </motion.div>

      {/* Privacy */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          <Shield size={18} className="inline mr-2" />Privacy
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>Manage your data and privacy settings.</p>
        <div className="space-y-3">
          <button className="btn btn-secondary btn-sm">Download My Data</button>
          <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>
            Request a copy of all your data. You&apos;ll receive a download link via email.
          </p>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-lg">
          {saving ? <div className="spinner" /> : <Save size={18} />}
          Save Settings
        </button>
      </motion.div>
    </div>
  );
};

export default Settings;
