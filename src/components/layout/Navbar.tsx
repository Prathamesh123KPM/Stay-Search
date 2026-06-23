import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img 
              src="/staysearch.jpeg" 
              alt="StaySearch Logo" 
              className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-sm" 
            />
            <span className="text-xl font-black tracking-tight text-gray-900">
              StaySearch<span className="text-[#FF385C]">.</span>
            </span>
          </Link>

          {/* Center Tabs */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link 
              to="/" 
              className={cn(
                "flex items-center gap-1.5 pb-1 border-b-2 transition-all relative",
                location.pathname === '/'
                  ? "border-[#222222] text-[#222222] font-extrabold"
                  : "border-transparent text-gray-500 hover:text-gray-900 font-semibold"
              )}
            >
              <span className="text-sm">🏠</span>
              <span className="text-xs">Homes</span>
            </Link>

            <Link 
              to="/destinations" 
              className={cn(
                "flex items-center gap-1.5 pb-1 border-b-2 transition-all relative",
                location.pathname === '/destinations'
                  ? "border-[#222222] text-[#222222] font-extrabold"
                  : "border-transparent text-gray-500 hover:text-gray-900 font-semibold"
              )}
            >
              <span className="text-sm">📍</span>
              <span className="text-xs">Destination</span>
            </Link>
            
            <Link 
              to="/compare" 
              className={cn(
                "flex items-center gap-1.5 pb-1 border-b-2 transition-all relative group",
                location.pathname === '/compare'
                  ? "border-[#222222] text-[#222222] font-extrabold"
                  : "border-transparent text-gray-500 hover:text-gray-900 font-semibold"
              )}
            >
              <span className="text-sm">📊</span>
              <span className="text-xs">Compare Resorts</span>
            </Link>
            
            <Link 
              to="/support" 
              className={cn(
                "flex items-center gap-1.5 pb-1 border-b-2 transition-all relative group",
                location.pathname === '/support'
                  ? "border-[#222222] text-[#222222] font-extrabold"
                  : "border-transparent text-gray-500 hover:text-gray-900 font-semibold"
              )}
            >
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF385C] text-white text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full scale-75 whitespace-nowrap">
                NEW
              </span>
              <span className="text-sm">🛎️</span>
              <span className="text-xs">Services</span>
            </Link>
          </div>

          {/* Right Action Menu */}
          <div className="hidden md:flex items-center gap-3">
            <Link 
              to="/admin" 
              className="text-xs font-bold text-gray-600 hover:text-[#FF385C] transition-colors px-3 py-1.5 rounded-full hover:bg-gray-50 cursor-pointer"
            >
              Become a host
            </Link>
            
            <Link 
              to="/support" 
              className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all"
              title="Help & Support"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9yM3 9h18M3 15h18" />
              </svg>
            </Link>

            {/* Profile Dropdown Trigger Capsule */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 border border-gray-200 hover:shadow-md transition-all py-1.5 px-3 rounded-full bg-white cursor-pointer select-none"
              >
                <Menu className="w-4 h-4 text-gray-600" />
                <div className="w-7 h-7 bg-gray-500 text-white rounded-full flex items-center justify-center font-bold text-xs overflow-hidden">
                  {user ? (
                    <span className="text-[10px] uppercase font-black">{user.email?.substring(0, 2)}</span>
                  ) : (
                    <User className="w-3.5 h-3.5 text-white" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-60 py-2 bg-white rounded-2xl border border-gray-200 shadow-2xl z-50 text-left"
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100 mb-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Logged in as</p>
                          <p className="text-xs font-black text-gray-800 truncate mt-0.5">{user.email}</p>
                        </div>
                        <Link 
                          to="/dashboard" 
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2.5 text-xs font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          User Dashboard
                        </Link>
                        <button 
                          onClick={() => { logout(); setDropdownOpen(false); }} 
                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50/50 transition-colors border-t border-gray-100 mt-1"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link 
                          to="/auth" 
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2.5 text-xs font-black text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          Log In
                        </Link>
                        <Link 
                          to="/auth" 
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-150 mt-3 overflow-hidden shadow-xl"
          >
            <div className="px-4 py-4 space-y-3 flex flex-col">
              {[
                { label: 'Homes', to: '/' },
                { label: 'Destination', to: '/destinations' },
                { label: 'Compare Resorts', to: '/compare' },
                { label: 'Services', to: '/support' },
                { label: 'Become a Host', to: '/admin' }
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="text-xs font-bold uppercase tracking-widest text-gray-700 py-2 border-b border-gray-100 hover:text-[#FF385C]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      onClick={() => setMobileMenuOpen(false)} 
                      className="flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-700 border border-gray-200"
                    >
                      <User className="w-4 h-4 text-gray-600" /> 
                      <span>Dashboard</span>
                    </Link>
                    <button 
                      onClick={() => { logout(); setMobileMenuOpen(false); }} 
                      className="w-full py-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl text-xs font-bold border border-red-100"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/auth" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="flex justify-center items-center py-3.5 bg-[#FF385C] text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-md"
                  >
                    Log In / Sign Up
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
