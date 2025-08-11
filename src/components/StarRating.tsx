import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const StarRating = ({ 
  rating, 
  onRatingChange, 
  readonly = false,
  size = 'md'
}: StarRatingProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating)
    }
  }

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleStarClick(star)}
          disabled={readonly}
          className={cn(
            'transition-colors duration-200',
            !readonly && 'hover:text-amber-400 cursor-pointer',
            readonly && 'cursor-default'
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              'transition-colors duration-200',
              star <= rating 
                ? 'fill-amber-400 text-amber-400' 
                : 'text-muted-foreground'
            )}
          />
        </button>
      ))}
    </div>
  )
}