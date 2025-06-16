
import Image from 'next/image';
import { sampleUsers, sampleCommodities, sampleReviews } from '@/data/placeholder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import CommodityCard from '@/components/CommodityCard';
import ReviewCard from '@/components/ReviewCard';
import RatingStars from '@/components/RatingStars';
import PublicHeader from '@/components/layout/PublicHeader';
import { Mail, MapPin, Phone, ShieldCheck, Star, Lock } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SellerProfilePage({ params }: { params: { sellerId: string } }) {
  const seller = sampleUsers.find(u => u.id === params.sellerId);

  if (!seller) {
    return (
      <>
        <PublicHeader />
        <div className="container mx-auto py-12 text-center">
          <h1 className="text-2xl font-bold">Seller Not Found</h1>
          <p className="text-muted-foreground">The seller you are looking for does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>
      </>
    );
  }

  const sellerCommodities = sampleCommodities.filter(c => c.sellerId === seller.id);
  const sellerReviews = sampleReviews.filter(r => r.sellerId === seller.id);
  const averageRating = sellerReviews.length > 0
    ? sellerReviews.reduce((acc, r) => acc + r.rating, 0) / sellerReviews.length
    : 0;
  const sellerInitials = seller.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <>
      <PublicHeader />
      <main className="container mx-auto py-8 px-4 md:px-6">
        <Card className="mb-8 shadow-xl overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-primary/20 to-accent/20">
             <Image
                src="https://placehold.co/1200x300.png"
                alt={`${seller.name}'s cover photo`}
                fill
                style={{objectFit: 'cover'}}
                className="opacity-50"
                data-ai-hint="farm pattern"
             />
          </div>
          <CardContent className="p-6 pt-0 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-20 space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-lg">
                <AvatarImage src={seller.avatarUrl || `https://avatar.vercel.sh/${seller.email}.png`} alt={seller.name} data-ai-hint={seller.dataAiHint || "person business"}/>
                <AvatarFallback className="text-5xl">{sellerInitials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left pt-4">
                <CardTitle className="text-3xl font-bold font-headline">{seller.name}</CardTitle>
                {seller.isVerified && (
                  <span className="inline-flex items-center text-sm text-green-600 font-medium mt-1">
                    <ShieldCheck className="h-4 w-4 mr-1" /> Verified Seller
                  </span>
                )}
                <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" /> {seller.location || 'Location not specified'}
                </div>
              </div>
              <div className="flex flex-col items-center md:items-end">
                <RatingStars rating={averageRating} size={6} />
                <p className="text-sm text-muted-foreground mt-1">
                  {averageRating > 0 ? `${averageRating.toFixed(1)} (${sellerReviews.length} reviews)` : 'No reviews yet'}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t pt-6 space-y-4">
              <Alert variant="default" className="bg-primary/10 border-primary/30">
                <Lock className="h-5 w-5 text-primary" />
                <AlertTitle className="font-headline text-primary">Connect with {seller.name}</AlertTitle>
                <AlertDescription className="text-primary/80">
                  Good news! Your first 3 seller contacts on Ledna are free. This allows you to view full details and initiate conversations. After your free contacts are used, a premium subscription will be needed to continue connecting with new sellers. (This is a placeholder for monetization and free trial tracking).
                </AlertDescription>
                <Button className="mt-3">Contact {seller.name}</Button>
              </Alert>

              <div className="space-y-2 text-sm text-foreground/80">
                  <p className="flex items-center"><Mail className="h-4 w-4 mr-2 text-primary/50" /> <span className="italic text-muted-foreground">Email hidden - Contact seller to view</span></p>
                  {seller.phone && <p className="flex items-center"><Phone className="h-4 w-4 mr-2 text-primary/50" /> <span className="italic text-muted-foreground">Phone hidden - Contact seller to view</span></p>}
                  {seller.address && <p className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-primary/50" /> <span className="italic text-muted-foreground">Full address hidden - Contact seller to view ({seller.city}, {seller.country})</span></p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 font-headline">Commodities by {seller.name}</h2>
          {sellerCommodities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sellerCommodities.map((commodity) => (
                <CommodityCard key={commodity.id} commodity={commodity} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">This seller has no active listings.</p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 font-headline">Seller Reputation & Reviews</h2>
          {sellerReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sellerReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">This seller has not received any reviews yet.</p>
          )}
        </section>
      </main>
    </>
  );
}
