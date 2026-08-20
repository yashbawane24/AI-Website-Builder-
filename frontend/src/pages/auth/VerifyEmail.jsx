// ============================================
// Verify Email Page
// ============================================

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // verifying | success | error

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    const verify = async () => {
      try {
        await api.post('/auth/verify-email', { token });
        setStatus('success');
      } catch {
        setStatus('error');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      <div className="bg-mesh" />
      <motion.div className="w-full max-w-md relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 no-underline">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-400))' }}>
              <Sparkles size={20} color="white" />
            </div>
            <span className="text-xl font-bold gradient-text">AI Builder</span>
          </Link>
        </div>

        <div className="glass-card p-8 text-center">
          {status === 'verifying' && (
            <>
              <div className="spinner mx-auto mb-4" style={{ width: 40, height: 40, borderWidth: 3 }} />
              <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Verifying email...</h1>
              <p style={{ color: 'var(--color-text-muted)' }}>Please wait while we verify your email address.</p>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                <CheckCircle size={28} style={{ color: 'var(--color-success)' }} />
              </div>
              <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Email Verified!</h1>
              <p className="mb-6" style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Your email has been verified. You can now enjoy all features.</p>
              <Link to="/dashboard" className="btn btn-primary w-full">Go to Dashboard</Link>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                <XCircle size={28} style={{ color: 'var(--color-danger)' }} />
              </div>
              <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Verification Failed</h1>
              <p className="mb-6" style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>The verification link is invalid or has expired.</p>
              <Link to="/login" className="btn btn-primary w-full">Go to Login</Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
