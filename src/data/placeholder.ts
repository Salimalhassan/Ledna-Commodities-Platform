
import type { User, Commodity, CommodityCategory, MarketTrend, Review, Transaction } from '@/lib/types';
import { Leaf, Wheat, Package, Droplets, Apple, Carrot, ListTree, Sprout, Beef } from 'lucide-react';

export const commodityCategories: CommodityCategory[] = [
  { id: 'grains', name: 'Grains', icon: Wheat },
  { id: 'pulses', name: 'Pulses', icon: Sprout },
  { id: 'fruits', name: 'Fruits', icon: Apple },
  { id: 'vegetables', name: 'Vegetables', icon: Carrot },
  { id: 'livestock', name: 'Livestock', icon: Beef },
  { id: 'dairy', name: 'Dairy & Poultry', icon: Droplets },
  { id: 'oilseeds', name: 'Oilseeds', icon: ListTree },
  { id: 'other', name: 'Other', icon: Package },
];

// Sample users now use 'uid'
export const sampleUsers: User[] = [
  {
    uid: 'placeholder-buyer-alice', // Changed from id to uid
    name: 'Alice Wonderland (Buyer)',
    email: 'alice-buyer@example.com',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman smiling',
    location: 'Nairobi, Kenya',
    phone: '+254 700 123456',
    address: '123 Green Lane',
    city: 'Nairobi',
    country: 'Kenya',
    isVerified: true,
    verificationType: 'Passport',
    userType: 'buyer',
  },
  {
    uid: 'placeholder-seller-bob', // Changed from id to uid
    name: 'Bob The Farmer (Seller)',
    email: 'bob-seller@example.com',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'man farmer',
    location: 'Eldoret, Kenya',
    phone: '+254 711 987654',
    address: '456 Farm Road',
    city: 'Eldoret',
    country: 'Kenya',
    isVerified: false,
    userType: 'seller',
  },
  {
    uid: 'placeholder-seller-carol', // Changed from id to uid
    name: 'Carol Trader (Seller)',
    email: 'carol-seller@example.com',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman business',
    location: 'Mombasa, Kenya',
    phone: '+254 722 555777',
    address: '789 Trade Street',
    city: 'Mombasa',
    country: 'Kenya',
    isVerified: true,
    verificationType: 'NIN',
    userType: 'seller',
  }
];

export const sampleCommodities: Commodity[] = [
  {
    id: 'com1',
    name: 'Organic Maize',
    description: 'High-quality organic maize, freshly harvested. Rich in nutrients and perfect for various culinary uses.',
    category: commodityCategories[0], // Grains
    price: 50,
    unit: 'kg',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'maize field',
    sellerId: 'placeholder-seller-bob', // Bob sells this
    sellerName: 'Bob The Farmer (Seller)',
    sellerContact: '+254 711 987654',
    location: 'Eldoret, Kenya',
    datePosted: '2024-07-15',
    isFeatured: true,
  },
  {
    id: 'com2',
    name: 'Fresh Apples',
    description: 'Crisp and juicy red apples, sourced from the finest orchards. Ideal for snacking or baking.',
    category: commodityCategories[2], // Fruits
    price: 2,
    unit: 'piece',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'apples basket',
    sellerId: 'placeholder-seller-bob', // Bob sells this
    sellerName: 'Bob The Farmer (Seller)',
    sellerContact: '+254 711 987654',
    location: 'Eldoret, Kenya',
    datePosted: '2024-07-20',
    isFeatured: false,
  },
  {
    id: 'com3',
    name: 'Farm Fresh Eggs',
    description: 'Free-range chicken eggs, collected daily. Excellent source of protein.',
    category: commodityCategories[5], // Dairy & Poultry
    price: 15,
    unit: 'dozen',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'eggs carton',
    sellerId: 'placeholder-seller-carol', // Carol sells this
    sellerName: 'Carol Trader (Seller)',
    location: 'Mombasa, Kenya',
    datePosted: '2024-07-22',
  },
  {
    id: 'com4',
    name: 'Green Beans',
    description: 'Tender and fresh green beans, perfect for steaming or stir-frying.',
    category: commodityCategories[3], // Vegetables
    price: 3,
    unit: 'kg',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'green beans',
    sellerId: 'placeholder-seller-carol', // Carol sells this
    sellerName: 'Carol Trader (Seller)',
    location: 'Mombasa, Kenya',
    datePosted: '2024-07-23',
  }
];

