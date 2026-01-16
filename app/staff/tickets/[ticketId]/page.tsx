import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TicketDetailContent from './TicketDetailContent';

export const metadata: Metadata = {
  title: 'Ticket Details',
  description: 'View ticket details',
};

interface PageProps {
  params: { ticketId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function TicketDetailPage({ params }: { params: Promise<{ ticketId: string }> }) {
  // Await the params to get the resolved value
  const resolvedParams = await params;
  const ticketId = resolvedParams.ticketId;
  
  if (!ticketId) {
    notFound();
  }

  return <TicketDetailContent ticketId={ticketId} />;
}