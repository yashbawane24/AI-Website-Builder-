// ============================================
// Reset Password Page
// ============================================

import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Sparkles, CheckCircle, Wand2, Monitor, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const schema = z.object({
  password: z.string().min(8, 'Minimum 8 characters').regex(/[A-Z]/, 'One uppercase letter').regex(/[0-9]/, 'One number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    if (!token) return;
    setIsLoading(true);
    try {
      await resetPassword(token, data.password);
      setDone(true);
    } catch (err) {
      setError('root', { message: err.response?.data?.message || 'Reset failed. The link may have expired.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-layout">
        <div className="auth-brand-panel">
          <div className="brand-orb brand-orb-1" />
          <div className="brand-orb brand-orb-2" />
          <div className="brand-content">
            <Link to="/" className="brand-logo">
              <div className="brand-logo-icon">
                <Sparkles size={20} color="white" />
              </div>
              <span className="text-xl font-bold gradient-text">AI Builder</span>
            </Link>
            <h1 className="brand-tagline">Create stunning websites with AI</h1>
            <p className="brand-subtitle">Build professional websites in seconds. No coding required.</p>
            <div className="brand-footer">
              © {new Date().getFullYear()} AI Website Builder. All rights reserved.
            </div>
          </div>
        </div>
        <div className="auth-form-panel">
          <div className="form-wrapper">
            <div className="auth-form-card text-center">
              <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Invalid Link</h1>
              <p className="mb-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>This password reset link is invalid or expired.</p>
              <Link to="/forgot-password" className="btn btn-primary w-full">Request New Link</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-layout">
      {/* Left branding panel */}
      <div className="auth-brand-panel">
        <div className="brand-orb brand-orb-1" />
        <div className="brand-orb brand-orb-2" />
        <div className="brand-content">
          <Link to="/" className="brand-logo">
            <div className="brand-logo-icon">
              <Sparkles size={20} color="white" />
            </div>
            <span className="text-xl font-bold gradient-text">AI Builder</span>
          </Link>
          <h1 className="brand-tagline">Create stunning websites with AI</h1>
          <p className="brand-subtitle">Build professional websites in seconds. No coding required.</p>
          <ul className="brand-features">
            <li>
              <div className="feature-icon-box">
                <Wand2 size={16} style={{ color: 'var(--color-primary-400)' }} />
              </div>
              <span>AI-Powered Generation</span>
            </li>
            <li>
              <div className="feature-icon-box">
                <Monitor size={16} style={{ color: 'var(--color-primary-400)' }} />
              </div>
              <span>Modern & Responsive Previews</span>
            </li>
            <li>
              <div className="feature-icon-box">
                <Download size={16} style={{ color: 'var(--color-primary-400)' }} />
              </div>
              <span>Export & Deploy Instantly</span>
            </li>
          </ul>
          <div className="brand-footer">
            © {new Date().getFullYear()} AI Website Builder. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="form-wrapper">
          {/* Mobile Logo */}
          <Link to="/" className="auth-mobile-logo">
            <div className="brand-logo-icon">
              <Sparkles size={20} color="white" />
            </div>
            <span className="text-xl font-bold gradient-text">AI Builder</span>
          </Link>

          <motion.div
            className="auth-form-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {done ? (
              <div className="auth-success-state">
                <div className="success-icon-wrap">
                  <CheckCircle size={24} style={{ color: 'var(--color-success)' }} />
                </div>
                <h2>Password Reset!</h2>
                <p>Your password has been updated successfully.</p>
                <button onClick={() => navigate('/login')} className="btn btn-primary w-full">Go to Login</button>
              </div>
            ) : (
              <>
                <div className="form-header">
                  <h1>Set new password</h1>
                  <p>Choose a strong password for your account</p>
                </div>

                {errors.root && (
                  <div className="auth-error-banner">
                    {errors.root.message}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="auth-field">
                    <label>New Password</label>
                    <div className="field-input-wrap">
                      <Lock size={16} className="field-icon" />
                      <input
                        {...register('password')}
                        type={showPw ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`field-input ${errors.password ? 'has-error' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="field-toggle"
                        tabIndex={-1}
                      >
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className="field-error">{errors.password.message}</p>}
                  </div>

                  <div className="auth-field">
                    <label>Confirm Password</label>
                    <div className="field-input-wrap">
                      <Lock size={16} className="field-icon" />
                      <input
                        {...register('confirmPassword')}
                        type="password"
                        placeholder="••••••••"
                        className={`field-input ${errors.confirmPassword ? 'has-error' : ''}`}
                      />
                    </div>
                    {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
                  </div>

                  <button type="submit" disabled={isLoading} className="auth-submit-btn">
                    {isLoading ? <div className="spinner" /> : 'Reset Password'}
                  </button>
                </form>
              </>
            )}
          </motion.div>

          <p className="auth-copyright">
            © {new Date().getFullYear()} AI Website Builder. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
