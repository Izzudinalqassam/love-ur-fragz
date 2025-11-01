import React from 'react';
import { Calendar, MapPin, Sun } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { QuizData } from '@/hooks/useQuiz';

interface SimpleQuizStep2Props {
  data: QuizData;
  updateData: (field: keyof QuizData, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const SimpleQuizStep2: React.FC<SimpleQuizStep2Props> = ({ data, updateData, onNext, onPrevious }) => {
  const occasionOptions = [
    {
      value: 'daily_wear',
      label: 'Daily Wear',
      icon: '☕',
      desc: 'Everyday activities',
      color: 'from-gray-100 to-gray-200'
    },
    {
      value: 'work_office',
      label: 'Work/Office',
      icon: '💼',
      desc: 'Professional environment',
      color: 'from-blue-100 to-blue-200'
    },
    {
      value: 'special_events',
      label: 'Special Events',
      icon: '🎉',
      desc: 'Weddings, parties, celebrations',
      color: 'from-purple-100 to-purple-200'
    },
    {
      value: 'date_night',
      label: 'Date Night',
      icon: '💕',
      desc: 'Romantic evenings',
      color: 'from-pink-100 to-pink-200'
    },
    {
      value: 'night_out',
      label: 'Night Out',
      icon: '🌃',
      desc: 'Evenings with friends',
      color: 'from-indigo-100 to-indigo-200'
    }
  ];

  const seasonOptions = [
    {
      value: 'spring_summer',
      label: 'Spring/Summer',
      icon: '🌸☀️',
      desc: 'Warm weather, bright days',
      color: 'from-yellow-100 to-orange-100'
    },
    {
      value: 'fall_winter',
      label: 'Fall/Winter',
      icon: '🍂❄️',
      desc: 'Cool weather, cozy moments',
      color: 'from-amber-100 to-orange-100'
    },
    {
      value: 'year_round',
      label: 'Year Round',
      icon: '🌍',
      desc: 'Versatile for any season',
      color: 'from-green-100 to-teal-100'
    }
  ];

  const selectedOccasions = data.occasions || [];
  const selectedSeasons = data.seasons || [];

  const toggleOccasion = (value: string) => {
    const current = data.occasions || [];
    if (current.includes(value)) {
      updateData('occasions', current.filter((v: string) => v !== value));
    } else {
      updateData('occasions', [...current, value]);
    }
  };

  const toggleSeason = (value: string) => {
    // For seasons, we want single selection but allow 2 maximum
    const current = data.seasons || [];
    if (current.includes(value)) {
      updateData('seasons', current.filter((v: string) => v !== value));
    } else {
      updateData('seasons', [...current, value]);
    }
  };

  const isValid = selectedOccasions.length >= 2 && selectedSeasons.length >= 1;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-4">
          <Calendar className="h-10 w-10 text-blue-600" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 font-serif mb-3">
          When & Where You'll Wear It
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Tell us about your lifestyle and preferences
        </p>
      </div>

      <div className="space-y-8">
        {/* Occasion Selection */}
        <div>
          <label className="block text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-600" />
            Where Will You Use It?
            <span className="text-base font-normal text-gray-500 ml-2">
              (Choose 2+ occasions)
            </span>
          </label>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {occasionOptions.map((occasion) => {
              const isSelected = selectedOccasions.includes(occasion.value);

              return (
                <button
                  key={occasion.value}
                  onClick={() => toggleOccasion(occasion.value)}
                  className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-105 ${
                    isSelected
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg scale-105'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${occasion.color}`}>
                      <span className="text-3xl">{occasion.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">{occasion.label}</div>
                      <div className="text-sm text-gray-600">{occasion.desc}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <span className={`text-sm font-medium ${
              selectedOccasions.length >= 2 ? 'text-green-600' : 'text-gray-500'
            }`}>
              {selectedOccasions.length} of 2+ selected
            </span>
          </div>
        </div>

        {/* Season Selection */}
        <div>
          <label className="block text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sun className="h-6 w-6 text-orange-600" />
            Season Preference
            <span className="text-base font-normal text-gray-500 ml-2">
              (Choose 1-2 seasons)
            </span>
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            {seasonOptions.map((season) => {
              const isSelected = selectedSeasons.includes(season.value);
              const isDisabled = !isSelected && selectedSeasons.length >= 2;

              return (
                <button
                  key={season.value}
                  onClick={() => !isDisabled && toggleSeason(season.value)}
                  disabled={isDisabled}
                  className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-105 ${
                    isSelected
                      ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-lg scale-105'
                      : isDisabled
                      ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${season.color}`}>
                      <span className="text-3xl">{season.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">{season.label}</div>
                      <div className="text-sm text-gray-600">{season.desc}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <span className={`text-sm font-medium ${
              selectedSeasons.length >= 1 && selectedSeasons.length <= 2
                ? 'text-green-600'
                : selectedSeasons.length > 2
                ? 'text-red-600'
                : 'text-gray-500'
            }`}>
              {selectedSeasons.length} of 1-2 selected
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <Button
          onClick={onPrevious}
          variant="outline"
          size="lg"
          className="font-semibold px-6 py-3"
        >
          ← Previous
        </Button>
        <div className="text-sm text-gray-500">
          Step 2 of 3
        </div>
        <Button
          onClick={onNext}
          size="lg"
          disabled={!isValid}
          className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg ${
            !isValid ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Next Step →
        </Button>
      </div>
    </div>
  );
};

export default SimpleQuizStep2;