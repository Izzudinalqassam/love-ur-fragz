import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { QuizData } from '@/hooks/useQuiz';

interface QuizStep4Props {
  data: QuizData;
  updateData: (field: keyof QuizData, value: any) => void;
  onSubmit: () => void;
  onPrevious: () => void;
  loading: boolean;
}

const QuizStep4: React.FC<QuizStep4Props> = ({ data, updateData, onSubmit, onPrevious, loading }) => {
  return (
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
            value={data.currentSituation}
            onChange={(e) => updateData('currentSituation', e.target.value)}
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
            value={data.season}
            onChange={(e) => updateData('season', e.target.value)}
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
            value={data.timeOfDay}
            onChange={(e) => updateData('timeOfDay', e.target.value)}
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
            value={data.desiredImpression}
            onChange={(e) => updateData('desiredImpression', e.target.value)}
          >
            <option value="confident">Confident</option>
            <option value="elegant">Elegant</option>
            <option value="playful">Playful</option>
            <option value="mysterious">Mysterious</option>
            <option value="professional">Professional</option>
            <option value="romantic">Romantic</option>
          </select>
        </div>
      </div>

      <div className="text-center mt-8">
        <Button
          onClick={onSubmit}
          disabled={loading}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Finding Your Perfect Match...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Get My Recommendations
            </>
          )}
        </Button>
      </div>

      <div className="flex justify-start">
        <Button
          onClick={onPrevious}
          variant="outline"
          size="lg"
          className="font-semibold"
        >
          Previous
        </Button>
      </div>
    </div>
  );
};

export default QuizStep4;