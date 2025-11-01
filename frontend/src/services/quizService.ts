import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Type definitions
export interface QuizPreferences {
  dailyWear: boolean;
  specialEvents: boolean;
  nightOut: boolean;
  work: boolean;
  dates: boolean;
  spring: boolean;
  summer: boolean;
  fall: boolean;
  winter: boolean;
  yearRound: boolean;
  lightFresh: boolean;
  warmSpicy: boolean;
  sweetGourmand: boolean;
  woodyEarthy: boolean;
  floralRomantic: boolean;
  citrusEnergizing: boolean;
  longevity: string;
  sillage: string;
  projection: string;
  classic: boolean;
  modern: boolean;
  unique: boolean;
  safeBet: boolean;
  priceRange: string;
}

export interface AdvancedRecommendationRequest {
  quiz_preferences: QuizPreferences;
  current_situation: string;
  season: string;
  time_of_day: string;
  desired_impression: string;
  max_results?: number;
  exclude_ids?: number[];
}

export interface PersonalityAnalysis {
  scent_personality: string;
  key_traits: string[];
  style_description: string;
  recommendation_style: string;
}

export interface PerfumeScore {
  perfume_id: number;
  perfume: {
    id: number;
    name: string;
    brand: string;
    description: string;
    type: string;
    category: string;
    longevity: string;
    sillage: string;
    price: number;
    image_url?: string;
    aroma_tags: Array<{
      id: number;
      slug: string;
      name: string;
    }>;
    notes: Array<{
      id: number;
      perfume_id: number;
      type: string;
      note_name: string;
      intensity: number;
    }>;
  };
  overall_score: number;
  profile_match: number;
  season_match: number;
  occasion_match: number;
  performance_match: number;
  uniqueness_bonus: number;
  match_reasons: string[];
  best_for: string[];
  wear_timing: string[];
  longevity: string;
  projection: string;
  confidence: number;
  rank: number;
}

export interface AdvancedRecommendationResponse {
  results: PerfumeScore[];
  personality_analysis: PersonalityAnalysis;
  recommendation_logic: {
    algorithm: string;
    factors_considered: string[];
    weighting: Record<string, number>;
    process_description: string;
  };
  tips: string[];
  alternatives: any[];
}

export interface PersonalityQuiz {
  name?: string;
  email?: string;
  age?: number;
  gender?: string;
  lifestyle?: string;
  preferences: QuizPreferences;
}

// Service implementation
export const quizService = {
  // Get personalized recommendations based on quiz responses
  async getRecommendations(request: AdvancedRecommendationRequest): Promise<AdvancedRecommendationResponse> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/quiz/recommendations`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 seconds timeout
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error getting recommendations:', error);

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(error.response.data.error || 'Failed to get recommendations');
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('Network error - please check your connection');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error('Request setup error');
      }
    }
  },

  // Save quiz response to database
  async saveQuizResponse(quiz: PersonalityQuiz): Promise<PersonalityQuiz> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/quiz/save`,
        quiz,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error saving quiz response:', error);
      throw new Error(error.response?.data?.error || 'Failed to save quiz response');
    }
  },

  // Get quiz statistics
  async getQuizStats(): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/quiz/stats`);
      return response.data;
    } catch (error: any) {
      console.error('Error getting quiz stats:', error);
      throw new Error(error.response?.data?.error || 'Failed to get quiz statistics');
    }
  },

  // Get available personality types
  async getPersonalityTypes(): Promise<any[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/quiz/personality-types`);
      return response.data;
    } catch (error: any) {
      console.error('Error getting personality types:', error);
      throw new Error(error.response?.data?.error || 'Failed to get personality types');
    }
  },
};

