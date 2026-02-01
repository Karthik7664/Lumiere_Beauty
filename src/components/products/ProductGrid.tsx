import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const ProductGrid = () => {
  const { data: products, isLoading, error } = useProducts();

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load products</p>
      </div>
    );
  }

  return (
    <section id="products" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium mb-4 block">
            Our Collection
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Science-Backed <span className="text-primary">Skincare</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Curated products from leading brands, carefully formulated with
            clinically proven ingredients for visible, lasting results.
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {products?.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground group"
            asChild
          >
            <a href="/shop">
              View All Products
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
