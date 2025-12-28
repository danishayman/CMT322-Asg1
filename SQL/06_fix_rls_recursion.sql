-- =====================================================
-- Migration: Fix RLS Infinite Recursion
-- Run this in Supabase SQL Editor
-- =====================================================

-- The issue: RLS policies on the users table reference the users table
-- in subqueries, causing infinite recursion when other tables' policies
-- also join with users.

-- Solution: Use auth.jwt() claims or simplify policies to avoid self-referencing

-- =====================================================
-- STEP 1: Drop problematic policies on users table
-- =====================================================

DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Staff can view staff and students" ON users;
DROP POLICY IF EXISTS "Service role can insert users" ON users;

-- =====================================================
-- STEP 2: Drop policies on complaints that reference users
-- =====================================================

DROP POLICY IF EXISTS "Students can create complaints" ON complaints;
DROP POLICY IF EXISTS "Students can view own complaints" ON complaints;
DROP POLICY IF EXISTS "Students can update own pending complaints" ON complaints;
DROP POLICY IF EXISTS "Staff can view all complaints" ON complaints;
DROP POLICY IF EXISTS "Staff can update assigned complaints" ON complaints;
DROP POLICY IF EXISTS "Admins have full access to complaints" ON complaints;

-- =====================================================
-- STEP 3: Drop policies on feedback that reference users
-- =====================================================

DROP POLICY IF EXISTS "Students can submit feedback" ON feedback;
DROP POLICY IF EXISTS "Students can view own feedback" ON feedback;
DROP POLICY IF EXISTS "Staff can view all feedback" ON feedback;
DROP POLICY IF EXISTS "Admins can manage feedback" ON feedback;

-- =====================================================
-- STEP 4: Drop policies on complaint_responses that reference users
-- =====================================================

DROP POLICY IF EXISTS "Staff can add responses" ON complaint_responses;
DROP POLICY IF EXISTS "Students can view responses" ON complaint_responses;
DROP POLICY IF EXISTS "Staff can view all responses" ON complaint_responses;
DROP POLICY IF EXISTS "Staff can update own responses" ON complaint_responses;

-- =====================================================
-- STEP 5: Drop policies on activity_log that reference users
-- =====================================================

DROP POLICY IF EXISTS "Admins and staff can log activity" ON activity_log;
DROP POLICY IF EXISTS "Admins can view activity logs" ON activity_log;
DROP POLICY IF EXISTS "Staff can view related activity" ON activity_log;

-- =====================================================
-- STEP 6: Create helper function to get user info WITHOUT RLS
-- =====================================================

-- This function bypasses RLS to get user info safely
CREATE OR REPLACE FUNCTION public.get_my_user_id()
RETURNS UUID AS $$
  SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_my_user_role()
RETURNS user_role AS $$
  SELECT user_role FROM users WHERE auth_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_my_role(check_role user_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE auth_id = auth.uid() 
    AND user_role = check_role
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE auth_id = auth.uid() 
    AND user_role IN ('staff', 'admin')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =====================================================
-- STEP 7: Create NEW users table policies (non-recursive)
-- =====================================================

-- Allow authenticated users to see their own profile (direct comparison)
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = auth_id);

-- Users can update their own profile (direct comparison)
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = auth_id);

-- Allow inserts (for auth trigger)
CREATE POLICY "Allow user creation"
  ON users FOR INSERT
  WITH CHECK (true);

-- Admins can view all users (using helper function)
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (public.is_my_role('admin'));

-- Staff can view all users (using helper function)
CREATE POLICY "Staff can view all users"
  ON users FOR SELECT
  USING (public.is_staff_or_admin());

-- =====================================================
-- STEP 8: Create NEW complaints table policies
-- =====================================================

-- Students can create their own complaints
CREATE POLICY "Students can create complaints"
  ON complaints FOR INSERT
  WITH CHECK (student_id = public.get_my_user_id());

