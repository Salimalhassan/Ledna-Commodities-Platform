
'use client';

import CommodityCard from '@/components/CommodityCard';
import { Button } from '@/components/ui/button';
import { PlusCircle, PackageSearch, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import type { Commodity } from '@/lib/types';
import { fetchUserCommodities } from '@/actions/commodityActions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';


export default function MyListingsPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [userCommodities, setUserCommodities] = useState<Commodity[]>([]);
  const [isLoadingCommodities, setIsLoadingCommodities] = useState(true);

  const loadUserCommodities = useCallback(async () => {
    if (currentUser?.uid && currentUser.userType === 'seller') {
      setIsLoadingCommodities(true);
      try {
        const fetchedCommodities = await fetchUserCommodities(currentUser.uid);
        setUserCommodities(fetchedCommodities);
      } catch (error) {
        console.error("Failed to fetch user commodities:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load your listings." });
      } finally {
        setIsLoadingCommodities(false);
      }
    } else if (currentUser && currentUser.userType !== 'seller') {
      setIsLoadingCommodities(false); 
    } else if (!currentUser && !authLoading) {
       setIsLoadingCommodities(false); 
    }
  }, [currentUser, authLoading, toast]);

  useEffect(() => {
    if (!authLoading) {
        loadUserCommodities();
    }
  }, [authLoading, loadUserCommodities]);

  const handleFeatureStatusChange = (commodityId: string, newStatus: boolean) => {
    setUserCommodities(prevCommodities =>
      prevCommodities.map(c =>
        c.id === commodityId ? { ...c, isFeatured: newStatus } : c
      )
    );
  };
  
  const handleDeleteListing = (commodityId: string) => {
    setUserCommodities(prevCommodities =>
      prevCommodities.filter(c => c.id !== commodityId)
    );
  };


  if (authLoading || (currentUser?.userType === 'seller' && isLoadingCommodities && userCommodities.length === 0) ) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 md:gap-0">
          <Skeleton className="h-9 w-3/5" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden shadow-lg flex flex-col h-full">
              <Skeleton className="w-full h-48" />
              <CardContent className="p-4 flex-grow">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-5 w-1/2" />
              </CardContent>
              <CardFooter className="p-4 border-t">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!currentUser) {
    router.push('/auth/login');
    return null;
  }
  
  if (currentUser.userType !== 'seller') {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 text-center">
        <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">Only sellers can view "My Listings".</p>
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 md:gap-0">
        <h1 className="text-3xl font-bold font-headline">My Commodity Listings</h1>
        <Button asChild>
          <Link href="/dashboard/commodities/upload">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Listing
          </Link>
        </Button>
      </div>

      {isLoadingCommodities && userCommodities.length === 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {[...Array(4)].map((_, i) => (
             <Card key={i} className="overflow-hidden shadow-lg flex flex-col h-full">
               <Skeleton className="w-full h-48" />
               <CardContent className="p-4 flex-grow">
                 <Skeleton className="h-6 w-3/4 mb-2" />
                 <Skeleton className="h-4 w-full mb-1" />
                 <Skeleton className="h-4 w-full mb-3" />
                 <Skeleton className="h-5 w-1/2" />
               </CardContent>
               <CardFooter className="p-4 border-t">
                 <Skeleton className="h-10 w-full" />
               </CardFooter>
             </Card>
           ))}
         </div>
      ) : userCommodities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {userCommodities.map((commodity) => (
            <CommodityCard 
              key={commodity.id} 
              commodity={commodity} 
              showFeatureManagement={true}
              onFeatureStatusChange={handleFeatureStatusChange}
              onDelete={handleDeleteListing}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Listings Yet</h2>
          <p className="text-muted-foreground mb-4">You haven't listed any commodities. Start selling now!</p>
          <Button asChild>
            <Link href="/dashboard/commodities/upload">Create Your First Listing</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
