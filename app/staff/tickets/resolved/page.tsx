import { TicketTable } from "@/components/dashboard/ticket-table"; 

export default function ResolvedTicketsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Resolved Tickets</h1>
                <p className="text-muted-foreground mt-1">Tickets that have been successfully closed.</p>
            </div>
            
            <TicketTable status="resolved" />
        </div>
    );
}