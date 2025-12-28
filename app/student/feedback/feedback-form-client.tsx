'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star_rating';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { submitFeedback } from '@/lib/actions/feedback';
import { useRouter } from 'next/navigation';
import type { Complaint, RepairQuality, ResponseSpeed } from '@/lib/types/database';

interface FeedbackFormClientProps {
  complaints: Complaint[];
}

export default function FeedbackFormClient({ complaints }: FeedbackFormClientProps) {
  const router = useRouter();
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [repairQuality, setRepairQuality] = useState<RepairQuality | ''>('');
  const [responseSpeed, setResponseSpeed] = useState<ResponseSpeed | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedComplaintId) {
      toast.error('Please select a complaint');
      return;
    }

    if (rating === 0) {
      toast.error('Please provide a rating');
      return;
    }

    if (!repairQuality) {
      toast.error('Please select repair quality');
      return;
    }

    if (!responseSpeed) {
      toast.error('Please select response speed');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitFeedback({
        complaint_id: parseInt(selectedComplaintId),
        overall_rating: rating,
        comment: comment || undefined,
        repair_quality: repairQuality,
        response_speed: responseSpeed,
      });

      if (result.success) {
        toast.success('Feedback submitted successfully!');
        router.push(`/student/my-complaints/${selectedComplaintId}`);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to submit feedback');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (complaints.length === 0) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="py-2">
          <h1 className="text-3xl font-bold text-gray-900">Feedback Form</h1>
          <p className="text-gray-600 mt-1">Please leave a feedback to improve our service!</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Complaints Need Feedback</h3>
          <p className="text-gray-600">
            You don&apos;t have any resolved complaints that need feedback at the moment.
          </p>
          <a
            href="/student/my-complaints"
            className="inline-block mt-4 text-[#5e2a84] hover:text-[#4a2169] font-medium"
          >
            View My Complaints
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Heading */}
      <div className="py-2">
        <h1 className="text-3xl font-bold text-gray-900">Feedback Form</h1>
        <p className="text-gray-600 mt-1">Please leave a feedback to improve our service!</p>
      </div>

      {/* Feedback Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 space-y-6"
      >
        {/* Complaint Selection */}
        <div className="pb-5">
          <div className="pb-2">
            <h2 className="font-medium text-gray-900">Complaint</h2>
          </div>
          <div className="justify-start w-full">
            <Select onValueChange={(value) => setSelectedComplaintId(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Which Complaint are you referring to?" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Resolved Complaints</SelectLabel>
                  {complaints.map((complaint) => (
                    <SelectItem key={complaint.id} value={complaint.id.toString()}>
                      {complaint.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Rating */}
        <div className="pb-5">
          <div className="pb-2">
            <h2 className="font-medium text-gray-900">Rating</h2>
          </div>
          <div className="justify-start w-full">
            <StarRating value={rating} onChange={setRating} />
          </div>
        </div>

        {/* Comment */}
        <div className="pb-5">
          <div className="pb-2">
            <h2 className="font-medium text-gray-900">Comment</h2>
          </div>
          <div className="justify-start w-full">
            <textarea
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#5e2a84] focus:border-transparent"
            />
          </div>
        </div>

        {/* Repair Quality */}
        <div className="pb-5">
          <div className="pb-2">
            <h2 className="font-medium text-gray-900">Repair Quality</h2>
          </div>
          <div className="justify-start w-full">
            <RadioGroup
              value={repairQuality}
              onValueChange={(value) => setRepairQuality(value as 'good' | 'acceptable' | 'bad')}
              className="flex gap-4"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem
                  value="good"
                  className="border-gray-400 transition-colors duration-200 data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                />
                <p>Good</p>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem
                  value="acceptable"
                  className="border-gray-400 transition-colors duration-200 data-[state=checked]:border-yellow-500 data-[state=checked]:bg-yellow-500"
                />
                <p>Acceptable</p>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <RadioGroupItem
                  value="bad"
                  className="border-gray-400 transition-colors duration-200 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500"
                />
                <p>Bad</p>
              </label>
            </RadioGroup>
          </div>
        </div>

        {/* Response Speed */}
        <div className="pb-5">
          <div className="pb-2">
            <h2 className="font-medium text-gray-900">Response Speed</h2>
          </div>
          <div className="justify-start w-full">
            <RadioGroup
              value={responseSpeed}
              onValueChange={(value) => setResponseSpeed(value as ResponseSpeed)}
            >
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem
                    value="within a few hours"
                    className="border-gray-400 transition-colors duration-200 data-[state=checked]:border-[#5e2a84] data-[state=checked]:bg-[#5e2a84]"
                  />
                  <p>Within a few hours</p>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem
                    value="1-2 days"
                    className="border-gray-400 transition-colors duration-200 data-[state=checked]:border-[#5e2a84] data-[state=checked]:bg-[#5e2a84]"
                  />
                  <p>1-2 days</p>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem
                    value="2-3 days"
                    className="border-gray-400 transition-colors duration-200 data-[state=checked]:border-[#5e2a84] data-[state=checked]:bg-[#5e2a84]"
                  />
                  <p>2-3 days</p>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem
                    value="more than 4 days"
                    className="border-gray-400 transition-colors duration-200 data-[state=checked]:border-[#5e2a84] data-[state=checked]:bg-[#5e2a84]"
                  />
                  <p>More than 4 days</p>
                </label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#5e2a84] hover:bg-[#4a2169]"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </form>
    </div>
  );
}
