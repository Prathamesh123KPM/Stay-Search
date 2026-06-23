import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Check, X, GitCompare, Plus, Phone, Eye } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { propertyService, Property } from '../services/propertyService';

export default function CompareResorts() {
  const { compareList, toggleCompare, isComparing, clearCompare } = useUser();

  // Recommendations to quickly compare if list is empty
  const [recommendations] = React.useState<Property[]>(() => {
    const data = propertyService.getLocalPropertiesSync();
    return data.slice(0, 3);
  });

  const handleRemove = (stay: Property) => {
    toggleCompare(stay);
  };

  const getWhatsAppLink = (item: Property) => {
    const message = `Hello! I want to inquire about *${item.title}* via *StaySearch* comparison console. Please check availability.`;
    const num = item.contactNumber || '919987091858';
    const cleaned = num.replace(/[^0-9]/g, '');
    const phone = cleaned.length === 10 ? '91' + cleaned : cleaned;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="pt-28 min-h-screen relative overflow-hidden pb-24 bg-[#fafafa] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-10 text-left">
          <div className="inline-flex items-center gap-2 py-1.5 px-3.5 bg-rose-50 border border-rose-100 rounded-full mb-4">
            <GitCompare className="w-4 h-4 text-[#FF385C]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF385C]">Compare Console</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#222222]">Compare Resorts & Prices</h1>
          <p className="text-gray-500 text-sm mt-1 max-w-2xl">
            Analyze resort specifications, capacity, pricing packages, and check-in options side-by-side to make the best booking choice.
          </p>
        </div>

        {compareList.length > 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 overflow-x-auto">
            {/* Table layout / Side by side grid */}
            <div className="min-w-[800px] grid grid-cols-4 gap-6">
              
              {/* Columns Header Names */}
              <div className="flex flex-col gap-6 pt-48 font-bold text-xs text-gray-400 uppercase tracking-widest border-r border-gray-100 pr-4">
                <div className="h-10 flex items-center">Price per night</div>
                <div className="h-10 flex items-center">Property Type</div>
                <div className="h-10 flex items-center">Star Rating</div>
                <div className="h-10 flex items-center">Capacity limit</div>
                <div className="h-10 flex items-center">BR / BA Configuration</div>
                <div className="h-10 flex items-center">Swimming Pool</div>
                <div className="h-10 flex items-center">Included Food</div>
                <div className="h-28 flex items-start pt-2">Key Amenities</div>
                <div className="h-28 flex items-end justify-start">Actions</div>
              </div>

              {/* Compared properties */}
              {compareList.slice(0, 3).map((item) => {
                const hasPool = item.amenities.some(a => a.toLowerCase().includes('pool'));
                
                return (
                  <div key={item.id} className="flex flex-col gap-6 p-4 rounded-2xl border border-gray-200 hover:border-[#FF385C]/30 transition-all bg-[#fafafa]/45 relative group text-center">
                    
                    {/* Remove button */}
                    <button
                      onClick={() => handleRemove(item)}
                      className="absolute top-2.5 right-2.5 p-1 bg-white border border-gray-200 shadow-sm hover:border-red-200 text-gray-400 hover:text-red-500 rounded-full transition-colors z-10 cursor-pointer"
                      title="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Property Thumbnail */}
                    <div className="h-36 rounded-xl overflow-hidden relative border border-gray-200 bg-gray-100">
                      <img 
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1540541338272-34b95baf892a?q=80&w=600&auto=format&fit=crop'} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                      <div className="absolute bottom-2.5 left-3 right-3 text-left">
                        <span className="text-[9px] font-black text-rose-300 uppercase tracking-widest block mb-0.5">{item.type || 'Resort'}</span>
                        <h4 className="font-extrabold text-white text-xs leading-tight truncate">{item.title}</h4>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="h-10 flex items-center justify-center">
                      <span className="font-black text-[#222222] text-lg">₹{item.price.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-gray-400 font-bold ml-0.5">/ night</span>
                    </div>

                    {/* Type */}
                    <div className="h-10 flex items-center justify-center text-xs font-bold text-gray-700 uppercase">
                      {item.type || 'Resort'}
                    </div>

                    {/* Star Rating */}
                    <div className="h-10 flex items-center justify-center gap-1 text-xs font-bold text-gray-800">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>{(item.rating || 4.5).toFixed(2).replace('.00', '')}</span>
                    </div>

                    {/* Capacity */}
                    <div className="h-10 flex items-center justify-center text-xs font-bold text-gray-700">
                      {item.maxGuests || 4} Guests Max
                    </div>

                    {/* Bed / Bath */}
                    <div className="h-10 flex items-center justify-center text-xs font-bold text-gray-700">
                      {item.bedrooms || 2} Bedrooms / {item.bathrooms || 2} Bathrooms
                    </div>

                    {/* Swimming Pool */}
                    <div className="h-10 flex items-center justify-center">
                      {hasPool ? (
                        <Check className="w-5 h-5 text-green-600 font-black" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                    </div>

                    {/* Food Options */}
                    <div className="h-10 flex items-center justify-center text-xs font-bold text-gray-700">
                      {item.foodType || 'Veg & Non-Veg'}
                    </div>

                    {/* Key Amenities list */}
                    <div className="h-28 overflow-y-auto text-left text-[10px] text-gray-600 space-y-1 bg-white border border-gray-100 p-2.5 rounded-xl">
                      {item.amenities.slice(0, 4).map((a) => (
                        <div key={a} className="flex items-center gap-1 truncate">
                          <Check className="w-3 h-3 text-[#FF385C] shrink-0" />
                          <span className="truncate">{a}</span>
                        </div>
                      ))}
                      {item.amenities.length > 4 && (
                        <span className="text-[9px] text-[#FF385C] font-extrabold uppercase mt-1 block">
                          +{item.amenities.length - 4} More
                        </span>
                      )}
                    </div>

                    {/* Actions column cell */}
                    <div className="h-28 flex flex-col gap-2 justify-end">
                      <a
                        href={getWhatsAppLink(item)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-sm"
                      >
                        <Phone className="w-3 h-3" />
                        <span>WhatsApp Inquire</span>
                      </a>
                      
                      <Link
                        to={`/property/${item.id}`}
                        className="w-full py-2 bg-[#FF385C] hover:bg-[#E61E4D] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-sm"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Details</span>
                      </Link>
                    </div>

                  </div>
                );
              })}

              {/* Placeholders for remaining slots */}
              {Array.from({ length: Math.max(0, 3 - compareList.length) }).map((_, i) => (
                <div key={i} className="flex flex-col items-center justify-center border border-dashed border-gray-300 p-6 rounded-2xl h-full min-h-[500px] bg-gray-50/50">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 mb-2">
                    <Plus className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Add Stay to Compare</p>
                  <Link to="/search" className="text-[9px] font-black text-[#FF385C] hover:underline uppercase mt-1.5">
                    Browse Stays
                  </Link>
                </div>
              ))}

            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="max-w-xl mx-auto py-16 text-center bg-white rounded-3xl border border-gray-200 shadow-sm p-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-[#FF385C] mb-6">
              <GitCompare className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-bold text-[#222222] mb-2">Your Compare List is Empty</h3>
            <p className="text-gray-500 text-xs leading-relaxed max-w-sm mb-6">
              To compare pricing, capacity, reviews, and meals side-by-side, search for stays and click the **"Compare"** button on the listings you'd like to inspect.
            </p>
            
            <Link 
              to="/search" 
              className="bg-[#FF385C] hover:bg-[#E61E4D] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-rose-500/10 mb-10 cursor-pointer"
            >
              Browse Stays to Compare
            </Link>

            {/* Quick recommendation options to add */}
            <div className="w-full border-t border-gray-100 pt-8">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Quick add recommendations</h4>
              <div className="flex flex-col gap-2.5 w-full">
                {recommendations.map(stay => (
                  <div key={stay.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 p-2.5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <img src={stay.images?.[0]} alt={stay.title} className="w-9 h-9 rounded-lg object-cover border border-gray-200" />
                      <div className="text-left">
                        <span className="text-[10px] font-extrabold text-gray-800 block leading-tight">{stay.title}</span>
                        <span className="text-[9px] text-gray-400 font-medium block">{stay.location.split(',')[0]} • ₹{stay.price.toLocaleString('en-IN')}/night</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleCompare(stay)}
                      className="px-3 py-1 bg-white border border-gray-200 hover:border-[#FF385C]/30 text-gray-600 hover:text-[#FF385C] rounded-lg text-[9px] font-bold uppercase transition-all shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Compare
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
