import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiCalendar, FiFileText, FiActivity, FiShoppingCart } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartCount } = useCart();
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="flex flex-col">
              <div className="text-lg md:text-2xl font-bold leading-tight transition-all duration-300" style={{fontFamily: 'Poppins, sans-serif'}}>
                <span className="gradient-text">B.M HEALTH CARE</span>
              </div>
              <div className="text-[9px] md:text-[10px] text-gray-600 font-medium leading-tight tracking-wide">
                DIAGNOSTIC | POLY CLINIC | AMBULANCE
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium text-sm">
              Home
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium text-sm">
              Services
            </Link>
            <Link href="/doctors" className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium text-sm">
              Doctors
            </Link>
            <Link href="/tests" className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium text-sm">
              Tests
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium text-sm">
              Contact
            </Link>

            {/* Cart Icon */}
            <Link href="/cart" className="relative text-gray-700 hover:text-primary-600 transition-colors duration-200">
              <FiShoppingCart size={22} />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-br from-primary-500 to-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  href={user?.role === 'admin' || user?.role === 'receptionist' ? '/admin/dashboard' : '/dashboard'}
                  className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium text-sm"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2 rounded-full font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm flex items-center space-x-2"
                >
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium text-sm">
                  Login
                </Link>
                <Link href="/register" className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2 rounded-full font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            <Link href="/cart" className="relative text-gray-700">
              <FiShoppingCart size={22} />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-br from-primary-500 to-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-600 focus:outline-none transition-colors"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/services"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/doctors"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Doctors
            </Link>
            <Link
              href="/tests"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Tests
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href={user?.role === 'admin' || user?.role === 'receptionist' ? '/admin/dashboard' : '/dashboard'}
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
