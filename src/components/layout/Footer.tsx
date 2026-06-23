import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Facebook, Twitter, Instagram, Mail, Phone, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-20 mt-24">
      {/* Footer Trust Bar */}
      <div className="px-6 md:px-10 py-8 backdrop-blur-2xl bg-black/40 flex flex-col md:flex-row items-start md:items-center justify-between border-y border-white/5 gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-5 h-5 text-[#FF385C]" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-white">Verified Stays</p>
              <p className="text-[9px] text-white/50">Official Partner Stays</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shadow-inner">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-white">Secure Booking</p>
              <p className="text-[9px] text-white/50">SSL Certified Payments</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shadow-inner">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-white">Family Friendly</p>
              <p className="text-[9px] text-white/50">Vetted Safe Stays</p>
            </div>
          </div>
        </div>

        <div className="text-left md:text-right w-full md:w-auto p-4 md:p-0 bg-white/5 md:bg-transparent rounded-xl">
          <p className="text-[9px] text-white/30 tracking-widest uppercase mb-1">Live Weather</p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">28°C</span>
            <span className="text-xs text-white/60">Sunny • kelva</span>
          </div>
        </div>
      </div>

      <div className="bg-[#08120C] pt-16 pb-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-3 group">
                <img 
                  src="/staysearch.jpeg" 
                  alt="StaySearch Logo" 
                  className="w-10 h-10 rounded-lg object-cover border border-white/10 shadow-sm" 
                />
                <span className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
                  StaySearch<span className="text-[#FF385C]">.</span>
                </span>
              </Link>
              <p className="text-white/50 text-sm leading-relaxed">
                Your gateway to Maharashtra tourism. Discover trusted, verified stays across gorgeous beaches, lush green forests, and serene villages.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="p-2 bg-white/5 hover:bg-[#FF385C] rounded-full transition-colors border border-white/10">
                  <Facebook className="w-4 h-4 text-white" />
                </a>
                <a href="#" className="p-2 bg-white/5 hover:bg-[#FF385C] rounded-full transition-colors border border-white/10">
                  <Twitter className="w-4 h-4 text-white" />
                </a>
                <a href="#" className="p-2 bg-white/5 hover:bg-[#FF385C] rounded-full transition-colors border border-white/10">
                  <Instagram className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold tracking-wider uppercase text-xs mb-6">Quick Destinations</h3>
              <ul className="space-y-3 text-sm text-white/50">
                {['kelva Beach', 'Dahanu', 'Jawhar', 'Bordi', 'Saphale', 'Wada'].map((dest) => (
                  <li key={dest}>
                    <Link to={`/search?dest=${dest}`} className="hover:text-[#FF385C] transition-colors">
                      Stays in {dest}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-bold tracking-wider uppercase text-xs mb-6">Support & Resources</h3>
              <ul className="space-y-3 text-sm text-white/50">
                <li><Link to="/blogs" className="text-[#FF385C] font-bold hover:text-orange-300 transition-colors">Resort Owner Blog</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About StaySearch</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-white font-bold tracking-wider uppercase text-xs mb-6">Stay Updated</h3>
              <p className="text-sm text-white/50 mb-4">
                Subscribe to get the latest deals on Maharashtra resorts and weekend getaways.
              </p>
              <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/5 border items-center border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#FF385C] text-sm"
                />
                <button
                  type="submit"
                  className="bg-[#FF385C] hover:bg-[#E61E4D] text-white px-4 py-3 rounded-lg font-bold uppercase tracking-wider transition-colors text-xs shadow-lg shadow-rose-500/20"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/30 font-medium">
              © {new Date().getFullYear()} StaySearch. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/50 font-medium">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>Partnered with verified networks for safe tourism</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
