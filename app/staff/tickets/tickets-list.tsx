// components/tickets/tickets-list.tsx
import { Ticket } from "@/lib/supabase/tickets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";

interface TicketsListProps {
  tickets: Ticket[];
  emptyMessage?: string;
}

export function TicketsList({ tickets, emptyMessage = "No tickets found" }: TicketsListProps) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Open</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'resolved':
      case 'closed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <Link key={ticket.id} href={`/staff/tickets/${ticket.id}`} className="block">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{ticket.title}</CardTitle>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(ticket.status)}
                  <Badge variant="outline" className="capitalize">
                    {ticket.priority}
                  </Badge>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Submitted by {ticket.student_name} • {format(new Date(ticket.date_submitted), 'MMM d, yyyy')}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm line-clamp-2 text-muted-foreground">
                {ticket.description}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}