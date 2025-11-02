'use client';

export default function StudentDashboard() {
  const stats = [
    {
      title: 'Pending Complaints',
      count: 3,
      description: 'Awaiting review',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-100',
      icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      title: 'In Progress',
      count: 5,
      description: 'Being handled',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-100',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      title: 'Resolved',
      count: 2,
      description: 'Successfully completed',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-100',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
  ];

  const recentComplaints = [
    {
      id: 1,
      title: 'Library WiFi Not Working',
      category: 'IT Services',
      status: 'In Progress',
      date: 'Oct 28, 2024',
    },
    {
      id: 2,
      title: 'Air Conditioning Issue in Lecture Hall',
      category: 'Facilities',
      status: 'Pending',
      date: 'Oct 27, 2024',
    },
    {
      id: 3,
      title: 'Course Registration Problem',
      category: 'Academic',
      status: 'Resolved',
      date: 'Oct 25, 2024',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-red-100 text-red-700';
      case 'In Progress':
        return 'bg-amber-100 text-amber-700';
      case 'Resolved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, Student!</h1>
        <p className="text-gray-600 mt-2">Track and manage your complaints from the dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`
              bg-white rounded-lg shadow-sm border ${stat.borderColor}
              p-6 hover:shadow-md hover:scale-[1.02]
              transition-all duration-200 cursor-pointer
            `}
          >
            {/* Icon */}
            <div className={`${stat.bgColor} ${stat.textColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
              </svg>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.count}</p>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Complaints */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Complaints</h2>
          <p className="text-sm text-gray-600 mt-1">Your latest submitted complaints</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {recentComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {complaint.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="text-gray-600">
                      <span className="font-medium text-[#5e2a84]">{complaint.category}</span>
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{complaint.date}</span>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button className="text-[#5e2a84] hover:text-[#4a2169] font-medium text-sm transition-colors duration-200">
            View All Complaints →
          </button>
        </div>
      </div>
    </div>
  );
}

