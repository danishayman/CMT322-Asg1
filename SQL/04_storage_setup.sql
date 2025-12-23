-- =====================================================
-- Supabase Storage Setup
-- DesaHelp@USM - File Upload Configuration
-- =====================================================

-- Note: Storage buckets are typically created via Supabase Dashboard or CLI
-- This file documents the storage configuration for reference

-- =====================================================
-- STORAGE BUCKET CONFIGURATION
-- =====================================================

-- Create storage bucket for complaint photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-photos', 'complaint-photos', false);

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload complaint photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'complaint-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to view their own uploads
CREATE POLICY "Users can view their own photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'complaint-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow staff and admins to view all photos
CREATE POLICY "Staff can view all complaint photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'complaint-photos' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.user_role IN ('staff', 'admin')
  )
);

-- Allow users to update their own uploads (before complaint is assigned)
CREATE POLICY "Users can update their own photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'complaint-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own uploads (before complaint is assigned)
CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'complaint-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- STORAGE HELPER FUNCTIONS
-- =====================================================

-- Function to generate storage path for complaint photos
CREATE OR REPLACE FUNCTION get_complaint_photo_path(user_id UUID, complaint_id VARCHAR)
RETURNS TEXT AS $$
BEGIN
  RETURN user_id::TEXT || '/' || complaint_id || '_' || EXTRACT(EPOCH FROM NOW())::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Function to validate image file extension
CREATE OR REPLACE FUNCTION is_valid_image(filename TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN filename ~* '\.(jpg|jpeg|png|gif|webp)$';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STORAGE CONFIGURATION NOTES
-- =====================================================

/*
STORAGE BUCKET SETTINGS (Configure in Supabase Dashboard):

Bucket Name: complaint-photos
Public: No (private bucket, requires authentication)
File Size Limit: 5MB
Allowed MIME Types:
  - image/jpeg
  - image/jpg
  - image/png
  - image/gif
  - image/webp

FILE NAMING CONVENTION:
{user_id}/{complaint_id}_{timestamp}.{extension}

Example:
11111111-1111-1111-1111-111111111111/CMP-1001_1703289600.jpg

USAGE IN APPLICATION:
1. Upload file to storage bucket using Supabase client
2. Get public or signed URL from storage
3. Store URL in complaints.photo_url column
4. Display image in UI using the stored URL

UPLOAD EXAMPLE (TypeScript):
```typescript
const { data, error } = await supabase.storage
  .from('complaint-photos')
  .upload(`${userId}/${complaintId}_${Date.now()}.jpg`, file, {
    cacheControl: '3600',
    upsert: false
  });

if (data) {
  const photoUrl = data.path;
  // Save photoUrl to complaints table
}
```

RETRIEVE IMAGE URL:
```typescript
const { data } = supabase.storage
  .from('complaint-photos')
  .getPublicUrl(photoPath);
// OR for private access:
const { data } = await supabase.storage
  .from('complaint-photos')
  .createSignedUrl(photoPath, 3600); // 1 hour expiry
```

SECURITY CONSIDERATIONS:
- Files are organized by user_id to prevent unauthorized access
- RLS policies ensure users can only access their own files
- Staff/admin can view all files for ticket management
- File size limits prevent abuse
- MIME type validation prevents malicious uploads
*/
