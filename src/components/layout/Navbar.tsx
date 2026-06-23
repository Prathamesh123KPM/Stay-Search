import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, Search, MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-emerald-950/5 py-4'
          : 'bg-white/40 backdrop-blur-md border-b border-emerald-950/5 py-6'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/staysearch.jpeg" 
              alt="StaySearch Logo" 
              className="w-10 h-10 rounded-lg object-cover border border-emerald-950/10 shadow-sm" 
            />
            <span className="text-2xl font-bold tracking-tight text-emerald-950 drop-shadow-sm">
              StaySearch<span className="text-[#FF4E00]">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {['Properties', 'Destinations', 'Premium Stays', 'Itinerary', 'Blogs', 'Support'].map((item) => (
              <Link
                key={item}
                to={item === 'Support' ? '/support' : item === 'Properties' ? '/search' : `/${item.toLowerCase().replace(' ', '-')}`}
                className="text-sm font-semibold uppercase tracking-widest text-emerald-950/80 hover:text-[#FF4E00] transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/search" className="p-2 text-emerald-950/85 hover:text-[#FF4E00] transition-colors bg-emerald-950/5 rounded-full border border-emerald-950/10">
              <Search className="w-5 h-5" />
            </Link>
            
            {user ? (
              <div className="relative group">
                <Link to="/dashboard" className="flex items-center gap-2 p-2 bg-emerald-950/5 hover:bg-emerald-950/10 rounded-full border border-emerald-950/10 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white">
                    <User className="w-4 h-4" />
                  </div>
                </Link>
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white backdrop-blur-xl rounded-xl border border-emerald-950/10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="px-4 py-2 border-b border-emerald-950/5 mb-2">
                    <p className="text-xs font-bold text-emerald-950/50 uppercase tracking-widest truncate">{user.email}</p>
                  </div>
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-emerald-950/80 hover:text-emerald-950 hover:bg-[#f4f7f5] transition-colors">
                    Dashboard
                  </Link>
                  <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-[#f4f7f5] transition-colors">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/auth" className="text-sm font-bold uppercase tracking-widest text-[#FF4E00] hover:text-white transition-all px-6 py-2.5 rounded-full border border-[#FF4E00]/30 hover:border-[#FF4E00] hover:bg-[#FF4E00]">
                Log In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-emerald-950/80"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-emerald-950" />
            ) : (
              <Menu className="w-6 h-6 text-emerald-950" />
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
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-emerald-950/10 mt-4 overflow-hidden rounded-b-2xl shadow-xl"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col">
              {['Properties', 'Destinations', 'Premium Stays', 'Itinerary', 'Blogs', 'Support'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Support' ? '/support' : item === 'Properties' ? '/search' : `/${item.toLowerCase().replace(' ', '-')}`}
                  className="text-sm font-bold uppercase tracking-widest text-emerald-950/90 py-3 border-b border-emerald-950/10 hover:text-[#FF4E00]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-emerald-950 bg-emerald-950/5 rounded-xl font-bold uppercase tracking-wider text-xs border border-emerald-950/10">
                      <User className="w-4 h-4" /> Dashboard
                    </Link>
                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 text-red-500 bg-red-500/10 rounded-xl font-bold uppercase tracking-wider text-xs border border-red-500/20">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="flex justify-center items-center py-4 bg-[#FF4E00] text-white rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg hover:bg-[#FF4E00]/90 transition-colors">
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
