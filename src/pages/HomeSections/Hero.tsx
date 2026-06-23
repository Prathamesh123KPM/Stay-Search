import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Home as HomeIcon, Compass, Calendar, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { propertyService, Property } from '../../services/propertyService';

const locations = [
  'Kelva Beach', 'Palghar', 'Dahanu', 'Jawhar', 'Bordi', 'Saphale', 'Wada', 
  'Lonavala', 'Mahabaleshwar', 'Alibaug', 'Matheran', 'Igatpuri', 'Karjat'
];

const quickFilters = [
  { name: 'Beachfront', icon: '🏖️', query: 'Beach' },
  { name: 'Hills & Valleys', icon: '⛰️', query: 'Hills' },
  { name: 'Farmhouses', icon: '🚜', query: 'Farm' },
  { name: 'Luxury Villas', icon: '💎', query: 'Luxury' },
  { name: 'Family Resorts', icon: '👥', query: 'Family' },
];

const popularDestinations = ['Kelva Beach', 'Lonavala', 'Alibaug', 'Igatpuri', 'Karjat'];

export default function Hero() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState('1');
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
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const queryStr = location.trim().toLowerCase();
    const allUniqueLocations = Array.from(new Set([
      ...locations,
      ...properties.map(p => p.location.split(',').map(s => s.trim())).flat()
    ])).filter(Boolean);

    if (queryStr.length > 0) {
      const matchedLocs = allUniqueLocations.filter(loc => 
        loc.toLowerCase().includes(queryStr)
      );
      const matchedProps = properties.filter(prop => 
        prop.title.toLowerCase().includes(queryStr) ||
        prop.location.toLowerCase().includes(queryStr) ||
        (prop.type && prop.type.toLowerCase().includes(queryStr))
      );
      setFilteredLocs(matchedLocs);
      setFilteredProps(matchedProps);
    } else {
      setFilteredLocs(popularDestinations);
      setFilteredProps(properties.slice(0, 4));
    }
  }, [location, properties]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const guestParam = guests ? `&guests=${guests}` : '';
    navigate(`/search?dest=${encodeURIComponent(location)}${guestParam}`);
    setShowSuggestions(false);
  };

  const handleQuickFilter = (query: string) => {
    navigate(`/search?type=${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative bg-[#fafafa] pt-32 pb-16 md:pt-36 md:pb-20 lg:pt-40 lg:pb-24 border-b border-gray-200 overflow-hidden flex flex-col justify-center items-center">
      
      {/* Background Cartography Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-gray-200/40 rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[950px] border border-gray-200/40 rounded-full pointer-events-none z-0 border-dashed" />
      
      {/* Soft aesthetic background details */}
      <div className="absolute top-8 left-12 w-64 h-64 bg-rose-500/5 blur-[90px] rounded-full pointer-events-none" />
      <div className="absolute bottom-4 right-12 w-72 h-72 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Floating abstract widgets with Framer Motion */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[25%] right-[10%] p-3.5 bg-white border border-gray-200 rounded-2xl pointer-events-none hidden lg:block shadow-md z-0"
      >
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Alibaug Villa</span>
        </div>
        <span className="text-xs text-gray-900 font-extrabold">₹11,500 <span className="text-[8px] font-normal text-gray-400">/ night</span></span>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[20%] left-[8%] p-3.5 bg-white border border-gray-200 rounded-2xl pointer-events-none hidden lg:block shadow-md z-0"
      >
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Lonavala Cabin</span>
        </div>
        <span className="text-xs text-gray-900 font-extrabold">₹6,200 <span className="text-[8px] font-normal text-gray-400">/ night</span></span>
      </motion.div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center flex flex-col items-center gap-5">
        
        {/* Subtitle Badge */}
        <div className="flex items-center gap-2 py-1 px-3.5 bg-gray-100 border border-gray-200 rounded-full w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF385C]" />
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">
            Compare & Book Premium Maharashtra Stays
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.1] max-w-2xl">
          Find & compare verified <br className="hidden sm:inline" />
          resorts, villas <span className="text-[#FF385C]">directly.</span>
        </h1>
        
        {/* Rounded Capsule Search Console */}
        <div className="w-full max-w-2xl mt-4 relative" ref={searchRef}>
          <form 
            onSubmit={handleSearch} 
            className="bg-white border border-gray-200 rounded-3xl md:rounded-full p-2 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 md:gap-1"
          >
            {/* Destination field */}
            <div className="flex-grow p-2.5 px-6 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100 hover:bg-gray-50/70 rounded-2xl md:rounded-full transition-colors text-left relative group cursor-pointer">
              <label className="text-[10px] font-bold text-gray-800 block mb-0.5">Where</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search destinations"
                  className="w-full bg-transparent outline-none text-xs text-gray-500 placeholder:text-gray-400 font-medium"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                />
                {location && (
                  <button 
                    onClick={() => setLocation('')} 
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="absolute top-full left-0 right-0 md:right-auto md:w-[450px] mt-3 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-250/10 overflow-hidden z-[100] text-left max-h-[250px] md:max-h-[350px] overflow-y-auto"
                  >
                    {filteredLocs.length === 0 && filteredProps.length === 0 ? (
                      <div className="py-8 px-4 text-center">
                        <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm font-bold text-gray-500">No destinations or resorts found</p>
                      </div>
                    ) : (
                      <div className="py-2 divide-y divide-gray-100">
                        {/* Locations */}
                        {filteredLocs.length > 0 && (
                          <div className="pb-2">
                            <p className="px-5 py-2 text-[9px] font-extrabold text-gray-400 uppercase tracking-widest bg-gray-50">
                              Destinations
                            </p>
                            {filteredLocs.map((locName) => (
                              <button
                                key={locName}
                                onClick={() => {
                                  setLocation(locName);
                                  navigate(`/search?dest=${encodeURIComponent(locName)}`);
                                  setShowSuggestions(false);
                                }}
                                className="w-full px-5 py-2.5 hover:bg-gray-50 flex items-center gap-3 transition-colors text-left font-bold text-sm text-gray-800"
                              >
                                <MapPin className="w-4 h-4 text-[#FF385C]" />
                                <span>{locName}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Resorts */}
                        {filteredProps.length > 0 && (
                          <div className="pt-2">
                            <p className="px-5 py-2 text-[9px] font-extrabold text-gray-400 uppercase tracking-widest bg-gray-50">
                              Resorts & Stays
                            </p>
                            {filteredProps.map((prop) => (
                              <button
                                key={prop.id}
                                onClick={() => {
                                  navigate(`/property/${prop.id}`);
                                  setShowSuggestions(false);
                                }}
                                className="w-full px-5 py-2.5 hover:bg-gray-50 flex items-center gap-3 transition-colors text-left font-bold text-sm text-gray-800"
                              >
                                <HomeIcon className="w-4 h-4 text-gray-400" />
                                <div className="flex-1 min-w-0">
                                  <span className="block truncate leading-tight font-extrabold">{prop.title}</span>
                                  <span className="text-[10px] text-gray-400 font-medium leading-none block mt-0.5">{prop.location}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Guests selection field */}
            <div 
              onClick={() => setShowSuggestions(false)}
              className="w-full md:w-1/4 p-2.5 px-6 flex flex-col justify-center hover:bg-gray-50/70 rounded-2xl md:rounded-full transition-colors text-left cursor-pointer"
            >
              <label className="text-[10px] font-bold text-gray-800 block mb-0.5">Who</label>
              <div className="flex items-center gap-1">
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-transparent outline-none text-xs text-gray-500 font-medium cursor-pointer border-none p-0 focus:ring-0"
                >
                  <option value="1">Add guests</option>
                  <option value="2">2 guests</option>
                  <option value="4">4 guests</option>
                  <option value="6">6 guests</option>
                  <option value="8">8+ guests</option>
                </select>
              </div>
            </div>

            {/* Search Trigger Button */}
            <button 
              type="submit" 
              className="bg-[#FF385C] hover:bg-[#d93b58] w-full md:w-11 h-11 rounded-2xl md:rounded-full text-white flex items-center justify-center gap-2 md:gap-0 transition-all shrink-0 cursor-pointer shadow-md shadow-rose-500/20 hover:scale-105 py-3 md:py-0"
            >
              <Search className="w-4 h-4" />
              <span className="md:hidden text-xs font-bold uppercase tracking-wider">Search Stays</span>
            </button>
          </form>
        </div>

        {/* Category Icons Slider */}
        <div className="w-full flex flex-col gap-3 items-center mt-4 z-10 border-t border-gray-200/60 pt-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-10">
            {quickFilters.map((filter) => (
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                key={filter.name}
                onClick={() => handleQuickFilter(filter.query)}
                className="flex flex-col items-center gap-1.5 pb-2 border-b-2 border-transparent hover:border-gray-300 hover:text-gray-900 text-gray-500 font-semibold transition-all cursor-pointer px-1"
              >
                <span className="text-2xl">{filter.icon}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider">{filter.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
