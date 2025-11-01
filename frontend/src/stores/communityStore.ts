import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  PerfumeReview,
  PerfumeReviewStats,
  EnhancedPerfumeReview,
  EnhancedPerfumeReviewStats,
  CreateEnhancedReviewRequest,
  ReviewFilters,
  ReviewSortOption,
  Occasion,
  Season
} from '@/types/community';

interface CommunityStore {
  // Reviews data - Support both legacy and enhanced
  reviews: Record<number, (PerfumeReview | EnhancedPerfumeReview)[]>;
  reviewStats: Record<number, (PerfumeReviewStats | EnhancedPerfumeReviewStats)>;

  // Enhanced features
  userReviews: Record<string, EnhancedPerfumeReview[]>; // Track user's own reviews
  helpfulVotes: Record<number, Set<string>>; // Track helpful votes per review
  reportedReviews: Set<number>; // Track reported reviews

  // Filtering and sorting
  currentFilters: Record<number, ReviewFilters>;
  currentSort: Record<number, ReviewSortOption>;

  // Actions
  addReview: (review: PerfumeReview | EnhancedPerfumeReview) => void;
  addEnhancedReview: (review: EnhancedPerfumeReview) => void;
  updateReview: (reviewId: number, updates: Partial<EnhancedPerfumeReview>) => void;
  deleteReview: (reviewId: number, perfumeId: number) => void;
  updateReviewStats: (perfumeId: number, stats: Partial<PerfumeReviewStats | EnhancedPerfumeReviewStats>) => void;

  // Enhanced actions
  markHelpful: (reviewId: number, userId: string) => void;
  reportReview: (reviewId: number) => void;
  updateFilters: (perfumeId: number, filters: ReviewFilters) => void;
  updateSort: (perfumeId: number, sort: ReviewSortOption) => void;

  // Getters
  getReviews: (perfumeId: number) => (PerfumeReview | EnhancedPerfumeReview)[];
  getEnhancedReviews: (perfumeId: number) => EnhancedPerfumeReview[];
  getReviewStats: (perfumeId: number) => (PerfumeReviewStats | EnhancedPerfumeReviewStats) | null;
  getEnhancedReviewStats: (perfumeId: number) => EnhancedPerfumeReviewStats | null;
  getFilteredReviews: (perfumeId: number) => (PerfumeReview | EnhancedPerfumeReview)[];
  getUserReview: (perfumeId: number, userId: string) => EnhancedPerfumeReview | null;
  isReviewHelpful: (reviewId: number, userId: string) => boolean;
  isReviewReported: (reviewId: number) => boolean;

  // Utility actions
  clearAllData: () => void;
  resetCommunityData: () => void;
  migrateLegacyReviews: () => void;
}