// Helper function to convert frontend quiz data to API format
export const convertSimpleQuizDataToAPI = (quizData: any): AdvancedRecommendationRequest => {
  // Convert simple quiz data to API format
  const preferences: QuizPreferences = {
    // Occasion preferences from simple data
    dailyWear: quizData.occasions?.includes('daily_wear') || false,
    specialEvents: quizData.occasions?.includes('special_events') || false,
    nightOut: quizData.occasions?.includes('night_out') || false,
    work: quizData.occasions?.includes('work_office') || false,
    dates: quizData.occasions?.includes('date_night') || false,

    // Seasonal preferences from simple data
    spring: quizData.seasons?.includes('spring_summer') || false,
    summer: quizData.seasons?.includes('spring_summer') || false,
    fall: quizData.seasons?.includes('fall_winter') || false,
    winter: quizData.seasons?.includes('fall_winter') || false,
    yearRound: quizData.seasons?.includes('year_round') || false,

    // Scent preferences from simple data
    lightFresh: quizData.scentPersonalities?.includes('light_fresh') || false,
    warmSpicy: quizData.scentPersonalities?.includes('warm_spicy') || false,
    sweetGourmand: quizData.scentPersonalities?.includes('sweet_gourmand') || false,
    woodyEarthy: quizData.scentPersonalities?.includes('woody_earthy') || false,
    floralRomantic: quizData.scentPersonalities?.includes('floral_romantic') || false,
    citrusEnergizing: quizData.scentPersonalities?.includes('citrus_energizing') || false,

    // Performance preferences
    longevity: quizData.longevity || 'medium',
    sillage: 'moderate', // Default for simple quiz
    projection: 'moderate', // Default for simple quiz

    // Style preferences - default to balanced
    classic: false,
    modern: true,
    unique: false,
    safeBet: false,

    // Price range - default to mid
    priceRange: 'mid',
  };

  // Map impression to desired_impression
  const impressionMap: { [key: string]: string } = {
    'confident': 'confident',
    'elegant': 'elegant',
    'playful': 'playful',
    'mysterious': 'mysterious',
    'professional': 'professional',
    'romantic': 'romantic',
  };

  return {
    quiz_preferences: preferences,
    current_situation: quizData.occasions?.[0] || 'casual', // Use first occasion
    season: 'spring', // Default
    time_of_day: 'evening', // Default
    desired_impression: impressionMap[quizData.impression] || 'confident',
    max_results: 6,
    exclude_ids: [],
  };
};

export const convertQuizDataToAPI = (quizData: any): AdvancedRecommendationRequest => {
  return {
    quiz_preferences: {
      // Occasion preferences
      dailyWear: quizData.dailyWear || false,
      specialEvents: quizData.specialEvents || false,
      nightOut: quizData.nightOut || false,
      work: quizData.work || false,
      dates: quizData.dates || false,

      // Seasonal preferences
      spring: quizData.spring || false,
      summer: quizData.summer || false,
      fall: quizData.fall || false,
      winter: quizData.winter || false,
      yearRound: quizData.yearRound || false,

      // Scent preferences
      lightFresh: quizData.lightFresh || false,
      warmSpicy: quizData.warmSpicy || false,
      sweetGourmand: quizData.sweetGourmand || false,
      woodyEarthy: quizData.woodyEarthy || false,
      floralRomantic: quizData.floralRomantic || false,
      citrusEnergizing: quizData.citrusEnergizing || false,

      // Performance preferences
      longevity: quizData.longevity || 'medium',
      sillage: quizData.sillage || 'moderate',
      projection: quizData.projection || 'moderate',

      // Style preferences
      classic: quizData.classic || false,
      modern: quizData.modern || false,
      unique: quizData.unique || false,
      safeBet: quizData.safeBet || false,

      // Budget preference
      priceRange: quizData.priceRange || 'mid',
    },
    current_situation: quizData.currentSituation || 'casual',
    season: quizData.season || 'spring',
    time_of_day: quizData.timeOfDay || 'morning',
    desired_impression: quizData.desiredImpression || 'confident',
    max_results: 6,
    exclude_ids: [],
  };
};

// Helper function to validate quiz data before sending to API
export const validateSimpleQuizData = (quizData: any): string[] => {
  const errors: string[] = [];

  // Check gender selection
  if (!quizData.gender) {
    errors.push('Please select your gender preference');
  }

  // Check scent personalities (2-3 selections)
  if (!quizData.scentPersonalities || quizData.scentPersonalities.length < 2) {
    errors.push('Please select at least 2 scent personalities');
  }
  if (quizData.scentPersonalities && quizData.scentPersonalities.length > 3) {
    errors.push('Please select no more than 3 scent personalities');
  }

  // Check occasions (2+ selections)
  if (!quizData.occasions || quizData.occasions.length < 2) {
    errors.push('Please select at least 2 occasions');
  }

  // Check seasons (1-2 selections)
  if (!quizData.seasons || quizData.seasons.length < 1) {
    errors.push('Please select at least 1 season preference');
  }
  if (quizData.seasons && quizData.seasons.length > 2) {
    errors.push('Please select no more than 2 seasons');
  }

  // Check longevity
  if (!quizData.longevity) {
    errors.push('Please select longevity preference');
  }

  // Check impression
  if (!quizData.impression) {
    errors.push('Please select desired impression');
  }

  return errors;
};

export const validateQuizData = (quizData: any): string[] => {
  const errors: string[] = [];

  // Check if at least one scent preference is selected
  const hasScentPreference =
    quizData.lightFresh || quizData.warmSpicy || quizData.sweetGourmand ||
    quizData.woodyEarthy || quizData.floralRomantic || quizData.citrusEnergizing;

  if (!hasScentPreference) {
    errors.push('Please select at least one scent preference');
  }

  // Check if at least one occasion is selected
  const hasOccasion =
    quizData.dailyWear || quizData.specialEvents || quizData.nightOut ||
    quizData.work || quizData.dates;

  if (!hasOccasion) {
    errors.push('Please select at least one occasion');
  }

  return errors;
};