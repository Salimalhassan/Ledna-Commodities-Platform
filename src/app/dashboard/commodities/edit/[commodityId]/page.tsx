
'use client';

import { useState, useEffect } from 'react';
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
import { commodityCategories } from '@/data/placeholder';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { handleUpdateCommodity, fetchCommodityById } from '@/actions/commodityActions';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import type { Commodity } from '@/lib/types';
import Link from 'next/link';

export default function EditCommodityPage({ params }: { params: { commodityId: string } }) {
  const { commodityId } = params;
  const { currentUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [commodity, setCommodity] = useState<Commodity | null>(null);

  const form = useForm<z.infer<typeof CommodityUploadSchema>>({
    resolver: zodResolver(CommodityUploadSchema),
    defaultValues: {},
  });

  useEffect(() => {
    async function loadCommodity() {
      if (!commodityId) {
        router.push('/dashboard');
        return;
      }
      setIsLoadingData(true);
      try {
        const fetchedCommodity = await fetchCommodityById(commodityId);
        if (fetchedCommodity) {
          if (currentUser && fetchedCommodity.sellerId === currentUser.uid) {
            setCommodity(fetchedCommodity);
            form.reset({
              name: fetchedCommodity.name,
              description: fetchedCommodity.description,
              categoryId: fetchedCommodity.categoryId,
              price: fetchedCommodity.price,
              unit: fetchedCommodity.unit,
              imageUrl: fetchedCommodity.imageUrl || '',
              sellerContact: fetchedCommodity.sellerContact || '',
              location: fetchedCommodity.location || '',
              externalLink: fetchedCommodity.externalLink || '',
            });
          } else {
            toast({ variant: 'destructive', title: 'Access Denied', description: 'You are not authorized to edit this listing.' });
            router.push('/dashboard/commodities/my-listings');
          }
        } else {
          toast({ variant: 'destructive', title: 'Not Found', description: 'This commodity listing could not be found.' });
          router.push('/dashboard/commodities/my-listings');
        }
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to load commodity data.' });
        router.push('/dashboard/commodities/my-listings');
      } finally {
        setIsLoadingData(false);
      }
    }
    if (!authLoading && currentUser) {
      loadCommodity();
    }
     if (!authLoading && !currentUser) {
        router.push('/auth/login');
    }
  }, [commodityId, currentUser, authLoading, router, toast, form]);

  async function onSubmit(values: z.infer<typeof CommodityUploadSchema>) {
    if (!currentUser?.uid || !commodity) {
      toast({ variant: 'destructive', title: 'Error', description: 'Authentication error or commodity not found.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await handleUpdateCommodity(commodity.id, values);
      if (result.success) {
        toast({
          title: 'Update Successful',
          description: result.message,
        });
        router.push('/dashboard/commodities/my-listings');
      } else {
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: result.error || 'An unexpected error occurred.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update commodity due to a client-side error.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authLoading || isLoadingData) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <Card className="max-w-3xl mx-auto shadow-xl">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            <div className="flex justify-end pt-4 gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-headline flex items-center">
            <Pencil className="mr-3 h-7 w-7 text-primary" /> Edit Commodity Listing
          </CardTitle>
          <CardDescription>Update the details for "{commodity?.name}".</CardDescription>
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
                    <FormControl><Input placeholder="e.g., Organic Maize" {...field} disabled={isSubmitting} /></FormControl>
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
                    <FormControl><Textarea placeholder="Detailed description of your commodity..." {...field} rows={4} disabled={isSubmitting} /></FormControl>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
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
                      <FormControl><Input placeholder="https://example.com/image.jpg" {...field} disabled={isSubmitting} /></FormControl>
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
                      <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} disabled={isSubmitting} /></FormControl>
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
                      <FormControl><Input placeholder="e.g., kg, tonne, piece" {...field} disabled={isSubmitting} /></FormControl>
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
                    <FormControl><Input placeholder="e.g., Nairobi, Kenya" {...field} disabled={isSubmitting} /></FormControl>
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
                    <FormControl><Input placeholder="Your phone or email for buyers" {...field} disabled={isSubmitting} /></FormControl>
                    <FormDescription>How buyers can reach you.</FormDescription>
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
                    <FormControl><Input placeholder="https://yourwebsite.com/product" {...field} disabled={isSubmitting} /></FormControl>
                    <FormDescription>Link to your own product page or social media.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-4 gap-4">
                 <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/commodities/my-listings">Cancel</Link>
                </Button>
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                   ) : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
