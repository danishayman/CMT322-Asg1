'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { signIn, signUpStudent } from '@/lib/actions/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.success && result.redirectTo) {
        toast.success(`Welcome back, ${result.user?.full_name || 'User'}!`);
        router.push(result.redirectTo);
        router.refresh();
      } else {
        toast.error(result.error || 'Login failed. Please try again.');
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate student email
    if (!email.endsWith('@student.usm.my')) {
      toast.error('Student registration requires a @student.usm.my email address.');
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUpStudent(email, password, fullName);

      if (result.success) {
        toast.success('Account created successfully! Please check your email to verify your account.');
        setIsSignUp(false);
        // Clear form
        setEmail('');
        setPassword('');
        setFullName('');
      } else {
        toast.error(result.error || 'Registration failed. Please try again.');
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
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
            {isSignUp ? 'Student Registration' : 'Identity Single Sign On'}
          </h1>

          {/* Login/SignUp Form */}
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
            {/* Full Name Input (Sign Up only) */}
            {isSignUp && (
              <div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 bg-gray-100 border-none rounded text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Email Input */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isSignUp ? "*@student.usm.my" : "*@usm.my or any *.usm.my subdomains"}
                className="w-full px-4 py-3 bg-gray-100 border-none rounded text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
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
                disabled={isLoading}
                minLength={6}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium py-2.5 px-8 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign in')}
              </button>
            </div>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setEmail('');
                setPassword('');
                setFullName('');
              }}
              className="text-[#1a73e8] hover:underline text-sm"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'New student? Create an account'}
            </button>
          </div>

          {/* Links */}
          <div className="mt-4 space-y-1">
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
