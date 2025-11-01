import React from 'react';
import { useQuiz } from '../hooks/useQuiz';
import { Card, CardContent } from '../components/ui/Card';
import {
  QuizProgress,
  QuizResults,
  QuizLoading
} from '../components/quiz';
import SimpleQuizStep1 from '../components/quiz/SimpleQuizStep1';
import SimpleQuizStep2 from '../components/quiz/SimpleQuizStep2';
import SimpleQuizStep3 from '../components/quiz/SimpleQuizStep3';
import QuizTips from '../components/quiz/QuizTips';

const EnhancedRecommendations: React.FC = () => {
  const {
    step,
    loading,
    recommendations,
    apiError,
    quizData,
    progressPercentage,
    totalSteps,
    updateQuizData,
    nextStep,
    previousStep,
    resetQuiz,
    submitQuiz,
    clearError,
  } = useQuiz();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-8">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <QuizLoading />
          </div>
        </div>
      </div>
    );
  }

  // Show results
  if (recommendations) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-8">
          {/* Header */}
          <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-30"></div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-screen filter blur-2xl opacity-30 animate-bounce"></div>
              <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-pulse"></div>
              <div className="absolute bottom-10 left-1/4 w-24 h-24 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-bounce" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mix-blend-screen filter blur-lg opacity-35 animate-spin" style={{ animationDuration: "7s", animationDirection: "reverse" }}></div>
            </div>

            <div className="relative max-w-4xl mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
                Your Perfect
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                  Fragrance Matches
                </span>
              </h1>
              <p className="text-xl text-gray-300">
                Based on your personality and preferences, here are your perfect matches
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-6xl mx-auto px-4 py-8">
            <QuizResults
              recommendations={recommendations}
              apiError={apiError}
              onReset={resetQuiz}
              onRetry={() => {
                clearError();
                submitQuiz();
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show quiz form
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-30"></div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-screen filter blur-2xl opacity-30 animate-bounce"></div>
            <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-pulse"></div>
            <div className="absolute bottom-10 left-1/4 w-24 h-24 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-bounce" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mix-blend-screen filter blur-lg opacity-35 animate-spin" style={{ animationDuration: "7s", animationDirection: "reverse" }}></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Signature Scent
              </span>
            </h1>
            <p className="text-xl text-gray-300">
              Just 3 simple steps to discover your perfect fragrance match
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Progress Indicator */}
          <QuizProgress
            currentStep={step}
            totalSteps={totalSteps}
            progressPercentage={progressPercentage}
          />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Quiz Content */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl bg-white border-0">
                <CardContent className="p-8">
                  {step === 1 && (
                    <SimpleQuizStep1
                      data={quizData}
                      updateData={updateQuizData}
                      onNext={nextStep}
                    />
                  )}
                  {step === 2 && (
                    <SimpleQuizStep2
                      data={quizData}
                      updateData={updateQuizData}
                      onNext={nextStep}
                      onPrevious={previousStep}
                    />
                  )}
                  {step === 3 && (
                    <SimpleQuizStep3
                      data={quizData}
                      updateData={updateQuizData}
                      onPrevious={previousStep}
                      onSubmit={submitQuiz}
                      isLoading={loading}
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Tips */}
            <div className="lg:col-span-1">
              <QuizTips />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedRecommendations;