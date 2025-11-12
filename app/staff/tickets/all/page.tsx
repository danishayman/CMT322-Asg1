// File: app/staff/tickets/all/page.tsx (Reverted first space change)

import { TicketTable } from "@/components/dashboard/ticket-table"; 

export default function AllTicketsPage() {
    return (
        // Reverting from space-y-12 back to a minimal container spacing
        <div className="space-y-6"> 
            
            {/* Header Section */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">All Tickets Overview</h1>
                <p className="text-muted-foreground mt-1">View all complaints across every stage of the process.</p>
            </div>
            
            {/* Active Tickets Section (No top margin needed here) */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-red-600 border-b pb-2">Active Tickets</h2>
                <TicketTable status="active" />
            </div>

            {/* Pending Tickets Section - Uses mt-8 for a clear break from the table above */}
            <div className="space-y-4 mt-8"> 
                <h2 className="text-2xl font-semibold text-yellow-600 border-b pb-2">Pending Tickets</h2>
                <TicketTable status="pending" />
            </div>

            {/* Resolved Tickets Section - Uses mt-8 for a clear break from the table above */}
            <div className="space-y-4 mt-8"> 
                <h2 className="text-2xl font-semibold text-green-600 border-b pb-2">Resolved Tickets</h2>
                <TicketTable status="resolved" />
            </div>
        </div>
    );
}