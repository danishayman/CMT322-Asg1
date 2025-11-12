'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Assumed Button component from ui/button.tsx
import { useParams } from 'next/navigation';

// Dummy data structure for a single ticket detail
interface TicketDetailProps {
    id: string;
    category: string;
    title: string;
    description: string;
    hasPicture: boolean;
    isCompleted: boolean;
}

export function TicketDetailCard({ id, category, title, description, hasPicture, isCompleted }: TicketDetailProps) {
    
    // Placeholder function for the action button
    const handleMarkCompleted = () => {
        // In a real app, this would call an API to update the ticket status
        alert(`Ticket #${id} marked as completed!`);
    };

    return (
        // The main container for the ticket details, matching the white card in your image
        <Card className="shadow-xl p-6 max-w-4xl mx-auto border-t-4 border-[#5e2a84]">
            <CardHeader className="p-0 mb-8">
                <CardTitle className="text-2xl font-bold">
                    COMPLAIN ID **#{id}**
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-0">
                
                {/* Category Field */}
                <div className="space-y-1">
                    <p className="text-base font-medium text-gray-500">Category</p>
                    <p className="text-lg font-normal text-gray-800">{category}</p>
                </div>
                
                {/* Title Field */}
                <div className="space-y-1">
                    <p className="text-base font-medium text-gray-500">Title</p>
                    <p className="text-lg font-normal text-gray-800">{title}</p>
                </div>

                {/* Description Field */}
                <div className="space-y-1">
                    <p className="text-base font-medium text-gray-500">Description</p>
                    <p className="text-lg font-normal text-gray-800">{description}</p>
                </div>
                
                {/* Uploaded Picture Section */}
                <div className="pt-4">
                    <p className="text-base font-medium text-gray-500 mb-2">Uploaded Picture</p>
                    {hasPicture ? (
                        <Button 
                            className="bg-[#5e2a84] hover:bg-purple-700 text-white shadow-md transition-colors" 
                            onClick={() => alert('Simulating opening uploaded picture...')}
                        >
                            Click to Open
                        </Button>
                    ) : (
                        <span className="text-gray-500 italic text-sm">No picture uploaded.</span>
                    )}
                </div>

                {/* Action Button: Mark as Completed */}
                <div className="flex justify-end pt-10">
                    {isCompleted ? (
                        <Button disabled className="bg-gray-400 text-white font-bold px-8 py-2 text-base cursor-not-allowed">
                            Marked as Completed
                        </Button>
                    ) : (
                        <Button 
                            className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-2 text-base shadow-lg transition-colors" 
                            onClick={handleMarkCompleted}
                        >
                            Mark as Completed
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}