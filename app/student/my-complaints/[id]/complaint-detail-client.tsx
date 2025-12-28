'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StarRating } from '@/components/ui/star_rating';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { submitFeedback } from '@/lib/actions/feedback';
import { 
  ComplaintWithDetails, 
  Feedback, 
  ComplaintStatus, 
  ComplaintPriority,
  RepairQuality,
  ResponseSpeed,
  ComplaintResponseWithStaff
} from '@/lib/types/database';

interface Props {
  complaint: ComplaintWithDetails;
  existingFeedback: Feedback | null;
}

export default function ComplaintDetailClient({ complaint, existingFeedback }: Props) {
  const router = useRouter();
  const [rating, setRating] = useState(existingFeedback?.overall_rating || 0);
  const [comment, setComment] = useState(existingFeedback?.comment || '');
  const [repairQuality, setRepairQuality] = useState<string>(existingFeedback?.repair_quality || '');
  const [responseSpeed, setResponseSpeed] = useState<string>(existingFeedback?.response_speed || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(!!existingFeedback);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitFeedback({
        complaint_id: complaint.id,
        overall_rating: rating,
        comment: comment || null,
        repair_quality: repairQuality ? repairQuality as RepairQuality : null,
        response_speed: responseSpeed ? responseSpeed as ResponseSpeed : null,
      });

      if (result.success) {
        toast.success('Review submitted successfully!');
        setFeedbackSubmitted(true);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Submit review error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'In Progress':
      case 'Assigned':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: ComplaintPriority) => {
    switch (priority) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-amber-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link
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
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{complaint.title}</h1>
            <p className="text-gray-600 mt-2">
              {complaint.complaint_id}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
              complaint.status
            )}`}
          >
            {complaint.status}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-600 mb-1">Category</p>
            <p className="font-medium text-[#5e2a84]">{complaint.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Priority</p>
            <p className={`font-medium ${getPriorityColor(complaint.priority)}`}>
              {complaint.priority}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Submitted</p>
            <p className="font-medium text-gray-900">{formatDate(complaint.date_submitted)}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
          <p className="text-gray-600 leading-relaxed">{complaint.description}</p>
        </div>

        {/* Photo */}
        {complaint.photo_url && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Attached Photo</h2>
            <img 
              src={complaint.photo_url} 
              alt="Complaint photo" 
              className="max-w-md rounded-lg border border-gray-200"
            />
          </div>
        )}

        {/* Staff Responses */}
        {complaint.responses && complaint.responses.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Staff Responses</h2>
            {complaint.responses.map((response) => (
              <div key={response.id} className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-[#5e2a84] shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-semibold text-[#5e2a84]">
                        {response.staff?.full_name || 'Staff'}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(response.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{response.response_text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Additional Info */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Last Updated: {formatDate(complaint.updated_at)}
            </div>
            {complaint.assigned_staff && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Assigned to: {complaint.assigned_staff.full_name}
              </div>
            )}
            {complaint.date_resolved && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Resolved: {formatDate(complaint.date_resolved)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Section - Only for Resolved Complaints without feedback */}
      {complaint.status === 'Resolved' && !feedbackSubmitted && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Review This Resolution</h2>
          <p className="text-gray-600 mb-6">Please share your feedback to help us improve our service!</p>
          
          <form onSubmit={handleSubmitReview} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating <span className="text-red-500">*</span>
              </label>
              <StarRating value={rating} onChange={setRating} />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                disabled={isSubmitting}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#5e2a84] focus:border-transparent disabled:opacity-50"
              />
            </div>

            {/* Repair Quality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repair Quality
              </label>
              <RadioGroup value={repairQuality} onValueChange={setRepairQuality}>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="good"
                      className="border-gray-400 transition-colors duration-200 data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                    />
                    <span className="text-sm">Good</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="acceptable"
                      className="border-gray-400 transition-colors duration-200 data-[state=checked]:border-yellow-500 data-[state=checked]:bg-yellow-500"
                    />
                    <span className="text-sm">Acceptable</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="bad"
                      className="border-gray-400 transition-colors duration-200 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500"
                    />
                    <span className="text-sm">Bad</span>
                  </label>
                </div>
              </RadioGroup>
            </div>

            {/* Response Speed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Response Speed
              </label>
              <RadioGroup value={responseSpeed} onValueChange={setResponseSpeed}>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="within a few hours"
                      className="border-gray-400 transition-colors duration-200 data-[state=checked]:border-[#5e2a84] data-[state=checked]:bg-[#5e2a84]"
                    />
                    <span className="text-sm">Within a few hours</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="1-2 days"
                      className="border-gray-400 transition-colors duration-200 data-[state=checked]:border-[#5e2a84] data-[state=checked]:bg-[#5e2a84]"
                    />
                    <span className="text-sm">1-2 days</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="2-3 days"
                      className="border-gray-400 transition-colors duration-200 data-[state=checked]:border-[#5e2a84] data-[state=checked]:bg-[#5e2a84]"
                    />
                    <span className="text-sm">2-3 days</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem
                      value="more than 4 days"
                      className="border-gray-400 transition-colors duration-200 data-[state=checked]:border-[#5e2a84] data-[state=checked]:bg-[#5e2a84]"
                    />
                    <span className="text-sm">More than 4 days</span>
                  </label>
                </div>
              </RadioGroup>
            </div>

            {/* Submit Button */}
            <div>
              <Button 
                type="submit" 
                className="bg-[#5e2a84] hover:bg-[#4a2169]"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Feedback Display */}
      {feedbackSubmitted && existingFeedback && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Feedback</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-700 text-sm">Thank you for your feedback!</p>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Rating</p>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${star <= existingFeedback.overall_rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            {existingFeedback.comment && (
              <div>
                <p className="text-sm text-gray-600">Comment</p>
                <p className="text-gray-900">{existingFeedback.comment}</p>
              </div>
            )}
            {existingFeedback.repair_quality && (
              <div>
                <p className="text-sm text-gray-600">Repair Quality</p>
                <p className="text-gray-900 capitalize">{existingFeedback.repair_quality}</p>
              </div>
            )}
            {existingFeedback.response_speed && (
              <div>
                <p className="text-sm text-gray-600">Response Speed</p>
                <p className="text-gray-900 capitalize">{existingFeedback.response_speed}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
