// ============================================
// Auth Context
// ============================================
// Global auth state: user, tokens, login/logout/register.
// Persists to localStorage with auto-refresh on mount.

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from stored tokens on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data.data);
        } catch {
          // Token invalid — clear storage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    setUser(data.data.user);
    toast.success('Welcome! Please check your email to verify your account.');
    return data;
  }, []);

  const login = useCallback(async (email, password, rememberMe = false) => {
    const { data } = await api.post('/auth/login', { email, password, rememberMe });
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    setUser(data.data.user);
    toast.success(`Welcome back, ${data.data.user.name}!`);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Proceed with local logout even if API fails
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const forgotPassword = useCallback(async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    toast.success('If an account exists, a reset link has been sent.');
    return data;
  }, []);

  const resetPassword = useCallback(async (token, password) => {
    const { data } = await api.post('/auth/reset-password', { token, password });
    toast.success('Password reset successful! Please login.');
    return data;
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
