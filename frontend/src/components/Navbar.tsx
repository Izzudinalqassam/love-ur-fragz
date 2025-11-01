import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Menu, X, Sparkles, Heart, ShoppingBag, ChevronDown } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuthStore } from '../stores/authStore';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Sparkles },
    { path: '/catalog', label: 'Catalog', icon: ShoppingBag },
    { path: '/quiz', label: 'Quiz', icon: Heart },
    { path: '/recommendations', label: 'Recommendations', icon: Heart },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-purple-100'
        : 'bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Enhanced Logo */}
          <Link
            to="/"
            className="group flex items-center space-x-3 transition-all duration-300 hover:scale-105"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-serif">
              LuxScents
            </span>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const hovered = hoveredItem === item.label;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    active
                      ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-md'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-4 w-4 transition-all duration-300 ${
                      active || hovered ? 'scale-110' : 'scale-100'
                    }`} />
                    <span>{item.label}</span>
                  </div>

                  {/* Hover Effect */}
                  {!active && hovered && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Enhanced Desktop Actions - Admin Removed */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              className="relative group overflow-hidden rounded-full"
              onClick={() => window.location.href = '/#search'}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <Search className="h-4 w-4 relative z-10" />
            </Button>

            {/* Quiz Button - Enhanced */}
            <Link to="/quiz">
              <Button
                size="sm"
                className="relative group overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="flex items-center space-x-2 relative z-10">
                  <Sparkles className="h-4 w-4" />
                  <span>Find Your Scent</span>
                </div>
              </Button>
            </Link>
          </div>

          {/* Enhanced Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative group p-2 rounded-full"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300"></div>
              {isMenuOpen ? (
                <X className="h-5 w-5 text-gray-700 relative z-10" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700 relative z-10" />
              )}
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm">
            <div className="px-2 pt-4 pb-6 space-y-2">
              {/* Mobile Menu Items */}
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center space-x-3 px-4 py-3 rounded-2xl text-base font-medium transition-all duration-300 ${
                      active
                        ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-md'
                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {active && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </Link>
                );
              })}

              {/* Mobile Search */}
              <button
                onClick={() => {
                  window.location.href = '/#search';
                  setIsMenuOpen(false);
                }}
                className="group flex items-center space-x-3 px-4 py-3 rounded-2xl text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 w-full"
              >
                <Search className="h-5 w-5" />
                <span>Search Fragrances</span>
              </button>

              {/* Mobile Quiz Button */}
              <Link
                to="/quiz"
                className="group flex items-center space-x-3 px-4 py-4 rounded-2xl text-base font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => setIsMenuOpen(false)}
              >
                <Sparkles className="h-5 w-5" />
                <span>Find Your Scent</span>
                <ChevronDown className="h-4 w-4 ml-auto rotate-270" />
              </Link>

              {/* User Section - Simplified */}
              {user && (
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="group flex items-center space-x-3 px-4 py-3 rounded-2xl text-base font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 w-full"
                  >
                    <User className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;