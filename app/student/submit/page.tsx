'use client';

import { useState, FormEvent, ChangeEvent } from 'react';

interface ComplaintFormData {
  category: string;
  title: string;
  description: string;
  photo: File | null;
}

export default function SubmitComplaintPage() {
  const [formData, setFormData] = useState<ComplaintFormData>({
    category: '',
    title: '',
    description: '',
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    'Academic',
    'Facilities',
    'Administrative',
    'IT Services',
    'Library',
    'Accommodation',
    'Other',
  ];

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Store in component state (already stored in formData)
    console.log('Form submitted:', formData);
    
    // Show success message
    setShowSuccess(true);
    
    // Reset form
    setFormData({
      category: '',
      title: '',
      description: '',
      photo: null,
    });
    setPhotoPreview(null);

    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  const removePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photo: null,
    }));
    setPhotoPreview(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Submit New Complaint</h1>
        <p className="text-gray-600 mt-2">
          Please provide details about your complaint. We&apos;ll review it as soon as possible.
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
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
          <div>
            <h3 className="font-semibold text-green-900">Complaint Submitted Successfully!</h3>
            <p className="text-green-700 text-sm mt-1">
              Your complaint has been received and will be reviewed by our team.
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {/* Category Field */}
        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e2a84] focus:border-transparent transition-all hover:border-gray-400"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Title Field */}
        <div className="mb-6">
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
            placeholder="Brief summary of your complaint"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e2a84] focus:border-transparent transition-all hover:border-gray-400"
          />
        </div>

        {/* Description Field */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={6}
            placeholder="Please provide detailed information about your complaint..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e2a84] focus:border-transparent transition-all hover:border-gray-400 resize-none"
          />
        </div>

        {/* Photo Upload Field */}
        <div className="mb-8">
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
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
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
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-[#5e2a84] text-white font-medium rounded-lg hover:bg-[#4a2169] focus:outline-none focus:ring-2 focus:ring-[#5e2a84] focus:ring-offset-2 transition-all shadow-sm hover:shadow-md"
          >
            Submit Complaint
          </button>
        </div>
      </form>
    </div>
  );
}

