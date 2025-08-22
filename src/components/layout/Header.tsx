import { Search, Menu, X, Calendar, Thermometer, Bell, User } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigationItems = [
    { name: 'Televiziyo', href: '/tv', color: 'text-blue-600' },
    { name: 'Amashusho', href: '/movies', color: 'text-purple-600' },
    { name: 'Umuziki', href: '/music', color: 'text-pink-600' },
    { name: 'Ibikorwa', href: '/entertainment', color: 'text-indigo-600' },
    { name: 'Abakinnyi', href: '/celebrity', color: 'text-yellow-600' },
    { name: 'Siporo', href: '/sports', color: 'text-orange-600' },
    { name: 'Politiki', href: '/politics', color: 'text-red-600' },
    { name: 'Ubuzima', href: '/health', color: 'text-emerald-600' }
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Calendar size={14} />
              <span className="font-medium">{new Date().toLocaleDateString('rw-RW')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Thermometer size={14} />
              <span>22°C Kigali</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/newsletter" className="hover:text-yellow-200 transition-colors flex items-center space-x-1">
              <Bell size={14} />
              <span>Inyandiko</span>
            </Link>
            <Link to="/subscribe" className="hover:text-yellow-200 transition-colors flex items-center space-x-1">
              <User size={14} />
              <span>Kwishura</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-3 rounded-xl shadow-lg">
              <div className="w-6 h-6 bg-white rounded opacity-90"></div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
                Umunsi
              </h1>
              <p className="text-sm text-gray-600 font-medium tracking-wide">Amakuru y'u Rwanda</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="px-4 py-2 text-gray-700 hover:text-green-600 font-semibold transition-all duration-200 rounded-lg hover:bg-green-50 relative group"
              >
                <span>{item.name}</span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
              </Link>
            ))}
          </nav>

          {/* Search & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-3 text-gray-600 hover:text-green-600 transition-colors hover:bg-green-50 rounded-lg"
              >
                <Search size={20} />
              </button>

              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white shadow-xl rounded-xl border border-gray-100 p-6 z-50">
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                    <Search size={18} className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Shakisha amakuru..."
                      className="flex-1 outline-none text-sm bg-transparent"
                    />
                    <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg text-sm hover:from-green-700 hover:to-green-800 transition-all">
                      Shakisha
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 text-gray-600 hover:text-green-600 transition-colors hover:bg-green-50 rounded-lg"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-white rounded-b-lg shadow-lg">
            <nav className="py-4 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors font-medium rounded-lg mx-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={`w-3 h-3 rounded-full ${item.color.replace('text-', 'bg-')} mr-3`}></span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
