import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Package, Eye, MapPin, Phone, Mail, User } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "delivered":
      return "default";
    case "confirmed":
    case "processing":
    case "shipped":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

interface ShippingAddress {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

const AdminOrders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: orderItems } = useQuery({
    queryKey: ["admin-order-items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("order_items").select("*");
      if (error) throw error;
      return data;
    },
    enabled: !!orders?.length,
  });

  const { data: profiles } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status, payment_status: status === "delivered" ? "paid" : undefined })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "Order status updated" });
    },
    onError: (error) => {
      toast({ title: "Error updating order", description: error.message, variant: "destructive" });
    },
  });

  const getProfileName = (userId: string) => {
    const profile = profiles?.find((p) => p.id === userId);
    return profile?.name || "—";
  };

  const getItemsForOrder = (orderId: string) => {
    return orderItems?.filter((item) => item.order_id === orderId) || [];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Orders</h2>
        <p className="text-sm text-muted-foreground">
          View and manage all customer orders with dispatch details
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => {
                const shipping = order.shipping_address as unknown as ShippingAddress | null;
                const items = getItemsForOrder(order.id);

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell>{getProfileName(order.user_id)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(order.created_at), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPrice(Number(order.total))}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {order.payment_method}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={order.status}
                        onValueChange={(value) =>
                          updateStatusMutation.mutate({ id: order.id, status: value })
                        }
                      >
                        <SelectTrigger className="w-[140px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="capitalize">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Order {order.order_number}</DialogTitle>
                          </DialogHeader>

                          <div className="space-y-4">
                            {/* Status & Payment */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant={getStatusVariant(order.status)} className="capitalize">
                                {order.status}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {order.payment_method}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                Payment: {order.payment_status}
                              </Badge>
                            </div>

                            <Separator />

                            {/* Shipping Address */}
                            <div>
                              <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" /> Shipping Address
                              </h4>
                              {shipping ? (
                                <div className="text-sm space-y-1 bg-muted/50 rounded-lg p-3">
                                  <p className="font-medium flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                                    {shipping.firstName} {shipping.lastName}
                                  </p>
                                  {shipping.phone && (
                                    <p className="flex items-center gap-1.5 text-muted-foreground">
                                      <Phone className="w-3.5 h-3.5" /> {shipping.phone}
                                    </p>
                                  )}
                                  {shipping.email && (
                                    <p className="flex items-center gap-1.5 text-muted-foreground">
                                      <Mail className="w-3.5 h-3.5" /> {shipping.email}
                                    </p>
                                  )}
                                  <p className="text-muted-foreground pt-1">
                                    {shipping.address}
                                    {shipping.city && `, ${shipping.city}`}
                                    {shipping.state && `, ${shipping.state}`}
                                    {shipping.zipCode && ` - ${shipping.zipCode}`}
                                  </p>
                                  {shipping.country && (
                                    <p className="text-muted-foreground">{shipping.country}</p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">No address on file</p>
                              )}
                            </div>

                            <Separator />

                            {/* Order Items */}
                            <div>
                              <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5">
                                <Package className="w-4 h-4" /> Items ({items.length})
                              </h4>
                              <div className="space-y-2">
                                {items.map((item) => (
                                  <div key={item.id} className="flex items-center gap-3 bg-muted/50 rounded-lg p-2">
                                    <img
                                      src={item.product_image}
                                      alt={item.product_name}
                                      className="w-12 h-12 rounded object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">{item.product_name}</p>
                                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-medium">{formatPrice(Number(item.price) * item.quantity)}</p>
                                  </div>
                                ))}
                                {items.length === 0 && (
                                  <p className="text-sm text-muted-foreground">No items found</p>
                                )}
                              </div>
                            </div>

                            <Separator />

                            {/* Order Summary */}
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatPrice(Number(order.subtotal))}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>{formatPrice(Number(order.shipping_cost))}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Tax</span>
                                <span>{formatPrice(Number(order.tax))}</span>
                              </div>
                              <Separator />
                              <div className="flex justify-between font-semibold text-base">
                                <span>Total</span>
                                <span>{formatPrice(Number(order.total))}</span>
                              </div>
                            </div>

                            {order.notes && (
                              <>
                                <Separator />
                                <div>
                                  <h4 className="font-semibold text-sm mb-1">Notes</h4>
                                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                                </div>
                              </>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
              {orders?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No orders yet</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
