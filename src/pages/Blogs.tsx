import React, { useState } from 'react';
import { BookOpen, Calendar, User, ArrowRight, X, Sparkles, Building, Landmark, ChevronRight, Check } from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  author: string;
  role: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
  image: string;
  content: React.ReactNode;
}

export default function Blogs() {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  // SEO & Schema Structured Data Optimization
  React.useEffect(() => {
    // 1. Dynamic Meta Title, Description, and Keywords Setup
    const prevTitle = document.title;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    const prevDescription = metaDescription.getAttribute('content') || '';

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    const prevKeywords = metaKeywords.getAttribute('content') || '';

    // 2. Structured Data Schema script setup
    let schemaScript = document.getElementById('blog-seo-schema') as HTMLScriptElement;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'blog-seo-schema';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const baseSchema = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "StaySearch Resort Partner Hub",
      "description": "Tactical guides, marketing strategies, and operations resources for resort and farmhouse owners in Maharashtra.",
      "url": window.location.href
    };

    if (selectedBlog) {
      // Set Blog Article Specific SEO
      document.title = `${selectedBlog.title} | StaySearch Partner Insights`;
      metaDescription.setAttribute('content', selectedBlog.excerpt);
      
      const keywordsMap: Record<string, string> = {
        'double-resort-bookings': 'resort marketing maharashtra, increase resort bookings, promote resort alibaug, direct booking channels, hospitality seo india',
        'boutique-vs-giant-otas': 'hotel ota commission fees india, boutique resort listing, direct bookings hotels, list resort commission free, booking portals comparison',
        'weekend-vs-weekday-occupancy': 'resort occupancy strategies, mid-week corporate offsite, corporate package ideas, workation packages maharashtra, fill hotel rooms weekdays'
      };
      metaKeywords.setAttribute('content', keywordsMap[selectedBlog.id] || 'resort marketing, increase hotel revenue');

      // Inject Article Schema
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": selectedBlog.title,
        "description": selectedBlog.excerpt,
        "image": selectedBlog.image,
        "datePublished": "2026-06-12",
        "author": {
          "@type": "Person",
          "name": selectedBlog.author,
          "jobTitle": selectedBlog.role
        },
        "publisher": {
          "@type": "Organization",
          "name": "StaySearch",
          "url": window.location.origin
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${window.location.origin}/blogs#${selectedBlog.id}`
        }
      };
      schemaScript.text = JSON.stringify(articleSchema);
    } else {
      // Set Default Hub SEO
      document.title = "Resort Owner Resources & Marketing Guides | StaySearch Hub";
      metaDescription.setAttribute('content', 'Scale your resort bookings, reduce high OTA commission losses, and optimize weekday occupancy. Practical advice for resort owners in Maharashtra.');
      metaKeywords.setAttribute('content', 'resort marketing maharashtra, increase resort bookings, staysearch partner, commission free booking platform, resort occupancy strategy, hotel ota commission fees india');
      
      schemaScript.text = JSON.stringify(baseSchema);
    }

    return () => {
      document.title = prevTitle;
      if (metaDescription) metaDescription.setAttribute('content', prevDescription);
      if (metaKeywords) metaKeywords.setAttribute('content', prevKeywords);
      const tag = document.getElementById('blog-seo-schema');
      if (tag) tag.remove();
    };
  }, [selectedBlog]);

  const blogs: Blog[] = [
    {
      id: 'double-resort-bookings',
      title: '5 Simple Strategies to Double Your Resort Bookings in Maharashtra',
      author: 'Rajesh K.',
      role: 'Boutique Hospitality Consultant',
      date: 'June 12, 2026',
      category: 'Marketing & Bookings',
      readTime: '5 min read',
      excerpt: 'Struggling to fill your weekend calendar? Discover how optimizing direct booking channels, leveraging local SEO, and highlighting immersive regional experiences can double your resort bookings in Maharashtra without expensive ad campaigns.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
      content: (
        <div className="space-y-6 text-[#091a11]/80 leading-relaxed text-sm md:text-base">
          <p className="font-semibold text-[#091a11] text-lg">
            The tourism landscape in Maharashtra is undergoing a massive shift. With cities like Mumbai, Pune, and Nagpur bustling, urban dwellers are constantly seeking weekend retreats. Yet, many resort owners struggle to maintain consistent booking rates.
          </p>
          
          <p>
            You don't need a multi-million rupee marketing budget to stand out. Here are five actionable strategies you can implement today to double your resort bookings:
          </p>

          <div className="space-y-4">
            <h3 className="text-[#091a11] font-bold text-lg flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center text-xs">1</span>
              Curate and Highlight Regional Immersive Experiences
            </h3>
            <p>
              Modern travelers aren't just buying a room; they are buying an experience. If your resort is near Kelva, highlight beachside horse-cart rides or sunset seafood dinners. If you are in Jawhar, organize tours to see local Warli painters. Add these experiences as package add-ons in your listings.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-[#091a11] font-bold text-lg flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center text-xs">2</span>
              Invest in High-Quality Visual Storytelling
            </h3>
            <p>
              An image is worth a thousand bookings. Ensure your resort listing features bright, high-resolution photos of clean bathrooms, cozy beds, local food platters, and panoramic views. Avoid dark, blurry mobile phone photos. High-quality visuals reduce customer hesitation instantly.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-[#091a11] font-bold text-lg flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center text-xs">3</span>
              Enable Instant, Frictionless Booking Inquiries
            </h3>
            <p>
              Travelers lose interest if they have to wait 24 hours for an email response. Providing direct inquiry tools, such as WhatsApp redirects or automated calendar booking, satisfies the traveler's demand for instant confirmation.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-[#091a11] font-bold text-lg flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center text-xs">4</span>
              Create Dedicated Packages for 'Workations' & 'Staycations'
            </h3>
            <p>
              With remote work models staying popular, position your resort as a destination for digital nomads. Offer high-speed Wi-Fi, a quiet work corner, and unlimited tea/coffee packages for mid-week stays to drive booking volume when leisure travel is low.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-[#091a11] font-bold text-lg flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center text-xs">5</span>
              Partner with Niche Local Discovery Networks
            </h3>
            <p>
              Instead of getting lost on global websites, list your property on dedicated tourism networks like StaySearch. Niche platforms attract high-intent customers who are specifically looking to explore Maharashtra, ensuring higher booking conversion rates.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'boutique-vs-giant-otas',
      title: 'Why Boutique Stays Beat Giant OTAs: The Power of Niche Booking Networks',
      author: 'Swati P.',
      role: 'Head of Partner Relations, StaySearch',
      date: 'June 10, 2026',
      category: 'Distribution Strategy',
      readTime: '6 min read',
      excerpt: 'Giant booking platforms charge up to 25% commissions and hide your unique brand personality. Learn how niche booking platforms built specifically for Maharashtra tourism can increase your profit margins and help you build direct customer relationships.',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
      content: (
        <div className="space-y-6 text-[#091a11]/80 leading-relaxed text-sm md:text-base">
          <p className="font-semibold text-[#091a11] text-lg">
            For years, giant online travel agencies (OTAs) have held a monopoly on guest acquisition. However, resort and homestay owners are increasingly realizing that this convenience comes at a steep price.
          </p>

          <p>
            Here is why partnering with niche local booking networks like StaySearch yields better long-term profits and growth for your resort:
          </p>

          <div className="space-y-3">
            <h4 className="text-[#091a11] font-bold">1. Say Goodbye to 20-25% Commission Rates</h4>
            <p>
              Global booking portals take a massive chunk of your hard-earned revenue in commission fees. Niche networks focus on affordable listing options, subscription packages, or ultra-low commissions. This means you keep more profit from every single stay.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[#091a11] font-bold">2. Your Brand Remains Yours</h4>
            <p>
              On massive global portals, your resort is just a code and a template. Guests book "a room in Alibaug" rather than booking *your resort*. Niche platforms emphasize storytelling, allowing you to highlight your local history, organic farms, and custom hospitality, helping you build a recognizable brand.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[#091a11] font-bold">3. Access to High-Intent Regional Audiences</h4>
            <p>
              People browsing a Maharashtra-centric portal are already sold on the state's beauty. They aren't looking at cheap transit hotels in Mumbai; they want beautiful coastal getaways in Kelva, historical villas in Wada, or cool hill stations in Jawhar. You get highly pre-qualified leads.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[#091a11] font-bold">4. Build Direct Guest Loyalty</h4>
            <p>
              Giant portals hide guest details, preventing you from contacting them directly. Niche local platforms foster direct connection, enabling you to build customer lists, run email updates, and welcome repeat guests year after year without paying booking fees twice.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'weekend-vs-weekday-occupancy',
      title: 'Weekend vs. Weekday Occupancy: How to Fill Your Resort Monday to Friday',
      author: 'Ankur S.',
      role: 'Revenue Manager',
      date: 'June 08, 2026',
      category: 'Operations & Pricing',
      readTime: '4 min read',
      excerpt: 'Every resort owner knows the weekend rush, but empty weekdays are silent margin killers. Discover how target packages for corporate off-sites, wellness retreats, and digital nomads can turn your weekdays into profit-generating machines.',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&auto=format&fit=crop',
      content: (
        <div className="space-y-6 text-[#091a11]/80 leading-relaxed text-sm md:text-base">
          <p className="font-semibold text-[#091a11] text-lg">
            It’s Friday afternoon, and your resort is buzzing. Guests are arriving, the kitchen is busy, and your rooms are fully booked. But by Sunday noon, the resort empties out. From Monday to Thursday, your staff stands idle, while fixed utility costs keep running.
          </p>

          <p>
            If you want to run a highly profitable resort business, you must tackle weekday vacancy. Here is how to fill your rooms from Monday to Friday:
          </p>

          <div className="space-y-4">
            <h4 className="text-[#091a11] font-bold text-base">1. Market to Corporate Teams and Masterclasses</h4>
            <p>
              Corporates in Mumbai and Pune are constantly searching for off-site locations to host leadership retreats, team-building sessions, or brainstorming masterclasses. Create mid-week corporate packages that bundle meeting spaces, high-speed internet, projector setups, and team meals.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-[#091a11] font-bold text-base">2. Position as a Wellness and Creative Retreat</h4>
            <p>
              Partner with local yoga instructors, wellness guides, painting teachers, or writers' communities. Weekdays are the perfect time to run 3-day wellness camps, photography workshops, or pottery retreats which appeal to freelancers, retirees, and creators who avoid weekend crowds.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-[#091a11] font-bold text-base">3. Implement Value-Added Weekday Perks</h4>
            <p>
              Instead of dropping your prices drastically (which dilutes your brand value), add value. Offer complimentary breakfast, free spa vouchers, local cooking classes, or late checkout options for weekday bookers. It makes the guest feel they are getting an premium deal without cutting your margins.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-[#091a11] font-bold text-base">4. Target Retired Couples and Long-Stay Slow Travelers</h4>
            <p>
              Older couples and retired professionals prefer the peace and quiet of weekdays over noisy weekend rushes. Create tailored packages focusing on organic, home-cooked food, quiet walks, and guided bird-watching tours to capture this premium demographic.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="pt-24 min-h-screen relative overflow-hidden pb-20 bg-[#f4f7f5]">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FF4E00]/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF4E00]/15 text-[#FF4E00] rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-[#FF4E00]/25">
            <Sparkles className="w-3.5 h-3.5" /> Resort Owner Resources & Insights
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#091a11] mb-6 leading-tight">
            Grow Your Resort Business In <span className="text-[#FF4E00]">Maharashtra</span>
          </h1>
          <p className="text-[#091a11]/60 text-sm md:text-base font-light leading-relaxed">
            Discover tactical advice, marketing guides, and industry news curated by hospitality specialists to help resort, villa, and farmhouse owners scale occupancy and boost profits.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {blogs.map((blog) => (
            <div 
              key={blog.id} 
              className="group bg-white border border-[#091a11]/10 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer"
              onClick={() => setSelectedBlog(blog)}
            >
              {/* Cover Image */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-40" />
                <span className="absolute top-4 left-4 bg-[#FF4E00] text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg">
                  {blog.category}
                </span>
              </div>

              {/* Text Info */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-[#091a11]/50 text-[10px] uppercase font-bold tracking-widest">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#FF4E00]" /> {blog.date}</span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#091a11] leading-snug group-hover:text-[#FF4E00] transition-colors line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-[#091a11]/60 text-xs md:text-sm font-light leading-relaxed line-clamp-3">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#091a11]/10 mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#FF4E00]/20 flex items-center justify-center text-[10px] font-bold text-[#091a11] border border-[#FF4E00]/30 uppercase">
                      {blog.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#091a11]">{blog.author}</p>
                      <p className="text-[8px] text-[#091a11]/50 uppercase font-medium">{blog.role.split(',')[0]}</p>
                    </div>
                  </div>

                  <span className="text-[#FF4E00] text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read Article <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lead Capture Banner for Resort Owners */}
        <div className="relative bg-white border border-[#091a11]/15 rounded-3xl p-8 md:p-12 overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#FF4E00]/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-green-500/5 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/15 text-green-700 rounded-full text-[9px] font-bold uppercase tracking-wider border border-green-500/25">
                <Building className="w-3 h-3" /> Partner Program
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-[#091a11] leading-tight">
                Own a Resort, Villa, or Farmhouse in Maharashtra?
              </h2>
              <p className="text-[#091a11]/60 text-sm md:text-base font-light leading-relaxed">
                Connect directly with thousands of premium tourists from Mumbai and Pune. List your property on StaySearch, bypass hefty 20% OTA commissions, and receive direct inquiries directly to your booking desk.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'Commission-free bookings',
                  'Direct guest contact details',
                  'Vetted family-focused travelers',
                  'Free local marketing assistance'
                ].map((perk, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#091a11]/80">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#f4f7f5] border border-[#091a11]/10 rounded-2xl p-6 md:p-8 space-y-4 shadow-md">
              <p className="text-sm font-bold text-[#091a11] uppercase tracking-wider text-center">List Your Resort Today</p>
              <p className="text-[10px] text-[#091a11]/50 text-center">Get started in under 5 minutes with our easy dashboard</p>
              
              <div className="space-y-3 pt-2">
                <a 
                  href="/admin" 
                  className="block w-full py-3.5 bg-[#FF4E00] hover:bg-orange-600 text-white rounded-xl text-center font-bold uppercase tracking-wider text-xs shadow-lg shadow-orange-500/25 transition-all"
                >
                  Go to Partner Admin Panel
                </a>
                <a 
                  href="https://wa.me/919876543210" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3.5 bg-transparent hover:bg-[#091a11]/5 border border-[#091a11]/20 text-[#091a11] rounded-xl text-center font-bold uppercase tracking-wider text-xs transition-all"
                >
                  Chat with Partner Support
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Immersive Modal to read the full article */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md">
          <div 
            className="bg-[#f4f7f5] border border-[#091a11]/15 w-full max-w-4xl h-full max-h-full sm:h-auto sm:max-h-[90vh] rounded-none sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header/Image banner */}
            <div className="relative h-48 sm:h-64 md:h-80 flex-shrink-0">
              <img 
                src={selectedBlog.image} 
                alt={selectedBlog.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#f4f7f5] via-[#f4f7f5]/55 to-transparent z-10" />
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 bg-[#091a11]/60 hover:bg-[#091a11]/80 text-white p-2 rounded-full border border-white/15 transition-colors cursor-pointer z-30"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-20">
                <span className="bg-[#FF4E00] text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg">
                  {selectedBlog.category}
                </span>
                <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-[#091a11] mt-2 leading-tight">
                  {selectedBlog.title}
                </h2>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-5 sm:p-8 md:p-10 overflow-y-auto space-y-6 flex-1 min-h-0">
              {/* Author bio block */}
              <div className="flex items-center gap-3 pb-6 border-b border-[#091a11]/10">
                <div className="w-10 h-10 rounded-full bg-[#FF4E00]/25 flex items-center justify-center font-bold text-[#091a11] border border-[#FF4E00]/40 uppercase">
                  {selectedBlog.author.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-[#091a11]">{selectedBlog.author}</p>
                    <span className="text-[10px] px-1.5 py-0.5 bg-[#091a11]/5 rounded text-[#091a11]/50">{selectedBlog.readTime}</span>
                  </div>
                  <p className="text-[10px] text-[#091a11]/60 uppercase font-medium">{selectedBlog.role}</p>
                </div>
                <div className="ml-auto text-[10px] text-[#091a11]/40 font-bold uppercase tracking-widest flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#FF4E00]" /> {selectedBlog.date}
                </div>
              </div>

              {/* Main text content */}
              <article className="prose max-w-none text-[#091a11]">
                {selectedBlog.content}
              </article>
              
              {/* Inner call to action */}
              <div className="bg-white border border-[#FF4E00]/20 p-6 rounded-2xl space-y-3 mt-8 shadow-sm">
                <p className="font-bold text-[#091a11] text-base">Want to put these strategies into practice?</p>
                <p className="text-xs text-[#091a11]/70">
                  StaySearch helps you set custom packages, highlight your regional experiences, and start booking more guests directly with zero OTA commission deductions.
                </p>
                <a 
                  href="/admin" 
                  onClick={() => setSelectedBlog(null)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#FF4E00] hover:text-orange-400 uppercase tracking-widest"
                >
                  List your resort now <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#f4f7f5] border-t border-[#091a11]/10 flex justify-end flex-shrink-0">
              <button 
                onClick={() => setSelectedBlog(null)}
                className="px-6 py-2 bg-white hover:bg-[#091a11]/5 border border-[#091a11]/15 text-[#091a11] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
