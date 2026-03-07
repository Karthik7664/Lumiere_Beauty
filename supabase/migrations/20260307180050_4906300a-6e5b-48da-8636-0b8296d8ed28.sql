
-- Payment settings table (single row config)
CREATE TABLE public.payment_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  upi_id text NOT NULL DEFAULT 'lumierebeauty@upi',
  receiver_name text NOT NULL DEFAULT 'Lumiere Beauty',
  receiver_phone text NOT NULL DEFAULT '9391324364',
  accept_cod boolean NOT NULL DEFAULT true,
  accept_upi boolean NOT NULL DEFAULT true,
  accept_card boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read payment settings (needed for checkout)
CREATE POLICY "Payment settings viewable by everyone" ON public.payment_settings
  FOR SELECT USING (true);

-- Only admins can manage
CREATE POLICY "Admins can manage payment settings" ON public.payment_settings
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default row
INSERT INTO public.payment_settings (upi_id, receiver_name, receiver_phone)
VALUES ('9391324364@upi', 'Lumiere Beauty', '9391324364');