-- Students can view their own complaints
CREATE POLICY "Students can view own complaints"
  ON complaints FOR SELECT
  USING (student_id = public.get_my_user_id());

-- Students can update their own pending complaints
CREATE POLICY "Students can update own pending complaints"
  ON complaints FOR UPDATE
  USING (
    student_id = public.get_my_user_id()
    AND status = 'Pending'
  );

-- Staff and admins can view all complaints
CREATE POLICY "Staff can view all complaints"
  ON complaints FOR SELECT
  USING (public.is_staff_or_admin());

-- Staff can update assigned complaints, admins can update any
CREATE POLICY "Staff can update complaints"
  ON complaints FOR UPDATE
  USING (
    public.is_staff_or_admin()
    AND (
      assigned_to = public.get_my_user_id()
      OR public.is_my_role('admin')
    )
  );

-- Admins can delete complaints
CREATE POLICY "Admins can delete complaints"
  ON complaints FOR DELETE
  USING (public.is_my_role('admin'));

-- =====================================================
-- STEP 9: Create NEW feedback table policies
-- =====================================================

-- Students can submit feedback for their resolved complaints
CREATE POLICY "Students can submit feedback"
  ON feedback FOR INSERT
  WITH CHECK (
    student_id = public.get_my_user_id()
    AND EXISTS (
      SELECT 1 FROM complaints 
      WHERE complaints.id = feedback.complaint_id
      AND complaints.student_id = public.get_my_user_id()
      AND complaints.status = 'Resolved'
    )
  );

-- Students can view their own feedback
CREATE POLICY "Students can view own feedback"
  ON feedback FOR SELECT
  USING (student_id = public.get_my_user_id());

-- Staff and admins can view all feedback
CREATE POLICY "Staff can view all feedback"
  ON feedback FOR SELECT
  USING (public.is_staff_or_admin());

-- Admins can manage all feedback
CREATE POLICY "Admins can manage feedback"
  ON feedback FOR ALL
  USING (public.is_my_role('admin'));

-- =====================================================
-- STEP 10: Create NEW complaint_responses table policies
-- =====================================================

-- Staff can add responses to complaints they're assigned to (or admins)
CREATE POLICY "Staff can add responses"
  ON complaint_responses FOR INSERT
  WITH CHECK (
    staff_id = public.get_my_user_id()
    AND public.is_staff_or_admin()
  );

-- Students can view responses for their complaints
CREATE POLICY "Students can view responses"
  ON complaint_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM complaints
      WHERE complaints.id = complaint_responses.complaint_id
      AND complaints.student_id = public.get_my_user_id()
    )
  );

-- Staff can view all responses
CREATE POLICY "Staff can view all responses"
  ON complaint_responses FOR SELECT
  USING (public.is_staff_or_admin());

-- Staff can update their own responses
CREATE POLICY "Staff can update own responses"
  ON complaint_responses FOR UPDATE
  USING (staff_id = public.get_my_user_id());

-- =====================================================
-- STEP 11: Create NEW activity_log table policies
-- =====================================================

-- Staff and admins can insert activity logs
CREATE POLICY "Staff can log activity"
  ON activity_log FOR INSERT
  WITH CHECK (public.is_staff_or_admin());

-- Admins can view all activity logs
CREATE POLICY "Admins can view activity logs"
  ON activity_log FOR SELECT
  USING (public.is_my_role('admin'));

-- Staff can view activity for their assigned complaints
CREATE POLICY "Staff can view related activity"
  ON activity_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM complaints
      WHERE complaints.id = activity_log.complaint_id
      AND complaints.assigned_to = public.get_my_user_id()
    )
  );

-- =====================================================
-- Grant execute permissions on helper functions
-- =====================================================

GRANT EXECUTE ON FUNCTION public.get_my_user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_my_role(user_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_staff_or_admin() TO authenticated;

-- =====================================================
-- Done! The RLS policies now use SECURITY DEFINER functions
-- to avoid infinite recursion when checking user roles.
-- =====================================================
