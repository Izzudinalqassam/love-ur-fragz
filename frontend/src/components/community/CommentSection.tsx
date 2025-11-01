import React, { useState } from 'react';
import { MessageCircle, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import useCommunityStore from '@/stores/communityStore';
import type { PerfumeReview } from '@/types/community';

interface CommentSectionProps {
  perfumeId: number;
  comments: PerfumeReview[];
  onAddComment: (data: { perfumeId: number; userName: string; comment: string; rating: 'like' | 'dislike' }) => void;
  maxVisible?: number;
  className?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  perfumeId,
  comments,
  onAddComment,
  maxVisible = 5,
  className = ''
}) => {
  const [showAllComments, setShowAllComments] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState<'like' | 'dislike'>('like');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use community store for persistent data
  const { addReview } = useCommunityStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim() || !comment.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create review object
      const newReview = {
        id: Date.now(),
        perfume_id: perfumeId,
        user_name: userName.trim(),
        rating,
        comment: comment.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add review to store (this will automatically update stats)
      addReview(newReview);

      // Call parent handler for API call
      onAddComment({
        perfumeId,
        userName: userName.trim(),
        comment: comment.trim(),
        rating
      });

      // Reset form
      setUserName('');
      setComment('');
      setShowCommentForm(false);
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibleComments = showAllComments
    ? comments
    : comments.slice(0, maxVisible);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Add Comment Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Community Reviews ({comments.length})
        </h3>

        <Button
          onClick={() => setShowCommentForm(!showCommentForm)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          {showCommentForm ? 'Cancel' : 'Add Review'}
        </Button>
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <Card>
          <CardContent className="p-6">
            <h4 className="font-medium text-gray-900 mb-4">Share Your Review</h4>

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
                    onClick={() => setRating('like')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                      rating === 'like'
                        ? 'bg-green-50 border-green-300 text-green-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    👍 Like
                  </button>
                  <button
                    type="button"
                    onClick={() => setRating('dislike')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                      rating === 'dislike'
                        ? 'bg-red-50 border-red-300 text-red-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    👎 Dislike
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this fragrance..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  maxLength={500}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {comment.length}/500 characters
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCommentForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!userName.trim() || !comment.trim() || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      {visibleComments.length > 0 ? (
        <div className="space-y-4">
          {visibleComments.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900 truncate">
                        {review.user_name}
                      </span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(review.created_at)}
                      </span>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        review.rating === 'like'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {review.rating === 'like' ? '👍 Liked' : '👎 Disliked'}
                      </span>
                    </div>

                    <p className="text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Show More/Less Button */}
          {comments.length > maxVisible && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setShowAllComments(!showAllComments)}
                className="px-6"
              >
                {showAllComments
                  ? `Show Less (${comments.length - maxVisible} hidden)`
                  : `Show All ${comments.length} Reviews`
                }
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-gray-600 mb-4">
              Be the first to share your thoughts about this fragrance!
            </p>
            <Button onClick={() => setShowCommentForm(true)}>
              Write a Review
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommentSection;