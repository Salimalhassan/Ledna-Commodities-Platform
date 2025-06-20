
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, serverTimestamp, Timestamp, orderBy } from 'firebase/firestore';
import type { Transaction } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export interface TransactionActionResult {
  success: boolean;
  message: string;
  error?: string;
  transactionId?: string;
}

// Input for creating a new transaction - details to be finalized when UI is built
interface AddTransactionInput {
  commodityId: string;
  commodityName: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  quantity: number;
  unit: string;
  totalPrice: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

function mapFirestoreDocToTransaction(doc: any): Transaction {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : new Date().toISOString(),
  } as Transaction;
}

// Placeholder: Actual creation will depend on UI flow
export async function addTransaction(input: AddTransactionInput): Promise<TransactionActionResult> {
   if (!input.buyerId) {
    return { success: false, message: "User not authenticated.", error: "Authentication required to record transaction." };
  }
  // Add more validation as needed
  
  try {
    const transactionData = {
      ...input,
      date: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, 'transactions'), transactionData);
    revalidatePath('/dashboard/buyer/transactions'); // Revalidate the buyer's transactions page
    return {
      success: true,
      message: "Transaction recorded successfully.",
      transactionId: docRef.id,
    };
  } catch (e) {
    console.error("Error adding transaction:", e);
    return {
      success: false,
      message: "Failed to record transaction.",
      error: e instanceof Error ? e.message : "An unknown error occurred."
    };
  }
}

export async function fetchUserTransactions(buyerId: string): Promise<Transaction[]> {
  if (!buyerId) return [];
  try {
    const transactionsCol = collection(db, 'transactions');
    const q = query(transactionsCol, where('buyerId', '==', buyerId), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => mapFirestoreDocToTransaction(doc));
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return [];
  }
}
