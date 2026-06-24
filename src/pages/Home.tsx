import React from 'react';
import Hero from './HomeSections/Hero';
import TrustSection from './HomeSections/TrustSection';
import FeaturedStays from './HomeSections/FeaturedStays';
import LonavalaStays from './HomeSections/LonavalaStays';
import Reviews from './HomeSections/Reviews';
import WhatsAppCTA from './HomeSections/WhatsAppCTA';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero - Instant clarity: book resorts in Maharashtra */}
      <Hero />
      {/* 7. Trust Section - Stats + verification badges */}
      <TrustSection />
      {/* 6. Featured Stays - Showcase actual properties */}
      <FeaturedStays />
      {/* Popular stays in Lonavala */}
      <LonavalaStays />
      {/* 10. Reviews - Social proof */}
      <Reviews />
      {/* 11. WhatsApp CTA - Floating inquiry button */}
      <WhatsAppCTA />
    </div>
  );
}
