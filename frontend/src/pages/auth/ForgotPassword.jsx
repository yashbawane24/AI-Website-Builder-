// ============================================
// Forgot Password Page
// ============================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Sparkles, ArrowLeft, Send, Wand2, Monitor, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { forgotPassword } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await forgotPassword(data.email);
      setSent(true);
    } catch {
      // forgotPassword always succeeds (to prevent email enumeration)
      setSent(true);
    } finally {
      setIsLoading(false);
    }
  };

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
            {sent ? (
              <div className="auth-success-state">
                <div className="success-icon-wrap">
                  <Send size={24} style={{ color: 'var(--color-success)' }} />
                </div>
                <h2>Check your email</h2>
                <p>
                  If an account exists with that email, we've sent a password reset link.
                </p>
                <Link to="/login" className="btn btn-secondary w-full">
                  <ArrowLeft size={16} /> Back to Login
                </Link>
              </div>
            ) : (
              <>
                <div className="form-header">
                  <h1>Forgot password?</h1>
                  <p>Enter your email and we'll send a reset link</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="auth-field">
                    <label>Email</label>
                    <div className="field-input-wrap">
                      <Mail size={16} className="field-icon" />
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="you@example.com"
                        className={`field-input ${errors.email ? 'has-error' : ''}`}
                      />
                    </div>
                    {errors.email && <p className="field-error">{errors.email.message}</p>}
                  </div>

                  <button type="submit" disabled={isLoading} className="auth-submit-btn">
                    {isLoading ? <div className="spinner" /> : 'Send Reset Link'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link to="/login" className="text-sm no-underline inline-flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
                    <ArrowLeft size={14} /> Back to Login
                  </Link>
                </div>
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

export default ForgotPassword;
