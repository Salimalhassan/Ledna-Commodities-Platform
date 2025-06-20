
import type { CommodityCategory } from '@/lib/types';
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

// NOTE: All sample data arrays have been removed as the application
// now fetches data from Firestore or generates it via AI flows.
// This file is kept for the `commodityCategories` constant which is used across the UI.
