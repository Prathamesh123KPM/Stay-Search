import React, { useState } from 'react';
import { User, Settings, Heart, Navigation, Key, MapPin, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { propertyService, Property } from '../services/propertyService';
import { getPropertyCoordinates, calculateDistance } from '../lib/location';

export default function Dashboard() {
  const { user } = useAuth();
  const { bookings, favorites } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'favorites' | 'nearby'>('bookings');

  // Geolocation states
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);

  // Fetch properties and user location on mount
  React.useEffect(() => {
    const fetchProperties = async () => {
      setPropertiesLoading(true);
      try {
        const data = await propertyService.getAllProperties();
        setAllProperties(data);
      } catch (error) {
        console.error("Failed to fetch properties for nearby stays:", error);
      } finally {
        setPropertiesLoading(false);
      }
    };
    fetchProperties();

    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationLoading(false);
        },
        (error) => {
          console.warn("Geolocation denied/failed, falling back to Mumbai:", error);
          setLocationError("Location permission denied. Showing defaults.");
          setUserCoords({ latitude: 19.0760, longitude: 72.8777 }); // Fallback to Mumbai
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser. Showing defaults.");
      setUserCoords({ latitude: 19.0760, longitude: 72.8777 });
    }
  }, []);

  // Compute nearby stays sorted by distance
  const nearbyStays = React.useMemo(() => {
    if (!userCoords || allProperties.length === 0) return [];
    return allProperties
      .map(prop => {
        const propCoords = getPropertyCoordinates(prop.location);
        const distance = calculateDistance(
          userCoords.latitude,
          userCoords.longitude,
          propCoords.latitude,
          propCoords.longitude
        );
        return { ...prop, distance };
      })
      .sort((a, b) => a.distance - b.distance);
  }, [userCoords, allProperties]);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="pt-24 min-h-screen relative overflow-hidden pb-16 bg-[#0c1a12]">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-8">Dashboard</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-xl">
               <div className="p-8 text-center border-b border-white/10">
                 <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                   <User className="w-10 h-10 text-[#0c1a12]" />
                 </div>
                 <h2 className="font-bold text-white text-lg tracking-wide">{user.displayName || 'User Account'}</h2>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mt-1 truncate px-2">{user.email}</p>
               </div>
               <nav className="p-4 space-y-2">
                 <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors ${activeTab === 'profile' ? 'text-[#FF385C] bg-white/5 border border-white/10' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                   <User className="w-4 h-4" /> Profile
                 </button>
                 <button onClick={() => setActiveTab('bookings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors ${activeTab === 'bookings' ? 'text-[#FF385C] bg-white/5 border border-white/10' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                   <Navigation className="w-4 h-4" /> My Inquiries
                 </button>
                 <button onClick={() => setActiveTab('favorites')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors ${activeTab === 'favorites' ? 'text-[#FF385C] bg-white/5 border border-white/10' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                   <Heart className="w-4 h-4" /> Saved Stays
                 </button>
                 <button onClick={() => setActiveTab('nearby')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors ${activeTab === 'nearby' ? 'text-[#FF385C] bg-white/5 border border-white/10' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                   <MapPin className="w-4 h-4" /> Stays Near You
                 </button>
                 <hr className="my-4 border-white/10" />
                 <a href="#" className="flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-colors">
                   <Settings className="w-4 h-4" /> Settings
                 </a>
               </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-xl">
              {activeTab === 'bookings' && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-6">Inquiries Sent</h2>
                  {bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div key={booking.id} className="bg-black/20 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex flex-col md:flex-row gap-6 w-full md:w-auto">
                            <div className="w-full md:w-32 h-32 md:h-24 rounded-xl overflow-hidden flex-shrink-0">
                              <img src={booking.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop'} alt={booking.propertyName} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col justify-center">
                              <h3 className="text-lg font-bold text-white mb-1">{booking.propertyName}</h3>
                              <div className="flex items-center text-white/50 text-xs mb-2">
                                <MapPin className="w-3 h-3 mr-1" />
                                {booking.location || 'Maharashtra, India'}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-white/60">
                                <span className="flex items-center gap-1"><Navigation className="w-3 h-3" /> {booking.checkIn} to {booking.checkOut}</span>
                                <span>•</span>
                                <span>{booking.guests} Guests</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold uppercase tracking-widest mb-2 border border-green-500/20">
                              Inquiry Sent
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-black/20 flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-white/20">
                       <Navigation className="w-12 h-12 text-white/20 mb-6" />
                       <h3 className="text-xl font-bold text-white mb-2">No upcoming trips</h3>
                       <p className="text-white/60 text-center mb-8 max-w-sm font-light">When you send an inquiry for a stay in Maharashtra, details will appear here.</p>
                       <Link to="/search" className="bg-transparent border border-white/20 hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-colors shadow-lg hover:shadow-xl">
                         Start exploring
                       </Link>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'favorites' && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-6">Saved Stays</h2>
                  {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favorites.map((stay) => (
                        <div key={stay.id} className="group bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:bg-white/10 transition-colors shadow-lg flex flex-col">
                          <Link to={`/property/${stay.id}`} className="flex flex-col h-full">
                            <div className="relative h-48 flex-shrink-0">
                              <img
                                src={stay.image}
                                alt={stay.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a12]/80 to-transparent pointer-events-none" />
                              <div className="absolute top-3 right-3 z-10">
                                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                              </div>
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                              <div className="text-[10px] font-bold text-[#FF385C] uppercase tracking-widest mb-1">
                                {stay.type}
                              </div>
                              <h3 className="font-bold text-base text-white mb-1 line-clamp-1 group-hover:text-rose-400 transition-colors">
                                {stay.name}
                              </h3>
                              <div className="flex items-center text-white/50 text-xs mb-3">
                                <MapPin className="w-3 h-3 mr-1" />
                                {stay.location}
                              </div>
                              <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-3">
                                <span className="text-[10px] font-bold text-[#FF385C] uppercase tracking-widest bg-orange-400/10 px-2.5 py-0.5 rounded border border-orange-400/20">
                                  View Details
                                </span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-black/20 flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-white/20">
                       <Heart className="w-12 h-12 text-white/20 mb-6" />
                       <h3 className="text-xl font-bold text-white mb-2">No saved stays</h3>
                       <p className="text-white/60 text-center mb-8 max-w-sm font-light">Save your favorite stays by clicking the heart icon while exploring.</p>
                       <Link to="/search" className="bg-transparent border border-white/20 hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-colors shadow-lg hover:shadow-xl">
                         Find properties
                       </Link>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'nearby' && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Stays Near You</h2>
                      <p className="text-white/50 text-xs">Recommended properties sorted by proximity to your detected location.</p>
                    </div>
                    {locationError && (
                      <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider block sm:inline-block w-fit">
                        ⚠️ Default Distances (MumbaiFallback)
                      </span>
                    )}
                  </div>

                  {locationLoading || propertiesLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-10 h-10 border-4 border-[#FF385C] border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-white/70 text-sm font-bold uppercase tracking-widest">Detecting your location...</p>
                    </div>
                  ) : nearbyStays.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {nearbyStays.map((stay) => (
                        <div key={stay.id} className="group bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:bg-white/10 transition-colors shadow-lg flex flex-col">
                          <Link to={`/property/${stay.id}`} className="flex flex-col h-full">
                            <div className="relative h-48 flex-shrink-0">
                              <img
                                src={stay.images?.[0] || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop'}
                                alt={stay.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a12]/80 to-transparent pointer-events-none" />
                              <div className="absolute top-3 left-3 bg-[#FF385C] text-white px-2.5 py-1 rounded-md text-[9px] font-bold shadow-md uppercase tracking-wider flex items-center gap-1 border border-[#FF385C]/20">
                                <MapPin className="w-3 h-3" />
                                {stay.distance < 1 ? `${(stay.distance * 1000).toFixed(0)} m` : `${stay.distance.toFixed(1)} km`} away
                              </div>
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                              <div className="text-[10px] font-bold text-[#FF385C] uppercase tracking-widest mb-1">
                                {stay.type || 'Resort'}
                              </div>
                              <h3 className="font-bold text-base text-white mb-1 line-clamp-1 group-hover:text-rose-400 transition-colors">
                                {stay.title}
                              </h3>
                              <div className="flex items-center text-white/50 text-xs mb-3">
                                <MapPin className="w-3 h-3 mr-1" />
                                {stay.location}
                              </div>
                              <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-3">
                                <div className="flex items-center gap-1 text-xs font-bold text-white/80">
                                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                  {stay.rating || '4.5'}
                                </div>
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded border border-white/20">
                                  ₹{stay.price}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-black/20 flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-white/20 text-center p-6">
                      <MapPin className="w-12 h-12 text-white/20 mb-6" />
                      <h3 className="text-xl font-bold text-white mb-2">No nearby stays found</h3>
                      <p className="text-white/60 text-center mb-8 max-w-sm font-light">No properties are registered in the system yet.</p>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'profile' && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
                  <div className="bg-black/20 border border-white/10 p-6 rounded-2xl">
                    <p className="text-white/60 text-sm">Account details and settings will be managed here.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
