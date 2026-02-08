-- Add image_url column to promotional_banners for banner images
ALTER TABLE public.promotional_banners
ADD COLUMN image_url text;

-- Create banner-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('banner-images', 'banner-images', true);

-- Allow anyone to view banner images (public bucket)
CREATE POLICY "Banner images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'banner-images');

-- Allow admins to upload banner images
CREATE POLICY "Admins can upload banner images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'banner-images' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow admins to update banner images
CREATE POLICY "Admins can update banner images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'banner-images' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow admins to delete banner images
CREATE POLICY "Admins can delete banner images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'banner-images' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);