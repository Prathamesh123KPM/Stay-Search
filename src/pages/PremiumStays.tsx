import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Star, MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { propertyService, Property } from '../services/propertyService';

export default function PremiumStays() {
  const { toggleFavorite, isFavorite } = useUser();

  const [stays, setStays] = React.useState<Property[]>(() => {
    return propertyService.getLocalPropertiesSync().slice(0, 6);
  });
  const [loading, setLoading] = React.useState(() => {
    return propertyService.getLocalPropertiesSync().length === 0;
  });

  React.useEffect(() => {
    const fetchStays = async () => {
      try {
        const data = await propertyService.getAllProperties();
        // Show up to 6 premium ones
        setStays(data.slice(0, 6));
      } catch (error) {
        console.error("Failed to load premium stays", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStays();
  }, []);

  return (
    <div className="pt-24 min-h-screen relative overflow-hidden pb-16 bg-[#0c1a12]">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-500/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[20%] right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 mt-8 mb-20 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 py-1 px-4 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">Certified Saftey</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
              Official Premium Approved Stays
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Book with confidence. All properties listed here are verified and approved by our hospitality partners, ensuring top-notch quality, hygiene, and hospitality standards.
            </p>
            <Link to="/search" className="inline-flex py-4 px-8 bg-[#FF385C] hover:bg-[#E61E4D] border border-rose-200 text-white rounded-full font-bold uppercase tracking-widest text-xs transition-colors shadow-lg shadow-rose-500/20">
              Search All Premium Properties
            </Link>
          </div>
          <div className="lg:w-1/2 relative h-[400px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop" 
              alt="Verified Partner Hospitality Network" 
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a12]/90 via-[#0c1a12]/20 to-transparent z-10" />
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center gap-4 z-20">
              <div>
                <h3 className="text-white font-bold text-xl">Verified Partner</h3>
                <p className="text-white/60 text-xs uppercase tracking-widest font-bold mt-1">Hospitality Network</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-8">Featured Premium Stays</h2>

        {loading ? (
          <div className="flex justify-center py-20 text-white/50 font-bold uppercase tracking-widest text-sm">Loading properties...</div>
        ) : stays.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stays.map((stay, idx) => (
            <div
              key={stay.id}
              className="group bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:bg-white/10 transition-colors shadow-lg flex flex-col"
            >
              <Link to={`/property/${stay.id}`} className="flex flex-col h-full">
                <div className="relative h-56 flex-shrink-0">
                  <img
                    src={stay.images && stay.images[0] ? stay.images[0] : 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop'}
                    alt={stay.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a12]/80 to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4 flex items-center gap-1 bg-green-500/20 backdrop-blur-md border border-green-500/30 text-green-400 px-3 py-1.5 rounded-md text-[10px] font-bold shadow-md uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    Verified
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

                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-[10px] font-bold text-[#FF385C] uppercase tracking-widest mb-2">
                    {stay.type}
                  </div>
                  <h3 className="font-bold text-xl text-white mb-2 line-clamp-1 group-hover:text-rose-400 transition-colors">
                    {stay.title}
                  </h3>
                  <div className="flex items-center text-white/50 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    {stay.location}
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="flex items-center gap-1 text-sm font-bold text-white/80">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      {stay.rating || '4.5'} <span className="text-white/40 font-normal">({Math.floor(Math.random() * 100) + 20})</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#FF385C] uppercase tracking-widest bg-orange-400/10 px-3 py-1 rounded-full border border-orange-400/20">
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        ) : (
          <div className="text-center text-white/50">No properties available.</div>
        )}
      </div>
    </div>
  );
}
