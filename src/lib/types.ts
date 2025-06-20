
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
  primarySpokenLanguage?: string;
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

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string; // ISO string
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantInfo: {
    [uid: string]: {
      name: string;
      avatarUrl?: string;
    };
  };
  lastMessage: {
    text: string;
    timestamp: string;
    senderId: string;
  } | null;
  updatedAt: string; // ISO string
}

export interface Notification {
  id: string;
  userId: string;
  type: 'new_message' | 'new_review' | 'transaction_update' | 'general';
  message: string;
  link: string;
  isRead: boolean;
  timestamp: string; // ISO string
}

export interface AdminDashboardStats {
    totalUsers: number;
    totalListings: number;
    totalReviews: number;
}
