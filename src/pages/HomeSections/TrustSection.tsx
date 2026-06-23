import React from 'react';
import { motion } from 'motion/react';

const stats = [
  { value: '500+', label: 'Verified Resorts', sub: 'Across Maharashtra' },
  { value: '10K+', label: 'Happy Travelers', sub: 'Served with joy' },
  { value: '4.8★', label: 'Average Rating', sub: 'Based on 2,300+ reviews' },
  { value: '100%', label: 'Direct Connection', sub: 'Inquire with host' },
];

export default function TrustSection() {
  return (
    <section className="py-12 relative z-10 border-b border-gray-150" aria-label="StaySearch Statistics">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white/3 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Stats Banner */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white border border-[#091a11]/10 rounded-2xl p-6 text-center hover:shadow-md transition-all duration-300 shadow-sm group">
              <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 mb-1 group-hover:scale-110 transition-transform origin-center inline-block">
                {stat.value}
              </div>
              <div className="font-bold text-[#091a11] text-sm">{stat.label}</div>
              <div className="text-[10px] text-[#091a11]/50 uppercase tracking-wider mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
