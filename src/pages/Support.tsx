import React from 'react';
import { Mail, MessageSquare, Phone, MapPin } from 'lucide-react';

export default function Support() {
  return (
    <div className="pt-24 min-h-screen relative overflow-hidden pb-16 bg-[#0c1a12]">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 mt-8">
          <div className="inline-flex items-center gap-2 py-1 px-4 bg-white/5 border border-white/10 rounded-full mb-6">
             <span className="w-2 h-2 rounded-full bg-[#FF4E00]"></span>
             <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Help Center</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">How can we help?</h1>
          <p className="text-white/60 text-lg">
            Whether you need help with a booking, have a question about a property, or want to list your stay, we're here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <a href="tel:+919987091858" className="block bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 shadow-xl group hover:bg-white/10 transition-colors cursor-pointer">
             <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:bg-[#FF4E00] transition-colors">
               <Phone className="w-6 h-6 text-white" />
             </div>
             <h3 className="text-xl font-bold text-white mb-3">Call Us</h3>
             <p className="text-white/60 text-sm mb-6">Available from 9 AM to 9 PM, all days of the week.</p>
             <p className="text-xl font-bold text-[#FF4E00]">+91 99870 91858</p>
          </a>
          
          <a href="https://wa.me/919987091858?text=Hi%20StaySearch!%20I%20need%20assistance%20with%20bookings" target="_blank" rel="noopener noreferrer" className="block bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 shadow-xl group hover:bg-white/10 transition-colors cursor-pointer">
             <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:bg-green-500 transition-colors">
               <MessageSquare className="w-6 h-6 text-white" />
             </div>
             <h3 className="text-xl font-bold text-white mb-3">WhatsApp Support</h3>
             <p className="text-white/60 text-sm mb-6">Instant messaging for quick queries and bookings.</p>
             <p className="text-sm font-bold uppercase tracking-widest text-green-400">Message Us &rarr;</p>
          </a>
          
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 shadow-xl group hover:bg-white/10 transition-colors cursor-pointer">
             <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:bg-blue-500 transition-colors">
               <Mail className="w-6 h-6 text-white" />
             </div>
             <h3 className="text-xl font-bold text-white mb-3">Email Us</h3>
             <p className="text-white/60 text-sm mb-6">Drop us a line and we'll get back to you within 24 hours.</p>
             <p className="text-lg font-bold text-white/90">hello@staysearch.com</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 shadow-xl group hover:bg-white/10 transition-colors">
             <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
               <MapPin className="w-6 h-6 text-white" />
             </div>
             <h3 className="text-xl font-bold text-white mb-3">Office Location</h3>
             <p className="text-white/60 text-sm leading-relaxed">
               123 Tourism Plaza, Main Road, Palghar City, Maharashtra 401404
             </p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 p-8 shadow-xl text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-white/60 mb-8">Can't find the answer you're looking for? Reach out to our customer support team.</p>
            <div className="flex flex-col gap-4 text-left">
                {[
                  "How do I verify the quality of a property?",
                  "What is your cancellation policy?",
                  "Can I book experiences without booking a stay?",
                  "How do I list my property on StaySearch?"
                ].map((q, i) => (
                  <div key={i} className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/20 transition-colors cursor-pointer">
                     <p className="text-white/90 font-medium text-sm">{q}</p>
                  </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
