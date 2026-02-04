import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Review } from "@/types/review";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profile names separately
      const reviewsWithProfiles = await Promise.all(
        data.map(async (review) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", review.user_id)
            .maybeSingle();
          return { ...review, profile } as Review & { profile: { name: string | null } | null };
        })
      );

      return reviewsWithProfiles;
    },
    enabled: !!productId,
  });
};

export const useUserReview = (productId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["reviews", productId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Review | null;
    },
    enabled: !!productId && !!user,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      productId,
      rating,
      title,
      comment,
    }: {
      productId: string;
      rating: number;
      title?: string;
      comment?: string;
    }) => {
      if (!user) throw new Error("Must be logged in to review");

      const { data, error } = await supabase
        .from("reviews")
        .insert({
          product_id: productId,
          user_id: user.id,
          rating,
          title: title || null,
          comment: comment || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      toast.success("Review submitted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit review");
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      rating,
      title,
      comment,
    }: {
      reviewId: string;
      productId: string;
      rating: number;
      title?: string;
      comment?: string;
    }) => {
      const { data, error } = await supabase
        .from("reviews")
        .update({
          rating,
          title: title || null,
          comment: comment || null,
        })
        .eq("id", reviewId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.productId] });
      toast.success("Review updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update review");
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId }: { reviewId: string; productId: string }) => {
      const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.productId] });
      toast.success("Review deleted");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete review");
    },
  });
};

export const useReviewStats = (productId: string) => {
  const { data: reviews } = useProductReviews(productId);

  if (!reviews || reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  reviews.forEach((r) => {
    distribution[r.rating as keyof typeof distribution]++;
  });

  return { averageRating, totalReviews, distribution };
};
