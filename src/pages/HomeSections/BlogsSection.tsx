import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Sparkles, Building, BarChart } from 'lucide-react';

export default function BlogsSection() {
  const featuredBlogs = [
    {
      id: 'double-resort-bookings',
      title: '5 Simple Strategies to Double Your Resort Bookings in Maharashtra',
      excerpt: 'Struggling to fill your weekend calendar? Discover how optimizing direct booking channels, leveraging local SEO, and highlighting immersive regional experiences can double your resort bookings in Maharashtra without expensive ad campaigns.',
      category: 'Marketing & Bookings',
      date: 'June 12, 2026',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
      author: 'Rajesh K.'
    },
    {
      id: 'boutique-vs-giant-otas',
      title: 'Why Boutique Stays Beat Giant OTAs: The Power of Niche Booking Networks',
      excerpt: 'Giant booking platforms charge up to 25% commissions and hide your unique brand personality. Learn how niche booking platforms built specifically for Maharashtra tourism can increase your profit margins and help you build direct customer relationships.',
      category: 'Distribution Strategy',
      date: 'June 10, 2026',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
      author: 'Swati P.'
    },
    {
      id: 'weekend-vs-weekday-occupancy',
      title: 'Weekend vs. Weekday Occupancy: How to Fill Your Resort Monday to Friday',
      excerpt: 'Every resort owner knows the weekend rush, but empty weekdays are silent margin killers. Discover how target packages for corporate off-sites, wellness retreats, and digital nomads can turn your weekdays into profit-generating machines.',
      category: 'Operations & Pricing',
      date: 'June 08, 2026',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&auto=format&fit=crop',
      author: 'Ankur S.'
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#f4f7f5] to-[#e8eee9] border-t border-[#091a11]/5">
      {/* Background Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF4E00]/15 text-[#FF4E00] rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#FF4E00]/25">
              <Building className="w-3.5 h-3.5" /> Partner Resources
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#091a11] leading-tight">
              Hospitality Insights & <span className="text-[#FF4E00]">Growth Guides</span>
            </h2>
            <p className="text-[#091a11]/60 text-sm font-light leading-relaxed">
              Curated business advice, marketing hacks, and operation tips designed to help resort, farmhouse, and villa owners in Maharashtra boost bookings and scale their business.
            </p>
          </div>
          
          <Link 
            to="/blogs" 
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#091a11]/15 hover:bg-[#091a11]/5 hover:border-[#091a11]/25 text-[#091a11] rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-sm cursor-pointer hover:scale-105"
          >
            Explore All Blogs <ArrowRight className="w-4 h-4 text-orange-500" />
          </Link>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBlogs.map((blog) => (
            <Link 
              key={blog.id} 
              to="/blogs"
              className="group bg-white border border-[#091a11]/10 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col justify-between shadow-md"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-40" />
                  <span className="absolute top-4 left-4 bg-[#FF4E00] text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg">
                    {blog.category}
                  </span>
                </div>

                {/* Text Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[#091a11]/50 text-[9px] uppercase font-bold tracking-widest">
                    <span>{blog.date}</span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>
                  
                  <h3 className="text-base font-bold text-[#091a11] group-hover:text-[#FF4E00] transition-colors leading-snug line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-[#091a11]/60 text-xs font-light leading-relaxed line-clamp-3">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-0 border-t border-[#091a11]/10 mt-4 flex items-center justify-between text-[10px] uppercase font-extrabold tracking-widest text-[#FF4E00]">
                <span className="text-[#091a11]/50 font-medium">By {blog.author}</span>
                <span className="flex items-center gap-1 group-hover:gap-1.5 transition-all">
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
