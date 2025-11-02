'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/student/dashboard', icon: '📊' },
    { name: 'Submit Complaint', href: '/student/submit-complaint', icon: '✍️' },
    { name: 'My Complaints', href: '/student/my-complaints', icon: '📋' },
    { name: 'Logout', href: '/login', icon: '🚪' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-200"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              {/* Logo/Title */}
              <div className="flex ml-2 md:mr-24">
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap">
                  <span className="text-purple-600">HostelFix</span>
                  <span className="text-gray-400 text-base ml-2">| Student Portal</span>
                </span>
              </div>
            </div>
            {/* User Avatar */}
            <div className="flex items-center">
              <div className="flex items-center ml-3">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700 hidden sm:block">John Doe</span>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-semibold shadow-lg">
                    JD
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-gray-200 lg:translate-x-0 shadow-lg`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
          <ul className="space-y-2 font-medium">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                      active
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                    }`}
                  >
                    <span className="text-2xl mr-3">{item.icon}</span>
                    <span className="flex-1 text-base font-medium">{item.name}</span>
                    {active && (
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gradient-to-br from-purple-50 to-white">
            <div className="text-xs text-gray-600 text-center">
              <p className="font-semibold text-purple-600">Student Dashboard</p>
              <p className="mt-1">Version 1.0</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900 bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="lg:ml-64 pt-16">
        <main className="p-4 lg:p-6 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}

