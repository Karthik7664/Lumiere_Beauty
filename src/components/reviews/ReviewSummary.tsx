import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useReviewStats } from "@/hooks/useReviews";

interface ReviewSummaryProps {
  productId: string;
}

const ReviewSummary = ({ productId }: ReviewSummaryProps) => {
  const { averageRating, totalReviews, distribution } = useReviewStats(productId);

  if (totalReviews === 0) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 bg-muted/30 rounded-lg">
      {/* Average Rating */}
      <div className="text-center md:text-left">
        <div className="text-5xl font-bold text-foreground mb-2">
          {averageRating.toFixed(1)}
        </div>
        <div className="flex justify-center md:justify-start mb-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 ${
                averageRating >= star
                  ? "fill-primary text-primary"
                  : averageRating >= star - 0.5
                  ? "fill-primary/50 text-primary"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Distribution */}
      <div className="flex-1 space-y-2">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = distribution[stars as keyof typeof distribution];
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <div key={stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm">{stars}</span>
                <Star className="w-3 h-3 fill-primary text-primary" />
              </div>
              <Progress value={percentage} className="flex-1 h-2" />
              <span className="text-sm text-muted-foreground w-8">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewSummary;
