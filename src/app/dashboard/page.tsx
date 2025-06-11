
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { DollarSign, List, Package, Star, UploadCloud, UserCircle, LineChart, Search, Users } from "lucide-react";
import Image from "next/image";
import { sampleCommodities, getCurrentUser, sampleUsers } from "@/data/placeholder";
import type { User } from "@/lib/types";
import SellerPreviewCard from "@/components/SellerPreviewCard";
import { Input } from "@/components/ui/input";
import appLogo from '@/assets/logo.png';


// Seller Dashboard Content
function SellerDashboard({ user }: { user: User }) {
  const userCommodities = sampleCommodities.filter(c => c.sellerId === user.id);

  const quickStats = [
    { title: "Active Listings", value: userCommodities.length, icon: <List className="h-6 w-6 text-primary" />, color: "text-primary" },
    { title: "Profile Completion", value: 75, icon: <UserCircle className="h-6 w-6 text-green-500" />, unit: "%", color: "text-green-500" },
    { title: "Total Sales (Mock)", value: 1250, icon: <DollarSign className="h-6 w-6 text-blue-500" />, unit: "USD", color: "text-blue-500" },
    { title: "Average Rating (Mock)", value: 4.5, icon: <Star className="h-6 w-6 text-yellow-500" />, unit: "/5", color: "text-yellow-500" },
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
              {userCommodities.length > 0 ? (
                <ul className="space-y-4">
                  {userCommodities.slice(0, 3).map(commodity => (
                    <li key={commodity.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <Image src={commodity.imageUrl || 'https://placehold.co/80x80.png'} alt={commodity.name} width={60} height={60} className="rounded-md object-cover" data-ai-hint={commodity.dataAiHint || "commodity item"} />
                      <div className="flex-1">
                        <h3 className="font-semibold">{commodity.name}</h3>
                        <p className="text-sm text-muted-foreground">{commodity.category.name} - ${commodity.price}/{commodity.unit}</p>
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
  const potentialSellers = sampleUsers.filter(u => u.userType === 'seller');

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
            <Button>Search</Button>
          </div>
           <p className="text-xs text-muted-foreground mt-2">Tip: Try searching for "Maize", "Organic", or "Fruits". (Search functionality is a placeholder).</p>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-2xl font-bold mb-6 font-headline flex items-center">
          <Users className="mr-3 h-7 w-7 text-primary" /> Potential Sellers
        </h2>
        {potentialSellers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {potentialSellers.map(seller => (
              <SellerPreviewCard key={seller.id} seller={seller} />
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
  const user = getCurrentUser();

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {user.userType === 'seller' ? <SellerDashboard user={user} /> : <BuyerDashboard user={user} />}
    </div>
  );
}
