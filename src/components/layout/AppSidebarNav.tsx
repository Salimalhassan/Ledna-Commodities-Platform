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
  Package,
  Star,
  Settings,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/dashboard/commodities/my-listings', label: 'My Listings', icon: List },
  { href: '/dashboard/commodities/upload', label: 'Upload Commodity', icon: UploadCloud },
  { href: '/dashboard/market-trends', label: 'Market Trends', icon: LineChart },
  { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
  // Example for public facing seller profile for discoverability (can be moved to public nav if exists)
  // { href: '/sellers/my-profile', label: 'My Seller Page', icon: Star }, 
  // { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function AppSidebarNav() {
  const pathname = usePathname();

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
