import React from 'react';
import { Link } from 'react-router-dom';
import { User, Sparkles, Star, Target, RefreshCw, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import type { AdvancedRecommendationResponse } from '@/services/quizService';

interface QuizResultsProps {
  recommendations: AdvancedRecommendationResponse;
  onReset: () => void;
  onRetry: () => void;
  apiError?: string | null;
}

const QuizResults: React.FC<QuizResultsProps> = ({ recommendations, onReset, onRetry, apiError }) => {
  // API Error Display
  if (apiError) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6">
          <div className="flex items-start text-red-800">
            <X className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Error Getting Recommendations</h3>
              <p className="text-sm text-red-700">{apiError}</p>
              <Button
                onClick={onRetry}
                size="sm"
                variant="outline"
                className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Personality Analysis */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-4">
              <User className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 font-serif mb-2">
              {recommendations.personality_analysis.scent_personality}
            </h2>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {recommendations.personality_analysis.key_traits.map((trait, index) => (
                <Badge key={index} variant="outline" className="border-purple-300 text-purple-700">
                  {trait}
                </Badge>
              ))}
            </div>
            <p className="text-gray-700 max-w-2xl mx-auto mb-6">
              {recommendations.personality_analysis.style_description}
            </p>
            <p className="text-sm text-purple-800 italic">
              {recommendations.personality_analysis.recommendation_style}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 font-serif mb-6 text-center">
          Your Perfect Fragrance Matches
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.results.map((result, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              {/* Rank Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  #{result.rank}
                </div>
              </div>

              {/* Match Score */}
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold">
                  {Math.round(result.overall_score * 100)}% Match
                </Badge>
              </div>

              <div className="relative">
                <div className="h-64 bg-gradient-to-br from-purple-100 to-blue-100 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <Sparkles className="h-10 w-10 text-white" />
                      </div>
                      <p className="text-gray-700 font-medium">{result.perfume.brand}</p>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-gray-900 font-serif mb-2">{result.perfume.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{result.perfume.description}</p>

                {/* Aroma Tags */}
                {result.perfume.aroma_tags && result.perfume.aroma_tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {result.perfume.aroma_tags.slice(0, 3).map((aroma, i) => (
                        <Badge key={i} variant="outline" size="sm">
                          {aroma.name}
                        </Badge>
                      ))}
                      {result.perfume.aroma_tags.length > 3 && (
                        <Badge variant="outline" size="sm">
                          +{result.perfume.aroma_tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Detailed Score Breakdown */}
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Profile Match</span>
                    <span className="font-semibold text-purple-600">{Math.round(result.profile_match * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${result.profile_match * 100}%` }} />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Season Match</span>
                    <span className="font-semibold text-blue-600">{Math.round(result.season_match * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${result.season_match * 100}%` }} />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Occasion Match</span>
                    <span className="font-semibold text-green-600">{Math.round(result.occasion_match * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${result.occasion_match * 100}%` }} />
                  </div>
                </div>

                {/* Match Reasons */}
                {result.match_reasons && result.match_reasons.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Why it matches:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {result.match_reasons.map((reason, i) => (
                        <li key={i} className="flex items-start">
                          <Star className="h-3 w-3 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Best For */}
                {result.best_for && result.best_for.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Perfect for:</h5>
                    <div className="flex flex-wrap gap-1">
                      {result.best_for.map((use, i) => (
                        <Badge key={i} variant="outline" size="sm">
                          {use}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-900">${result.perfume.price}</div>
                  <Link to={`/catalog/${result.perfume.id}`}>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                      View Details
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tips */}
      {recommendations.tips && recommendations.tips.length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 font-serif mb-4 flex items-center">
              <Sparkles className="h-6 w-6 text-yellow-600 mr-2" />
              Pro Tips for Your Fragrance Journey
            </h3>
            <ul className="space-y-2">
              {recommendations.tips.map((tip, index) => (
                <li key={index} className="flex items-start text-gray-700">
                  <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Algorithm Info */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-900 font-serif mb-3 flex items-center">
            <Target className="h-5 w-5 text-gray-600 mr-2" />
            How We Found Your Matches
          </h3>
          <p className="text-gray-700 text-sm mb-3">
            {recommendations.recommendation_logic.process_description}
          </p>
          <div className="flex flex-wrap gap-2">
            {recommendations.recommendation_logic.factors_considered.map((factor, index) => (
              <Badge key={index} variant="outline" size="sm" className="border-gray-300">
                {factor}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="text-center space-x-4">
        <Button onClick={onReset} variant="outline" size="lg">
          <RefreshCw className="h-4 w-4 mr-2" />
          Take Quiz Again
        </Button>
        <Link to="/catalog">
          <Button size="lg">
            Browse Full Collection
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default QuizResults;