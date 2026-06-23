import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapPin, Star, ShieldCheck, Filter, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { useUser } from '../context/UserContext';

import { propertyService, Property } from '../services/propertyService';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dest = searchParams.get('dest') || '';
  const typeFilter = searchParams.get('type') || '';
  const { toggleFavorite, isFavorite } = useUser();
  const [allStays, setAllStays] = React.useState<Property[]>(() => propertyService.getLocalPropertiesSync());
  const [loading, setLoading] = React.useState(() => propertyService.getLocalPropertiesSync().length === 0);
  const [sortBy, setSortBy] = React.useState('default');
  const [activeChip, setActiveChip] = React.useState(typeFilter);

  React.useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await propertyService.getAllProperties();
        setAllStays(data);
      } catch (err) {
        console.error("Error loading stays", err);
      } finally {
        setLoading(false);
      }
    };
    loadProperties();
  }, []);

  const chips = ['All', 'Beach', 'Hills', 'Farm', 'Luxury', 'Budget', 'Family'];

  const filteredStays = allStays.filter(stay => {
    const matchesDest = !dest || stay.location.toLowerCase().includes(dest.toLowerCase()) || stay.title.toLowerCase().includes(dest.toLowerCase()) || (stay.type && stay.type.toLowerCase().includes(dest.toLowerCase()));
    const matchesChip = !activeChip || activeChip === 'All' || (stay.type && stay.type.toLowerCase().includes(activeChip.toLowerCase())) || (stay.title && stay.title.toLowerCase().includes(activeChip.toLowerCase()));
    return matchesDest && matchesChip;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <div className="pt-24 min-h-screen relative overflow-hidden pb-16 bg-[#f4f7f5]">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-6 p-6 bg-white rounded-2xl border border-emerald-950/10 mt-8 shadow-sm">
          <p className="text-emerald-950/50 text-xs font-bold uppercase tracking-widest mb-2">{filteredStays.length} resorts & stays found in Maharashtra</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-emerald-950 mb-4">
            {dest ? (
              <>Resorts & Stays in <span className="text-[#FF4E00]">{dest}</span></>
            ) : (
              <>Book Resorts & Stays in <span className="text-[#FF4E00]">Maharashtra</span></>
            )}
          </h1>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {chips.map(chip => (
              <button
                key={chip}
                onClick={() => setActiveChip(chip === 'All' ? '' : chip)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                  (chip === 'All' && !activeChip) || activeChip === chip
                    ? 'bg-[#FF4E00] text-white border-[#FF4E00] shadow-lg shadow-[#FF4E00]/20'
                    : 'bg-[#f4f7f5]/80 text-emerald-950/60 border-emerald-950/10 hover:bg-[#f4f7f5] hover:text-emerald-950'
                }`}
              >
                {chip}
              </button>
            ))}
            <div className="ml-auto">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-white border border-emerald-950/10 text-emerald-950/70 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full outline-none focus:border-[#FF4E00] cursor-pointer"
              >
                <option value="default" className="bg-white text-emerald-950">Sort: Default</option>
                <option value="rating" className="bg-white text-emerald-950">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-8 flex-col lg:flex-row">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white p-6 rounded-2xl border border-emerald-950/10 sticky top-28 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-emerald-950 font-bold text-lg">
                <Filter className="w-5 h-5 text-orange-600" /> Filters
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-emerald-950/90 mb-4 text-sm uppercase tracking-wider">Property Type</h3>
                <div className="space-y-3">
                  {['Resort', 'Villa', 'Homestay', 'Farmhouse', 'Guest House', 'Agro Tourism', 'Camping', 'Waterpark'].map((type) => (
                    <label key={type} className="flex items-center gap-3 text-emerald-950/70 cursor-pointer hover:text-emerald-950 transition-colors text-sm">
                      <input type="checkbox" className="rounded bg-white border-emerald-950/20 text-[#FF4E00] focus:ring-[#FF4E00] focus:ring-offset-0 w-4 h-4" />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <hr className="border-emerald-950/10 my-6" />

              <div>
                <h3 className="font-bold text-emerald-950/90 mb-4 text-sm uppercase tracking-wider">Features</h3>
                <div className="space-y-3">
                  {['Premium Stays', 'Beachfront', 'Pool', 'Pet Friendly'].map((type) => (
                    <label key={type} className="flex items-center gap-3 text-emerald-950/70 cursor-pointer hover:text-emerald-950 transition-colors text-sm">
                      <input type="checkbox" className="rounded bg-white border-emerald-950/20 text-[#FF4E00] focus:ring-[#FF4E00] focus:ring-offset-0 w-4 h-4" />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="w-full lg:w-3/4">
            {filteredStays.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStays.map((stay, idx) => (
                <motion.div
                  key={stay.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="group bg-white rounded-2xl overflow-hidden border border-emerald-950/10 hover:border-emerald-950/25 transition-all shadow-sm hover:shadow-md flex flex-col"
                >
                  <Link to={`/property/${stay.id}`} className="flex flex-col h-full">
                    <div className="relative h-48 flex-shrink-0">
                      <img
                        src={stay.images && stay.images[0] ? stay.images[0] : 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop'}
                        alt={stay.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent pointer-events-none" />
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-green-500/10 backdrop-blur-md border border-green-500/20 text-green-700 px-2 py-1 rounded-md text-[10px] font-bold shadow-md uppercase tracking-wider">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </div>
                      <div className="absolute top-3 right-3 z-10">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(stay);
                          }}
                          className="w-8 h-8 rounded-full bg-white/85 backdrop-blur-md border border-emerald-950/10 flex items-center justify-center transition-colors hover:bg-white text-emerald-950"
                        >
                          <Heart className={`w-4 h-4 ${stay.id && isFavorite(stay.id) ? 'text-red-500 fill-red-500' : 'text-emerald-950/70'}`} />
                        </button>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-2">
                        {stay.type}
                      </div>
                      <h3 className="font-bold text-lg text-emerald-950 mb-1 line-clamp-1 group-hover:text-[#FF4E00] transition-colors">
                        {stay.title}
                      </h3>
                      <div className="flex items-center text-emerald-950/50 text-xs mb-3">
                        <MapPin className="w-3 h-3 mr-1" />
                        {stay.location}
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-emerald-950/5 pt-4">
                        <span className="text-[10px] font-bold text-[#FF4E00] uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                          View Details
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-950/80">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          {stay.rating || '4.5'}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-6 bg-white rounded-[2.5rem] border border-emerald-950/10 shadow-sm text-center relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FF4E00]/5 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-green-500/5 blur-3xl rounded-full pointer-events-none" />
              
              <div className="w-20 h-20 bg-gradient-to-br from-[#FF4E00] to-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-[#FF4E00]/15 animate-pulse">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <div className="inline-flex items-center gap-2 py-1.5 px-5 bg-[#f4f7f5] border border-emerald-950/10 rounded-full mb-4">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF4E00]">Destination Coming Soon</span>
              </div>
              <h3 className="text-3xl font-bold text-emerald-950 mb-3">
                {dest ? `Stays in "${dest}" Coming Soon!` : "New Stays Coming Soon!"}
              </h3>
              <p className="text-emerald-950/70 text-base max-w-md mx-auto mb-8 leading-relaxed">
                We are actively curating and verifying premium resorts and homestays in {dest ? `"${dest}"` : "this location"}. We will be launching verified partner stays here shortly!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href={`https://wa.me/919987091858?text=Hi%20StaySearch%21%20I%20am%20looking%20for%20resorts%20in%20${encodeURIComponent(dest || 'Maharashtra')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-green-600 text-white font-bold px-8 py-4 rounded-full text-sm uppercase tracking-wider shadow-lg shadow-green-500/15 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Request on WhatsApp
                </a>
                <button
                  onClick={() => { setSearchParams({}); setActiveChip(''); }}
                  className="bg-[#f4f7f5] hover:bg-emerald-50 text-emerald-950 font-bold px-8 py-4 rounded-full text-sm uppercase tracking-wider border border-emerald-950/10 transition-all"
                >
                  Explore All Verified Stays
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}
