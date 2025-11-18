'use client';

import { use, useState } from 'react';
import { StarRating } from '@/components/ui/star_rating';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface Complaint {
  id: number;
  title: string;
  category: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  dateSubmitted: string;
  lastUpdated: string;
  assignedTo?: string;
  response?: string;
}

// Mock data - same as in the list page
const mockComplaints: Complaint[] = [
  {
    id: 1,
    title: 'Broken Air Conditioner in Room B-305',
    category: 'Room Maintenance',
    description: 'The air conditioner in my room (B-305) has stopped working completely. It is not cooling at all and makes a strange grinding noise. The room is unbearably hot, especially during the afternoon.',
    status: 'In Progress',
    priority: 'High',
    dateSubmitted: 'Oct 28, 2024',
    lastUpdated: 'Oct 30, 2024',
    assignedTo: 'Hostel Maintenance Team',
    response: 'We have diagnosed the issue. The compressor needs replacement. A technician will install a new unit within the next 2 days.',
  },
  {
    id: 2,
    title: 'Water Leakage from Bathroom Ceiling',
    category: 'Plumbing',
    description: 'There is water leaking from the bathroom ceiling in Room A-208. The leakage has caused water damage to the floor and walls. This appears to be coming from the upper floor bathroom.',
    status: 'Pending',
    priority: 'High',
    dateSubmitted: 'Oct 27, 2024',
    lastUpdated: 'Oct 27, 2024',
  },
  {
    id: 3,
    title: 'Non-Functional Study Room Light',
    category: 'Common Areas',
    description: 'The fluorescent lights in the 3rd floor study room are not working. Only 2 out of 8 lights are functioning, making it too dark to study effectively in the evening.',
    status: 'Resolved',
    priority: 'Medium',
    dateSubmitted: 'Oct 25, 2024',
    lastUpdated: 'Oct 26, 2024',
    assignedTo: 'Electrical Maintenance',
    response: 'All fluorescent tubes have been replaced. The study room is now fully lit and ready for use.',
  },
  {
    id: 4,
    title: 'Broken Door Lock in Room C-112',
    category: 'Room Maintenance',
    description: 'The door lock mechanism in Room C-112 is faulty. The key gets stuck and sometimes the door cannot be locked properly. This is a security concern.',
    status: 'In Progress',
    priority: 'High',
    dateSubmitted: 'Oct 24, 2024',
    lastUpdated: 'Oct 29, 2024',
    assignedTo: 'Hostel Security',
    response: 'A new lock has been ordered and will be installed by the end of this week.',
  },
  {
    id: 5,
    title: 'Dirty Common Bathroom on Floor 2',
    category: 'Cleanliness',
    description: 'The common bathroom on the 2nd floor has not been cleaned properly for several days. There are visible stains, and the trash bins are overflowing.',
    status: 'Resolved',
    priority: 'Medium',
    dateSubmitted: 'Oct 20, 2024',
    lastUpdated: 'Oct 23, 2024',
    assignedTo: 'Cleaning Services',
    response: 'We have addressed this issue with our cleaning staff. The bathroom has been deep cleaned and the cleaning schedule has been adjusted to ensure regular maintenance.',
  },
  {
    id: 6,
    title: 'Insufficient Hot Water Supply',
    category: 'Plumbing',
    description: 'The hot water heater in Block D is not producing enough hot water. During morning hours (6-8 AM), the water is barely warm, making it uncomfortable to shower.',
    status: 'Closed',
    priority: 'Medium',
    dateSubmitted: 'Oct 15, 2024',
    lastUpdated: 'Oct 22, 2024',
    assignedTo: 'Hostel Maintenance Team',
    response: 'The water heater capacity has been upgraded to a larger unit. Hot water supply should now be sufficient even during peak hours.',
  },
  {
    id: 7,
    title: 'Excessive Noise from Neighboring Room',
    category: 'Noise Complaint',
    description: 'There is excessive noise coming from Room B-204 late at night (after 11 PM). Loud music and conversations are disturbing my sleep and affecting my studies.',
    status: 'In Progress',
    priority: 'Medium',
    dateSubmitted: 'Oct 18, 2024',
    lastUpdated: 'Oct 28, 2024',
    assignedTo: 'Hostel Warden',
    response: 'We have spoken to the residents of Room B-204 about the noise complaint. They have been reminded of the quiet hours policy (11 PM - 7 AM).',
  },
  {
    id: 8,
    title: 'Malfunctioning Washing Machine',
    category: 'Common Areas',
    description: 'The washing machine on the 4th floor laundry room is not working properly. It stops mid-cycle and displays an error code. This is the only washing machine on this floor.',
    status: 'Pending',
    priority: 'Medium',
    dateSubmitted: 'Nov 1, 2024',
    lastUpdated: 'Nov 1, 2024',
  },
];

