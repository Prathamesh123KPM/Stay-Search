import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Calendar, Users, Home as HomeIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { propertyService, Property } from '../../services/propertyService';

const backgroundImages = [
  "https://images.unsplash.com/photo-1540541338272-34b95baf892a?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1448375003491-6b2b77a56133?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop"
];

const locations = [
  'Kelva Beach', 'Palghar', 'Dahanu', 'Jawhar', 'Bordi', 'Saphale', 'Wada', 
  'Lonavala', 'Mahabaleshwar', 'Alibaug', 'Matheran', 'Igatpuri', 'Karjat'
];

export default function Hero() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [properties, setProperties] = useState<Property[]>(() => propertyService.getLocalPropertiesSync());
  const [filteredLocs, setFilteredLocs] = useState<string[]>([]);
  const [filteredProps, setFilteredProps] = useState<Property[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await propertyService.getAllProperties();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties in Hero:", error);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    // Preload slideshow images to eliminate transition latency
    backgroundImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const queryStr = location.trim().toLowerCase();

    // Collect all locations from both properties and hardcoded locations
    const allUniqueLocations = Array.from(new Set([
      ...locations,
      ...properties.map(p => {
        return p.location.split(',').map(s => s.trim());
      }).flat()
    ])).filter(Boolean);

    if (queryStr.length > 0) {
      // Find locations that match the query
      const matchedLocs = allUniqueLocations.filter(loc => 
        loc.toLowerCase().includes(queryStr)
      );

      // Find properties/resorts that match by title or location or type
      const matchedProps = properties.filter(prop => 
        prop.title.toLowerCase().includes(queryStr) ||
        prop.location.toLowerCase().includes(queryStr) ||
        (prop.type && prop.type.toLowerCase().includes(queryStr))
      );

      setFilteredLocs(matchedLocs);
      setFilteredProps(matchedProps);
    } else {
      // Popular locations
      setFilteredLocs(['Kelva Beach', 'Lonavala', 'Alibaug', 'Igatpuri', 'Karjat']);
      // Featured resorts
      setFilteredProps(properties.slice(0, 4));
    }
  }, [location, properties]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    navigate(`/search?dest=${location}`);
    setShowSuggestions(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0c1a12] pt-28 pb-16 md:pt-32 md:pb-24 lg:pt-36 lg:pb-28">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c1a12]/90 via-[#0c1a12]/40 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a12] via-transparent to-transparent z-10"></div>
        <AnimatePresence>
          <motion.img
            key={currentImageIndex}
            src={backgroundImages[currentImageIndex]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
            alt="Slideshow Background"
          />
        </AnimatePresence>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-8 lg:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          <div className="lg:col-span-8 flex flex-col justify-center gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 py-1.5 px-4 bg-white/10 backdrop-blur-xl rounded-full w-fit border border-white/20"
            >
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_10px_#22c55e]">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/90">
                #1 Resort Showcase & Directory in Maharashtra
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-lg"
            >
              Explore Resorts, Rooms <br />
              & Stays in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
                Maharashtra.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-white/70 max-w-lg leading-relaxed drop-shadow-md"
            >
              Experience ultimate comfort and luxury. Search, compare, and inquire directly for verified resorts, homestays, and premium rooms across Maharashtra's top travel destinations.
            </motion.p>

            {/* Separate Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mt-8 relative max-w-xl w-full"
            >
              <form onSubmit={handleSearch} ref={searchRef}>
                <div 
                  className="flex items-center gap-3 bg-emerald-950/20 backdrop-blur-md border border-white/10 hover:border-white/20 focus-within:bg-[#0c1a12]/50 focus-within:border-[#FF4E00] focus-within:shadow-[0_0_25px_rgba(255,78,0,0.3)] rounded-full px-5 py-3.5 transition-all shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
                >
                  <Search className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by resort name or destination..."
                    className="w-full bg-transparent outline-none text-white font-medium text-base placeholder:text-gray-300/70"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                  />
                  {location && (
                    <button 
                      onClick={() => setLocation('')} 
                      className="text-gray-400 hover:text-white transition-colors"
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] min-w-[300px] max-h-[380px] overflow-y-auto"
                  >
                    {filteredLocs.length === 0 && filteredProps.length === 0 ? (
                      <div className="py-8 px-4 text-center">
                        <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-gray-600">No properties or locations found</p>
                        <p className="text-xs text-gray-400 mt-1">Try another search term</p>
                      </div>
                    ) : (
                      <div className="py-2 divide-y divide-gray-100/50">
                        {/* Locations Section */}
                        {filteredLocs.length > 0 && (
                          <div className="pb-2">
                            <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
                              {location.trim() === '' ? 'Popular Destinations' : 'Suggested Destinations'}
                            </p>
                            {filteredLocs.map((suggestedLoc) => (
                              <a
                                key={suggestedLoc}
                                href={`/search?dest=${suggestedLoc}`}
                                className="px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 transition-colors cursor-pointer group block"
                              >
                                <MapPin className="w-4 h-4 text-gray-400 group-hover:text-[#FF4E00]" />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{suggestedLoc}</span>
                              </a>
                            ))}
                          </div>
                        )}

                        {/* Resorts Section */}
                        {filteredProps.length > 0 && (
                          <div className="pt-2">
                            <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
                              {location.trim() === '' ? 'Featured Resorts' : 'Suggested Resorts'}
                            </p>
                            {filteredProps.map((prop) => (
                              <a
                                key={prop.id}
                                href={`/property/${prop.id}`}
                                className="px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 transition-colors cursor-pointer group block"
                              >
                                {prop.images && prop.images[0] ? (
                                  <img 
                                    src={prop.images[0]} 
                                    alt={prop.title}
                                    className="w-10 h-10 rounded-lg object-cover border border-gray-100 group-hover:border-[#FF4E00]/50 transition-colors"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                                    <HomeIcon className="w-4 h-4 text-gray-400" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <span className="text-xs text-orange-500 font-bold uppercase tracking-wider block text-[9px] mb-0.5">
                                    {prop.type || 'Stay'} • {prop.location.split(',')[0]}
                                  </span>
                                  <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-950 block truncate">
                                    {prop.title}
                                  </span>
                                </div>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Floating Filters Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="mt-6 w-full max-w-4xl"
            >
              <form 
                onSubmit={handleSearch}
                className="p-2.5 bg-white/95 backdrop-blur-2xl rounded-3xl border border-emerald-950/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full"
              >
                <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-3 hover:bg-gray-100 rounded-2xl cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                    <p className="text-[9px] uppercase tracking-tighter text-gray-500 mb-1">Stay Type</p>
                    <input
                      type="text"
                      placeholder="Any type"
                      className="w-full bg-transparent outline-none text-gray-900 font-semibold text-sm placeholder:text-gray-400"
                    />
                  </div>
                  <div className="p-3 hover:bg-gray-100 rounded-2xl cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                    <p className="text-[9px] uppercase tracking-tighter text-gray-500 mb-1">Dates</p>
                    <input
                      type="text"
                      placeholder="Add dates"
                      className="w-full bg-transparent outline-none text-gray-900 font-semibold text-sm placeholder:text-gray-400"
                    />
                  </div>
                  <div className="p-3 hover:bg-gray-100 rounded-2xl cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                    <p className="text-[9px] uppercase tracking-tighter text-gray-500 mb-1">Guests</p>
                    <input
                      type="text"
                      placeholder="Add guests"
                      className="w-full bg-transparent outline-none text-gray-900 font-semibold text-sm placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="h-[60px] md:h-[64px] px-8 bg-[#FF4E00] hover:bg-orange-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center shadow-lg shadow-orange-500/20 cursor-pointer shrink-0"
                >
                  Search Resorts
                </button>
              </form>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:flex col-span-4 flex-col justify-center gap-4"
          >
            <div className="flex justify-between items-end mb-2">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/60">Featured Resorts</h3>
              <span onClick={() => navigate('/search')} className="text-xs text-orange-400 font-bold border-b border-orange-400 pb-1 cursor-pointer hover:text-orange-300">Explore All</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'A Coconut Valley Resort', loc: 'Kelva Beach', type: 'Beach Resort', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop' },
                { name: 'Tandel Resort', loc: 'Kelva Beach', type: 'Premium Resort', img: 'https://r1imghtlak.mmtcdn.com/f23b0de45a9f11e9b13f0242ac110004.jpeg' },
                { name: 'Raj Resort', loc: 'Mangelwada', type: 'Luxury Resort', img: 'https://images.trvl-media.com/lodging/103000000/102800000/102798000/102797986/5a0bd2c7.jpg' },
                { name: 'Kelva Beach Resort', loc: 'Palghar', type: 'Beachside Stay', img: 'https://r1imghtlak.mmtcdn.com/9f1c44b0-7561-44a4-bc0b-2cdad4437cc9.jpg' }
              ].map((resort, i) => (
                <div 
                  key={i} 
                  onClick={() => navigate(`/search?dest=${resort.loc}`)}
                  className="group relative h-[160px] rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-white/10 hover:border-orange-500/50 transition-all"
                >
                  <img src={resort.img} alt={resort.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a12]/95 via-[#0c1a12]/30 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[9px] text-orange-400 font-bold uppercase tracking-wider block mb-0.5">{resort.loc} • {resort.type}</span>
                    <p className="text-xs font-bold leading-tight line-clamp-1 group-hover:text-orange-200 transition-colors">{resort.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
