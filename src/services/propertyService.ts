import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { MOCK_PROPERTIES } from '../scripts/seed';

export interface Property {
  id?: string;
  title: string;
  location: string;
  description: string;
  price: number;
  amenities: string[];
  images: string[];
  availability: boolean;
  ownerId: string;
  createdAt: string;
  type?: string;
  rating?: number;
  
  // Extended resort requirements
  contactNumber?: string;
  mapsUrl?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  maxGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
  checkInTime?: string;
  checkOutTime?: string;
  rules?: string[];
  foodType?: 'Veg' | 'Non-Veg' | 'Both';
  websiteLink?: string;
  googleMyBusiness?: string;
  instagramProfile?: string;
}

const LOCAL_STORAGE_KEY = 'staysearch_properties_local';

function getLocalProperties(): Property[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error reading properties from localStorage", e);
  }
  
  // Set initial mock data in localStorage if empty
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_PROPERTIES));
  } catch (e) {
    console.error("Error saving mock properties to localStorage", e);
  }
  return MOCK_PROPERTIES as Property[];
}

function saveLocalProperties(props: Property[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(props));
  } catch (e) {
    console.error("Error writing properties to localStorage", e);
  }
}

const propertiesRef = collection(db, 'properties');

let cachedProperties: Property[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes in-memory cache duration

export const propertyService = {
  getLocalPropertiesSync(): Property[] {
    return getLocalProperties();
  },

  async getAllProperties(): Promise<Property[]> {
    const now = Date.now();
    if (cachedProperties && (now - lastFetchTime < CACHE_DURATION)) {
      return cachedProperties;
    }

    try {
      const querySnapshot = await getDocs(propertiesRef);
      if (querySnapshot.empty) {
        const local = getLocalProperties();
        cachedProperties = local;
        lastFetchTime = now;
        return local;
      }
      const firestoreProps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
      
      // Update local storage for synchronization
      saveLocalProperties(firestoreProps);
      cachedProperties = firestoreProps;
      lastFetchTime = now;
      return firestoreProps;
    } catch (error) {
      console.warn("Using mock/local properties fallback due to Firestore error", error);
      const local = getLocalProperties();
      cachedProperties = local;
      lastFetchTime = now; // cache fallback briefly too
      return local;
    }
  },

  async getPropertyById(id: string): Promise<Property | null> {
    try {
      const docRef = doc(db, 'properties', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Property;
      }
    } catch (err) {
      console.warn("Firestore error getPropertyById, checking local storage", err);
    }
    
    const localProps = getLocalProperties();
    const found = localProps.find(p => p.id === id || p.title.toLowerCase().replace(/\s+/g, '-') === id);
    return found || null;
  },

  async getPropertiesByOwner(ownerId: string): Promise<Property[]> {
    try {
      const q = query(propertiesRef, where("ownerId", "==", ownerId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
      }
    } catch (err) {
      console.warn("Fallback for getPropertiesByOwner", err);
    }
    const localProps = getLocalProperties();
    return localProps.filter(p => p.ownerId === ownerId);
  },

  async addProperty(property: Omit<Property, 'id' | 'createdAt'>): Promise<string> {
    // Invalidate memory cache so next read fetches fresh data
    cachedProperties = null;

    const newProperty: Property = {
      ...property,
      createdAt: new Date().toISOString()
    };
    
    // Add to Local Storage first for local reactivity
    const localProps = getLocalProperties();
    const tempId = 'local-' + Math.random().toString(36).substr(2, 9);
    const savedProperty = { ...newProperty, id: tempId };
    localProps.push(savedProperty);
    saveLocalProperties(localProps);

    try {
      const docRef = await addDoc(propertiesRef, newProperty);
      // Replace temp ID with firestore ID in local storage
      const updatedLocal = getLocalProperties();
      const idx = updatedLocal.findIndex(p => p.id === tempId);
      if (idx !== -1) {
        updatedLocal[idx].id = docRef.id;
        saveLocalProperties(updatedLocal);
      }
      return docRef.id;
    } catch (error) {
      console.warn("Saved to local storage only due to Firestore write error", error);
      return tempId;
    }
  },

  async updateProperty(id: string, property: Partial<Property>): Promise<void> {
    // Invalidate memory cache so next read fetches fresh data
    cachedProperties = null;

    // Update local storage first
    const localProps = getLocalProperties();
    const idx = localProps.findIndex(p => p.id === id);
    if (idx !== -1) {
      localProps[idx] = { ...localProps[idx], ...property };
      saveLocalProperties(localProps);
    }

    try {
      const docRef = doc(db, 'properties', id);
      await updateDoc(docRef, property);
    } catch (error) {
      console.warn("Updated local storage only due to Firestore write error", error);
    }
  },

  async deleteProperty(id: string): Promise<void> {
    // Invalidate memory cache so next read fetches fresh data
    cachedProperties = null;

    // Delete from local storage first
    const localProps = getLocalProperties();
    const filtered = localProps.filter(p => p.id !== id);
    saveLocalProperties(filtered);

    try {
      const docRef = doc(db, 'properties', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.warn("Deleted from local storage only due to Firestore write error", error);
    }
  }
};
