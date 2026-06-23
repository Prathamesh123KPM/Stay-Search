import React from 'react';
import { ShieldCheck, Star, MapPin, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

import { propertyService, Property } from '../../services/propertyService';

export default function FeaturedStays() {
  const { toggleFavorite, isFavorite } = useUser();
  const [stays, setStays] = React.useState<Property[]>(() => {
    const data = propertyService.getLocalPropertiesSync();
    let featured = data.filter(p => p.isFeatured);
    if (featured.length < 4) {
      const nonFeatured = data.filter(p => !p.isFeatured);
      featured = [...featured, ...nonFeatured];
    }
    return featured.slice(0, 4);
  });
  const [loading, setLoading] = React.useState(() => {
    return propertyService.getLocalPropertiesSync().length === 0;
  });

  React.useEffect(() => {
    const fetchStays = async () => {
      try {
        const data = await propertyService.getAllProperties();
        // Show featured properties first, fallback to general if less than 4
        let featured = data.filter(p => p.isFeatured);
        if (featured.length < 4) {
          const nonFeatured = data.filter(p => !p.isFeatured);
          featured = [...featured, ...nonFeatured];
        }
        setStays(featured.slice(0, 4));
      } catch (error) {
        console.error("Failed to load featured stays", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStays();
  }, []);
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 py-1 px-4 bg-[#091a11]/5 border border-[#091a11]/10 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#091a11]/70">Top Rated</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#091a11] mb-6">Featured Stays</h2>
          <p className="text-[#091a11]/60 text-lg">
            Handpicked, top-rated properties ensuring complete comfort, spectacular views, and premium amenities.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-[#091a11]/50 font-bold uppercase tracking-widest text-sm">Loading properties...</div>
        ) : stays.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stays.map((stay, idx) => (
              <motion.div
              key={stay.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden border border-[#091a11]/10 hover:shadow-2xl transition-all shadow-md relative"
            >
              <Link to={`/property/${stay.id}`} className="flex flex-col h-full">
                <div className="relative h-60">
                  <img
                    src={stay.images && stay.images[0] ? stay.images[0] : 'https://images.unsplash.com/photo-1540541338272-34b95baf892a?q=80&w=1200&auto=format&fit=crop'}
                    alt={stay.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-1 bg-green-500/20 backdrop-blur-md border border-green-500/30 text-green-700 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold shadow-md">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Stay
                  </div>
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(stay);
                      }}
                      className="w-8 h-8 rounded-full bg-[#0c1a12]/50 backdrop-blur-md border border-white/20 flex items-center justify-center transition-colors hover:bg-[#0c1a12]/80 shadow-md"
                    >
                      <Heart className={`w-4 h-4 ${stay.id && isFavorite(stay.id) ? 'text-red-500 fill-red-500' : 'text-white/80'}`} />
                    </button>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-2">
                    {stay.type}
                  </div>
                  <h3 className="font-bold text-lg text-[#091a11] mb-2 truncate group-hover:text-orange-600 transition-colors">
                    {stay.title}
                  </h3>
                  <div className="flex items-center text-[#091a11]/60 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    {stay.location}
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-[#091a11]/10 pt-4">
                    <div className="flex items-center gap-1 text-sm font-semibold text-[#091a11]/80">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      {stay.rating || '4.5'} <span className="text-[#091a11]/40 font-normal">({Math.floor(Math.random() * 100) + 20})</span>
                    </div>
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest bg-orange-600/10 px-3 py-1 rounded-full border border-orange-600/20">
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          </div>
        ) : (
          <div className="text-center text-[#091a11]/50">No properties available.</div>
        )}

        <div className="mt-16 text-center">
          <Link to="/search" className="inline-flex items-center justify-center px-8 py-4 text-xs font-bold uppercase tracking-widest text-[#091a11] bg-white border border-[#091a11]/20 hover:bg-[#FF4E00] hover:border-[#FF4E00] hover:text-white rounded-full transition-all shadow-md hover:shadow-lg">
            Explore All Properties
          </Link>
        </div>
      </div>
    </section>
  );
}
