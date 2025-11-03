'use client';

import { useState } from 'react';

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

export default function MyComplaintsPage() {
  const [filter, setFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for complaints
  const allComplaints: Complaint[] = [
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

  const filterOptions = ['All', 'Pending', 'In Progress', 'Resolved', 'Closed'];

  const filteredComplaints = allComplaints.filter((complaint) => {
    const matchesFilter = filter === 'All' || complaint.status === filter;
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'In Progress':
        return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'Resolved':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'Closed':
        return 'M5 13l4 4L19 7';
      default:
        return 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  };

  const stats = [
    { label: 'Total', count: allComplaints.length, color: 'text-[#5e2a84]' },
    {
      label: 'Pending',
      count: allComplaints.filter((c) => c.status === 'Pending').length,
      color: 'text-red-600',
    },
    {
      label: 'In Progress',
      count: allComplaints.filter((c) => c.status === 'In Progress').length,
      color: 'text-amber-600',
    },
    {
      label: 'Resolved',
      count: allComplaints.filter((c) => c.status === 'Resolved').length,
      color: 'text-green-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Complaints</h1>
        <p className="text-gray-600 mt-2">
          Track and manage all your submitted complaints
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
          >
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e2a84] focus:border-transparent transition-all duration-200 hover:border-gray-400"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  filter === option
                    ? 'bg-[#5e2a84] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No complaints found
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? 'Try adjusting your search or filter'
              : 'You haven\'t submitted any complaints yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${getStatusColor(complaint.status)} p-2 rounded-lg`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={getStatusIcon(complaint.status)}
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {complaint.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="inline-flex items-center gap-1">
                            <span className="font-medium text-[#5e2a84]">
                              {complaint.category}
                            </span>
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className={`font-medium ${getPriorityColor(complaint.priority)}`}>
                            {complaint.priority} Priority
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500">
                            ID: #{complaint.id.toString().padStart(4, '0')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600 leading-relaxed">{complaint.description}</p>
                </div>

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
                        <h4 className="text-sm font-semibold text-[#5e2a84] mb-1">
                          Response from {complaint.assignedTo}
                        </h4>
                        <p className="text-sm text-gray-700">{complaint.response}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Submitted: {complaint.dateSubmitted}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Updated: {complaint.lastUpdated}
                    </span>
                    {complaint.assignedTo && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Assigned to: {complaint.assignedTo}
                      </span>
                    )}
                  </div>
                  <button className="text-[#5e2a84] hover:text-[#4a2169] font-medium text-sm transition-colors duration-200 flex items-center gap-1">
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      {filteredComplaints.length > 0 && (
        <div className="text-center text-sm text-gray-600">
          Showing {filteredComplaints.length} of {allComplaints.length} complaint
          {allComplaints.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

