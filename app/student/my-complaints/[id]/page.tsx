import { getComplaintById } from '@/lib/actions/complaints';
import { getFeedbackByComplaintId } from '@/lib/actions/feedback';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth';
import ComplaintDetailClient from './complaint-detail-client';

export default async function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  const { id } = await params;
  const result = await getComplaintById(parseInt(id));

  if (!result.success || !result.data) {
    return (
      <div className="space-y-6">
        <div>
          <a
            href="/student/my-complaints"
            className="text-[#5e2a84] hover:text-[#4a2169] font-medium text-sm transition-colors duration-200 flex items-center gap-1 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to My Complaints
          </a>
          <h1 className="text-3xl font-bold text-gray-900">Complaint Not Found</h1>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600">The complaint you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
        </div>
      </div>
    );
  }

  const complaint = result.data;
  
  // Check if feedback exists
  const feedbackResult = await getFeedbackByComplaintId(complaint.id);
  const existingFeedback = feedbackResult.data || null;

  return (
    <ComplaintDetailClient 
      complaint={complaint} 
      existingFeedback={existingFeedback}
    />
  );
}
