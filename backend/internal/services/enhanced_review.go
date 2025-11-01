package services

import (
	"fmt"
	"perfume-website/internal/models"
)

// EnhancedReviewService handles enhanced review business logic
type EnhancedReviewService struct {
	repo *models.EnhancedReviewRepositoryGORM
}

// NewEnhancedReviewService creates a new enhanced review service
func NewEnhancedReviewService(repo *models.EnhancedReviewRepositoryGORM) *EnhancedReviewService {
	return &EnhancedReviewService{
		repo: repo,
	}
}

// CreateReview creates a new enhanced review with business validation
func (s *EnhancedReviewService) CreateReview(req *models.CreateEnhancedReviewRequest) (*models.EnhancedReviewGORM, error) {
	// Additional business validation can be added here
	// For example: check if user already reviewed this perfume
	// Or implement rate limiting, spam detection, etc.

	return s.repo.Create(req)
}

// GetReviews gets enhanced reviews with filtering and sorting
func (s *EnhancedReviewService) GetReviews(options models.ReviewFilterOptions) ([]*models.EnhancedReviewGORM, error) {
	// Set default values
	if options.SortBy == "" {
		options.SortBy = "most-recent"
	}
	if options.Limit == 0 {
		options.Limit = 50 // Default limit
	}
	if options.Limit > 100 {
		options.Limit = 100 // Max limit
	}

	return s.repo.GetByPerfumeID(options)
}

// GetReviewStats gets enhanced review statistics
func (s *EnhancedReviewService) GetReviewStats(perfumeID int) (*models.EnhancedReviewStats, error) {
	return s.repo.GetStats(perfumeID)
}

// MarkReviewHelpful marks a review as helpful
func (s *EnhancedReviewService) MarkReviewHelpful(reviewID int, userIdentifier string) error {
	return s.repo.MarkHelpful(reviewID, userIdentifier)
}

// ReportReview reports a review
func (s *EnhancedReviewService) ReportReview(reviewID int, reason, description, userIdentifier string) error {
	// Additional validation for report reasons can be added here
	validReasons := []string{
		"inappropriate-content",
		"spam",
		"fake-review",
		"off-topic",
		"harmful-content",
		"other",
	}

	isValidReason := false
	for _, validReason := range validReasons {
		if reason == validReason {
			isValidReason = true
			break
		}
	}

	if !isValidReason {
		return fmt.Errorf("invalid report reason: %s", reason)
	}

	return s.repo.ReportReview(reviewID, reason, description, userIdentifier)
}

// GetReviewByID gets a single enhanced review by ID
func (s *EnhancedReviewService) GetReviewByID(id int) (*models.EnhancedReviewGORM, error) {
	return s.repo.GetByID(id)
}