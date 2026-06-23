import React from 'react';
import { ShieldCheck, Heart, Sparkles, Building, BadgeCheck, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

const stats = [
  { value: '500+', label: 'Verified Resorts', sub: 'Across Maharashtra' },
  { value: '10K+', label: 'Happy Travelers', sub: 'Served with joy' },
  { value: '4.8★', label: 'Average Rating', sub: 'Based on 2,300+ reviews' },
  { value: '100%', label: 'Direct Connection', sub: 'Inquire with host' },
];

const features = [
  { icon: <ShieldCheck className="w-7 h-7" />, title: 'Verified Properties', desc: 'Every resort manually checked' },
  { icon: <BadgeCheck className="w-7 h-7" />, title: 'Direct Contact', desc: 'No middlemen or broker fees' },
  { icon: <Heart className="w-7 h-7" />, title: 'Family Friendly', desc: 'Curated for all ages' },
  { icon: <Sparkles className="w-7 h-7" />, title: 'Hygiene Certified', desc: 'Strict cleanliness standards' },
  { icon: <Tag className="w-7 h-7" />, title: 'Zero Markup', desc: 'Deal directly with hosts' },
  { icon: <Building className="w-7 h-7" />, title: '24/7 Support', desc: 'WhatsApp & call support' },
];

export default function TrustSection() {
  return (
    <section className="py-24 relative z-10" aria-label="Why trust StaySearch for booking resorts in Maharashtra">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white/3 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
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
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/3">
            <div className="inline-flex items-center gap-2 py-1 px-4 bg-[#091a11]/5 border border-[#091a11]/10 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#091a11]/70">Connect With Confidence</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#091a11] mb-6 leading-tight drop-shadow-sm">
              Trusted by <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">10,000+ Travelers</span>
            </h2>
            <p className="text-[#091a11]/60 mb-8 text-lg leading-relaxed">
              StaySearch exclusively lists verified resorts, hotels, and homestays across Maharashtra. Every property is checked for safety, hygiene, and genuine hospitality.
            </p>
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-3 bg-green-500/10 backdrop-blur-md p-4 rounded-xl border border-green-500/20">
                <ShieldCheck className="w-6 h-6 text-green-600 flex-shrink-0" />
                <span className="font-semibold text-sm text-[#091a11]/90">Official Hospitality Partner Network</span>
              </div>
              <div className="inline-flex items-center gap-3 bg-amber-500/10 backdrop-blur-md p-4 rounded-xl border border-amber-500/20">
                <Tag className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <span className="font-semibold text-sm text-[#091a11]/90">Direct Host Connection — No Middlemen</span>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={cn(
                  "bg-white border border-[#091a11]/10 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-md transition-all duration-300 shadow-sm",
                )}
              >
                <div className="text-orange-600 mb-4 bg-[#FF4E00]/10 p-3 rounded-full border border-orange-500/20">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-[#091a11] mb-2">{feature.title}</h3>
                <p className="text-[10px] uppercase tracking-wider text-[#091a11]/50">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
