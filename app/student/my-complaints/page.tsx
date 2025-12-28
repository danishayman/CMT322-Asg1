import { getMyComplaints } from '@/lib/actions/complaints';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth';
import { ComplaintStatus } from '@/lib/types/database';
import ComplaintsListClient from './complaints-list-client';

export default async function MyComplaintsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  const params = await searchParams;
  const statusFilter = params.status as ComplaintStatus | undefined;

  const result = await getMyComplaints(statusFilter || 'all');
  const complaints = result.data || [];

  // Calculate stats
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  };

  return (
    <ComplaintsListClient 
      initialComplaints={complaints}
      initialStats={stats}
      initialFilter={statusFilter || 'All'}
    />
  );
}