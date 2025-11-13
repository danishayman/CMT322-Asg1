'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Route based on email domain - check more specific domains first
    if (email.endsWith('@admin.usm.my')) {
      router.push('/admin');
    } else if (email.endsWith('@student.usm.my')) {
      router.push('/student');
    } else if (email.endsWith('@usm.my')) {
      router.push('/staff');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Background Image */}
      <div className="hidden lg:block lg:w-[60%] relative">
        <Image
          src="/login-bg.png"
          alt="USM Campus"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-[40%] bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* USM Logo */}
          <div className="flex mb-12 justify-items-center">
            <Image
              src="/logo-usm.png"
              alt="USM Logo"
              width={280}
              height={80}
              className="object-contain"
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-normal text-gray-800 mb-8">
            Identity Single Sign On
          </h1>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="*@usm.my or any *.usm.my subdomains"
                className="w-full px-4 py-3 bg-gray-100 border-none rounded text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-100 border-none rounded text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium py-2.5 px-8 rounded transition-colors duration-200"
              >
                Sign in
              </button>
            </div>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-1">
            <a href="#" className="block text-[#1a73e8] hover:underline text-sm">
              Change Password
            </a>
            <a href="#" className="block text-[#1a73e8] hover:underline text-sm">
              Forgot Account ID
            </a>
          </div>

          {/* Need Help */}
          <div className="mt-16">
            <a href="#" className="text-[#1a73e8] hover:underline text-2xl font-normal">
              Need Help?
            </a>
          </div>

          {/* Footer Links */}
          <div className="mt-auto pt-16 flex gap-6 text-xs text-gray-600">
            <a href="#" className="hover:underline">
              www.usm.my
            </a>
            <a href="#" className="hover:underline">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
