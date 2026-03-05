import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface SavedAddress {
  id: string;
  user_id: string;
  label: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const useSavedAddresses = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["saved-addresses", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_addresses" as any)
        .select("*")
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as SavedAddress[];
    },
    enabled: !!user,
  });
};

export const useSaveAddress = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (address: Omit<SavedAddress, "id" | "user_id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("saved_addresses" as any)
        .insert({ ...address, user_id: user!.id } as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-addresses"] });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...address }: Partial<SavedAddress> & { id: string }) => {
      const { data, error } = await supabase
        .from("saved_addresses" as any)
        .update(address as any)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-addresses"] });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("saved_addresses" as any)
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-addresses"] });
    },
  });
};
