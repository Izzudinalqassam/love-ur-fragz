import React from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { QuizData } from '@/hooks/useQuiz';

interface QuizStep1Props {
  data: QuizData;
  updateData: (field: keyof QuizData, value: any) => void;
  onNext: () => void;
}

const QuizStep1: React.FC<QuizStep1Props> = ({ data, updateData, onNext }) => {
  const ageOptions = [
    { value: '18-25', label: '18-25', desc: 'Young adult' },
    { value: '26-35', label: '26-35', desc: 'Young professional' },
    { value: '36-50', label: '36-50', desc: 'Established' },
    { value: '51+', label: '51+', desc: 'Mature' }
  ];

  const genderOptions = [
    { value: 'male', label: 'Male', icon: '👨' },
    { value: 'female', label: 'Female', icon: '👩' },
    { value: 'unisex', label: 'Unisex', icon: '⚧️' }
  ];

  return (
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
            value={data.name}
            onChange={(e) => updateData('name', e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors duration-200"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">Age Range</label>
          <div className="grid md:grid-cols-3 gap-3">
            {ageOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateData('age', option.value)}
                className={`p-3 rounded-lg border-2 text-left transition-all duration-300 ${
                  data.age === option.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
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
            {genderOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateData('gender', option.value)}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                  data.gender === option.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
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

      <div className="flex justify-end mt-8">
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

export default QuizStep1;