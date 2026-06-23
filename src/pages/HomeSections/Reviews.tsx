import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

const reviews = [
  {
    name: 'Rahul Sharma',
    role: 'Family Traveler • Mumbai',
    text: 'Found an amazing beachside villa in Palghar through StaySearch. The resort was exactly as shown — clean, spacious, and right on the beach. Contacting the host was super easy!',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=11',
    stay: 'Beach Villa, Palghar'
  },
  {
    name: 'Priya Desai',
    role: 'Weekend Explorer • Pune',
    text: 'The easiest way to find and explore resorts in Maharashtra. The properties are genuine, details are verified, and the owners are incredibly hospitable. Highly recommended for weekend getaways from Mumbai!',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=5',
    stay: 'Luxury Resort, Lonavala'
  },
  {
    name: 'Amit Patel',
    role: 'Nature Photographer • Nashik',
    text: 'Found a family resort in Mahabaleshwar. Platform is sleek, inquiry process was seamless, and the location was breath-taking. Will definitely use StaySearch for all my Maharashtra trips.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=12',
    stay: 'Mountain Resort, Mahabaleshwar'
  }
];

export default function Reviews() {
  return (
    <section className="py-24 relative overflow-hidden z-10" aria-label="Customer reviews of resorts in Maharashtra">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 py-1 px-4 bg-[#091a11]/5 border border-[#091a11]/10 rounded-full mb-6 mx-auto">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#091a11]/70">Real Guest Reviews</span>
          </div>

          {/* Aggregate rating */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-amber-500 fill-amber-500" />
              ))}
            </div>
            <span className="text-[#091a11] font-bold text-2xl">4.9</span>
            <span className="text-[#091a11]/50 text-sm">/5 · Based on 2,300+ reviews</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#091a11] mb-4">What Our Guests Say</h2>
          <p className="text-[#091a11]/60 text-lg">
            Thousands of families, couples, and solo travelers have found their perfect Maharashtra resort through StaySearch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#091a11]/10 p-8 rounded-3xl relative shadow-md group hover:shadow-xl hover:bg-white transition-all duration-300"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-[#091a11]/5 group-hover:text-[#E61E4D]/20 transition-colors" />

              {/* Stay badge */}
              <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-[#FF385C] bg-orange-600/10 border border-orange-600/20 px-3 py-1 rounded-full mb-4">
                {review.stay}
              </span>

              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-[#091a11]/15'}`} />
                ))}
              </div>
              <p className="text-[#091a11]/80 mb-8 italic line-clamp-4 leading-relaxed font-light">
                "{review.text}"
              </p>
              <div className="flex items-center gap-4">
                <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#091a11]/20" />
                <div>
                  <h4 className="font-bold text-[#091a11]">{review.name}</h4>
                  <p className="text-xs text-[#FF385C] uppercase tracking-wider font-bold mt-1">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 bg-[#FF385C] hover:bg-[#E61E4D] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all shadow-xl shadow-[#FF385C]/30 hover:-translate-y-0.5"
          >
            Explore Resorts & Inquire Now
          </Link>
        </div>
      </div>
    </section>
  );
}
