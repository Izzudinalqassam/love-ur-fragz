import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Sparkles, Users, MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import NotesDisplay from '@/components/perfume/NotesDisplay';
import PerfumeCharacteristics from '@/components/perfume/PerfumeCharacteristics';
import AromaTags from '@/components/perfume/AromaTags';
import LikeDislikeButton from '@/components/community/LikeDislikeButton';
import useCommunityStore from '@/stores/communityStore';
import type { Perfume } from '@/types';
import type { PerfumeReviewStats } from '@/types/community';

interface EnhancedPerfumeCardProps {
  perfume: Perfume;
  reviewStats?: PerfumeReviewStats;
  onReviewSubmit?: (data: { perfumeId: number; userName: string; rating: 'like' | 'dislike'; comment?: string }) => void;
  variant?: 'default' | 'compact' | 'detailed';
}

const EnhancedPerfumeCard: React.FC<EnhancedPerfumeCardProps> = ({
  perfume,
  reviewStats,
  onReviewSubmit,
  variant = 'default'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Use zustand store
  const { getReviewStats, updateReviewStats } = useCommunityStore();

  // Handle favorite toggle
  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  // Get stats from store only, don't use random fallback
  const stats = getReviewStats(perfume.id) || {
    perfume_id: perfume.id,
    total_likes: 0,
    total_dislikes: 0,
    total_comments: 0,
    average_rating: 0
  };

  // Initialize stats in store with provided data only if store is empty
  useEffect(() => {
    const existingStats = getReviewStats(perfume.id);
    if (!existingStats && reviewStats) {
      updateReviewStats(perfume.id, reviewStats);
    }
  }, [perfume.id, reviewStats, getReviewStats, updateReviewStats]);

  // Calculate rating percentage
  const ratingPercentage = (stats.total_likes / (stats.total_likes + stats.total_dislikes)) * 100;

  if (variant === 'compact') {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Image */}
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{perfume.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{perfume.brand}</p>
                </div>
                <button
                  onClick={handleFavoriteClick}
                  className="ml-2 p-1 rounded-full hover:bg-red-50 transition-colors"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" size="sm" className="uppercase">
                  {perfume.concentration || perfume.type}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <ThumbsUp className="h-3 w-3 text-green-600" />
                  <span>{stats.total_likes}</span>
                  <ThumbsDown className="h-3 w-3 text-red-600" />
                  <span>{stats.total_dislikes}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 hover:border-purple-200 ${
        variant === 'detailed' ? 'h-full' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative h-64 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <p className="text-gray-700 font-medium text-sm">{perfume.brand}</p>
          </div>
        </div>

        {/* Community Stats Overlay */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md">
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3 text-green-600" />
              <span className="font-semibold text-green-600">{stats.total_likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsDown className="h-3 w-3 text-red-600" />
              <span className="font-semibold text-red-600">{stats.total_dislikes}</span>
            </div>
            {stats.total_comments > 0 && (
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3 text-blue-600" />
                <span className="font-semibold text-blue-600">{stats.total_comments}</span>
              </div>
            )}
          </div>
        </div>

        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent flex items-end justify-center pb-4 transition-all duration-300">
            <Link to={`/catalog/${perfume.id}`}>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 shadow-md">
                View Details
              </Button>
            </Link>
          </div>
        )}

        {/* Simple Favorite Button for Community */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          />
        </button>
      </div>

      {/* Content Section */}
      <CardContent className="p-5">
        {/* Title and Brand */}
        <div className="mb-3">
          <Link to={`/catalog/${perfume.id}`}>
            <h3 className="text-lg font-bold text-gray-900 hover:text-purple-600 transition-colors mb-1 line-clamp-1">
              {perfume.name}
            </h3>
          </Link>
          <p className="text-sm font-medium text-gray-700 uppercase tracking-wide">
            {perfume.brand}
          </p>
        </div>

        {/* Description */}
        {variant === 'detailed' && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {perfume.description}
          </p>
        )}

        {/* Key Characteristics */}
        <div className="mb-3">
          <PerfumeCharacteristics
            perfume={perfume}
            variant="compact"
            showLabels={true}
          />
        </div>

        {/* Top Notes */}
        {perfume.notes && perfume.notes.length > 0 && (
          <div className="mb-3">
            <NotesDisplay
              notes={perfume.notes}
              variant="minimal"
              showTitle={true}
            />
          </div>
        )}

        {/* Aroma Tags */}
        {perfume.aroma_tags && perfume.aroma_tags.length > 0 && (
          <div className="mb-3">
            <h4 className="text-xs font-semibold text-gray-700 mb-1">Profile:</h4>
            <AromaTags
              aromaTags={perfume.aroma_tags}
              maxVisible={3}
              variant="compact"
            />
          </div>
        )}

        {/* Community Rating */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Users className="h-4 w-4" />
              Community Rating
            </span>
            <span className="text-sm font-bold text-gray-900">
              {stats.average_rating.toFixed(1)}/5.0
            </span>
          </div>

          {/* Rating Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${ratingPercentage}%` }}
            />
          </div>

          {/* Like/Dislike Buttons */}
          <LikeDislikeButton
            perfumeId={perfume.id}
            initialStats={stats}
            onReviewSubmit={onReviewSubmit}
            variant="compact"
            className="mt-2"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" size="sm" className="capitalize">
            {perfume.concentration || perfume.type}
          </Badge>
          <Badge variant="outline" size="sm" className="capitalize">
            {perfume.category}
          </Badge>
          <Badge variant="outline" size="sm" className="capitalize">
            {perfume.target_audience}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPerfumeCard;