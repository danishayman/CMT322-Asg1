'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Ticket {
  id: string;
  student_name: string;
  title: string;
  date_submitted: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'In Progress' | 'Pending' | 'Assigned' | 'Resolved' | 'Closed';
  complaint_id: string;
  assigned_to: string | null;
  displayStatus?: string;
}

interface TicketTableProps {
  status: 'all' | 'pending' | 'open' | 'resolved';
}

const statusTitles = {
  all: 'All Tickets',
  pending: 'Pending Tickets',
  open: 'Tickets In Progress',
  resolved: 'Resolved Tickets'
} as const;

export function TicketTable({ status }: TicketTableProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTickets() {
      try {
        setLoading(true);
        setError(null);
        
        // Get the authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error('Please sign in to view tickets');
        }

        // Get the public user record to get the correct ID
        const { data: publicUser, error: publicUserError } = await supabase
          .from('users')
          .select('id, email, user_role')
          .eq('auth_id', user.id)
          .single();

        if (publicUserError || !publicUser) {
          throw new Error('Staff record not found in public.users table');
        }

        // Base query
        let query = supabase
          .from('complaints')
          .select('*')
          .eq('assigned_to', publicUser.id)
          .order('date_submitted', { ascending: false });

        // Apply status filter
        if (status === 'pending') {
          query = query.in('status', ['Pending', 'Assigned']);
        } else if (status === 'open') {
          query = query.eq('status', 'In Progress');
        } else if (status === 'resolved') {
          query = query.in('status', ['Resolved', 'Closed']);
        }

        const { data, error: queryError } = await query;

        if (queryError) throw queryError;

        if (!data) {
          setTickets([]);
          return;
        }

        // Format tickets and normalize status
        const formattedTickets = data.map(ticket => ({
          ...ticket,
          student_name: ticket.student_name || 'Unknown',
          title: ticket.title || 'No title',
          date_submitted: ticket.date_submitted 
            ? format(new Date(ticket.date_submitted), 'MMM dd, yyyy')
            : 'Unknown date',
          priority: (ticket.priority || 'Medium') as 'High' | 'Medium' | 'Low',
          status: ticket.status,
          displayStatus: ticket.status === 'Assigned' ? 'Pending' : ticket.status,
          complaint_id: ticket.complaint_id || `TKT-${ticket.id}`,
        }));

        setTickets(formattedTickets);

      } catch (error: any) {
        console.error('Error in fetchTickets:', error);
        setError(
          error?.message || 
          error?.details || 
          'An error occurred while fetching tickets.'
        );
        setTickets([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, [status, supabase]);

  // Filter tickets based on status
  const filteredTickets = tickets.filter(ticket => {
    if (status === 'all') return true;
    if (status === 'pending') return ticket.status === 'Pending' || ticket.status === 'Assigned';
    if (status === 'open') return ticket.status === 'In Progress';
    if (status === 'resolved') return ticket.status === 'Resolved' || ticket.status === 'Closed';
    return true;
  });

  if (loading) {
    return <div className="text-center py-8">Loading tickets...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error loading tickets: {error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Card className="shadow-lg overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle className="text-xl">{statusTitles[status]}</CardTitle>
        <CardDescription>
          {filteredTickets.length} {filteredTickets.length === 1 ? 'ticket' : 'tickets'} found
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">
                      <Link href={`/staff/tickets/${ticket.id}`}>
                        #{ticket.complaint_id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Link href={`/staff/tickets/${ticket.id}`} className="hover:underline">
                        {ticket.student_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <Link href={`/staff/tickets/${ticket.id}`} className="line-clamp-2 hover:underline">
                        {ticket.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/staff/tickets/${ticket.id}`}>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${ticket.status === 'Pending' || ticket.status === 'Assigned' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : ''}
                            ${ticket.status === 'In Progress' ? 'bg-blue-50 text-blue-800 border-blue-200' : ''}
                            ${['Resolved', 'Closed'].includes(ticket.status) ? 'bg-green-50 text-green-800 border-green-200' : ''}
                          `}
                        >
                          {ticket.status === 'Assigned' ? 'Pending' : ticket.status}
                        </Badge>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link href={`/staff/tickets/${ticket.id}`} className="hover:underline">
                        {ticket.date_submitted}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/staff/tickets/${ticket.id}`}>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${ticket.priority === 'High' ? 'bg-red-50 text-red-800 border-red-200' : ''}
                            ${ticket.priority === 'Medium' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : ''}
                            ${ticket.priority === 'Low' ? 'bg-green-50 text-green-800 border-green-200' : ''}
                          `}
                        >
                          {ticket.priority}
                        </Badge>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                    No tickets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}