'use client';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleStudentLogin = () => {
    router.push('/student');
  };

  const handleStaffLogin = () => {
    router.push('/staff');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      {/* Login Card */}
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-10">
          {/* Header Section */}
          <div className="text-center mb-8">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Hostel Accommodation Complaint System
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-lg">
              Universiti Sains Malaysia
            </p>
          </div>

          {/* Login Buttons */}
          <div className="space-y-3 mt-8">
            {/* Student Login Button */}
            <button
              onClick={handleStudentLogin}
              className="w-full bg-[#5e2a84] hover:bg-[#4a2169] text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#5e2a84] focus:ring-offset-2"
            >
              Login as Student
            </button>

            {/* Staff Login Button */}
            <button
              onClick={handleStaffLogin}
              className="w-full bg-[#5e2a84] hover:bg-[#4a2169] text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#5e2a84] focus:ring-offset-2"
            >
              Login as Staff
            </button>
          </div>
        </div>
      </div>

      {/* Fade-in Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
