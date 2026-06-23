import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

export default function WhyChoose() {
  const points = [
    'Dedicated exclusively to discovering resorts and stays in Maharashtra',
    'Verified by our hospitality networks for top quality',
    'Direct communication with verified hosts',
    'Direct support for local businesses and communities',
    'Curated list of premium resorts and budget stays',
    '24/7 dedicated customer support for your trips'
  ];

  return (
    <section className="py-24 relative overflow-hidden z-10 border-t border-white/5">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-green-500/5 blur-[120px] pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl p-2 bg-white/5 backdrop-blur-md border border-white/10"
            >
              <img 
                src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1200&auto=format&fit=crop" 
                alt="Beautiful Maharashtra resort stay" 
                className="rounded-2xl w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a12]/50 to-transparent rounded-2xl pointer-events-none"></div>
            </motion.div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 py-1 px-4 bg-[#091a11]/5 border border-[#091a11]/10 rounded-full mb-6">
               <span className="w-2 h-2 rounded-full bg-green-500"></span>
               <span className="text-[10px] font-bold uppercase tracking-widest text-[#091a11]/70">Why Us</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#091a11] mb-6 leading-tight">
              Why Explore Resorts With StaySearch?
            </h2>
            <p className="text-[#091a11]/60 mb-8 text-lg leading-relaxed">
              We are not a booking platform; we are your premier gateway to the unexplored beauty of Maharashtra. We help you discover genuine rooms, villas, and resort stays directly.
            </p>
            
            <ul className="space-y-4">
              {points.map((point, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#091a11]/10 hover:shadow-md transition-all duration-300 shadow-sm"
                >
                  <div className="mt-0.5 bg-green-500/20 p-1.5 rounded-full border border-green-500/30">
                    <Check className="w-4 h-4 text-green-700" />
                  </div>
                  <span className="text-[#091a11] font-medium">{point}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-10">
              <button className="bg-white text-[#091a11] border border-[#091a11]/25 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#091a11]/5 transition-all shadow-sm hover:shadow-md">
                Learn About Our Quality Standards
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
