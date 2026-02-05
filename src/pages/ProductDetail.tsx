import { useParams, Link } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  Minus,
  Plus,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewSummary from "@/components/reviews/ReviewSummary";
import { formatPrice } from "@/lib/currency";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug || "");
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button asChild>
            <Link to="/">Return Home</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              className="w-full aspect-square object-cover rounded-lg"
            />
            {product.badge && (
              <Badge className="absolute top-4 left-4">{product.badge}</Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-primary font-medium uppercase tracking-wider">
                {product.brand}
              </span>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">
                  ({product.reviews_count.toLocaleString()} reviews)
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.original_price)}
                  </span>
                  <Badge variant="destructive">
                    {Math.round(
                      ((product.original_price - product.price) /
                        product.original_price) *
                        100
                    )}
                    % OFF
                  </Badge>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground">
              {product.detailed_description || product.description}
            </p>

            <Separator />

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium text-lg">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  {inCart ? "Add More" : "Add to Cart"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => toggleWishlist(product.id)}
                  className={cn(
                    inWishlist && "text-destructive border-destructive"
                  )}
                >
                  <Heart
                    className={cn("h-5 w-5", inWishlist && "fill-current")}
                  />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6">
              <div className="flex flex-col items-center text-center">
                <Truck className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-medium">Free Shipping</span>
                <span className="text-xs text-muted-foreground">
                  On orders ₹999+
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-medium">Secure Payment</span>
                <span className="text-xs text-muted-foreground">
                  COD Available
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-medium">Easy Returns</span>
                <span className="text-xs text-muted-foreground">
                  30-day policy
                </span>
              </div>
            </div>

            <Separator />

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Key Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, index) => (
                    <Badge key={index} variant="secondary">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* How to Use */}
            {product.how_to_use && (
              <div>
                <h3 className="font-semibold mb-3">How to Use</h3>
                <p className="text-muted-foreground">{product.how_to_use}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <Separator className="mb-8" />
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
            Customer Reviews
          </h2>
          
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="reviews">All Reviews</TabsTrigger>
              <TabsTrigger value="write">Write a Review</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reviews" className="space-y-6">
              <ReviewSummary productId={product.id} />
              <ReviewList productId={product.id} />
            </TabsContent>
            
            <TabsContent value="write">
              <div className="max-w-lg">
                <ReviewForm productId={product.id} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
