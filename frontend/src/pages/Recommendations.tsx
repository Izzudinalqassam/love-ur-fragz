import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, Heart, Star, ArrowRight, RefreshCw, X, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { MultiSelect } from '../components/ui/MultiSelect';
import type { Perfume, RecommendationResponse, RecommendationResult } from '../lib/api';
import { api } from '../lib/api';

const Recommendations = () => {
  const [aromas, setAromas] = useState<{id: number, slug: string, name: string}[]>([]);
  const [selectedAromas, setSelectedAromas] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    fetchAromas();
  }, []);

  const fetchAromas = async () => {
    try {
      const aromas = await api.getAromas();
      setAromas(aromas || []);
    } catch (error) {
      console.error('Error fetching aromas:', error);
      setAromas([]); // Set empty array as fallback
    }
  };

  const [recommendationData, setRecommendationData] = useState<RecommendationResponse | null>(null);

  const handleGetRecommendations = async () => {
    if (selectedAromas.length === 0) {
      alert('Please select at least one aroma profile');
      return;
    }

    setLoading(true);
    try {
      const response = await api.getRecommendations(selectedAromas);
      console.log('API Response:', response); // Debug log
      setRecommendationData(response);
      setRecommendations(response.results || []);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      alert('Failed to get recommendations. Please try again.');
      setRecommendations([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fId => fId !== id)
        : [...prev, id]
    );
  };

  const resetForm = () => {
    setSelectedAromas([]);
    setRecommendations(null);
  };

  const getBlendDescription = (aromaList: string[]) => {
    const blends: { [key: string]: string } = {
      'floral,woody': 'A sophisticated earthy-floral harmony perfect for evening elegance',
      'floral,citrus': 'A bright, refreshing floral bouquet ideal for daytime wear',
      'woody,sweet': 'A warm, seductive gourmand vibe perfect for cozy evenings',
      'citrus,fresh': 'An energizing, clean combination that awakens the senses',
      'oriental,spicy': 'An exotic, mysterious blend for confident personalities',
      'sweet,vanilla': 'A comforting, sweet embrace that feels like home'
    };

    const key = aromaList.sort().join(',');
    return blends[key] || `A unique ${aromaList.join(' + ')} combination creating your personal signature`;
  };

  const aromaOptions = aromas.map(aroma => ({
    value: aroma.slug,
    label: aroma.name
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Ensure proper spacing to prevent scroll issues */}
      <div className="pb-8">
      {/* Header Section with 3D Magic Background */}
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        
        {/* 3D Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating orbs */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-screen filter blur-2xl opacity-30 animate-bounce"></div>
          <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-screen filter blur-3xl opacity-25 animate-pulse"></div>
          <div className="absolute bottom-10 left-1/4 w-24 h-24 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-bounce" style={{ animationDelay: '1s' }}></div>
          
          {/* Magic particles */}
          <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-white rounded-full animate-ping"></div>
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-pink-300 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
          
          {/* Gradient waves */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-600/20 via-transparent to-transparent animate-pulse"></div>
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-blue-600/20 via-transparent to-transparent animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          
          {/* Rotating elements */}
          <div className="absolute top-20 left-1/2 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-screen filter blur-xl opacity-40 animate-spin" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mix-blend-screen filter blur-lg opacity-30 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <Badge className="bg-purple-500 text-white border-purple-400 mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              Personalized Discovery
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6">
            Find Your Perfect
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Signature Scent
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Let our AI guide you to fragrances that perfectly match your unique preferences. 
            Select your favorite aroma profiles and discover your ideal scents.
          </p>
        </div>
      </div>

      {/* Recommendation Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <Card className="shadow-2xl bg-white border-0">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mb-3">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 font-serif mb-3">
                Discover Your Perfect Match
              </h2>
              <p className="text-gray-600 text-base max-w-xl mx-auto">
                Choose aromas that speak to your soul for personalized recommendations
              </p>
            </div>

            <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
              <div className="text-center mb-3">
                <div className="inline-flex items-center px-3 py-1 bg-white rounded-full shadow-sm mb-2">
                  <Heart className="h-4 w-4 text-red-500 mr-2" />
                  <span className="font-semibold text-gray-900 text-sm">What aromas make you feel amazing?</span>
                </div>
                <p className="text-xs text-gray-600 italic mb-3">
                  Select all that resonate with your personality ✨
                </p>
              </div>
              
              {/* Aroma Selection Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-3">
                {aromaOptions.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      const isSelected = selectedAromas.includes(option.value);
                      if (isSelected) {
                        setSelectedAromas(prev => prev.filter(a => a !== option.value));
                      } else {
                        setSelectedAromas(prev => [...prev, option.value]);
                      }
                    }}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left hover:scale-105 ${
                      selectedAromas.includes(option.value)
                        ? 'border-purple-500 bg-purple-500 text-white shadow-lg'
                        : 'border-purple-200 bg-white hover:border-purple-400 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        selectedAromas.includes(option.value)
                          ? 'bg-white'
                          : 'bg-purple-400'
                      }`}>
                        {selectedAromas.includes(option.value) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8.586 10H13a1 1 0 110 2H8.586l-3.293 3.293a1 1 0 001.414 1.414l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm font-medium ${
                        selectedAromas.includes(option.value) ? 'text-white' : 'text-gray-700'
                      }`}>
                        {option.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {selectedAromas.length > 0 && (
                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-purple-900">Your Blend ({selectedAromas.length} selected):</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAromas([])}
                      className="text-purple-600 hover:text-purple-700 h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {selectedAromas.map(aroma => (
                      <Badge key={aroma} variant="outline" className="border-purple-300 text-purple-700 text-xs">
                        {aromas.find(a => a.slug === aroma)?.name || aroma}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-purple-800 italic">
                    {getBlendDescription(selectedAromas)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleGetRecommendations}
                disabled={loading || selectedAromas.length === 0}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Finding Matches...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get Recommendations
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
              
              {recommendations && (
                <Button
                  variant="outline"
                  onClick={resetForm}
                  size="lg"
                  className="font-semibold px-6 py-3"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Start Over
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <RefreshCw className="h-8 w-8 text-purple-600 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Analyzing Your Preferences
            </h3>
            <p className="text-gray-600">
              Our AI is finding perfect fragrances for you...
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <LoadingSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Results with Magic Background */}
      {recommendations && !loading && (
        <div className="relative py-12">
          {/* Magic Background for Results */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-cyan-300/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-indigo-300/15 to-purple-300/15 rounded-full filter blur-2xl animate-bounce" style={{ animationDelay: '1s' }}></div>
            
            {/* Floating sparkles */}
            <div className="absolute top-10 right-10 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-20 left-20 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '2.5s' }}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-6">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-lg font-semibold text-purple-900">
                  {recommendations.length} Perfect Matches Found
                </span>
              </div>
              
              {recommendations.length > 0 && (
                <Card className="max-w-3xl mx-auto mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
                  <CardContent className="p-6 text-center">
                    <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 font-serif mb-3">
                      Your Personalized Fragrance Profile
                    </h3>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {recommendationData?.explanation || 'Based on your selected preferences, we found these perfect matches for you.'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((result, index) => {
                const perfume = result.perfume;
                const score = result.score;
                return (
                  <Card key={perfume.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-0">
                    {/* Match Score Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold">
                        {Math.round((score || 0) * 100)}% Match
                      </Badge>
                    </div>

                    {/* Ranking Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        #{index + 1}
                      </div>
                    </div>

                    <div className="relative">
                      {/* Image Placeholder */}
                      <div className="h-64 bg-gradient-to-br from-purple-100 to-blue-100 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                              <Sparkles className="h-10 w-10 text-white" />
                            </div>
                            <p className="text-gray-700 font-medium">{perfume.brand}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 font-serif mb-2">{perfume.name}</h3>
                        <p className="text-sm text-gray-600 font-medium">{perfume.brand}</p>
                      </div>

                      {perfume.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {perfume.description}
                        </p>
                      )}

                      {/* Match Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Compatibility Score</span>
                          <span className="text-sm font-bold text-purple-600">
                            {Math.round((score || 0) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(score || 0) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Aroma Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {perfume.aroma_tags?.slice(0, 3).map((tag: any) => (
                          <Badge key={tag.id} variant="aroma" size="sm">
                            {tag.name}
                          </Badge>
                        ))}
                        {perfume.aroma_tags && perfume.aroma_tags.length > 3 && (
                          <Badge variant="outline" size="sm">
                            +{perfume.aroma_tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-gray-900">
                          ${perfume.price}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleFavorite(perfume.id)}
                            className="bg-white/90 backdrop-blur-sm"
                          >
                            <Heart className={`h-4 w-4 ${favorites.includes(perfume.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          </Button>
                          <Link to={`/catalog`}>
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                              View Details
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Action CTA */}
            <div className="text-center mt-16">
              <Card className="max-w-2xl mx-auto bg-gradient-to-r from-gray-900 to-gray-800 text-white border-0">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold font-serif mb-4">
                    Love Your Recommendations?
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Explore our full collection to discover even more amazing fragrances
                  </p>
                  <Link to="/catalog">
                    <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-4">
                      Browse Full Collection
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Recommendations;
