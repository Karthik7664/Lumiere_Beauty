import { useProducts } from "@/hooks/useProducts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { formatPrice } from "@/lib/currency";
import { resolveProductImage } from "@/lib/productImages";

const FeaturedCarousel = () => {
  const { data: products, isLoading, error } = useProducts();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Get top-rated products (bestsellers)
  const featuredProducts = products
    ?.filter((p) => p.rating >= 4.5 || p.badge === "Bestseller" || p.badge === "Top Rated")
    .slice(0, 8);

  if (error) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary font-medium mb-4 block">
            Bestsellers
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Customer <span className="text-primary">Favourites</span>
          </h2>
          <p className="text-muted-foreground">
            Discover our most loved products, trusted by thousands of customers across India
          </p>
        </div>

        {/* Carousel */}
        {isLoading ? (
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-[280px] space-y-4">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {featuredProducts?.map((product) => {
                const inCart = isInCart(product.id);
                const inWishlist = isInWishlist(product.id);

                return (
                  <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                    <Card className="group overflow-hidden border-border hover:shadow-xl transition-all duration-500 bg-card h-full">
                      <Link to={`/product/${product.slug}`} className="block">
                        <div className="relative overflow-hidden bg-muted/30">
                          <img
                            src={resolveProductImage(product.image_url)}
                            alt={product.name}
                            className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Button
                              size="sm"
                              className={cn(
                                "mr-2",
                                inCart
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-card text-foreground hover:bg-primary hover:text-primary-foreground"
                              )}
                              onClick={(e) => {
                                e.preventDefault();
                                addToCart(product.id);
                              }}
                            >
                              <ShoppingBag className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className={cn(
                                "bg-card border-border",
                                inWishlist
                                  ? "text-destructive hover:text-destructive"
                                  : "hover:bg-accent hover:text-accent-foreground"
                              )}
                              onClick={(e) => {
                                e.preventDefault();
                                toggleWishlist(product.id);
                              }}
                            >
                              <Heart className={cn("w-4 h-4", inWishlist && "fill-current")} />
                            </Button>
                          </div>
                          {product.badge && (
                            <Badge
                              variant={product.badge_variant === "destructive" ? "destructive" : "default"}
                              className="absolute top-3 left-3"
                            >
                              {product.badge}
                            </Badge>
                          )}
                        </div>
                      </Link>
                      <CardContent className="p-4">
                        <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
                          {product.brand}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-primary text-primary" />
                            <span className="text-sm font-medium ml-1">{product.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({product.reviews_count?.toLocaleString("en-IN")} reviews)
                          </span>
                        </div>
                        <Link to={`/product/${product.slug}`}>
                          <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-foreground">
                            {formatPrice(product.price)}
                          </span>
                          {product.original_price && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.original_price)}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="-left-4 bg-card border-border hover:bg-primary hover:text-primary-foreground" />
            <CarouselNext className="-right-4 bg-card border-border hover:bg-primary hover:text-primary-foreground" />
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default FeaturedCarousel;
