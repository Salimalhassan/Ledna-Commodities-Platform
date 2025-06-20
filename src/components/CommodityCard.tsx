
import Image from 'next/image';
import Link from 'next/link';
import type { Commodity } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, MapPin, Eye, Star, PlusCircle, CheckCircle } from 'lucide-react';
import { commodityCategories } from '@/data/placeholder'; // For icons
import { useToast } from '@/hooks/use-toast';

interface CommodityCardProps {
  commodity: Commodity;
  showFeatureManagement?: boolean;
}

export default function CommodityCard({ commodity, showFeatureManagement = false }: CommodityCardProps) {
  const { toast } = useToast();
  const categoryDetails = commodityCategories.find(cat => cat.id === commodity.categoryId);
  const CategoryIcon = categoryDetails?.icon;

  const handleFeatureListing = () => {
    // Placeholder: In a real app, this would call a server action
    // that might involve checks (permissions, payment) and then updates Firestore.
    console.log(`Attempting to feature commodity: ${commodity.id}, Name: ${commodity.name}`);
    toast({
      title: "Feature Listing (Placeholder)",
      description: `This functionality is not yet fully implemented. You would feature "${commodity.name}".`,
    });
    // Example of what a server action call might look like:
    // toggleCommodityFeatureStatus(commodity.id, commodity.isFeatured || false)
    //  .then(result => {
    //    if (result.success) {
    //      toast({ title: "Success", description: result.message });
    //      // You might need to re-fetch or update local state here
    //    } else {
    //      toast({ variant: "destructive", title: "Error", description: result.message });
    //    }
    //  });
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
          <Badge variant="default" className="absolute top-2 left-2 bg-accent text-accent-foreground shadow-md animate-pulse">
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
            <Badge variant="secondary" className="w-full justify-center py-2 text-base bg-green-100 text-green-700 border-green-300">
              <CheckCircle className="mr-2 h-5 w-5" /> Currently Featured
            </Badge>
          ) : (
            <Button 
              variant="outline" 
              className="w-full border-primary text-primary hover:bg-primary/10"
              onClick={handleFeatureListing}
            >
              <PlusCircle className="mr-2 h-5 w-5" /> Feature Listing (Placeholder)
            </Button>
          )
        ) : (
          // For general commodity cards, link to the seller's public profile
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

