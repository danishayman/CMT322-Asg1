'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createComplaint, uploadComplaintPhoto } from '@/lib/actions/complaints';
import { ComplaintCategory, ComplaintPriority } from '@/lib/types/database';

interface ComplaintFormData {
  category: string;
  title: string;
  description: string;
  priority: ComplaintPriority;
  photo: File | null;
}

export default function SubmitComplaintPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ComplaintFormData>({
    category: '',
    title: '',
    description: '',
    priority: 'Medium',
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories: ComplaintCategory[] = [
    'Room Maintenance',
    'Plumbing',
    'Electrical',
    'Cleanliness',
    'Common Areas',
    'Security',
    'Noise Complaint',
    'Network',
    'Furniture',
    'Facilities',
    'Discipline',
    'Other',
  ];

  const priorities: ComplaintPriority[] = ['Low', 'Medium', 'High'];

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      photo: file,
    }));

    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let photoUrl: string | null = null;

      // Upload photo if provided
      if (formData.photo) {
        const uploadResult = await uploadComplaintPhoto(formData.photo);
        if (!uploadResult.success) {
          toast.error(uploadResult.error || 'Failed to upload photo');
          setIsSubmitting(false);
          return;
        }
        photoUrl = uploadResult.url || null;
      }

      // Create complaint
      const result = await createComplaint({
        title: formData.title,
        description: formData.description,
        category: formData.category as ComplaintCategory,
        priority: formData.priority,
        photo_url: photoUrl,
      });

      if (result.success) {
        toast.success('Complaint submitted successfully!');
        setShowSuccess(true);
        
        // Reset form
        setFormData({
          category: '',
          title: '',
          description: '',
          priority: 'Medium',
          photo: null,
        });
        setPhotoPreview(null);

        // Redirect to complaints list after 2 seconds
        setTimeout(() => {
          router.push('/student/my-complaints');
        }, 2000);
      } else {
        toast.error(result.error || 'Failed to submit complaint');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photo: null,
    }));
    setPhotoPreview(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Submit New Complaint</h1>
        <p className="text-gray-600 mt-2">
          Please provide details about your complaint. We&apos;ll review it as soon as possible.
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 transition-all duration-300">
          <svg
            className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <h3 className="font-semibold text-green-900">Complaint Submitted Successfully!</h3>
            <p className="text-green-700 text-sm mt-1">
              Your complaint has been received and will be reviewed by our team.
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 space-y-6">
        {/* Category Field */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#5e2a84] focus:border-transparent transition-all duration-200 hover:border-gray-400 cursor-pointer disabled:opacity-50"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Field */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#5e2a84] focus:border-transparent transition-all duration-200 hover:border-gray-400 cursor-pointer disabled:opacity-50"
          >
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Select High for urgent issues that need immediate attention
          </p>
        </div>

        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            placeholder="Brief summary of your complaint"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e2a84] focus:border-transparent transition-all duration-200 hover:border-gray-400 disabled:opacity-50"
          />
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            rows={6}
            placeholder="Please provide detailed information about your complaint..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e2a84] focus:border-transparent transition-all duration-200 hover:border-gray-400 resize-none disabled:opacity-50"
          />
        </div>

        {/* Photo Upload Field */}
        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
            Photo Upload (Optional)
          </label>
          <div className="space-y-3">
            {photoPreview ? (
              <div className="relative inline-block">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md"
                  aria-label="Remove photo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="photo"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-purple-50 hover:border-[#5e2a84] transition-all duration-200"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-10 h-10 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              setFormData({
                category: '',
                title: '',
                description: '',
                priority: 'Medium',
                photo: null,
              });
              setPhotoPreview(null);
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-[#5e2a84] text-white font-medium rounded-lg hover:bg-[#4a2169] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#5e2a84] focus:ring-offset-2 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>
      </form>
    </div>
  );
}

