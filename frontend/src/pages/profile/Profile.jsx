// ============================================
// Profile Page
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { UserCircle, Mail, Lock, Eye, EyeOff, Camera, Trash2, Crown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name || '' },
  });

  const { register: registerPw, handleSubmit: handlePwSubmit, reset: resetPw, formState: { errors: pwErrors } } = useForm();

  const onSaveProfile = async (data) => {
    setSaving(true);
    try {
      const { data: res } = await api.put('/users/profile', { name: data.name });
      updateUser(res.data);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  const onChangePassword = async (data) => {
    setChangingPw(true);
    try {
      await api.put('/users/password', { currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password updated!');
      resetPw();
    } catch (err) { toast.error(err.response?.data?.message || 'Password change failed'); }
    finally { setChangingPw(false); }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const { data } = await api.post('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser({ avatar: data.data.avatar });
      toast.success('Avatar updated!');
    } catch { toast.error('Upload failed'); }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/users/account', { data: { password: deletePassword } });
      toast.success('Account deleted');
      logout();
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Profile
      </motion.h1>

      {/* Avatar + Info */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="relative">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold" style={{ background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-accent-500))', color: 'white' }}>
              {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : user?.name?.[0]?.toUpperCase()}
            </div>
            <label className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer" style={{ background: 'var(--color-surface-300)', border: '2px solid var(--color-surface-100)' }}>
              <Camera size={14} style={{ color: 'var(--color-text-secondary)' }} />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{user?.name}</h2>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Crown size={14} style={{ color: 'var(--color-primary-400)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--color-primary-400)' }}>
                {user?.subscription?.plan || 'Free'} Plan
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--color-primary-400)' }}>
                {user?.credits ?? 0} credits
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Edit Profile</h3>
        <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Full Name</label>
            <div className="relative">
              <UserCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
              <input {...register('name')} className="input pl-10" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
              <input value={user?.email || ''} disabled className="input pl-10 opacity-60 cursor-not-allowed" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? <div className="spinner" /> : 'Save Changes'}
          </button>
        </form>
      </motion.div>

      {/* Change Password */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Change Password</h3>
        <form onSubmit={handlePwSubmit(onChangePassword)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Current Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
              <input {...registerPw('currentPassword', { required: true })} type={showCurrentPw ? 'text' : 'password'} className="input pl-10 pr-10" />
              <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer" style={{ color: 'var(--color-text-muted)' }}>
                {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>New Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
              <input {...registerPw('newPassword', { required: true, minLength: 8 })} type={showNewPw ? 'text' : 'password'} className="input pl-10 pr-10" />
              <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer" style={{ color: 'var(--color-text-muted)' }}>
                {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={changingPw} className="btn btn-secondary">
            {changingPw ? <div className="spinner" /> : 'Update Password'}
          </button>
        </form>
      </motion.div>

      {/* Danger Zone */}
      <motion.div className="glass-card p-6" style={{ borderColor: 'rgba(239,68,68,0.2)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-danger)' }}>Danger Zone</h3>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button onClick={() => setShowDeleteModal(true)} className="btn btn-danger btn-sm">
          <Trash2 size={14} /> Delete Account
        </button>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <motion.div className="glass-card p-6 w-full max-w-sm" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-danger)' }}>Delete Account</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>Enter your password to confirm:</p>
            <input type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} placeholder="Password" className="input mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary flex-1">Cancel</button>
              <button onClick={handleDeleteAccount} className="btn btn-danger flex-1">Delete</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;
