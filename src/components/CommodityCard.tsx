
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Commodity } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, MapPin, Eye, Star, PlusCircle, XCircle, Loader2, Pencil, Trash2 } from 'lucide-react';
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
import { unfeatureCommodity, handleDeleteCommodity } from '@/actions/commodityActions';
import { createPaystackTransaction } from '@/actions/paystackActions'; // New Paystack Action
import { useAuth } from '@/context/AuthContext'; // To get user email

interface CommodityCardProps {
  commodity: Commodity;
  showFeatureManagement?: boolean;
  onFeatureStatusChange?: (commodityId: string, newStatus: boolean) => void;
  onDelete?: (commodityId: string) => void;
}

export default function CommodityCard({ 
  commodity, 
  showFeatureManagement = false, 
  onFeatureStatusChange,
  onDelete,
}: CommodityCardProps) {
  const { toast } = useToast();
  const { currentUser } = useAuth(); // Get current user
  const categoryDetails = commodityCategories.find(cat => cat.id === commodity.categoryId);
  const CategoryIcon = categoryDetails?.icon;
  const [isUnfeaturing, setIsUnfeaturing] = useState(false);
  const [isFeaturing, setIsFeaturing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // For simulation/display purposes.
  const FEATURE_PRICE_USD = 5; // Example price
  const FEATURE_PRICE_CENTS = FEATURE_PRICE_USD * 100; // Paystack uses lowest currency unit (kobo/cents)

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
    if (!currentUser?.email) {
      toast({ variant: "destructive", title: "Authentication Error", description: "Could not find your email. Please log in again." });
      return;
    }
    
    setIsFeaturing(true);
    toast({ title: "Initializing payment..." });

    try {
      // 1. Create a transaction session on the server
      const { authorization_url, error } = await createPaystackTransaction({
        commodityId: commodity.id,
        commodityName: commodity.name,
        priceInKobo: FEATURE_PRICE_CENTS, // Using example price in cents
        userEmail: currentUser.email,
        currency: 'USD', // Specify currency
      });

      if (error || !authorization_url) {
        toast({ variant: "destructive", title: "Error", description: error || "Could not create a payment session." });
        setIsFeaturing(false);
        return;
      }
      
      // 2. Redirect to Paystack Checkout page
      window.location.href = authorization_url;

    } catch (clientError) {
      toast({ variant: "destructive", title: "Client Error", description: clientError instanceof Error ? clientError.message : "An unexpected error occurred." });
      setIsFeaturing(false);
    }
  }
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await handleDeleteCommodity(commodity.id);
      if (result.success) {
        toast({ title: "Success", description: result.message });
        if (onDelete) {
          onDelete(commodity.id);
        }
      } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Client Error",
        description: error instanceof Error ? error.message : "Failed to delete listing.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const renderFooter = () => {
    if (showFeatureManagement) {
      const FeatureButton = commodity.isFeatured ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10" disabled={isUnfeaturing}>
              {isUnfeaturing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <XCircle className="mr-2 h-s w-5" />}
              Unfeature Listing
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unfeature Listing?</AlertDialogTitle>
              <AlertDialogDescription>Are you sure you want to remove the "Featured" status from "{commodity.name}"? This action does not issue a refund.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isUnfeaturing}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleUnfeature} disabled={isUnfeaturing} className="bg-destructive hover:bg-destructive/90">
                {isUnfeaturing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Yes, Unfeature
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10" disabled={isFeaturing}>
              {isFeaturing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PlusCircle className="mr-2 h-5 w-5" />}
              Feature Listing
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Feature Your Listing?</AlertDialogTitle>
              <AlertDialogDescription>Make "{commodity.name}" a featured listing to increase its visibility. This service costs ${FEATURE_PRICE_USD}. Clicking 'Proceed to Payment' will redirect you to our secure payment processor, Paystack.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isFeaturing}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleFeatureRequest} disabled={isFeaturing} className="bg-primary hover:bg-primary/90">
                {isFeaturing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Proceed to Payment (${FEATURE_PRICE_USD})
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
      
      return (
        <div className="flex flex-col gap-2">
          {FeatureButton}
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" asChild className="w-full">
              <Link href={`/dashboard/commodities/edit/${commodity.id}`}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="w-full" disabled={isDeleting}>
                   {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />} Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone. This will permanently delete the listing for "{commodity.name}".</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                    {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Yes, Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      );
    }
    
    // Default button
    return (
      <Button asChild className="w-full">
        <Link href={`/sellers/${commodity.sellerId}`}>
          <Eye className="mr-2 h-4 w-4" /> View Seller: {commodity.sellerName}
        </Link>
      </Button>
    );
  };


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
        {renderFooter()}
      </CardFooter>
    </Card>
  );
}
