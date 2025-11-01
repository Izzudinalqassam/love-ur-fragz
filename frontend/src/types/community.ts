import type { Perfume } from './index';

export interface PerfumeReview {
  id: number;
  perfume_id: number;
  user_name: string;
  rating: 'like' | 'dislike';
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface PerfumeReviewStats {
  perfume_id: number;
  total_likes: number;
  total_dislikes: number;
  total_comments: number;
  average_rating: number;
}

export interface CreateReviewRequest {
  perfume_id: number;
  user_name: string;
  rating: 'like' | 'dislike';
  comment?: string;
}

export interface CommunityPerfume extends Perfume {
  review_stats?: PerfumeReviewStats;
  recent_reviews?: PerfumeReview[];
}