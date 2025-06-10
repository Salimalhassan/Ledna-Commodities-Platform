import type { Review } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import RatingStars from './RatingStars';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const reviewerInitials = review.reviewerName.split(' ').map(n => n[0]).join('').toUpperCase();
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={`https://avatar.vercel.sh/${review.reviewerName.replace(' ', '')}.png`} alt={review.reviewerName} data-ai-hint="person icon" />
          <AvatarFallback>{reviewerInitials}</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5">
          <CardTitle className="text-base font-semibold">{review.reviewerName}</CardTitle>
          <div className="flex items-center gap-2">
             <RatingStars rating={review.rating} size={4} />
             <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
             </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-foreground/90">{review.comment}</p>
      </CardContent>
    </Card>
  );
}
