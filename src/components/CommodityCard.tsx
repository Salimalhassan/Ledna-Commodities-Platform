
import Image from 'next/image';
import Link from 'next/link';
import type { Commodity } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, MapPin, Eye } from 'lucide-react';

interface CommodityCardProps {
  commodity: Commodity;
}

export default function CommodityCard({ commodity }: CommodityCardProps) {
  const CategoryIcon = commodity.category.icon;
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
         {CategoryIcon && (
          <Badge variant="default" className="absolute top-2 right-2 bg-primary/80 text-primary-foreground backdrop-blur-sm">
            <CategoryIcon className="mr-1 h-4 w-4" /> {commodity.category.name}
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
        <Button asChild className="w-full">
          <Link href={`/sellers/${commodity.sellerId}`}>
            <Eye className="mr-2 h-4 w-4" /> View Seller Profile
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
