-- =====================================================
-- DesaHelp@USM Database Schema
-- Initial Schema Setup for Supabase PostgreSQL
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

-- User role types
CREATE TYPE user_role AS ENUM ('student', 'staff', 'admin');

-- Complaint status workflow
CREATE TYPE complaint_status AS ENUM ('Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed');

-- Priority levels
CREATE TYPE complaint_priority AS ENUM ('Low', 'Medium', 'High');

-- Complaint categories
CREATE TYPE complaint_category AS ENUM (
  'Room Maintenance',
  'Plumbing',
  'Electrical',
  'Cleanliness',
  'Common Areas',
  'Security',
  'Noise Complaint',
  'Network',
  'Furniture',
  'Facilities',
  'Discipline',
  'Other'
);

-- Feedback repair quality
CREATE TYPE repair_quality AS ENUM ('good', 'acceptable', 'bad');

-- Feedback response speed
CREATE TYPE response_speed AS ENUM (
  'within a few hours',
  '1-2 days',
  '2-3 days',
  'more than 4 days'
);

-- Activity log action types
CREATE TYPE action_type AS ENUM (
  'assigned',
  'unassigned',
  'status_changed',
  'priority_changed',
  'resolved',
  'followed_up',
  'created'
);

-- =====================================================
-- TABLES
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  user_role user_role NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Complaints/Tickets table
CREATE TABLE complaints (
  id SERIAL PRIMARY KEY,
  complaint_id VARCHAR(50) UNIQUE NOT NULL, -- Format: CMP-1001
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category complaint_category NOT NULL,
  status complaint_status NOT NULL DEFAULT 'Pending',
  priority complaint_priority NOT NULL DEFAULT 'Medium',
  photo_url VARCHAR(500),
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  date_submitted TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_resolved TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_assignment CHECK (
    (status = 'Pending' AND assigned_to IS NULL) OR
    (status != 'Pending' AND assigned_to IS NOT NULL)
  )
);

-- Feedback/Reviews table
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  complaint_id INTEGER UNIQUE NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  overall_rating INTEGER NOT NULL,
  comment TEXT,
  repair_quality repair_quality,
  response_speed response_speed,
  sentiment VARCHAR(20) DEFAULT 'neutral',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT rating_range CHECK (overall_rating >= 1 AND overall_rating <= 5),
  CONSTRAINT valid_sentiment CHECK (sentiment IN ('positive', 'neutral', 'negative'))
);

-- Complaint responses/updates table
CREATE TABLE complaint_responses (
  id SERIAL PRIMARY KEY,
  complaint_id INTEGER NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  response_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity log table (for admin dashboard)
CREATE TABLE activity_log (
  id SERIAL PRIMARY KEY,
  complaint_id INTEGER REFERENCES complaints(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action_type action_type NOT NULL,
  action_message VARCHAR(500) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(user_role);
CREATE INDEX idx_users_active ON users(is_active);

-- Complaint indexes
CREATE INDEX idx_complaints_student ON complaints(student_id);
CREATE INDEX idx_complaints_assigned ON complaints(assigned_to);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_priority ON complaints(priority);
CREATE INDEX idx_complaints_category ON complaints(category);
CREATE INDEX idx_complaints_submitted ON complaints(date_submitted DESC);
CREATE INDEX idx_complaints_student_status ON complaints(student_id, status);

-- Feedback indexes
CREATE INDEX idx_feedback_complaint ON feedback(complaint_id);
CREATE INDEX idx_feedback_student ON feedback(student_id);
CREATE INDEX idx_feedback_rating ON feedback(overall_rating);

-- Response indexes
CREATE INDEX idx_responses_complaint ON complaint_responses(complaint_id);
CREATE INDEX idx_responses_staff ON complaint_responses(staff_id);

-- Activity log indexes
CREATE INDEX idx_activity_complaint ON activity_log(complaint_id);
CREATE INDEX idx_activity_user ON activity_log(user_id);
CREATE INDEX idx_activity_created ON activity_log(created_at DESC);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate complaint ID
CREATE OR REPLACE FUNCTION generate_complaint_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.complaint_id := 'CMP-' || LPAD(NEW.id::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate feedback sentiment based on rating
CREATE OR REPLACE FUNCTION calculate_sentiment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.overall_rating >= 4 THEN
    NEW.sentiment := 'positive';
  ELSIF NEW.overall_rating = 3 THEN
    NEW.sentiment := 'neutral';
  ELSE
    NEW.sentiment := 'negative';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to set date_resolved when status becomes Resolved
CREATE OR REPLACE FUNCTION set_date_resolved()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'Resolved' AND OLD.status != 'Resolved' THEN
    NEW.date_resolved := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at for users
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at for complaints
CREATE TRIGGER update_complaints_updated_at
  BEFORE UPDATE ON complaints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate complaint ID
CREATE TRIGGER generate_complaint_id_trigger
  AFTER INSERT ON complaints
  FOR EACH ROW
  EXECUTE FUNCTION generate_complaint_id();

-- Auto-calculate feedback sentiment
CREATE TRIGGER calculate_sentiment_trigger
  BEFORE INSERT OR UPDATE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION calculate_sentiment();

-- Auto-set date_resolved
CREATE TRIGGER set_date_resolved_trigger
  BEFORE UPDATE ON complaints
  FOR EACH ROW
  EXECUTE FUNCTION set_date_resolved();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE users IS 'User accounts for students, staff, and admins';
COMMENT ON TABLE complaints IS 'Hostel complaints/tickets submitted by students';
COMMENT ON TABLE feedback IS 'Student feedback on resolved complaints';
COMMENT ON TABLE complaint_responses IS 'Staff responses and updates on complaints';
COMMENT ON TABLE activity_log IS 'Admin activity tracking for dashboard';

COMMENT ON COLUMN users.auth_id IS 'Reference to Supabase auth.users table';
COMMENT ON COLUMN complaints.complaint_id IS 'Human-readable complaint ID (e.g., CMP-1001)';
COMMENT ON COLUMN complaints.assigned_to IS 'Staff member assigned to handle this complaint';
COMMENT ON COLUMN feedback.sentiment IS 'Auto-calculated: positive (4-5), neutral (3), negative (1-2)';
