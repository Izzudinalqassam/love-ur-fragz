import React from 'react';
import { User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { QuizData } from '@/hooks/useQuiz';

interface SimpleQuizStep1Props {
  data: QuizData;
  updateData: (field: keyof QuizData, value: any) => void;
  onNext: () => void;
}

const SimpleQuizStep1: React.FC<SimpleQuizStep1Props> = ({ data, updateData, onNext }) => {
  const genderOptions = [
    { value: 'male', label: 'Male', icon: '👨', desc: 'Masculine scents' },
    { value: 'female', label: 'Female', icon: '👩', desc: 'Feminine scents' },
    { value: 'unisex', label: 'Unisex', icon: '⚧️', desc: 'Versatile scents' }
  ];

  const scentPersonalities = [
    {
      value: 'light_fresh',
      label: 'Light & Fresh',
      icon: '🌤️',
      desc: 'Citrus, green, aquatic notes',
      color: 'from-sky-100 to-blue-100'
    },
    {
      value: 'warm_spicy',
      label: 'Warm & Spicy',
      icon: '🔥',
      desc: 'Spices, woods, amber notes',
      color: 'from-orange-100 to-red-100'
    },
    {
      value: 'sweet_gourmand',
      label: 'Sweet & Gourmand',
      icon: '🍰',
      desc: 'Vanilla, chocolate, dessert notes',
      color: 'from-pink-100 to-purple-100'
    },
    {
      value: 'woody_earthy',
      label: 'Woody & Earthy',
      icon: '🌳',
      desc: 'Sandalwood, cedar, vetiver notes',
      color: 'from-green-100 to-emerald-100'
    },
    {
      value: 'floral_romantic',
      label: 'Floral & Romantic',
      icon: '🌸',
      desc: 'Rose, jasmine, peony notes',
      color: 'from-rose-100 to-pink-100'
    },
    {
      value: 'citrus_energizing',
      label: 'Citrus & Energizing',
      icon: '🍊',
      desc: 'Lemon, bergamot, grapefruit notes',
      color: 'from-yellow-100 to-orange-100'
    }
  ];

  const selectedScentPersonalities = data.scentPersonalities || [];

  const toggleScentPersonality = (value: string) => {
    const current = data.scentPersonalities || [];
    if (current.includes(value)) {
      updateData('scentPersonalities', current.filter((v: string) => v !== value));
    } else {
      updateData('scentPersonalities', [...current, value]);
    }
  };

  const isValid = data.gender && selectedScentPersonalities.length >= 2 && selectedScentPersonalities.length <= 3;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mb-4">
          <Sparkles className="h-10 w-10 text-purple-600" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 font-serif mb-3">
          Find Your Signature Scent
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Let's discover your perfect fragrance personality
        </p>
      </div>

      <div className="space-y-8">
        {/* Gender Selection */}
        <div>
          <label className="block text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-6 w-6 text-purple-600" />
            Your Preference
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            {genderOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateData('gender', option.value)}
                className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-105 ${
                  data.gender === option.value
                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-4xl mr-4">{option.icon}</span>
                  <div>
                    <div className="font-bold text-lg">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Scent Personality Selection */}
        <div>
          <label className="block text-xl font-bold text-gray-900 mb-4">
            Your Scent Personality
            <span className="text-base font-normal text-gray-500 ml-2">
              (Choose 2-3 favorites)
            </span>
          </label>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scentPersonalities.map((personality) => {
              const isSelected = selectedScentPersonalities.includes(personality.value);
              const isDisabled = !isSelected && selectedScentPersonalities.length >= 3;

              return (
                <button
                  key={personality.value}
                  onClick={() => !isDisabled && toggleScentPersonality(personality.value)}
                  disabled={isDisabled}
                  className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-105 ${
                    isSelected
                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg scale-105'
                      : isDisabled
                      ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${personality.color}`}>
                      <span className="text-3xl">{personality.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">{personality.label}</div>
                      <div className="text-sm text-gray-600">{personality.desc}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            <span className={`text-sm font-medium ${
              selectedScentPersonalities.length >= 2 && selectedScentPersonalities.length <= 3
                ? 'text-green-600'
                : selectedScentPersonalities.length > 3
                ? 'text-red-600'
                : 'text-gray-500'
            }`}>
              {selectedScentPersonalities.length} of 2-3 selected
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <div className="text-sm text-gray-500">
          Step 1 of 3
        </div>
        <Button
          onClick={onNext}
          size="lg"
          disabled={!isValid}
          className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 text-lg ${
            !isValid ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Next Step →
        </Button>
      </div>
    </div>
  );
};

export default SimpleQuizStep1;