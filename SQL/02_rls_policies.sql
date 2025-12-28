-- =====================================================
-- Row Level Security (RLS) Policies
-- DesaHelp@USM - Supabase Security
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Allow service role to insert users (for triggers)
CREATE POLICY "Service role can insert users"
  ON users FOR INSERT
  WITH CHECK (true);

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = auth_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = auth_id);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.user_role = 'admin'
    )
  );

-- Staff can view other staff and students (for assignment)
CREATE POLICY "Staff can view staff and students"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.user_role IN ('staff', 'admin')
    )
  );

-- =====================================================
-- COMPLAINTS TABLE POLICIES
-- =====================================================

-- Students can insert their own complaints
CREATE POLICY "Students can create complaints"
  ON complaints FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = complaints.student_id
      AND users.auth_id = auth.uid()
      AND users.user_role = 'student'
    )
  );

-- Students can view their own complaints
CREATE POLICY "Students can view own complaints"
  ON complaints FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = complaints.student_id
      AND users.auth_id = auth.uid()
    )
  );

-- Students can update their own pending complaints
CREATE POLICY "Students can update own pending complaints"
  ON complaints FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = complaints.student_id
      AND users.auth_id = auth.uid()
      AND users.user_role = 'student'
    )
    AND status = 'Pending'
  );

-- Staff can view all complaints
CREATE POLICY "Staff can view all complaints"
  ON complaints FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.user_role IN ('staff', 'admin')
    )
  );

-- Staff can update assigned complaints
CREATE POLICY "Staff can update assigned complaints"
  ON complaints FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND (
        users.id = complaints.assigned_to OR
        users.user_role = 'admin'
      )
    )
  );

-- Admins have full access to complaints
CREATE POLICY "Admins have full access to complaints"
  ON complaints FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.user_role = 'admin'
    )
  );

-- =====================================================
-- FEEDBACK TABLE POLICIES
-- =====================================================

-- Students can insert feedback for their resolved complaints
CREATE POLICY "Students can submit feedback"
  ON feedback FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      JOIN complaints c ON c.id = feedback.complaint_id
      WHERE u.id = feedback.student_id
      AND u.auth_id = auth.uid()
      AND u.user_role = 'student'
      AND c.student_id = u.id
      AND c.status = 'Resolved'
    )
  );

-- Students can view their own feedback
CREATE POLICY "Students can view own feedback"
  ON feedback FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = feedback.student_id
      AND users.auth_id = auth.uid()
    )
  );

-- Staff can view all feedback
CREATE POLICY "Staff can view all feedback"
  ON feedback FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.user_role IN ('staff', 'admin')
    )
  );

-- Admins can manage all feedback
CREATE POLICY "Admins can manage feedback"
  ON feedback FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.user_role = 'admin'
    )
  );

-- =====================================================
-- COMPLAINT_RESPONSES TABLE POLICIES
-- =====================================================

-- Staff can insert responses for assigned complaints
CREATE POLICY "Staff can add responses"
  ON complaint_responses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      JOIN complaints c ON c.id = complaint_responses.complaint_id
      WHERE u.auth_id = auth.uid()
      AND (
        u.id = c.assigned_to OR
        u.user_role = 'admin'
      )
    )
  );

-- Students can view responses for their complaints
CREATE POLICY "Students can view responses"
  ON complaint_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN complaints c ON c.id = complaint_responses.complaint_id
      WHERE u.auth_id = auth.uid()
      AND c.student_id = u.id
    )
  );

-- Staff can view all responses
CREATE POLICY "Staff can view all responses"
  ON complaint_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.user_role IN ('staff', 'admin')
    )
  );

-- Staff can update their own responses
CREATE POLICY "Staff can update own responses"
  ON complaint_responses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.id = complaint_responses.staff_id
    )
  );

-- =====================================================
-- ACTIVITY_LOG TABLE POLICIES
-- =====================================================

-- Admins and staff can insert activity logs
CREATE POLICY "Admins and staff can log activity"
  ON activity_log FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.user_role IN ('staff', 'admin')
    )
  );

-- Admins can view all activity logs
CREATE POLICY "Admins can view activity logs"
  ON activity_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.user_role = 'admin'
    )
  );

-- Staff can view activity logs for their complaints
CREATE POLICY "Staff can view related activity"
  ON activity_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN complaints c ON c.id = activity_log.complaint_id
      WHERE u.auth_id = auth.uid()
      AND u.id = c.assigned_to
    )
  );

-- =====================================================
-- HELPER FUNCTION FOR RLS
-- =====================================================

-- Function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT user_role FROM users WHERE auth_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid()
    AND user_role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Function to check if user is staff or admin
CREATE OR REPLACE FUNCTION is_staff_or_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid()
    AND user_role IN ('staff', 'admin')
  );
$$ LANGUAGE sql SECURITY DEFINER;
