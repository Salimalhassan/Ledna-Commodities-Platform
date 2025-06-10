import CommodityCard from '@/components/CommodityCard';
import { Button } from '@/components/ui/button';
import { sampleCommodities, getCurrentUser } from '@/data/placeholder';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function MyListingsPage() {
  const currentUser = getCurrentUser();
  const userCommodities = sampleCommodities.filter(c => c.sellerId === currentUser.id);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">My Commodity Listings</h1>
        <Button asChild>
          <Link href="/dashboard/commodities/upload">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Listing
          </Link>
        </Button>
      </div>

      {userCommodities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {userCommodities.map((commodity) => (
            <CommodityCard key={commodity.id} commodity={commodity} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <PackageIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
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

function PackageIcon(props: React.SVGProps<SVGSVGElement>) {
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
