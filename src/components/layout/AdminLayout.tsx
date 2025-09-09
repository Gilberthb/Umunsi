import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-600 text-lg">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 h-full z-40">
        <AdminSidebar 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={setIsSidebarCollapsed}
          user={user}
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
          <AdminNavbar user={user} />
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