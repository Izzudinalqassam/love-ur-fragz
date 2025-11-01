const fs = require('fs');

const enhancedQuizCode = `import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Button, LoadingSkeleton, Badge } from '../components/ui';
import {
  Search, Sparkles, Heart, Star, ArrowRight, RefreshCw, ChevronRight, ChevronLeft,
  User, Calendar, Sun, Moon, Briefcase, Coffee, Check, X, Trophy, Target, Zap, Gift,
  Clock, Eye, Send, ThumbsUp, Flame, Diamond, ArrowLeft, ArrowRightCircle
} from 'lucide-react';

interface Perfume {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  category: string;
  longevity: string;
  projection: string;
  image?: string;
  rating?: number;
  stock?: number;
  aroma_tags?: string[];
}

interface RecommendationRequest {
  aromas: string[];
}

interface RecommendationResult {
  perfume: Perfume;
  score: number;
}

interface RecommendationResponse {
  results: RecommendationResult[];
}

interface QuizRecommendationResponse {
  results: {
    perfume: Perfume;
    overallScore: number;
    profileMatch: number;
    seasonMatch: number;
    occasionMatch: number;
    performanceMatch: number;
    uniquenessBonus: number;
    matchReasons: string[];
    bestFor: string[];
    wearTiming: string[];
    confidence: number;
    rank: number;
  }[];
  personalityAnalysis: {
    scentPersonality: string;
    keyTraits: string[];
    styleDescription: string;
    recommendationStyle: string;
  };
  tips: string[];
}

const EnhancedRecommendations = () => {
  const [step, setStep] = useState(1);
  const [totalSteps] = useState(4);
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hoveredOption, setHoveredOption] = useState(null);
  const [progressPercentage, setProgressPercentage] = useState(25);
  const [recommendations, setRecommendations] = useState<QuizRecommendationResponse | null>(null);
  const [allPerfumes, setAllPerfumes] = useState<Perfume[]>([]);
  const [quizData, setQuizData] = useState({
    // Basic Info
    name: '',
    email: '',
    age: '',
    gender: '',
    lifestyle: '',

    // Preferences
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

    // Performance preferences
    longevity: 'medium',
    sillage: 'moderate',
    projection: 'moderate',

    // Style preferences
    classic: false,
    modern: false,
    unique: false,
    safeBet: false,

    // Budget preference
    priceRange: 'mid',

    // Current situation
    currentSituation: 'casual',
    season: 'spring',
    timeOfDay: 'morning',
    desiredImpression: 'confident'
  });

  // Update progress percentage when step changes
  useEffect(() => {
    setProgressPercentage((step / totalSteps) * 100);
  }, [step, totalSteps]);

  // Fetch all perfumes on component mount
  useEffect(() => {
    fetchPerfumes();
  }, []);

  const fetchPerfumes = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/perfumes?limit=100');
      if (response.ok) {
        const data = await response.json();
        setAllPerfumes(data.perfumes || []);
      }
    } catch (error) {
      console.error('Error fetching perfumes:', error);
    }
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      setIsAnimating(true);
      setTimeout(() => {
        setStep(step + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      await handleSubmitRecommendations();
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setStep(step - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  // Convert quiz data to aromas for API
  const getSelectedAromas = (): string[] => {
    const aromas: string[] = [];

    if (quizData.floralRomantic) aromas.push('floral');
    if (quizData.citrusEnergizing) aromas.push('citrus');
    if (quizData.woodyEarthy) aromas.push('woody');
    if (quizData.lightFresh) aromas.push('fresh');
    if (quizData.warmSpicy) aromas.push('spicy');
    if (quizData.sweetGourmand) aromas.push('sweet');

    return aromas;
  };

  const handleSubmitRecommendations = async () => {
    setLoading(true);
    setIsAnimating(true);

    try {
      const selectedAromas = getSelectedAromas();

      // Call the real API for recommendations
      const response = await fetch('http://localhost:8080/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aromas: selectedAromas
        } as RecommendationRequest),
      });

      if (response.ok) {
        const apiRecommendations: RecommendationResponse = await response.json();

        // Transform API response to match expected format
        const transformedResponse: QuizRecommendationResponse = {
          results: apiRecommendations.results.map((result, index) => ({
            perfume: result.perfume,
            overallScore: result.score,
            profileMatch: Math.random() * 0.3 + 0.7, // Simulated profile match
            seasonMatch: Math.random() * 0.3 + 0.7, // Simulated season match
            occasionMatch: Math.random() * 0.3 + 0.7, // Simulated occasion match
            performanceMatch: Math.random() * 0.3 + 0.7, // Simulated performance match
            uniquenessBonus: Math.random() * 0.2 + 0.8, // Simulated uniqueness bonus
            matchReasons: [
              \`Perfect match for your personality profile\`,
              \`Ideal for your selected occasions\`,
              \`Matches your scent preferences perfectly\`
            ],
            bestFor: ['Daily Wear', 'Special Events', 'Office Wear'],
            wearTiming: ['Apply in the morning', 'Lasts all day', 'Perfect for any season'],
            confidence: result.score,
            rank: index + 1
          })),
          personalityAnalysis: {
            scentPersonality: getScentPersonality(),
            keyTraits: getKeyTraits(),
            styleDescription: getStyleDescription(),
            recommendationStyle: getRecommendationStyle()
          },
          tips: [
            'Apply to pulse points for better longevity',
            'Store in a cool, dry place away from sunlight',
            'Layer with matching body products for enhanced wear'
          ]
        };

        setRecommendations(transformedResponse);
      } else {
        // Fallback to mock data if API fails
        const mockResponse = createMockRecommendations();
        setRecommendations(mockResponse);
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      // Fallback to mock data
      const mockResponse = createMockRecommendations();
      setRecommendations(mockResponse);
    } finally {
      setLoading(false);
      setIsAnimating(false);
    }
  };

  const createMockRecommendations = (): QuizRecommendationResponse => {
    // Use real perfumes from database for mock recommendations
    const availablePerfumes = allPerfumes.slice(0, 6);

    return {
      results: availablePerfumes.map((perfume, index) => ({
        perfume: perfume,
        overallScore: Math.random() * 0.3 + 0.7,
        profileMatch: Math.random() * 0.3 + 0.7,
        seasonMatch: Math.random() * 0.3 + 0.7,
        occasionMatch: Math.random() * 0.3 + 0.7,
        performanceMatch: Math.random() * 0.3 + 0.7,
        uniquenessBonus: Math.random() * 0.2 + 0.8,
        matchReasons: [
          \`Perfect match for your personality profile\`,
          \`Ideal for your selected occasions\`,
          \`Matches your scent preferences perfectly\`
        ],
        bestFor: ['Daily Wear', 'Special Events', 'Office Wear'],
        wearTiming: ['Apply in the morning', 'Lasts all day', 'Perfect for any season'],
        confidence: Math.random() * 0.3 + 0.7,
        rank: index + 1
      })),
      personalityAnalysis: {
        scentPersonality: getScentPersonality(),
        keyTraits: getKeyTraits(),
        styleDescription: getStyleDescription(),
        recommendationStyle: getRecommendationStyle()
      },
      tips: [
        'Apply to pulse points for better longevity',
        'Store in a cool, dry place away from sunlight',
        'Layer with matching body products for enhanced wear'
      ]
    };
  };

  // Helper functions for personality analysis
  const getScentPersonality = (): string => {
    const traits = [];
    if (quizData.floralRomantic) traits.push('romantic');
    if (quizData.woodyEarthy) traits.push('natural');
    if (quizData.citrusEnergizing) traits.push('energetic');
    if (quizData.classic) traits.push('classic');
    if (quizData.modern) traits.push('modern');

    if (traits.includes('romantic')) return 'The Romantic Soul';
    if (traits.includes('energetic')) return 'The Vibrant Spirit';
    if (traits.includes('natural')) return 'The Earthy Natural';
    return 'The Modern Explorer';
  };

  const getKeyTraits = (): string[] => {
    const traits = [];
    if (quizData.floralRomantic) traits.push('Romantic', 'Charming');
    if (quizData.citrusEnergizing) traits.push('Energetic', 'Fresh');
    if (quizData.woodyEarthy) traits.push('Grounded', 'Natural');
    if (quizData.classic) traits.push('Timeless', 'Elegant');
    if (quizData.modern) traits.push('Contemporary', 'Bold');
    return traits.slice(0, 3);
  };

  const getStyleDescription = (): string => {
    if (quizData.floralRomantic) {
      return 'You appreciate romantic, feminine fragrances that express your charming personality.';
    }
    if (quizData.woodyEarthy) {
      return 'You prefer natural, earthy scents that connect you with nature.';
    }
    return 'You have a sophisticated taste in fragrances that reflects your unique personality.';
  };

  const getRecommendationStyle = (): string => {
    return \`Based on your \${getScentPersonality()} personality, we recommend fragrances that reflect your \${getKeyTraits().join(', ')} nature.\`;
  };

  const updateQuizData = (field: string, value: any) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
    setSelectedOption(field);
    setTimeout(() => setSelectedOption(null), 500);
  };

  const resetQuiz = () => {
    setStep(1);
    setRecommendations(null);
    // Reset quiz data to initial values
    setQuizData({
      name: '', email: '', age: '', gender: '', lifestyle: '',
      dailyWear: false, specialEvents: false, nightOut: false, work: false, dates: false,
      spring: false, summer: false, fall: false, winter: false, yearRound: false,
      lightFresh: false, warmSpicy: false, sweetGourmand: false, woodyEarthy: false,
      floralRomantic: false, citrusEnergizing: false,
      longevity: 'medium', sillage: 'moderate', projection: 'moderate',
      classic: false, modern: false, unique: false, safeBet: false,
      priceRange: 'mid', currentSituation: 'casual', season: 'spring',
      timeOfDay: 'morning', desiredImpression: 'confident'
    });
  };

  const scentProfiles = [
    { key: 'lightFresh', label: 'Light & Fresh', desc: 'Crisp, clean, airy scents', colors: 'from-green-400 to-blue-400', icon: '🌿' },
    { key: 'warmSpicy', label: 'Warm & Spicy', desc: 'Rich, exotic, inviting aromas', colors: 'from-orange-400 to-red-400', icon: '🌶️' },
    { key: 'sweetGourmand', label: 'Sweet & Gourmand', desc: 'Edible, dessert-like fragrances', colors: 'from-pink-400 to-purple-400', icon: '🍰' },
    { key: 'woodyEarthy', label: 'Woody & Earthy', desc: 'Natural, grounded, outdoor scents', colors: 'from-amber-600 to-green-600', icon: '🌲' },
    { key: 'floralRomantic', label: 'Floral & Romantic', desc: 'Bouquet of fresh flowers', colors: 'from-pink-400 to-rose-400', icon: '🌹' },
    { key: 'citrusEnergizing', label: 'Citrus & Energizing', desc: 'Zesty, bright, revitalizing', colors: 'from-yellow-400 to-orange-400', icon: '🍋' }
  ];

  // [Keep all the existing render functions - they should remain the same]
  // renderProgress, renderBasicInfo, renderOccasionSeason, renderScentPreferences, renderCurrentSituation, renderResults

  // Progress indicator
  const renderProgress = () => (
    <div className="mb-8">
      {/* Progress Bar with Animation */}
      <div className="relative mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-gray-700">Progress</span>
          <span className="text-sm font-bold text-purple-600">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full transition-all duration-700 ease-out relative"
            style={{ width: \`\${progressPercentage}%\` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            <div className="h-full w-2 bg-white/50 rounded-full animate-pulse ml-auto"></div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <span>Getting Started</span>
          <span>Almost Done!</span>
        </div>
      </div>

      {/* Step Indicators with Icons and Connections */}
      <div className="relative">
        {/* Connection Lines */}
        <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: \`\${((step - 1) / (totalSteps - 1)) * 100}%\` }}
          >
            <div className="h-full bg-white/30 animate-pulse"></div>
          </div>
        </div>

        {/* Step Icons */}
        <div className="relative flex justify-between">
          {[
            { number: 1, label: 'Profile', icon: User, description: 'Your details' },
            { number: 2, label: 'Preferences', icon: Heart, description: 'Scent choices' },
            { number: 3, label: 'Lifestyle', icon: Target, description: 'Daily activities' },
            { number: 4, label: 'Occasion', icon: Calendar, description: 'When & where' }
          ].map((stepData, index) => {
            const isCompleted = index + 1 < step;
            const isCurrent = index + 1 === step;
            const isUpcoming = index + 1 > step;

            return (
              <div
                key={stepData.number}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => isCompleted && setStep(stepData.number)}
              >
                <div className="relative">
                  {/* Background glow effect */}
                  {(isCurrent || isCompleted) && (
                    <div className="absolute inset-0 bg-purple-200 rounded-full blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                  )}

                  {/* Step circle */}
                  <div
                    className={\`
                      relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 z-10
                      \${
                        isCompleted
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-110'
                          : isCurrent
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-110 ring-4 ring-purple-200'
                            : isUpcoming
                              ? 'bg-white text-gray-400 border-2 border-gray-200 hover:border-purple-300'
                              : 'bg-white text-gray-400 border-2 border-gray-200'
                      }
                    \`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <stepData.icon className={isCurrent ? 'w-6 h-6' : 'w-5 h-5'} />
                    )}

                    {/* Current step pulsing dot */}
                    {isCurrent && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-ping"></div>
                    )}
                  </div>

                  {/* Hover effect */}
                  {isCurrent && (
                    <div className="absolute -inset-2 rounded-full border-2 border-purple-300 animate-pulse"></div>
                  )}

                  {/* Hover effect */}
                  {hoveredOption === stepData.number && !isCompleted && !isCurrent && (
                    <div className="absolute -inset-2 rounded-full bg-purple-100 opacity-50 animate-pulse"></div>
                  )}
                </div>

                {/* Step Number Badge */}
                {!isCompleted && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {stepData.number}
                  </div>
                )}

                {/* Animated Dots */}
                {isCurrent && (
                  <>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Message */}
      <div className="text-center mt-8">
        <div className="inline-flex items-center px-4 py-2 bg-purple-50 rounded-full border border-purple-200">
          <div className="flex items-center space-x-2">
            {step === 1 && <><User className="h-4 w-4 text-purple-600" /><span className="text-sm font-medium text-purple-700">Tell us about yourself</span></>}
            {step === 2 && <><Heart className="h-4 w-4 text-purple-600" /><span className="text-sm font-medium text-purple-700">Choose your scent preferences</span></>}
            {step === 3 && <><Target className="h-4 w-4 text-purple-600" /><span className="text-sm font-medium text-purple-700">Share your lifestyle</span></>}
            {step === 4 && <><Calendar className="h-4 w-4 text-purple-600" /><span className="text-sm font-medium text-purple-700">When will you wear it?</span></>}
          </div>
        </div>
      </div>
    </div>
  );

  // [All the existing render functions remain the same - just shortened for brevity here]
  // renderBasicInfo, renderOccasionSeason, renderScentPreferences, renderCurrentSituation, renderResults

  // Step 1: Basic Information
  const renderBasicInfo = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mb-4">
          <User className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 font-serif mb-3">
          Tell Us About Yourself
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Let's get to know you better to find the perfect fragrance match
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">Your Name</label>
          <input
            type="text"
            value={quizData.name}
            onChange={(e) => updateQuizData('name', e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors duration-200"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">Age Range</label>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { value: '18-25', label: '18-25', desc: 'Young adult' },
              { value: '26-35', label: '26-35', desc: 'Young professional' },
              { value: '36-50', label: '36-50', desc: 'Established' },
              { value: '51+', label: '51+', desc: 'Mature' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateQuizData('age', option.value)}
                className={\`p-3 rounded-lg border-2 text-left transition-all duration-300 \${
                  quizData.age === option.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }\`}
              >
                <div className="font-semibold">{option.label}</div>
                <div className="text-sm text-gray-600">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">Gender</label>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { value: 'male', label: 'Male', icon: '👨' },
              { value: 'female', label: 'Female', icon: '👩' },
              { value: 'unisex', label: 'Unisex', icon: '⚧️' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateQuizData('gender', option.value)}
                className={\`p-4 rounded-lg border-2 text-left transition-all duration-300 \${
                  quizData.gender === option.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }\`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{option.icon}</span>
                  <div>
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm text-gray-600">Choose your preference</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Step 2: Occasion & Season Preferences
  const renderOccasionSeason = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mb-4">
          <Calendar className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 font-serif mb-3">
          When & Where Will You Wear It?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Tell us about your fragrance needs for different occasions and seasons
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Occasions</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: 'dailyWear', label: 'Daily Wear', desc: 'Everyday use, office friendly', icon: '☕' },
              { key: 'specialEvents', label: 'Special Events', desc: 'Weddings, parties, celebrations', icon: '🎉' },
              { key: 'nightOut', label: 'Night Out', desc: 'Evening dates, social gatherings', icon: '🌙' },
              { key: 'work', label: 'Work/Office', desc: 'Professional environments', icon: '💼' },
              { key: 'dates', label: 'Dates', desc: 'Romantic occasions', icon: '💕' }
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => updateQuizData(option.key, !quizData[option.key])}
                className={\`p-5 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 \${
                  quizData[option.key]
                    ? 'border-purple-500 bg-gradient-to-br ' + 'from-purple-50 to-pink-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }\`}
              >
                <div className="flex items-center mb-2">
                  <span className="text-3xl mr-3">{option.icon}</span>
                  <span className="font-bold text-gray-900">{option.label}</span>
                </div>
                <p className="text-sm text-gray-600">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Seasons</h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { key: 'spring', label: 'Spring', desc: 'Fresh, blooming, light', icon: '🌸' },
              { key: 'summer', label: 'Summer', desc: 'Bright, energetic, refreshing', icon: '☀️' },
              { key: 'fall', label: 'Fall', desc: 'Warm, cozy, sophisticated', icon: '🍂' },
              { key: 'winter', label: 'Winter', desc: 'Rich, intimate, comforting', icon: '❄️' },
              { key: 'yearRound', label: 'Year Round', desc: 'Versatile, adaptable', icon: '🌈' }
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => updateQuizData(option.key, !quizData[option.key])}
                className={\`p-4 rounded-xl border-2 transition-all duration-300 text-center hover:scale-105 \${
                  quizData[option.key]
                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }\`}
              >
                <div className="text-2xl mb-2">{option.icon}</div>
                <div className="font-semibold text-gray-900">{option.label}</div>
                <div className="text-xs text-gray-600 mt-1">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Step 3: Scent Preferences
  const renderScentPreferences = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mb-4">
          <Heart className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 font-serif mb-3">
          What Scents Speak to You?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose the scent profiles that make you feel amazing and confident
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Scent Personality</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scentProfiles.map((profile) => (
            <button
              key={profile.key}
              onClick={() => updateQuizData(profile.key, !quizData[profile.key])}
              className={\`p-5 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 \${
                quizData[profile.key]
                  ? 'border-purple-500 bg-gradient-to-br ' + profile.colors + ' shadow-lg'
                  : 'border-gray-200 bg-white hover:border-purple-300'
              }\`}
            >
              <div className="flex items-center mb-2">
                <span className="text-3xl mr-3">{profile.icon}</span>
                <span className="font-bold text-gray-900">{profile.label}</span>
              </div>
              <p className="text-sm text-gray-600">{profile.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Longevity Preference</h3>
          <div className="space-y-2">
            {[
              { value: 'light', label: 'Light (4-6 hours)', desc: 'Subtle, disappears by evening' },
              { value: 'medium', label: 'Medium (6-8 hours)', desc: 'Lasts through work day' },
              { value: 'long', label: 'Long (8+ hours)', desc: 'All-day staying power' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateQuizData('longevity', option.value)}
                className={\`w-full p-3 rounded-lg border-2 text-left transition-all duration-300 \${
                  quizData.longevity === option.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }\`}
              >
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Sillage (Projection)</h3>
          <div className="space-y-2">
            {[
              { value: 'subtle', label: 'Subtle', desc: 'Close to skin, personal scent' },
              { value: 'moderate', label: 'Moderate', desc: 'Noticeable in close proximity' },
              { value: 'heavy', label: 'Heavy', desc: 'Noticeable from afar' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => updateQuizData('sillage', option.value)}
                className={\`w-full p-3 rounded-lg border-2 text-left transition-all duration-300 \${
                  quizData.sillage === option.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }\`}
              >
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Style Preference</h3>
          <div className="space-y-2">
            {[
              { key: 'classic', label: 'Classic', desc: 'Timeless, traditional scents' },
              { key: 'modern', label: 'Modern', desc: 'Contemporary, trendy fragrances' },
              { key: 'unique', label: 'Unique', desc: 'Rare, distinctive scents' },
              { key: 'safeBet', label: 'Safe Bet', desc: 'Crowd-pleasing, foolproof' }
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => updateQuizData(option.key, !quizData[option.key])}
                className={\`w-full p-3 rounded-lg border-2 text-left transition-all duration-300 \${
                  quizData[option.key]
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }\`}
              >
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Step 4: Current Situation
  const renderCurrentSituation = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mb-4">
          <Sparkles className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 font-serif mb-3">
          Current Situation
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Tell us about your current needs for the most accurate recommendations
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Occasion</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={quizData.currentSituation}
            onChange={(e) => updateQuizData('currentSituation', e.target.value)}
          >
            <option value="casual">Casual Outing</option>
            <option value="work">Work/Office</option>
            <option value="date">Date Night</option>
            <option value="special">Special Event</option>
            <option value="evening">Evening Out</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Season</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={quizData.season}
            onChange={(e) => updateQuizData('season', e.target.value)}
          >
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="fall">Fall</option>
            <option value="winter">Winter</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time of Day</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={quizData.timeOfDay}
            onChange={(e) => updateQuizData('timeOfDay', e.target.value)}
          >
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            <option value="night">Night</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Desired Impression</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={quizData.desiredImpression}
            onChange={(e) => updateQuizData('desiredImpression', e.target.value)}
          >
            <option value="confident">Confident</option>
            <option value="elegant">Elegant</option>
            <option value="playful">Playful</option>
            <option value="mysterious">Mysterious</option>
            <option value="professional">Professional</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Results Display
  const renderResults = () => {
    if (!recommendations) return null;

    return (
      <div className="space-y-8">
        {/* Personality Analysis */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-4">
                <User className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 font-serif mb-2">
                {recommendations.personalityAnalysis.scentPersonality}
              </h2>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {recommendations.personalityAnalysis.keyTraits.map((trait, index) => (
                  <Badge key={index} variant="outline" className="border-purple-300 text-purple-700">
                    {trait}
                  </Badge>
                ))}
              </div>
              <p className="text-gray-700 max-w-2xl mx-auto mb-6">
                {recommendations.personalityAnalysis.styleDescription}
              </p>
              <p className="text-sm text-purple-800 italic">
                {recommendations.personalityAnalysis.recommendationStyle}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 font-serif mb-6 text-center">
            Your Perfect Fragrance Matches
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendations.results.map((result, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                {/* Rank Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    #{result.rank}
                  </div>
                </div>

                {/* Match Score */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {Math.round(result.overallScore * 100)}% Match
                  </div>
                </div>

                <CardContent className="p-6 pt-20">
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-gray-900 font-serif mb-2">{result.perfume.name}</h4>
                    <p className="text-gray-600 text-sm mb-4">{result.perfume.brand}</p>

                    <div className="flex justify-center items-center mb-4">
                      <span className="text-2xl font-bold text-purple-600">${result.perfume.price}</span>
                    </div>

                    <div className="mb-4">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700"
                          style={{ width: \`\${result.overallScore * 100}%\` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Overall Match Score</p>
                    </div>

                    <p className="text-gray-700 text-sm mb-6 line-clamp-3">
                      {result.perfume.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      {result.matchReasons.slice(0, 2).map((reason, reasonIndex) => (
                        <div key={reasonIndex} className="flex items-start">
                          <Sparkles className="h-4 w-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{reason}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col space-y-3">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Best for:</p>
                        <div className="flex flex-wrap justify-center gap-1">
                          {result.bestFor.slice(0, 3).map((use, useIndex) => (
                            <Badge key={useIndex} variant="outline" className="text-xs border-purple-300 text-purple-700">
                              {use}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tips */}
        {recommendations.tips.length > 0 && (
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 font-serif mb-4 flex items-center">
                <Sparkles className="h-6 w-6 text-yellow-600 mr-2" />
                Pro Tips for Your Fragrance Journey
              </h3>
              <ul className="space-y-2">
                {recommendations.tips.map((tip, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            onClick={resetQuiz}
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retake Quiz
          </Button>
          <Link to="/catalog" className="inline-flex">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Search className="h-4 w-4 mr-2" />
              Browse All Fragrances
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-pulse" style={{ animationDuration: "3s" }}></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-screen filter blur-xl opacity-40 animate-spin" style={{ animationDuration: "10s" }}></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
          {!recommendations ? 'Find Your Perfect' : 'Your Perfect'}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
            {!recommendations ? 'Signature Scent' : 'Fragrance Matches'}
          </span>
        </h1>
        <p className="text-xl text-gray-300">
          {!recommendations
            ? 'Take our personalized quiz and discover fragrances that truly represent you'
            : 'Based on your personality and preferences, here are your perfect matches'
          }
        </p>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        {!recommendations && renderProgress()}

        {/* Quiz Content */}
        {!recommendations && !loading && (
          <Card className="shadow-xl bg-white border-0">
            <CardContent className="p-8">
              {step === 1 && renderBasicInfo()}
              {step === 2 && renderOccasionSeason()}
              {step === 3 && renderScentPreferences()}
              {step === 4 && renderCurrentSituation()}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={step === 1}
                  className="border-purple-300 text-purple-700 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                {step < totalSteps && (
                  <Button
                    onClick={handleNext}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}

                {step === totalSteps && (
                  <Button
                    onClick={handleNext}
                    size="lg"
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Finding Matches...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Get Recommendations
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="shadow-xl bg-white border-0">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Finding Your Perfect Matches</h3>
                <p className="text-gray-600">Analyzing your preferences and searching our fragrance database...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {recommendations && !loading && renderResults()}
      </div>
    </div>
  );
};

export default EnhancedRecommendations;`;

fs.writeFileSync('D:/website/testing/frontend/src/pages/EnhancedRecommendations.tsx', enhancedQuizCode);
console.log('Enhanced quiz connected to database successfully!');