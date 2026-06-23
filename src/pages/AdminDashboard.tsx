import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, Users, Home, Calendar, Plus, Database, X as XIcon, 
  Star, MapPin, Phone, Clock, Utensils, Heart, Sparkles, Check, 
  Trash2, Edit3, CheckCircle, AlertTriangle, Eye, EyeOff, Search, Layers, ShieldCheck,
  Upload, Key, RefreshCw, Globe, Instagram
} from 'lucide-react';
import { propertyService, Property } from '../services/propertyService';
import { bookingService, Booking } from '../services/bookingService';
import { seedDatabase } from '../scripts/seed';
import { storage } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const AVAILABLE_AMENITIES = [
  'Free WiFi', 'Swimming Pool', 'AC', 'Parking', 'Restaurant', 
  'Room Service', 'Spa', 'Gym', 'Beach Access', 'Near Beach',
  'Pet Friendly', 'Bar', 'Kitchen', 'TV', 'Lawn & Garden',
  'Indoor Games', 'Cottages', 'Kids Area', 'Barbecue', 
  'Couple Friendly', 'Modern Rooms', 'Breakfast'
];

export default function AdminDashboard() {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'bookings'>('overview');
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Password Lock state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('staysearch_admin_authenticated') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  
  // Expanded form data for resort requirements
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    price: 0,
    amenities: [] as string[],
    images: ['', '', '', ''], // 4 slots for images
    type: 'Resort',
    rating: 4.5,
    contactNumber: '919987091858',
    mapsUrl: '',
    isVerified: true,
    isFeatured: false,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    checkInTime: '12:00 PM',
    checkOutTime: '10:00 AM',
    foodType: 'Both' as 'Veg' | 'Non-Veg' | 'Both',
    rulesInput: '', // comma-separated house rules
    websiteLink: '',
    googleMyBusiness: '',
    instagramProfile: ''
  });
  
  const [isUploading, setIsUploading] = useState(false);

  // Image Upload State
  const [uploadMethod, setUploadMethod] = useState<'base64' | 'firebase' | 'imgbb'>(() => {
    const saved = localStorage.getItem('staysearch_upload_method');
    return (saved as 'base64' | 'firebase' | 'imgbb') || 'base64';
  });
  const [imgbbApiKey, setImgbbApiKey] = useState<string>(() => {
    return localStorage.getItem('staysearch_imgbb_api_key') || import.meta.env.VITE_IMGBB_API_KEY || '';
  });
  const [uploadProgress, setUploadProgress] = useState<number[]>([0, 0, 0, 0]);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const saveUploadMethod = (method: 'base64' | 'firebase' | 'imgbb') => {
    setUploadMethod(method);
    localStorage.setItem('staysearch_upload_method', method);
  };

  const saveImgbbApiKey = (key: string) => {
    setImgbbApiKey(key);
    localStorage.setItem('staysearch_imgbb_api_key', key);
  };

  const compressAndConvertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 750;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error("Failed to initialize canvas context"));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const base64 = canvas.toDataURL('image/jpeg', 0.65);
          resolve(base64);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    setUploadError(null);
    setUploadProgress(prev => {
      const next = [...prev];
      next[index] = 0;
      return next;
    });

    try {
      let downloadURL = '';
      if (uploadMethod === 'base64') {
        // 1. Client-side Base64 Image Compression
        setUploadProgress(prev => {
          const next = [...prev];
          next[index] = 40;
          return next;
        });
        downloadURL = await compressAndConvertToBase64(file);
        setUploadProgress(prev => {
          const next = [...prev];
          next[index] = 100;
          return next;
        });
      } else if (uploadMethod === 'firebase') {
        // 2. Firebase Storage upload
        try {
          const fileExtension = file.name.split('.').pop();
          const fileName = `property_${Date.now()}_${index}.${fileExtension}`;
          const storageRef = ref(storage, `properties/${fileName}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          await new Promise<void>((resolve, reject) => {
            uploadTask.on('state_changed',
              (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setUploadProgress(prev => {
                  const next = [...prev];
                  next[index] = progress;
                  return next;
                });
              },
              (error) => {
                reject(error);
              },
              async () => {
                try {
                  downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                  resolve();
                } catch (err) {
                  reject(err);
                }
              }
            );
          });
        } catch (firebaseErr: any) {
          console.error("Firebase upload failed, trying fallback to ImgBB if configured", firebaseErr);
          // If we have an ImgBB key, we can auto fallback, else throw
          if (imgbbApiKey.trim()) {
            setUploadError("Firebase Storage failed (CORS / Rule block). Attempting ImgBB fallback...");
            downloadURL = await uploadToImgBB(file, index);
          } else {
            throw new Error(`Firebase Storage upload failed due to CORS policies or missing permissions. Please set up Firebase Storage CORS / rules or use the free ImgBB API instead.`);
          }
        }
      } else {
        // 3. ImgBB Upload
        if (!imgbbApiKey.trim()) {
          throw new Error("Please enter your ImgBB API key to upload images, or select Firebase Storage.");
        }
        downloadURL = await uploadToImgBB(file, index);
      }

      if (downloadURL) {
        setFormData(prev => {
          const newImgs = [...prev.images];
          newImgs[index] = downloadURL;
          return { ...prev, images: newImgs };
        });
        setUploadProgress(prev => {
          const next = [...prev];
          next[index] = 100;
          return next;
        });
      }
    } catch (err: any) {
      console.error("File upload failed", err);
      setUploadError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploadingIndex(null);
    }
  };

  const uploadToImgBB = (file: File, index: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('image', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.imgbb.com/1/upload?key=${imgbbApiKey.trim()}`, true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(prev => {
            const next = [...prev];
            next[index] = progress;
            return next;
          });
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success && response.data && response.data.url) {
              resolve(response.data.url);
            } else {
              reject(new Error(response.error?.message || 'ImgBB upload response failed'));
            }
          } catch (e) {
            reject(new Error('Invalid response format from ImgBB'));
          }
        } else {
          reject(new Error(`ImgBB responded with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during ImgBB upload'));
      xhr.send(formData);
    });
  };

  useEffect(() => {
    if (!loading && isAdminAuthenticated) {
      loadData();
    }
  }, [user, userRole, loading, navigate, isAdminAuthenticated]);

  const loadData = async () => {
    try {
      const p = await propertyService.getAllProperties();
      setProperties(p);
      const b = await bookingService.getAllBookings();
      setBookings(b);
    } catch (e) {
      console.error("Failed to load admin data", e);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin@123') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('staysearch_admin_authenticated', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator Password');
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('staysearch_admin_authenticated');
    setPasswordInput('');
  };



  const handleOpenModal = (property?: Property) => {
    setIsUploading(false);
    if (property) {
      setEditingPropertyId(property.id || null);
      
      // Ensure images array has 4 items
      const imgs = [...(property.images || [])];
      while (imgs.length < 4) {
        imgs.push('');
      }

      setFormData({
        title: property.title,
        location: property.location,
        description: property.description,
        price: property.price,
        amenities: property.amenities || [],
        images: imgs.slice(0, 4),
        type: property.type || 'Resort',
        rating: property.rating ?? 4.5,
        contactNumber: property.contactNumber || '919987091858',
        mapsUrl: property.mapsUrl || '',
        isVerified: property.isVerified !== false,
        isFeatured: !!property.isFeatured,
        maxGuests: property.maxGuests || 4,
        bedrooms: property.bedrooms || 2,
        bathrooms: property.bathrooms || 2,
        checkInTime: property.checkInTime || '12:00 PM',
        checkOutTime: property.checkOutTime || '10:00 AM',
        foodType: property.foodType || 'Both',
        rulesInput: property.rules ? property.rules.join(', ') : '',
        websiteLink: property.websiteLink || '',
        googleMyBusiness: property.googleMyBusiness || '',
        instagramProfile: property.instagramProfile || ''
      });
    } else {
      setEditingPropertyId(null);
      setFormData({
        title: '',
        location: '',
        description: '',
        price: 0,
        amenities: [],
        images: ['', '', '', ''],
        type: 'Resort',
        rating: 4.5,
        contactNumber: '919987091858',
        mapsUrl: '',
        isVerified: true,
        isFeatured: false,
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
        checkInTime: '12:00 PM',
        checkOutTime: '10:00 AM',
        foodType: 'Both',
        rulesInput: '',
        websiteLink: '',
        googleMyBusiness: '',
        instagramProfile: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const activeImages = formData.images.map(url => url.trim()).filter(Boolean);
      const rules = formData.rulesInput.split(',').map(s => s.trim()).filter(Boolean);

      const newPropData = {
        title: formData.title,
        location: formData.location,
        description: formData.description,
        price: Number(formData.price),
        amenities: formData.amenities,
        images: activeImages.length > 0 ? activeImages : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop'],
        type: formData.type,
        rating: Number(formData.rating),
        contactNumber: formData.contactNumber,
        mapsUrl: formData.mapsUrl,
        isVerified: formData.isVerified,
        isFeatured: formData.isFeatured,
        maxGuests: Number(formData.maxGuests),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        checkInTime: formData.checkInTime,
        checkOutTime: formData.checkOutTime,
        foodType: formData.foodType,
        rules: rules,
        availability: true,
        ownerId: user?.uid || 'admin',
        websiteLink: formData.websiteLink,
        googleMyBusiness: formData.googleMyBusiness,
        instagramProfile: formData.instagramProfile
      };

      if (editingPropertyId) {
        await propertyService.updateProperty(editingPropertyId, newPropData);
      } else {
        await propertyService.addProperty(newPropData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Error saving property", error);
      alert("Failed to save property. See console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await propertyService.deleteProperty(id);
        loadData();
      } catch (e) {
        console.error("Failed to delete", e);
      }
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: 'completed' | 'cancelled') => {
    try {
      await bookingService.updateBookingStatus(id, status);
      loadData();
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.type && p.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#0c1a12]">
        <div className="w-12 h-12 border-4 border-[#FF4E00] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white/70 text-sm font-bold uppercase tracking-widest">Loading StaySearch Portal...</p>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen pt-36 pb-16 bg-[#0c1a12] relative overflow-hidden flex flex-col items-center justify-center">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FF4E00]/10 blur-[120px] rounded-full pointer-events-none z-0" />
        
        <div className="max-w-md w-full mx-auto px-4 relative z-10 animate-fadeIn">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
            <div className="text-center">
              <img 
                src="/staysearch.jpeg" 
                alt="StaySearch Logo" 
                className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4 shadow-lg shadow-[#FF4E00]/20 border border-white/10" 
              />
              <h2 className="text-2xl font-black text-white">Administrator Access</h2>
              <p className="text-white/50 text-xs mt-1 uppercase tracking-widest font-bold">StaySearch Verification Portal</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <input 
                    type={showAdminPassword ? 'text' : 'password'} 
                    required 
                    placeholder="Enter administrator password" 
                    value={passwordInput} 
                    onChange={e => setPasswordInput(e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FF4E00] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/85 transition-colors cursor-pointer"
                  >
                    {showAdminPassword ? (
                      <EyeOff className="h-4 h-4" />
                    ) : (
                      <Eye className="h-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-[#FF4E00] hover:bg-[#FF4E00]/90 text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-colors cursor-pointer border border-[#FF4E00]/50 shadow-lg shadow-[#FF4E00]/15"
              >
                Authenticate
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pt-36 min-h-screen relative overflow-hidden pb-16 bg-[#0c1a12]">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF4E00]/10 blur-[150px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-500/10 blur-[150px] rounded-full pointer-events-none z-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 p-8 bg-gradient-to-r from-white/5 to-white/0 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4">
              <img 
                src="/staysearch.jpeg" 
                alt="StaySearch Logo" 
                className="w-14 h-14 rounded-2xl object-cover shadow-lg shadow-[#FF4E00]/20 border border-white/10" 
              />
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  Admin Portal
                  <span className="text-xs bg-[#FF4E00]/20 text-orange-400 border border-[#FF4E00]/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                    Verified Stays Manager
                  </span>
                </h1>
                <p className="text-white/50 text-xs mt-1 uppercase tracking-widest font-bold">List and verify Palghar resorts & homestays</p>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap">
              <button 
                onClick={async () => {
                  if (window.confirm("This will clean the current local storage listings and re-seed the default verified resorts. Proceed?")) {
                    await seedDatabase();
                    // Clear local storage for properties to force refresh from mock database
                    localStorage.removeItem('staysearch_properties_local');
                    loadData();
                  }
                }}
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-md hover:border-white/20"
              >
                <Database className="w-4 h-4 text-emerald-400" /> Reset & Seed defaults
              </button>
              <button 
                onClick={() => handleOpenModal()}
                className="bg-[#FF4E00] hover:bg-[#FF4E00]/90 text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#FF4E00]/20 border border-[#FF4E00]/50"
              >
                <Plus className="w-4 h-4" /> Add Resort / Stay
              </button>
              <button 
                onClick={handleLogout}
                className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 text-red-400 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <XIcon className="w-4 h-4" /> Log Out
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-4 shadow-xl space-y-2">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-4 py-2 border-b border-white/5 mb-2">Navigation</p>
                
                <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all cursor-pointer ${activeTab === 'overview' ? 'text-orange-400 bg-white/5 border border-white/10' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                  <Layers className={`w-4 h-4 ${activeTab === 'overview' ? 'text-orange-400' : 'text-white/40'}`} /> Overview
                </button>
                <button onClick={() => setActiveTab('properties')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all cursor-pointer ${activeTab === 'properties' ? 'text-orange-400 bg-white/5 border border-white/10' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                  <Home className={`w-4 h-4 ${activeTab === 'properties' ? 'text-orange-400' : 'text-white/40'}`} /> Resorts & Stays
                </button>
                <button onClick={() => setActiveTab('bookings')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all cursor-pointer ${activeTab === 'bookings' ? 'text-orange-400 bg-white/5 border border-white/10' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
                  <Calendar className={`w-4 h-4 ${activeTab === 'bookings' ? 'text-orange-400' : 'text-white/40'}`} /> Booking Orders
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow">
              <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-xl min-h-[500px]">
                
                {/* 1. Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8 animate-fadeIn">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Platform Overview</h2>
                      <p className="text-white/50 text-sm">Overview of metrics and status pipeline.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="relative overflow-hidden bg-gradient-to-br from-black/40 to-black/10 border border-white/10 p-6 rounded-2xl shadow-md group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-xl rounded-full" />
                        <Calendar className="w-8 h-8 text-blue-400 mb-4" />
                        <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">Total Reservations</p>
                        <p className="text-4xl font-extrabold text-white">{bookings.length}</p>
                        <p className="text-[10px] text-white/30 mt-2 font-medium">Pending, upcoming, & completed</p>
                      </div>
                      <div className="relative overflow-hidden bg-gradient-to-br from-black/40 to-black/10 border border-white/10 p-6 rounded-2xl shadow-md group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-xl rounded-full" />
                        <Home className="w-8 h-8 text-orange-400 mb-4" />
                        <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">Listed Resorts & Stays</p>
                        <p className="text-4xl font-extrabold text-white">{properties.length}</p>
                        <p className="text-[10px] text-white/30 mt-2 font-medium">
                          {properties.filter(p => p.type === 'Resort').length} Resorts | {properties.filter(p => p.type !== 'Resort').length} Other Stays
                        </p>
                      </div>
                      <div className="relative overflow-hidden bg-gradient-to-br from-black/40 to-black/10 border border-white/10 p-6 rounded-2xl shadow-md group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 blur-xl rounded-full" />
                        <ShieldCheck className="w-8 h-8 text-green-400 mb-4" />
                        <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">MTDC Verified Stays</p>
                        <p className="text-4xl font-extrabold text-green-400">
                          {properties.filter(p => p.isVerified !== false).length}
                        </p>
                        <p className="text-[10px] text-white/30 mt-2 font-medium">
                          {Math.round((properties.filter(p => p.isVerified !== false).length / (properties.length || 1)) * 100)}% verified ratio
                        </p>
                      </div>
                    </div>

                    <div className="bg-black/25 border border-white/10 rounded-2xl p-6">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-orange-400" /> Admin Guidelines
                      </h3>
                      <ul className="space-y-3 text-xs text-white/60">
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          Specify the correct owner WhatsApp phone number with country code (e.g. 919987091858) so booking inquires route to the resort owner directly.
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          Provide at least 3-4 high-quality image URLs for the gallery. If left empty, a default luxury resort image will be used.
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          Toggling a resort as "Featured" places it in the featured slides on the home page and labels it "Premium Choice".
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* 2. Properties Tab */}
                {activeTab === 'properties' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white">Manage Resorts & Stays</h2>
                        <p className="text-white/50 text-xs mt-1">Listing modification, search, and deletion pipeline.</p>
                      </div>
                      
                      {/* Search Input */}
                      <div className="relative w-full md:w-72">
                        <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text" 
                          placeholder="Search title, location..." 
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF4E00] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {filteredProperties.map(p => (
                        <div key={p.id} className="bg-black/30 border border-white/10 hover:border-white/20 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-white/5">
                              <img 
                                src={p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=150&auto=format&fit=crop'} 
                                alt={p.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">{p.type || 'Resort'}</span>
                                {p.isVerified !== false && (
                                  <span className="text-[8px] bg-green-500/20 text-green-400 border border-green-500/30 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider flex items-center gap-0.5">
                                    <ShieldCheck className="w-2 h-2" /> Verified
                                  </span>
                                )}
                                {p.isFeatured && (
                                  <span className="text-[8px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider flex items-center gap-0.5">
                                    ★ Featured
                                  </span>
                                )}
                              </div>
                              <h3 className="font-bold text-white text-lg mt-1">{p.title}</h3>
                              
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/50 mt-1">
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-orange-400" /> {p.location}</span>
                                <span>•</span>
                                <span className="flex items-center gap-0.5 text-amber-400 font-bold"><Star className="w-3 h-3 fill-current" /> {p.rating || '4.5'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end border-t border-white/5 md:border-none pt-4 md:pt-0">
                            <button 
                              onClick={() => handleOpenModal(p)} 
                              className="text-xs font-bold uppercase tracking-widest px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/80 border border-white/10 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button 
                              onClick={() => p.id && handleDeleteProperty(p.id)} 
                              className="text-xs font-bold uppercase tracking-widest px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 border border-red-500/20 hover:border-red-500/35 transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                      {filteredProperties.length === 0 && (
                        <div className="text-center py-12 bg-black/10 rounded-2xl border border-dashed border-white/10">
                          <AlertTriangle className="w-8 h-8 text-orange-400/60 mx-auto mb-2" />
                          <p className="text-white/50 text-sm">No resorts or stays match the search term.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Bookings Tab */}
                {activeTab === 'bookings' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Manage Booking Orders</h2>
                      <p className="text-white/50 text-xs mt-1">Review guest reservations and accept or reject status pipelines.</p>
                    </div>
                    
                    <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-lg">
                      <table className="w-full text-left text-xs text-white/70 border-collapse">
                        <thead className="text-[10px] uppercase bg-white/5 text-white/50 font-bold tracking-widest border-b border-white/10">
                          <tr>
                            <th className="px-5 py-4">Property</th>
                            <th className="px-5 py-4">Dates</th>
                            <th className="px-5 py-4">User ID</th>
                            <th className="px-5 py-4">Amount</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-black/15">
                          {bookings.map(b => (
                            <tr key={b.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-5 py-4 font-bold text-white max-w-[200px] truncate">{b.propertyName}</td>
                              <td className="px-5 py-4 text-white/60 font-medium">{b.checkIn} - {b.checkOut}</td>
                              <td className="px-5 py-4 text-[10px] font-mono text-white/40">{b.userId.substring(0,8)}...</td>
                              <td className="px-5 py-4 font-bold text-green-400">₹{b.totalAmount}</td>
                              <td className="px-5 py-4">
                                <span className={`px-2.5 py-1 rounded text-[9px] font-extrabold uppercase tracking-widest border ${
                                  b.bookingStatus === 'upcoming' 
                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/25' 
                                    : b.bookingStatus === 'completed' 
                                      ? 'bg-green-500/10 text-green-400 border-green-500/25' 
                                      : 'bg-red-500/10 text-red-400 border-red-500/25'
                                }`}>
                                  {b.bookingStatus}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-right">
                                {b.bookingStatus === 'upcoming' && b.id ? (
                                  <div className="flex justify-end gap-2">
                                    <button 
                                      onClick={() => handleUpdateBookingStatus(b.id!, 'completed')} 
                                      className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-green-500/10 border border-green-500/20 hover:border-green-500/40 rounded-lg text-green-400 hover:bg-green-500/20 transition-all cursor-pointer"
                                    >
                                      Accept
                                    </button>
                                    <button 
                                      onClick={() => handleUpdateBookingStatus(b.id!, 'cancelled')} 
                                      className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-red-500/10 border border-red-500/20 hover:border-red-500/40 rounded-lg text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-white/30 italic">No actions</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {bookings.length === 0 && (
                        <div className="text-center py-12 bg-black/10">
                          <p className="text-white/40 text-sm">No reservations found in database.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Edit/Add Property Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0b1710] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative my-8">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white rounded-full transition-all cursor-pointer"
            >
              <XIcon className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                <Sparkles className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">
                  {editingPropertyId ? 'Edit Verified Listing' : 'Add New Resort / Stay'}
                </h2>
                <p className="text-white/50 text-xs">Fill out specifications based on resort requirements.</p>
              </div>
            </div>
            
            <form onSubmit={handleSaveProperty} className="space-y-6">
              
              {/* Section 1: Basic Information */}
              <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-4">
                <p className="text-[10px] font-bold text-[#FF4E00] uppercase tracking-widest mb-2">1. Basic Information</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Property Title / Name</label>
                    <input required placeholder="e.g. A Coconut Valley Resort" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF4E00]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Location / Address</label>
                    <input required placeholder="e.g. Kelva Beach, Palghar" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF4E00]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Property Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF4E00] [&>option]:bg-[#0c1a12]">
                      <option value="Resort">Resort</option>
                      <option value="Villa">Villa</option>
                      <option value="Homestay">Homestay</option>
                      <option value="Farmhouse">Farmhouse</option>
                      <option value="Guest House">Guest House</option>
                      <option value="Agro Tourism">Agro Tourism</option>
                      <option value="Camping">Camping</option>
                      <option value="Waterpark">Waterpark</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Standard Pricing (₹)</label>
                    <input required type="number" placeholder="e.g. 5000" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF4E00]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Platform Rating (1.0 - 5.0)</label>
                    <input required type="number" step="0.1" min="1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF4E00]" />
                  </div>
                </div>

                {/* Pricing / Package Includes Helper Info */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Selected Pricing Type</p>
                    <p className="text-white text-xs font-bold uppercase tracking-wider">
                      {formData.type?.toLowerCase() === 'villa' ? 'per night' : 'Per Person'}
                    </p>
                  </div>
                  <div className="text-[10px] text-white/50 space-y-1">
                    <p className="font-bold text-white/70">Included Package Details (Standard):</p>
                    {formData.type?.toLowerCase() === 'villa' ? (
                      <p>✓ Stay &nbsp;&nbsp; ✓ Indoor/ Outdoor Activities</p>
                    ) : (
                      <p>✓ Stay &nbsp;&nbsp; ✓ All Meal Plan &nbsp;&nbsp; ✓ Indoor/ Outdoor Activities</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Resort Description</label>
                  <textarea required rows={3} placeholder="A short description of property highlights, atmosphere, surrounding nature, and distance to attractions..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF4E00] leading-relaxed" />
                </div>
              </div>

              {/* Section 2: About This Property Options */}
              <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-4">
                <p className="text-[10px] font-bold text-[#FF4E00] uppercase tracking-widest mb-2">2. About This Property Options</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-orange-400" /> Contact Number
                    </label>
                    <input required placeholder="e.g. 919987091858" value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF4E00]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-orange-400" /> Website Link
                    </label>
                    <input placeholder="e.g. www.resortname.com" value={formData.websiteLink} onChange={e => setFormData({...formData, websiteLink: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF4E00]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-orange-400" /> GMB Profile Link
                    </label>
                    <input placeholder="GMB Profile (for reviews)" value={formData.googleMyBusiness} onChange={e => setFormData({...formData, googleMyBusiness: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF4E00]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <Instagram className="w-3 h-3 text-orange-400" /> Instagram Profile
                    </label>
                    <input placeholder="Instagram handle or URL" value={formData.instagramProfile} onChange={e => setFormData({...formData, instagramProfile: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF4E00]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Google Maps directions URL</label>
                    <input placeholder="https://maps.google.com/..." value={formData.mapsUrl} onChange={e => setFormData({...formData, mapsUrl: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF4E00]" />
                  </div>
                  <div className="flex gap-4 pt-4 md:pt-6">
                    <label className="flex-1 flex items-center gap-2 bg-[#0c1a12]/30 border border-white/5 hover:border-white/15 px-3 py-2 rounded-xl cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        className="rounded bg-black/50 border-white/20 text-[#FF4E00] focus:ring-[#FF4E00] w-4 h-4 cursor-pointer"
                        checked={formData.isVerified}
                        onChange={e => setFormData({...formData, isVerified: e.target.checked})}
                      />
                      <div>
                        <p className="text-[10px] font-bold text-white">MTDC Verified</p>
                      </div>
                    </label>
                    <label className="flex-1 flex items-center gap-2 bg-[#0c1a12]/30 border border-white/5 hover:border-white/15 px-3 py-2 rounded-xl cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        className="rounded bg-black/50 border-white/20 text-[#FF4E00] focus:ring-[#FF4E00] w-4 h-4 cursor-pointer"
                        checked={formData.isFeatured}
                        onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                      />
                      <div>
                        <p className="text-[10px] font-bold text-white">Featured Stay</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 3: Room Specs, Timings & Food */}
              <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-4">
                <p className="text-[10px] font-bold text-[#FF4E00] uppercase tracking-widest mb-2">3. Specifications, Timings & Dining</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Max Guests</label>
                    <input type="number" min="1" value={formData.maxGuests} onChange={e => setFormData({...formData, maxGuests: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF4E00]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Bedrooms Count</label>
                    <input type="number" min="1" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF4E00]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Bathrooms Count</label>
                    <input type="number" min="1" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF4E00]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Food Options</label>
                    <select value={formData.foodType} onChange={e => setFormData({...formData, foodType: e.target.value as 'Veg' | 'Non-Veg' | 'Both'})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF4E00] [&>option]:bg-[#0c1a12]">
                      <option value="Both">Veg & Non-Veg</option>
                      <option value="Veg">Veg Only</option>
                      <option value="Non-Veg">Non-Veg Only</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Check-in Timing</label>
                    <input placeholder="e.g. 12:00 PM" value={formData.checkInTime} onChange={e => setFormData({...formData, checkInTime: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF4E00]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Check-out Timing</label>
                    <input placeholder="e.g. 10:00 AM" value={formData.checkOutTime} onChange={e => setFormData({...formData, checkOutTime: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF4E00]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">House Rules (Comma separated)</label>
                  <input placeholder="e.g. Swimming suit mandatory for pool usage, No smoking in rooms, Couples friendly" value={formData.rulesInput} onChange={e => setFormData({...formData, rulesInput: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF4E00]" />
                  <p className="text-[10px] text-white/30 mt-1">Split each guideline with a comma.</p>
                </div>
              </div>

              {/* Section 4: Amenities Checklist */}
              <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-4">
                <p className="text-[10px] font-bold text-[#FF4E00] uppercase tracking-widest mb-2">4. Amenities Checklist</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AVAILABLE_AMENITIES.map(amenity => (
                    <label key={amenity} className="flex items-center gap-2.5 text-white/80 cursor-pointer text-xs select-none hover:text-white transition-colors">
                      <input 
                        type="checkbox" 
                        className="rounded bg-black/50 border-white/20 text-[#FF4E00] focus:ring-[#FF4E00] w-4 h-4 cursor-pointer"
                        checked={formData.amenities.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, amenities: [...formData.amenities, amenity]});
                          } else {
                            setFormData({...formData, amenities: formData.amenities.filter(a => a !== amenity)});
                          }
                        }}
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>

              {/* Section 5: Gallery Images & Live Previews */}
              <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-[#FF4E00] uppercase tracking-widest">5. Image Gallery & Uploader</p>
                  <p className="text-white/40 text-[10px] mt-0.5">Upload images directly or paste image URLs. Real-time thumbnails will render below to verify accuracy.</p>
                </div>

                {/* Upload Settings panel */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/5">
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-orange-400" /> Upload Provider Settings
                      </p>
                      <p className="text-[9px] text-white/40">Choose your preferred free image hosting service</p>
                    </div>
                    
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                      <button
                        type="button"
                        onClick={() => saveUploadMethod('base64')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${uploadMethod === 'base64' ? 'bg-[#FF4E00] text-white shadow-md' : 'text-white/60 hover:text-white'}`}
                      >
                        Base64 (Database)
                      </button>
                      <button
                        type="button"
                        onClick={() => saveUploadMethod('firebase')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${uploadMethod === 'firebase' ? 'bg-[#FF4E00] text-white shadow-md' : 'text-white/60 hover:text-white'}`}
                      >
                        Firebase Storage
                      </button>
                      <button
                        type="button"
                        onClick={() => saveUploadMethod('imgbb')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${uploadMethod === 'imgbb' ? 'bg-[#FF4E00] text-white shadow-md' : 'text-white/60 hover:text-white'}`}
                      >
                        ImgBB API
                      </button>
                    </div>
                  </div>

                  {uploadMethod === 'base64' && (
                    <div className="flex items-start gap-2.5 text-[10px] text-white/50 bg-green-500/5 border border-green-500/10 p-3 rounded-xl">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1 animate-pulse flex-shrink-0" />
                      <p>
                        Using <strong>Base64 (Local Database Storage)</strong>. Images will be automatically compressed, resized (max 1000px), and saved directly inside the property document in your database. Requires zero setup!
                      </p>
                    </div>
                  )}

                  {uploadMethod === 'imgbb' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest">ImgBB API Key</label>
                        <a 
                          href="https://api.imgbb.com/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[9px] text-orange-400 hover:underline font-bold uppercase tracking-wider flex items-center gap-0.5"
                        >
                          Get Free Key ↗
                        </a>
                      </div>
                      <input 
                        type="password"
                        placeholder="Paste your free ImgBB API key here" 
                        value={imgbbApiKey} 
                        onChange={(e) => saveImgbbApiKey(e.target.value)} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF4E00]" 
                      />
                      <p className="text-[9px] text-white/30">Your key will be securely saved in your browser's local storage for future resort uploads.</p>
                    </div>
                  )}

                  {uploadMethod === 'firebase' && (
                    <div className="flex items-start gap-2.5 text-[10px] text-white/50 bg-[#FF4E00]/5 border border-[#FF4E00]/10 p-3 rounded-xl">
                      <div className="w-2 h-2 rounded-full bg-orange-400 mt-1 animate-pulse flex-shrink-0" />
                      <p>
                        Using Firebase Storage. Uploaded images will be stored inside your <strong>staysearch.firebasestorage.app</strong> bucket automatically.
                      </p>
                    </div>
                  )}

                  {uploadError && (
                    <div className="space-y-3 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-xs text-red-400">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
                        <div>
                          <p className="font-bold text-white mb-1">Upload Issue Detected</p>
                          <p className="leading-relaxed">{uploadError}</p>
                        </div>
                      </div>
                      
                      {uploadError.includes("Firebase Storage") && (
                        <div className="mt-3 pt-3 border-t border-red-500/10 text-[11px] text-white/70 space-y-2">
                          <p className="font-bold text-orange-400">💡 Easy Resolution (No Configuration Required):</p>
                          <p>
                            Firebase Storage blocks uploads from localhost ports by default unless CORS rules are set up. To bypass this instantly without configuring Google Cloud, switch your uploader to <strong>ImgBB API</strong> above.
                          </p>
                          <p className="font-medium">
                            1. Go to <a href="https://api.imgbb.com/" target="_blank" rel="noopener noreferrer" className="text-orange-400 underline font-bold hover:text-orange-300">api.imgbb.com</a> and sign up for a free account.
                            <br />
                            2. Create a free API Key and copy it.
                            <br />
                            3. Select <strong>ImgBB API</strong> above and paste the key.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {formData.images.map((imgUrl, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-[10px] font-bold text-white/70 uppercase tracking-widest">
                            Resort Image {index + 1}
                          </label>
                          {imgUrl.trim() && (
                            <span className="text-[8px] bg-green-500/15 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" /> Added
                            </span>
                          )}
                        </div>

                        {/* File Upload Trigger */}
                        <div className="flex items-center gap-3">
                          <div className="relative flex-grow">
                            <input 
                              type="text"
                              placeholder={`Or paste Image ${index + 1} URL`} 
                              value={imgUrl} 
                              onChange={(e) => {
                                const newImgs = [...formData.images];
                                newImgs[index] = e.target.value;
                                setFormData({...formData, images: newImgs});
                              }} 
                              className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-xs text-white focus:outline-none focus:border-[#FF4E00] transition-colors" 
                            />
                            {imgUrl.trim() && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newImgs = [...formData.images];
                                  newImgs[index] = '';
                                  setFormData({...formData, images: newImgs});
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                              >
                                <XIcon className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <label className={`flex-shrink-0 flex items-center justify-center p-3 rounded-xl border border-white/10 cursor-pointer transition-all ${uploadingIndex === index ? 'bg-white/5 border-dashed pointer-events-none' : 'bg-white/5 hover:bg-white/10 hover:border-white/20'}`}>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, index)}
                              className="hidden" 
                              disabled={uploadingIndex !== null}
                            />
                            {uploadingIndex === index ? (
                              <RefreshCw className="w-4 h-4 text-orange-400 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4 text-white/60 hover:text-white" />
                            )}
                          </label>
                        </div>

                        {/* Progress bar if uploading */}
                        {uploadingIndex === index && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[9px] font-bold text-white/40 uppercase tracking-wider">
                              <span>Uploading file...</span>
                              <span>{uploadProgress[index]}%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-[#FF4E00] to-amber-500 h-full transition-all duration-300" 
                                style={{ width: `${uploadProgress[index]}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Thumbnail Previews */}
                  <div className="bg-[#0c1a12]/50 border border-white/15 p-5 rounded-2xl flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-orange-400" /> Live Previews
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {formData.images.map((imgUrl, idx) => (
                          <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center">
                            {imgUrl.trim() ? (
                              <img 
                                src={imgUrl.trim()} 
                                alt={`Preview ${idx + 1}`} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback text on load error
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : null}
                            <span className="text-[9px] text-white/40 absolute font-extrabold uppercase bg-black/60 px-1.5 py-0.5 rounded bottom-1.5 left-1.5">
                              Image {idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-[10px] text-white/30 italic mt-4">If an image fails to load or appears black, double-check that the URL starts with HTTP/HTTPS and leads directly to an image file.</p>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6 border-t border-white/5">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-colors cursor-pointer" 
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUploading} 
                  className="flex-1 bg-[#FF4E00] hover:bg-[#FF4E00]/90 text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border border-[#FF4E00]/50 shadow-lg shadow-[#FF4E00]/15"
                >
                  {isUploading ? 'Uploading & Syncing...' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
