
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { DollarSign, List, Package, Star, UploadCloud, UserCircle, LineChart, Search, Users, Loader2 } from "lucide-react";
import Image from "next/image";
// Removed: import { sampleUsers } from "@/data/placeholder";
import type { User, Commodity } from "@/lib/types";
import SellerPreviewCard from "@/components/SellerPreviewCard";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { fetchRecentUserCommodities } from "@/actions/commodityActions";
import { fetchSellers } from "@/actions/userActions"; // Import new action for fetching sellers
import { useToast } from "@/hooks/use-toast";

// Seller Dashboard Content
function SellerDashboard({ user }: { user: User }) {
  const [userCommodities, setUserCommodities] = useState<Commodity[]>([]);
  const [isLoadingCommodities, setIsLoadingCommodities] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadRecentCommodities() {
      if (user?.uid) {
        setIsLoadingCommodities(true);
        try {
          const fetchedCommodities = await fetchRecentUserCommodities(user.uid, 3);
          setUserCommodities(fetchedCommodities);
        } catch (error) {
          console.error("Failed to fetch recent commodities:", error);
          toast({ variant: "destructive", title: "Error", description: "Could not load recent listings." });
        } finally {
          setIsLoadingCommodities(false);
        }
      }
    }
    loadRecentCommodities();
  }, [user?.uid, toast]);

  const profileCompletion = [
    user.name, user.email, user.phone, user.location, user.address, user.city, user.country, user.avatarUrl
  ].filter(Boolean).length;
  const totalProfileFields = 8;
  const completionPercentage = Math.round((profileCompletion / totalProfileFields) * 100);

  const quickStats = [
    { title: "Active Listings", value: userCommodities.length, icon: <List className="h-6 w-6 text-primary" />, color: "text-primary" },
    { title: "Profile Completion", value: completionPercentage, icon: <UserCircle className="h-6 w-6 text-green-500" />, unit: "%", color: "text-green-500" },
    { title: "Total Sales (Mock)", value: 0, icon: <DollarSign className="h-6 w-6 text-blue-500" />, unit: "USD", color: "text-blue-500" },
    { title: "Average Rating (Mock)", value: 0, icon: <Star className="h-6 w-6 text-yellow-500" />, unit: "/5", color: "text-yellow-500" },
  ];

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 font-headline">Welcome back, {user.name}!</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {quickStats.map(stat => (
          <Card key={stat.title} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.unit === "%" ? "" : stat.unit === "USD" ? "$" : ""}{stat.value}{stat.unit === "%" || stat.unit === "/5" ? stat.unit : ""}</div>
              {stat.title === "Profile Completion" && <Progress value={stat.value} className="mt-2 h-2" />}
              {stat.title !== "Profile Completion" && <p className="text-xs text-muted-foreground">Updated just now</p>}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="font-headline">Recent Listings</CardTitle>
              <CardDescription>Your most recently added commodities.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCommodities ? (
                 <ul className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <li key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                            <Skeleton className="h-[60px] w-[60px] rounded-md" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <Skeleton className="h-8 w-16 rounded-md" />
                        </li>
                    ))}
                </ul>
              ) : userCommodities.length > 0 ? (
                <ul className="space-y-4">
                  {userCommodities.map(commodity => (
                    <li key={commodity.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <Image src={commodity.imageUrl || 'https://placehold.co/80x80.png'} alt={commodity.name} width={60} height={60} className="rounded-md object-cover" data-ai-hint={commodity.dataAiHint || "commodity item"} />
                      <div className="flex-1">
                        <h3 className="font-semibold">{commodity.name}</h3>
                        <p className="text-sm text-muted-foreground">{commodity.categoryName} - ${commodity.price}/{commodity.unit}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/commodities/my-listings`}>View</Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">You haven&apos;t listed any commodities yet.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/dashboard/commodities/my-listings">View All Listings</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="font-headline">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button variant="default" className="w-full justify-start gap-2" asChild>
                <Link href="/dashboard/commodities/upload">
                  <UploadCloud className="h-5 w-5" /> Add New Commodity
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link href="/dashboard/profile">
                  <UserCircle className="h-5 w-5" /> Update Profile
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link href="/dashboard/market-trends">
                  <LineChart className="h-5 w-5" /> View Market Trends
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

// Buyer Dashboard Content
function BuyerDashboard({ user }: { user: User }) {
  const [potentialSellers, setPotentialSellers] = useState<User[]>([]);
  const [isLoadingSellers, setIsLoadingSellers] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadPotentialSellers() {
      setIsLoadingSellers(true);
      try {
        const fetchedSellers = await fetchSellers(6); // Fetch up to 6 sellers
        setPotentialSellers(fetchedSellers);
      } catch (error) {
        console.error("Failed to fetch sellers:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load potential sellers." });
      } finally {
        setIsLoadingSellers(false);
      }
    }
    loadPotentialSellers();
  }, [toast]);

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 font-headline">Welcome, {user.name}! Discover Commodities & Sellers</h1>
      
      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <Search className="mr-2 h-6 w-6 text-primary" /> Find Commodities
          </CardTitle>
          <CardDescription>Search for specific commodities available on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input type="search" placeholder="Search by commodity name, category, etc..." className="flex-grow" />
            <Button onClick={() => alert("Search functionality will take you to 'Find Commodities' page.")} asChild>
                <Link href="/dashboard/commodities/find">Search</Link>
            </Button>
          </div>
           <p className="text-xs text-muted-foreground mt-2">Tip: Click search to browse all available commodities.</p>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-2xl font-bold mb-6 font-headline flex items-center">
          <Users className="mr-3 h-7 w-7 text-primary" /> Featured Sellers
        </h2>
        {isLoadingSellers ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
               <Card key={i} className="overflow-hidden shadow-lg flex flex-col h-full">
                <CardHeader className="items-center text-center p-6">
                  <Skeleton className="h-24 w-24 rounded-full mb-3" />
                  <Skeleton className="h-6 w-3/4 mb-1" />
                  <Skeleton className="h-4 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-1/3" />
                </CardHeader>
                <CardContent className="p-4 flex-grow text-center">
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
                <CardFooter className="p-4 border-t">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : potentialSellers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {potentialSellers.map(seller => (
              // Ensure SellerPreviewCard uses seller.uid for the key and link
              <SellerPreviewCard key={seller.uid} seller={seller} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No sellers found at the moment. Please check back later.</p>
        )}
      </section>
    </>
  );
}


export default function DashboardPage() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!currentUser) {
    // This case should be rare due to ProtectedRoute, but good to have.
    // useRouter().push('/auth/login') could be called here if needed,
    // but ProtectedRoute handles it more globally.
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <p>Please log in to view the dashboard.</p>
        <Button asChild className="mt-4"><Link href="/auth/login">Login</Link></Button>
      </div>
    );
  }
  

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {currentUser.userType === 'seller' ? <SellerDashboard user={currentUser} /> : <BuyerDashboard user={currentUser} />}
    </div>
  );
}
