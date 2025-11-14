import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const announcements = [
    {
      day: "12",
      month: "Nov",
      title: "HOSTEL MAINTENANCE SCHEDULED",
      color: "bg-[#4A2169]"
    },
    {
      day: "10",
      month: "Nov", 
      title: "NEW COMPLAINT SYSTEM LAUNCHED",
      color: "bg-orange-600"
    },
    {
      day: "1",
      month: "Nov",
      title: "MONTHLY HOSTEL MEETING",
      color: "bg-[#4A2169]"
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-linear-to-r from-[#4A2169] to-[#5d2a7f] shadow-lg">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/jata-usm-transparent.png"
              alt="USM Logo"
              width={40}
              height={40}
              className="brightness-0 invert"
            />
            <h1 className="text-2xl font-bold text-white">DesaHelp@USM</h1>
          </div>
          <Link 
            href="/login"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Welcome Card */}
          <div className="bg-linear-to-br from-[#4A2169] to-[#5d2a7f] rounded-3xl shadow-2xl p-12 flex flex-col items-center justify-center text-center text-white min-h-[500px]">
            <div className="mb-8 bg-white rounded-full p-6 shadow-xl">
              <Image
                src="/jata-usm.png"
                alt="USM Crest"
                width={120}
                height={120}
                quality={100}
                priority
              />
            </div>
            <h2 className="text-3xl font-bold mb-4">Welcome to</h2>
            <h1 className="text-4xl font-bold mb-8">DesaHelp@USM</h1>
            <Link 
              href="/login"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg"
            >
              Login with USM ID
            </Link>
            <p className="mt-6 text-[#d8c5e8] italic text-sm">
              Login with your USM Identity
            </p>
            <p className="text-[#c5b0d8] text-xs mt-1">
              Eg. ali@usm.my | ali@student.usm.my
            </p>
          </div>

          {/* Announcements Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-[#4A2169] mb-6">
              Hostel Announcements
            </h2>
            <div className="space-y-4">
              {announcements.map((announcement, index) => (
                <div 
                  key={index}
                  className={`${
                    announcement.color === "bg-[#4A2169]" 
                      ? "bg-[#f3eef7] border-[#d8c5e8]" 
                      : "bg-orange-50 border-orange-200"
                  } border-2 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`${announcement.color} text-white rounded-lg w-16 h-16 flex flex-col items-center justify-center shadow-md`}>
                      <span className="text-2xl font-bold">{announcement.day}</span>
                      <span className="text-xs uppercase">{announcement.month}</span>
                    </div>
                    <h3 className={`font-bold text-lg ${
                      announcement.color === "bg-[#4A2169]" 
                        ? "text-[#4A2169]" 
                        : "text-orange-900"
                    }`}>
                      {announcement.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
