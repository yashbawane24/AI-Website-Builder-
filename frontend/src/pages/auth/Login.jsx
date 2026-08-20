// ============================================
// Login Page
// ============================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, Wand2, Monitor, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await login(formData.email, formData.password, formData.rememberMe);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError('root', { message });
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
            <div className="form-header">
              <h1>Welcome back</h1>
              <p>Sign in to continue building amazing websites</p>
            </div>

            {errors.root && (
              <div className="auth-error-banner">
                {errors.root.message}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div className="auth-field">
                <label>Email</label>
                <div className="field-input-wrap">
                  <Mail size={16} className="field-icon" />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className={`field-input ${errors.email ? 'has-error' : ''}`}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="field-error">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="auth-field">
                <label>Password</label>
                <div className="field-input-wrap">
                  <Lock size={16} className="field-icon" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`field-input ${errors.password ? 'has-error' : ''}`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="field-toggle"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="field-error">{errors.password.message}</p>}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="auth-options-row">
                <label>
                  <input
                    {...register('rememberMe')}
                    type="checkbox"
                    style={{ accentColor: 'var(--color-primary-500)' }}
                  />
                  Remember me
                </label>
                <Link to="/forgot-password">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button type="submit" disabled={isLoading} className="auth-submit-btn">
                {isLoading ? <div className="spinner" /> : <><span>Sign In</span><ArrowRight size={16} /></>}
              </button>
            </form>

            {/* Divider */}
            <div className="auth-divider">
              <span>OR</span>
            </div>

            <p className="auth-footer-text">
              Don't have an account?{' '}
              <Link to="/register">
                Create account
              </Link>
            </p>
          </motion.div>

          <p className="auth-copyright">
            © {new Date().getFullYear()} AI Website Builder. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
