import React from 'react';
import { RefreshCw } from 'lucide-react';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

const QuizLoading: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
        <RefreshCw className="h-10 w-10 text-purple-600 animate-spin" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Analyzing Your Fragrance DNA...
      </h3>
      <p className="text-gray-600 mb-8">
        Our AI is creating your personalized scent profile and finding perfect matches
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[...Array(3)].map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default QuizLoading;