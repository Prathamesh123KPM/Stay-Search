import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export const authService = {
  async signup(email: string, password: string, name: string = 'User') {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      phone: '',
      role: 'user', // Default role
      favorites: [],
      createdAt: new Date().toISOString()
    });
    
    return user;
  },

  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user doc exists, if not, create it
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        name: user.displayName || 'Google User',
        email: user.email,
        phone: user.phoneNumber || '',
        role: 'user',
        createdAt: new Date().toISOString()
      });
    }
    
    return user;
  },

  async logout() {
    return signOut(auth);
  },

  async getUserRole(uid: string): Promise<string> {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data().role || 'user';
    }
    return 'user';
  },

  async getFavorites(uid: string): Promise<any[]> {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data().favorites || [];
    }
    return [];
  },

  async updateFavorites(uid: string, favorites: any[]): Promise<void> {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, { favorites });
  }
};
