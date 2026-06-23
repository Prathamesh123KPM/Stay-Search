import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Landmark, 
  Mountain, 
  Sprout, 
  Trees, 
  Palmtree, 
  Flower2, 
  Utensils, 
  Heart, 
  Recycle,
  ArrowRight
} from 'lucide-react';

const experiences = [
  {
    title: 'Cultural & Heritage',
    desc: 'Explore ancient forts, historic caves, and Warli folk art of Maharashtra.',
    icon: Landmark,
    query: 'cultural-heritage',
    color: 'bg-amber-500/10 text-amber-700 border-amber-500/20'
  },
  {
    title: 'Adventure',
    desc: 'Trek Sahyadri cliffs, paraglide in Kamshet, and conquer white water rapids.',
    icon: Mountain,
    query: 'adventure',
    color: 'bg-blue-500/10 text-blue-700 border-blue-500/20'
  },
  {
    title: 'Agriculture',
    desc: 'Experience rural farm life, agro-tourism retreats, and organic crop harvesting.',
    icon: Sprout,
    query: 'agriculture',
    color: 'bg-green-500/10 text-green-700 border-green-500/20'
  },
  {
    title: 'Nature & Wildlife',
    desc: 'Spot tigers in Tadoba, explore bird sanctuaries, and walk lush nature trails.',
    icon: Trees,
    query: 'nature-wildlife',
    color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
  },
  {
    title: 'Beach & Coastal',
    desc: 'Enjoy pristine Konkan coast beaches, water sports, and seaside camping.',
    icon: Palmtree,
    query: 'beach-coastal',
    color: 'bg-sky-500/10 text-sky-700 border-sky-500/20'
  },
  {
    title: 'Pilgrimage & Spiritual',
    desc: 'Discover tranquility in ancient temples, meditation spots, and spiritual hubs.',
    icon: Flower2,
    query: 'pilgrimage-spiritual',
    color: 'bg-purple-500/10 text-purple-700 border-purple-500/20'
  },
  {
    title: 'Culinary & Food',
    desc: 'Relish authentic Maharashtrian thalis, coastal fish curries, and spicy street food.',
    icon: Utensils,
    query: 'culinary-food',
    color: 'bg-red-500/10 text-red-700 border-red-500/20'
  },
  {
    title: 'Wellness',
    desc: 'Rejuvenate with Ayurvedic therapies, yoga retreats, and natural healing spas.',
    icon: Heart,
    query: 'wellness',
    color: 'bg-pink-500/10 text-pink-700 border-pink-500/20'
  },
  {
    title: 'Ecotourism',
    desc: 'Travel sustainably in pristine reserves, eco-friendly stays, and green spaces.',
    icon: Recycle,
    query: 'ecotourism',
    color: 'bg-teal-500/10 text-teal-700 border-teal-500/20'
  }
];

export default function Experiences() {
  return (
    <section className="py-24 relative overflow-hidden z-10" aria-label="Experiences and itineraries">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-rose-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 py-1 px-4 bg-[#091a11]/5 border border-[#091a11]/10 rounded-full mb-6 mx-auto">
             <span className="w-2 h-2 rounded-full bg-orange-400"></span>
             <span className="text-[10px] font-bold uppercase tracking-widest text-[#091a11]/70">More Than Just a Stay</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#091a11] mb-6">Explore Unique Itineraries</h2>
          <p className="text-[#091a11]/60 text-base max-w-2xl mx-auto font-light">
            Immerse yourself in curated trails designed to show you the absolute best of Maharashtra's culture, topography, and experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp, idx) => {
            const IconComponent = exp.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link
                  to={`/search?category=${exp.query}`}
                  className="group block p-6 bg-white border border-[#091a11]/10 rounded-2xl shadow-sm hover:shadow-xl hover:border-rose-500/30 transition-all duration-300 h-full relative overflow-hidden"
                >
                  {/* Subtle top-right accent glow on card hover */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-500/5 to-transparent rounded-bl-full group-hover:scale-150 transition-transform duration-500" />
                  
                  <div className="flex items-start gap-4">
                    {/* Dynamic colored icon wrapper */}
                    <div className={`p-3.5 rounded-2xl border ${exp.color} transition-transform duration-500 group-hover:scale-110 flex-shrink-0`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-extrabold text-[#091a11] group-hover:text-[#E61E4D] transition-colors flex items-center gap-1.5">
                        {exp.title}
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-orange-500" />
                      </h3>
                      <p className="text-xs text-[#091a11]/60 font-light leading-relaxed">
                        {exp.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic tagline at the bottom matching the reference banner */}
        <div className="mt-16 text-center max-w-xl mx-auto">
          <p className="text-sm font-semibold text-[#091a11]/80 leading-relaxed">
            Explore unique experiences and personalized itineraries designed for every traveller.
          </p>
        </div>
      </div>
    </section>
  );
}
