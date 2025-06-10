'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CommodityUploadSchema } from '@/lib/schemas';
import { commodityCategories, getCurrentUser } from '@/data/placeholder';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CommodityUploadPage() {
  const currentUser = getCurrentUser();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof CommodityUploadSchema>>({
    resolver: zodResolver(CommodityUploadSchema),
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
      price: 0,
      unit: '',
      imageUrl: '',
      sellerContact: currentUser.phone || '',
      location: currentUser.location || '',
      externalLink: '',
    },
  });

  function onSubmit(values: z.infer<typeof CommodityUploadSchema>) {
    console.log('Commodity uploaded:', values);
    toast({
      title: 'Commodity Listed (Placeholder)',
      description: `${values.name} has been successfully listed.`,
    });
    // In a real app, you would save the data and then redirect or clear form
    router.push('/dashboard/commodities/my-listings');
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-headline flex items-center">
            <UploadCloud className="mr-3 h-7 w-7 text-primary" /> List a New Commodity
          </CardTitle>
          <CardDescription>Fill in the details below to add your product to the marketplace.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commodity Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Organic Maize" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea placeholder="Detailed description of your commodity..." {...field} rows={4} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl>
                       <FormDescription>Link to an image of your commodity.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl><Input placeholder="e.g., kg, tonne, piece" {...field} /></FormControl>
                       <FormDescription>Specify the unit of measurement for the price.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl><Input placeholder="e.g., Nairobi, Kenya" {...field} /></FormControl>
                    <FormDescription>Where is the commodity located?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sellerContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Information (Optional)</FormLabel>
                    <FormControl><Input placeholder="Your phone or email for buyers" {...field} /></FormControl>
                    <FormDescription>How buyers can reach you. Defaults to your profile phone if empty.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="externalLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>External Page Link (Optional)</FormLabel>
                    <FormControl><Input placeholder="https://yourwebsite.com/product" {...field} /></FormControl>
                     <FormDescription>Link to your own product page or social media.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-4">
                <Button type="submit" size="lg">List Commodity</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
