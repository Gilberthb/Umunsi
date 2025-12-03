import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Home,
  BarChart3,
  FileText,
  Users,
  FolderOpen,
  Activity,
  ChevronDown,
  Layers,
  Image,
  Shield,
  Crown,
  BookOpen,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface AdminNavbarProps {
  user?: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string;
  } | null;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ user: propUser }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();

  const user = propUser || authUser;

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Posts', href: '/admin/posts', icon: FileText },
    { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
    { name: 'Media', href: '/admin/media', icon: Image },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: Activity },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return <Crown className="w-3 h-3 text-amber-400" />;
      case 'EDITOR':
        return <Shield className="w-3 h-3 text-blue-400" />;
      case 'AUTHOR':
        return <BookOpen className="w-3 h-3 text-purple-400" />;
      default:
        return <User className="w-3 h-3 theme-text-tertiary" />;
    }
  };

  return (
    <>
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Navbar */}
      <nav className="theme-bg-secondary/95 backdrop-blur-xl border-b theme-border-primary sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left side - Logo and Mobile menu */}
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2.5 rounded-xl theme-text-tertiary hover:theme-text-primary hover:theme-bg-tertiary transition-all"
              >
                <Menu size={20} />
              </button>

              {/* Logo */}
              <div className="flex items-center ml-4 lg:ml-0">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#fcd535] to-[#f0b90b] rounded-xl blur opacity-30"></div>
                  <div className="relative bg-[#fcd535] p-2 rounded-xl">
                    <Layers className="w-5 h-5 text-[#0b0e11]" />
                  </div>
                </div>
                <div className="ml-3">
                  <h1 className="text-lg font-bold theme-text-primary">Umunsi</h1>
                  <p className="text-xs theme-text-muted hidden sm:block">Admin Panel</p>
                </div>
              </div>
            </div>

            {/* Center - Search */}
            <div className="flex-1 max-w-lg mx-4 hidden md:block">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 theme-text-muted group-focus-within:text-[#fcd535] transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-11 pr-4 py-2.5 theme-bg-tertiary border theme-border-primary rounded-xl text-sm theme-text-primary placeholder:theme-text-muted focus:outline-none focus:border-[#fcd535]/50 focus:theme-bg-secondary transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2">
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 theme-text-tertiary hover:theme-text-primary hover:theme-bg-tertiary rounded-xl transition-all"
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                {isDark ? <Sun size={20} className="text-[#fcd535]" /> : <Moon size={20} />}
              </button>
              
              {/* Mobile search button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2.5 theme-text-tertiary hover:theme-text-primary hover:theme-bg-tertiary rounded-xl transition-all"
              >
                <Search size={20} />
              </button>

              {/* Notifications */}
              <button className="relative p-2.5 theme-text-tertiary hover:theme-text-primary hover:theme-bg-tertiary rounded-xl transition-all">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#fcd535] rounded-full"></span>
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 theme-text-tertiary hover:theme-bg-tertiary rounded-xl transition-all"
                >
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-[#fcd535] to-[#f0b90b] rounded-xl flex items-center justify-center">
                      <span className="text-sm font-bold text-[#0b0e11]">
                        {user?.firstName?.[0] || 'U'}
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[var(--bg-secondary)]"></div>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium theme-text-primary">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <div className="flex items-center space-x-1">
                      {getRoleIcon(user?.role || '')}
                      <p className="text-xs theme-text-muted">{user?.role}</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 theme-text-muted transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 theme-bg-secondary rounded-xl shadow-xl border theme-border-primary py-2 z-50">
                    <div className="px-4 py-3 border-b theme-border-primary">
                      <p className="text-sm font-medium theme-text-primary">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs theme-text-muted">{user?.email}</p>
                    </div>
                    
                    <Link
                      to="/"
                      className="flex items-center px-4 py-3 text-sm theme-text-tertiary hover:theme-bg-tertiary hover:theme-text-primary transition-all"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="p-1.5 theme-bg-tertiary rounded-lg mr-3">
                        <Home className="w-4 h-4" />
                      </div>
                      View Site
                    </Link>
                    
                    <Link
                      to="/admin/settings"
                      className="flex items-center px-4 py-3 text-sm theme-text-tertiary hover:theme-bg-tertiary hover:theme-text-primary transition-all"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="p-1.5 theme-bg-tertiary rounded-lg mr-3">
                        <Settings className="w-4 h-4" />
                      </div>
                      Settings
                    </Link>
                    
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <div className="p-1.5 bg-red-500/10 rounded-lg mr-3">
                        <LogOut className="w-4 h-4" />
                      </div>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile search bar */}
          {isSearchOpen && (
            <div className="md:hidden pb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 theme-text-muted" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-11 pr-4 py-3 theme-bg-tertiary border theme-border-primary rounded-xl text-sm theme-text-primary placeholder:theme-text-muted focus:outline-none focus:border-[#fcd535]/50 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile navigation menu */}
        <div className={`
          lg:hidden fixed inset-y-0 left-0 z-50 w-72 theme-bg-primary border-r theme-border-primary transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex items-center justify-between p-4 border-b theme-border-primary">
            <div className="flex items-center space-x-3">
              <div className="bg-[#fcd535] p-2 rounded-xl">
                <Layers className="w-5 h-5 text-[#0b0e11]" />
              </div>
              <div>
                <h1 className="text-lg font-bold theme-text-primary">Umunsi</h1>
                <p className="text-xs theme-text-muted">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 theme-text-tertiary hover:theme-text-primary hover:theme-bg-tertiary rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href || 
                (item.href !== '/admin' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-3 py-3 rounded-xl transition-all duration-200 relative
                    ${isActive
                      ? 'theme-bg-tertiary text-[#fcd535]'
                      : 'theme-text-tertiary hover:theme-bg-tertiary hover:theme-text-primary'
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#fcd535] rounded-r-full" />
                  )}
                  <div className={`p-2 rounded-lg mr-3 ${
                    isActive 
                      ? 'bg-[#fcd535]/10 text-[#fcd535]' 
                      : 'theme-bg-secondary theme-text-tertiary group-hover:theme-bg-tertiary group-hover:theme-text-primary'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile user section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t theme-border-primary theme-bg-primary">
            <div className="flex items-center space-x-3 p-3 theme-bg-tertiary rounded-xl border theme-border-primary">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#fcd535] to-[#f0b90b] rounded-xl flex items-center justify-center">
                  <span className="text-sm font-bold text-[#0b0e11]">
                    {user?.firstName?.[0] || 'U'}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[var(--bg-tertiary)]"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium theme-text-primary truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <div className="flex items-center space-x-1">
                  {getRoleIcon(user?.role || '')}
                  <p className="text-xs theme-text-muted">{user?.role}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-3 space-y-1">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center px-3 py-2.5 theme-text-tertiary hover:theme-bg-tertiary hover:theme-text-primary rounded-xl transition-all"
              >
                <div className="p-2 theme-bg-secondary rounded-lg mr-3">
                  {isDark ? <Sun className="w-4 h-4 text-[#fcd535]" /> : <Moon className="w-4 h-4" />}
                </div>
                <span className="text-sm font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <Link
                to="/"
                className="flex items-center px-3 py-2.5 theme-text-tertiary hover:theme-bg-tertiary hover:theme-text-primary rounded-xl transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="p-2 theme-bg-secondary rounded-lg mr-3">
                  <Home className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">View Site</span>
              </Link>
              
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
              >
                <div className="p-2 bg-red-500/10 rounded-lg mr-3">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Click outside to close dropdowns */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </>
  );
};

export default AdminNavbar;
