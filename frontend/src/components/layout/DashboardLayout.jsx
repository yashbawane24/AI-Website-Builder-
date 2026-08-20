// ============================================
// Dashboard Layout — Classic Flex Flow Layout
// ============================================

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ isAdmin = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#0B1020]">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar (in-flow for desktop, fixed drawer for mobile) */}
      <Sidebar
        isOpen={sidebarOpen}
        isMobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        isAdmin={isAdmin}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header
          onMenuClick={() => setMobileSidebarOpen(true)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        <main className="flex-1 overflow-y-auto bg-[#0B1020]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