const useCommunityStore = create<CommunityStore>()(
  persist(
    (set, get) => ({
      // Initial state
      reviews: {},
      reviewStats: {},
      userReviews: {},
      helpfulVotes: {},
      reportedReviews: new Set(),
      currentFilters: {},
      currentSort: {},

      // Enhanced review addition
      addEnhancedReview: (review: EnhancedPerfumeReview) => {
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

          // Update user reviews
          const userEmail = review.user_email || review.user_name;
          const existingUserReviews = state.userReviews[userEmail] || [];
          const updatedUserReviews = {
            ...state.userReviews,
            [userEmail]: [review, ...existingUserReviews.filter(r => r.id !== review.id)],
          };

          // Update enhanced stats
          const currentStats = state.reviewStats[perfumeId] as EnhancedPerfumeReviewStats || {
            perfume_id: perfumeId,
            total_reviews: 0,
            average_rating: 0,
            rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            average_longevity: 0,
            average_sillage: 0,
            average_value: 0,
            popular_occasions: [],
            popular_seasons: [],
            repurchase_rate: 0,
            total_helpful_votes: 0,
            verified_purchase_rate: 0,
            total_likes: 0,
            total_dislikes: 0,
            total_comments: 0,
          };

          // Calculate new stats
          const enhancedReviews = newReviews.filter(r => 'overall_rating' in r) as EnhancedPerfumeReview[];
          const newStats = calculateEnhancedStats(enhancedReviews, currentStats);

          const updatedStats = {
            ...state.reviewStats,
            [perfumeId]: newStats,
          };

          return {
            reviews: updatedReviews,
            reviewStats: updatedStats,
            userReviews: updatedUserReviews,
          };
        });
      },

      // Legacy review addition (for backward compatibility)
      addReview: (review: PerfumeReview | EnhancedPerfumeReview) => {
        if ('overall_rating' in review) {
          return get().addEnhancedReview(review as EnhancedPerfumeReview);
        }

        // Handle legacy reviews
        set((state) => {
          const perfumeId = review.perfume_id;
          const existingReviews = state.reviews[perfumeId] || [];

          const newReviews = [review, ...existingReviews];
          const updatedReviews = {
            ...state.reviews,
            [perfumeId]: newReviews,
          };

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

      // Update existing review
      updateReview: (reviewId: number, updates: Partial<EnhancedPerfumeReview>) => {
        set((state) => {
          const updatedReviews = { ...state.reviews };

          // Find and update the review
          for (const perfumeId in updatedReviews) {
            const reviewIndex = updatedReviews[Number(perfumeId)].findIndex(r => r.id === reviewId);
            if (reviewIndex !== -1) {
              const review = updatedReviews[Number(perfumeId)][reviewIndex];
              if ('overall_rating' in review) {
                updatedReviews[Number(perfumeId)][reviewIndex] = {
                  ...review,
                  ...updates,
                  updated_at: new Date().toISOString(),
                };
              }
              break;
            }
          }

          return { reviews: updatedReviews };
        });
      },

      // Delete review
      deleteReview: (reviewId: number, perfumeId: number) => {
        set((state) => {
          const updatedReviews = {
            ...state.reviews,
            [perfumeId]: state.reviews[perfumeId]?.filter(r => r.id !== reviewId) || [],
          };

          return { reviews: updatedReviews };
        });
      },

      // Update review stats
      updateReviewStats: (perfumeId: number, stats: Partial<PerfumeReviewStats | EnhancedPerfumeReviewStats>) => {
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

      // Enhanced actions
      markHelpful: (reviewId: number, userId: string) => {
        set((state) => {
          const helpfulVotes = { ...state.helpfulVotes };
          if (!helpfulVotes[reviewId]) {
            helpfulVotes[reviewId] = new Set();
          }
          helpfulVotes[reviewId].add(userId);

          // Update helpful count in the review
          const updatedReviews = { ...state.reviews };
          for (const perfumeId in updatedReviews) {
            const reviewIndex = updatedReviews[Number(perfumeId)].findIndex(r => r.id === reviewId);
            if (reviewIndex !== -1) {
              const review = updatedReviews[Number(perfumeId)][reviewIndex];
              if ('overall_rating' in review) {
                updatedReviews[Number(perfumeId)][reviewIndex] = {
                  ...review,
                  helpful_count: (review as EnhancedPerfumeReview).helpful_count + 1,
                };
              }
              break;
            }
          }

          return { helpfulVotes, reviews: updatedReviews };
        });
      },

      reportReview: (reviewId: number) => {
        set((state) => ({
          reportedReviews: new Set([...state.reportedReviews, reviewId]),
        }));
      },

      updateFilters: (perfumeId: number, filters: ReviewFilters) => {
        set((state) => ({
          currentFilters: {
            ...state.currentFilters,
            [perfumeId]: filters,
          },
        }));
      },

      updateSort: (perfumeId: number, sort: ReviewSortOption) => {
        set((state) => ({
          currentSort: {
            ...state.currentSort,
            [perfumeId]: sort,
          },
        }));
      },

      // Getters
      getReviews: (perfumeId: number) => {
        return get().reviews[perfumeId] || [];
      },

      getEnhancedReviews: (perfumeId: number) => {
        return get().reviews[perfumeId]?.filter(r => 'overall_rating' in r) as EnhancedPerfumeReview[] || [];
      },

      getReviewStats: (perfumeId: number) => {
        return get().reviewStats[perfumeId] || null;
      },

      getEnhancedReviewStats: (perfumeId: number) => {
        const stats = get().reviewStats[perfumeId];
        return stats && 'total_reviews' in stats ? stats as EnhancedPerfumeReviewStats : null;
      },

      getFilteredReviews: (perfumeId: number) => {
        const reviews = get().getReviews(perfumeId);
        const filters = get().currentFilters[perfumeId];
        const sort = get().currentSort[perfumeId];

        let filtered = reviews;

        // Apply filters
        if (filters) {
          filtered = reviews.filter(review => {
            if ('overall_rating' in review) {
              const enhancedReview = review as EnhancedPerfumeReview;

              // Rating filter
              if (filters.rating !== 'all' && enhancedReview.overall_rating !== filters.rating) {
                return false;
              }

              // Longevity filter
              if (filters.longevity !== 'all' && enhancedReview.longevity_rating !== filters.longevity) {
                return false;
              }

              // Sillage filter
              if (filters.sillage !== 'all' && enhancedReview.sillage_rating !== filters.sillage) {
                return false;
              }

              // Occasion filter
              if (filters.occasion !== 'all' && !enhancedReview.occasions.includes(filters.occasion as Occasion)) {
                return false;
              }

              // Season filter
              if (filters.season !== 'all' && !enhancedReview.seasons.includes(filters.season as Season)) {
                return false;
              }

              // Repurchase filter
              if (filters.would_repurchase !== 'all' && enhancedReview.would_repurchase !== filters.would_repurchase) {
                return false;
              }

              // Verified purchase filter
              if (filters.verified_purchase !== 'all' && enhancedReview.is_verified_purchase !== filters.verified_purchase) {
                return false;
              }

              // Has pros/cons filter
              if (filters.has_pros_cons && (enhancedReview.pros.length === 0 && enhancedReview.cons.length === 0)) {
                return false;
              }
            }
            return true;
          });
        }

        // Apply sorting
        if (sort) {
          filtered = [...filtered].sort((a, b) => {
            switch (sort) {
              case 'most-recent':
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
              case 'most-helpful':
                return (b as any).helpful_count - (a as any).helpful_count;
              case 'highest-rating':
                return (b as any).overall_rating - (a as any).overall_rating;
              case 'lowest-rating':
                return (a as any).overall_rating - (b as any).overall_rating;
              case 'most-pros-cons':
                const aTotal = ((a as any).pros?.length || 0) + ((a as any).cons?.length || 0);
                const bTotal = ((b as any).pros?.length || 0) + ((b as any).cons?.length || 0);
                return bTotal - aTotal;
              case 'verified-purchases':
                return ((b as any).is_verified_purchase ? 1 : 0) - ((a as any).is_verified_purchase ? 1 : 0);
              default:
                return 0;
            }
          });
        }

        return filtered;
      },

      getUserReview: (perfumeId: number, userId: string) => {
        return get().userReviews[userId]?.find(r => r.perfume_id === perfumeId) || null;
      },

      isReviewHelpful: (reviewId: number, userId: string) => {
        return get().helpfulVotes[reviewId]?.has(userId) || false;
      },

      isReviewReported: (reviewId: number) => {
        return get().reportedReviews.has(reviewId);
      },

      // Utility actions
      clearAllData: () => {
        set({
          reviews: {},
          reviewStats: {},
          userReviews: {},
          helpfulVotes: {},
          reportedReviews: new Set(),
          currentFilters: {},
          currentSort: {},
        });
      },

      resetCommunityData: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('community-storage');
        }
        get().clearAllData();
      },

      migrateLegacyReviews: () => {
        // Migration logic for legacy reviews to enhanced format
        set((state) => {
          const migratedReviews = { ...state.reviews };
          const migratedStats = { ...state.reviewStats };

          for (const perfumeId in migratedReviews) {
            const reviews = migratedReviews[Number(perfumeId)];
            const enhancedReviews = reviews.map(review => {
              if ('overall_rating' in review) {
                return review;
              }

              // Convert legacy review to enhanced format
              const legacyReview = review as PerfumeReview;
              return {
                id: legacyReview.id,
                perfume_id: legacyReview.perfume_id,
                user_name: legacyReview.user_name,
                user_email: undefined,
                overall_rating: legacyReview.rating === 'like' ? 5 : 2,
                longevity_rating: 'average' as LongevityRating,
                sillage_rating: 'moderate' as SillageRating,
                value_rating: 3 as Rating,
                title: legacyReview.comment ? legacyReview.comment.substring(0, 50) + '...' : 'User Review',
                comment: legacyReview.comment,
                pros: [],
                cons: [],
                occasions: [],
                seasons: [],
                would_repurchase: legacyReview.rating === 'like',
                is_verified_purchase: false,
                helpful_count: 0,
                created_at: legacyReview.created_at,
                updated_at: legacyReview.updated_at,
              } as EnhancedPerfumeReview;
            });

            migratedReviews[Number(perfumeId)] = enhancedReviews;
            migratedStats[Number(perfumeId)] = calculateEnhancedStats(enhancedReviews, migratedStats[Number(perfumeId)] as EnhancedPerfumeReviewStats);
          }

          return {
            reviews: migratedReviews,
            reviewStats: migratedStats,
          };
        });
      },
    }),
    {
      name: 'community-storage',
      partialize: (state) => ({
        reviews: state.reviews,
        reviewStats: state.reviewStats,
        userReviews: state.userReviews,
        helpfulVotes: Object.fromEntries(
          Object.entries(state.helpfulVotes).map(([key, set]) => [key, Array.from(set)])
        ),
        reportedReviews: Array.from(state.reportedReviews),
        currentFilters: state.currentFilters,
        currentSort: state.currentSort,
      }),
      onRehydrateStorage: (state) => {
        // Rehydrate Sets from arrays
        if (state) {
          state.helpfulVotes = Object.fromEntries(
            Object.entries(state.helpfulVotes || {}).map(([key, arr]) => [key, new Set(arr)])
          );
          state.reportedReviews = new Set(state.reportedReviews || []);
        }
      },
    }
  )
);

