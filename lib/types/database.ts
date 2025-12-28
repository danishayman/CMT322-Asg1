// Database types for Supabase - matches SQL schema in /sql/01_initial_schema.sql

// =====================================================
// ENUMS
// =====================================================

export type UserRole = 'student' | 'staff' | 'admin'

export type ComplaintStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed'

export type ComplaintPriority = 'Low' | 'Medium' | 'High'

export type ComplaintCategory =
  | 'Room Maintenance'
  | 'Plumbing'
  | 'Electrical'
  | 'Cleanliness'
  | 'Common Areas'
  | 'Security'
  | 'Noise Complaint'
  | 'Network'
  | 'Furniture'
  | 'Facilities'
  | 'Discipline'
  | 'Other'

export type RepairQuality = 'good' | 'acceptable' | 'bad'

export type ResponseSpeed = 
  | 'within a few hours'
  | '1-2 days'
  | '2-3 days'
  | 'more than 4 days'

export type ActionType =
  | 'assigned'
  | 'unassigned'
  | 'status_changed'
  | 'priority_changed'
  | 'resolved'
  | 'followed_up'
  | 'created'

// =====================================================
// TABLE TYPES
// =====================================================

export interface User {
  id: string
  auth_id: string | null
  email: string
  full_name: string
  user_role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Complaint {
  id: number
  complaint_id: string
  student_id: string
  title: string
  description: string
  category: ComplaintCategory
  status: ComplaintStatus
  priority: ComplaintPriority
  photo_url: string | null
  assigned_to: string | null
  date_submitted: string
  date_resolved: string | null
  created_at: string
  updated_at: string
}

export interface Feedback {
  id: number
  complaint_id: number
  student_id: string
  overall_rating: number
  comment: string | null
  repair_quality: RepairQuality | null
  response_speed: ResponseSpeed | null
  sentiment: 'positive' | 'neutral' | 'negative'
  created_at: string
}

export interface ComplaintResponse {
  id: number
  complaint_id: number
  staff_id: string
  response_text: string
  created_at: string
}

export interface ActivityLog {
  id: number
  complaint_id: number | null
  user_id: string
  action_type: ActionType
  action_message: string
  created_at: string
}

// =====================================================
// INSERT TYPES (for creating new records)
// =====================================================

export interface CreateComplaintInput {
  title: string
  description: string
  category: ComplaintCategory
  priority?: ComplaintPriority
  photo_url?: string | null
}

export interface CreateFeedbackInput {
  complaint_id: number
  overall_rating: number
  comment?: string | null
  repair_quality?: RepairQuality | null
  response_speed?: ResponseSpeed | null
}

// =====================================================
// JOIN/VIEW TYPES
// =====================================================

export interface ComplaintWithDetails extends Complaint {
  student?: User
  assigned_staff?: User
  feedback?: Feedback | null
  responses?: ComplaintResponseWithStaff[]
}

export interface ComplaintResponseWithStaff extends ComplaintResponse {
  staff?: User
}

export interface FeedbackWithDetails extends Feedback {
  complaint?: Complaint
  student?: User
}

// =====================================================
// STATS TYPES
// =====================================================

export interface StudentStats {
  total_complaints: number
  pending_count: number
  in_progress_count: number
  resolved_count: number
  closed_count: number
}

// =====================================================
// SUPABASE DATABASE TYPE
// =====================================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<User, 'id'>>
        Relationships: []
      }
      complaints: {
        Row: Complaint
        Insert: Omit<Complaint, 'id' | 'complaint_id' | 'created_at' | 'updated_at' | 'date_submitted'> & {
          id?: number
          complaint_id?: string
          created_at?: string
          updated_at?: string
          date_submitted?: string
        }
        Update: Partial<Omit<Complaint, 'id' | 'complaint_id'>>
        Relationships: []
      }
      feedback: {
        Row: Feedback
        Insert: Omit<Feedback, 'id' | 'created_at' | 'sentiment'> & {
          id?: number
          created_at?: string
          sentiment?: string
        }
        Update: Partial<Omit<Feedback, 'id'>>
        Relationships: []
      }
      complaint_responses: {
        Row: ComplaintResponse
        Insert: Omit<ComplaintResponse, 'id' | 'created_at'> & {
          id?: number
          created_at?: string
        }
        Update: Partial<Omit<ComplaintResponse, 'id'>>
        Relationships: []
      }
      activity_log: {
        Row: ActivityLog
        Insert: Omit<ActivityLog, 'id' | 'created_at'> & {
          id?: number
          created_at?: string
        }
        Update: Partial<Omit<ActivityLog, 'id'>>
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      complaint_status: ComplaintStatus
      complaint_priority: ComplaintPriority
      complaint_category: ComplaintCategory
      repair_quality: RepairQuality
      response_speed: ResponseSpeed
      action_type: ActionType
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
