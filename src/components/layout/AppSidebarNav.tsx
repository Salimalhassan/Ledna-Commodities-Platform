
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
  Languages,
  Settings,
  MessageSquare,
  Shield, // Import the new icon
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const sellerNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/dashboard/commodities/my-listings', label: 'My Listings', icon: List },
  { href: '/dashboard/commodities/upload', label: 'Upload Commodity', icon: UploadCloud },
  { href: '/dashboard/seller/transactions', label: 'My Sales', icon: ShoppingCart },
  { href: '/dashboard/market-trends', label: 'Market Trends', icon: LineChart },
];

const buyerNavItems = [
  { href: '/dashboard', label: 'Discover Sellers', icon: Users },
  { href: '/dashboard/commodities/find', label: 'Find Commodities', icon: Search },
  { href: '/dashboard/buyer/transactions', label: 'My Transactions', icon: ShoppingCart },
  { href: '/dashboard/market-trends', label: 'Market Trends', icon: LineChart },
];

const commonNavItems = [
  { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { href: '/dashboard/communication-helper', label: 'Communication Helper', icon: Languages },
];

const bottomNavItems = [
    { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const adminNavItem = { href: '/dashboard/admin', label: 'Admin Panel', icon: Shield };


export default function AppSidebarNav() {
  const pathname = usePathname();
  const { currentUser, loading, isAdmin } = useAuth(); 

  if (loading) {
    return (
      <nav className="grid gap-2 p-4 text-sm font-medium">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </nav>
    );
  }

  const userType = currentUser?.userType || 'buyer'; 
  
  const userSpecificNavItems = userType === 'seller' ? sellerNavItems : buyerNavItems;
  
  // Combine all nav items
  const navItems = [...userSpecificNavItems, ...commonNavItems];
  const finalBottomItems = isAdmin ? [adminNavItem, ...bottomNavItems] : bottomNavItems;


  return (
     <nav className="grid gap-1 p-2 text-sm font-medium h-full">
      <div className="flex-grow">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname.startsWith(item.href) && item.href !== '/dashboard' || pathname === item.href ? 'default' : 'ghost'}
              className={cn(
                'justify-start gap-2 w-full my-1',
                pathname.startsWith(item.href) && item.href !== '/dashboard' || pathname === item.href
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
      </div>
      <div className="mt-auto">
         {finalBottomItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname.startsWith(item.href) ? 'default' : 'ghost'}
              className={cn(
                'justify-start gap-2 w-full my-1',
                pathname.startsWith(item.href)
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
      </div>
    </nav>
  );
}
