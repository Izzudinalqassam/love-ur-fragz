import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PerfumeReview, PerfumeReviewStats } from '@/types/community';

interface CommunityStore {
  // Reviews data
  reviews: Record<number, PerfumeReview[]>;
  reviewStats: Record<number, PerfumeReviewStats>;

  // Actions
  addReview: (review: PerfumeReview) => void;
  updateReviewStats: (perfumeId: number, stats: Partial<PerfumeReviewStats>) => void;
  getReviews: (perfumeId: number) => PerfumeReview[];
  getReviewStats: (perfumeId: number) => PerfumeReviewStats | null;
  clearAllData: () => void;
  resetCommunityData: () => void;
}

const useCommunityStore = create<CommunityStore>()(
  persist(
    (set, get) => ({
      // Initial state
      reviews: {},
      reviewStats: {},

      // Add new review
      addReview: (review: PerfumeReview) => {
        set((state) => {
          const perfumeId = review.perfume_id;
          const existingReviews = state.reviews[perfumeId] || [];

          // Add review to the beginning
          const newReviews = [review, ...existingReviews];

          // Update reviews
          const updatedReviews = {
            ...state.reviews,
            [perfumeId]: newReviews,
          };

          // Update stats
          const currentStats = state.reviewStats[perfumeId] || {
            perfume_id: perfumeId,
            total_likes: 0,
            total_dislikes: 0,
            total_comments: 0,
            average_rating: 0,
          };

          let newStats = { ...currentStats };

          if (review.rating === 'like') {
            newStats.total_likes += 1;
          } else {
            newStats.total_dislikes += 1;
          }

          if (review.comment) {
            newStats.total_comments += 1;
          }

          // Calculate average rating
          const totalRatings = newStats.total_likes + newStats.total_dislikes;
          newStats.average_rating = totalRatings > 0
            ? (newStats.total_likes / totalRatings) * 5
            : 0;

          const updatedStats = {
            ...state.reviewStats,
            [perfumeId]: newStats,
          };

          return {
            reviews: updatedReviews,
            reviewStats: updatedStats,
          };
        });
      },

      // Update review stats
      updateReviewStats: (perfumeId: number, stats: Partial<PerfumeReviewStats>) => {
        set((state) => ({
          reviewStats: {
            ...state.reviewStats,
            [perfumeId]: {
              ...(state.reviewStats[perfumeId] || {
                perfume_id: perfumeId,
                total_likes: 0,
                total_dislikes: 0,
                total_comments: 0,
                average_rating: 0,
              }),
              ...stats,
            },
          },
        }));
      },

      // Get reviews for a perfume
      getReviews: (perfumeId: number) => {
        return get().reviews[perfumeId] || [];
      },

      // Get review stats for a perfume
      getReviewStats: (perfumeId: number) => {
        return get().reviewStats[perfumeId] || null;
      },

      // Clear all data
      clearAllData: () => {
        set({
          reviews: {},
          reviewStats: {},
        });
      },

      // Reset all community data to zero (initial state)
      resetCommunityData: () => {
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('community-storage');
        }
        // Reset store state
        set({
          reviews: {},
          reviewStats: {},
        });
      },
    }),
    {
      name: 'community-storage',
      partialize: (state) => ({
        reviews: state.reviews,
        reviewStats: state.reviewStats,
      }),
    }
  )
);

export default useCommunityStore;