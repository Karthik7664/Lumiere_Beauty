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
import { Loader2, Package } from "lucide-react";
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
          View and manage all customer orders
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
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
                </TableRow>
              ))}
              {orders?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
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
