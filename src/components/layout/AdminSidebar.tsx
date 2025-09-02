import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  User,
  Bell,
  Search,
  Home,
  FolderOpen,
  Activity,
  Shield,
  Palette,
  Database,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Calendar,
  Image,
  Music,
  Globe
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  color: string;
  description?: string;
}

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const sidebarItems: SidebarItem[] = [
    { 
      name: 'Dashboard', 
      path: '/admin', 
      icon: LayoutDashboard, 
      color: 'from-blue-600 to-blue-700',
      description: 'Overview & insights'
    },
    { 
      name: 'Articles', 
      path: '/admin/articles', 
      icon: FileText, 
      badge: 12, 
      color: 'from-emerald-600 to-emerald-700',
      description: 'Manage content'
    },
    { 
      name: 'Users', 
      path: '/admin/users', 
      icon: Users, 
      badge: 8, 
      color: 'from-violet-600 to-violet-700',
      description: 'User management'
    },
    { 
      name: 'Categories', 
      path: '/admin/categories', 
      icon: FolderOpen, 
      color: 'from-amber-600 to-amber-700',
      description: 'Content organization'
    },
    { 
      name: 'Analytics', 
      path: '/admin/analytics', 
      icon: BarChart3, 
      color: 'from-indigo-600 to-indigo-700',
      description: 'Performance metrics'
    },
    { 
      name: 'Media', 
      path: '/admin/media', 
      icon: Image, 
      color: 'from-rose-600 to-rose-700',
      description: 'Files & images'
    },
    { 
      name: 'Logs', 
      path: '/admin/logs', 
      icon: Activity, 
      color: 'from-red-600 to-red-700',
      description: 'System activity'
    },
    { 
      name: 'Settings', 
      path: '/admin/settings', 
      icon: Settings, 
      color: 'from-slate-600 to-slate-700',
      description: 'Configuration'
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`
        hidden lg:flex fixed top-0 left-0 h-full 
        bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
        border-r border-slate-700/50 shadow-2xl backdrop-blur-xl
        transition-all duration-700 ease-in-out z-40
        ${isCollapsed ? 'w-20' : 'w-80'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 w-full bg-slate-800/90 backdrop-blur-xl">
          {!isCollapsed && (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 via-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/25">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-3 border-slate-800 shadow-lg animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-emerald-100 to-emerald-200 bg-clip-text text-transparent">
                  Umunsi
                </h1>
                <p className="text-sm text-slate-400 font-medium tracking-wide">Administration Panel</p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => onToggleCollapse(!isCollapsed)}
            className="p-3 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-110 border border-slate-600/30 hover:border-emerald-500/50"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group relative overflow-hidden rounded-2xl transition-all duration-500 ease-out
                  ${isActive(item.path) 
                    ? `bg-gradient-to-r ${item.color} text-white shadow-2xl shadow-slate-900/50 transform scale-105 border border-white/20` 
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:shadow-xl hover:scale-105 border border-transparent hover:border-slate-600/50'
                  }
                `}
              >
                <div className="flex items-center p-4">
                  <div className={`p-3 rounded-xl transition-all duration-500 ${
                    isActive(item.path) 
                      ? 'bg-white/20 backdrop-blur-sm shadow-lg' 
                      : 'bg-slate-700/50 group-hover:bg-slate-600/50 shadow-md'
                  }`}>
                    <Icon className={`w-6 h-6 transition-all duration-500 ${
                      isActive(item.path) 
                        ? 'text-white' 
                        : 'text-slate-400 group-hover:text-white'
                    }`} />
                  </div>
                  {!isCollapsed && (
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-base transition-all duration-500">{item.name}</span>
                        {item.badge && (
                          <span className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-500 ${
                            isActive(item.path) 
                              ? 'bg-white/20 text-white' 
                              : 'bg-emerald-500 text-white shadow-lg'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className={`text-xs mt-1 transition-all duration-500 ${
                          isActive(item.path) 
                            ? 'text-white/80' 
                            : 'text-slate-500 group-hover:text-slate-400'
                        }`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Active indicator */}
                {isActive(item.path) && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1.5 h-12 bg-white rounded-l-full shadow-lg"></div>
                )}
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-6 border-t border-slate-700/50 bg-slate-800/90 backdrop-blur-xl">
          {!isCollapsed && (
            <div className="mb-6">
              <div className="flex items-center space-x-4 p-5 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-2xl border border-slate-600/50 shadow-xl backdrop-blur-sm">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 via-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/25">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-3 border-slate-800 shadow-lg"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-base truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-slate-300 text-sm truncate">{user?.email}</p>
                  <span className="inline-block px-4 py-2 text-xs font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full mt-3 shadow-lg border border-emerald-400/50">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-3">
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-slate-700/50 hover:text-emerald-400 rounded-2xl transition-all duration-300 hover:shadow-lg group hover:scale-105 border border-transparent hover:border-slate-600/50"
            >
              <div className="p-2.5 bg-slate-700/50 group-hover:bg-emerald-500/20 rounded-xl transition-all duration-300">
                <Home className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div>
                  <span className="font-medium">View Site</span>
                  <p className="text-xs text-slate-500 group-hover:text-slate-400">Go to homepage</p>
                </div>
              )}
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-red-500/20 hover:text-red-400 rounded-2xl transition-all duration-300 hover:shadow-lg group hover:scale-105 border border-transparent hover:border-red-500/50"
            >
              <div className="p-2.5 bg-slate-700/50 group-hover:bg-red-500/20 rounded-xl transition-all duration-300">
                <LogOut className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div>
                  <span className="font-medium">Logout</span>
                  <p className="text-xs text-slate-500 group-hover:text-red-400/70">Sign out safely</p>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;