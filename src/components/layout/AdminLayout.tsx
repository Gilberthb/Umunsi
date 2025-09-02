import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 h-full z-40">
        <AdminSidebar 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={setIsSidebarCollapsed}
        />
      </div>
      
      {/* Main content area */}
      <div 
        className={`transition-all duration-700 ease-in-out ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'
        }`}
      >
        {/* Mobile Navbar */}
        <div className="lg:hidden">
          <AdminNavbar />
        </div>
        
        {/* Page content */}
        <main className="flex-1 pt-16 lg:pt-6 px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;