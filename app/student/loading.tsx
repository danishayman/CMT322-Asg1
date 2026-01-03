export default function StudentLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#5e2a84] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 font-medium">Loading student portal...</p>
      </div>
    </div>
  )
}
