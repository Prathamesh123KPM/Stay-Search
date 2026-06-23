import React from 'react';
import { Mail, MessageSquare, Phone, MapPin } from 'lucide-react';

export default function Support() {
  return (
    <div className="pt-24 min-h-screen relative overflow-hidden pb-16 bg-[#fafafa]">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] hidden" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] hidden" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 mt-8">
          <div className="inline-flex items-center gap-2 py-1 px-4 bg-rose-50 border border-rose-100 rounded-full mb-6">
             <span className="w-2 h-2 rounded-full bg-[#FF385C]"></span>
             <span className="text-[10px] font-bold uppercase tracking-widest text-[#222222]/70">Help Center</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#222222] mb-6">How can we help?</h1>
          <p className="text-[#222222]/60 text-lg">
            Whether you need help with a booking, have a question about a property, or want to list your stay, we're here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <a href="tel:+919987091858" className="block bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm group hover:bg-white/10 transition-colors cursor-pointer">
             <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 border border-gray-200 group-hover:bg-[#FF385C] transition-colors">
               <Phone className="w-6 h-6 text-[#222222]" />
             </div>
             <h3 className="text-xl font-bold text-[#222222] mb-3">Call Us</h3>
             <p className="text-[#222222]/60 text-sm mb-6">Available from 9 AM to 9 PM, all days of the week.</p>
             <p className="text-xl font-bold text-[#FF385C]">+91 99870 91858</p>
          </a>
          
          <a href="https://wa.me/919987091858?text=Hi%20StaySearch!%20I%20need%20assistance%20with%20bookings" target="_blank" rel="noopener noreferrer" className="block bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm group hover:bg-white/10 transition-colors cursor-pointer">
             <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 border border-gray-200 group-hover:bg-green-500 transition-colors">
               <MessageSquare className="w-6 h-6 text-[#222222]" />
             </div>
             <h3 className="text-xl font-bold text-[#222222] mb-3">WhatsApp Support</h3>
             <p className="text-[#222222]/60 text-sm mb-6">Instant messaging for quick queries and bookings.</p>
             <p className="text-sm font-bold uppercase tracking-widest text-green-600">Message Us &rarr;</p>
          </a>
          
          <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm group hover:bg-white/10 transition-colors cursor-pointer">
             <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 border border-gray-200 group-hover:bg-blue-500 transition-colors">
               <Mail className="w-6 h-6 text-[#222222]" />
             </div>
             <h3 className="text-xl font-bold text-[#222222] mb-3">Email Us</h3>
             <p className="text-[#222222]/60 text-sm mb-6">Drop us a line and we'll get back to you within 24 hours.</p>
             <p className="text-lg font-bold text-[#222222]/90">hello@staysearch.com</p>
          </div>
          
          <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm group hover:bg-white/10 transition-colors">
             <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 border border-gray-200">
               <MapPin className="w-6 h-6 text-[#222222]" />
             </div>
             <h3 className="text-xl font-bold text-[#222222] mb-3">Office Location</h3>
             <p className="text-[#222222]/60 text-sm leading-relaxed">
               123 Tourism Plaza, Main Road, Palghar City, Maharashtra 401404
             </p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-200 p-8 shadow-sm text-center">
            <h2 className="text-2xl font-bold text-[#222222] mb-4">Frequently Asked Questions</h2>
            <p className="text-[#222222]/60 mb-8">Can't find the answer you're looking for? Reach out to our customer support team.</p>
            <div className="flex flex-col gap-4 text-left">
                {[
                  "How do I verify the quality of a property?",
                  "What is your cancellation policy?",
                  "Can I book experiences without booking a stay?",
                  "How do I list my property on StaySearch?"
                ].map((q, i) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                     <p className="text-[#222222]/90 font-medium text-sm">{q}</p>
                  </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
