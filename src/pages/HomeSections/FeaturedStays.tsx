import React, { useState } from 'react';
import { ShieldCheck, Star, MapPin, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { propertyService, Property } from '../../services/propertyService';

export interface HomeStayCardProps {
  stay: Property;
  idx: number;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (stay: any) => void;
}

export const HomeStayCard: React.FC<HomeStayCardProps> = ({ stay, idx, isFavorite, toggleFavorite }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const imagesList = stay.images && stay.images.length > 0
    ? stay.images
    : ['https://images.unsplash.com/photo-1540541338272-34b95baf892a?q=80&w=1200&auto=format&fit=crop'];

  const handleNextImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % imagesList.length);
  };

  const handlePrevImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  const isGuestFavourite = (stay.rating || 4.5) >= 4.7;

  const [loadAll, setLoadAll] = useState(false);

  return (
    <div
      className="group flex flex-col relative"
      onMouseEnter={() => setLoadAll(true)}
      onTouchStart={() => setLoadAll(true)}
    >
      <Link to={`/property/${stay.id}`} className="flex flex-col h-full">
        {/* Visual Card Image Slideshow */}
        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-100 shadow-xs group-hover:shadow-md transition-shadow">
          {imagesList.map((imgUrl, i) => {
            if (i > 0 && !loadAll) return null;
            return (
              <img
                key={i}
                src={imgUrl}
                alt={`${stay.title} - ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
                  activeImageIndex === i ? 'opacity-100' : 'opacity-0 pointer-events-none'
                } transition-transform duration-500 group-hover:scale-[1.02]`}
                loading={i === 0 ? "eager" : "lazy"}
              />
            );
          })}
          
          {/* Navigation Arrows */}
          {imagesList.length > 1 && (
            <>
              <button
                onClick={handlePrevImg}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/95 shadow-sm hover:bg-white flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer border border-gray-100"
              >
                <span className="text-xs font-bold font-sans">←</span>
              </button>
              <button
                onClick={handleNextImg}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/95 shadow-sm hover:bg-white flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer border border-gray-100"
              >
                <span className="text-xs font-bold font-sans">→</span>
              </button>
            </>
          )}

          {/* Carousel Indicators Dots */}
          {imagesList.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10 bg-black/10 px-2 py-0.5 rounded-full">
              {imagesList.map((_, i) => (
                <span 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    activeImageIndex === i ? 'bg-white scale-110' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Guest Favourite Badge */}
          {isGuestFavourite && (
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-gray-900 border border-gray-100 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
              Guest favourite
            </div>
          )}

          {/* Heart/Favorite Button */}
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite({
                  id: stay.id || '',
                  name: stay.title,
                  location: stay.location,
                  price: stay.price,
                  image: imagesList[0],
                  type: stay.type || 'Resort',
                  rating: stay.rating || 4.5
                });
              }}
              className="w-8 h-8 rounded-full bg-black/25 backdrop-blur-xs border border-white/20 flex items-center justify-center transition-colors hover:bg-black/40 shadow-sm"
            >
              <Heart className={`w-4 h-4 transition-colors ${isFavorite(stay.id || '') ? 'text-[#FF385C] fill-[#FF385C]' : 'text-white/90'}`} />
            </button>
          </div>
        </div>

        {/* Text Details below the image */}
        <div className="mt-3 flex flex-col text-left">
          {/* Row 1: Title & Rating */}
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-extrabold text-sm text-gray-900 leading-snug truncate">
              {stay.title}
            </h3>
            <div className="flex items-center gap-0.5 text-xs font-bold text-gray-800 shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{(stay.rating || 4.5).toFixed(2).replace('.00', '')}</span>
            </div>
          </div>

          {/* Row 2: Location/Distance */}
          <div className="text-gray-500 text-xs font-medium mt-0.5 truncate">
            {stay.location}
          </div>

          {/* Row 3: Price */}
          <div className="mt-1.5 flex items-baseline text-xs text-gray-900">
            <span className="font-extrabold text-sm">₹{stay.price.toLocaleString('en-IN')}</span>
            <span className="text-gray-500 ml-1">/ night</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function FeaturedStays() {
  const { toggleFavorite, isFavorite } = useUser();
  const [stays, setStays] = React.useState<Property[]>(() => {
    const data = propertyService.getLocalPropertiesSync();
    const coconutValley = data.find(p => p.title.toLowerCase().includes('coconut valley'));
    const rajResort = data.find(p => p.title.toLowerCase().includes('raj resort'));
    const betelLeaf = data.find(p => p.title.toLowerCase().includes('betel leaf'));
    
    const remaining = data.filter(p => 
      !p.title.toLowerCase().includes('coconut valley') && 
      !p.title.toLowerCase().includes('raj resort') &&
      !p.title.toLowerCase().includes('betel leaf')
    );
    
    let featured = remaining.filter(p => p.isFeatured);
    if (featured.length < 5) {
      const nonFeatured = remaining.filter(p => !p.isFeatured);
      featured = [...featured, ...nonFeatured];
    }
    
    const finalStays: Property[] = [];
    if (coconutValley) finalStays.push(coconutValley);
    if (rajResort) finalStays.push(rajResort);
    if (betelLeaf) finalStays.push(betelLeaf);
    finalStays.push(...featured.slice(0, 8 - finalStays.length));
    
    return finalStays;
  });
  const [loading, setLoading] = React.useState(() => {
    return propertyService.getLocalPropertiesSync().length === 0;
  });

  React.useEffect(() => {
    const fetchStays = async () => {
      try {
        const data = await propertyService.getAllProperties();
        const coconutValley = data.find(p => p.title.toLowerCase().includes('coconut valley'));
        const rajResort = data.find(p => p.title.toLowerCase().includes('raj resort'));
        const betelLeaf = data.find(p => p.title.toLowerCase().includes('betel leaf'));
        
        const remaining = data.filter(p => 
          !p.title.toLowerCase().includes('coconut valley') && 
          !p.title.toLowerCase().includes('raj resort') &&
          !p.title.toLowerCase().includes('betel leaf')
        );
        
        let featured = remaining.filter(p => p.isFeatured);
        if (featured.length < 5) {
          const nonFeatured = remaining.filter(p => !p.isFeatured);
          featured = [...featured, ...nonFeatured];
        }
        
        const finalStays: Property[] = [];
        if (coconutValley) finalStays.push(coconutValley);
        if (rajResort) finalStays.push(rajResort);
        if (betelLeaf) finalStays.push(betelLeaf);
        finalStays.push(...featured.slice(0, 8 - finalStays.length));
        
        setStays(finalStays);
      } catch (error) {
        console.error("Failed to load featured stays", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStays();
  }, []);

  return (
    <section className="py-16 relative z-10 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-gray-900">Featured Resorts & Premium Stays in Maharashtra</h2>
            <p className="text-gray-500 text-xs mt-1">Handpicked hotels, villas, and resorts near Mumbai & Pune with high ratings.</p>
          </div>
          <Link to="/search" className="text-xs font-bold text-[#FF385C] hover:underline flex items-center gap-1">
            Explore all stays &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-gray-400 font-bold uppercase tracking-widest text-xs">Loading stays...</div>
        ) : stays.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stays.map((stay, idx) => (
                <HomeStayCard
                  key={stay.id}
                  stay={stay}
                  idx={idx}
                  isFavorite={isFavorite}
                  toggleFavorite={toggleFavorite}
                />
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Link 
                to="/search" 
                className="bg-[#FF385C] hover:bg-[#E61E4D] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-lg hover:shadow-xl hover:scale-102 duration-300"
              >
                See All Listed Properties
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400 py-12">No properties available.</div>
        )}
      </div>
    </section>
  );
}
