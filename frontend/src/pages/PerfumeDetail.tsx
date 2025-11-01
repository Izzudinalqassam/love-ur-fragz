import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Heart,
  Share2,
  Star,
  ArrowLeft,
  Info,
  Users,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { perfumeService } from '@/services/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import NotesDisplay from '@/components/perfume/NotesDisplay';
import PerfumeCharacteristics from '@/components/perfume/PerfumeCharacteristics';
import AromaTags from '@/components/perfume/AromaTags';
import { SimpleReviewSection } from '@/components/community';
import useCommunityStore from '@/stores/communityStore';
import type { Perfume } from '@/types';
import type { EnhancedPerfumeReviewStats } from '@/types/community';

const PerfumeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);

  // Use community store for enhanced reviews
  const { getEnhancedReviewStats } = useCommunityStore();

  const {
    data: perfume,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['perfume', id],
    queryFn: () => perfumeService.getById(Number(id)),
    enabled: !!id,
  });

  // Get enhanced review data
  const perfumeId = Number(id);
  const enhancedStats = getEnhancedReviewStats(perfumeId);

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement API call to toggle favorite
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: perfume?.name,
          text: perfume?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !perfume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Perfume Not Found</h2>
            <p className="text-gray-600 mb-4">
              The perfume you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/catalog">
              <Button>Back to Catalog</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/catalog" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Catalog
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFavorite}
                className="p-2"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="p-2"
              >
                <Share2 className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <Sparkles className="h-16 w-16 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium text-lg">{perfume.brand}</p>
                  <p className="text-gray-600 text-sm mt-2">Discover Your Scent</p>
                </div>
              </div>
            </Card>

            {/* Enhanced Community Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Community Reviews
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{enhancedStats?.total_reviews || 0}</div>
                  <div className="text-sm text-green-700">Reviews</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {enhancedStats ? (enhancedStats.average_overall_rating || 0).toFixed(1) : '0.0'}
                  </div>
                  <div className="text-sm text-purple-700">Avg Rating</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-sm text-gray-600">
                  {enhancedStats?.would_repurchase_percentage || 0}% would buy again
                </div>
              </div>
            </Card>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Title and Brand */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{perfume.name}</h1>
              <p className="text-xl text-gray-600 mb-4 uppercase tracking-wide">{perfume.brand}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="capitalize">
                  {perfume.category}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {perfume.target_audience}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Fragrance</h3>
                <p className="text-gray-700 leading-relaxed">{perfume.description}</p>
              </CardContent>
            </Card>

            {/* Key Characteristics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fragrance Profile</h3>
              <PerfumeCharacteristics
                perfume={perfume}
                variant="detailed"
                showLabels={true}
              />
            </Card>

            {/* Notes Section */}
            {perfume.notes && perfume.notes.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Fragrance Notes</h3>
                  <NotesDisplay
                    notes={perfume.notes}
                    variant="detailed"
                    showTitle={true}
                  />
                </CardContent>
              </Card>
            )}

            {/* Aroma Tags */}
            {perfume.aroma_tags && perfume.aroma_tags.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Aroma Profile</h3>
                  <AromaTags
                    aromaTags={perfume.aroma_tags}
                    variant="default"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Simple Reviews Section */}
        <div className="mt-12">
          <SimpleReviewSection
            perfumeId={perfume.id}
            perfumeName={perfume.name}
            perfumeBrand={perfume.brand}
            showForm={true}
            showStats={true}
          />
        </div>
      </div>
    </div>
  );
};

export default PerfumeDetail;