import React, { useState } from 'react';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Heart,
  MessageCircle,
  Flag,
  ChevronDown,
  ChevronUp,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import type {
  EnhancedPerfumeReview,
  ReviewCardProps,
  Rating,
  LongevityRating,
  SillageRating,
  Occasion,
  Season
} from '@/types/community';

const EnhancedReviewCard: React.FC<ReviewCardProps> = ({
  review,
  showPerfumeInfo = false,
  showActions = true,
  variant = 'default',
  onHelpful,
  onReport
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasMarkedHelpful, setHasMarkedHelpful] = useState(false);
  const [hasReported, setHasReported] = useState(false);

  // Helper functions for displaying ratings
  const renderStars = (rating: Rating, size: 'small' | 'normal' = 'normal') => {
    const sizeClasses = {
      small: 'w-3 h-3',
      normal: 'w-4 h-4'
    };

    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getLongevityLabel = (longevity: LongevityRating): string => {
    const labels = {
      'very-poor': 'Very Poor (< 1h)',
      'poor': 'Poor (1-3h)',
      'average': 'Average (3-6h)',
      'good': 'Good (6-8h)',
      'excellent': 'Excellent (8h+)'
    };
    return labels[longevity];
  };

  const getSillageLabel = (sillage: SillageRating): string => {
    const labels = {
      'very-light': 'Very Light',
      'light': 'Light',
      'moderate': 'Moderate',
      'heavy': 'Heavy',
      'very-heavy': 'Very Heavy'
    };
    return labels[sillage];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleHelpful = () => {
    if (onHelpful && !hasMarkedHelpful) {
      onHelpful(review.id);
      setHasMarkedHelpful(true);
    }
  };

  const handleReport = () => {
    if (onReport && !hasReported) {
      onReport(review.id);
      setHasReported(true);
    }
  };

  const shouldTruncate = variant === 'compact' || (variant === 'default' && !isExpanded);
  const isLongComment = review.comment.length > 300;

  // Compact variant for list views
  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">{review.user_name}</span>
                {review.is_verified_purchase && (
                  <Badge variant="outline" size="sm" className="text-green-600 border-green-600">
                    <Check className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                {renderStars(review.overall_rating, 'small')}
                <span className="text-sm text-gray-600">
                  {review.overall_rating}/5
                </span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1 line-clamp-1">
                {review.title}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                {review.comment}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{formatDate(review.created_at)}</span>
            {review.occasions.length > 0 && (
              <span>• {review.occasions[0]}</span>
            )}
            {review.would_repurchase && (
              <span className="text-green-600">• Would buy again</span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default/Detailed variant
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold text-sm">
                  {review.user_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{review.user_name}</span>
                  {review.is_verified_purchase && (
                    <Badge variant="outline" size="sm" className="text-green-600 border-green-600">
                      <Check className="w-3 h-3 mr-1" />
                      Verified Purchase
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{formatDate(review.created_at)}</span>
                  <span>•</span>
                  <span>Review #{review.id}</span>
                </div>
              </div>
            </div>

            {/* Rating Overview */}
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                {review.title}
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {renderStars(review.overall_rating)}
                  <span className="font-medium text-gray-900">
                    {review.overall_rating}/5
                  </span>
                </div>
                {review.would_repurchase && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <Heart className="w-3 h-3 mr-1" />
                    Would Repurchase
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleHelpful}
                disabled={hasMarkedHelpful}
                className={`${
                  hasMarkedHelpful
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                Helpful ({review.helpful_count})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReport}
                disabled={hasReported}
                className={`${
                  hasReported
                    ? 'text-red-600 bg-red-50'
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <Flag className="w-4 h-4 mr-1" />
                {hasReported ? 'Reported' : 'Report'}
              </Button>
            </div>
          )}
        </div>

        {/* Detailed Ratings */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Overall</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {review.overall_rating}/5
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Longevity</span>
            </div>
            <div className="text-xs font-medium text-gray-900">
              {getLongevityLabel(review.longevity_rating)}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Sillage</span>
            </div>
            <div className="text-xs font-medium text-gray-900">
              {getSillageLabel(review.sillage_rating)}
            </div>
          </div>
        </div>

        {/* Value Rating */}
        <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
          <DollarSign className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">Value for Money:</span>
          <div className="flex-1 flex items-center">
            {renderStars(review.value_rating, 'small')}
            <span className="ml-2 text-sm text-blue-700 font-medium">
              {review.value_rating}/5
            </span>
          </div>
        </div>

        {/* Review Content */}
        <div className="mb-4">
          <p className={`text-gray-700 leading-relaxed ${
            shouldTruncate && isLongComment ? 'line-clamp-3' : ''
          }`}>
            {review.comment}
          </p>
          {isLongComment && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium mt-2 flex items-center gap-1"
            >
              {isExpanded ? (
                <>
                  Show less <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Read more <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Pros and Cons */}
        {((review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {review.pros && review.pros.length > 0 && (
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Pros</span>
                </div>
                <ul className="space-y-1">
                  {review.pros.map((pro, index) => (
                    <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {review.cons && review.cons.length > 0 && (
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                  <ThumbsDown className="w-4 h-4" />
                  <span>Cons</span>
                </div>
                <ul className="space-y-1">
                  {review.cons.map((con, index) => (
                    <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Usage Context */}
        <div className="space-y-3">
          {review.occasions && review.occasions.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700 mr-2">Best for:</span>
              <div className="flex flex-wrap gap-1">
                {review.occasions.map((occasion, index) => (
                  <Badge key={index} variant="outline" size="sm">
                    {occasion}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {review.seasons && review.seasons.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700 mr-2">Seasons:</span>
              <div className="flex flex-wrap gap-1">
                {review.seasons.map((season, index) => (
                  <Badge key={index} variant="outline" size="sm">
                    {season}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between pt-4 border-t mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>{review.helpful_count} found this helpful</span>
            {review.user_email && <span>• Verified email</span>}
          </div>
          {review.updated_at !== review.created_at && (
            <span>Updated {formatDate(review.updated_at)}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedReviewCard;