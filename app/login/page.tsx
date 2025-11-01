export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-semibold text-black">USM Helpdesk</h1>
        </div>

        {/* Login Card */}
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-black mb-2 ">Login</h2>
            <p className="text-sm text-gray-600">Use your student or staff ID</p>
          </div>

          {/* Input Field */}
          <div>
            <input
              type="email"
              placeholder="email@student/staff.usm.my"
              className="w-full px-4 py-3 text-sm text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all font-semibold"
            />
          </div>

          {/* Login Button */}
          <div>
            <button className="w-full px-4 py-3 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
              Login
            </button>
          </div>

          {/* Terms and Privacy */}
          <div className="text-center text-xs text-gray-600">
            By clicking continue, you agree to our{" "}
            <br />
            <a href="#" className="text-black hover:underline font-bold">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-black hover:underline font-bold">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

