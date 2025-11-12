import { TicketDetailCard } from "@/components/dashboard/ticket-detail-card";

// Interface to type the URL parameters passed by Next.js
interface TicketPageProps {
    params: {
        ticketId: string; // This key matches the folder name: [ticketId]
    }
}

// 📌 Dummy data lookup function (simulating a backend API call)
// In a real app, this function would use the 'id' to query your database.
async function getTicketDetails(id: string) {
    // Determine status based on the example IDs used in ticket-table.tsx
    const status = (id === '12349' || id === '12350') ? true : false;
    
    return {
        id: id,
        category: "Plumbing",
        title: "Leaky Faucet in Block C, 3rd Floor",
        description: "The sink faucet in the shared bathroom on the 3rd floor of Block C has been leaking heavily for two days. Needs urgent repair before it causes mold.",
        hasPicture: true, // Assume picture exists for the dummy data
        isCompleted: status,
    };
}

export default async function TicketDetailPage({ params }: TicketPageProps) {
    
    const ticketId = params.ticketId;
    
    // Fetch the specific ticket data using the ID from the URL
    const ticketData = await getTicketDetails(ticketId);

    // This component is rendered inside the app/staff/layout.tsx, which provides the sidebar navigation.

    return (
        <div className="space-y-8">
            <TicketDetailCard
                id={ticketData.id}
                category={ticketData.category}
                title={ticketData.title}
                description={ticketData.description}
                hasPicture={ticketData.hasPicture}
                isCompleted={ticketData.isCompleted}
            />
        </div>
    );
}