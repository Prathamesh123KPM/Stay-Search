import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const categories = [
  {
    label: 'Beach Resorts',
    emoji: '🏖️',
    desc: 'Ocean views & private beach access',
    query: 'Beach',
    gradient: 'from-cyan-500/20 to-blue-600/20',
    border: 'border-cyan-500/30',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop'
  },
  {
    label: 'Farm Stays',
    emoji: '🌿',
    desc: 'Peaceful countryside getaways',
    query: 'Farm',
    gradient: 'from-green-500/20 to-emerald-600/20',
    border: 'border-green-500/30',
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop'
  },
  {
    label: 'Luxury Villas',
    emoji: '🏰',
    desc: 'Premium amenities & private pools',
    query: 'Luxury',
    gradient: 'from-amber-500/20 to-yellow-600/20',
    border: 'border-amber-500/30',
    img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=600&auto=format&fit=crop'
  },
  {
    label: 'Budget Rooms',
    emoji: '🛏️',
    desc: 'Affordable stays, great comfort',
    query: 'Budget',
    gradient: 'from-violet-500/20 to-purple-600/20',
    border: 'border-violet-500/30',
    img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop'
  },
  {
    label: 'Family Resorts',
    emoji: '👨‍👩‍👧',
    desc: 'Kids activities & family suites',
    query: 'Family',
    gradient: 'from-rose-500/20 to-pink-600/20',
    border: 'border-rose-500/30',
    img: 'https://images.unsplash.com/photo-1587874522487-fe10e954d035?q=80&w=600&auto=format&fit=crop'
  },
  {
    label: 'Couple Stays',
    emoji: '💑',
    desc: 'Romantic & private escapes',
    query: 'Couple',
    gradient: 'from-red-500/20 to-orange-600/20',
    border: 'border-red-500/30',
    img: 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?q=80&w=600&auto=format&fit=crop'
  },
];

export default function StayCategories() {
  return (
    <section className="py-20 relative z-10" aria-label="Browse stay categories">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF4E00]/3 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 py-1.5 px-5 bg-[#091a11]/5 border border-[#091a11]/10 rounded-full mb-5">
            <span className="w-2 h-2 rounded-full bg-[#FF4E00] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#091a11]/70">What Are You Looking For?</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#091a11] mb-4">
            Browse by Stay Type
          </h2>
          <p className="text-[#091a11]/60 text-lg max-w-2xl mx-auto">
            From luxury beachfront resorts to cozy farm stays — find the perfect accommodation in Maharashtra for every budget and occasion.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.07 }}
            >
              <Link
                to={`/search?type=${cat.query}`}
                className={`group flex flex-col items-center text-center p-5 rounded-2xl bg-gradient-to-br ${cat.gradient} border ${cat.border} hover:scale-105 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:shadow-black/10 relative overflow-hidden h-full`}
              >
                {/* Background image */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-10 group-hover:opacity-25 transition-opacity duration-500">
                  <img src={cat.img} alt={cat.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>

                <div className="relative z-10 flex flex-col items-center gap-3">
                  <span className="text-4xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{cat.emoji}</span>
                  <h3 className="font-bold text-[#091a11] text-sm leading-tight">{cat.label}</h3>
                  <p className="text-[10px] text-[#091a11]/70 leading-snug hidden sm:block">{cat.desc}</p>
                  <span className="mt-1 text-[9px] font-bold uppercase tracking-widest text-[#091a11]/50 group-hover:text-[#FF4E00] transition-colors">
                    Explore →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {['Best Resorts in Maharashtra', 'Weekend Getaways Near Mumbai', 'Family Resorts Near Mumbai', 'Luxury Stays Maharashtra'].map(kw => (
            <Link
              key={kw}
              to={`/search?dest=${kw}`}
              className="text-xs font-medium text-[#091a11]/50 hover:text-[#FF4E00] transition-colors border border-[#091a11]/10 hover:border-[#FF4E00]/30 px-4 py-2 rounded-full bg-white shadow-sm"
            >
              {kw}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
