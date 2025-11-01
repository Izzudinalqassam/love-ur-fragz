import React, { useState, useCallback, useEffect } from 'react';
import { Star, Plus, X, ThumbsUp, ThumbsDown, Calendar, MapPin, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type {
  CreateEnhancedReviewRequest,
  ReviewFormProps,
  Rating,
  LongevityRating,
  SillageRating,
  Occasion,
  Season,
  ReviewValidationResult,
  ReviewValidationError
} from '@/types/community';

const EnhancedReviewForm: React.FC<ReviewFormProps> = ({
  perfumeId,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  validationErrors
}) => {
  // Form State
  const [formData, setFormData] = useState<CreateEnhancedReviewRequest>({
    perfume_id: perfumeId,
    user_name: '',
    user_email: '',
    overall_rating: 5,
    longevity_rating: 'average',
    sillage_rating: 'moderate',
    value_rating: 3,
    title: '',
    comment: '',
    pros: [],
    cons: [],
    occasions: [],
    seasons: [],
    would_repurchase: true,
    ...initialData
  });

  // UI State
  const [proInput, setProInput] = useState('');
  const [conInput, setConInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Initialize with initial data
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  // Validation
  const validateForm = useCallback((): ReviewValidationResult => {
    const errors: ReviewValidationError[] = [];
    const warnings: ReviewValidationError[] = [];

    // Required field validations
    if (!formData.user_name.trim()) {
      errors.push({
        field: 'user_name',
        message: 'Name is required',
        code: 'REQUIRED'
      });
    } else if (formData.user_name.trim().length < 2) {
      errors.push({
        field: 'user_name',
        message: 'Name must be at least 2 characters',
        code: 'MIN_LENGTH'
      });
    }

    if (!formData.title.trim()) {
      errors.push({
        field: 'title',
        message: 'Review title is required',
        code: 'REQUIRED'
      });
    } else if (formData.title.trim().length < 10) {
      errors.push({
        field: 'title',
        message: 'Title must be at least 10 characters',
        code: 'MIN_LENGTH'
      });
    }

    if (!formData.comment.trim()) {
      errors.push({
        field: 'comment',
        message: 'Review content is required',
        code: 'REQUIRED'
      });
    } else if (formData.comment.trim().length < 50) {
      errors.push({
        field: 'comment',
        message: 'Review must be at least 50 characters',
        code: 'MIN_LENGTH'
      });
    }

    if (formData.comment.trim().length > 2000) {
      errors.push({
        field: 'comment',
        message: 'Review must be less than 2000 characters',
        code: 'MAX_LENGTH'
      });
    }

    // Email validation (optional but if provided, must be valid)
    if (formData.user_email && formData.user_email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.user_email)) {
        errors.push({
          field: 'user_email',
          message: 'Please enter a valid email address',
          code: 'INVALID_FORMAT'
        });
      }
    }

    // Warnings
    if (formData.occasions.length === 0) {
      warnings.push({
        field: 'occasions',
        message: 'Adding occasions helps others understand when to wear this fragrance',
        code: 'RECOMMENDED'
      });
    }

    if (formData.seasons.length === 0) {
      warnings.push({
        field: 'seasons',
        message: 'Adding seasons helps others understand the best time to wear this fragrance',
        code: 'RECOMMENDED'
      });
    }

    if (formData.pros.length === 0 && formData.cons.length === 0) {
      warnings.push({
        field: 'pros_cons',
        message: 'Adding pros and cons makes your review more helpful',
        code: 'RECOMMENDED'
      });
    }

    // Check for spam indicators
    const commentWords = formData.comment.toLowerCase().split(/\s+/);
    const spamIndicators = ['amazing', 'best', 'perfect', 'awesome', 'incredible'];
    const spamCount = spamIndicators.filter(word => commentWords.includes(word)).length;

    if (spamCount > 3) {
      warnings.push({
        field: 'comment',
        message: 'Please provide more specific details about your experience',
        code: 'SPAM_INDICATOR'
      });
    }

    return {
      is_valid: errors.length === 0,
      errors,
      warnings
    };
  }, [formData]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm();
    setShowValidationErrors(true);

    if (!validation.is_valid) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = useCallback((
    field: keyof CreateEnhancedReviewRequest,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setShowValidationErrors(false);
  }, []);

  // Handle pros/cons
  const addPro = useCallback(() => {
    if (proInput.trim() && !formData.pros.includes(proInput.trim())) {
      handleInputChange('pros', [...formData.pros, proInput.trim()]);
      setProInput('');
    }
  }, [proInput, formData.pros, handleInputChange]);

  const removePro = useCallback((index: number) => {
    handleInputChange('pros', formData.pros.filter((_, i) => i !== index));
  }, [formData.pros, handleInputChange]);

  const addCon = useCallback(() => {
    if (conInput.trim() && !formData.cons.includes(conInput.trim())) {
      handleInputChange('cons', [...formData.cons, conInput.trim()]);
      setConInput('');
    }
  }, [conInput, formData.cons, handleInputChange]);

  const removeCon = useCallback((index: number) => {
    handleInputChange('cons', formData.cons.filter((_, i) => i !== index));
  }, [formData.cons, handleInputChange]);

  // Handle occasion/season toggles
  const toggleOccasion = useCallback((occasion: Occasion) => {
    const isSelected = formData.occasions.includes(occasion);
    handleInputChange('occasions',
      isSelected
        ? formData.occasions.filter(o => o !== occasion)
        : [...formData.occasions, occasion]
    );
  }, [formData.occasions, handleInputChange]);

  const toggleSeason = useCallback((season: Season) => {
    const isSelected = formData.seasons.includes(season);
    handleInputChange('seasons',
      isSelected
        ? formData.seasons.filter(s => s !== season)
        : [...formData.seasons, season]
    );
  }, [formData.seasons, handleInputChange]);

  // Star rating component
  const StarRating = ({
    value,
    onChange,
    size = 'normal'
  }: {
    value: Rating;
    onChange: (rating: Rating) => void;
    size?: 'small' | 'normal' | 'large'
  }) => {
    const sizeClasses = {
      small: 'w-4 h-4',
      normal: 'w-6 h-6',
      large: 'w-8 h-8'
    };

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star as Rating)}
            className={`${sizeClasses[size]} transition-colors duration-200 ${
              star <= value
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300 hover:text-yellow-200'
            }`}
            aria-label={`Rate ${star} stars`}
          >
            <Star className={sizeClasses[size]} />
          </button>
        ))}
      </div>
    );
  };

  // Radio button component for ratings
  const RadioGroup = ({
    label,
    value,
    options,
    onChange,
    icon: Icon
  }: {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: any) => void;
    icon: any;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {label}
      </label>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
              value === option.value
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm font-medium">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const validation = showValidationErrors ? validationErrors || validateForm() : validateForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Share Your Fragrance Experience
            </h2>
            <p className="text-gray-600">
              Help the community make better fragrance choices
            </p>
          </div>

          {/* User Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                value={formData.user_name}
                onChange={(e) => handleInputChange('user_name', e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                maxLength={50}
              />
              {validation.errors.find(e => e.field === 'user_name') && (
                <p className="text-red-500 text-sm mt-1">
                  {validation.errors.find(e => e.field === 'user_name')?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                value={formData.user_email}
                onChange={(e) => handleInputChange('user_email', e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
              {validation.errors.find(e => e.field === 'user_email') && (
                <p className="text-red-500 text-sm mt-1">
                  {validation.errors.find(e => e.field === 'user_email')?.message}
                </p>
              )}
            </div>
          </div>

          {/* Ratings Section */}
          <div className="space-y-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Rate This Fragrance</h3>

            {/* Overall Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating *
              </label>
              <StarRating
                value={formData.overall_rating}
                onChange={(rating) => handleInputChange('overall_rating', rating)}
                size="large"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Longevity Rating */}
              <RadioGroup
                label="Longevity"
                value={formData.longevity_rating}
                options={[
                  { value: 'very-poor', label: 'Very Poor' },
                  { value: 'poor', label: 'Poor' },
                  { value: 'average', label: 'Average' },
                  { value: 'good', label: 'Good' },
                  { value: 'excellent', label: 'Excellent' }
                ]}
                onChange={(value) => handleInputChange('longevity_rating', value)}
                icon={Clock}
              />

              {/* Sillage Rating */}
              <RadioGroup
                label="Sillage (Projection)"
                value={formData.sillage_rating}
                options={[
                  { value: 'very-light', label: 'Very Light' },
                  { value: 'light', label: 'Light' },
                  { value: 'moderate', label: 'Moderate' },
                  { value: 'heavy', label: 'Heavy' },
                  { value: 'very-heavy', label: 'Very Heavy' }
                ]}
                onChange={(value) => handleInputChange('sillage_rating', value)}
                icon={MapPin}
              />

              {/* Value Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Value for Money
                </label>
                <StarRating
                  value={formData.value_rating}
                  onChange={(rating) => handleInputChange('value_rating', rating)}
                  size="small"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Review Title and Content */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Summarize your experience in one sentence"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                maxLength={100}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>
                  {validation.errors.find(e => e.field === 'title') && (
                    <span className="text-red-500">
                      {validation.errors.find(e => e.field === 'title')?.message}
                    </span>
                  )}
                </span>
                <span>{formData.title.length}/100</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => handleInputChange('comment', e.target.value)}
                placeholder="Share your detailed experience with this fragrance. What did you like or dislike? How did it make you feel?"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 resize-none"
                maxLength={2000}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>
                  {validation.errors.find(e => e.field === 'comment') && (
                    <span className="text-red-500">
                      {validation.errors.find(e => e.field === 'comment')?.message}
                    </span>
                  )}
                </span>
                <span>{formData.comment.length}/2000</span>
              </div>
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Pros */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-green-600" />
                What You Liked (Pros)
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={proInput}
                    onChange={(e) => setProInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPro())}
                    placeholder="Add something you liked"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    maxLength={100}
                  />
                  <Button
                    type="button"
                    onClick={addPro}
                    disabled={!proInput.trim()}
                    size="sm"
                    className="px-3"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {formData.pros.map((pro, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-green-50 text-green-700 px-3 py-2 rounded-md text-sm"
                    >
                      <span>{pro}</span>
                      <button
                        type="button"
                        onClick={() => removePro(index)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <ThumbsDown className="w-4 h-4 text-red-600" />
                What You Disliked (Cons)
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={conInput}
                    onChange={(e) => setConInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCon())}
                    placeholder="Add something you disliked"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    maxLength={100}
                  />
                  <Button
                    type="button"
                    onClick={addCon}
                    disabled={!conInput.trim()}
                    size="sm"
                    className="px-3"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {formData.cons.map((con, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-red-50 text-red-700 px-3 py-2 rounded-md text-sm"
                    >
                      <span>{con}</span>
                      <button
                        type="button"
                        onClick={() => removeCon(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Usage Context */}
          <div className="space-y-6 mb-6">
            {/* Occasions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Best Occasions
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'daily', label: 'Daily Wear' },
                  { value: 'work', label: 'Work/Office' },
                  { value: 'casual', label: 'Casual' },
                  { value: 'date-night', label: 'Date Night' },
                  { value: 'formal', label: 'Formal Events' },
                  { value: 'party', label: 'Parties' },
                  { value: 'wedding', label: 'Weddings' },
                  { value: 'sport', label: 'Sports' },
                  { value: 'travel', label: 'Travel' },
                  { value: 'special-occasion', label: 'Special Occasions' }
                ].map((occasion) => (
                  <Badge
                    key={occasion.value}
                    variant={formData.occasions.includes(occasion.value as Occasion) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-purple-100"
                    onClick={() => toggleOccasion(occasion.value as Occasion)}
                  >
                    {occasion.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Seasons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Best Seasons
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'spring', label: 'Spring 🌸' },
                  { value: 'summer', label: 'Summer ☀️' },
                  { value: 'fall', label: 'Fall 🍂' },
                  { value: 'winter', label: 'Winter ❄️' },
                  { value: 'all-season', label: 'All Season 🌍' }
                ].map((season) => (
                  <Badge
                    key={season.value}
                    variant={formData.seasons.includes(season.value as Season) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-purple-100"
                    onClick={() => toggleSeason(season.value as Season)}
                  >
                    {season.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Would Repurchase */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Would you repurchase this fragrance?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="repurchase"
                    checked={formData.would_repurchase}
                    onChange={() => handleInputChange('would_repurchase', true)}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium">Yes, definitely</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="repurchase"
                    checked={!formData.would_repurchase}
                    onChange={() => handleInputChange('would_repurchase', false)}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium">No, probably not</span>
                </label>
              </div>
            </div>
          </div>

          {/* Validation Warnings */}
          {validation.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">
                Suggestions to make your review more helpful:
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {validation.warnings.map((warning, index) => (
                  <li key={index}>• {warning.message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              loading={isSubmitting || isLoading}
              className="flex-1"
            >
              {isSubmitting || isLoading ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default EnhancedReviewForm;