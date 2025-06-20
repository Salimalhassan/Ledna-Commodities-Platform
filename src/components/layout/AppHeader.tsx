
'use client'; // Required for hooks like useAuth, useState

import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings, LayoutGrid, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AppSidebarNav from '@/components/layout/AppSidebarNav';
import appLogo from '@/assets/logo.png';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import NotificationBell from '@/components/NotificationBell'; // Import the new component


export default function AppHeader() {
  const { currentUser, loading, logout } = useAuth();

  const userInitials = currentUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '..';

  const handleLogout = async () => {
    await logout();
    // Router push is handled within the logout function in AuthContext
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs bg-sidebar text-sidebar-foreground p-0">
           <div className="p-4 border-b border-sidebar-border">
            <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-sidebar-primary">
              <Image src={appLogo} alt="Ledna Logo" width={252} height={252} style={{ width: '144px', height: '144px' }} data-ai-hint="company logo" />
              <span className="font-headline">Ledna</span>
            </Link>
          </div>
          <AppSidebarNav />
        </SheetContent>
      </Sheet>
      
      <div className="ml-auto flex items-center gap-4"> {/* Increased gap */}
        {loading ? (
          <>
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </>
        ) : currentUser ? (
          <>
            <NotificationBell />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                  <Avatar>
                    <AvatarImage src={currentUser.avatarUrl || `https://avatar.vercel.sh/${currentUser.email}.png`} alt={currentUser.name} data-ai-hint={currentUser.avatarUrl ? undefined : "abstract pattern"} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-headline">{currentUser.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings"> 
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
           <Button asChild variant="outline">
            <Link href="/auth/login">Login</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