export const sampleMarketTrends: MarketTrend[] = [
  {
    commodityName: 'Maize',
    data: [
      { date: '2024-01', price: 45 },
      { date: '2024-02', price: 48 },
      { date: '2024-03', price: 50 },
      { date: '2024-04', price: 52 },
      { date: '2024-05', price: 50 },
      { date: '2024-06', price: 53 },
      { date: '2024-07', price: 55 },
    ],
  },
  {
    commodityName: 'Wheat',
    data: [
      { date: '2024-01', price: 60 },
      { date: '2024-02', price: 62 },
      { date: '2024-03', price: 65 },
      { date: '2024-04', price: 63 },
      { date: '2024-05', price: 66 },
      { date: '2024-06', price: 68 },
      { date: '2024-07', price: 70 },
    ],
  },
];

export const sampleReviews: Review[] = [
  {
    id: 'rev1',
    sellerId: 'placeholder-seller-bob', // Review for Bob
    reviewerUid: 'placeholder-buyer-alice',
    reviewerName: 'Alice Wonderland (Buyer)',
    rating: 5,
    comment: 'Excellent quality maize and fast delivery. Highly recommend Bob!',
    date: '2024-07-18',
  },
  {
    id: 'rev2',
    sellerId: 'placeholder-seller-carol', // Review for Carol
    reviewerUid: 'placeholder-buyer-alice',
    reviewerName: 'Alice Wonderland (Buyer)',
    rating: 4,
    comment: 'Good eggs, fresh as advertised. Packaging could be slightly better.',
    date: '2024-07-23',
  },
  {
    id: 'rev3',
    sellerId: 'placeholder-seller-bob', // Review for Bob
    reviewerUid: 'anonymous-buyer-uid',
    reviewerName: 'Anonymous Buyer',
    rating: 5,
    comment: 'The apples were delicious and very fresh. Bob is a great seller.',
    date: '2024-07-21',
  },
];

export const sampleTransactions: Transaction[] = [
  {
    id: 'txn1',
    date: '2024-07-18',
    commodityId: 'com1',
    commodityName: 'Organic Maize',
    sellerId: 'placeholder-seller-bob',
    sellerName: 'Bob The Farmer (Seller)',
    buyerId: 'placeholder-buyer-alice',
    buyerName: 'Alice Wonderland (Buyer)',
    quantity: 20,
    unit: 'kg',
    totalPrice: 1000,
    status: 'Completed',
  },
  {
    id: 'txn2',
    date: '2024-07-23',
    commodityId: 'com3',
    commodityName: 'Farm Fresh Eggs',
    sellerId: 'placeholder-seller-carol',
    sellerName: 'Carol Trader (Seller)',
    buyerId: 'placeholder-buyer-alice',
    buyerName: 'Alice Wonderland (Buyer)',
    quantity: 5,
    unit: 'dozen',
    totalPrice: 75,
    status: 'Completed',
  },
  {
    id: 'txn3',
    date: '2024-07-25',
    commodityId: 'com4',
    commodityName: 'Green Beans',
    sellerId: 'placeholder-seller-carol',
    sellerName: 'Carol Trader (Seller)',
    buyerId: 'placeholder-buyer-alice',
    buyerName: 'Alice Wonderland (Buyer)',
    quantity: 10,
    unit: 'kg',
    totalPrice: 30,
    status: 'Pending',
  },
];

// The getCurrentUser function is deprecated. AuthContext will provide the current user.
// Components should use `useAuth()` hook from `AuthContext` instead.
// export const getCurrentUser = (): User => sampleUsers[0];