export default function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const complaint = mockComplaints.find((c) => c.id === parseInt(id));
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [repairQuality, setRepairQuality] = useState('');
  const [responseSpeed, setResponseSpeed] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Review submitted successfully!');
  };

  if (!complaint) {
    return (
      <div className="space-y-6">
        <div>
          <a
            href="/student/my-complaints"
            className="text-[#5e2a84] hover:text-[#4a2169] font-medium text-sm transition-colors duration-200 flex items-center gap-1 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to My Complaints
          </a>
          <h1 className="text-3xl font-bold text-gray-900">Complaint Not Found</h1>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600">The complaint you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'In Progress':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-amber-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <a
          href="/student/my-complaints"
          className="text-[#5e2a84] hover:text-[#4a2169] font-medium text-sm transition-colors duration-200 flex items-center gap-1 mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to My Complaints
        </a>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{complaint.title}</h1>
            <p className="text-gray-600 mt-2">
              ID: #{complaint.id.toString().padStart(4, '0')}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
              complaint.status
            )}`}
          >
            {complaint.status}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-600 mb-1">Category</p>
            <p className="font-medium text-[#5e2a84]">{complaint.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Priority</p>
            <p className={`font-medium ${getPriorityColor(complaint.priority)}`}>
              {complaint.priority}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Submitted</p>
            <p className="font-medium text-gray-900">{complaint.dateSubmitted}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
          <p className="text-gray-600 leading-relaxed">{complaint.description}</p>
        </div>

        {/* Response */}
        {complaint.response && (
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-[#5e2a84] shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-[#5e2a84] mb-1">
                  Response from {complaint.assignedTo}
                </h3>
                <p className="text-sm text-gray-700">{complaint.response}</p>
              </div>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Last Updated: {complaint.lastUpdated}
            </div>
            {complaint.assignedTo && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Assigned to: {complaint.assignedTo}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Section - Only for Resolved Complaints */}
      {complaint.status === 'Resolved' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Review This Resolution</h2>
          <p className="text-gray-600 mb-6">Please share your feedback to help us improve our service!</p>
          
          <form onSubmit={handleSubmitReview} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating
              </label>
              <StarRating value={rating} onChange={setRating} />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#5e2a84] focus:border-transparent"
              />
            </div>

            {/* Repair Quality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repair Quality
              </label>
              <RadioGroup value={repairQuality} onValueChange={setRepairQuality}>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="good"
                      className="
                        border-gray-400 
                        transition-colors duration-200
                        data-[state=checked]:border-green-500 
                        data-[state=checked]:bg-green-500
                        data-[state=checked]:text-white
                      "
                    />
                    <span className="text-sm">Good</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="acceptable"
                      className="
                        border-gray-400 
                        transition-colors duration-200
                        data-[state=checked]:border-yellow-500 
                        data-[state=checked]:bg-yellow-500
                      "
                    />
                    <span className="text-sm">Acceptable</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="bad"
                      className="
                        border-gray-400 
                        transition-colors duration-200
                        data-[state=checked]:border-red-500 
                        data-[state=checked]:bg-red-500
                      "
                    />
                    <span className="text-sm">Bad</span>
                  </label>
                </div>
              </RadioGroup>
            </div>

            {/* Response Speed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Response Speed
              </label>
              <RadioGroup value={responseSpeed} onValueChange={setResponseSpeed}>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="within a few hours"
                      className="
                        border-gray-400 
                        transition-colors duration-200
                        data-[state=checked]:border-[#5e2a84] 
                        data-[state=checked]:bg-[#5e2a84]
                      "
                    />
                    <span className="text-sm">Within a few hours</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="1-2 days"
                      className="
                        border-gray-400 
                        transition-colors duration-200
                        data-[state=checked]:border-[#5e2a84] 
                        data-[state=checked]:bg-[#5e2a84]
                      "
                    />
                    <span className="text-sm">1-2 days</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="2-3 days"
                      className="
                        border-gray-400 
                        transition-colors duration-200
                        data-[state=checked]:border-[#5e2a84] 
                        data-[state=checked]:bg-[#5e2a84]
                      "
                    />
                    <span className="text-sm">2-3 days</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="more than 4 days"
                      className="
                        border-gray-400 
                        transition-colors duration-200
                        data-[state=checked]:border-[#5e2a84] 
                        data-[state=checked]:bg-[#5e2a84]
                      "
                    />
                    <span className="text-sm">More than 4 days</span>
                  </label>
                </div>
              </RadioGroup>
            </div>

            {/* Submit Button */}
            <div>
              <Button type="submit" className="bg-[#5e2a84] hover:bg-[#4a2169]">
                Submit Review
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
