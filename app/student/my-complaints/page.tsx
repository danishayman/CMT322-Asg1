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

  // Always fetch all complaints - client will handle filtering
  const allResult = await getMyComplaints('all');
  const allComplaints = allResult.data || [];

  // Calculate stats from ALL complaints
  const stats = {
    total: allComplaints.length,
    pending: allComplaints.filter(c => c.status === 'Pending').length,
    inProgress: allComplaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length,
    resolved: allComplaints.filter(c => c.status === 'Resolved').length,
  };

  return (
    <ComplaintsListClient
      initialComplaints={allComplaints}
      initialStats={stats}
      initialFilter={statusFilter || 'All'}
    />
  );
}
