import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, GitCompare, Heart, User, X, Check, Eye, MapPin } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { motion, AnimatePresence } from 'motion/react';

export default function MobileBottomNav() {
  const location = useLocation();
  const { compareList, toggleCompare, clearCompare } = useUser();
  const [showDrawer, setShowDrawer] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] px-4 py-2 flex items-center justify-around">
        <Link 
          to="/" 
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
            isActive('/') ? 'text-[#FF385C]' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
        </Link>

        <Link 
          to="/search" 
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
            isActive('/search') ? 'text-[#FF385C]' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Search</span>
        </Link>

        <button 
          onClick={() => setShowDrawer(true)}
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors relative ${
            showDrawer || compareList.length > 0 ? 'text-[#FF385C]' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <GitCompare className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Compare</span>
          {compareList.length > 0 && (
            <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-[#FF385C] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border border-white">
              {compareList.length}
            </span>
          )}
        </button>

        <Link 
          to="/destinations" 
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
            isActive('/destinations') ? 'text-[#FF385C]' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Destination</span>
        </Link>

        <Link 
          to="/dashboard" 
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
            isActive('/auth') ? 'text-[#FF385C]' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-wider">Profile</span>
        </Link>
      </div>

      {/* Slide-up Global Comparison Modal/Sheet (Mobile) */}
      <AnimatePresence>
        {showDrawer && (
          <div className="fixed inset-0 z-50 md:hidden bg-black/50 backdrop-blur-sm flex items-end">
            {/* Backdrop click close */}
            <div className="absolute inset-0 z-0" onClick={() => setShowDrawer(false)} />
            
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative z-10 w-full bg-white rounded-t-[2rem] max-h-[85vh] flex flex-col border-t border-gray-200 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-lg">Compare Resorts</h3>
                  <p className="text-xs text-gray-500">Compare side-by-side details (Max 3)</p>
                </div>
                <div className="flex items-center gap-3">
                  {compareList.length > 0 && (
                    <button 
                      onClick={clearCompare} 
                      className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider"
                    >
                      Clear All
                    </button>
                  )}
                  <button 
                    onClick={() => setShowDrawer(false)}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content Panel */}
              <div className="flex-grow overflow-y-auto px-6 py-6 pb-20">
                {compareList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-4 text-[#FF385C]">
                      <GitCompare className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-base mb-1">Comparison is Empty</h4>
                    <p className="text-xs text-gray-500 max-w-[240px]">
                      Add stays from search cards or detail pages to compare them here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Horizontal scrollable stays row */}
                    <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-4">
                      {compareList.map((item) => (
                        <div key={item.id} className="text-center relative">
                          <button 
                            onClick={() => toggleCompare(item)} 
                            className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10 border border-white shadow"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-2 bg-gray-100 border border-gray-200">
                            <img 
                              src={item.images?.[0] || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=300&auto=format&fit=crop'} 
                              alt={item.title} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <h4 className="text-xs font-black text-gray-950 truncate px-1">{item.title}</h4>
                          <span className="text-[10px] font-bold text-[#FF385C] block mt-0.5">₹{item.price.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>

                    {/* Features Matrix List */}
                    <div className="space-y-4 text-xs">
                      {/* Price Row */}
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-extrabold text-gray-400 uppercase tracking-widest text-[9px] w-1/4">Price</span>
                        <div className="flex-grow grid grid-cols-3 gap-2 text-center text-gray-800 font-bold">
                          {compareList.map(item => (
                            <span key={item.id}>₹{item.price.toLocaleString('en-IN')}</span>
                          ))}
                        </div>
                      </div>

                      {/* Type Row */}
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-extrabold text-gray-400 uppercase tracking-widest text-[9px] w-1/4">Type</span>
                        <div className="flex-grow grid grid-cols-3 gap-2 text-center text-gray-800 font-bold">
                          {compareList.map(item => (
                            <span key={item.id}>{item.type || 'Resort'}</span>
                          ))}
                        </div>
                      </div>

                      {/* Capacity Row */}
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-extrabold text-gray-400 uppercase tracking-widest text-[9px] w-1/4">Guests</span>
                        <div className="flex-grow grid grid-cols-3 gap-2 text-center text-gray-800 font-bold">
                          {compareList.map(item => (
                            <span key={item.id}>{item.maxGuests || 4} Max</span>
                          ))}
                        </div>
                      </div>

                      {/* Rooms Row */}
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-extrabold text-gray-400 uppercase tracking-widest text-[9px] w-1/4">Rooms</span>
                        <div className="flex-grow grid grid-cols-3 gap-2 text-center text-gray-800 font-bold">
                          {compareList.map(item => (
                            <span key={item.id}>{item.bedrooms || 2} BR</span>
                          ))}
                        </div>
                      </div>

                      {/* Rating Row */}
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-extrabold text-gray-400 uppercase tracking-widest text-[9px] w-1/4">Rating</span>
                        <div className="flex-grow grid grid-cols-3 gap-2 text-center text-gray-800 font-bold flex items-center justify-center">
                          {compareList.map(item => (
                            <span key={item.id} className="inline-flex items-center gap-0.5 justify-center">
                              ★ {item.rating || '4.5'}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Pool Row */}
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-extrabold text-gray-400 uppercase tracking-widest text-[9px] w-1/4">Pool</span>
                        <div className="flex-grow grid grid-cols-3 gap-2 text-center">
                          {compareList.map(item => {
                            const hasPool = item.amenities.some(a => a.toLowerCase().includes('pool'));
                            return (
                              <span key={item.id} className="flex justify-center text-gray-800">
                                {hasPool ? <Check className="w-4 h-4 text-green-600 font-extrabold" /> : <X className="w-4 h-4 text-red-500" />}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Food Row */}
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-extrabold text-gray-400 uppercase tracking-widest text-[9px] w-1/4">Food</span>
                        <div className="flex-grow grid grid-cols-3 gap-2 text-center text-gray-800 font-bold">
                          {compareList.map(item => (
                            <span key={item.id} className="truncate block px-0.5">
                              {item.foodType || 'Veg/Non-Veg'}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Links */}
                      <div className="flex justify-between items-center pt-4">
                        <span className="w-1/4" />
                        <div className="flex-grow grid grid-cols-3 gap-2 text-center">
                          {compareList.map(item => (
                            <Link
                              key={item.id}
                              to={`/property/${item.id}`}
                              onClick={() => setShowDrawer(false)}
                              className="inline-flex items-center justify-center gap-1 bg-[#FF385C] hover:bg-[#E61E4D] text-white font-extrabold text-[9px] uppercase tracking-wider py-2 px-1 rounded-xl shadow transition-colors"
                            >
                              <Eye className="w-3 h-3" /> View
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
