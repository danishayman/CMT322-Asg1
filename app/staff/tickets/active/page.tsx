import { TicketTable } from "@/components/dashboard/ticket-table"; 

export default function ActiveTicketsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Active Tickets</h1>
                <p className="text-muted-foreground mt-1">Tickets currently assigned and in progress.</p>
            </div>
            
            <TicketTable status="active" />
        </div>
    );
}