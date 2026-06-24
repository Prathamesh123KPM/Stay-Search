import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Star, ShieldCheck, Heart, Search, Plus, Minus, 
  Layers, EyeOff, Navigation, X, Check, Filter, Compass, 
  GitCompare, Wifi, Wind, Car, Eye, SlidersHorizontal, Users 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../context/UserContext';
import { propertyService, Property } from '../services/propertyService';

// Map has been replaced with a Google Maps iframe embed


interface StayCardProps {
  stay: Property;
  idx: number;
  isHovered: boolean;
  compared: boolean;
  isFavorite: boolean;
  toggleCompare: (stay: Property) => void;
  toggleFavorite: (stay: any) => void;
  handleCardClick: (stay: Property, idx: number) => void;
  setHoveredCardId: (id: string | null) => void;
}

const StayCard: React.FC<StayCardProps> = ({
  stay,
  idx,
  isHovered,
  compared,
  isFavorite,
  toggleCompare,
  toggleFavorite,
  handleCardClick,
  setHoveredCardId
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const imagesList = stay.images && stay.images.length > 0
    ? stay.images
    : ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop'];

  const handleNextImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % imagesList.length);
  };

  const handlePrevImg = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  const [loadAll, setLoadAll] = useState(false);

  const hasPool = stay.amenities.some(a => a.toLowerCase().includes('pool'));
  const hasWifi = stay.amenities.some(a => a.toLowerCase().includes('wifi'));
  const hasParking = stay.amenities.some(a => a.toLowerCase().includes('parking'));
  const hasAC = stay.amenities.some(a => a.toLowerCase().includes('ac') || a.toLowerCase().includes('air conditioning'));
  const hasFood = stay.amenities.some(a => a.toLowerCase().includes('food') || a.toLowerCase().includes('restaurant') || a.toLowerCase().includes('meal') || a.toLowerCase().includes('breakfast'));
  const hasPets = stay.description.toLowerCase().includes('pet') || stay.description.toLowerCase().includes('animal');

  return (
    <div
      className={`group bg-white rounded-3xl overflow-hidden border transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md flex flex-col cursor-pointer relative ${
        isHovered ? 'border-[#FF385C]' : 'border-gray-200 hover:border-gray-300'
      }`}
      onMouseEnter={() => {
        setHoveredCardId(stay.id || null);
        setLoadAll(true);
      }}
      onTouchStart={() => setLoadAll(true)}
      onMouseLeave={() => setHoveredCardId(null)}
      onClick={() => handleCardClick(stay, idx)}
    >
      {/* Visual Card Image Slideshow */}
      <div className="relative h-48 flex-shrink-0 overflow-hidden rounded-t-3xl">
        {imagesList.map((imgUrl, i) => {
          if (i > 0 && !loadAll) return null;
          return (
            <img
              key={i}
              src={imgUrl}
              alt={`${stay.title} - ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
                activeImageIndex === i ? 'opacity-100' : 'opacity-0 pointer-events-none'
              } transition-transform duration-500 group-hover:scale-[1.02]`}
              loading={i === 0 ? "eager" : "lazy"}
            />
          );
        })}
        
        {/* Navigation Arrows */}
        {imagesList.length > 1 && (
          <>
            <button
              onClick={handlePrevImg}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 shadow hover:bg-white flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <span className="text-xs font-bold font-sans">←</span>
            </button>
            <button
              onClick={handleNextImg}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 shadow hover:bg-white flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <span className="text-xs font-bold font-sans">→</span>
            </button>
          </>
        )}

        {/* Carousel Indicators Dots */}
        {imagesList.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10 bg-black/10 px-2 py-0.5 rounded-full">
            {imagesList.map((_, i) => (
              <span 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  activeImageIndex === i ? 'bg-white scale-110' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Verified Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm border border-gray-150 text-gray-800 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-green-600 fill-green-50" />
          Verified
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite({
              id: stay.id || '',
              name: stay.title,
              location: stay.location,
              price: stay.price,
              image: imagesList[0],
              type: stay.type || 'Resort',
              rating: stay.rating || 4.5
            });
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-gray-150 flex items-center justify-center transition-colors hover:bg-white text-gray-800 shadow z-10"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'text-[#FF385C] fill-[#FF385C]' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* Description & Features */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3 text-left">
        <div>
          {/* Title & Type */}
          <div className="flex justify-between items-start gap-2 mb-1">
            <span className="text-[9px] font-extrabold text-[#FF385C] uppercase tracking-widest block bg-rose-50 px-2 py-0.5 rounded border border-rose-100/50">
              {stay.type || 'Resort'}
            </span>
            <div className="flex items-center gap-0.5 text-xs font-bold text-gray-800">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {stay.rating || '4.5'}
            </div>
          </div>

          <h3 className="font-extrabold text-base text-gray-900 leading-tight line-clamp-1 group-hover:text-[#FF385C] transition-colors">
            {stay.title}
          </h3>

          <div className="flex items-center text-gray-500 text-[10px] font-bold uppercase tracking-wider mt-1">
            <MapPin className="w-3 h-3 mr-0.5 text-[#FF385C] shrink-0" />
            <span className="truncate">{stay.location.split(',')[0]}</span>
          </div>
        </div>

        {/* KEY AMENITIES ICONS - UTILITY DRIVEN */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-3">
          {hasPool && <span className="bg-gray-50 text-gray-600 text-[9px] font-bold uppercase px-2 py-0.5 rounded border border-gray-200">🏊 Pool</span>}
          {hasAC && <span className="bg-gray-50 text-gray-600 text-[9px] font-bold uppercase px-2 py-0.5 rounded border border-gray-200">❄️ AC</span>}
          {hasWifi && <span className="bg-gray-50 text-gray-600 text-[9px] font-bold uppercase px-2 py-0.5 rounded border border-gray-200">📶 Wifi</span>}
          {hasFood && <span className="bg-gray-50 text-gray-600 text-[9px] font-bold uppercase px-2 py-0.5 rounded border border-gray-200">🍳 Food</span>}
          {hasParking && <span className="bg-gray-50 text-gray-600 text-[9px] font-bold uppercase px-2 py-0.5 rounded border border-gray-200">🚗 Park</span>}
          {hasPets && <span className="bg-gray-50 text-gray-600 text-[9px] font-bold uppercase px-2 py-0.5 rounded border border-gray-200">🐶 Pets</span>}
          <span className="bg-gray-50 text-gray-600 text-[9px] font-bold uppercase px-2 py-0.5 rounded border border-gray-200">👥 {stay.maxGuests || 4} Guests</span>
        </div>

        {/* Pricing & Compare Toggle */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1 bg-gray-50/50 -mx-4 -mb-4 px-4 py-3 rounded-b-3xl">
          {/* Compare Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleCompare(stay);
            }}
            className={`flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest py-1.5 px-3 rounded-full border transition-all cursor-pointer ${
              compared 
                ? 'bg-[#FF385C] text-white border-[#FF385C]' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-rose-50/30 hover:text-[#FF385C] hover:border-[#FF385C]/30'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{compared ? 'Comparing' : 'Compare'}</span>
          </button>

          {/* Price Display */}
          <div className="text-right">
            <span className="text-base font-black text-gray-900">₹{stay.price.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-gray-400 leading-none font-bold block">/ night</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mapping locations to latitude/longitude for Leaflet mapping
function getPropertyLatLng(property: Property, index: number): [number, number] {
  const loc = property.location.toLowerCase();
  let baseCoords: [number, number] = [19.0760, 72.8777]; // Default to Mumbai/Maharashtra center
  
  if (loc.includes('kelva') || loc.includes('palghar')) {
    baseCoords = [19.6200, 72.7300];
  } else if (loc.includes('lonavala') || loc.includes('khandala') || loc.includes('tungarli')) {
    baseCoords = [18.7500, 73.4000];
  } else if (loc.includes('alibaug')) {
    baseCoords = [18.6582, 72.8777];
  } else if (loc.includes('karjat')) {
    baseCoords = [18.9102, 73.3282];
  } else if (loc.includes('igatpuri')) {
    baseCoords = [19.6924, 73.5565];
  } else if (loc.includes('jawhar')) {
    baseCoords = [19.9055, 73.2284];
  }
  
  // Apply a small index-based jitter to avoid overlapping resort markers
  const jitterLat = ((index * 17) % 100 - 50) * 0.0003;
  const jitterLng = ((index * 23) % 100 - 50) * 0.0003;
  return [baseCoords[0] + jitterLat, baseCoords[1] + jitterLng];
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dest = searchParams.get('dest') || '';
  const typeFilter = searchParams.get('type') || '';
  const { toggleFavorite, isFavorite, compareList, toggleCompare, isComparing, clearCompare } = useUser();
  
  const [allStays, setAllStays] = useState<Property[]>(() => propertyService.getLocalPropertiesSync());
  const [loading, setLoading] = useState(() => propertyService.getLocalPropertiesSync().length === 0);
  const [sortBy, setSortBy] = useState('default');
  const [activeChip, setActiveChip] = useState(typeFilter);

  // Top Sticky Filters
  const [maxPrice, setMaxPrice] = useState(10000);
  const [guestsCount, setGuestsCount] = useState(1);
  const [poolFilter, setPoolFilter] = useState(false);
  const [foodFilter, setFoodFilter] = useState(false);
  const [petFilter, setPetFilter] = useState(false);
  const [beachfrontFilter, setBeachfrontFilter] = useState(false);
  const [instantBookFilter, setInstantBookFilter] = useState(false);

  // Advanced Filters Drawer Toggle
  const [showAdvancedDrawer, setShowAdvancedDrawer] = useState(false);
  
  // Advanced Drawer Filter States
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [isFeaturedOnly, setIsFeaturedOnly] = useState(false);
  const [isCoupleFriendly, setIsCoupleFriendly] = useState(false);

  // Compare slide-up overlay (expanded status on desktop)
  const [isCompareExpanded, setIsCompareExpanded] = useState(false);

  // Map Controls
  const [mapExpanded, setMapExpanded] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Mobile navigation support
  const [showMapViewOnMobile, setShowMapViewOnMobile] = useState(false);

  // Map Query state to center on destination or clicked property
  const [mapQuery, setMapQuery] = useState(dest || 'Maharashtra, India');

  // Leaflet references
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);

  // Compile final filter set
  const filteredStays = allStays.filter((stay) => {
    // Destination match
    const matchesDest = !dest || 
      stay.location.toLowerCase().includes(dest.toLowerCase()) || 
      stay.title.toLowerCase().includes(dest.toLowerCase()) || 
      (stay.type && stay.type.toLowerCase().includes(dest.toLowerCase()));
      
    // Category Chip match
    const matchesChip = !activeChip || activeChip === 'All' || 
      (stay.type && stay.type.toLowerCase().includes(activeChip.toLowerCase())) || 
      (stay.title && stay.title.toLowerCase().includes(activeChip.toLowerCase()));

    // Sticky Top Filters
    const matchesPrice = stay.price <= maxPrice;
    const matchesGuests = !guestsCount || (stay.maxGuests || 4) >= guestsCount;
    
    const matchesPool = !poolFilter || 
      stay.amenities.some(a => a.toLowerCase().includes('pool')) || 
      stay.description.toLowerCase().includes('pool');
      
    const matchesFood = !foodFilter || 
      stay.amenities.some(a => a.toLowerCase().includes('food') || a.toLowerCase().includes('restaurant') || a.toLowerCase().includes('meal') || a.toLowerCase().includes('breakfast')) ||
      stay.description.toLowerCase().includes('food') || stay.description.toLowerCase().includes('meal');
      
    const matchesPet = !petFilter || 
      stay.description.toLowerCase().includes('pet') || 
      stay.description.toLowerCase().includes('animal');
      
    const matchesBeachfront = !beachfrontFilter || 
      stay.amenities.some(a => a.toLowerCase().includes('beach')) || 
      stay.description.toLowerCase().includes('beach') || 
      (stay.type && stay.type.toLowerCase().includes('beach'));

    const matchesInstant = !instantBookFilter || stay.availability === true;

    // Advanced Drawer Filters
    const matchesTypes = selectedTypes.length === 0 || 
      (stay.type && selectedTypes.some(t => stay.type?.toLowerCase().includes(t.toLowerCase())));
      
    const matchesRatings = selectedRatings.length === 0 || 
      selectedRatings.some(r => (stay.rating || 4.5) >= r);

    const matchesFeatured = !isFeaturedOnly || stay.isFeatured === true;
    
    const matchesCouple = !isCoupleFriendly || 
      stay.amenities.some(a => a.toLowerCase().includes('couple')) || 
      stay.description.toLowerCase().includes('couple') ||
      stay.description.toLowerCase().includes('romantic');

    return matchesDest && matchesChip && matchesPrice && matchesGuests && matchesPool && 
           matchesFood && matchesPet && matchesBeachfront && matchesInstant && 
           matchesTypes && matchesRatings && matchesFeatured && matchesCouple;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    
    // Sort by default order: Coconut Valley -> Raj Resort -> Betel Leaf Resort -> others
    const orderedTitles = ['coconut valley', 'raj resort', 'betel leaf'];
    const aTitle = a.title.toLowerCase();
    const bTitle = b.title.toLowerCase();
    const aIdx = orderedTitles.findIndex(title => aTitle.includes(title));
    const bIdx = orderedTitles.findIndex(title => bTitle.includes(title));
    
    if (aIdx !== -1 && bIdx !== -1) {
      return aIdx - bIdx;
    }
    if (aIdx !== -1) {
      return -1;
    }
    if (bIdx !== -1) {
      return 1;
    }
    return 0;
  });

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await propertyService.getAllProperties();
        setAllStays(data);
      } catch (err) {
        console.error("Error loading stays", err);
      } finally {
        setLoading(false);
      }
    };
    loadProperties();
  }, []);

  useEffect(() => {
    setActiveChip(typeFilter);
  }, [typeFilter]);

  // Sync mapQuery with dest parameter from search bar
  useEffect(() => {
    setMapQuery(dest || 'Maharashtra, India');
  }, [dest]);

  // Initialize Leaflet Map
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([19.0760, 72.8777], 9);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);

      markersGroupRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync Leaflet markers and bounds when stays/filters change
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapInstanceRef.current || !markersGroupRef.current) return;

    // Clear existing markers
    markersGroupRef.current.clearLayers();

    if (filteredStays.length === 0) {
      const loc = dest.toLowerCase();
      let coords: [number, number] = [19.0760, 72.8777];
      let zoom = 9;
      
      if (loc.includes('kelva') || loc.includes('palghar')) {
        coords = [19.6200, 72.7300];
        zoom = 12;
      } else if (loc.includes('lonavala') || loc.includes('khandala') || loc.includes('tungarli')) {
        coords = [18.7500, 73.4000];
        zoom = 12;
      } else if (loc.includes('alibaug')) {
        coords = [18.6582, 72.8777];
        zoom = 12;
      } else if (loc.includes('karjat')) {
        coords = [18.9102, 73.3282];
        zoom = 12;
      } else if (loc.includes('igatpuri')) {
        coords = [19.6924, 73.5565];
        zoom = 12;
      } else if (loc.includes('jawhar')) {
        coords = [19.9055, 73.2284];
        zoom = 12;
      }
      mapInstanceRef.current.setView(coords, zoom);
      return;
    }

    const bounds = L.latLngBounds([]);

    filteredStays.forEach((stay, index) => {
      const coords = getPropertyLatLng(stay, index);

      // Create a premium looking custom div icon matching the Airbnb/StaySearch color palette
      const customIcon = L.divIcon({
        html: `<div class="bg-white hover:bg-[#FF385C] hover:text-white text-[#222222] font-black text-[10px] px-2.5 py-1.5 rounded-full border border-gray-200 shadow-md transition-all duration-150 transform hover:scale-105 whitespace-nowrap">₹${stay.price.toLocaleString('en-IN')}</div>`,
        className: 'custom-leaflet-pin',
        iconSize: [60, 24],
        iconAnchor: [30, 12]
      });

      const marker = L.marker(coords, { icon: customIcon });

      const popupContent = `
        <div style="font-family: 'Inter', sans-serif; width: 200px; text-align: left;">
          <div style="width: 100%; height: 100px; border-radius: 12px; overflow: hidden; margin-bottom: 8px;">
            <img src="${stay.images?.[0] || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop'}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <h4 style="margin: 0 0 4px; font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 800; color: #222222; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${stay.title}</h4>
          <div style="font-size: 11px; font-weight: bold; color: #FF385C; margin-bottom: 6px;">★ ${stay.rating || '4.5'}</div>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f3f4f6; padding-top: 6px;">
            <span style="font-size: 12px; font-weight: 900; color: #222222;">₹${stay.price.toLocaleString('en-IN')} <span style="font-size: 9px; color: #9ca3af; font-weight: normal;">/ night</span></span>
            <a href="/property/${stay.id}" style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #2563eb; text-decoration: none;">Details &rarr;</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: true,
        className: 'custom-leaflet-popup'
      });

      markersGroupRef.current.addLayer(marker);
      bounds.extend(coords);
    });

    // Fit map bounds to contain all markers
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }, [filteredStays]);



  const chips = ['All', 'Beach', 'Hills', 'Farm', 'Luxury', 'Budget', 'Family'];


  const handleCardClick = (stay: Property) => {
    // On mobile devices, navigate directly to details page
    if (window.innerWidth < 1024) {
      navigate(`/property/${stay.id}`);
      return;
    }

    const L = (window as any).L;
    if (!L) {
      navigate(`/property/${stay.id}`);
      return;
    }
    const idx = allStays.findIndex(s => s.id === stay.id);
    const coords = getPropertyLatLng(stay, idx !== -1 ? idx : 0);
    
    if (mapInstanceRef.current && markersGroupRef.current) {
      mapInstanceRef.current.setView(coords, 14, { animate: true, duration: 1 });
      
      // Find the corresponding marker and open its popup
      markersGroupRef.current.eachLayer((layer: any) => {
        if (layer.getLatLng) {
          const latLng = layer.getLatLng();
          const dist = Math.sqrt(Math.pow(latLng.lat - coords[0], 2) + Math.pow(latLng.lng - coords[1], 2));
          if (dist < 0.0001) {
            layer.openPopup();
          }
        }
      });
    }
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current && markersGroupRef.current && filteredStays.length > 0) {
      const L = (window as any).L;
      if (!L) return;
      const bounds = L.latLngBounds([]);
      filteredStays.forEach((stay, idx) => {
        bounds.extend(getPropertyLatLng(stay, idx));
      });
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([19.0760, 72.8777], 9);
    }
  };


  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleRatingFilter = (rating: number) => {
    setSelectedRatings(prev => 
      prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
    );
  };

  const resetAllFilters = () => {
    setMaxPrice(10000);
    setGuestsCount(1);
    setPoolFilter(false);
    setFoodFilter(false);
    setPetFilter(false);
    setBeachfrontFilter(false);
    setInstantBookFilter(false);
    setSelectedTypes([]);
    setSelectedRatings([]);
    setIsFeaturedOnly(false);
    setIsCoupleFriendly(false);
  };


  return (
    <div className="pt-20 h-screen flex flex-col overflow-hidden bg-[#fafafa]">
      
      {/* 1. Top Sticky Filters bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4 z-20 shadow-sm shrink-0">
        
        {/* Left Search Header */}
        <div className="hidden md:flex flex-col">
          <h1 className="text-lg font-black tracking-tight text-[#222222] flex items-center gap-1.5">
            <Compass className="w-5 h-5 text-[#FF385C]" />
            Search stays {dest && <>in <span className="text-[#FF385C]">{dest}</span></>}
          </h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            {filteredStays.length} matching stays
          </p>
        </div>

        {/* Filters Scrollable Row */}
        <div className="flex-grow flex items-center gap-4 overflow-x-auto scrollbar-none py-1">
          {/* Price Slider */}
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-200 shrink-0">
            <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Max Price</span>
            <input
              type="range"
              min="2000"
              max="10000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-24 sm:w-32 h-1 bg-[#222222]/10 rounded-lg appearance-none cursor-pointer accent-[#FF385C]"
            />
            <span className="text-xs font-black text-[#FF385C]">₹{maxPrice.toLocaleString('en-IN')}</span>
          </div>

          {/* Guest Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-200 shrink-0">
            <Users className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={guestsCount}
              onChange={e => setGuestsCount(parseInt(e.target.value))}
              className="bg-transparent outline-none text-xs font-bold text-[#222222] cursor-pointer"
            >
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="4">4+ Guests</option>
              <option value="6">6+ Guests</option>
              <option value="8">8+ Guests</option>
              <option value="12">12+ Guests</option>
            </select>
          </div>

          {/* Quick Checkbox Tags */}
          {[
            { label: 'Pool', checked: poolFilter, onChange: setPoolFilter },
            { label: 'Food Included', checked: foodFilter, onChange: setFoodFilter },
            { label: 'Pet Friendly', checked: petFilter, onChange: setPetFilter },
            { label: 'Beachfront', checked: beachfrontFilter, onChange: setBeachfrontFilter },
            { label: 'Instant Book', checked: instantBookFilter, onChange: setInstantBookFilter },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => item.onChange(!item.checked)}
              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border shrink-0 cursor-pointer ${
                item.checked
                  ? 'bg-[#FF385C] text-white border-[#FF385C] shadow-md shadow-[#FF385C]/10'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Actions (Advanced Draw & Sort) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowAdvancedDrawer(true)}
            className="flex items-center gap-1.5 bg-[#222222] hover:bg-gray-800 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-2.5 rounded-full transition-colors shadow-md cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>More Filters</span>
          </button>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-white border border-gray-200 text-[#222222] text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-2.5 rounded-full cursor-pointer hover:bg-gray-50 outline-none"
          >
            <option value="default">Sort: Default</option>
            <option value="rating">Sort: Top Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* 2. Main split section */}
      <div className="flex-grow flex relative overflow-hidden">
        
        {/* Left pane: Results list */}
        <div 
          className={`h-full overflow-y-auto px-6 py-6 transition-all duration-300 ${
            mapExpanded ? 'w-full lg:w-1/2' : 'w-full lg:w-2/3'
          } ${showMapViewOnMobile ? 'hidden lg:block' : 'block'}`}
        >
          {/* Quick Chips bar */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none shrink-0 border-b border-gray-100">
            {chips.map(chip => (
              <button
                key={chip}
                onClick={() => {
                  const val = chip === 'All' ? '' : chip;
                  setActiveChip(val);
                  setSearchParams(prev => {
                    if (val) prev.set('type', val.toLowerCase());
                    else prev.delete('type');
                    return prev;
                  });
                }}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border shrink-0 ${
                  (chip === 'All' && !activeChip) || activeChip === chip
                    ? 'bg-[#FF385C] text-white border-[#FF385C] shadow-md shadow-[#FF385C]/15'
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
              <div className="w-10 h-10 border-4 border-t-[#FF385C] border-gray-200 rounded-full animate-spin"></div>
              <p className="text-sm font-semibold text-gray-500 font-sans">Curating comparing stays...</p>
            </div>
          ) : filteredStays.length > 0 ? (
            <div className={`grid gap-5 pb-24 ${mapExpanded ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
              {filteredStays.map((stay, idx) => (
                <StayCard
                  key={stay.id}
                  stay={stay}
                  idx={idx}
                  isHovered={hoveredCardId === stay.id}
                  compared={isComparing(stay.id || '')}
                  isFavorite={isFavorite(stay.id || '')}
                  toggleCompare={toggleCompare}
                  toggleFavorite={toggleFavorite}
                  handleCardClick={handleCardClick}
                  setHoveredCardId={setHoveredCardId}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-3xl border border-gray-200 text-center relative overflow-hidden">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 text-[#FF385C]">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#222222] mb-2">No Stays Match</h3>
              <p className="text-gray-500 text-xs max-w-sm mb-6 leading-relaxed">
                Try expanding your price range, reducing guests count, or clearing drawn boundaries.
              </p>
              <button
                onClick={resetAllFilters}
                className="bg-[#FF385C] text-white hover:bg-[#E61E4D] font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Right pane: Sticky Map / Mini Map sidebar */}
        <div 
          className={`h-full sticky top-0 transition-all duration-300 ${
            mapExpanded ? 'w-full lg:w-1/2 border-l border-gray-200' : 'w-full lg:w-1/3'
          } ${showMapViewOnMobile ? 'block' : 'hidden lg:block'} p-5`}
        >
          <div className="h-full flex flex-col gap-4">
            
            {/* Expanded / Sticky layout control header */}
            <div className="flex items-center justify-between shrink-0 bg-white p-3 rounded-2xl border border-gray-200 shadow-sm">
              <span className="text-xs font-extrabold text-[#222222] uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-4 h-4 text-[#FF385C]" />
                Maharashtra Stays Map
              </span>
              <button
                onClick={() => setMapExpanded(!mapExpanded)}
                className="hidden lg:inline-flex text-[10px] font-extrabold uppercase tracking-widest text-[#FF385C] hover:text-[#FF385C] border border-rose-200 hover:border-rose-500/40 bg-rose-50 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                {mapExpanded ? 'Contract Layout' : 'Expand Split Map'}
              </button>
            </div>

            {/* Map wrapper frame */}
            <div className="flex-grow rounded-[2rem] border border-gray-200 shadow-md relative overflow-hidden bg-[#f4f3f0]">
              {/* Actual Map Widget */}
              <div
                ref={mapContainerRef}
                className="w-full h-full rounded-[2rem] z-0"
              />

              {/* Floating map controls with frosted glass styling */}
              <div className="absolute bottom-4 right-4 z-10">
                <button
                  onClick={handleRecenter}
                  className="bg-white/95 hover:bg-white text-gray-800 text-[10px] font-extrabold uppercase tracking-widest px-4 py-2.5 rounded-xl border border-gray-200 shadow-lg transition-all flex items-center gap-1.5 backdrop-blur-sm cursor-pointer select-none"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#FF385C]" />
                  <span>Recenter Map</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 3. Desktop Bottom sticky Compare Panel launcher */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 hidden md:block bg-white border-t border-gray-200 shadow-[0_-8px_30px_rgba(9,26,17,0.12)] px-8 py-4 transition-all duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[#FF385C]/10 p-2.5 rounded-2xl border border-rose-200 text-[#FF385C]">
                <GitCompare className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#222222] text-base flex items-center gap-2">
                  Comparison Console <span className="bg-[#FF385C] text-white text-xs px-2 py-0.5 rounded-full">{compareList.length} Selected</span>
                </h4>
                <p className="text-xs text-gray-500">Compare resort specifications, pricing, amenities side-by-side.</p>
              </div>
            </div>

            {/* Compared previews */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                {compareList.map(item => (
                  <div key={item.id} className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-2xl relative">
                    <button 
                      onClick={() => toggleCompare(item)} 
                      className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors border border-white shadow"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <img src={item.images?.[0] || ''} alt={item.title} className="w-8 h-8 rounded-lg object-cover border border-gray-100" />
                    <span className="text-xs font-bold text-[#222222] truncate max-w-[100px]">{item.title}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
                <button
                  onClick={clearCompare}
                  className="text-xs font-bold text-gray-500 hover:text-[#222222] transition-colors uppercase tracking-wider cursor-pointer"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsCompareExpanded(true)}
                  className="bg-[#FF385C] hover:bg-[#E61E4D] text-white text-xs font-extrabold uppercase tracking-widest px-6 py-3 rounded-2xl shadow-lg shadow-rose-500/15 cursor-pointer"
                >
                  Compare Side-by-Side
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Desktop Compare Details slide-up Drawer Matrix modal */}
      <AnimatePresence>
        {isCompareExpanded && (
          <div className="fixed inset-0 z-50 hidden md:flex items-center justify-center bg-black/60 backdrop-blur-sm p-10">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] border border-gray-200 shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col relative overflow-hidden"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-[#222222] flex items-center gap-2">
                    <GitCompare className="w-6 h-6 text-[#FF385C]" />
                    Compare Resorts Side-by-Side
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Review key parameters, pricing, and guest capacity before booking.</p>
                </div>
                <button
                  onClick={() => setIsCompareExpanded(false)}
                  className="p-2 bg-[#222222]/5 hover:bg-[#222222]/10 text-[#222222] transition-colors rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Matrix Compare Table Grid */}
              <div className="flex-grow overflow-y-auto px-8 py-6">
                <div className="grid grid-cols-4 gap-6">
                  {/* Column 0: Specifications names */}
                  <div className="flex flex-col gap-6 pt-40 font-bold text-xs text-gray-400 uppercase tracking-widest">
                    <div className="h-10 flex items-center">Price</div>
                    <div className="h-10 flex items-center">Type</div>
                    <div className="h-10 flex items-center">Max Guests</div>
                    <div className="h-10 flex items-center">Bedrooms</div>
                    <div className="h-10 flex items-center">Rating</div>
                    <div className="h-10 flex items-center">Swimming Pool</div>
                    <div className="h-10 flex items-center">Food Type</div>
                    <div className="h-10 flex items-center">Amenities</div>
                  </div>

                  {/* Column 1, 2, 3: Compared Property Details */}
                  {compareList.map((item, idx) => {
                    const priceText = `₹${item.price.toLocaleString('en-IN')}`;
                    const hasPool = item.amenities.some(a => a.toLowerCase().includes('pool'));
                    
                    return (
                      <div key={item.id} className="flex flex-col gap-6 border border-gray-100 hover:border-rose-300 p-4 rounded-3xl transition-all text-center relative group">
                        
                        {/* Remove button */}
                        <button
                          onClick={() => toggleCompare(item)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow border border-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        {/* Top overview card */}
                        <div className="h-36 shrink-0 relative rounded-2xl overflow-hidden mb-2 border border-gray-200 bg-gray-50">
                          <img src={item.images?.[0] || ''} alt={item.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute bottom-3 left-3 right-3 text-left">
                            <span className="text-[9px] font-extrabold text-[#FF385C] uppercase tracking-wider block mb-0.5">{item.type || 'Resort'}</span>
                            <h4 className="font-extrabold text-white text-sm leading-tight truncate">{item.title}</h4>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="h-10 flex items-center justify-center font-black text-[#222222] text-base">{priceText}</div>
                        {/* Type */}
                        <div className="h-10 flex items-center justify-center font-extrabold text-[#222222] text-xs uppercase">{item.type || 'Resort'}</div>
                        {/* Max Guests */}
                        <div className="h-10 flex items-center justify-center font-extrabold text-[#222222] text-xs">{item.maxGuests || 4} Guests Max</div>
                        {/* Bedrooms */}
                        <div className="h-10 flex items-center justify-center font-extrabold text-[#222222] text-xs">{item.bedrooms || 2} Bedrooms</div>
                        {/* Rating */}
                        <div className="h-10 flex items-center justify-center font-extrabold text-[#222222] text-xs flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span>{item.rating || '4.5'}</span>
                        </div>
                        {/* Pool */}
                        <div className="h-10 flex items-center justify-center text-xs">
                          {hasPool ? <Check className="w-5 h-5 text-green-600 font-extrabold mx-auto" /> : <X className="w-5 h-5 text-red-500 mx-auto" />}
                        </div>
                        {/* Food */}
                        <div className="h-10 flex items-center justify-center font-extrabold text-[#222222] text-xs">{item.foodType || 'Veg / Non-Veg'}</div>
                        {/* Amenities lists */}
                        <div className="h-28 overflow-y-auto text-left text-[10px] text-gray-600 space-y-1 bg-gray-50/40 p-2.5 rounded-2xl border border-gray-100">
                          {item.amenities.slice(0, 5).map(a => (
                            <div key={a} className="flex items-center gap-1">
                              <Check className="w-3 h-3 text-[#FF385C]" />
                              <span className="truncate">{a}</span>
                            </div>
                          ))}
                          {item.amenities.length > 5 && (
                            <span className="text-[9px] text-[#FF385C] font-extrabold uppercase mt-1 block">+{item.amenities.length - 5} More</span>
                          )}
                        </div>

                        {/* View Detail Direct Route */}
                        <Link
                          to={`/property/${item.id}`}
                          onClick={() => setIsCompareExpanded(false)}
                          className="bg-[#222222] hover:bg-gray-800 text-white font-extrabold text-xs uppercase tracking-widest py-3 px-4 rounded-xl shadow transition-colors flex items-center justify-center gap-1 mt-2 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Resort</span>
                        </Link>
                      </div>
                    );
                  })}
                  {/* Fill empty comparison columns */}
                  {Array.from({ length: Math.max(0, 3 - compareList.length) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIsCompareExpanded(false)}
                      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-[#FF385C]/50 hover:bg-rose-50/10 p-6 rounded-3xl h-full min-h-[500px] transition-all cursor-pointer group/btn"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-100 group-hover/btn:bg-[#FF385C]/10 border border-gray-100 group-hover/btn:border-[#FF385C]/20 flex items-center justify-center text-[#222222]/30 group-hover/btn:text-[#FF385C] mb-2 transition-all">
                        <Plus className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-gray-400 group-hover/btn:text-[#FF385C] uppercase tracking-widest text-center transition-all">Add Stay to Compare</p>
                      <span className="text-[10px] text-gray-400 mt-1 font-medium">(Closes modal to select)</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. More Filters Advanced Drawer panel */}
      <AnimatePresence>
        {showAdvancedDrawer && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
            <div className="absolute inset-0 z-0" onClick={() => setShowAdvancedDrawer(false)} />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative z-10 w-full max-w-md h-full bg-white shadow-2xl flex flex-col border-l border-gray-200"
            >
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-extrabold text-[#222222] text-lg flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#FF385C]" />
                  Advanced Filters
                </h3>
                <button 
                  onClick={() => setShowAdvancedDrawer(false)}
                  className="p-1.5 bg-[#222222]/5 hover:bg-[#222222]/10 text-[#222222] rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body Scroll */}
              <div className="flex-grow overflow-y-auto px-6 py-6 space-y-8">
                
                {/* Stay Type */}
                <div>
                  <h4 className="font-black text-[#222222] text-xs uppercase tracking-widest mb-4">Stay Type</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {['Resort', 'Villa', 'Homestay', 'Farmhouse', 'Guest House', 'Agro Tourism', 'Camping', 'Waterpark'].map((type) => {
                      const checked = selectedTypes.includes(type);
                      return (
                        <button
                          key={type}
                          onClick={() => toggleTypeFilter(type)}
                          className={`px-4 py-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                            checked
                              ? 'border-[#FF385C] bg-rose-50 text-[#FF385C]'
                              : 'border-gray-200 text-[#222222] hover:bg-gray-50'
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Star Rating threshold */}
                <div>
                  <h4 className="font-black text-[#222222] text-xs uppercase tracking-widest mb-4">Minimum Rating</h4>
                  <div className="flex gap-2">
                    {[4.8, 4.5, 4.0, 3.5].map((rating) => {
                      const checked = selectedRatings.includes(rating);
                      return (
                        <button
                          key={rating}
                          onClick={() => toggleRatingFilter(rating)}
                          className={`flex-grow px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                            checked
                              ? 'border-[#FF385C] bg-rose-50 text-[#FF385C]'
                              : 'border-gray-200 text-[#222222] hover:bg-gray-50'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                          <span>{rating}+</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Specific tags */}
                <div>
                  <h4 className="font-black text-[#222222] text-xs uppercase tracking-widest mb-4">Stays Experience</h4>
                  <div className="space-y-3">
                    {/* Featured */}
                    <label className="flex items-center justify-between cursor-pointer py-1.5">
                      <span className="text-xs font-bold text-gray-600">Featured / Premium Stays</span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={isFeaturedOnly}
                          onChange={() => setIsFeaturedOnly(!isFeaturedOnly)}
                          className="sr-only"
                        />
                        <div className={`w-9 h-5 rounded-full transition-colors duration-200 ${isFeaturedOnly ? 'bg-[#FF385C]' : 'bg-gray-200'}`} />
                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${isFeaturedOnly ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </label>

                    {/* Couple Friendly */}
                    <label className="flex items-center justify-between cursor-pointer py-1.5">
                      <span className="text-xs font-bold text-gray-600">Couple Friendly Rooms</span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={isCoupleFriendly}
                          onChange={() => setIsCoupleFriendly(!isCoupleFriendly)}
                          className="sr-only"
                        />
                        <div className={`w-9 h-5 rounded-full transition-colors duration-200 ${isCoupleFriendly ? 'bg-[#FF385C]' : 'bg-gray-200'}`} />
                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${isCoupleFriendly ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </label>
                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="px-6 py-5 border-t border-gray-100 flex items-center gap-4 bg-gray-50/50">
                <button
                  onClick={resetAllFilters}
                  className="flex-1 border border-gray-200 hover:bg-white text-[#222222] font-bold uppercase tracking-widest text-[10px] py-3.5 rounded-xl transition-all cursor-pointer text-center"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setShowAdvancedDrawer(false)}
                  className="flex-1 bg-[#FF385C] hover:bg-[#E61E4D] text-white font-extrabold uppercase tracking-widest text-[10px] py-3.5 rounded-xl shadow transition-all cursor-pointer text-center"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating mobile navigation toggle switch */}
      <div className="lg:hidden fixed bottom-16 left-1/2 -translate-x-1/2 z-30 flex bg-[#222222]/95 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl p-1 shrink-0 mb-2">
        <button
          onClick={() => setShowMapViewOnMobile(false)}
          className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-all ${
            !showMapViewOnMobile 
              ? 'bg-[#FF385C] text-white shadow-lg shadow-rose-500/20' 
              : 'text-white/70 hover:text-white'
          }`}
        >
          List view
        </button>
        <button
          onClick={() => setShowMapViewOnMobile(true)}
          className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-all ${
            showMapViewOnMobile 
              ? 'bg-[#FF385C] text-white shadow-lg shadow-rose-500/20' 
              : 'text-white/70 hover:text-white'
          }`}
        >
          Map view
        </button>
      </div>

    </div>
  );
}
