import { useQuery } from "@tanstack/react-query";
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
import { Loader2, Users } from "lucide-react";
import { format } from "date-fns";

const AdminUsers = () => {
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: roles } = useQuery({
    queryKey: ["admin-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: orders } = useQuery({
    queryKey: ["admin-orders-count"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("user_id, total");
      if (error) throw error;
      return data;
    },
  });

  const getUserRole = (userId: string) => {
    const userRole = roles?.find((r) => r.user_id === userId);
    return userRole?.role || "user";
  };

  const getUserOrderStats = (userId: string) => {
    const userOrders = orders?.filter((o) => o.user_id === userId) || [];
    const totalSpent = userOrders.reduce((sum, o) => sum + Number(o.total), 0);
    return { count: userOrders.length, totalSpent };
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
        <h2 className="text-xl font-semibold">Users</h2>
        <p className="text-sm text-muted-foreground">
          View registered users and their activity
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Orders</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles?.map((profile) => {
                const stats = getUserOrderStats(profile.id);
                const role = getUserRole(profile.id);
                return (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">
                      {profile.name || "Unnamed User"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={role === "admin" ? "default" : "secondary"} className="capitalize">
                        {role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{stats.count}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(profile.created_at), "dd MMM yyyy")}
                    </TableCell>
                  </TableRow>
                );
              })}
              {profiles?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No users yet</p>
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

export default AdminUsers;
