import React from 'react';
import { Calendar, Briefcase, Sun } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { QuizData } from '@/hooks/useQuiz';

interface QuizStep2Props {
  data: QuizData;
  updateData: (field: keyof QuizData, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const QuizStep2: React.FC<QuizStep2Props> = ({ data, updateData, onNext, onPrevious }) => {
  const occasionOptions = [
    { key: 'dailyWear', label: 'Daily Wear', icon: '☕' },
    { key: 'specialEvents', label: 'Special Events', icon: '🎉' },
    { key: 'nightOut', label: 'Night Out', icon: '🌃' },
    { key: 'work', label: 'Work/Office', icon: '💼' },
    { key: 'dates', label: 'Dates', icon: '💕' }
  ];

  const seasonOptions = [
    { key: 'spring', label: 'Spring', icon: '🌸', colors: 'from-green-50 to-pink-50 border-green-200' },
    { key: 'summer', label: 'Summer', icon: '☀️', colors: 'from-yellow-50 to-orange-50 border-yellow-200' },
    { key: 'fall', label: 'Fall', icon: '🍂', colors: 'from-orange-50 to-red-50 border-orange-200' },
    { key: 'winter', label: 'Winter', icon: '❄️', colors: 'from-blue-50 to-purple-50 border-blue-200' },
    { key: 'yearRound', label: 'Year Round', icon: '🌍', colors: 'from-purple-50 to-gray-50 border-purple-200' }
  ];

  return (
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

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Briefcase className="h-5 w-5 mr-2 text-purple-600" />
          Occasion Preferences
        </h3>
        <p className="text-sm text-gray-600 mb-4">Select all occasions where you'll wear fragrance</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {occasionOptions.map((occasion) => (
            <button
              key={occasion.key}
              onClick={() => updateData(occasion.key as keyof QuizData, !data[occasion.key as keyof QuizData])}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left hover:scale-105 ${
                data[occasion.key as keyof QuizData]
                  ? 'border-purple-500 bg-purple-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-purple-300'
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-2">{occasion.icon}</span>
                <span className="font-medium text-gray-900">{occasion.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Sun className="h-5 w-5 mr-2 text-purple-600" />
          Seasonal Preferences
        </h3>
        <p className="text-sm text-gray-600 mb-4">Which seasons do you prefer certain fragrances for?</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {seasonOptions.map((season) => (
            <button
              key={season.key}
              onClick={() => updateData(season.key as keyof QuizData, !data[season.key as keyof QuizData])}
              className={`p-4 rounded-lg border-2 transition-all duration-300 text-left hover:scale-105 ${
                data[season.key as keyof QuizData]
                  ? `border-purple-500 bg-purple-50 shadow-md`
                  : `border-gray-200 bg-white hover:border-purple-300`
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-2">{season.icon}</span>
                <span className="font-medium text-gray-900">{season.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button
          onClick={onPrevious}
          variant="outline"
          size="lg"
          className="font-semibold"
        >
          Previous
        </Button>
        <Button
          onClick={onNext}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default QuizStep2;