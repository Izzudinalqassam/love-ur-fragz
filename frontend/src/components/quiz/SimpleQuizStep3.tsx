import React from 'react';
import { Clock, Sparkles, Target } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { QuizData } from '@/hooks/useQuiz';

interface SimpleQuizStep3Props {
  data: QuizData;
  updateData: (field: keyof QuizData, value: any) => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const SimpleQuizStep3: React.FC<SimpleQuizStep3Props> = ({
  data,
  updateData,
  onPrevious,
  onSubmit,
  isLoading = false
}) => {
  const longevityOptions = [
    {
      value: 'light',
      label: 'Light',
      duration: '4-6 hours',
      icon: '🌅',
      desc: 'Perfect for daytime wear',
      color: 'from-yellow-100 to-orange-100'
    },
    {
      value: 'medium',
      label: 'Medium',
      duration: '6-8 hours',
      icon: '⏰',
      desc: 'Balanced for all-day use',
      color: 'from-blue-100 to-purple-100'
    },
    {
      value: 'long',
      label: 'Long',
      duration: '8+ hours',
      icon: '🌙',
      desc: 'Lasts through the night',
      color: 'from-purple-100 to-pink-100'
    }
  ];

  const impressionOptions = [
    {
      value: 'confident',
      label: 'Confident',
      icon: '🦁',
      desc: 'Bold, powerful, self-assured',
      color: 'from-red-100 to-orange-100'
    },
    {
      value: 'elegant',
      label: 'Elegant',
      icon: '👑',
      desc: 'Sophisticated, refined, graceful',
      color: 'from-purple-100 to-pink-100'
    },
    {
      value: 'playful',
      label: 'Playful',
      icon: '🎈',
      desc: 'Fun, energetic, cheerful',
      color: 'from-yellow-100 to-green-100'
    },
    {
      value: 'mysterious',
      label: 'Mysterious',
      icon: '🌑',
      desc: 'Intriguing, enigmatic, deep',
      color: 'from-indigo-100 to-purple-100'
    },
    {
      value: 'professional',
      label: 'Professional',
      icon: '🎯',
      desc: 'Respectable, competent, reliable',
      color: 'from-gray-100 to-blue-100'
    },
    {
      value: 'romantic',
      label: 'Romantic',
      icon: '💝',
      desc: 'Charming, loving, passionate',
      color: 'from-pink-100 to-red-100'
    }
  ];

  const isValid = data.longevity && data.impression;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-full mb-4">
          <Target className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 font-serif mb-3">
          Perfect Your Experience
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Let's fine-tune your ideal fragrance experience
        </p>
      </div>

      <div className="space-y-8">
        {/* Longevity Selection */}
        <div>
          <label className="block text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="h-6 w-6 text-green-600" />
            How Long Should It Last?
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            {longevityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateData('longevity', option.value)}
                className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-105 ${
                  data.longevity === option.value
                    ? 'border-green-500 bg-gradient-to-br from-green-50 to-blue-50 shadow-lg scale-105'
                    : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${option.color}`}>
                    <span className="text-3xl">{option.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg mb-1">{option.label}</div>
                    <div className="text-sm font-semibold text-green-600 mb-1">
                      {option.duration}
                    </div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Impression Selection */}
        <div>
          <label className="block text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            What Impression Do You Want to Make?
          </label>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {impressionOptions.map((impression) => (
              <button
                key={impression.value}
                onClick={() => updateData('impression', impression.value)}
                className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-105 ${
                  data.impression === impression.value
                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg scale-105'
                    : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${impression.color}`}>
                    <span className="text-3xl">{impression.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg mb-1">{impression.label}</div>
                    <div className="text-sm text-gray-600">{impression.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Fragrance Profile Summary</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-semibold text-gray-600">Gender:</span>
              <p className="font-bold text-gray-900 capitalize">{data.gender || 'Not selected'}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600">Personalities:</span>
              <p className="font-bold text-gray-900">
                {data.scentPersonalities?.length || 0} selected
              </p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600">Occasions:</span>
              <p className="font-bold text-gray-900">
                {data.occasions?.length || 0} selected
              </p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600">Duration:</span>
              <p className="font-bold text-gray-900 capitalize">
                {longevityOptions.find(opt => opt.value === data.longevity)?.duration || 'Not selected'}
              </p>
            </div>
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
          Final Step
        </div>
        <Button
          onClick={onSubmit}
          size="lg"
          disabled={!isValid || isLoading}
          className={`bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-8 py-4 text-lg ${
            !isValid || isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Finding Your Match...
            </div>
          ) : (
            '🎉 Find My Perfect Fragrance'
          )}
        </Button>
      </div>
    </div>
  );
};

export default SimpleQuizStep3;