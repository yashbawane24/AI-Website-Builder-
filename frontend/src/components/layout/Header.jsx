// ============================================
// Header (Topbar) Component — Premium Redesigned
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Coins, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onMenuClick, onToggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header
      className="sticky top-0 z-20 h-16 flex items-center justify-between gap-4 px-6 bg-[#0B1020]/80 backdrop-blur-xl border-b border-[#1F2937]"
    >
      {/* Sidebar Toggle & Mobile Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer border-none bg-transparent"
        >
          <Menu size={22} />
        </button>

        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer border-none bg-transparent"
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl relative hidden sm:block">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search projects, templates..."
          className="w-full h-10 pl-11 pr-4 rounded-xl border border-[#374151] bg-[#111827]/60 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
        />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {/* Credits Badge */}
        <button
          onClick={() => navigate('/dashboard/credits')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-semibold cursor-pointer transition-colors"
        >
          <Coins size={14} />
          <span>{user?.credits ?? 0} Credits</span>
        </button>

        {/* Notifications */}
        <button
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer border-none bg-transparent relative"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 shadow-md shadow-purple-500/40" />
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-gray-800/40 transition-colors cursor-pointer bg-transparent border-none"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/20"
            >
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-200">{user?.name?.split(' ')[0]}</span>
            <ChevronDown size={14} className="text-gray-500" />
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
              <div
                className="absolute right-0 top-full mt-2 w-48 rounded-xl py-2 z-50 bg-[#111827] border border-[#374151] shadow-2xl"
              >
                <button
                  onClick={() => { navigate('/dashboard/profile'); setShowDropdown(false); }}
                  className="w-full px-4 py-2.5 text-sm text-left cursor-pointer bg-transparent border-none text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Profile
                </button>
                <button
                  onClick={() => { navigate('/dashboard/settings'); setShowDropdown(false); }}
                  className="w-full px-4 py-2.5 text-sm text-left cursor-pointer bg-transparent border-none text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Settings
                </button>
                <div className="my-1 border-t border-[#374151]" />
                <button
                  onClick={async () => { await logout(); navigate('/login'); }}
                  className="w-full px-4 py-2.5 text-sm text-left cursor-pointer bg-transparent border-none text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
