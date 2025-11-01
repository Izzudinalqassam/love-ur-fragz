import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import useCommunityStore from '@/stores/communityStore';
import type { PerfumeReviewStats } from '@/types/community';

interface LikeDislikeButtonProps {
  perfumeId: number;
  initialStats?: PerfumeReviewStats;
  onReviewSubmit?: (data: { perfumeId: number; userName: string; rating: 'like' | 'dislike'; comment?: string }) => void;
  variant?: 'compact' | 'detailed';
  className?: string;
}

const LikeDislikeButton: React.FC<LikeDislikeButtonProps> = ({
  perfumeId,
  initialStats,
  onReviewSubmit,
  variant = 'compact',
  className = ''
}) => {
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [selectedRating, setSelectedRating] = useState<'like' | 'dislike' | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use zustand store for stats
  const {
    addReview,
    updateReviewStats,
    getReviewStats,
  } = useCommunityStore();

  // Get stats from store or use initial stats
  const stats = getReviewStats(perfumeId) || initialStats || {
    perfume_id: perfumeId,
    total_likes: 0,
    total_dislikes: 0,
    total_comments: 0,
    average_rating: 0
  };

  // Initialize stats in store if not present
  useEffect(() => {
    if (!getReviewStats(perfumeId) && initialStats) {
      updateReviewStats(perfumeId, initialStats);
    }
  }, [perfumeId, initialStats, getReviewStats, updateReviewStats]);

  const handleRatingClick = (rating: 'like' | 'dislike') => {
    setSelectedRating(rating);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim() || !selectedRating) {
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        perfumeId,
        userName: userName.trim(),
        rating: selectedRating,
        comment: comment.trim() || ''
      };

      // Create review object
      const newReview = {
        id: Date.now(), // Generate temporary ID
        perfume_id: perfumeId,
        user_name: userName.trim(),
        rating: selectedRating,
        comment: comment.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add review to store (this will automatically update stats)
      addReview(newReview);

      // Call parent handler
      onReviewSubmit?.(reviewData);

      // Reset form
      setUserName('');
      setComment('');
      setSelectedRating(null);
      setShowModal(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUserName('');
    setComment('');
    setSelectedRating(null);
  };

  if (variant === 'compact') {
    return (
      <>
        <div className={`flex items-center gap-2 ${className}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRatingClick('like')}
            className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-green-50 hover:text-green-600 transition-colors"
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="text-sm font-medium">{stats.total_likes}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRatingClick('dislike')}
            className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <ThumbsDown className="h-4 w-4" />
            <span className="text-sm font-medium">{stats.total_dislikes}</span>
          </Button>

          {stats.total_comments > 0 && (
            <span className="text-sm text-gray-500">
              {stats.total_comments} {stats.total_comments === 1 ? 'comment' : 'comments'}
            </span>
          )}
        </div>

        {/* Modal for review submission */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Share Your Opinion</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    maxLength={50}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating *
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedRating('like')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                        selectedRating === 'like'
                          ? 'bg-green-50 border-green-300 text-green-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Like
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRating('dislike')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                        selectedRating === 'dislike'
                          ? 'bg-red-50 border-red-300 text-red-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <ThumbsDown className="h-4 w-4" />
                      Dislike
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment (optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this fragrance..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {comment.length}/500 characters
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!userName.trim() || !selectedRating || isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <h4 className="font-medium text-gray-900 mb-3">Community Rating</h4>

      <div className="flex items-center gap-4 mb-3">
        <button
          onClick={() => handleRatingClick('like')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
        >
          <ThumbsUp className="h-5 w-5 text-green-600" />
          <span className="font-semibold text-green-600">{stats.total_likes}</span>
        </button>

        <button
          onClick={() => handleRatingClick('dislike')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
        >
          <ThumbsDown className="h-5 w-5 text-red-600" />
          <span className="font-semibold text-red-600">{stats.total_dislikes}</span>
        </button>
      </div>

      <p className="text-sm text-gray-600">
        {stats.total_comments} {stats.total_comments === 1 ? 'person has' : 'people have'} reviewed this fragrance
      </p>

      {/* Modal for detailed variant */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Share Your Opinion</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  maxLength={50}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating *
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedRating('like')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                      selectedRating === 'like'
                        ? 'bg-green-50 border-green-300 text-green-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Like
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRating('dislike')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                      selectedRating === 'dislike'
                        ? 'bg-red-50 border-red-300 text-red-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    Dislike
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment (optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this fragrance..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {comment.length}/500 characters
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!userName.trim() || !selectedRating || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LikeDislikeButton;