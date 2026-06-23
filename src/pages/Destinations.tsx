import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

const destinations = [
  {
    name: 'Palghar',
    image: 'https://site.outlookindia.com/traveller/wp-content/uploads/files/2015/05/200715163414-Palghar1.jpg',
    stays: 42,
    desc: 'Pristine beaches, historic forts, and beautiful nature escapes near Mumbai.',
  },
  {
    name: 'Lonavala',
    image: 'https://www.noblehousetours.com/wp-content/uploads/2025/08/Things-to-Do-in-Lonavala-The-Ultimate-Guide-for-First-Time-Visitors.jpg',
    stays: 68,
    desc: 'Famous hill station retreat with lush valleys, waterfalls, and scenic viewpoints.',
  },
  {
    name: 'Alibaug',
    image: 'https://www.stayvista.com/blog/wp-content/uploads/2024/06/Anjarle_beach-1.jpg',
    stays: 55,
    desc: 'Coastal paradise known for its clean beaches, water sports, and luxury villas.',
  },
  {
    name: 'Mahabaleshwar',
    image: 'https://s7ap1.scene7.com/is/image/incredibleindia/1-pratapgarh-fort-mahabaleshwar-maharashtra-2-city-hero?qlt=82&ts=1726668937680',
    stays: 38,
    desc: 'Strawberry capital of Maharashtra featuring breathtaking mountain viewpoints.',
  },
  {
    name: 'Igatpuri',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    stays: 22,
    desc: 'Misty green mountain getaway surrounded by serene lakes and waterfalls.',
  },
  {
    name: 'Dahanu',
    image: 'https://exploredahanu.com/assets/image1/3.jpg',
    stays: 30,
    desc: 'Serene chikoo orchards, beautiful homestays, and quiet uncrowded beaches.',
  }
];

export default function Destinations() {
  return (
    <div className="pt-24 min-h-screen relative overflow-hidden pb-16 bg-[#0c1a12]">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 mt-8">
          <div className="inline-flex items-center gap-2 py-1 px-4 bg-white/5 border border-white/10 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Maharashtra Destinations</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">Explore Destinations</h1>
          <p className="text-white/60 text-lg">
            From pristine beaches to misty hill stations, discover the hidden gems of Maharashtra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link to={`/search?dest=${dest.name}`} className="group relative h-[400px] rounded-[2rem] overflow-hidden block shadow-2xl border border-white/10">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a12]/90 via-[#0c1a12]/40 to-transparent pointer-events-none" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                      {dest.name}
                    </h3>
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">{dest.desc}</p>

                    <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="flex items-center gap-1 text-[#FF4E00] text-xs font-bold uppercase tracking-wider">
                        <MapPin className="w-4 h-4" /> {dest.stays} Stays
                      </span>
                      <span className="bg-white/10 p-2 rounded-full border border-white/10">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
