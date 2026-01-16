// app/api/admin/tickets/[ticketId]/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface Student {
  id: string;
  email: string;
  full_name: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  date_submitted: string;
  category: string;
  assigned_to: string | null;
  student_id: string;
  student?: Student | Student[];
  assigned_to_user?: {
    id: string;
    full_name: string;
    email: string;
  } | null;
  date_started?: string;
  date_resolved?: string;
}

// Helper functions
function getStudentName(student: Student | Student[] | null | undefined): string {
  if (!student) return 'Unknown';
  if (Array.isArray(student)) {
    return student[0]?.full_name || 'Unknown';
  }
  return student.full_name || 'Unknown';
}

function getStudentEmail(student: Student | Student[] | null | undefined): string {
  if (!student) return 'No email';
  if (Array.isArray(student)) {
    return student[0]?.email || 'No email';
  }
  return student.email || 'No email';
}

export async function GET(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    // Await the params to ensure it's resolved
    const resolvedParams = await Promise.resolve(params);
    const ticketId = resolvedParams.ticketId;

    if (!ticketId) {
      return NextResponse.json(
        { error: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: ticket, error: ticketError } = await supabase
      .from('complaints')
      .select(`
        *,
        student:student_id(*),
        assigned_to_user:assigned_to(*)
      `)
      .eq('id', ticketId)
      .single();

    if (ticketError) {
      console.error('Error fetching ticket:', ticketError);
      return NextResponse.json(
        {
          error: 'Failed to fetch ticket',
          details: ticketError.message
        },
        { status: 500 }
      );
    }

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Format the response
    const responseData = {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      date_submitted: ticket.date_submitted,
      category: ticket.category,
      photo_url: ticket.photo_url,
      studentName: getStudentName(ticket.student),
      studentEmail: getStudentEmail(ticket.student),
      assignedTo: ticket.assigned_to_user ? {
        id: ticket.assigned_to_user.id,
        name: ticket.assigned_to_user.full_name,
        email: ticket.assigned_to_user.email
      } : null
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in GET /api/admin/tickets/[ticketId]:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'An unknown error occurred'
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    // Await the params to ensure it's resolved
    const resolvedParams = await Promise.resolve(params);
    const ticketId = resolvedParams.ticketId;
    const { status } = await request.json();

    if (!ticketId || !status) {
      return NextResponse.json(
        { error: 'Ticket ID and status are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // First, get the current ticket to check its status
    const { data: currentTicket, error: fetchError } = await supabase
      .from('complaints')
      .select('status')
      .eq('id', ticketId)
      .single();

    if (fetchError || !currentTicket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    const updateData: any = { status };
    const statusLower = status.toLowerCase();
    const currentStatusLower = currentTicket.status.toLowerCase();

    // date_resolved is handled by database trigger when status becomes 'Resolved'
    // We just need to update the status - other fields are handled by triggers

    // Perform the update
    const { data: updatedTicket, error: updateError } = await supabase
      .from('complaints')
      .update(updateData)
      .eq('id', ticketId)
      .select(`
        *,
        student:student_id(*),
        assigned_to_user:assigned_to(*)
      `)
      .single();

    if (updateError) {
      console.error('Error updating ticket:', updateError);
      return NextResponse.json(
        {
          error: 'Failed to update ticket status',
          details: updateError.message
        },
        { status: 500 }
      );
    }

    // Format the response
    const responseData = {
      id: updatedTicket.id,
      title: updatedTicket.title,
      description: updatedTicket.description,
      status: updatedTicket.status,
      priority: updatedTicket.priority,
      date_submitted: updatedTicket.date_submitted,
      category: updatedTicket.category,
      studentName: getStudentName(updatedTicket.student),
      studentEmail: getStudentEmail(updatedTicket.student),
      assignedTo: updatedTicket.assigned_to_user ? {
        id: updatedTicket.assigned_to_user.id,
        name: updatedTicket.assigned_to_user.full_name,
        email: updatedTicket.assigned_to_user.email
      } : null
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in PATCH /api/admin/tickets/[ticketId]:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'An unknown error occurred'
      },
      { status: 500 }
    );
  }
}