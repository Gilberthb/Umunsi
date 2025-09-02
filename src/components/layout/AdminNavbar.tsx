import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminNavbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Articles', href: '/admin/articles', icon: FileText },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
    { name: 'Analytics', href: '/admin/analytics', icon: Activity },
  ];

  const notifications = [
    { id: 1, message: 'New article published', time: '2 min ago', type: 'success' },
    { id: 2, message: 'User registration', time: '5 min ago', type: 'info' },
    { id: 3, message: 'System update available', time: '1 hour ago', type: 'warning' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getCurrentPageName = () => {
    const currentPage = navigation.find(item => location.pathname === item.href);
    return currentPage?.name || 'Admin';
  };

  return (
    <>
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Navbar */}
      <nav className="bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-200/50 shadow-lg backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left side - Logo and Mobile menu */}
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors"
              >
                <Menu size={20} />
              </button>

              {/* Logo */}
              <div className="flex items-center ml-4 lg:ml-0">
                <div className="relative">
                  <img 
                    src="/images/logo.png" 
                    alt="Umunsi Logo" 
                    className="w-9 h-9 object-contain drop-shadow-sm"
                  />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                </div>
                <div className="ml-3">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Umunsi</h1>
                  <p className="text-xs text-gray-500 hidden sm:block font-medium">Admin Panel</p>
                </div>
              </div>

              {/* Page title - Desktop */}
              <div className="hidden lg:block ml-8">
                <h2 className="text-lg font-medium text-gray-900">{getCurrentPageName()}</h2>
              </div>
            </div>

            {/* Center - Search */}
            <div className="flex-1 max-w-lg mx-4 hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search articles, users, categories..."
                  className="block w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 shadow-sm transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-3">
              
              {/* Mobile search button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 hover:shadow-md"
              >
                <Search size={20} />
              </button>

              {/* Dark mode toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 hover:shadow-md"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button className="p-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 hover:shadow-md relative">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white shadow-sm"></span>
                </button>
              </div>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2.5 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 hover:shadow-md"
                >
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-sm">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-bold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">{user?.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* User dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100/50">
                      <p className="text-sm font-bold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">{user?.email}</p>
                    </div>
                    
                    <Link
                      to="/"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="p-1.5 bg-gray-100 rounded-lg mr-3">
                        <Home className="w-4 h-4" />
                      </div>
                      View Site
                    </Link>
                    
                    <Link
                      to="/admin/settings"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="p-1.5 bg-gray-100 rounded-lg mr-3">
                        <Settings className="w-4 h-4" />
                      </div>
                      Settings
                    </Link>
                    
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 transition-colors"
                    >
                      <div className="p-1.5 bg-red-100 rounded-lg mr-3">
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
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 shadow-sm transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile navigation menu */}
        <div className={`
          lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-white via-gray-50 to-gray-100 shadow-2xl transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="relative">
                <img 
                  src="/images/logo.png" 
                  alt="Umunsi Logo" 
                  className="w-9 h-9 object-contain drop-shadow-sm"
                />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
              </div>
              <span className="ml-3 text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Menu</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 hover:shadow-md"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="mt-6 px-6">
            <div className="space-y-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 relative
                      ${isActive
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                        : 'text-gray-700 hover:bg-white/60 hover:text-gray-900 hover:shadow-md'
                      }
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className={`p-1.5 rounded-lg mr-3 ${
                      isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-white'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'
                      }`} />
                    </div>
                    {item.name}
                    {isActive && (
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Mobile user section */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200/50 bg-white/60 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 font-medium">{user?.email}</p>
                <span className="inline-block px-3 py-1 text-xs font-bold bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full mt-2 shadow-sm">
                  {user?.role}
                </span>
              </div>
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
