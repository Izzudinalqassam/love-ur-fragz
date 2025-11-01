import React, { useState, useEffect } from 'react';
import { MessageSquare, Filter, SortAsc, Star, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import EnhancedReviewForm from './EnhancedReviewForm';
import EnhancedReviewCard from './EnhancedReviewCard';
import EnhancedReviewStats from './EnhancedReviewStats';
import type {
  EnhancedPerfumeReview,
  EnhancedPerfumeReviewStats,
  ReviewFilters,
  ReviewSortOption,
  CreateEnhancedReviewRequest,
  ReviewValidationResult
} from '@/types/community';
import useCommunityStore from '@/stores/communityStore';

interface EnhancedReviewSectionProps {
  perfumeId: number;
  perfumeName: string;
  perfumeBrand: string;
  showForm?: boolean;
  showStats?: boolean;
  className?: string;
}

const EnhancedReviewSection: React.FC<EnhancedReviewSectionProps> = ({
  perfumeId,
  perfumeName,
  perfumeBrand,
  showForm = true,
  showStats = true,
  className = ''
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<EnhancedPerfumeReview | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [validationErrors, setValidationErrors] = useState<ReviewValidationResult | null>(null);

  // Store hooks
  const {
    getEnhancedReviews,
    getEnhancedReviewStats,
    addEnhancedReview,
    updateReview,
    markHelpful,
    reportReview,
    updateFilters,
    updateSort,
    getFilteredReviews,
    isReviewHelpful
  } = useCommunityStore();

  // Local state
  const [filters, setFilters] = useState<ReviewFilters>({
    rating: 'all',
    longevity: 'all',
    sillage: 'all',
    occasion: 'all',
    season: 'all',
    would_repurchase: 'all',
    verified_purchase: 'all',
    has_pros_cons: false,
    time_period: 'all'
  });

  const [sortBy, setSortBy] = useState<ReviewSortOption>('most-recent');

  // Data
  const allReviews = getEnhancedReviews(perfumeId);
  const filteredReviews = getFilteredReviews(perfumeId);
  const stats = getEnhancedReviewStats(perfumeId);

  // Apply search filter
  const displayedReviews = searchTerm
    ? filteredReviews.filter(review =>
        review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.user_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredReviews;

  // Handle form submission
  const handleSubmitReview = async (data: CreateEnhancedReviewRequest) => {
    try {
      // Create mock enhanced review (in real app, this would call API)
      const newReview: EnhancedPerfumeReview = {
        id: Date.now(),
        perfume_id: perfumeId,
        user_name: data.user_name,
        user_email: data.user_email,
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
        would_repurchase: data.would_repurchase,
        is_verified_purchase: false, // In real app, this would be verified
        helpful_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingReview) {
        // Update existing review
        updateReview(editingReview.id, newReview);
        setEditingReview(null);
      } else {
        // Add new review
        addEnhancedReview(newReview);
      }

      // Close form
      setIsFormOpen(false);
      setValidationErrors(null);

      // Clear filters to show new review
      setSearchTerm('');
      setFilters({
        rating: 'all',
        longevity: 'all',
        sillage: 'all',
        occasion: 'all',
        season: 'all',
        would_repurchase: 'all',
        verified_purchase: 'all',
        has_pros_cons: false,
        time_period: 'all'
      });

    } catch (error) {
      console.error('Error submitting review:', error);
      setValidationErrors({
        is_valid: false,
        errors: [{ field: 'general', message: 'Failed to submit review', code: 'SUBMISSION_ERROR' }],
        warnings: []
      });
    }
  };

  // Handle helpful vote
  const handleHelpful = (reviewId: number) => {
    markHelpful(reviewId, 'current-user'); // In real app, use actual user ID
  };

  // Handle report
  const handleReport = (reviewId: number) => {
    reportReview(reviewId);
    // In real app, this would show a confirmation modal
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof ReviewFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateFilters(perfumeId, newFilters);
  };

  // Handle sort change
  const handleSortChange = (sort: ReviewSortOption) => {
    setSortBy(sort);
    updateSort(perfumeId, sort);
  };

  // Filter options
  const ratingOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: 5, label: '5 Stars' },
    { value: 4, label: '4 Stars' },
    { value: 3, label: '3 Stars' },
    { value: 2, label: '2 Stars' },
    { value: 1, label: '1 Star' }
  ];

  const longevityOptions = [
    { value: 'all', label: 'All Longevity' },
    { value: 'very-poor', label: 'Very Poor' },
    { value: 'poor', label: 'Poor' },
    { value: 'average', label: 'Average' },
    { value: 'good', label: 'Good' },
    { value: 'excellent', label: 'Excellent' }
  ];

  const sillageOptions = [
    { value: 'all', label: 'All Sillage' },
    { value: 'very-light', label: 'Very Light' },
    { value: 'light', label: 'Light' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'heavy', label: 'Heavy' },
    { value: 'very-heavy', label: 'Very Heavy' }
  ];

  const sortOptions: { value: ReviewSortOption; label: string }[] = [
    { value: 'most-recent', label: 'Most Recent' },
    { value: 'most-helpful', label: 'Most Helpful' },
    { value: 'highest-rating', label: 'Highest Rating' },
    { value: 'lowest-rating', label: 'Lowest Rating' },
    { value: 'most-pros-cons', label: 'Most Detailed' },
    { value: 'verified-purchases', label: 'Verified Purchases' }
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
            {displayedReviews.length} {displayedReviews.length === 1 ? 'review' : 'reviews'} for {perfumeBrand} {perfumeName}
          </p>
        </div>

        {showForm && (
          <Button
            onClick={() => {
              setEditingReview(null);
              setIsFormOpen(!isFormOpen);
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <EnhancedReviewForm
              perfumeId={perfumeId}
              initialData={editingReview || undefined}
              onSubmit={handleSubmitReview}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingReview(null);
                setValidationErrors(null);
              }}
              validationErrors={validationErrors}
            />
          </div>
        </div>
      )}

      {/* Stats Overview */}
      {showStats && stats && (
        <EnhancedReviewStats
          stats={stats}
          showDetailed={true}
        />
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
                >
                  {ratingOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={filters.longevity}
                onChange={(e) => handleFilterChange('longevity', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
              >
                {longevityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={filters.sillage}
                onChange={(e) => handleFilterChange('sillage', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
              >
                {sillageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Would Repurchase Filter */}
              <select
                value={filters.would_repurchase}
                onChange={(e) => handleFilterChange('would_repurchase', e.target.value === 'all' ? 'all' : e.target.value === 'true')}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Reviews</option>
                <option value="true">Would Buy Again</option>
                <option value="false">Wouldn't Buy Again</option>
              </select>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as ReviewSortOption)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.rating !== 'all' ||
            filters.longevity !== 'all' ||
            filters.sillage !== 'all' ||
            filters.would_repurchase !== 'all') && (
            <div className="flex flex-wrap gap-2 mt-4">
              {filters.rating !== 'all' && (
                <Badge variant="outline" className="text-purple-600 border-purple-600">
                  {filters.rating} Stars
                  <button
                    onClick={() => handleFilterChange('rating', 'all')}
                    className="ml-1 text-purple-400 hover:text-purple-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.longevity !== 'all' && (
                <Badge variant="outline" className="text-purple-600 border-purple-600">
                  {filters.longevity} Longevity
                  <button
                    onClick={() => handleFilterChange('longevity', 'all')}
                    className="ml-1 text-purple-400 hover:text-purple-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.sillage !== 'all' && (
                <Badge variant="outline" className="text-purple-600 border-purple-600">
                  {filters.sillage} Sillage
                  <button
                    onClick={() => handleFilterChange('sillage', 'all')}
                    className="ml-1 text-purple-400 hover:text-purple-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.would_repurchase !== 'all' && (
                <Badge variant="outline" className="text-purple-600 border-purple-600">
                  {filters.would_repurchase ? 'Would Buy Again' : "Wouldn't Buy Again"}
                  <button
                    onClick={() => handleFilterChange('would_repurchase', 'all')}
                    className="ml-1 text-purple-400 hover:text-purple-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {displayedReviews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No reviews yet
              </h3>
              <p className="text-gray-600 mb-6">
                Be the first to share your experience with {perfumeName}!
              </p>
              {showForm && (
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
          displayedReviews.map((review, index) => (
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
      {displayedReviews.length < allReviews.length && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => {
              // In a real app, this would load more reviews
              console.log('Load more reviews');
            }}
          >
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnhancedReviewSection;