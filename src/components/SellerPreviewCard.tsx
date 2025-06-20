
import Image from 'next/image';
import Link from 'next/link';
import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, ShieldCheck } from 'lucide-react';

interface SellerPreviewCardProps {
  seller: User;
}

export default function SellerPreviewCard({ seller }: SellerPreviewCardProps) {
  const sellerInitials = seller.name ? seller.name.split(' ').map(n => n[0]).join('').toUpperCase() : "S";

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="items-center text-center p-6">
        <Avatar className="h-24 w-24 mb-3 border-2 border-primary">
          <AvatarImage src={seller.avatarUrl || `https://avatar.vercel.sh/${seller.email}.png`} alt={seller.name} data-ai-hint={seller.dataAiHint || "person business"} />
          <AvatarFallback className="text-3xl">{sellerInitials}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl font-headline">{seller.name || "Seller"}</CardTitle>
        {seller.isVerified && (
          <div className="flex items-center text-xs text-green-600 mt-1">
            <ShieldCheck className="h-3 w-3 mr-1" /> Verified Seller
          </div>
        )}
        <CardDescription className="text-xs text-muted-foreground mt-1 flex items-center">
          <MapPin className="h-3 w-3 mr-1" /> {seller.location || 'Location not specified'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 flex-grow text-center">
        <p className="text-sm text-muted-foreground">
          Explore commodities from {seller.name || "this seller"}. Specializing in high-quality agricultural products.
        </p>
        {/* Placeholder for a few commodity images or names if needed */}
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button asChild className="w-full">
          {/* Ensure the link uses seller.uid which is the document ID from Firestore */}
          <Link href={`/sellers/${seller.uid}`}>View Profile & Listings</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
