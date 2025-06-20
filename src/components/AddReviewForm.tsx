
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type * as z from 'zod';
import { ReviewSchema } from '@/lib/schemas';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { addReview } from '@/actions/reviewActions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Star, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddReviewFormProps {
  sellerId: string;
  onReviewSubmit: () => void;
}

export default function AddReviewForm({ sellerId, onReviewSubmit }: AddReviewFormProps) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<z.infer<typeof ReviewSchema>>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const selectedRating = form.watch('rating');

  async function onSubmit(values: z.infer<typeof ReviewSchema>) {
    if (!currentUser) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to submit a review.' });
      return;
    }
    if (currentUser.userType !== 'buyer') {
      toast({ variant: 'destructive', title: 'Action Not Allowed', description: 'Only buyers can submit reviews.' });
      return;
    }
    if (currentUser.uid === sellerId) {
      toast({ variant: 'destructive', title: 'Action Not Allowed', description: 'You cannot review yourself.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await addReview({
        sellerId,
        reviewerUid: currentUser.uid,
        reviewerName: currentUser.name,
        rating: values.rating,
        comment: values.comment,
      });

      if (result.success) {
        toast({ title: 'Review Submitted', description: 'Thank you for your feedback!' });
        form.reset();
        onReviewSubmit();
      } else {
        toast({ variant: 'destructive', title: 'Submission Failed', description: result.error || 'An unexpected error occurred.' });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to submit review.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mb-8 shadow-md bg-muted/30">
      <CardHeader>
        <CardTitle className="font-headline">Leave a Review</CardTitle>
        <CardDescription>Share your experience with this seller.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            'h-8 w-8 cursor-pointer transition-colors',
                            (hoverRating >= star || selectedRating >= star)
                              ? 'text-accent fill-accent'
                              : 'text-muted-foreground/50'
                          )}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => field.onChange(star)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your experience, the quality of the products, etc."
                      {...field}
                      rows={4}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting || selectedRating === 0}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Review
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