// Helper function to calculate enhanced stats
function calculateEnhancedStats(
  reviews: EnhancedPerfumeReview[],
  currentStats?: EnhancedPerfumeReviewStats
): EnhancedPerfumeReviewStats {
  if (reviews.length === 0) {
    return {
      perfume_id: currentStats?.perfume_id || 0,
      total_reviews: 0,
      average_rating: 0,
      rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      average_longevity: 0,
      average_sillage: 0,
      average_value: 0,
      popular_occasions: [],
      popular_seasons: [],
      repurchase_rate: 0,
      total_helpful_votes: 0,
      verified_purchase_rate: 0,
      total_likes: currentStats?.total_likes || 0,
      total_dislikes: currentStats?.total_dislikes || 0,
      total_comments: currentStats?.total_comments || 0,
    };
  }

  // Calculate rating distribution
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRating = 0;
  let totalLongevity = 0;
  let totalSillage = 0;
  let totalValue = 0;
  let wouldRepurchaseCount = 0;
  let verifiedPurchaseCount = 0;
  let totalHelpfulVotes = 0;

  const occasionCounts: Record<string, number> = {};
  const seasonCounts: Record<string, number> = {};

  reviews.forEach(review => {
    // Rating distribution
    ratingDistribution[review.overall_rating]++;
    totalRating += review.overall_rating;

    // Performance metrics
    const longevityValues = { 'very-poor': 1, 'poor': 2, 'average': 3, 'good': 4, 'excellent': 5 };
    const sillageValues = { 'very-light': 1, 'light': 2, 'moderate': 3, 'heavy': 4, 'very-heavy': 5 };

    totalLongevity += longevityValues[review.longevity_rating];
    totalSillage += sillageValues[review.sillage_rating];
    totalValue += review.value_rating;

    // Repurchase rate
    if (review.would_repurchase) {
      wouldRepurchaseCount++;
    }

    // Verified purchase rate
    if (review.is_verified_purchase) {
      verifiedPurchaseCount++;
    }

    // Helpful votes
    totalHelpfulVotes += review.helpful_count;

    // Occasion counts
    review.occasions.forEach(occasion => {
      occasionCounts[occasion] = (occasionCounts[occasion] || 0) + 1;
    });

    // Season counts
    review.seasons.forEach(season => {
      seasonCounts[season] = (seasonCounts[season] || 0) + 1;
    });
  });

  // Sort and limit popular occasions/seasons
  const popularOccasions = Object.entries(occasionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([occasion, count]) => ({ occasion: occasion as Occasion, count }));

  const popularSeasons = Object.entries(seasonCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([season, count]) => ({ season: season as Season, count }));

  return {
    perfume_id: currentStats?.perfume_id || 0,
    total_reviews: reviews.length,
    average_rating: totalRating / reviews.length,
    rating_distribution,
    average_longevity: totalLongevity / reviews.length,
    average_sillage: totalSillage / reviews.length,
    average_value: totalValue / reviews.length,
    popular_occasions,
    popular_seasons,
    repurchase_rate: Math.round((wouldRepurchaseCount / reviews.length) * 100),
    total_helpful_votes: totalHelpfulVotes,
    verified_purchase_rate: Math.round((verifiedPurchaseCount / reviews.length) * 100),
    total_likes: currentStats?.total_likes || 0,
    total_dislikes: currentStats?.total_dislikes || 0,
    total_comments: currentStats?.total_comments || 0,
  };
}

export default useCommunityStore;