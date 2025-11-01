export interface Perfume {
  id: number;
  name: string;
  brand: string;
  description: string;
  concentration: string;
  longevity: string | null;
  sillage: string | null;
  price: number;
  image_url: string;
  type?: string;
  category?: string;
  target_audience?: string;
  aroma_tags: AromaTag[];
  notes: Note[];
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  perfume_id: number;
  type: 'top' | 'middle' | 'base';
  note_name: string;
  intensity: number;
}

export interface AromaTag {
  id: number;
  slug: string;
  name: string;
}

export interface PerfumeAroma {
  perfume_id: number;
  aroma_tag_id: number;
}

export interface RecommendationRequest {
  aromas: string[];
}

export interface RecommendationResult {
  perfume: Perfume;
  score: number;
  explanation: string;
}

export interface AuthResponse {
  token: string;
  admin: {
    id: number;
    username: string;
    email: string;
  };
}

export interface DashboardStats {
  total_perfumes: number;
  total_aromas: number;
  average_price: number;
  concentration_distribution: Record<string, number>;
  aroma_distribution: Record<string, number>;
}
