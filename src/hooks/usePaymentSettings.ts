import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PaymentSettings {
  id: string;
  upi_id: string;
  receiver_name: string;
  receiver_phone: string;
  accept_cod: boolean;
  accept_upi: boolean;
  accept_card: boolean;
}

export const usePaymentSettings = () => {
  return useQuery({
    queryKey: ["payment-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_settings")
        .select("*")
        .limit(1)
        .single();
      if (error) throw error;
      return data as PaymentSettings;
    },
  });
};

export const useUpdatePaymentSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: Partial<Omit<PaymentSettings, "id">>) => {
      const { data: existing } = await supabase
        .from("payment_settings")
        .select("id")
        .limit(1)
        .single();

      if (!existing) throw new Error("No payment settings found");

      const { data, error } = await supabase
        .from("payment_settings")
        .update({ ...settings, updated_at: new Date().toISOString() } as never)
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-settings"] });
    },
  });
};
