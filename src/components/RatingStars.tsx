import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
  iconClassName?: string;
}

export default function RatingStars({
  rating,
  maxRating = 5,
  size = 5, // Corresponds to h-5 w-5
  className,
  iconClassName,
}: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array(fullStars)
        .fill(0)
        .map((_, i) => (
          <Star key={`full-${i}`} className={cn(`h-${size} w-${size} text-accent fill-accent`, iconClassName)} />
        ))}
      {halfStar && <StarHalf className={cn(`h-${size} w-${size} text-accent fill-accent`, iconClassName)} />}
      {Array(emptyStars)
        .fill(0)
        .map((_, i) => (
          <Star key={`empty-${i}`} className={cn(`h-${size} w-${size} text-muted-foreground/50 fill-muted-foreground/20`, iconClassName)} />
        ))}
    </div>
  );
}
