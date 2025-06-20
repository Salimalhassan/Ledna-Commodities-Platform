
import type { LucideIcon } from 'lucide-react';

export interface User {
  uid: string; // Changed from id to uid to align with Firebase Auth
  name: string;
  email: string;
  avatarUrl?: string;
  dataAiHint?: string;
  location?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  verificationType?: 'NIN' | 'Passport' | '';
  verificationNumber?: string;
  isVerified?: boolean;
  userType: 'seller' | 'buyer';
}

export interface CommodityCategory {
  id: string;
  name: string;
  icon?: LucideIcon;
}

export interface Commodity {
  id: string; // This will be the Firestore document ID
  name:string;
  description: string;
  category: CommodityCategory;
  price: number;
  unit: string; // e.g., 'kg', 'tonne', 'liter', 'piece'
  imageUrl?: string;
  dataAiHint?: string;
  sellerId: string; // This will be the user's uid
  sellerName: string; // Denormalized for easier display
  sellerContact?: string;
  location?: string;
  datePosted: string; // Consider using Firestore Timestamp server-side
  externalLink?: string;
  isFeatured?: boolean;
}

export interface Review {
  id: string;
  sellerId: string;
  reviewerUid: string; // UID of the user who wrote the review
  reviewerName: string;
  rating: number; // 1-5
  comment: string;
  date: string; // Consider using Firestore Timestamp
}

export interface MarketTrendDataPoint {
  date: string;
  price: number;
}

export interface MarketTrend {
  commodityName: string;
  data: MarketTrendDataPoint[];
}

export interface Transaction {
  id: string;
  date: string; // Consider Firestore Timestamp
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
