import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiShoppingCart, FiChevronDown } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartCount } = useCart();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const isActive = (path) => router.pathname === path;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/book-doctor', label: 'Book Doctor' },
    { href: '/book-test', label: 'Book Test' },
    { href: '/my-bookings', label: 'My Bookings' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white shadow-medium' 
        : 'bg-white shadow-soft'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-soft group-hover:shadow-medium transition-all duration-200">
              <Image
                src="/images/logo.png"
                alt="BM Healthcare Logo"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 leading-tight">
                BM Healthcare
              </span>
              <span className="text-xs text-slate-500 leading-tight">
                Diagnostic & Poly Clinic
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(link.href)
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-slate-700 hover:text-primary-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link
                  href={user?.role === 'admin' ? '/admin/dashboard' : '/receptionist/dashboard'}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-primary-700 hover:bg-slate-50 rounded-lg transition-all duration-200"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <FiLogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/receptionist/login"
                className="inline-flex items-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:shadow-medium transition-all duration-200"
              >
                <FiUser className="w-4 h-4 mr-2" />
                Reception Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-3">
            <button
              onClick={toggleMenu}
              className="p-2 text-slate-700 hover:text-primary-700 hover:bg-slate-50 rounded-lg transition-all duration-200"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-soft animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(link.href)
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-slate-700 hover:text-primary-700 hover:bg-slate-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-slate-100 space-y-1">
              {isAuthenticated ? (
                <>
                  <Link
                    href={user?.role === 'admin' ? '/admin/dashboard' : '/receptionist/dashboard'}
                    className="block px-4 py-3 text-sm font-medium text-slate-700 hover:text-primary-700 hover:bg-slate-50 rounded-lg transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/receptionist/login"
                  className="block px-4 py-3 text-sm font-medium text-center text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:shadow-medium transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Reception Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
