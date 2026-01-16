// lib/supabase/tickets.ts
import { createClient } from './client';

type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type TicketPriority = 'low' | 'medium' | 'high';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigned_to: string | null;
  date_submitted: string;
  date_resolved: string | null;
  student_name: string;
  student_email: string;
  staff_name: string | null;
  staff_email: string | null;
}

export async function getStaffTickets(staffId: string): Promise<{ 
  total: number; 
  open: number; 
  inProgress: number; 
  resolved: number 
}> {
  const supabase = createClient();
  
  // Get all tickets assigned to this staff member
  const { data: tickets, error } = await supabase
    .from('complaints')
    .select('*')
    .eq('assigned_to', staffId);

  if (error) {
    console.error('Error fetching tickets:', error);
    return { total: 0, open: 0, inProgress: 0, resolved: 0 };
  }

  // Count tickets by status
  const counts = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length
  };

  return counts;
}

export async function getTicketsByStatus(staffId: string, status: TicketStatus) {
  const supabase = createClient();
  
  const { data: tickets, error } = await supabase
    .from('complaints')
    .select(`
      id,
      title,
      description,
      status,
      priority,
      date_submitted,
      student_name,
      student_email,
      staff_name,
      staff_email
    `)
    .eq('assigned_to', staffId)
    .eq('status', status)
    .order('date_submitted', { ascending: false });

  if (error) {
    console.error(`Error fetching ${status} tickets:`, error);
    return [];
  }

  return tickets;
}