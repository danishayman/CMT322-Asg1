-- =====================================================
-- MIGRATION 07: Fix Complaint ID Trigger
-- =====================================================
-- This migration fixes the generate_complaint_id trigger that was incorrectly
-- defined as AFTER INSERT. AFTER INSERT triggers cannot modify the NEW row.
-- The trigger must be BEFORE INSERT to set the complaint_id correctly.
-- =====================================================

-- Drop the existing broken trigger
DROP TRIGGER IF EXISTS generate_complaint_id_trigger ON complaints;

-- Recreate the trigger as BEFORE INSERT (this allows modifying NEW.complaint_id)
CREATE TRIGGER generate_complaint_id_trigger
  BEFORE INSERT ON complaints
  FOR EACH ROW
  EXECUTE FUNCTION generate_complaint_id();

-- =====================================================
-- BACKFILL: Update any existing complaints with NULL complaint_id
-- =====================================================
-- This handles complaints that were inserted before this fix was applied

UPDATE complaints
SET complaint_id = 'CMP-' || LPAD(id::TEXT, 4, '0')
WHERE complaint_id IS NULL;

-- =====================================================
-- VERIFICATION
-- =====================================================
-- Run this query to verify the trigger is working:
-- INSERT INTO complaints (student_id, title, description, category) 
--   VALUES ('<student-uuid>', 'Test', 'Test', 'Electrical');
-- SELECT id, complaint_id FROM complaints ORDER BY id DESC LIMIT 1;
-- The complaint_id should be populated like 'CMP-0001'
