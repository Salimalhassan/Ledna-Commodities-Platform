
import type { LucideIcon } from 'lucide-react';

export interface User {
  id: string;
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
  userType: 'seller' | 'buyer'; // Added userType
}

export interface CommodityCategory {
  id: string;
  name: string;
  icon?: LucideIcon;
}

export interface Commodity {
  id: string;
  name:string;
  description: string;
  category: CommodityCategory;
  price: number;
  unit: string; // e.g., 'kg', 'tonne', 'liter', 'piece'
  imageUrl?: string;
  dataAiHint?: string;
  sellerId: string;
  sellerName: string;
  sellerContact?: string;
  location?: string;
  datePosted: string;
  externalLink?: string;
}

export interface Review {
  id: string;
  sellerId: string;
  reviewerName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
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
  date: string;
  commodityName: string;
  sellerName: string;
  quantity: number;
  unit: string;
  totalPrice: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
}
