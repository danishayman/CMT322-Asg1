import { TicketTable } from "@/components/dashboard/ticket-table"; 

export default function PendingTicketsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Pending Tickets</h1>
                <p className="text-muted-foreground mt-1">Tickets awaiting staff assignment or initial review.</p>
            </div>
            
            <TicketTable status="pending" />
        </div>
    );
}