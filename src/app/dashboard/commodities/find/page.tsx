
'use client';

import CommodityCard from '@/components/CommodityCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sampleCommodities, commodityCategories } from '@/data/placeholder';
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';
import type { Commodity } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function FindCommoditiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  // Add more filters for price range, location etc. if needed

  const filteredCommodities = sampleCommodities.filter(commodity => {
    const matchesSearchTerm = commodity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              commodity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? commodity.category.id === selectedCategory : true;
    // Add more filter conditions here
    return matchesSearchTerm && matchesCategory;
  });

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div className="lg:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-foreground mb-1">Search Term</label>
              <Input
                id="search"
                type="text"
                placeholder="e.g., Organic Maize, Fresh Apples..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-foreground mb-1">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
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
            {/* Add more filter inputs here, e.g., price range, location */}
          </div>
        </CardContent>
      </Card>
      

      {filteredCommodities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCommodities.map((commodity) => (
            <CommodityCard key={commodity.id} commodity={commodity} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Commodities Found</h2>
          <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </div>
  );
}
