import type { Perfume } from './index';

// Enhanced Rating Types
export type Rating = 1 | 2 | 3 | 4 | 5;
export type LongevityRating = 'very-poor' | 'poor' | 'average' | 'good' | 'excellent';
export type SillageRating = 'very-light' | 'light' | 'moderate' | 'heavy' | 'very-heavy';

// Enhanced Review Interface
export interface EnhancedPerfumeReview {
  id: number;
  perfume_id: number;
  user_name: string;
  user_email?: string;

  // Enhanced Ratings
  overall_rating: Rating;
  longevity_rating: LongevityRating;
  sillage_rating: SillageRating;
  value_rating: Rating; // Price/value relationship

  // Content
  title: string; // Review title
  comment: string;
  pros: string[]; // What users liked
  cons: string[]; // What users disliked

  // Usage Context
  occasions: Occasion[];
  seasons: Season[];
  would_repurchase: boolean;

  // Metadata
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

// Occasion and Season Types
export type Occasion =
  | 'daily'
  | 'work'
  | 'casual'
  | 'date-night'
  | 'formal'
  | 'party'
  | 'wedding'
  | 'sport'
  | 'travel'
  | 'special-occasion';

export type Season =
  | 'spring'
  | 'summer'
  | 'fall'
  | 'winter'
  | 'all-season';

// Legacy Support (keeping existing types for migration)
export interface PerfumeReview {
  id: number;
  perfume_id: number;
  user_name: string;
  rating: 'like' | 'dislike';
  comment: string;
  created_at: string;
  updated_at: string;
}

// Enhanced Review Stats
export interface EnhancedPerfumeReviewStats {
  perfume_id: number;

  // Basic Stats
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };

  // Advanced Stats
  average_longevity: number; // 1-5 scale
  average_sillage: number;   // 1-5 scale
  average_value: number;    // 1-5 scale

  // Context Stats
  popular_occasions: { occasion: Occasion; count: number }[];
  popular_seasons: { season: Season; count: number }[];
  repurchase_rate: number; // Percentage

  // Engagement Stats
  total_helpful_votes: number;
  verified_purchase_rate: number;

  // Legacy Support
  total_likes: number;
  total_dislikes: number;
  total_comments: number;
}

// Review Creation/Update Request
export interface CreateEnhancedReviewRequest {
  perfume_id: number;
  user_name: string;
  user_email?: string;

  // Ratings (required)
  overall_rating: Rating;
  longevity_rating: LongevityRating;
  sillage_rating: SillageRating;
  value_rating: Rating;

  // Content
  title: string;
  comment: string;
  pros: string[];
  cons: string[];

  // Usage Context
  occasions: Occasion[];
  seasons: Season[];
  would_repurchase: boolean;
}

export interface UpdateEnhancedReviewRequest extends Partial<CreateEnhancedReviewRequest> {
  id: number;
}

// Review Response
export interface ReviewResponse {
  success: boolean;
  data: EnhancedPerfumeReview;
  message?: string;
}

// Review Validation
export interface ReviewValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ReviewValidationResult {
  is_valid: boolean;
  errors: ReviewValidationError[];
  warnings: ReviewValidationError[];
}

// Legacy Stats Support
export interface PerfumeReviewStats {
  perfume_id: number;
  total_likes: number;
  total_dislikes: number;
  total_comments: number;
  average_rating: number;
}

// Community Perfume with Enhanced Stats
export interface CommunityPerfume extends Perfume {
  review_stats?: EnhancedPerfumeReviewStats | PerfumeReviewStats;
  recent_reviews?: EnhancedPerfumeReview[] | PerfumeReview[];
  top_reviews?: EnhancedPerfumeReview[];
}

// Review Filters and Sorting
export interface ReviewFilters {
  rating?: Rating | 'all';
  longevity?: LongevityRating | 'all';
  sillage?: SillageRating | 'all';
  occasion?: Occasion | 'all';
  season?: Season | 'all';
  would_repurchase?: boolean | 'all';
  verified_purchase?: boolean | 'all';
  has_pros_cons?: boolean;
  time_period?: 'all' | 'week' | 'month' | 'year';
}

export type ReviewSortOption =
  | 'most-recent'
  | 'most-helpful'
  | 'highest-rating'
  | 'lowest-rating'
  | 'most-pros-cons'
  | 'verified-purchases';

// UI Component Props
export interface ReviewCardProps {
  review: EnhancedPerfumeReview;
  showPerfumeInfo?: boolean;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  onHelpful?: (reviewId: number) => void;
  onReport?: (reviewId: number) => void;
}

export interface ReviewFormProps {
  perfumeId: number;
  initialData?: Partial<EnhancedPerfumeReview>;
  onSubmit: (data: CreateEnhancedReviewRequest) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  validationErrors?: ReviewValidationResult;
}

// Review Aggregation for Analytics
export interface ReviewAnalytics {
  perfume_id: number;
  total_reviews: number;
  average_rating: number;
  sentiment_score: number; // -1 to 1
  keyword_frequency: { word: string; count: number }[];
  top_keywords: string[];
  performance_trends: {
    date: string;
    average_rating: number;
    review_count: number;
  }[];
}

// Helper Functions
export const OCCASION_OPTIONS: { value: Occasion; label: string; icon: string }[] = [
  { value: 'daily', label: 'Daily Wear', icon: 'sun' },
  { value: 'work', label: 'Work/Office', icon: 'briefcase' },
  { value: 'casual', label: 'Casual', icon: 'coffee' },
  { value: 'date-night', label: 'Date Night', icon: 'heart' },
  { value: 'formal', label: 'Formal Events', icon: 'tie' },
  { value: 'party', label: 'Parties', icon: 'cocktail' },
  { value: 'wedding', label: 'Weddings', icon: 'ring' },
  { value: 'sport', label: 'Sports', icon: 'activity' },
  { value: 'travel', label: 'Travel', icon: 'plane' },
  { value: 'special-occasion', label: 'Special Occasions', icon: 'star' }
];

export const SEASON_OPTIONS: { value: Season; label: string; icon: string }[] = [
  { value: 'spring', label: 'Spring', icon: 'flower' },
  { value: 'summer', label: 'Summer', icon: 'sun' },
  { value: 'fall', label: 'Fall', icon: 'leaf' },
  { value: 'winter', label: 'Winter', icon: 'snowflake' },
  { value: 'all-season', label: 'All Season', icon: 'calendar' }
];

export const LONGEVITY_LABELS: Record<LongevityRating, string> = {
  'very-poor': 'Very Poor (< 1 hour)',
  'poor': 'Poor (1-3 hours)',
  'average': 'Average (3-6 hours)',
  'good': 'Good (6-8 hours)',
  'excellent': 'Excellent (8+ hours)'
};

export const SILLAGE_LABELS: Record<SillageRating, string> = {
  'very-light': 'Very Light (skin scent)',
  'light': 'Light (close to skin)',
  'moderate': 'Moderate (arm\'s length)',
  'heavy': 'Heavy (noticeable across room)',
  'very-heavy': 'Very Heavy (fills room)'
};