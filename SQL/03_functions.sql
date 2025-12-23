-- =====================================================
-- Utility Functions & Views
-- DesaHelp@USM - Business Logic & Analytics
-- =====================================================

-- =====================================================
-- DASHBOARD STATISTICS FUNCTIONS
-- =====================================================

-- Get complaint statistics by status
CREATE OR REPLACE FUNCTION get_complaint_stats()
RETURNS TABLE (
  total_complaints BIGINT,
  pending_count BIGINT,
  assigned_count BIGINT,
  in_progress_count BIGINT,
  resolved_count BIGINT,
  closed_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total_complaints,
    COUNT(*) FILTER (WHERE status = 'Pending')::BIGINT AS pending_count,
    COUNT(*) FILTER (WHERE status = 'Assigned')::BIGINT AS assigned_count,
    COUNT(*) FILTER (WHERE status = 'In Progress')::BIGINT AS in_progress_count,
    COUNT(*) FILTER (WHERE status = 'Resolved')::BIGINT AS resolved_count,
    COUNT(*) FILTER (WHERE status = 'Closed')::BIGINT AS closed_count
  FROM complaints;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get student's complaint statistics
CREATE OR REPLACE FUNCTION get_student_stats(student_uuid UUID)
RETURNS TABLE (
  total_complaints BIGINT,
  pending_count BIGINT,
  in_progress_count BIGINT,
  resolved_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total_complaints,
    COUNT(*) FILTER (WHERE status = 'Pending')::BIGINT AS pending_count,
    COUNT(*) FILTER (WHERE status IN ('Assigned', 'In Progress'))::BIGINT AS in_progress_count,
    COUNT(*) FILTER (WHERE status IN ('Resolved', 'Closed'))::BIGINT AS resolved_count
  FROM complaints
  WHERE student_id = student_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get staff workload statistics
CREATE OR REPLACE FUNCTION get_staff_workload()
RETURNS TABLE (
  staff_id UUID,
  staff_name VARCHAR,
  active_tickets BIGINT,
  resolved_tickets BIGINT,
  avg_resolution_days NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id AS staff_id,
    u.full_name AS staff_name,
    COUNT(*) FILTER (WHERE c.status IN ('Assigned', 'In Progress'))::BIGINT AS active_tickets,
    COUNT(*) FILTER (WHERE c.status = 'Resolved')::BIGINT AS resolved_tickets,
    AVG(
      EXTRACT(EPOCH FROM (c.date_resolved - c.date_submitted)) / 86400
    )::NUMERIC(10,2) AS avg_resolution_days
  FROM users u
  LEFT JOIN complaints c ON u.id = c.assigned_to
  WHERE u.user_role = 'staff'
  GROUP BY u.id, u.full_name
  ORDER BY active_tickets DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get average feedback rating
CREATE OR REPLACE FUNCTION get_avg_feedback_rating()
RETURNS NUMERIC AS $$
  SELECT COALESCE(AVG(overall_rating), 0)::NUMERIC(3,2)
  FROM feedback;
$$ LANGUAGE sql SECURITY DEFINER;

-- Get feedback statistics
CREATE OR REPLACE FUNCTION get_feedback_stats()
RETURNS TABLE (
  total_feedbacks BIGINT,
  avg_rating NUMERIC,
  positive_count BIGINT,
  neutral_count BIGINT,
  negative_count BIGINT,
  avg_response_time_hours NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total_feedbacks,
    AVG(f.overall_rating)::NUMERIC(3,2) AS avg_rating,
    COUNT(*) FILTER (WHERE f.sentiment = 'positive')::BIGINT AS positive_count,
    COUNT(*) FILTER (WHERE f.sentiment = 'neutral')::BIGINT AS neutral_count,
    COUNT(*) FILTER (WHERE f.sentiment = 'negative')::BIGINT AS negative_count,
    AVG(
      EXTRACT(EPOCH FROM (c.date_resolved - c.date_submitted)) / 3600
    )::NUMERIC(10,2) AS avg_response_time_hours
  FROM feedback f
  JOIN complaints c ON f.complaint_id = c.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get complaints by category
CREATE OR REPLACE FUNCTION get_complaints_by_category()
RETURNS TABLE (
  category complaint_category,
  count BIGINT,
  percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH total AS (
    SELECT COUNT(*)::NUMERIC AS total_count FROM complaints
  )
  SELECT
    c.category,
    COUNT(*)::BIGINT AS count,
    ROUND((COUNT(*)::NUMERIC / t.total_count * 100), 2) AS percentage
  FROM complaints c
  CROSS JOIN total t
  GROUP BY c.category, t.total_count
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get complaints by priority
CREATE OR REPLACE FUNCTION get_complaints_by_priority()
RETURNS TABLE (
  priority complaint_priority,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.priority,
    COUNT(*)::BIGINT AS count
  FROM complaints c
  GROUP BY c.priority
  ORDER BY 
    CASE 
      WHEN c.priority = 'High' THEN 1
      WHEN c.priority = 'Medium' THEN 2
      WHEN c.priority = 'Low' THEN 3
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get recent activity (for admin dashboard)
CREATE OR REPLACE FUNCTION get_recent_activity(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  activity_id INTEGER,
  action_message VARCHAR,
  action_type action_type,
  user_name VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    al.id AS activity_id,
    al.action_message,
    al.action_type,
    u.full_name AS user_name,
    al.created_at
  FROM activity_log al
  JOIN users u ON al.user_id = u.id
  ORDER BY al.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View: Complete complaint details with user info
CREATE OR REPLACE VIEW complaint_details AS
SELECT
  c.id,
  c.complaint_id,
  c.title,
  c.description,
  c.category,
  c.status,
  c.priority,
  c.photo_url,
  c.date_submitted,
  c.date_resolved,
  c.created_at,
  c.updated_at,
  -- Student info
  s.id AS student_id,
  s.full_name AS student_name,
  s.email AS student_email,
  -- Assigned staff info
  st.id AS staff_id,
  st.full_name AS staff_name,
  st.email AS staff_email,
  -- Resolution time
  CASE
    WHEN c.date_resolved IS NOT NULL THEN
      EXTRACT(EPOCH FROM (c.date_resolved - c.date_submitted)) / 3600
    ELSE NULL
  END AS resolution_hours,
  -- Feedback info
  f.overall_rating AS feedback_rating,
  f.sentiment AS feedback_sentiment
FROM complaints c
JOIN users s ON c.student_id = s.id
LEFT JOIN users st ON c.assigned_to = st.id
LEFT JOIN feedback f ON c.id = f.complaint_id;

-- View: Feedback with complaint details
CREATE OR REPLACE VIEW feedback_details AS
SELECT
  f.id,
  f.overall_rating,
  f.comment,
  f.repair_quality,
  f.response_speed,
  f.sentiment,
  f.created_at,
  c.complaint_id,
  c.title AS complaint_title,
  c.category,
  u.full_name AS student_name,
  st.full_name AS staff_name
FROM feedback f
JOIN complaints c ON f.complaint_id = c.id
JOIN users u ON f.student_id = u.id
LEFT JOIN users st ON c.assigned_to = st.id;

-- =====================================================
-- TRIGGER FUNCTIONS FOR ACTIVITY LOG
-- =====================================================

-- Log complaint creation
CREATE OR REPLACE FUNCTION log_complaint_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_log (complaint_id, user_id, action_type, action_message)
  SELECT
    NEW.id,
    NEW.student_id,
    'created',
    'New complaint submitted: ' || NEW.title
  FROM users
  WHERE id = NEW.student_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Log complaint assignment
CREATE OR REPLACE FUNCTION log_complaint_assignment()
RETURNS TRIGGER AS $$
DECLARE
  staff_name VARCHAR;
BEGIN
  IF NEW.assigned_to IS NOT NULL AND (OLD.assigned_to IS NULL OR OLD.assigned_to != NEW.assigned_to) THEN
    SELECT full_name INTO staff_name FROM users WHERE id = NEW.assigned_to;
    
    INSERT INTO activity_log (complaint_id, user_id, action_type, action_message)
    VALUES (
      NEW.id,
      NEW.assigned_to,
      'assigned',
      'Complaint assigned to ' || staff_name
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Log status changes
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    INSERT INTO activity_log (complaint_id, user_id, action_type, action_message)
    VALUES (
      NEW.id,
      COALESCE(NEW.assigned_to, NEW.student_id),
      'status_changed',
      'Status changed from ' || OLD.status || ' to ' || NEW.status
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply activity log triggers
CREATE TRIGGER trigger_log_complaint_created
  AFTER INSERT ON complaints
  FOR EACH ROW
  EXECUTE FUNCTION log_complaint_created();

CREATE TRIGGER trigger_log_complaint_assignment
  AFTER UPDATE ON complaints
  FOR EACH ROW
  WHEN (NEW.assigned_to IS DISTINCT FROM OLD.assigned_to)
  EXECUTE FUNCTION log_complaint_assignment();

CREATE TRIGGER trigger_log_status_change
  AFTER UPDATE ON complaints
  FOR EACH ROW
  WHEN (NEW.status IS DISTINCT FROM OLD.status)
  EXECUTE FUNCTION log_status_change();

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant execute permissions on functions to authenticated users
GRANT EXECUTE ON FUNCTION get_complaint_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_student_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_staff_workload() TO authenticated;
GRANT EXECUTE ON FUNCTION get_avg_feedback_rating() TO authenticated;
GRANT EXECUTE ON FUNCTION get_feedback_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_complaints_by_category() TO authenticated;
GRANT EXECUTE ON FUNCTION get_complaints_by_priority() TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_activity(INTEGER) TO authenticated;

-- Grant select on views
GRANT SELECT ON complaint_details TO authenticated;
GRANT SELECT ON feedback_details TO authenticated;
