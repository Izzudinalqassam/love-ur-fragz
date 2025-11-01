import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuthStore } from '../stores/authStore';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-yellow-600 font-serif">LuxScents</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-yellow-600 ${
                isActive('/') ? 'text-yellow-600' : 'text-gray-700'
              }`}
            >
              Home
            </Link>
            <Link
              to="/catalog"
              className={`text-sm font-medium transition-colors hover:text-yellow-600 ${
                isActive('/catalog') ? 'text-yellow-600' : 'text-gray-700'
              }`}
            >
              Catalog
            </Link>
            <Link
              to="/recommendations"
              className={`text-sm font-medium transition-colors hover:text-yellow-600 ${
                isActive('/recommendations') ? 'text-yellow-600' : 'text-gray-700'
              }`}
            >
              Recommendations
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/admin/dashboard">
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/admin/login">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-gray-50 ${
                  isActive('/') ? 'text-yellow-600 bg-yellow-50' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/catalog"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-gray-50 ${
                  isActive('/catalog') ? 'text-yellow-600 bg-yellow-50' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Catalog
              </Link>
              <Link
                to="/recommendations"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-gray-50 ${
                  isActive('/recommendations') ? 'text-yellow-600 bg-yellow-50' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Recommendations
              </Link>
              {user ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/admin/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
