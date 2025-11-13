'use client';

import { icons } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import path from 'path';
import { useState, useEffect, useRef } from 'react';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const navLinks = [
    { 
      name: 'Dashboard', 
      path: '/staff', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' 
    },
    { 
      name: 'Complaints', 
      path: '/staff/complaints', 
      icon: 'M12 4v16m8-8H4' 
    },
    { 
      name: 'Feedback', 
      path: '/staff/feedback', 
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' 
    },
    {
      name: 'Active Tickets',
      path: '/staff/tickets/active',
      icon: 'M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2ZM12 8v4M12 16h.01',
    },
    {
      name: 'Pending Tickets',
      path: '/staff/tickets/pending',
      icon: 'M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2ZM12 6v6l4 2',
      },
    {
      name: 'Resolved Tickets',
      path: '/staff/tickets/resolved',
      icon: 'M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2ZM8 12l2 2 4-4',
    },

  ];

  const handleLogout = () => {
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  // Handle clicking outside sidebar to collapse it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only collapse on desktop when expanded
      if (window.innerWidth >= 1024 && !isCollapsed) {
        const target = event.target as Node;
        if (sidebarRef.current && !sidebarRef.current.contains(target)) {
          // Check if click is not on the toggle button in navbar
          const toggleButton = document.querySelector('[aria-label="Toggle sidebar"]');
          if (toggleButton && !toggleButton.contains(target)) {
            setIsCollapsed(true);
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCollapsed]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-30 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Mobile menu button (visible on mobile) */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop collapse button (visible on desktop) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"}
              />
            </svg>
          </button>

          {/* Logo/Title */}
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              USM Hostel <span className="text-[#5e2a84]">|</span> <span className="text-gray-600 font-normal">Complaint Portal</span>
            </h1>
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#5e2a84] flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <span className="text-white font-medium text-sm">S</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed left-0 top-16 h-[calc(100vh-4rem)] 
          bg-white border-r border-gray-200 shadow-lg
          transform transition-all duration-300 ease-in-out z-20 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 
          ${isCollapsed ? 'lg:w-20 lg:cursor-pointer' : 'lg:w-64'}
        `}
        onClick={(e) => {
          // Only expand on desktop when collapsed and not clicking on a button
          if (isCollapsed && window.innerWidth >= 1024 && !(e.target as HTMLElement).closest('button')) {
            setIsCollapsed(false);
          }
        }}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Navigation Links */}
          <nav className="space-y-2 flex-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  router.push(link.path);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg 
                  font-medium text-sm transition-all duration-200
                  ${isActive(link.path)
                    ? 'bg-[#5e2a84] text-white shadow-md'
                    : 'text-gray-700 hover:bg-purple-50 hover:text-[#5e2a84]'
                  }
                  ${isCollapsed ? 'lg:justify-center' : ''}
                `}
                title={isCollapsed ? link.name : ''}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                </svg>
                <span className={`${isCollapsed ? 'lg:hidden' : ''}`}>{link.name}</span>
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg 
              text-gray-700 hover:bg-red-50 hover:text-red-600 
              transition-all duration-200 mt-auto font-medium text-sm
              ${isCollapsed ? 'lg:justify-center' : ''}
            `}
            title={isCollapsed ? 'Logout' : ''}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className={`${isCollapsed ? 'lg:hidden' : ''}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden top-16 transition-opacity duration-300"
        />
      )}

      {/* Main Content */}
      <main className={`
        pt-16 min-h-screen transition-all duration-300 ease-in-out
        ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}
      `}>
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

