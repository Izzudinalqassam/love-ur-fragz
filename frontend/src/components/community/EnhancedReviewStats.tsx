import React from 'react';
import {
  Star,
  Users,
  MessageCircle,
  ThumbsUp,
  Clock,
  MapPin,
  DollarSign,
  Heart,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import type {
  EnhancedPerfumeReviewStats,
  Occasion,
  Season,
  LongevityRating,
  SillageRating
} from '@/types/community';

interface EnhancedReviewStatsProps {
  stats: EnhancedPerfumeReviewStats;
  showDetailed?: boolean;
  className?: string;
}

const EnhancedReviewStats: React.FC<EnhancedReviewStatsProps> = ({
  stats,
  showDetailed = true,
  className = ''
}) => {
  // Helper functions
  const getPercentage = (value: number, total: number): number => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  const getLongevityPercentage = (rating: string): number => {
    const longevityMap: Record<string, number> = {
      'very-poor': 1,
      'poor': 2,
      'average': 3,
      'good': 4,
      'excellent': 5
    };
    return getPercentage(longevityMap[rating] || 0, 5);
  };

  const getSillagePercentage = (rating: string): number => {
    const sillageMap: Record<string, number> = {
      'very-light': 1,
      'light': 2,
      'moderate': 3,
      'heavy': 4,
      'very-heavy': 5
    };
    return getPercentage(sillageMap[rating] || 0, 5);
  };

  const renderRatingBars = () => {
    const total = stats.total_reviews;
    const maxCount = Math.max(...Object.values(stats.rating_distribution));

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.rating_distribution[rating as keyof typeof stats.rating_distribution];
          const percentage = getPercentage(count, total);
          const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
              </div>
              <div className="flex-1 relative">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
              <div className="w-16 text-right">
                <span className="text-sm text-gray-600">{count}</span>
              </div>
              <div className="w-12 text-right">
                <span className="text-xs text-gray-500">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderAverageRating = () => {
    const fullStars = Math.floor(stats.average_rating);
    const hasHalfStar = stats.average_rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-5 h-5 text-gray-300 fill-current" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" />
        ))}
        <span className="ml-2 text-lg font-bold text-gray-900">
          {stats.average_rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Rating Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Community Rating</h3>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              <Users className="w-3 h-3 mr-1" />
              {stats.total_reviews} Reviews
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rating Display */}
            <div className="text-center">
              {renderAverageRating()}
              <p className="text-gray-600 mt-2">
                Based on {stats.total_reviews} {stats.total_reviews === 1 ? 'review' : 'reviews'}
              </p>
              {showDetailed && (
                <div className="mt-4 text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>{stats.repurchase_rate}% would repurchase</span>
                  </div>
                </div>
              )}
            </div>

            {/* Rating Distribution */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Rating Distribution</h4>
              {renderRatingBars()}
            </div>
          </div>
        </CardContent>
      </Card>

      {showDetailed && (
        <>
          {/* Advanced Performance Metrics */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <BarChart3 className="inline w-5 h-5 mr-2" />
                Performance Metrics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Longevity */}
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Longevity</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mb-1">
                    {stats.average_longevity.toFixed(1)}/5
                  </div>
                  <Progress value={stats.average_longevity * 20} className="mb-2" />
                  <p className="text-xs text-blue-700">
                    {stats.average_longevity >= 4 ? 'Long-lasting' :
                     stats.average_longevity >= 3 ? 'Average duration' :
                     'Short duration'}
                  </p>
                </div>

                {/* Sillage */}
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">Sillage</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900 mb-1">
                    {stats.average_sillage.toFixed(1)}/5
                  </div>
                  <Progress value={stats.average_sillage * 20} className="mb-2" />
                  <p className="text-xs text-green-700">
                    {stats.average_sillage >= 4 ? 'Strong projection' :
                     stats.average_sillage >= 3 ? 'Moderate projection' :
                     'Light projection'}
                  </p>
                </div>

                {/* Value */}
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-purple-600 mb-2">
                    <DollarSign className="w-5 h-5" />
                    <span className="font-medium">Value</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-900 mb-1">
                    {stats.average_value.toFixed(1)}/5
                  </div>
                  <Progress value={stats.average_value * 20} className="mb-2" />
                  <p className="text-xs text-purple-700">
                    {stats.average_value >= 4 ? 'Great value' :
                     stats.average_value >= 3 ? 'Fair value' :
                     'Poor value'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Context */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <TrendingUp className="inline w-5 h-5 mr-2" />
                Popular Usage Context
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Popular Occasions */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Best Occasions</h4>
                  <div className="space-y-2">
                    {stats.popular_occasions.slice(0, 5).map((occasion, index) => (
                      <div key={occasion.occasion} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 capitalize">
                          {occasion.occasion.replace('-', ' ')}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{
                                width: `${getPercentage(occasion.count, stats.total_reviews)}%`
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-12 text-right">
                            {occasion.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Seasons */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Best Seasons</h4>
                  <div className="space-y-2">
                    {stats.popular_seasons.slice(0, 5).map((season, index) => (
                      <div key={season.season} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 capitalize">
                          {season.season}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{
                                width: `${getPercentage(season.count, stats.total_reviews)}%`
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-12 text-right">
                            {season.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Stats */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <MessageCircle className="inline w-5 h-5 mr-2" />
                Community Engagement
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stats.total_helpful_votes}
                  </div>
                  <p className="text-sm text-gray-600">Helpful Votes</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stats.verified_purchase_rate}%
                  </div>
                  <p className="text-sm text-gray-600">Verified Purchases</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stats.repurchase_rate}%
                  </div>
                  <p className="text-sm text-gray-600">Would Repurchase</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stats.total_reviews}
                  </div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

// Helper function for object values
function maxObjectValues(obj: Record<string, number>): number {
  return Math.max(...Object.values(obj));
}

export default EnhancedReviewStats;