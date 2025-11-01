import { useState, useCallback } from 'react';
import { quizService, convertSimpleQuizDataToAPI, convertQuizDataToAPI, validateSimpleQuizData, validateQuizData } from '../services/quizService';
import type { AdvancedRecommendationResponse } from '../services/quizService';

// Re-export types for quiz components
export type { AdvancedRecommendationResponse } from '../services/quizService';

export interface QuizData {
  // Basic Info (Simple Quiz)
  name?: string;
  gender: string;

  // Simple Quiz Fields
  scentPersonalities: string[];
  occasions: string[];
  seasons: string[];
  longevity: string;
  impression: string;

  // Legacy fields for compatibility
  email: string;
  age: string;
  lifestyle: string;

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

  sillage: string;
  projection: string;

  classic: boolean;
  modern: boolean;
  unique: boolean;
  safeBet: boolean;

  priceRange: string;

  // Current Situation
  currentSituation: string;
  season: string;
  timeOfDay: string;
  desiredImpression: string;
}

const initialQuizData: QuizData = {
  // Simple Quiz defaults
  name: '',
  gender: '',
  scentPersonalities: [],
  occasions: [],
  seasons: [],
  longevity: 'medium',
  impression: '',

  // Legacy fields for compatibility
  email: '',
  age: '',
  lifestyle: '',
  dailyWear: false,
  specialEvents: false,
  nightOut: false,
  work: false,
  dates: false,
  spring: false,
  summer: false,
  fall: false,
  winter: false,
  yearRound: false,
  lightFresh: false,
  warmSpicy: false,
  sweetGourmand: false,
  woodyEarthy: false,
  floralRomantic: false,
  citrusEnergizing: false,
  sillage: 'moderate',
  projection: 'moderate',
  classic: false,
  modern: false,
  unique: false,
  safeBet: false,
  priceRange: 'mid',
  currentSituation: 'casual',
  season: 'spring',
  timeOfDay: 'morning',
  desiredImpression: 'confident',
};

export const useQuiz = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AdvancedRecommendationResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<QuizData>(initialQuizData);

  const totalSteps = 3;
  const progressPercentage = (step / totalSteps) * 100;

  const updateQuizData = useCallback((field: keyof QuizData, value: any) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
  }, []);

  const nextStep = useCallback(() => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  }, [step, totalSteps]);

  const previousStep = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
    }
  }, [step]);

  const resetQuiz = useCallback(() => {
    setStep(1);
    setRecommendations(null);
    setApiError(null);
    setQuizData(initialQuizData);
  }, []);

  const submitQuiz = useCallback(async () => {
    setLoading(true);
    setApiError(null);

    try {
      // Validate quiz data before sending (use simple quiz validator)
      const validationErrors = validateSimpleQuizData(quizData);
      if (validationErrors.length > 0) {
        setApiError(validationErrors.join(', '));
        return;
      }

      // Convert quiz data to API format (use simple quiz converter)
      const apiRequest = convertSimpleQuizDataToAPI(quizData);

      console.log('Sending quiz request:', apiRequest);

      // Call the real API
      const response = await quizService.getRecommendations(apiRequest);

      console.log('Received recommendations:', response);

      // Set the real recommendations
      setRecommendations(response);

      // Optionally save quiz response to database
      if (quizData.name && quizData.email) {
        try {
          await quizService.saveQuizResponse({
            name: quizData.name,
            email: quizData.email,
            age: parseInt(quizData.age) || undefined,
            gender: quizData.gender,
            lifestyle: quizData.lifestyle,
            preferences: apiRequest.quiz_preferences,
          });
        } catch (saveError) {
          console.warn('Could not save quiz response:', saveError);
          // Don't fail the flow if saving doesn't work
        }
      }

    } catch (error: any) {
      console.error('Error getting recommendations:', error);
      setApiError(error.message || 'Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [quizData]);

  const clearError = useCallback(() => {
    setApiError(null);
  }, []);

  return {
    // State
    step,
    loading,
    recommendations,
    apiError,
    quizData,
    progressPercentage,
    totalSteps,

    // Actions
    updateQuizData,
    nextStep,
    previousStep,
    resetQuiz,
    submitQuiz,
    clearError,
  };
};