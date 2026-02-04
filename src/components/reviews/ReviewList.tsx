import { Star, ThumbsUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useProductReviews, useDeleteReview } from "@/hooks/useReviews";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";

interface ReviewListProps {
  productId: string;
}

const ReviewList = ({ productId }: ReviewListProps) => {
  const { user } = useAuth();
  const { data: reviews, isLoading } = useProductReviews(productId);
  const deleteReview = useDeleteReview();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-border rounded-lg p-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border border-border rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-4 h-4",
                        review.rating >= star
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>
                {review.verified_purchase && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    Verified Purchase
                  </span>
                )}
              </div>
              {review.title && (
                <h4 className="font-semibold text-foreground">{review.title}</h4>
              )}
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>{review.profile?.name || "Anonymous"}</p>
              <p>{formatDistanceToNow(new Date(review.created_at))} ago</p>
            </div>
          </div>

          {review.comment && (
            <p className="text-muted-foreground mb-3">{review.comment}</p>
          )}

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <ThumbsUp className="w-4 h-4 mr-1" />
              Helpful ({review.helpful_count})
            </Button>
            {user?.id === review.user_id && (
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() =>
                  deleteReview.mutate({ reviewId: review.id, productId })
                }
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
