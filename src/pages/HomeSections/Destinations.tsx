import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const destinations = [
  { name: 'Palghar', tagline: 'Beach & Nature Escapes', stays: 42, image: 'https://site.outlookindia.com/traveller/wp-content/uploads/files/2015/05/200715163414-Palghar1.jpg' },
  { name: 'Lonavala', tagline: 'Hill Station Retreats', stays: 68, image: 'https://www.noblehousetours.com/wp-content/uploads/2025/08/Things-to-Do-in-Lonavala-The-Ultimate-Guide-for-First-Time-Visitors.jpg' },
  { name: 'Alibaug', tagline: 'Coastal Weekend Getaway', stays: 55, image: 'https://www.stayvista.com/blog/wp-content/uploads/2024/06/Anjarle_beach-1.jpg' },
  { name: 'Mahabaleshwar', tagline: 'Strawberry Valley Stays', stays: 38, image: 'https://s7ap1.scene7.com/is/image/incredibleindia/1-pratapgarh-fort-mahabaleshwar-maharashtra-2-city-hero?qlt=82&ts=1726668937680' },
  { name: 'Igatpuri', tagline: 'Misty Mountain Resorts', stays: 22, image: '/igatpuri.png' },
  { name: 'Dahanu', tagline: 'Chikoo Farm Homestays', stays: 30, image: 'https://exploredahanu.com/assets/image1/3.jpg' },
];

export default function Destinations() {
  return (
    <section className="py-24 relative z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-[#FF385C]/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="inline-flex items-center gap-2 py-1 px-4 bg-[#091a11]/5 border border-[#091a11]/10 rounded-full mb-5">
              <span className="w-2 h-2 rounded-full bg-[#FF385C]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#091a11]/70">Weekend Getaways Near Mumbai</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#091a11] mb-4">Trending Destinations in Maharashtra</h2>
            <p className="text-[#091a11]/60 max-w-2xl text-lg">
              Best resorts, hotels &amp; family stays near Mumbai — beaches, hill stations, and farm escapes all in one place.
            </p>
          </div>
          <Link to="/search" className="hidden md:flex items-center gap-2 text-[#FF385C] font-bold uppercase tracking-widest text-xs hover:text-rose-400 transition-colors border-b border-[#FF385C] pb-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, idx) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link to={`/search?dest=${dest.name}`} className="group relative h-[300px] rounded-2xl overflow-hidden block shadow-xl border border-white/10">
                <img
                  src={dest.image}
                  alt={`${dest.name} resorts and stays`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a12]/95 via-[#0c1a12]/20 to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4">
                  <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-white/60 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <MapPin className="w-2.5 h-2.5" /> Maharashtra
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-[10px] text-[#FF385C] font-bold uppercase tracking-widest mb-1">{dest.tagline}</p>
                  <h3 className="text-2xl font-bold text-white mb-2">{dest.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-xs font-bold uppercase tracking-wider">{dest.stays}+ Verified Stays</span>
                    <span className="bg-[#FF385C] px-4 py-2 rounded-full text-white text-[10px] font-bold uppercase tracking-widest group-hover:bg-rose-500 transition-colors shadow-lg shadow-[#FF385C]/30">
                      Explore
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
