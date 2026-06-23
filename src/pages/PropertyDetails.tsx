import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, ShieldCheck, Check, Calendar, Users, Coffee, Wifi, Wind, Car, Share, Heart, Phone, Globe, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import { propertyService, Property } from '../services/propertyService';

export default function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState<Property | null>(() => {
    if (!id) return null;
    const localProps = propertyService.getLocalPropertiesSync();
    return localProps.find(p => p.id === id || p.title.toLowerCase().replace(/\s+/g, '-') === id) || null;
  });
  const [loading, setLoading] = useState(() => {
    if (!id) return true;
    const localProps = propertyService.getLocalPropertiesSync();
    const found = localProps.find(p => p.id === id || p.title.toLowerCase().replace(/\s+/g, '-') === id);
    return !found;
  });

  React.useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        const data = await propertyService.getPropertyById(id);
        setProperty(data);
      } catch (err) {
        console.error("Failed to load property", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const { user } = useAuth();
  const { toggleFavorite, isFavorite } = useUser();
  const navigate = useNavigate();
  const propertyId = String(id || '1');
  const isFav = isFavorite(propertyId);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const index = Math.round(container.scrollLeft / container.clientWidth);
    setActiveImageIndex(index);
  };

  const handleWhatsAppBooking = () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates to inquire via WhatsApp");
      return;
    }
    
    if (!property) return;
    const message = `Hello! I found your resort *${property.title}* on *StaySearch* and would like to inquire about a stay.\n\n*Booking Details:*\n- Check-in: ${checkIn}\n- Check-out: ${checkOut}\n- Guests: ${guests}\n\nPlease confirm availability! (Lead via StaySearch)`;
    
    const getWhatsAppNumber = (num?: string) => {
      if (!num) return "919987091858";
      const cleaned = num.replace(/[^0-9]/g, '');
      if (cleaned.length === 10) return "91" + cleaned;
      return cleaned;
    };
    
    const ownerPhoneNumber = getWhatsAppNumber(property?.contactNumber); 
    
    const whatsappUrl = `https://wa.me/${ownerPhoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSave = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!property) return;
    toggleFavorite({
      id: propertyId,
      name: property.title,
      location: property.location,
      price: property.price,
      image: property.images?.[0] || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop',
      type: property.type || 'Resort',
      rating: property.rating || 4.5
    });
  };

  const displayImages = property?.images && property.images.length > 0 
    ? property.images 
    : [
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1584132967334-10e028b03046?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1540541338272-34b95baf892a?q=80&w=800&auto=format&fit=crop'
      ];

  return (
    <div className="pt-20 md:pt-28 min-h-screen relative overflow-hidden pb-24 md:pb-16 bg-[#f4f7f5]">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {loading ? (
          <div className="flex justify-center items-center py-40">
            <div className="text-emerald-950/50 text-xl font-bold uppercase tracking-widest">Loading property...</div>
          </div>
        ) : !property ? (
          <div className="flex flex-col justify-center items-center py-40 space-y-6">
            <div className="text-emerald-950/50 text-xl font-bold uppercase tracking-widest">Property Not Found</div>
            <Link to="/search" className="bg-[#FF4E00] hover:bg-orange-600 px-6 py-3 rounded-full text-white font-bold uppercase tracking-widest text-xs transition-colors shadow-lg">Back to Stays</Link>
          </div>
        ) : (
          <>
            {/* Breadcrumb & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 py-4 px-6 bg-white rounded-2xl border border-emerald-950/10 mt-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-950/50">
                <Link to="/" className="hover:text-[#FF4E00] transition-colors">Home</Link>
                <span>/</span>
                <Link to="/search?dest=kelva" className="hover:text-[#FF4E00] transition-colors">kelva Beach</Link>
                <span>/</span>
                <span className="text-emerald-950/90 truncate max-w-[150px] sm:max-w-none">{property.title}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t border-emerald-950/5 pt-3 md:pt-0 md:border-t-0">
                <Link to="/search" className="flex items-center justify-center gap-2 text-orange-600 hover:text-orange-500 transition-colors text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20 w-full sm:w-auto text-center">
                  Explore More Stays
                </Link>
                <div className="flex items-center justify-center gap-6 w-full sm:w-auto">
                  <button className="flex items-center gap-2 text-emerald-950/70 hover:text-emerald-950 transition-colors text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    <Share className="w-4 h-4" /> Share
                  </button>
                  <button onClick={handleSave} className={`flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors ${isFav ? 'text-red-500' : 'text-emerald-950/70 hover:text-red-400'}`}>
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500' : ''}`} /> {isFav ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            </div>

            {/* Title Section */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                {property.isVerified !== false && (
                  <span className="bg-green-500/10 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-green-500/20">
                    <ShieldCheck className="w-3 h-3" /> Verified Stay
                  </span>
                )}
                <span className="bg-orange-500/10 text-[#FF4E00] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#FF4E00]/20">
                  {property.type || 'Resort'}
                </span>
                {property.isFeatured && (
                  <span className="bg-amber-500/10 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
                    ★ Premium Choice
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-emerald-950 mb-4 leading-tight">{property.title}</h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm font-bold text-emerald-950/80">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{property.rating || '4.5'}</span>
                  <span className="text-emerald-950/40 underline cursor-pointer hover:text-emerald-950/70 font-medium ml-1">({Math.floor(Math.random() * 100) + 20} reviews)</span>
                </div>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-emerald-950/20" />
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#FF4E00]" />
                  <span className="underline cursor-pointer hover:text-emerald-950/90">{property.location}</span>
                </div>
              </div>
            </div>

            {/* Mobile Image Slider */}
            <div className="md:hidden relative w-full mb-8">
              <div 
                id="mobile-image-slider"
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none h-[40vh] gap-3 rounded-3xl"
                style={{
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                }}
              >
                {displayImages.map((img, idx) => (
                  <div key={idx} className="min-w-full h-full snap-start relative flex-shrink-0 rounded-3xl overflow-hidden border border-emerald-950/10 shadow-md">
                    <img src={img} alt={`${property.title} - ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                ))}
              </div>
              
              {/* Dot Indicators */}
              {displayImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-950/10 shadow-sm">
                  {displayImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const container = document.getElementById('mobile-image-slider');
                        if (container) {
                          container.scrollTo({
                            left: container.clientWidth * idx,
                            behavior: 'smooth'
                          });
                        }
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${activeImageIndex === idx ? 'bg-[#FF4E00] w-3' : 'bg-emerald-950/25 w-1.5'}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Arrow Buttons */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      const container = document.getElementById('mobile-image-slider');
                      if (container) {
                        const nextIndex = Math.max(0, activeImageIndex - 1);
                        container.scrollTo({
                          left: container.clientWidth * nextIndex,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    disabled={activeImageIndex === 0}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-emerald-950/10 flex items-center justify-center text-emerald-950 transition-opacity ${activeImageIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const container = document.getElementById('mobile-image-slider');
                      if (container) {
                        const nextIndex = Math.min(displayImages.length - 1, activeImageIndex + 1);
                        container.scrollTo({
                          left: container.clientWidth * nextIndex,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    disabled={activeImageIndex === displayImages.length - 1}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-emerald-950/10 flex items-center justify-center text-emerald-950 transition-opacity ${activeImageIndex === displayImages.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Desktop Image Gallery */}
            <div className="hidden md:grid md:grid-cols-4 gap-4 mb-12 h-[60vh]">
              <div className="md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden relative group border border-emerald-950/10 shadow-md">
                <img src={property.images?.[0] || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop'} alt="Main" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/30 to-transparent pointer-events-none" />
              </div>
              <div className="rounded-3xl overflow-hidden relative group hidden md:block border border-emerald-950/10 shadow-md">
                <img src={property.images?.[1] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop'} alt="Gallery 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="rounded-3xl overflow-hidden relative group hidden md:block border border-emerald-950/10 shadow-md">
                <img src={property.images?.[2] || 'https://images.unsplash.com/photo-1584132967334-10e028b03046?q=80&w=800&auto=format&fit=crop'} alt="Gallery 2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="md:col-span-2 rounded-3xl overflow-hidden relative group hidden md:block border border-emerald-950/10 shadow-md">
                <img src={property.images?.[3] || 'https://images.unsplash.com/photo-1540541338272-34b95baf892a?q=80&w=800&auto=format&fit=crop'} alt="Gallery 3" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center bg-emerald-950/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <button className="bg-white/20 text-white border border-white/30 px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white/30 transition-colors shadow-lg">
                    View all photos
                  </button>
                </div>
              </div>
            </div>

            {/* Content Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

              {/* Left Column - Details */}
              <div className="lg:col-span-2 space-y-12">

                {/* Description */}
                <section className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-950/10 shadow-md">
                  <h2 className="text-2xl font-bold tracking-tight text-emerald-950 mb-6">About this property</h2>
                  <p className="text-emerald-950/70 leading-relaxed text-lg font-light mb-8">
                    {property.description}
                  </p>

                  {/* 4 Small Option Boxes */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-emerald-950/10">
                    {/* Box 1: Contact Number */}
                    <a 
                      href={`https://wa.me/${property.contactNumber ? (property.contactNumber.replace(/[^0-9]/g, '').length === 10 ? '91' + property.contactNumber.replace(/[^0-9]/g, '') : property.contactNumber.replace(/[^0-9]/g, '')) : '919987091858'}?text=${encodeURIComponent(`Hello! I found your contact on StaySearch regarding *${property.title}*.`)}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex flex-col items-center justify-center p-4 bg-[#f4f7f5]/55 border border-emerald-950/10 hover:border-[#FF4E00]/40 rounded-2xl hover:bg-emerald-50/70 transition-all text-center group"
                    >
                      <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Phone className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-950/50 uppercase tracking-widest">Contact Number</span>
                      <span className="text-xs text-emerald-950 mt-1 font-semibold truncate max-w-full">{property.contactNumber || 'Not Available'}</span>
                    </a>

                    {/* Box 2: Website Link */}
                    <a 
                      href={property.websiteLink ? (property.websiteLink.startsWith('http') ? property.websiteLink : `https://${property.websiteLink}`) : '#'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={e => { if (!property.websiteLink) e.preventDefault(); }}
                      className={`flex flex-col items-center justify-center p-4 bg-[#f4f7f5]/55 border border-emerald-950/10 hover:border-[#FF4E00]/40 rounded-2xl hover:bg-emerald-50/70 transition-all text-center group ${!property.websiteLink ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Globe className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-950/50 uppercase tracking-widest">Website Link</span>
                      <span className="text-xs text-emerald-950 mt-1 font-semibold truncate max-w-full">{property.websiteLink ? 'Visit Website' : 'Not Available'}</span>
                    </a>

                    {/* Box 3: GMB Profile */}
                    <a 
                      href={property.googleMyBusiness ? (property.googleMyBusiness.startsWith('http') ? property.googleMyBusiness : `https://${property.googleMyBusiness}`) : '#'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={e => { if (!property.googleMyBusiness) e.preventDefault(); }}
                      className={`flex flex-col items-center justify-center p-4 bg-[#f4f7f5]/55 border border-emerald-950/10 hover:border-[#FF4E00]/40 rounded-2xl hover:bg-emerald-50/70 transition-all text-center group ${!property.googleMyBusiness ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <MapPin className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-950/50 uppercase tracking-widest">GMB Profile</span>
                      <span className="text-xs text-emerald-950 mt-1 font-semibold truncate max-w-full">{property.googleMyBusiness ? 'Recent Reviews' : 'Not Available'}</span>
                    </a>

                    {/* Box 4: Instagram Profile */}
                    <a 
                      href={property.instagramProfile ? (property.instagramProfile.startsWith('http') ? property.instagramProfile : `https://instagram.com/${property.instagramProfile.replace('@', '')}`) : '#'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={e => { if (!property.instagramProfile) e.preventDefault(); }}
                      className={`flex flex-col items-center justify-center p-4 bg-[#f4f7f5]/55 border border-emerald-950/10 hover:border-[#FF4E00]/40 rounded-2xl hover:bg-emerald-50/70 transition-all text-center group ${!property.instagramProfile ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Instagram className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-950/50 uppercase tracking-widest">Instagram</span>
                      <span className="text-xs text-emerald-950 mt-1 font-semibold truncate max-w-full">{property.instagramProfile ? 'View Profile' : 'Not Available'}</span>
                    </a>
                  </div>
                </section>

                {/* Amenities */}
                <section className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-950/10 shadow-md">
                  <h2 className="text-2xl font-bold tracking-tight text-emerald-950 mb-8">What this place offers</h2>
                  <div className="grid grid-cols-2 gap-y-4 sm:gap-y-6 gap-x-4 sm:gap-x-8">
                    {(property.amenities || []).map(amenity => (
                      <div key={amenity} className="flex items-center gap-3 sm:gap-4 text-emerald-950/80 font-medium text-sm sm:text-base">
                        <div className="p-2 bg-[#f4f7f5]/80 rounded-xl border border-emerald-950/10 flex-shrink-0">
                          {/* Simplified icon selection based on amenity name */}
                          {amenity.includes('WiFi') ? <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" /> :
                            amenity.includes('Air') ? <Wind className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" /> :
                              amenity.includes('Parking') ? <Car className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" /> :
                                amenity.includes('Restaurant') ? <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" /> :
                                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />}
                        </div>
                        {amenity}
                      </div>
                    ))}
                  </div>
                  <button className="mt-10 border border-emerald-950/20 text-emerald-950 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#f4f7f5] transition-colors shadow-md w-full sm:w-auto">
                    Show all 24 amenities
                  </button>
                </section>

                {/* Resort Policy & Specifications */}
                <section className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-950/10 shadow-md">
                  <h2 className="text-2xl font-bold tracking-tight text-emerald-950 mb-6">Resort Policy & Specifications</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 border-b border-emerald-950/10 pb-6">
                    <div>
                      <p className="text-emerald-950/40 text-[10px] font-bold uppercase tracking-widest mb-1">Max Capacity</p>
                      <p className="text-emerald-950 font-bold text-base sm:text-lg">{property.maxGuests || 4} Guests</p>
                    </div>
                    <div>
                      <p className="text-emerald-950/40 text-[10px] font-bold uppercase tracking-widest mb-1">Rooms & Baths</p>
                      <p className="text-emerald-950 font-bold text-base sm:text-lg">
                        {property.bedrooms || 2} BR / {property.bathrooms || 2} BA
                      </p>
                    </div>
                    <div>
                      <p className="text-emerald-950/40 text-[10px] font-bold uppercase tracking-widest mb-1">Timings</p>
                      <p className="text-emerald-950 font-bold text-xs sm:text-sm">
                        In: {property.checkInTime || '12:00 PM'}<br/>
                        Out: {property.checkOutTime || '10:00 AM'}
                      </p>
                    </div>
                    <div>
                      <p className="text-emerald-950/40 text-[10px] font-bold uppercase tracking-widest mb-1">Food Options</p>
                      <p className="text-emerald-950 font-bold text-base sm:text-lg">
                        {property.foodType === 'Veg' ? 'Veg Only' : property.foodType === 'Non-Veg' ? 'Non-Veg Only' : 'Veg & Non-Veg'}
                      </p>
                    </div>
                  </div>

                  {property.rules && property.rules.length > 0 ? (
                    <div>
                      <h3 className="text-emerald-950 font-bold text-sm uppercase tracking-wider mb-4">House Rules & Guidelines</h3>
                      <ul className="space-y-2">
                        {property.rules.map((rule, idx) => (
                          <li key={idx} className="text-emerald-950/70 text-sm flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-emerald-950 font-bold text-sm uppercase tracking-wider mb-4">House Rules & Guidelines</h3>
                      <ul className="space-y-2 text-emerald-950/50 text-sm">
                        <li className="flex items-start gap-2">Standard check-in guidelines apply. Proper ID proof required during check-in.</li>
                        <li className="flex items-start gap-2">Couples and families are welcome. Respect local neighborhood policies.</li>
                      </ul>
                    </div>
                  )}
                </section>

                {/* Location (Map Placeholder) */}
                <section className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-950/10 shadow-md">
                  <h2 className="text-2xl font-bold tracking-tight text-emerald-950 mb-6">Where you'll be</h2>
                  <div className="bg-[#f4f7f5] h-64 sm:h-96 w-full rounded-2xl flex items-center justify-center relative overflow-hidden group border border-emerald-950/10">
                    {/* Decorative mock map */}
                    <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop" alt="Map Location" className="w-full h-full object-cover opacity-60 mix-blend-luminosity" />
                    <div className="absolute inset-0 bg-[#FF4E00]/5 mix-blend-multiply" />
                    <div className="absolute p-3 sm:p-4 bg-white/80 backdrop-blur-xl border border-emerald-950/10 shadow-2xl rounded-2xl flex items-center gap-3 sm:gap-4 max-w-[90%] sm:max-w-none">
                      <div className="bg-[#FF4E00] p-2.5 sm:p-3 rounded-xl shadow-lg shadow-[#FF4E00]/30 flex-shrink-0">
                        <MapPin className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-emerald-950 text-sm sm:text-lg truncate max-w-[180px] sm:max-w-none">{property.title}</p>
                        <p className="text-[10px] text-emerald-950/50 uppercase tracking-widest font-bold mt-0.5 sm:mt-1">{property.location}</p>
                      </div>
                    </div>
                  </div>
                  {property.mapsUrl && (
                    <div className="mt-4 flex justify-end">
                      <a 
                        href={property.mapsUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF4E00] hover:text-[#FF4E00]/80 transition-colors"
                      >
                        Open in Google Maps &rarr;
                      </a>
                    </div>
                  )}
                </section>

              </div>

              {/* Right Column - Inquiry Widget */}
              <div id="inquiry-widget" className="lg:col-span-1 relative">
                <div className="sticky top-32 bg-white rounded-3xl shadow-[0_8px_30px_rgba(9,26,17,0.08)] border border-emerald-950/10 p-6 sm:p-8">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-emerald-950">Inquire Stay</h3>
                      <div className="flex items-center gap-1 text-sm font-bold text-emerald-950/90">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        {property.rating || '4.5'}
                      </div>
                    </div>
                    
                    {/* Price & Package Includes */}
                    <div className="mt-2 bg-[#f4f7f5] border border-emerald-950/10 rounded-2xl p-4">
                      <p className="text-[10px] font-bold text-emerald-950/40 uppercase tracking-widest mb-1">Standard Pricing</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-emerald-950">₹{property.price}</span>
                        <span className="text-xs text-emerald-950/50 font-bold">
                          {property.type?.toLowerCase() === 'villa' ? 'per night' : 'Per Person'}
                        </span>
                      </div>
                      
                      {/* Package Includes Info */}
                      <div className="mt-3 pt-3 border-t border-emerald-950/5 space-y-2">
                        <p className="text-[9px] font-bold text-orange-600 uppercase tracking-wider mb-1">Package Includes:</p>
                        {property.type?.toLowerCase() === 'villa' ? (
                          <>
                            <div className="flex items-center gap-2 text-xs text-emerald-950/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                              <span>Stay</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-emerald-950/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                              <span>Indoor/ Outdoor Activities</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 text-xs text-emerald-950/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                              <span>Stay</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-emerald-950/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                              <span>All Meal Plan</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-emerald-950/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                              <span>Indoor/ Outdoor Activities</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Form elements */}
                  <div className="border border-emerald-950/15 rounded-2xl overflow-hidden mb-8 bg-[#f4f7f5]/40">
                    <div className="flex border-b border-emerald-950/15">
                      <div className="w-1/2 p-4 border-r border-emerald-950/15">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#FF4E00] block mb-2">Check-in</label>
                        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full outline-none text-sm bg-transparent text-emerald-950 focus:text-[#FF4E00]" style={{ colorScheme: 'light' }} />
                      </div>
                      <div className="w-1/2 p-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#FF4E00] block mb-2">Check-out</label>
                        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full outline-none text-sm bg-transparent text-emerald-950 focus:text-[#FF4E00]" style={{ colorScheme: 'light' }} />
                      </div>
                    </div>
                    <div className="p-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#FF4E00] block mb-2">Guests</label>
                      <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full outline-none text-sm bg-transparent text-emerald-950 border-none focus:ring-0 cursor-pointer">
                        {Array.from({ length: Math.max(property.maxGuests || 10, 20) }, (_, i) => i + 1).map((num) => (
                          <option key={num} value={num} className="bg-white text-emerald-950">
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <button onClick={handleWhatsAppBooking} className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-[0_0_20px_rgba(37,211,102,0.15)] hover:shadow-[0_0_30px_rgba(37,211,102,0.3)] flex items-center justify-center gap-2 border border-[#25D366]/50">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      Inquire via WhatsApp
                    </button>
                  </div>

                  <p className="text-center text-xs font-medium text-emerald-950/50 leading-relaxed">
                    Connect directly with the resort host via WhatsApp to confirm details, availability and booking.
                  </p>
                </div>
              </div>

            </div>
          </>
        )}
      </div>

      {/* Mobile Sticky Booking Bar */}
      {property && !loading && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-emerald-950/10 p-4 z-50 flex items-center justify-between md:hidden shadow-[0_-10px_30px_rgba(9,26,17,0.08)]">
          <div>
            <p className="text-emerald-950/40 text-[10px] font-bold uppercase tracking-widest">Starting from</p>
            <p className="text-emerald-950 font-bold text-lg">
              ₹{property.price}{' '}
              <span className="text-xs text-emerald-950/50 font-normal">
                {property.type?.toLowerCase() === 'villa' ? 'per night' : 'Per Person'}
              </span>
            </p>
          </div>
          <button 
            onClick={() => {
              const widget = document.getElementById('inquiry-widget');
              if (widget) {
                widget.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="bg-[#25D366] hover:bg-[#25D366]/90 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-[0_0_15px_rgba(37,211,102,0.15)] flex items-center gap-2"
          >
            <Phone className="w-4 h-4" /> Inquire Now
          </button>
        </div>
      )}
    </div>
  );
}
