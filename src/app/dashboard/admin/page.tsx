
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Package, Star } from "lucide-react";
import { fetchAdminDashboardStats } from "@/actions/adminActions";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

async function StatCard({ title, value, icon, description }: { title: string, value: number, icon: React.ReactNode, description?: string }) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}

export default async function AdminDashboardPage() {
  const stats = await fetchAdminDashboardStats();

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8 font-headline flex items-center">
        <Shield className="mr-3 h-8 w-8 text-primary" /> Admin Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="h-6 w-6 text-primary" />}
          description="Total number of registered users."
        />
        <StatCard
          title="Total Listings"
          value={stats.totalListings}
          icon={<Package className="h-6 w-6 text-blue-500" />}
          description="Total commodities listed on the platform."
        />
        <StatCard
          title="Total Reviews"
          value={stats.totalReviews}
          icon={<Star className="h-6 w-6 text-yellow-500" />}
          description="Total reviews submitted by users."
        />
      </div>

       <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline">Management Sections</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link href="#">
                    <Users className="h-5 w-5" /> Manage Users (Coming Soon)
                </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link href="#">
                    <Package className="h-5 w-5" /> Manage Listings (Coming Soon)
                </Link>
            </Button>
             <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link href="#">
                    <Star className="h-5 w-5" /> Manage Reviews (Coming Soon)
                </Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
