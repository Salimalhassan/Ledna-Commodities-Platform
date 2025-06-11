
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutGrid,
  List,
  UploadCloud,
  LineChart,
  UserCircle,
  ShoppingCart,
  Search,
  Users,
  Languages, // Added Languages icon
  Settings, 
} from 'lucide-react';
import { getCurrentUser } from '@/data/placeholder';
import type { User } from '@/lib/types';

const sellerNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/dashboard/commodities/my-listings', label: 'My Listings', icon: List },
  { href: '/dashboard/commodities/upload', label: 'Upload Commodity', icon: UploadCloud },
  { href: '/dashboard/market-trends', label: 'Market Trends', icon: LineChart },
  { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
];

const buyerNavItems = [
  { href: '/dashboard', label: 'Discover Sellers', icon: Users },
  { href: '/dashboard/commodities/find', label: 'Find Commodities', icon: Search },
  { href: '/dashboard/buyer/transactions', label: 'My Transactions', icon: ShoppingCart },
  { href: '/dashboard/market-trends', label: 'Market Trends', icon: LineChart },
  { href: '/dashboard/profile', label: 'Profile & Verification', icon: UserCircle },
];

// Common navigation items for both user types
const commonNavItems = [
  { href: '/dashboard/communication-helper', label: 'Communication Helper', icon: Languages },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function AppSidebarNav() {
  const pathname = usePathname();
  const currentUser = getCurrentUser(); 

  const userSpecificNavItems = currentUser.userType === 'seller' ? sellerNavItems : buyerNavItems;
  const navItems = [...userSpecificNavItems, ...commonNavItems];

  return (
    <nav className="grid gap-2 p-4 text-sm font-medium">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? 'default' : 'ghost'}
          className={cn(
            'justify-start gap-2',
            pathname === item.href
              ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90'
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          )}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
