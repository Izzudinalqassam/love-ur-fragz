import React from 'react';
import { User, Heart, Target, Calendar } from 'lucide-react';

interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
  progressPercentage: number;
}

const QuizProgress: React.FC<QuizProgressProps> = ({
  currentStep,
  totalSteps,
  progressPercentage
}) => {
  const steps = [
    { number: 1, label: 'Profile', icon: User, description: 'Your details' },
    { number: 2, label: 'Preferences', icon: Heart, description: 'Scent choices' },
    { number: 3, label: 'Lifestyle', icon: Target, description: 'Daily activities' },
    { number: 4, label: 'Occasion', icon: Calendar, description: 'When & where' }
  ];

  return (
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
            style={{ width: `${progressPercentage}%` }}
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
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          >
            <div className="h-full bg-white/30 animate-pulse"></div>
          </div>
        </div>

        {/* Step Icons */}
        <div className="relative flex justify-between">
          {steps.map((stepData, index) => {
            const isCompleted = index + 1 < currentStep;
            const isCurrent = index + 1 === currentStep;
            const isUpcoming = index + 1 > currentStep;
            const Icon = stepData.icon;

            return (
              <div key={index} className="flex flex-col items-center z-10">
                <div className="relative">
                  {/* Step Circle */}
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 transform ${
                      isCompleted
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white scale-110 shadow-xl'
                        : isCurrent
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-125 shadow-2xl animate-pulse'
                          : isUpcoming
                            ? 'bg-gray-100 text-gray-400 hover:scale-110'
                            : 'bg-white text-gray-300'
                    }`}
                  >
                    <Icon className={`h-7 w-7 ${
                      isCompleted ? 'animate-bounce' : isCurrent ? 'animate-pulse' : ''
                    }`} />

                    {/* Completion Checkmark */}
                    {isCompleted && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Current Step Pulse Ring */}
                    {isCurrent && (
                      <div className="absolute -inset-2 rounded-full border-2 border-purple-300 animate-ping"></div>
                    )}
                  </div>

                  {/* Step Number Badge */}
                  {!isCompleted && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {stepData.number}
                    </div>
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-4 text-center">
                  <div className={`text-sm font-semibold transition-all duration-300 ${
                    isCompleted
                      ? 'text-green-600'
                      : isCurrent
                        ? 'text-purple-600 animate-pulse'
                        : isUpcoming
                          ? 'text-gray-500 hover:text-gray-700'
                          : 'text-gray-400'
                  }`}>
                    {stepData.label}
                  </div>
                  <div className={`text-xs transition-all duration-300 ${
                    isCurrent ? 'text-purple-500 font-medium' : 'text-gray-500'
                  }`}>
                    {stepData.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizProgress;