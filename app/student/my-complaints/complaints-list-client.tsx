'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ComplaintWithDetails, ComplaintStatus, ComplaintPriority } from '@/lib/types/database';

interface Props {
  initialComplaints: ComplaintWithDetails[];
  initialStats: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
  };
  initialFilter: string;
}

export default function ComplaintsListClient({
  initialComplaints,
  initialStats,
  initialFilter
}: Props) {
  const [filter, setFilter] = useState<string>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions = ['All', 'Pending', 'In Progress', 'Resolved', 'Closed'];

  const filteredComplaints = initialComplaints.filter((complaint) => {
    // Handle "In Progress" filter to also match "Assigned" status
    const matchesFilter = filter === 'All' ||
      complaint.status === filter ||
      (filter === 'In Progress' && complaint.status === 'Assigned');
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'In Progress':
      case 'Assigned':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: ComplaintPriority) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const stats = [
    { label: 'Total', count: initialStats.total, color: 'text-[#5e2a84]' },
    { label: 'Pending', count: initialStats.pending, color: 'text-red-600' },
    { label: 'In Progress', count: initialStats.inProgress, color: 'text-amber-600' },
    { label: 'Resolved', count: initialStats.resolved, color: 'text-green-600' },
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
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${filter === option
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
          <p className="text-gray-600 mb-4">
            {searchQuery
              ? 'Try adjusting your search or filter'
              : "You haven't submitted any complaints yet"}
          </p>
          {!searchQuery && (
            <Link
              href="/student/submit"
              className="inline-block bg-[#5e2a84] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#4a2169] transition-colors"
            >
              Submit New Complaint
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {complaint.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="font-medium text-[#5e2a84]">
                        {complaint.category}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className={`font-medium ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority} Priority
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">
                        {complaint.complaint_id}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      complaint.status
                    )}`}
                  >
                    {complaint.status}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDate(complaint.date_submitted)}
                  </div>
                  <div className="flex items-center gap-2">
                    {complaint.status === 'Resolved' && !complaint.feedback && (
                      <Link
                        href={`/student/my-complaints/${complaint.id}`}
                        className="bg-[#5e2a84] hover:bg-[#4a2169] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center gap-1"
                      >
                        Submit Review
                      </Link>
                    )}
                    <Link
                      href={`/student/my-complaints/${complaint.id}`}
                      className="text-[#5e2a84] hover:text-[#4a2169] font-medium text-sm transition-colors duration-200 flex items-center gap-1"
                    >
                      View Details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      {filteredComplaints.length > 0 && (
        <div className="text-center text-sm text-gray-600">
          Showing {filteredComplaints.length} of {initialStats.total} complaint
          {initialStats.total !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
