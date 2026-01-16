'use client';

import { TicketTable } from '@/components/dashboard/ticket-table';
import { Inbox, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { StatsCards } from '@/components/dashboard/stats-card';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface TicketStats {
  total: number;
  open: number;
  pending: number;
  resolved: number;
}

export default function StaffDashboard() {
  const [stats, setStats] = useState<TicketStats>({
    total: 0,
    open: 0,
    pending: 0,
    resolved: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();
      setIsLoading(true);
      setError(null);
      
      try {
        // Get the authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error(userError?.message || 'User not found');
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

        // Get tickets assigned to this staff member using the public user ID
        const { data: tickets, error: ticketsError } = await supabase
          .from('complaints')
          .select('*')
          .eq('assigned_to', publicUser.id);

        if (ticketsError) throw ticketsError;

        // Update stats - count both 'Assigned' and 'Pending' as pending
        const total = tickets?.length || 0;
        const pending = tickets?.filter(t => t.status === 'Pending' || t.status === 'Assigned').length || 0;
        const open = tickets?.filter(t => t.status === 'In Progress').length || 0;
        const resolved = tickets?.filter(t => t.status === 'Resolved' || t.status === 'Closed').length || 0;

        setStats({ total, open, pending, resolved });

      } catch (error: any) {
        console.error('Error in fetchStats:', error);
        setError(
          error?.message || 
          error?.details || 
          'Failed to load ticket stats. Please check the console for details.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  // In your dashboard component, update the stats_data array to remove change and trend:
const stats_data = [
  {
    title: "Total Tickets",
    value: isLoading ? "..." : stats.total.toString(),
    icon: TrendingUp, 
    href: "/staff/tickets/all",
  },
  {
    title: "Pending Tickets",
    value: isLoading ? "..." : stats.pending.toString(),
    icon: Inbox, 
    href: "/staff/tickets/pending",
  },
  {
    title: "In-Progress", 
    value: isLoading ? "..." : stats.open.toString(),
    icon: Clock, 
    href: "/staff/tickets/open", 
  },
  {
    title: "Resolved", 
    value: isLoading ? "..." : stats.resolved.toString(),
    icon: CheckCircle, 
    href: "/staff/tickets/resolved", 
  },
];

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md">
        <h2 className="font-bold">Error loading dashboard</h2>
        <p className="mt-2 text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage and track help-desk tickets</p>
      </div>
      
      {isLoading ? (
        <div className="mt-6 p-8 text-center text-gray-500">
          Loading ticket statistics...
        </div>
      ) : (
        <>
          <div className="mt-6">
            <StatsCards stats={stats_data} />
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recent Tickets</h2>
            <TicketTable status="all" />
          </div>
        </>
      )}
    </div>
  );
}