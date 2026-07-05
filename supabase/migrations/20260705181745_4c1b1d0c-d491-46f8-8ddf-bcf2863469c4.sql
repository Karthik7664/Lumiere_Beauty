
-- 1. payment_settings: restrict SELECT to authenticated users
DROP POLICY IF EXISTS "Payment settings viewable by everyone" ON public.payment_settings;
CREATE POLICY "Authenticated users can view payment settings"
  ON public.payment_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- 2. newsletter_subscribers: replace WITH CHECK (true) with a real validation
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND length(email) BETWEEN 3 AND 254
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

-- 3. Lock down SECURITY DEFINER function execution
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_updated_at() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

REVOKE ALL ON FUNCTION public.is_profile_owner(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_profile_owner(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.is_skin_analysis_owner(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_skin_analysis_owner(uuid) TO authenticated;

-- 4. Storage: remove broad SELECT policies that allow listing bucket contents.
-- Public buckets remain reachable via their public object URLs.
DROP POLICY IF EXISTS "Product images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Banner images are publicly accessible" ON storage.objects;
