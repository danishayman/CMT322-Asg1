"use client";

import { useEffect, useState } from "react";

type Review = {
    id: number;
    overall_rating: number;
    comment: string | null;
    repair_quality: string | null;
    response_speed: string | null;
    sentiment: string;
    created_at: string;
    complaints: {
        id: number;
        complaint_id: string;
        title: string;
        category: string;
    };
    users: {
        id: string;
        full_name: string;
        email: string;
    };
};

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterSentiment, setFilterSentiment] = useState<string>("all");

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/reviews");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch reviews");
            }

            setReviews(data.reviews || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const filteredReviews = reviews.filter((review) => {
        if (filterSentiment === "all") return true;
        return review.sentiment === filterSentiment;
    });

    const getStars = (rating: number) => {
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    };

    const getSentimentBadge = (sentiment: string) => {
        const styles: Record<string, string> = {
            positive: "bg-green-100 text-green-800",
            neutral: "bg-yellow-100 text-yellow-800",
            negative: "bg-red-100 text-red-800",
        };
        return styles[sentiment] || "bg-gray-100 text-gray-800";
    };

    const getRepairQualityBadge = (quality: string | null) => {
        if (!quality) return null;
        const styles: Record<string, string> = {
            good: "bg-green-100 text-green-800",
            acceptable: "bg-yellow-100 text-yellow-800",
            bad: "bg-red-100 text-red-800",
        };
        return styles[quality] || "bg-gray-100 text-gray-800";
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-MY", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Calculate stats
    const stats = {
        total: reviews.length,
        positive: reviews.filter((r) => r.sentiment === "positive").length,
        neutral: reviews.filter((r) => r.sentiment === "neutral").length,
        negative: reviews.filter((r) => r.sentiment === "negative").length,
        avgRating:
            reviews.length > 0
                ? (
                    reviews.reduce((sum, r) => sum + r.overall_rating, 0) /
                    reviews.length
                ).toFixed(1)
                : "0",
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5e2a84]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg bg-red-50 p-6 text-center">
                <p className="text-red-600">Error: {error}</p>
                <button
                    onClick={fetchReviews}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Reviews</h1>
                <p className="text-gray-600 mt-1">
                    View all feedback submitted by students for resolved complaints
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                    <p className="text-sm text-gray-500">Total Reviews</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                    <p className="text-sm text-gray-500">Avg. Rating</p>
                    <p className="text-2xl font-bold text-[#5e2a84]">
                        {stats.avgRating} <span className="text-yellow-500">★</span>
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                    <p className="text-sm text-gray-500">Positive</p>
                    <p className="text-2xl font-bold text-green-600">{stats.positive}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                    <p className="text-sm text-gray-500">Neutral</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.neutral}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                    <p className="text-sm text-gray-500">Negative</p>
                    <p className="text-2xl font-bold text-red-600">{stats.negative}</p>
                </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                    Filter by Sentiment:
                </label>
                <select
                    value={filterSentiment}
                    onChange={(e) => setFilterSentiment(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5e2a84] focus:border-transparent"
                >
                    <option value="all">All Reviews</option>
                    <option value="positive">Positive</option>
                    <option value="neutral">Neutral</option>
                    <option value="negative">Negative</option>
                </select>
            </div>

            {/* Reviews List */}
            {filteredReviews.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                    <p className="mt-4 text-gray-600">No reviews found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredReviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                {/* Left side - Review content */}
                                <div className="flex-1 space-y-3">
                                    {/* Student info */}
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-[#5e2a84] flex items-center justify-center text-white font-medium">
                                            {review.users?.full_name?.charAt(0) || "U"}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {review.users?.full_name || "Unknown User"}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {review.users?.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl text-yellow-500">
                                            {getStars(review.overall_rating)}
                                        </span>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentBadge(review.sentiment)}`}
                                        >
                                            {review.sentiment}
                                        </span>
                                    </div>

                                    {/* Comment */}
                                    {review.comment && (
                                        <p className="text-gray-700 italic">
                                            &ldquo;{review.comment}&rdquo;
                                        </p>
                                    )}

                                    {/* Additional info */}
                                    <div className="flex flex-wrap gap-2">
                                        {review.repair_quality && (
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getRepairQualityBadge(review.repair_quality)}`}
                                            >
                                                Repair: {review.repair_quality}
                                            </span>
                                        )}
                                        {review.response_speed && (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Response: {review.response_speed}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Right side - Complaint info */}
                                <div className="md:text-right space-y-2">
                                    <div className="inline-block bg-purple-50 text-[#5e2a84] px-3 py-1 rounded-lg text-sm font-medium">
                                        {review.complaints?.complaint_id}
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        {review.complaints?.title}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Category: {review.complaints?.category}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {formatDate(review.created_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
