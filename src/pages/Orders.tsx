import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "@/lib/currency";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ArrowRight, ChevronLeft } from "lucide-react";
import { Order, OrderItem } from "@/types/ecommerce";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as Order[];
    },
    enabled: !!user,
  });

  const { data: allOrderItems } = useQuery({
    queryKey: ["all-order-items", user?.id],
    queryFn: async () => {
      if (!user || !orders || orders.length === 0) return [];

      const orderIds = orders.map((o) => o.id);
      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", orderIds);

      if (error) throw error;
      return data as OrderItem[];
    },
    enabled: !!orders && orders.length > 0,
  });

  const getOrderItems = (orderId: string) => {
    return allOrderItems?.filter((item) => item.order_id === orderId) || [];
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "confirmed":
      case "delivered":
        return "default";
      case "processing":
      case "shipped":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view orders</h1>
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
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-3xl font-serif font-bold mb-8">Your Orders</h1>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => {
              const items = getOrderItems(order.id);
              return (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">
                          {order.order_number}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Placed on{" "}
                          {format(new Date(order.created_at), "MMMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={getStatusVariant(order.status)} className="capitalize">
                          {order.status}
                        </Badge>
                        <span className="font-bold">
                          {formatPrice(Number(order.total))}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 mb-4">
                      {items.slice(0, 4).map((item) => (
                        <img
                          key={item.id}
                          src={item.product_image || "/placeholder.svg"}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ))}
                      {items.length > 4 && (
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-sm font-medium">
                          +{items.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        {items.length} item{items.length !== 1 && "s"}
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/order-confirmation/${order.id}`}>
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-4">
              Start shopping to see your orders here
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

export default Orders;
