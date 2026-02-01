import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { WishlistItem, Product } from "@/types/ecommerce";
import { useToast } from "@/hooks/use-toast";

interface WishlistContextType {
  items: WishlistItem[];
  loading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const { data: wishlistItems, error } = await supabase
        .from("wishlists")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      if (wishlistItems && wishlistItems.length > 0) {
        const productIds = wishlistItems.map((item) => item.product_id);
        const { data: products, error: productsError } = await supabase
          .from("products")
          .select("*")
          .in("id", productIds);

        if (productsError) throw productsError;

        const itemsWithProducts = wishlistItems.map((item) => ({
          ...item,
          product: products?.find((p) => p.id === item.product_id) as Product,
        }));

        setItems(itemsWithProducts);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (productId: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("wishlists").insert({
        user_id: user.id,
        product_id: productId,
      });

      if (error) throw error;
      await fetchWishlist();
      toast({
        title: "Added to wishlist",
        description: "Item has been added to your wishlist",
      });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive",
      });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) throw error;
      await fetchWishlist();
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist",
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.product_id === productId);
  };

  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
