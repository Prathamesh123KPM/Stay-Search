import React from 'react';
import Hero from './HomeSections/Hero';
import TrustSection from './HomeSections/TrustSection';
import StayCategories from './HomeSections/StayCategories';
import Destinations from './HomeSections/Destinations';
import AiPlannerBanner from './HomeSections/AiPlannerBanner';
import HowItWorks from './HomeSections/HowItWorks';
import FeaturedStays from './HomeSections/FeaturedStays';
import Experiences from './HomeSections/Experiences';
import WhyChoose from './HomeSections/WhyChoose';
import BlogsSection from './HomeSections/BlogsSection';
import Reviews from './HomeSections/Reviews';
import WhatsAppCTA from './HomeSections/WhatsAppCTA';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero - Instant clarity: book resorts in Maharashtra */}
      <Hero />
      {/* 2. Stay Categories - What kind of stay? Beach/Farm/Luxury/Budget */}
      <StayCategories />
      {/* 3. Trending Destinations - Where in Maharashtra? */}
      <Destinations />
      {/* 4. AI Itinerary Planner Banner */}
      <AiPlannerBanner />
      {/* 5. How It Works - Reduce booking friction with 3 simple steps */}
      <HowItWorks />
      {/* 6. Featured Stays - Showcase actual properties */}
      <FeaturedStays />
      {/* 7. Trust Section - Stats + verification badges */}
      <TrustSection />
      {/* 8. Experiences - Activities & immersive stays */}
      <Experiences />
      {/* 9. Why Choose Us - Brand differentiators */}
      <WhyChoose />
      {/* 9.5. Resort Owner Blogs & Resources */}
      <BlogsSection />
      {/* 10. Reviews - Social proof */}
      <Reviews />
      {/* 11. WhatsApp CTA - Floating inquiry button */}
      <WhatsAppCTA />
    </div>
  );
}
