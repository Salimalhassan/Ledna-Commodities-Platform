
'use client';

import CommodityCard from '@/components/CommodityCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { commodityCategories } from '@/data/placeholder';
import { Search, Filter, Loader2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import type { Commodity } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { fetchCommodities } from '@/actions/commodityActions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';


export default function FindCommoditiesPage() {
  const [allCommodities, setAllCommodities] = useState<Commodity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('date_desc'); // default sort

  useEffect(() => {
    async function loadCommodities() {
      setIsLoading(true);
      try {
        const fetchedCommodities = await fetchCommodities();
        setAllCommodities(fetchedCommodities);
      } catch (error) {
        console.error("Failed to fetch commodities:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load commodities." });
      } finally {
        setIsLoading(false);
      }
    }
    loadCommodities();
  }, [toast]);

  const filteredCommodities = useMemo(() => {
    let commodities = allCommodities;

    // Text search filter
    if (searchTerm) {
      commodities = commodities.filter(commodity =>
        commodity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commodity.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Category filter
    if (selectedCategory) {
      commodities = commodities.filter(commodity => commodity.categoryId === selectedCategory);
    }
    
    // Price range filter
    if (minPrice) {
      commodities = commodities.filter(commodity => commodity.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      commodities = commodities.filter(commodity => commodity.price <= parseFloat(maxPrice));
    }

    // Location filter
    if (locationFilter) {
      commodities = commodities.filter(commodity =>
        commodity.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        commodities.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        commodities.sort((a, b) => b.price - a.price);
        break;
      case 'date_desc':
      default:
        commodities.sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime());
        break;
    }

    return commodities;
  }, [allCommodities, searchTerm, selectedCategory, minPrice, maxPrice, locationFilter, sortBy]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center">
          <Search className="mr-3 h-8 w-8 text-primary" /> Find Commodities
        </h1>
      </div>

      <Card className="mb-8 p-6 shadow-lg bg-muted/30">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-xl font-headline flex items-center">
            <Filter className="mr-2 h-5 w-5 text-primary" /> Search & Filter
          </CardTitle>
          <CardDescription>Refine your search to find the perfect commodities.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="lg:col-span-2">
              <Label htmlFor="search-term">Search Term</Label>
              <Input
                id="search-term"
                type="text"
                placeholder="e.g., Organic Maize..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
             <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={selectedCategory === '' ? '__all__' : selectedCategory}
                onValueChange={(value) => setSelectedCategory(value === '__all__' ? '' : value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Categories</SelectItem>
                  {commodityCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center">
                          {Icon && <Icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                          {category.name}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
             <div>
              <Label htmlFor="sort-by">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort-by">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_desc">Newest First</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="min-price">Min Price ($)</Label>
              <Input
                id="min-price"
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="max-price">Max Price ($)</Label>
              <Input
                id="max-price"
                type="number"
                placeholder="Any"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <div className="lg:col-span-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                placeholder="e.g., Nairobi, Kenya"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isLoading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden shadow-lg flex flex-col h-full">
              <Skeleton className="w-full h-48" />
              <CardContent className="p-4 flex-grow">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-5 w-1/2" />
              </CardContent>
              <CardFooter className="p-4 border-t">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredCommodities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCommodities.map((commodity) => (
            <CommodityCard key={commodity.id} commodity={commodity} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/40 rounded-lg">
          <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Commodities Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Try adjusting your search terms or filters. There may be no listings matching your current criteria.</p>
        </div>
      )}
    </div>
  );
}
