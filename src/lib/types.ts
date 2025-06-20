
import type { LucideIcon } from 'lucide-react';

export interface User {
  uid: string;
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
  primarySpokenLanguage?: string; // Added field
}

export interface CommodityCategory {
  id: string;
  name: string;
  icon?: LucideIcon;
}

export interface Commodity {
  id: string; // Firestore document ID
  name:string;
  description: string;
  categoryId: string; // ID of the category
  categoryName: string; // Denormalized category name
  price: number;
  unit: string;
  imageUrl?: string;
  dataAiHint?: string;
  sellerId: string; // User's uid
  sellerName: string; // Denormalized for easier display
  sellerContact?: string;
  location?: string;
  datePosted: string; // ISO string date, from Firestore Timestamp
  externalLink?: string;
  isFeatured?: boolean;
}

export interface Review {
  id: string; // Firestore document ID
  sellerId: string;
  reviewerUid: string;
  reviewerName: string;
  rating: number; // 1-5
  comment: string;
  date: string; // ISO string date, from Firestore Timestamp
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
  id: string; // Firestore document ID
  date: string; // ISO string date, from Firestore Timestamp
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
