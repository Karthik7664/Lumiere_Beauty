import { useNavigate, Link } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingBag, Trash2, ChevronLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/currency";
const Wishlist = () => {
  const { user } = useAuth();
  const { items, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId);
    await removeFromWishlist(productId);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in to view wishlist
          </h1>
          <Button onClick={() => navigate("/")}>Return Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-8">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-3xl font-serif font-bold mb-8">Your Wishlist</h1>

        {loading ? (
          <div className="text-center py-12">
            <p>Loading...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="group overflow-hidden">
                <Link to={`/product/${item.product?.slug}`}>
                  <div className="relative overflow-hidden bg-muted/30">
                    <img
                      src={item.product?.image_url || "/placeholder.svg"}
                      alt={item.product?.name}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
                    {item.product?.brand}
                  </p>
                  <Link to={`/product/${item.product?.slug}`}>
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {item.product?.name}
                    </h3>
                  </Link>
                  <p className="text-lg font-bold mb-4">
                    {formatPrice(item.product?.price || 0)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAddToCart(item.product_id)}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:text-destructive"
                      onClick={() => removeFromWishlist(item.product_id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-4">
              Save items you love by clicking the heart icon
            </p>
            <Button asChild>
              <Link to="/">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;
