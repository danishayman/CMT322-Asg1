'use client';

export default function StudentDashboard() {
  const stats = [
    {
      title: 'Pending Complaints',
      count: 3,
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      title: 'In Progress',
      count: 5,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      title: 'Resolved',
      count: 2,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
  ];

  return (
    <div>
      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, Student!</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            {/* Icon */}
            <div className={`${stat.bgColor} ${stat.textColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-gray-600 text-sm font-medium mb-2">{stat.title}</h3>

            {/* Count */}
            <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

