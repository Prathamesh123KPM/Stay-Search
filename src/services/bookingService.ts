import { collection, doc, getDocs, getDoc, addDoc, updateDoc, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Booking {
  id?: string;
  userId: string;
  propertyId: string;
  propertyName: string;
  image: string;
  location: string;
  checkIn: string; // ISO Date String
  checkOut: string; // ISO Date String
  guests: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  bookingStatus: 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
}

const LOCAL_STORAGE_KEY = 'staysearch_bookings_local';

function getLocalBookings(): Booking[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading bookings from localStorage", e);
    return [];
  }
}

function saveLocalBookings(bookings: Booking[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookings));
  } catch (e) {
    console.error("Error saving bookings to localStorage", e);
  }
}

const bookingsRef = collection(db, 'bookings');

export const bookingService = {
  async getBookingsByUser(userId: string): Promise<Booking[]> {
    try {
      const q = query(bookingsRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const firestoreBookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
        return firestoreBookings;
      }
    } catch (err) {
      console.warn("Fallback for getBookingsByUser", err);
    }
    const local = getLocalBookings();
    return local.filter(b => b.userId === userId);
  },

  async getAllBookings(): Promise<Booking[]> {
    try {
      const querySnapshot = await getDocs(bookingsRef);
      if (!querySnapshot.empty) {
        const firestoreBookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
        saveLocalBookings(firestoreBookings);
        return firestoreBookings;
      }
    } catch (err) {
      console.warn("Fallback for getAllBookings", err);
    }
    return getLocalBookings();
  },

  async checkAvailability(propertyId: string, checkIn: string, checkOut: string): Promise<boolean> {
    let existingBookings: Booking[] = [];
    try {
      const q = query(
        bookingsRef, 
        where("propertyId", "==", propertyId),
        where("bookingStatus", "!=", "cancelled")
      );
      const querySnapshot = await getDocs(q);
      existingBookings = querySnapshot.docs.map(doc => doc.data() as Booking);
    } catch (err) {
      console.warn("Fallback checkAvailability", err);
      const local = getLocalBookings();
      existingBookings = local.filter(b => b.propertyId === propertyId && b.bookingStatus !== 'cancelled');
    }
    
    const reqStart = new Date(checkIn).getTime();
    const reqEnd = new Date(checkOut).getTime();

    // Check for overlap
    for (const booking of existingBookings) {
      const bookedStart = new Date(booking.checkIn).getTime();
      const bookedEnd = new Date(booking.checkOut).getTime();

      // Overlap logic: (StartA < EndB) and (EndA > StartB)
      if (reqStart < bookedEnd && reqEnd > bookedStart) {
        return false; // Overlap found, not available
      }
    }
    
    return true; // Available
  },

  async createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<string> {
    const newBooking: Booking = {
      ...booking,
      createdAt: new Date().toISOString()
    };
    
    const local = getLocalBookings();
    const tempId = 'booking-' + Math.random().toString(36).substr(2, 9);
    const savedBooking = { ...newBooking, id: tempId };
    local.push(savedBooking);
    saveLocalBookings(local);

    try {
      const docRef = await addDoc(bookingsRef, newBooking);
      const updatedLocal = getLocalBookings();
      const idx = updatedLocal.findIndex(b => b.id === tempId);
      if (idx !== -1) {
        updatedLocal[idx].id = docRef.id;
        saveLocalBookings(updatedLocal);
      }
      return docRef.id;
    } catch (error) {
      console.warn("Saved booking to local storage only due to Firestore write error", error);
      return tempId;
    }
  },

  async updateBookingStatus(id: string, bookingStatus: Booking['bookingStatus']): Promise<void> {
    const local = getLocalBookings();
    const idx = local.findIndex(b => b.id === id);
    if (idx !== -1) {
      local[idx].bookingStatus = bookingStatus;
      saveLocalBookings(local);
    }

    try {
      const docRef = doc(db, 'bookings', id);
      await updateDoc(docRef, { bookingStatus });
    } catch (error) {
      console.warn("Updated booking status locally only due to Firestore write error", error);
    }
  },

  async updatePaymentStatus(id: string, paymentStatus: Booking['paymentStatus']): Promise<void> {
    const local = getLocalBookings();
    const idx = local.findIndex(b => b.id === id);
    if (idx !== -1) {
      local[idx].paymentStatus = paymentStatus;
      saveLocalBookings(local);
    }

    try {
      const docRef = doc(db, 'bookings', id);
      await updateDoc(docRef, { paymentStatus });
    } catch (error) {
      console.warn("Updated payment status locally only due to Firestore write error", error);
    }
  }
};
