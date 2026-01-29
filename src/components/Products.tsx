import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag, Star, ArrowRight } from "lucide-react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const products = [
  {
    id: 1,
    name: "Radiance Revival Serum",
    description: "Anti-aging formula with retinol & peptides",
    price: 89,
    originalPrice: 120,
    rating: 4.9,
    reviews: 2847,
    image: product1,
    badge: "Bestseller",
    badgeVariant: "default" as const,
  },
  {
    id: 2,
    name: "Hydra-Glow Moisturizer",
    description: "48-hour hydration with hyaluronic acid",
    price: 65,
    originalPrice: null,
    rating: 4.8,
    reviews: 1923,
    image: product2,
    badge: "New",
    badgeVariant: "secondary" as const,
  },
  {
    id: 3,
    name: "Vitamin C Brightening Essence",
    description: "Dark spot correction & luminosity boost",
    price: 75,
    originalPrice: 95,
    rating: 4.7,
    reviews: 1456,
    image: product3,
    badge: "20% OFF",
    badgeVariant: "destructive" as const,
  },
  {
    id: 4,
    name: "Aqua-Boost Hydrating Serum",
    description: "Deep hydration with marine collagen",
    price: 79,
    originalPrice: null,
    rating: 4.9,
    reviews: 987,
    image: product4,
    badge: null,
    badgeVariant: "default" as const,
  },
];

const Products = () => {
  return (
    <section id="products" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium mb-4 block">Our Collection</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Science-Backed <span className="text-primary">Skincare</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Each product is carefully formulated with clinically proven ingredients 
            for visible, lasting results.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-border hover:shadow-xl transition-all duration-500 bg-card"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden bg-muted/30">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button 
                    size="sm" 
                    className="bg-card text-foreground hover:bg-primary hover:text-primary-foreground mr-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-card border-border hover:bg-accent hover:text-accent-foreground"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>

                {/* Badge */}
                {product.badge && (
                  <Badge
                    variant={product.badgeVariant}
                    className="absolute top-3 left-3"
                  >
                    {product.badge}
                  </Badge>
                )}
              </div>

              {/* Content */}
              <CardContent className="p-5">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-medium ml-1">{product.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews.toLocaleString()} reviews)
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {product.description}
                </p>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-foreground">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground group"
          >
            View All Products
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;
