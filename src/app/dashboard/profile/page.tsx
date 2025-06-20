
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
import { UserProfileSchema } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UploadCloud, ShieldCheck } from 'lucide-react';
import { handleUpdateProfile } from '@/actions/profileActions';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import type { User } from '@/lib/types';

export default function ProfilePage() {
  const { currentUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);

  const form = useForm<z.infer<typeof UserProfileSchema>>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      avatarUrl: '',
      verificationType: '',
      verificationNumber: '',
      primarySpokenLanguage: '',
    },
  });

  useEffect(() => {
    if (!authLoading && currentUser) {
      form.reset({
        name: currentUser.name || '',
        email: currentUser.email || '', 
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        country: currentUser.country || '',
        avatarUrl: currentUser.avatarUrl || '',
        verificationType: currentUser.verificationType || '',
        verificationNumber: currentUser.verificationNumber || '',
        primarySpokenLanguage: currentUser.primarySpokenLanguage || '',
      });
      setIsFetchingProfile(false);
    } else if (!authLoading && !currentUser) {
        setIsFetchingProfile(false);
    }
  }, [currentUser, authLoading, form]);


  async function onSubmit(values: z.infer<typeof UserProfileSchema>) {
    if (!currentUser?.uid) {
      toast({ variant: 'destructive', title: 'Error', description: 'User not authenticated.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await handleUpdateProfile(currentUser.uid, values);
      if (result.success) {
        toast({
          title: 'Profile Updated',
          description: result.message,
        });
        // AuthContext will re-fetch user data on next auth state change or app reload
        // For immediate update, you might need to trigger a re-fetch in AuthContext or update its state.
      } else {
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: result.error || 'An unexpected error occurred.',
        });
      }
    } catch (error) {
      console.error('Profile update client error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit profile update due to a client-side error.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  if (authLoading || isFetchingProfile) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
        <Skeleton className="h-10 w-1/3 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 shadow-md">
            <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Skeleton className="h-32 w-32 rounded-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
          <Card className="lg:col-span-2 shadow-md">
            <CardHeader><Skeleton className="h-6 w-1/3" /><Skeleton className="h-4 w-1/2 mt-2" /></CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-10 w-full" /> <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" /> <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
         <Skeleton className="h-10 w-24 self-end" />
      </div>
    );
  }

  if (!currentUser) {
     return <div className="container mx-auto py-8 px-4 md:px-6">Please log in to view your profile.</div>;
  }

  const userInitials = currentUser.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8 font-headline">Manage Your Profile</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 shadow-md">
              <CardHeader>
                <CardTitle className="font-headline">Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={form.watch('avatarUrl') || currentUser.avatarUrl || `https://avatar.vercel.sh/${currentUser.email}.png`} alt={currentUser.name} data-ai-hint={currentUser.avatarUrl ? undefined : "abstract pattern person"} />
                  <AvatarFallback className="text-4xl">{userInitials}</AvatarFallback>
                </Avatar>
                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Avatar URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/avatar.png" {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormDescription>Enter the URL of your profile picture.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="outline" className="w-full" disabled>
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload Image (Disabled)
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 shadow-md">
              <CardHeader>
                <CardTitle className="font-headline">Personal Information</CardTitle>
                <CardDescription>Update your personal details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (Read-only)</FormLabel>
                        <FormControl><Input {...field} readOnly disabled={isSubmitting || true} /></FormControl>
                        <FormDescription>Email is managed via your authentication provider.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input placeholder="+254 700 000 000" {...field} disabled={isSubmitting} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="primarySpokenLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Spoken Language</FormLabel>
                      <FormControl><Input placeholder="e.g., English, Swahili, Tiv" {...field} disabled={isSubmitting} /></FormControl>
                      <FormDescription>Your main language. This may be added to your AI translator options for your convenience.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl><Textarea placeholder="123 Main St, Apt 4B" {...field} disabled={isSubmitting} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl><Input placeholder="Nairobi" {...field} disabled={isSubmitting} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl><Input placeholder="Kenya" {...field} disabled={isSubmitting} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="font-headline flex items-center">
                <ShieldCheck className="mr-2 h-6 w-6 text-primary" /> Identity Verification
              </CardTitle>
              <CardDescription>Verify your identity to build trust on the platform. (Feature is UI only for document upload)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="verificationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Document Type</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === '__none__' ? '' : value)}
                        value={field.value === '' ? '__none__' : field.value || undefined}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NIN">National ID (NIN)</SelectItem>
                          <SelectItem value="Passport">International Passport</SelectItem>
                          <SelectItem value="__none__">None</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="verificationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Number</FormLabel>
                      <FormControl><Input placeholder="Enter document number" {...field} disabled={isSubmitting} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormItem>
                <FormLabel>Upload Document Scan (Placeholder)</FormLabel>
                <FormControl>
                  <Input type="file" disabled />
                </FormControl>
                <FormDescription>Upload a clear scan of your selected document. Max file size 5MB.</FormDescription>
              </FormItem>
               {currentUser.isVerified && (
                <p className="text-green-600 font-medium flex items-center"><ShieldCheck className="mr-2 h-5 w-5"/> You are verified!</p>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || authLoading || isFetchingProfile}>
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
