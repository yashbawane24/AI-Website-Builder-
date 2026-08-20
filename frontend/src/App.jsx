// ============================================
// App.jsx — Router Configuration
// ============================================

import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Pages (eager load — small bundle)
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

// Lazy‑loaded Pages
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Generator = lazy(() => import('./pages/generator/Generator'));
const Projects = lazy(() => import('./pages/projects/Projects'));
const ProjectEditor = lazy(() => import('./pages/projects/ProjectEditor'));
const Templates = lazy(() => import('./pages/templates/Templates'));
const Credits = lazy(() => import('./pages/billing/Credits'));
const Billing = lazy(() => import('./pages/billing/Billing'));
const Profile = lazy(() => import('./pages/profile/Profile'));
const Settings = lazy(() => import('./pages/settings/Settings'));

// Admin
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'));
const ManagePayments = lazy(() => import('./pages/admin/ManagePayments'));
const ManageTemplates = lazy(() => import('./pages/admin/ManageTemplates'));

// Loading Spinner
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-surface-50)' }}>
    <div className="text-center">
      <div className="spinner mx-auto" style={{ width: 36, height: 36 }} />
      <p className="mt-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
    </div>
  </div>
);

// Route Guards
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

const App = () => {
  return (
    <>

      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />

          {/* Auth */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
          <Route path="/reset-password/:token" element={<GuestRoute><ResetPassword /></GuestRoute>} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="generate" element={<Generator />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectEditor />} />
            <Route path="templates" element={<Templates />} />
            <Route path="credits" element={<Credits />} />
            <Route path="billing" element={<Billing />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><DashboardLayout isAdmin={true} /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="payments" element={<ManagePayments />} />
            <Route path="templates" element={<ManageTemplates />} />
          </Route>

          {/* 404 Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
