
import type { LucideIcon } from 'lucide-react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  location?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  verificationType?: 'NIN' | 'Passport' | '';
  verificationNumber?: string;
  isVerified?: boolean;
  userType?: 'seller' | 'buyer';
}

export interface CommodityCategory {
  id: string;
  name: string;
  icon?: LucideIcon;
}

export interface Commodity {
  id: string;
  name: string;
  description: string;
  category: CommodityCategory;
  price: number;
  unit: string; // e.g., 'kg', 'tonne', 'liter', 'piece'
  imageUrl?: string;
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
