"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TicketDetailCard } from "@/components/dashboard/ticket-detail-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Ticket {
  id: string
  title: string
  description: string
  status: string
  priority: string
  date_submitted: string
  category: string
  photo_url?: string | null
  studentName: string
  studentEmail: string
  assignedTo: {
    id: string
    name: string
    email: string
  } | null
}

interface TicketDetailContentProps {
  ticketId: string
}

export default function TicketDetailContent({ ticketId }: TicketDetailContentProps) {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const router = useRouter()

  const fetchTicket = async () => {
    if (!ticketId) return;

    try {
      setLoading(true);
      console.log('Fetching ticket with ID:', ticketId);
      const response = await fetch(`/api/admin/tickets/${ticketId}`);

      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText || 'No error details provided'
        });
        throw new Error(`Failed to fetch ticket: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Parsed response data:', data);
      setTicket(data);
      setError(null);
    } catch (err: any) {
      console.error('Fetch error details:', {
        error: err,
        name: err?.name,
        message: err?.message,
        stack: err?.stack
      });
      const errorMessage = err?.message || 'Failed to load ticket';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const updateTicketStatus = async (newStatus: string) => {
    if (!ticket) return;

    try {
      setUpdating(true);
      setError(null);

      console.log('Updating ticket status to:', newStatus);
      const response = await fetch(`/api/admin/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const responseData = await response.json();
      console.log('Update response:', {
        status: response.status,
        ok: response.ok,
        responseData
      });

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update ticket status');
      }

      // Update the local state with the updated ticket data
      setTicket(prev => prev ? {
        ...prev,
        status: responseData.status,
        assignedTo: responseData.assignedTo,
      } : null);

      // Show success message
      setError(null);

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/staff');
      }, 1000);

    } catch (err: any) {
      console.error('Update error details:', {
        error: err,
        name: err?.name,
        message: err?.message,
        stack: err?.stack
      });
      const errorMessage = err?.message || 'Failed to update ticket status';
      setError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
              <div className="mt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setError(null);
                    fetchTicket();
                  }}
                  className="text-sm text-red-700 hover:text-red-500"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-4">
        <p>Ticket not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg">
        <h1 className="text-2xl font-bold">Ticket Details</h1>
        <div className="flex items-center space-x-4">
          {(['pending', 'assigned'].includes(ticket.status.toLowerCase())) ? (
            <Button
              onClick={() => updateTicketStatus('In Progress')}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={updating}
            >
              {updating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Start Working'
              )}
            </Button>
          ) : ticket.status.toLowerCase() === 'in progress' ? (
            <Button
              onClick={() => updateTicketStatus('Resolved')}
              className="bg-green-600 hover:bg-green-700"
              disabled={updating}
            >
              {updating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Mark as Resolved'
              )}
            </Button>
          ) : null}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <TicketDetailCard
          id={ticket.id}
          title={ticket.title}
          description={ticket.description}
          status={ticket.status.toLowerCase() === 'assigned' ? 'Pending' : ticket.status}
          priority={ticket.priority}
          dateSubmitted={ticket.date_submitted}
          category={ticket.category}
          studentName={ticket.studentName}
          studentEmail={ticket.studentEmail}
          assignedTo={ticket.assignedTo}
          photoUrl={ticket.photo_url}
        />
      </div>
    </div>
  );
}