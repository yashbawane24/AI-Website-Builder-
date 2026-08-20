// ============================================
// Sidebar Component — Flex-Flow Responsive Version
// ============================================

import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Wand2, FolderOpen, LayoutTemplate, Coins,
  CreditCard, UserCircle, Settings, LogOut, Sparkles, X,
  Users, BarChart3, FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const userNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/generate', icon: Wand2, label: 'Generate Website' },
  { to: '/dashboard/projects', icon: FolderOpen, label: 'Projects' },
  { to: '/dashboard/templates', icon: LayoutTemplate, label: 'Templates' },
  { to: '/dashboard/credits', icon: Coins, label: 'Credits' },
  { to: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
  { to: '/dashboard/profile', icon: UserCircle, label: 'Profile' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

const adminNavItems = [
  { to: '/admin', icon: BarChart3, label: 'Overview', end: true },
  { to: '/admin/users', icon: Users, label: 'Manage Users' },
  { to: '/admin/payments', icon: FileText, label: 'Payments' },
  { to: '/admin/templates', icon: LayoutTemplate, label: 'Templates' },
];

const Sidebar = ({ isOpen, isMobileOpen, onClose, isAdmin }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = isAdmin ? adminNavItems : userNavItems;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#111827]">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-gray-800">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md shadow-purple-500/20"
        >
          <Sparkles size={20} color="white" />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold text-lg tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent"
            >
              AI Builder
            </motion.span>
          )}
        </AnimatePresence>

        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="ml-auto lg:hidden p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        {isAdmin && isOpen && (
          <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Admin Panel
          </p>
        )}

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 no-underline group ${
                isActive
                  ? 'text-white bg-gradient-to-r from-purple-500/15 to-indigo-500/10 border-l-[3px] border-purple-500 shadow-inner'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
              }`
            }
          >
            <item.icon size={18} className="flex-shrink-0" />
            {isOpen && (
              <span className="whitespace-nowrap">
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Credits Badge */}
      {!isAdmin && isOpen && (
        <div className="mx-4 mb-4 p-5 rounded-2xl border border-gray-850 bg-[#1F2937]/30 shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <Coins size={15} className="text-purple-400" />
            <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Credits Remaining</span>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">
            {user?.credits ?? 0}
          </p>
        </div>
      )}

      {/* User + Logout */}
      <div className="p-4 border-t border-gray-800">
        {isOpen && (
          <div className="flex items-center gap-3 px-3 py-2 mb-3 rounded-xl bg-gray-900/30">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
            >
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium cursor-pointer bg-transparent border-none text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (flex in-flow container) */}
      <aside
        className="hidden lg:flex flex-col h-screen flex-shrink-0 transition-all duration-300 border-r border-[#1F2937]"
        style={{ width: isOpen ? '288px' : '88px' }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (fixed slide-over drawer) */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-screen z-50 flex flex-col lg:hidden border-r border-[#1F2937]"
            style={{ width: '288px' }}
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
