
'use server';

import type * as z from 'zod';
import type { CommodityUploadSchema } from '@/lib/schemas';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, serverTimestamp, Timestamp, orderBy, limit } from 'firebase/firestore';
import type { Commodity } from '@/lib/types';
import { commodityCategories } from '@/data/placeholder'; // To get categoryName

export interface CommodityActionResult {
  success: boolean;
  message: string;
  error?: string;
  commodityId?: string;
}

function mapFirestoreDocToCommodity(doc: any): Commodity {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    datePosted: data.datePosted instanceof Timestamp ? data.datePosted.toDate().toISOString() : new Date().toISOString(),
    isFeatured: data.isFeatured || false, // Ensure isFeatured defaults to false if not present
  } as Commodity;
}

export async function handleCommodityUpload(
  sellerUid: string,
  sellerName: string, // Pass sellerName for denormalization
  values: z.infer<typeof CommodityUploadSchema>
): Promise<CommodityActionResult> {
  if (!sellerUid) {
    return {
      success: false,
      message: "User not authenticated.",
      error: "Authentication is required to upload a commodity."
    };
  }

  const category = commodityCategories.find(c => c.id === values.categoryId);
  if (!category) {
    return { success: false, message: 'Invalid category selected.', error: 'Category not found.' };
  }

  try {
    const commodityData = {
      ...values,
      sellerId: sellerUid,
      sellerName: sellerName,
      categoryId: category.id,
      categoryName: category.name, // Denormalize category name
      datePosted: serverTimestamp(),
      isFeatured: false, // Default new listings to not featured
    };

    const docRef = await addDoc(collection(db, 'commodities'), commodityData);
    console.log(`Server Action: Commodity "${values.name}" (ID: ${docRef.id}) listed for user ${sellerUid}.`);
    return {
      success: true,
      message: `Commodity "${values.name}" has been listed successfully.`,
      commodityId: docRef.id,
    };
  } catch (e) {
    console.error("Error in handleCommodityUpload:", e);
    return {
      success: false,
      message: "Failed to list commodity.",
      error: e instanceof Error ? e.message : "An unknown error occurred."
    };
  }
}

export async function fetchCommodities(): Promise<Commodity[]> {
  try {
    const commoditiesCol = collection(db, 'commodities');
    const q = query(commoditiesCol, orderBy('datePosted', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => mapFirestoreDocToCommodity(doc));
  } catch (error) {
    console.error("Error fetching commodities:", error);
    return [];
  }
}

export async function fetchUserCommodities(userId: string): Promise<Commodity[]> {
  if (!userId) return [];
  try {
    const commoditiesCol = collection(db, 'commodities');
    const q = query(commoditiesCol, where('sellerId', '==', userId), orderBy('datePosted', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => mapFirestoreDocToCommodity(doc));
  } catch (error) {
    console.error("Error fetching user commodities:", error);
    return [];
  }
}

export async function fetchCommoditiesBySellerId(sellerId: string): Promise<Commodity[]> {
  if (!sellerId) return [];
  try {
    const commoditiesCol = collection(db, 'commodities');
    const q = query(commoditiesCol, where('sellerId', '==', sellerId), orderBy('datePosted', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => mapFirestoreDocToCommodity(doc));
  } catch (error) {
    console.error("Error fetching commodities by seller ID:", error);
    return [];
  }
}

export async function fetchRecentUserCommodities(userId: string, count: number = 3): Promise<Commodity[]> {
  if (!userId) return [];
  try {
    const commoditiesCol = collection(db, 'commodities');
    const q = query(commoditiesCol, where('sellerId', '==', userId), orderBy('datePosted', 'desc'), limit(count));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => mapFirestoreDocToCommodity(doc));
  } catch (error) {
    console.error("Error fetching recent user commodities:", error);
    return [];
  }
}

// Placeholder for action to toggle feature status - full implementation needs more thought (admin rights, payments, etc.)
// export async function toggleCommodityFeatureStatus(commodityId: string, currentStatus: boolean): Promise<{success: boolean, message: string}> {
//   // In a real app, check user permissions (is this user the seller or an admin?)
//   // If payments are involved, integrate with payment gateway here.
//   try {
//     const commodityRef = doc(db, 'commodities', commodityId);
//     await updateDoc(commodityRef, { isFeatured: !currentStatus });
//     return { success: true, message: `Commodity feature status updated.`};
//   } catch (error) {
//     console.error("Error toggling feature status:", error);
//     return { success: false, message: "Failed to update feature status."};
//   }
// }

