import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AiPlannerBanner() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      <div 
        className="bg-gradient-to-r from-[#132a1d] via-[#1a3a2a] to-[#132a1d] rounded-3xl p-8 md:p-14 border border-[#FF385C]/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10"
      >
        {/* Glow Effects */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#FF385C]/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF385C]/20 border border-[#FF385C]/40 text-[#FF385C] text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-4 h-4 animate-spin" /> New AI Concierge Feature
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            Not sure where to go? Let AI craft your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF385C] to-orange-400">Maharashtra Trip</span>
          </h2>
          <p className="text-white/70 text-base md:text-lg font-medium mb-8 leading-relaxed">
            Generate instantly verified day-by-day itineraries for Alibaug, Lonavala, Mahabaleshwar, or Palghar based on your vibe, budget, and travel companions.
          </p>

          <div className="flex flex-wrap gap-6 text-sm font-bold text-white/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#FF385C]">
                <MapPin className="w-4 h-4" />
              </div>
              <span>Custom Route Maps</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#FF385C]">
                <Calendar className="w-4 h-4" />
              </div>
              <span>Day-by-Day Schedules</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#FF385C]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>Direct Room Matches</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full md:w-auto">
          <Link
            to="/itinerary"
            className="w-full md:w-auto px-10 py-5 bg-[#FF385C] hover:bg-[#E61E4D] text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-[#FF385C]/40 hover:scale-105 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <span>Launch AI Planner</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
