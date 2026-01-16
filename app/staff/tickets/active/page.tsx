import { TicketTable } from "@/components/dashboard/ticket-table"; 

export default function ActiveTicketsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Tickets In Progress</h1>
                <p className="text-muted-foreground mt-1">Tickets you are currently working on.</p>
            </div>
            
            <TicketTable status="open" />
        </div>
    );
}