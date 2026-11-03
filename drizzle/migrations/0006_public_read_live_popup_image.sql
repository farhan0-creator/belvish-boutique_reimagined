DROP POLICY IF EXISTS "Anyone reads the live popup image" ON storage.objects;
CREATE POLICY "Anyone reads the live popup image" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (
    bucket_id = 'popup-ads'
    AND EXISTS (
      SELECT 1 FROM public.store_settings s
      WHERE s.id = 1 AND s.popup_enabled AND s.popup_image_url = 'popup-ads/' || storage.objects.name
    )
  );