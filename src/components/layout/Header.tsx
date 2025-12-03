import { Search, Menu, X, Calendar, Thermometer, Bell, User, ChevronDown, TrendingUp, Loader2, MoreHorizontal, LogOut, Settings, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient, Category } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getCategories({ includeInactive: false });
      if (response && Array.isArray(response)) {
        const activeCategories = response.filter(cat => cat.isActive !== false);
        setCategories(activeCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const visibleCategories = categories.slice(0, 7);
  const moreCategories = categories.slice(7);

  return (
    <header className="theme-bg-primary sticky top-0 z-50 border-b theme-border-primary">
      {/* Top Bar */}
      <div className="theme-bg-secondary border-b theme-border-primary">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-4">
              {/* Date & Weather */}
              <div className="flex items-center space-x-3 theme-text-tertiary">
                <div className="flex items-center space-x-1.5">
                  <Calendar size={14} className="text-[#fcd535]" />
                  <span>{new Date().toLocaleDateString('rw-RW', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="h-3 w-px theme-bg-tertiary"></div>
                <div className="flex items-center space-x-1.5">
                  <Thermometer size={14} className="text-[#fcd535]" />
                  <span>22°C Kigali</span>
                </div>
              </div>

              {!loading && categories.length > 0 && (
                <div className="hidden md:flex items-center space-x-2">
                  <div className="h-3 w-px theme-bg-tertiary"></div>
                  <TrendingUp size={14} className="text-[#fcd535]" />
                  <span className="theme-text-tertiary">{categories.length} Categories</span>
                </div>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-1.5 p-1.5 rounded-lg theme-text-tertiary hover:theme-text-primary hover:theme-bg-tertiary transition-all"
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                {isDark ? (
                  <Sun size={16} className="text-[#fcd535]" />
                ) : (
                  <Moon size={16} className="text-slate-600" />
                )}
              </button>

              <div className="h-3 w-px theme-bg-tertiary"></div>

              <Link 
                to="/newsletter" 
                className="flex items-center space-x-1.5 theme-text-tertiary hover:text-[#fcd535] transition-colors group"
              >
                <Bell size={14} className="group-hover:animate-bounce" />
                <span className="hidden sm:inline">Inyandiko</span>
              </Link>
              <div className="h-3 w-px theme-bg-tertiary"></div>
              
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-1.5 theme-bg-tertiary border theme-border-primary rounded-lg hover:border-[#fcd535]/50 transition-all"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-[#fcd535] to-[#f0b90b] rounded-full flex items-center justify-center">
                      <span className="text-[#0b0e11] text-xs font-bold">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </span>
                    </div>
                    <span className="theme-text-secondary text-xs hidden sm:inline">{user.firstName}</span>
                    <ChevronDown size={12} className="theme-text-muted" />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 theme-bg-card border theme-border-primary rounded-xl shadow-xl overflow-hidden z-50">
                      <div className="p-3 border-b theme-border-primary">
                        <p className="theme-text-primary text-sm font-medium">{user.firstName} {user.lastName}</p>
                        <p className="theme-text-muted text-xs">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link 
                          to="/profile" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 theme-text-secondary hover:theme-bg-tertiary hover:text-[#fcd535] transition-colors"
                        >
                          <User size={14} />
                          <span>Profile</span>
                        </Link>
                        {(user.role === 'ADMIN' || user.role === 'EDITOR') && (
                          <Link 
                            to="/admin" 
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center space-x-2 px-3 py-2 theme-text-secondary hover:theme-bg-tertiary hover:text-[#fcd535] transition-colors"
                          >
                            <Settings size={14} />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                        <button 
                          onClick={() => { logout(); setIsUserMenuOpen(false); navigate('/'); }}
                          className="w-full flex items-center space-x-2 px-3 py-2 theme-text-secondary hover:theme-bg-tertiary hover:text-red-400 transition-colors"
                        >
                          <LogOut size={14} />
                          <span>Gusohoka</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-[#fcd535] to-[#f0b90b] text-[#0b0e11] font-semibold rounded-lg hover:from-[#f0b90b] hover:to-[#fcd535] transition-all transform hover:scale-105"
                >
                  <User size={14} />
                  <span>Kwinjira</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#fcd535]/20 to-[#f0b90b]/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img src="/images/logo.png" alt="Umunsi Logo" className="h-10 md:h-12 relative" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {loading ? (
              <div className="flex items-center space-x-2 px-4 py-2 theme-text-tertiary">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">Loading categories...</span>
              </div>
            ) : categories.length === 0 ? (
              <div className="px-4 py-2 theme-text-muted text-sm">No categories available</div>
            ) : (
              <>
                {visibleCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="group relative px-3 py-2 theme-text-secondary hover:theme-text-primary font-medium transition-all duration-200 rounded-lg hover:theme-bg-tertiary"
                  >
                    <span className="text-sm">{cat.name}</span>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#fcd535] to-[#f0b90b] group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                  </Link>
                ))}

                {moreCategories.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setIsMoreOpen(!isMoreOpen)}
                      className="group relative px-3 py-2 theme-text-secondary hover:theme-text-primary font-medium transition-all duration-200 rounded-lg hover:theme-bg-tertiary flex items-center space-x-1.5"
                    >
                      <MoreHorizontal size={16} className="opacity-70 group-hover:opacity-100" />
                      <span className="text-sm">More</span>
                      <span className="bg-[#fcd535] text-[#0b0e11] text-xs px-1.5 rounded-full font-bold">{moreCategories.length}</span>
                    </button>

                    {isMoreOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 theme-bg-card shadow-2xl rounded-xl border theme-border-primary py-2 z-50">
                        {moreCategories.map((cat) => (
                          <Link
                            key={cat.id}
                            to={`/category/${cat.slug}`}
                            onClick={() => setIsMoreOpen(false)}
                            className="block px-4 py-2.5 theme-text-secondary hover:theme-bg-tertiary hover:text-[#fcd535] transition-colors text-sm"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </nav>

          {/* Right Side - Search & Mobile Menu */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 theme-text-tertiary hover:text-[#fcd535] transition-colors hover:theme-bg-tertiary rounded-lg"
              >
                <Search size={20} />
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-2 w-screen max-w-xs md:max-w-md theme-bg-card shadow-2xl rounded-xl border theme-border-primary p-4 z-50">
                  <form onSubmit={handleSearch}>
                    <div className="flex items-center space-x-3 theme-bg-tertiary rounded-lg p-3 border theme-border-primary focus-within:border-[#fcd535]/50 transition-colors">
                      <Search size={18} className="theme-text-muted" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Shakisha amakuru..."
                        className="flex-1 outline-none text-sm bg-transparent theme-text-primary placeholder:theme-text-muted"
                        autoFocus
                      />
                      <button 
                        type="submit"
                        className="bg-gradient-to-r from-[#fcd535] to-[#f0b90b] text-[#0b0e11] px-4 py-2 rounded-lg text-sm font-semibold hover:from-[#f0b90b] hover:to-[#fcd535] transition-all transform hover:scale-105"
                      >
                        Shakisha
                      </button>
                    </div>
                  </form>
                  {categories.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs theme-text-muted uppercase tracking-wider">All Categories ({categories.length})</p>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            to={`/category/${cat.slug}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="px-2 py-1 theme-bg-tertiary theme-text-tertiary text-xs rounded-lg hover:theme-bg-secondary hover:text-[#fcd535] cursor-pointer transition-all"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 theme-text-tertiary hover:text-[#fcd535] transition-colors hover:theme-bg-tertiary rounded-lg"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <nav className="space-y-1 max-h-[60vh] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-4 theme-text-tertiary">
                  <Loader2 size={20} className="animate-spin mr-2" />
                  <span>Loading categories...</span>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-4 theme-text-muted">No categories available</div>
              ) : (
                <>
                  <div className="px-4 py-2 text-xs theme-text-muted uppercase tracking-wider">
                    All Categories ({categories.length})
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="flex items-center px-4 py-3 theme-text-secondary hover:theme-bg-tertiary hover:theme-text-primary transition-colors font-medium rounded-xl group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>{cat.name}</span>
                      <ChevronDown size={16} className="ml-auto theme-text-muted group-hover:text-[#fcd535] transform -rotate-90" />
                    </Link>
                  ))}
                </>
              )}
            </nav>
            
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mt-4 px-4">
              <div className="flex items-center space-x-3 theme-bg-tertiary rounded-xl p-3 border theme-border-primary">
                <Search size={18} className="theme-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Shakisha amakuru..."
                  className="flex-1 outline-none text-sm bg-transparent theme-text-primary placeholder:theme-text-muted"
                />
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-[#fcd535] to-[#f0b90b] text-[#0b0e11] px-3 py-1.5 rounded-lg text-sm font-semibold"
                >
                  Go
                </button>
              </div>
            </form>

            {/* Mobile Theme Toggle */}
            <div className="mt-4 px-4">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-4 py-3 theme-bg-tertiary rounded-xl border theme-border-primary"
              >
                <span className="theme-text-secondary font-medium">
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </span>
                <div className="flex items-center space-x-2">
                  {isDark ? (
                    <Sun size={18} className="text-[#fcd535]" />
                  ) : (
                    <Moon size={18} className="text-slate-600" />
                  )}
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(isMoreOpen || isSearchOpen || isUserMenuOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsMoreOpen(false);
            setIsSearchOpen(false);
            setIsUserMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
