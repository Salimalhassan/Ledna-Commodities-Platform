
'use client'; // Required for client-side hooks

import CommodityCard from '@/components/CommodityCard';
import { Button } from '@/components/ui/button';
import { sampleCommodities } from '@/data/placeholder'; // Still using placeholder for now
import { PlusCircle, PackageSearch, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function MyListingsPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  // TODO: In a real app, fetch commodities from Firestore filtered by currentUser.uid
  // For now, filter placeholder data if currentUser matches a placeholder seller
  // This is a temporary measure until commodities are stored in Firestore.
  const userCommodities = currentUser
    ? sampleCommodities.filter(c => c.sellerId === currentUser.uid || 
        (currentUser.uid === 'placeholder-seller-bob' && c.sellerId === 'placeholder-seller-bob') ||
        (currentUser.uid === 'placeholder-seller-carol' && c.sellerId === 'placeholder-seller-carol')
      )
    : [];

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
        <p>Loading your listings...</p>
      </div>
    );
  }

  if (!currentUser) {
    // Should be caught by ProtectedRoute, but good to have a fallback.
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
        <h1 className="text-3xl font-bold font-headline">My Commodity Listings (Placeholder Data)</h1>
        <Button asChild>
          <Link href="/dashboard/commodities/upload">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Listing
          </Link>
        </Button>
      </div>

      {userCommodities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {userCommodities.map((commodity) => (
            <CommodityCard key={commodity.id} commodity={commodity} showFeatureManagement={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Listings Yet</h2>
          <p className="text-muted-foreground mb-4">You haven&apos;t listed any commodities. Start selling now!</p>
          <Button asChild>
            <Link href="/dashboard/commodities/upload">Create Your First Listing</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

function PackageIcon(props: React.SVGProps<SVGSVGElement>) { // Keep for now if used elsewhere, or remove if not.
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}
