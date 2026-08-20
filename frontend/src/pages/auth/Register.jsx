// ============================================
// Register Page
// ============================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Sparkles, ArrowRight, Wand2, Monitor, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
  terms: z.boolean().refine((v) => v === true, 'You must accept the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { terms: false },
  });

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await registerUser(formData.name, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
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
              <h1>Create your account</h1>
              <p>Start building AI-powered websites today</p>
            </div>

            {errors.root && (
              <div className="auth-error-banner">
                {errors.root.message}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div className="auth-field">
                <label>Full Name</label>
                <div className="field-input-wrap">
                  <User size={16} className="field-icon" />
                  <input
                    {...register('name')}
                    placeholder="Yash Bawane"
                    className={`field-input ${errors.name ? 'has-error' : ''}`}
                  />
                </div>
                {errors.name && <p className="field-error">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="auth-field">
                <label>Email</label>
                <div className="field-input-wrap">
                  <Mail size={16} className="field-icon" />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="yashbawane24@gmail.com"
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

              {/* Confirm Password */}
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

              {/* Terms */}
              <label className="auth-checkbox-row">
                <input
                  {...register('terms')}
                  type="checkbox"
                />
                <span>
                  I agree to the{' '}
                  <a href="#">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#">Privacy Policy</a>
                </span>
              </label>
              {errors.terms && <p className="field-error" style={{ marginTop: '-12px', marginBottom: '12px' }}>{errors.terms.message}</p>}

              {/* Submit */}
              <button type="submit" disabled={isLoading} className="auth-submit-btn">
                {isLoading ? <div className="spinner" /> : <><span>Create Account</span><ArrowRight size={16} /></>}
              </button>
            </form>

            {/* Divider */}
            <div className="auth-divider">
              <span>OR</span>
            </div>

            <p className="auth-footer-text">
              Already have an account?{' '}
              <Link to="/login">
                Sign in
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

export default Register;
