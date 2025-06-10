import type { User, Commodity, CommodityCategory, MarketTrend, Review } from '@/lib/types';
import { Leaf, Wheat, Package, Droplets, Apple, Carrot, ListTree, Sprout, Beef } from 'lucide-react';

export const commodityCategories: CommodityCategory[] = [
  { id: 'grains', name: 'Grains', icon: Wheat },
  { id: 'pulses', name: 'Pulses', icon: Sprout },
  { id: 'fruits', name: 'Fruits', icon: Apple },
  { id: 'vegetables', name: 'Vegetables', icon: Carrot },
  { id: 'livestock', name: 'Livestock', icon: Beef }, // Beef icon as placeholder for general livestock
  { id: 'dairy', name: 'Dairy & Poultry', icon: Droplets },
  { id: 'oilseeds', name: 'Oilseeds', icon: ListTree }, // ListTree as a generic plant/seed icon
  { id: 'other', name: 'Other', icon: Package },
];

export const sampleUsers: User[] = [
  {
    id: 'user1',
    name: 'Alice Wonderland',
    email: 'alice@example.com',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman smiling',
    location: 'Nairobi, Kenya',
    phone: '+254 700 123456',
    address: '123 Green Lane',
    city: 'Nairobi',
    country: 'Kenya',
    isVerified: true,
    verificationType: 'Passport'
  },
  {
    id: 'user2',
    name: 'Bob The Farmer',
    email: 'bob@example.com',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'man farmer',
    location: 'Eldoret, Kenya',
    phone: '+254 711 987654',
    address: '456 Farm Road',
    city: 'Eldoret',
    country: 'Kenya',
    isVerified: false
  },
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
    sellerId: 'user1',
    sellerName: 'Alice Wonderland',
    sellerContact: '+254 700 123456',
    location: 'Nairobi, Kenya',
    datePosted: '2024-07-15',
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
    sellerId: 'user2',
    sellerName: 'Bob The Farmer',
    sellerContact: '+254 711 987654',
    location: 'Eldoret, Kenya',
    datePosted: '2024-07-20',
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
    sellerId: 'user1',
    sellerName: 'Alice Wonderland',
    location: 'Nakuru, Kenya',
    datePosted: '2024-07-22',
  },
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
    sellerId: 'user1',
    reviewerName: 'Charlie Buyer',
    rating: 5,
    comment: 'Excellent quality maize and fast delivery. Highly recommend Alice!',
    date: '2024-07-18',
  },
  {
    id: 'rev2',
    sellerId: 'user1',
    reviewerName: 'Diana Shopper',
    rating: 4,
    comment: 'Good eggs, fresh as advertised. Packaging could be slightly better.',
    date: '2024-07-23',
  },
  {
    id: 'rev3',
    sellerId: 'user2',
    reviewerName: 'Edward Consumer',
    rating: 5,
    comment: 'The apples were delicious and very fresh. Bob is a great seller.',
    date: '2024-07-21',
  },
];

export const getCurrentUser = (): User => sampleUsers[0]; // Alice as default logged-in user
