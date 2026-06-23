import React from 'react';
import { motion } from 'motion/react';
import { Search, CheckCircle, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    num: '01',
    icon: <Search className="w-7 h-7" />,
    title: 'Search Your Destination',
    desc: 'Enter your destination and filter by category like beach, hills, farm, or luxury.',
    color: 'from-[#FF4E00] to-amber-500',
    shadow: 'shadow-[#FF4E00]/30',
    bg: 'bg-[#FF4E00]/10',
    border: 'border-[#FF4E00]/30',
  },
  {
    num: '02',
    icon: <CheckCircle className="w-7 h-7" />,
    title: 'Choose Your Perfect Stay',
    desc: 'Browse verified resorts, villas, and rooms with real photos, honest reviews, and detailed host contact information.',
    color: 'from-green-400 to-emerald-500',
    shadow: 'shadow-green-500/30',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
  },
  {
    num: '03',
    icon: <Zap className="w-7 h-7" />,
    title: 'Inquire & Plan Directly',
    desc: 'Connect directly with the resort hosts on WhatsApp to check availability and plan your stay. No agent commission or middleman fees!',
    color: 'from-violet-400 to-purple-500',
    shadow: 'shadow-violet-500/30',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 relative z-10 border-t border-[#091a11]/5" aria-label="How to find a resort in Maharashtra">
      {/* Glow blobs */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#FF4E00]/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-violet-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 py-1.5 px-5 bg-[#091a11]/5 border border-[#091a11]/10 rounded-full mb-5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#091a11]/70">Simple 3-Step Process</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#091a11] mb-4">
            Find Your Perfect Stay
          </h2>
          <p className="text-[#091a11]/60 text-lg max-w-2xl mx-auto">
            StaySearch makes it incredibly easy to plan your perfect Maharashtra getaway by connecting you directly with verified hosts.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line on desktop */}
          <div className="hidden md:block absolute top-[52px] left-[calc(16.7%+24px)] right-[calc(16.7%+24px)] h-px bg-gradient-to-r from-[#FF4E00]/40 via-green-500/40 to-violet-500/40 z-0" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative z-10 bg-white border border-[#091a11]/10 rounded-3xl p-8 text-center group hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {/* Step number */}
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#091a11]/30 mb-4">{step.num}</div>

              {/* Icon circle */}
              <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-6 shadow-xl ${step.shadow} group-hover:scale-110 transition-transform duration-300`}>
                {step.icon}
              </div>

              <h3 className="text-xl font-bold text-[#091a11] mb-3">{step.title}</h3>
              <p className="text-[#091a11]/60 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 text-center flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/search"
            className="inline-flex items-center gap-2 bg-[#FF4E00] hover:bg-orange-600 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all shadow-xl shadow-[#FF4E00]/30 hover:shadow-[#FF4E00]/50 hover:-translate-y-0.5"
          >
            Start Exploring Resorts
          </Link>
          <a
            href="https://wa.me/919987091858?text=Hi%20StaySearch%2C%20I%20need%20help%20finding%20a%20resort%20in%20Maharashtra"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-[#091a11]/20 hover:border-green-500/50 text-[#091a11]/80 hover:text-[#091a11] px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all bg-white/50 hover:bg-green-500/5"
          >
            <svg className="w-4 h-4 fill-current text-green-500" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Chat via WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
