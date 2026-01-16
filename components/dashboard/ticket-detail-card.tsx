'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface AssignedTo {
  id: string;
  name: string;
  email: string;
}

interface TicketDetailCardProps {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dateSubmitted: string;
  category: string;
  studentName: string;
  studentEmail: string;
  assignedTo: AssignedTo | null;
  photoUrl?: string | null;
}

export function TicketDetailCard({
  id,
  title,
  description,
  status,
  priority,
  dateSubmitted,
  category,
  studentName,
  studentEmail,
  assignedTo,
  photoUrl,
}: TicketDetailCardProps) {
  if (!id) {
    return <Card>Ticket Not Found</Card>;
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPpp');
    } catch (e) {
      return dateString;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'default';
      case 'in progress':
        return 'secondary';
      case 'resolved':
        return 'outline';
      case 'closed':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">Ticket #{id}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant={getStatusVariant(status)}>
              {status}
            </Badge>
            <Badge variant={getPriorityVariant(priority)}>
              {priority} Priority
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">Description</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {photoUrl && (
          <div>
            <h3 className="font-medium mb-2">Attached Photo</h3>
            <div className="relative">
              <img
                src={photoUrl}
                alt="Complaint photo"
                className="max-w-full max-h-96 rounded-lg border object-contain"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium">Category</h3>
            <p className="text-muted-foreground">{category}</p>
          </div>
          <div>
            <h3 className="font-medium">Date Submitted</h3>
            <p className="text-muted-foreground">{formatDate(dateSubmitted)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium">Student</h3>
            <p className="text-muted-foreground">
              {studentName}
              <br />
              {studentEmail}
            </p>
          </div>
          <div>
            <h3 className="font-medium">Assigned To</h3>
            {assignedTo ? (
              <p className="text-muted-foreground">
                {assignedTo.name}
                <br />
                {assignedTo.email}
              </p>
            ) : (
              <p className="text-muted-foreground">Not assigned</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}