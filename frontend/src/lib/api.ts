const API_BASE_URL = 'http://localhost:8080/api';

export interface AromaTag {
  id: number;
  slug: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  perfume_id: number;
  type: 'top' | 'middle' | 'base';
  note_name: string;
  intensity: number;
  created_at: string;
  updated_at: string;
}

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
  type: string;
  category: string;
  target_audience: string;
  aroma_tags: AromaTag[];
  notes: Note[];
  created_at: string;
  updated_at: string;
}

export interface RecommendationResult {
  perfume: Perfume;
  score: number;
}

export interface RecommendationResponse {
  results: RecommendationResult[];
  explanation: string;
}

// Pagination interfaces
export interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_items: number;
  per_page: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// API Functions
export const api = {
  // Perfumes
  getPerfumes: async (page = 1, limit = 12, search?: string, brand?: string, aroma?: string): Promise<PaginatedResponse<Perfume>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(brand && { brand }),
      ...(aroma && { aroma }),
    });

    const response = await fetch(`${API_BASE_URL}/perfumes?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch perfumes');
    }
    return response.json();
  },

  getPerfume: async (id: number): Promise<Perfume> => {
    const response = await fetch(`${API_BASE_URL}/perfumes/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch perfume');
    }
    return response.json();
  },

  // Aromas
  getAromas: async (): Promise<AromaTag[]> => {
    const response = await fetch(`${API_BASE_URL}/aromas`);
    if (!response.ok) {
      throw new Error('Failed to fetch aromas');
    }
    return response.json();
  },

  // Recommendations
  getRecommendations: async (aromas: string[]): Promise<RecommendationResponse> => {
    const response = await fetch(`${API_BASE_URL}/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ aromas }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch recommendations');
    }
    return response.json();
  },

  // Health check
  healthCheck: async (): Promise<{ status: string }> => {
    const response = await fetch(`http://localhost:8080/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    return response.json();
  },
};
