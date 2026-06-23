import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { bookingService } from './bookingService';

export interface PaymentRecord {
  id?: string;
  bookingId: string;
  userId: string;
  razorpayPaymentId: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  createdAt: string;
}

const paymentsRef = collection(db, 'payments');

export const paymentService = {
  // In a real production app, Order creation MUST happen on a secure backend (e.g., Firebase Cloud Functions).
  // This is a client-side mock for demonstration of the flow.
  async createMockOrder(amount: number): Promise<string> {
    return `order_mock_${Math.random().toString(36).substring(2, 15)}`;
  },

  async recordPayment(paymentData: Omit<PaymentRecord, 'id' | 'createdAt'>): Promise<string> {
    const newPayment = {
      ...paymentData,
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(paymentsRef, newPayment);
    
    // If successful, update the booking status
    if (paymentData.status === 'success') {
      await bookingService.updatePaymentStatus(paymentData.bookingId, 'completed');
    } else {
      await bookingService.updatePaymentStatus(paymentData.bookingId, 'failed');
    }

    return docRef.id;
  },

  async getPayment(paymentId: string): Promise<PaymentRecord | null> {
    const docRef = doc(db, 'payments', paymentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as PaymentRecord;
    }
    return null;
  }
};
