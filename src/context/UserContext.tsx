import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { bookingService, Booking } from '../services/bookingService';
import { authService } from '../services/authService';

export interface FavoriteProperty {
  id: string | number;
  name: string;
  image: string;
  location: string;
  price: number;
  type: string;
  rating?: number;
}

interface UserContextType {
  favorites: FavoriteProperty[];
  bookings: Booking[];
  loadingData: boolean;
  toggleFavorite: (property: FavoriteProperty) => Promise<void>;
  isFavorite: (propertyId: string | number) => boolean;
  fetchUserBookings: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const loadUserData = async () => {
    if (user && user.uid) {
      setLoadingData(true);
      try {
        const userFavorites = await authService.getFavorites(user.uid);
        setFavorites(userFavorites);
        
        const userBookings = await bookingService.getBookingsByUser(user.uid);
        setBookings(userBookings);
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoadingData(false);
      }
    } else {
      setFavorites([]);
      setBookings([]);
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [user]);

  const toggleFavorite = async (property: FavoriteProperty) => {
    if (!user || !user.uid) return;
    
    let updatedFavorites;
    if (favorites.some(fav => fav.id === property.id)) {
      updatedFavorites = favorites.filter(fav => fav.id !== property.id);
    } else {
      updatedFavorites = [...favorites, property];
    }
    
    setFavorites(updatedFavorites);
    // Persist to Firestore
    try {
      await authService.updateFavorites(user.uid, updatedFavorites);
    } catch (e) {
      console.error("Failed to update favorites", e);
    }
  };

  const isFavorite = (propertyId: string | number) => {
    return favorites.some(fav => fav.id === propertyId);
  };

  return (
    <UserContext.Provider value={{ favorites, bookings, loadingData, toggleFavorite, isFavorite, fetchUserBookings: loadUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
