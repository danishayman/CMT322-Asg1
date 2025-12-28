import { getComplaintsNeedingFeedback } from '@/lib/actions/complaints';
import { getCurrentUser } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';
import FeedbackFormClient from './feedback-form-client';

export default async function Feedback() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  const result = await getComplaintsNeedingFeedback();
  const complaints = result.success ? result.data || [] : [];

  return (
    <FeedbackFormClient complaints={complaints} />
  );
}
