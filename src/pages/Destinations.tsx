import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Search, Compass, X } from 'lucide-react';
import SEO from '../components/SEO';

const destinations = [
  {
    name: 'Palghar',
    image: 'https://site.outlookindia.com/traveller/wp-content/uploads/files/2015/05/200715163414-Palghar1.jpg',
    stays: 42,
    desc: 'Pristine beaches, historic forts, and beautiful nature escapes near Mumbai.',
    tags: ['Beaches', 'Forts', 'Nature', 'Chikoo Farms'],
    region: 'North Konkan'
  },
  {
    name: 'Lonavala',
    image: 'https://www.noblehousetours.com/wp-content/uploads/2025/08/Things-to-Do-in-Lonavala-The-Ultimate-Guide-for-First-Time-Visitors.jpg',
    stays: 68,
    desc: 'Famous hill station retreat with lush valleys, waterfalls, and scenic viewpoints.',
    tags: ['Hill Station', 'Waterfalls', 'Valleys', 'Trekking'],
    region: 'Pune District'
  },
  {
    name: 'Alibaug',
    image: 'https://www.stayvista.com/blog/wp-content/uploads/2024/06/Anjarle_beach-1.jpg',
    stays: 55,
    desc: 'Coastal paradise known for its clean beaches, water sports, and luxury villas.',
    tags: ['Coastal', 'Water Sports', 'Villas', 'Seafood'],
    region: 'Raigad'
  },
  {
    name: 'Mahabaleshwar',
    image: 'https://s7ap1.scene7.com/is/image/incredibleindia/1-pratapgarh-fort-mahabaleshwar-maharashtra-2-city-hero?qlt=82&ts=1726668937680',
    stays: 38,
    desc: 'Strawberry capital of Maharashtra featuring breathtaking mountain viewpoints.',
    tags: ['Mountains', 'Strawberries', 'Viewpoints', 'Forts'],
    region: 'Satara District'
  },
  {
    name: 'Igatpuri',
    image: '/igatpuri.png',
    stays: 22,
    desc: 'Misty green mountain getaway surrounded by serene lakes and waterfalls.',
    tags: ['Monsoon', 'Lakes', 'Waterfalls', 'Vipassana'],
    region: 'Nashik District'
  },
  {
    name: 'Dahanu',
    image: 'https://exploredahanu.com/assets/image1/3.jpg',
    stays: 30,
    desc: 'Serene chikoo orchards, beautiful homestays, and quiet uncrowded beaches.',
    tags: ['Quiet Beaches', 'Orchards', 'Homestays', 'Warli Art'],
    region: 'Palghar District'
  }
];

export default function Destinations() {
  const [searchQuery, setSearchQuery] = useState('');

  const destinationsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Trending Destinations in Maharashtra",
    "description": "Top travel destinations and weekend getaways in Maharashtra featured on StaySearch.",
    "itemListElement": destinations.map((dest, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": dest.name,
      "description": dest.desc
    }))
  };

  const filteredDestinations = destinations.filter(dest => 
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="pt-28 min-h-screen relative overflow-hidden pb-24 bg-[#fafafa] font-sans">
      <SEO
        title="Top Travel Destinations & Weekend Getaways in Maharashtra | StaySearch"
        description="Explore trending weekend getaways in Maharashtra. Find stays in Palghar, Lonavala, Alibaug, Mahabaleshwar, Igatpuri, Dahanu and book premium resorts."
        keywords="top holiday destinations Maharashtra, places to visit near Mumbai, weekend getaways Pune, Alibaug resorts, Lonavala travel, Palghar beach stays, Mahabaleshwar strawberries, Igatpuri hill station"
        schema={destinationsSchema}
      />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/5 blur-[150px] rounded-full pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 bg-rose-50 border border-rose-100 rounded-full mb-5">
            <Compass className="w-4 h-4 text-[#FF385C]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF385C]">Maharashtra Escapes</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#222222] mb-4">Trending Destinations</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
            From pristine Konkan beaches to misty Sahyadri valleys, find your next perfect weekend retreat.
          </p>
        </div>

        {/* Search Bar HUD */}
        <div className="max-w-md mx-auto mb-16 relative">
          <div className="relative flex items-center bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow py-2.5 px-5">
            <Search className="w-4 h-4 text-gray-400 shrink-0 mr-3" />
            <input 
              type="text"
              placeholder="Search destination, region or activity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-medium text-gray-800 placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1 hover:bg-gray-150 rounded-full text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Destinations Grid */}
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((dest, idx) => (
              <div
                key={dest.name}
              >
                <Link 
                  to={`/search?dest=${dest.name}`} 
                  className="group relative h-[380px] rounded-3xl overflow-hidden block shadow-sm border border-gray-200 bg-white"
                >
                  <img
                    src={dest.image}
                    alt={`${dest.name} resorts`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
                  
                  {/* Stays Count Overlay Top-Left */}
                  <div className="absolute top-4 left-4">
                    <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white bg-[#FF385C] px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
                      <MapPin className="w-3 h-3" /> {dest.stays} Stays
                    </span>
                  </div>

                  {/* Text Content Overlay Bottom */}
                  <div className="absolute bottom-6 left-6 right-6 text-left">
                    <p className="text-[10px] text-rose-300 font-extrabold uppercase tracking-widest mb-1.5">
                      {dest.region}
                    </p>
                    <h3 className="text-2xl font-black text-white mb-2">
                      {dest.name}
                    </h3>
                    <p className="text-white/70 text-xs font-light mb-4 line-clamp-2 leading-relaxed">
                      {dest.desc}
                    </p>

                    {/* Tags List */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {dest.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 bg-white/10 backdrop-blur-xs border border-white/10 rounded-full text-[9px] font-bold text-white/95">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-end pt-1">
                      <span className="bg-white/15 backdrop-blur-xs p-2 rounded-full border border-white/10 text-white group-hover:bg-[#FF385C] group-hover:border-[#FF385C] group-hover:scale-115 transition-all duration-300">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-sm max-w-md mx-auto p-8">
            <Compass className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Destinations Found</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We couldn't find any destinations matching "{searchQuery}". Try searching for another name or tag.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
