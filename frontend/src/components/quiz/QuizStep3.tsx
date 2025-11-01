import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { QuizData } from '@/hooks/useQuiz';

interface QuizStep3Props {
  data: QuizData;
  updateData: (field: keyof QuizData, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const QuizStep3: React.FC<QuizStep3Props> = ({ data, updateData, onNext, onPrevious }) => {
  const scentProfiles = [
    {
      key: 'lightFresh',
      label: 'Light & Fresh',
      icon: '🌤️',
      description: 'Citrus, green, aquatic notes',
      colors: 'from-green-100 to-blue-100 border-green-300'
    },
    {
      key: 'warmSpicy',
      label: 'Warm & Spicy',
      icon: '🔥',
      description: 'Spices, woods, amber notes',
      colors: 'from-orange-100 to-red-100 border-orange-300'
    },
    {
      key: 'sweetGourmand',
      label: 'Sweet & Gourmand',
      icon: '🍰',
      description: 'Vanilla, chocolate, dessert notes',
      colors: 'from-pink-100 to-purple-100 border-pink-300'
    },
    {
      key: 'woodyEarthy',
      label: 'Woody & Earthy',
      icon: '🌳',
      description: 'Sandalwood, cedar, vetiver notes',
      colors: 'from-amber-100 to-yellow-100 border-amber-300'
    },
    {
      key: 'floralRomantic',
      label: 'Floral & Romantic',
      icon: '🌸',
      description: 'Rose, jasmine, peony notes',
      colors: 'from-rose-100 to-pink-100 border-rose-300'
    },
    {
      key: 'citrusEnergizing',
      label: 'Citrus & Energizing',
      icon: '🍊',
      description: 'Lemon, bergamot, grapefruit notes',
      colors: 'from-yellow-100 to-lime-100 border-yellow-300'
    }
  ];

  const longevityOptions = [
    { value: 'light', label: 'Light (4-6 hours)', desc: 'Subtle, disappears by evening' },
    { value: 'medium', label: 'Medium (6-8 hours)', desc: 'Lasts through work day' },
    { value: 'long', label: 'Long (8+ hours)', desc: 'All-day staying power' }
  ];

  const sillageOptions = [
    { value: 'subtle', label: 'Subtle', desc: 'Close to skin, personal scent' },
    { value: 'moderate', label: 'Moderate', desc: 'Noticeable in close proximity' },
    { value: 'heavy', label: 'Heavy', desc: 'Noticeable from afar' }
  ];

  const styleOptions = [
    { key: 'classic', label: 'Classic', desc: 'Timeless, traditional scents' },
    { key: 'modern', label: 'Modern', desc: 'Contemporary, trendy fragrances' },
    { key: 'unique', label: 'Unique', desc: 'Rare, distinctive scents' },
    { key: 'safeBet', label: 'Safe Bet', desc: 'Crowd-pleasing, foolproof' }
  ];

  return (
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
              onClick={() => updateData(profile.key as keyof QuizData, !data[profile.key as keyof QuizData])}
              className={`p-5 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                data[profile.key as keyof QuizData]
                  ? 'border-purple-500 bg-gradient-to-br ' + profile.colors + ' shadow-lg'
                  : 'border-gray-200 bg-white hover:border-purple-300'
              }`}
            >
              <div className="flex items-center mb-2">
                <span className="text-3xl mr-3">{profile.icon}</span>
                <span className="font-bold text-gray-900">{profile.label}</span>
              </div>
              <p className="text-sm text-gray-600">{profile.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Longevity Preference</h3>
          <div className="space-y-2">
            {longevityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateData('longevity', option.value)}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-300 ${
                  data.longevity === option.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
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
            {sillageOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateData('sillage', option.value)}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-300 ${
                  data.sillage === option.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
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
            {styleOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => updateData(option.key as keyof QuizData, !data[option.key as keyof QuizData])}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-300 ${
                  data[option.key as keyof QuizData]
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600">{option.desc}</div>
              </button>
            ))}
          </div>
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

export default QuizStep3;