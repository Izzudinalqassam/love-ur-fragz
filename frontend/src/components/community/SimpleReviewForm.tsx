import React, { useState } from 'react';
import { X, Star, Plus, X as CloseIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface SimpleReviewFormProps {
  perfumeId: number;
  perfumeName: string;
  onSubmit: (data: ReviewData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface ReviewData {
  perfume_id: number;
  user_name: string;
  overall_rating: number;
  longevity_rating: string;
  sillage_rating: string;
  value_rating: number;
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
  occasions: string[];
  seasons: string[];
  would_repurchase: boolean;
}

const SimpleReviewForm: React.FC<SimpleReviewFormProps> = ({
  perfumeId,
  perfumeName,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<ReviewData>({
    perfume_id: perfumeId,
    user_name: '',
    overall_rating: 5,
    longevity_rating: 'good',
    sillage_rating: 'moderate',
    value_rating: 5,
    title: '',
    comment: '',
    pros: [''],
    cons: [''],
    occasions: ['daily'],
    seasons: ['all-season'],
    would_repurchase: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const newErrors: Record<string, string> = {};

    if (!formData.user_name.trim()) {
      newErrors.user_name = 'Name is required';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'Review is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clean up empty pros/cons
    const cleanData = {
      ...formData,
      pros: formData.pros.filter(p => p.trim()),
      cons: formData.cons.filter(c => c.trim())
    };

    onSubmit(cleanData);
  };

  const addPro = () => {
    setFormData(prev => ({
      ...prev,
      pros: [...prev.pros, '']
    }));
  };

  const addCon = () => {
    setFormData(prev => ({
      ...prev,
      cons: [...prev.cons, '']
    }));
  };

  const updatePro = (index: number, value: string) => {
    setFormData(prev => {
      const newPros = [...prev.pros];
      newPros[index] = value;
      return { ...prev, pros: newPros };
    });
  };

  const updateCon = (index: number, value: string) => {
    setFormData(prev => {
      const newCons = [...prev.cons];
      newCons[index] = value;
      return { ...prev, cons: newCons };
    });
  };

  const removePro = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pros: prev.pros.filter((_, i) => i !== index)
    }));
  };

  const removeCon = (index: number) => {
    setFormData(prev => ({
      ...prev,
      cons: prev.cons.filter((_, i) => i !== index)
    }));
  };

  const toggleOccasion = (occasion: string) => {
    setFormData(prev => ({
      ...prev,
      occasions: prev.occasions.includes(occasion)
        ? prev.occasions.filter(o => o !== occasion)
        : [...prev.occasions, occasion]
    }));
  };

  const toggleSeason = (season: string) => {
    setFormData(prev => ({
      ...prev,
      seasons: prev.seasons.includes(season)
        ? prev.seasons.filter(s => s !== season)
        : [...prev.seasons, season]
    }));
  };

  const StarRating = ({
    rating,
    onChange,
    size = "w-6 h-6"
  }: {
    rating: number;
    onChange: (rating: number) => void;
    size?: string;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`${size} ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        >
          <Star className={size} />
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Review {perfumeName}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={formData.user_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, user_name: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.user_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Your name"
                />
                {errors.user_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.user_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Would you buy again?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.would_repurchase}
                      onChange={() => setFormData(prev => ({ ...prev, would_repurchase: true }))}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!formData.would_repurchase}
                      onChange={() => setFormData(prev => ({ ...prev, would_repurchase: false }))}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>

            {/* Ratings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating
              </label>
              <StarRating
                rating={formData.overall_rating}
                onChange={(rating) => setFormData(prev => ({ ...prev, overall_rating: rating }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longevity (How long it lasts)
                </label>
                <select
                  value={formData.longevity_rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, longevity_rating: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="very-poor">Very Poor</option>
                  <option value="poor">Poor</option>
                  <option value="average">Average</option>
                  <option value="good">Good</option>
                  <option value="excellent">Excellent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sillage (How strong it smells)
                </label>
                <select
                  value={formData.sillage_rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, sillage_rating: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="very-light">Very Light</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="heavy">Heavy</option>
                  <option value="very-heavy">Very Heavy</option>
                </select>
              </div>
            </div>

            {/* Title and Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Brief summary of your experience"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.comment ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={4}
                placeholder="Share your experience with this fragrance..."
              />
              {errors.comment && (
                <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
              )}
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">
                    What you liked
                  </label>
                  <Button
                    type="button"
                    onClick={addPro}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.pros.map((pro, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={pro}
                        onChange={(e) => updatePro(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="What did you like?"
                      />
                      {formData.pros.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePro(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <CloseIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">
                    What you didn't like
                  </label>
                  <Button
                    type="button"
                    onClick={addCon}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.cons.map((con, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={con}
                        onChange={(e) => updateCon(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="What could be better?"
                      />
                      {formData.cons.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCon(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <CloseIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Occasions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Best for (select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {['daily', 'work', 'casual', 'date-night', 'formal', 'party', 'special-occasion'].map(occasion => (
                  <Badge
                    key={occasion}
                    variant={formData.occasions.includes(occasion) ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => toggleOccasion(occasion)}
                  >
                    {occasion.replace('-', ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Seasons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Best season (select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {['spring', 'summer', 'fall', 'winter', 'all-season'].map(season => (
                  <Badge
                    key={season}
                    variant={formData.seasons.includes(season) ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => toggleSeason(season)}
                  >
                    {season === 'all-season' ? 'All Year' : season}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t">
              <Button
                type="button"
                onClick={onCancel}
                variant="outline"
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleReviewForm;