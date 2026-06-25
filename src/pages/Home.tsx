import React from 'react';
import Hero from './HomeSections/Hero';
import TrustSection from './HomeSections/TrustSection';
import FeaturedStays from './HomeSections/FeaturedStays';
import LonavalaStays from './HomeSections/LonavalaStays';
import Reviews from './HomeSections/Reviews';
import WhatsAppCTA from './HomeSections/WhatsAppCTA';
import SEO from '../components/SEO';

export default function Home() {
  const homeSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "StaySearch",
      "url": window.location.origin,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${window.location.origin}/search?dest={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "StaySearch",
      "url": window.location.origin,
      "logo": `${window.location.origin}/staysearch.jpeg`
    }
  ];

  return (
    <div className="flex flex-col w-full">
      <SEO
        title="StaySearch - Book Premium Resorts, Rooms & Stays in Maharashtra"
        description="Discover and book the best resorts, forest villas, beachfront rooms, and premium stays across Maharashtra. Enjoy verified accommodations and seamless booking with StaySearch."
        keywords="Maharashtra resorts, book rooms Maharashtra, premium stays, beach resorts Palghar, Lonavala villas, hotel booking Maharashtra, budget villas Maharashtra, resort staycation near Mumbai, resorts near Pune, weekend getaways Maharashtra"
        schema={homeSchema}
      />
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
