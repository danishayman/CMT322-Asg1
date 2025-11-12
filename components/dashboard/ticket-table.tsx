"use client"
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" // Still uses your Card component

interface TicketTableProps {
    status: 'active' | 'pending' | 'resolved';
}

// 📌 Dummy data: Use 'id' for linking and 'status' for filtering
const dummyTickets = [
    { id: '12345', student: 'Ahmad bin Ali', issue: 'Leaky faucet in Block C', date: '2025-11-10', priority: 'High', status: 'active' },
    { id: '12346', student: 'Nurul Huda', issue: 'Internet disconnected', date: '2025-11-09', priority: 'Medium', status: 'active' },
    { id: '12347', student: 'Chong Wei', issue: 'Broken air-con', date: '2025-11-08', priority: 'High', status: 'pending' },
    { id: '12348', student: 'Siti Aisyah', issue: 'Requesting key replacement', date: '2025-11-07', priority: 'Low', status: 'pending' },
    { id: '12349', student: 'Michael Lee', issue: 'Faulty light switch', date: '2025-11-06', priority: 'Low', status: 'resolved' },
    { id: '12350', student: 'Rajesh Kumar', issue: 'No hot water in bathroom', date: '2025-11-05', priority: 'High', status: 'resolved' },
];

const statusTitles = {
    active: "Active Tickets",
    pending: "Pending Assignment",
    resolved: "Resolved Tickets",
};

export function TicketTable({ status }: TicketTableProps) {
    
    // Filter dummy data based on the status prop
    const filteredTickets = dummyTickets.filter(ticket => ticket.status === status);

    return (
        <Card className="shadow-lg overflow-hidden">
            <CardHeader className="border-b">
                <CardTitle className="text-xl">{statusTitles[status]}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
                                Ticket ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Student Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Issue Summary
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date Created
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Priority
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTickets.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">
                                    No {status} tickets found.
                                </td>
                            </tr>
                        ) : (
                            filteredTickets.map((ticket) => (
                                // Wrap the Table Row in Link to go to the dynamic detail page
                                <Link 
                                    href={`/staff/tickets/${ticket.id}`} 
                                    key={ticket.id} 
                                    passHref 
                                    legacyBehavior
                                >
                                    {/* The <tr> element acts as the table row */}
                                    <tr className="cursor-pointer hover:bg-purple-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#5e2a84]">
                                            #{ticket.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {ticket.student}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {ticket.issue}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {ticket.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                ticket.priority === 'High' ? 'bg-red-100 text-red-700' : 
                                                ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                                                'bg-green-100 text-green-700'
                                            }`}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                    </tr>
                                </Link>
                            ))
                        )}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    )
}