import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Star, Filter, SortAsc, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import SimpleReviewForm from './SimpleReviewForm';
import EnhancedReviewCard from './EnhancedReviewCard';
import EnhancedReviewStats from './EnhancedReviewStats';
import useCommunityStore from '@/stores/communityStore';
import type {
  EnhancedPerfumeReview,
  EnhancedPerfumeReviewStats
} from '@/types/community';

interface SimpleReviewSectionProps {
  perfumeId: number;
  perfumeName: string;
  perfumeBrand: string;
  showForm?: boolean;
  showStats?: boolean;
  className?: string;
}

const SimpleReviewSection: React.FC<SimpleReviewSectionProps> = ({
  perfumeId,
  perfumeName,
  perfumeBrand,
  showForm = true,
  showStats = true,
  className = ''
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('most-recent');

  // Store hooks
  const {
    getEnhancedReviews,
    getEnhancedReviewStats,
    addEnhancedReview,
    markHelpful,
    reportReview,
    getFilteredReviews
  } = useCommunityStore();

  // Data
  const reviews = getEnhancedReviews(perfumeId);
  const stats = getEnhancedReviewStats(perfumeId);

  // Apply filters
  const filteredReviews = reviews.filter(review =>
    searchTerm ? (
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : true
  ).sort((a, b) => {
    switch (sortBy) {
      case 'most-helpful':
        return b.helpful_count - a.helpful_count;
      case 'highest-rating':
        return b.overall_rating - a.overall_rating;
      case 'lowest-rating':
        return a.overall_rating - b.overall_rating;
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Handle form submission
  const handleSubmitReview = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Create review object matching backend expectations
      const reviewData = {
        perfume_id: data.perfume_id,
        user_name: data.user_name,
        overall_rating: data.overall_rating,
        longevity_rating: data.longevity_rating,
        sillage_rating: data.sillage_rating,
        value_rating: data.value_rating,
        title: data.title,
        comment: data.comment,
        pros: data.pros,
        cons: data.cons,
        occasions: data.occasions,
        seasons: data.seasons,
        would_repurchase: data.would_repurchase
      };

      // Add to store (in real app, this would call API)
      addEnhancedReview(reviewData);

      // Close form
      setIsFormOpen(false);
      setSearchTerm('');
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle helpful vote
  const handleHelpful = (reviewId: number) => {
    // Use IP address as user identifier since no auth
    const userIdentifier = 'current-user';
    markHelpful(reviewId, userIdentifier);
  };

  // Handle report
  const handleReport = (reviewId: number) => {
    const userIdentifier = 'current-user';
    reportReview(reviewId);
  };

  const sortOptions = [
    { value: 'most-recent', label: 'Most Recent' },
    { value: 'most-helpful', label: 'Most Helpful' },
    { value: 'highest-rating', label: 'Highest Rating' },
    { value: 'lowest-rating', label: 'Lowest Rating' }
  ];

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Customer Reviews
          </h2>
          <p className="text-gray-600">
            {filteredReviews.length} {filteredReviews.length === 1 ? 'review' : 'reviews'} for {perfumeBrand} {perfumeName}
          </p>
        </div>

        {showForm && (
          <Button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Write a Review
          </Button>
        )}
      </div>

      {/* Simple Review Form Modal */}
      {isFormOpen && (
        <SimpleReviewForm
          perfumeId={perfumeId}
          perfumeName={perfumeName}
          onSubmit={handleSubmitReview}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Stats Overview */}
      {showStats && stats && (
        <EnhancedReviewStats
          stats={stats}
          showDetailed={true}
        />
      )}

      {/* Search and Sort */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No reviews found' : 'No reviews yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : `Be the first to share your experience with ${perfumeName}!`
                }
              </p>
              {showForm && !searchTerm && (
                <Button
                  onClick={() => setIsFormOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Write the First Review
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review, index) => (
            <EnhancedReviewCard
              key={review.id}
              review={review}
              showPerfumeInfo={false}
              showActions={true}
              variant="default"
              onHelpful={handleHelpful}
              onReport={handleReport}
            />
          ))
        )}
      </div>

      {/* Load More */}
      {filteredReviews.length < reviews.length && (
        <div className="text-center">
          <Button variant="outline">
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
};

export default SimpleReviewSection;