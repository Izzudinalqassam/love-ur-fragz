const API_BASE_URL = 'http://localhost:8080/api';

export interface AromaCategory {
  id: number;
  slug: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export class AromaService {
  private static cache: AromaCategory[] | null = null;
  private static cacheExpiry: number = 0;
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetch all aroma categories with caching
   */
  static async getAromaCategories(): Promise<AromaCategory[]> {
    // Check cache first
    const now = Date.now();
    if (this.cache && this.cacheExpiry > now) {
      return this.cache;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/aromas`);
      if (!response.ok) {
        throw new Error('Failed to fetch aroma categories');
      }

      const categories: AromaCategory[] = await response.json();

      // Update cache
      this.cache = categories;
      this.cacheExpiry = now + this.CACHE_DURATION;

      return categories;
    } catch (error) {
      console.error('Error fetching aroma categories:', error);
      // Return cached data if available, even if expired
      return this.cache || [];
    }
  }

  /**
   * Get unique category names for display (grouping similar categories)
   */
  static async getGroupedCategories(): Promise<string[]> {
    const categories = await this.getAromaCategories();

    // Extract unique base categories (e.g., "Woody" from "Woody Spicy", "Floral" from "Floral Fruity")
    const baseCategories = new Set<string>();

    categories.forEach(category => {
      const words = category.name.split(' ');
      // Add the first word as the main category
      if (words.length > 0) {
        baseCategories.add(words[0]);
      }
    });

    return Array.from(baseCategories).sort();
  }

  /**
   * Get categories that match a specific group
   */
  static async getCategoriesByGroup(groupName: string): Promise<AromaCategory[]> {
    const categories = await this.getAromaCategories();

    return categories.filter(category =>
      category.name.toLowerCase().includes(groupName.toLowerCase())
    );
  }

  /**
   * Search aroma categories by name
   */
  static async searchCategories(query: string): Promise<AromaCategory[]> {
    const categories = await this.getAromaCategories();

    if (!query.trim()) return categories;

    const searchTerm = query.toLowerCase();
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm) ||
      category.slug.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Clear the cache (useful for testing or force refresh)
   */
  static clearCache(): void {
    this.cache = null;
    this.cacheExpiry = 0;
  }
}