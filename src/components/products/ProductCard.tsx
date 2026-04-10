import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/types/ecommerce";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/currency";
import { resolveProductImage } from "@/lib/productImages";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  const getBadgeVariant = (variant: string) => {
    switch (variant) {
      case "destructive":
        return "destructive";
      case "secondary":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <Card className="group overflow-hidden border-border hover:shadow-xl transition-all duration-500 bg-card">
      {/* Image Container */}
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden bg-muted/30">
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Overlay Actions */}
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
              <Heart
                className={cn("w-4 h-4", inWishlist && "fill-current")}
              />
            </Button>
          </div>

          {/* Badge */}
          {product.badge && (
            <Badge
              variant={getBadgeVariant(product.badge_variant)}
              className="absolute top-3 left-3"
            >
              {product.badge}
            </Badge>
          )}
        </div>
      </Link>

      {/* Content */}
      <CardContent className="p-5">
        {/* Brand */}
        <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
          {product.brand}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm font-medium ml-1">{product.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.reviews_count.toLocaleString()} reviews)
          </span>
        </div>

        {/* Title & Description */}
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-4">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">
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
  );
};

export default ProductCard;
