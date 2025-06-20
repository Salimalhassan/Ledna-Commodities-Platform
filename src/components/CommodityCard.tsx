
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Commodity } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, MapPin, Eye, Star, PlusCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { commodityCategories } from '@/data/placeholder'; // For icons
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { unfeatureCommodity } from '@/actions/commodityActions';
import { createCheckoutSession } from '@/actions/stripeActions';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe.js with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CommodityCardProps {
  commodity: Commodity;
  showFeatureManagement?: boolean;
  onFeatureStatusChange?: (commodityId: string, newStatus: boolean) => void;
}

export default function CommodityCard({ commodity, showFeatureManagement = false, onFeatureStatusChange }: CommodityCardProps) {
  const { toast } = useToast();
  const categoryDetails = commodityCategories.find(cat => cat.id === commodity.categoryId);
  const CategoryIcon = categoryDetails?.icon;
  const [isUnfeaturing, setIsUnfeaturing] = useState(false);
  const [isFeaturing, setIsFeaturing] = useState(false);

  // For simulation purposes
  const FEATURE_PRICE_USD = 5; // e.g., $5 USD
  const FEATURE_PRICE_CENTS = FEATURE_PRICE_USD * 100; // Stripe requires price in cents

  const handleUnfeature = async () => {
    setIsUnfeaturing(true);
    try {
      const result = await unfeatureCommodity(commodity.id);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        if (onFeatureStatusChange) {
          onFeatureStatusChange(commodity.id, false);
        }
      } else {
         toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        });
      }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Client Error",
        description: error instanceof Error ? error.message : "Failed to update feature status.",
      });
    } finally {
      setIsUnfeaturing(false);
    }
  }

  const handleFeatureRequest = async () => {
    setIsFeaturing(true);
    toast({ title: "Redirecting to payment..." });

    try {
      // 1. Create a checkout session on the server
      const { sessionId, error } = await createCheckoutSession({
        commodityId: commodity.id,
        commodityName: commodity.name,
        priceInCents: FEATURE_PRICE_CENTS,
      });

      if (error || !sessionId) {
        toast({ variant: "destructive", title: "Error", description: error || "Could not create a payment session." });
        setIsFeaturing(false);
        return;
      }
      
      // 2. Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        toast({ variant: "destructive", title: "Error", description: "Stripe.js has not loaded yet." });
        setIsFeaturing(false);
        return;
      }

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
      
      if (stripeError) {
         toast({ variant: "destructive", title: "Redirect Failed", description: stripeError.message });
         setIsFeaturing(false);
      }
      // If redirection fails, the user stays on the page and the loading state is turned off.
    } catch (clientError) {
      toast({ variant: "destructive", title: "Client Error", description: clientError instanceof Error ? clientError.message : "An unexpected error occurred." });
      setIsFeaturing(false);
    }
  }

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Image
          src={commodity.imageUrl || 'https://placehold.co/600x400.png'}
          alt={commodity.name}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
          data-ai-hint={commodity.dataAiHint || "commodity product"}
        />
        {commodity.isFeatured && (
          <Badge variant="default" className="absolute top-2 left-2 bg-accent text-accent-foreground shadow-md">
            <Star className="mr-1 h-3 w-3" /> Featured
          </Badge>
        )}
         {CategoryIcon && (
          <Badge variant="default" className="absolute top-2 right-2 bg-primary/80 text-primary-foreground backdrop-blur-sm">
            <CategoryIcon className="mr-1 h-4 w-4" /> {commodity.categoryName}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-headline mb-1">{commodity.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground min-h-[4rem] max-h-[4rem] overflow-hidden text-ellipsis">
          {commodity.description}
        </CardDescription>
        <div className="mt-3 space-y-1">
          <div className="flex items-center text-lg font-semibold text-primary">
            <DollarSign className="h-5 w-5 mr-1" /> {commodity.price} / {commodity.unit}
          </div>
          {commodity.location && (
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" /> {commodity.location}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        {showFeatureManagement ? (
          commodity.isFeatured ? (
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full border-destructive text-destructive hover:bg-destructive/10"
                  disabled={isUnfeaturing}
                >
                  {isUnfeaturing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <XCircle className="mr-2 h-s w-5" />}
                  Unfeature Listing
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unfeature Listing?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove the "Featured" status from "{commodity.name}"? 
                    This action does not issue a refund.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isUnfeaturing}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleUnfeature} disabled={isUnfeaturing} className="bg-destructive hover:bg-destructive/90">
                    {isUnfeaturing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Yes, Unfeature
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary/10"
                  disabled={isFeaturing}
                >
                  {isFeaturing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PlusCircle className="mr-2 h-5 w-5" />}
                  Feature Listing
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Feature Your Listing?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Make "{commodity.name}" a featured listing to increase its visibility.
                    This service costs ${FEATURE_PRICE_USD}. Clicking 'Proceed to Payment' will redirect you to our secure payment processor.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isFeaturing}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleFeatureRequest} disabled={isFeaturing} className="bg-primary hover:bg-primary/90">
                     {isFeaturing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Proceed to Payment (${FEATURE_PRICE_USD})
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )
        ) : (
          <Button asChild className="w-full">
            <Link href={`/sellers/${commodity.sellerId}`}>
              <Eye className="mr-2 h-4 w-4" /> View Seller: {commodity.sellerName}
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
