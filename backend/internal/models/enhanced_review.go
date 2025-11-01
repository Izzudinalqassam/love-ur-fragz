package models

import (
	"encoding/json"
	"fmt"

	"gorm.io/gorm"
)

// EnhancedReviewGORM represents the enhanced review model for GORM
type EnhancedReviewGORM struct {
	ID                  int       `json:"id" gorm:"primaryKey"`
	PerfumeID           int       `json:"perfume_id" gorm:"not null;index"`
	UserName            string    `json:"user_name" gorm:"not null;size:255"`
	UserEmail          string    `json:"user_email,omitempty" gorm:"size:255"`
	OverallRating       int       `json:"overall_rating" gorm:"not null"`
	LongevityRating     string    `json:"longevity_rating" gorm:"not null;size:20"`
	SillageRating       string    `json:"sillage_rating" gorm:"not null;size:20"`
	ValueRating         int       `json:"value_rating" gorm:"not null"`
	Title               string    `json:"title" gorm:"not null;size:500"`
	Comment             string    `json:"comment" gorm:"not null;type:text"`
	Pros               string    `json:"-" gorm:"type:text"` // JSON stored as string, hidden from JSON
	Cons               string    `json:"-" gorm:"type:text"` // JSON stored as string, hidden from JSON
	Occasions          string    `json:"-" gorm:"type:text"` // JSON stored as string, hidden from JSON
	Seasons            string    `json:"-" gorm:"type:text"` // JSON stored as string, hidden from JSON
	WouldRepurchase    bool      `json:"would_repurchase" gorm:"not null;default:false"`
	IsVerifiedPurchase bool      `json:"is_verified_purchase" gorm:"not null;default:false"`
	HelpfulCount       int       `json:"helpful_count" gorm:"not null;default:0"`
	CreatedAt          string    `json:"created_at"`
	UpdatedAt          string    `json:"updated_at"`

	// Virtual fields for JSON response
	ProsParsed      []string `json:"pros,omitempty" gorm:"-"`
	ConsParsed      []string `json:"cons,omitempty" gorm:"-"`
	OccasionsParsed []string `json:"occasions,omitempty" gorm:"-"`
	SeasonsParsed   []string `json:"seasons,omitempty" gorm:"-"`
}

// TableName specifies the table name for EnhancedReviewGORM
func (EnhancedReviewGORM) TableName() string {
	return "enhanced_reviews"
}

// EnhancedReviewRepositoryGORM handles enhanced review database operations with GORM
type EnhancedReviewRepositoryGORM struct {
	DB *gorm.DB
}

// NewEnhancedReviewRepositoryGORM creates a new enhanced review repository with GORM
func NewEnhancedReviewRepositoryGORM(db *gorm.DB) *EnhancedReviewRepositoryGORM {
	return &EnhancedReviewRepositoryGORM{DB: db}
}

// AutoMigrate runs auto migration for enhanced review tables
func (r *EnhancedReviewRepositoryGORM) AutoMigrate() error {
	return r.DB.AutoMigrate(
		&EnhancedReviewGORM{},
		&ReviewHelpfulVote{},
		&ReviewReport{},
	)
}

// Create creates a new enhanced review
func (r *EnhancedReviewRepositoryGORM) Create(review *CreateEnhancedReviewRequest) (*EnhancedReviewGORM, error) {
	// Convert slices to JSON
	prosJSON, _ := json.Marshal(review.Pros)
	consJSON, _ := json.Marshal(review.Cons)
	occasionsJSON, _ := json.Marshal(review.Occasions)
	seasonsJSON, _ := json.Marshal(review.Seasons)

	newReview := &EnhancedReviewGORM{
		PerfumeID:           review.PerfumeID,
		UserName:            review.UserName,
		OverallRating:       review.OverallRating,
		LongevityRating:     review.LongevityRating,
		SillageRating:       review.SillageRating,
		ValueRating:         review.ValueRating,
		Title:               review.Title,
		Comment:             review.Comment,
		Pros:               string(prosJSON),
		Cons:               string(consJSON),
		Occasions:          string(occasionsJSON),
		Seasons:            string(seasonsJSON),
		WouldRepurchase:    review.WouldRepurchase,
		IsVerifiedPurchase: false,
		HelpfulCount:       0,
	}

	if err := r.DB.Create(newReview).Error; err != nil {
		return nil, fmt.Errorf("failed to create enhanced review: %w", err)
	}

	// Parse JSON fields for response
	r.parseJSONFields(newReview)
	return newReview, nil
}

// GetByID retrieves an enhanced review by ID
func (r *EnhancedReviewRepositoryGORM) GetByID(id int) (*EnhancedReviewGORM, error) {
	var review EnhancedReviewGORM
	if err := r.DB.First(&review, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("enhanced review not found")
		}
		return nil, fmt.Errorf("failed to get enhanced review: %w", err)
	}

	// Parse JSON fields for response
	r.parseJSONFields(&review)
	return &review, nil
}

// GetByPerfumeID retrieves enhanced reviews for a perfume with filtering and sorting
func (r *EnhancedReviewRepositoryGORM) GetByPerfumeID(options ReviewFilterOptions) ([]*EnhancedReviewGORM, error) {
	var reviews []*EnhancedReviewGORM
	query := r.DB.Where("perfume_id = ?", options.PerfumeID)

	// Add filters
	if options.Rating != nil {
		query = query.Where("overall_rating = ?", *options.Rating)
	}

	if options.Longevity != "" && options.Longevity != "all" {
		query = query.Where("longevity_rating = ?", options.Longevity)
	}

	if options.Sillage != "" && options.Sillage != "all" {
		query = query.Where("sillage_rating = ?", options.Sillage)
	}

	if options.WouldRepurchase != nil {
		query = query.Where("would_repurchase = ?", *options.WouldRepurchase)
	}

	if options.VerifiedPurchase != nil {
		query = query.Where("is_verified_purchase = ?", *options.VerifiedPurchase)
	}

	if options.SearchTerm != "" {
		searchPattern := "%" + options.SearchTerm + "%"
		query = query.Where("title LIKE ? OR comment LIKE ? OR user_name LIKE ?",
			searchPattern, searchPattern, searchPattern)
	}

	// Add sorting
	switch options.SortBy {
	case "most-helpful":
		query = query.Order("helpful_count DESC, created_at DESC")
	case "highest-rating":
		query = query.Order("overall_rating DESC, created_at DESC")
	case "lowest-rating":
		query = query.Order("overall_rating ASC, created_at DESC")
	default:
		query = query.Order("created_at DESC")
	}

	// Add pagination
	if options.Limit > 0 {
		query = query.Limit(options.Limit)
		if options.Offset > 0 {
			query = query.Offset(options.Offset)
		}
	}

	if err := query.Find(&reviews).Error; err != nil {
		return nil, fmt.Errorf("failed to query enhanced reviews: %w", err)
	}

	// Parse JSON fields for each review
	for _, review := range reviews {
		r.parseJSONFields(review)
	}

	return reviews, nil
}

// GetStats retrieves enhanced review statistics for a perfume
func (r *EnhancedReviewRepositoryGORM) GetStats(perfumeID int) (*EnhancedReviewStats, error) {
	stats := &EnhancedReviewStats{PerfumeID: perfumeID}

	// Get basic stats
	var result struct {
		TotalReviews         int64   `json:"total_reviews"`
		AvgOverallRating     float64 `json:"avg_overall_rating"`
		AvgValueRating       float64 `json:"avg_value_rating"`
		WouldRepurchaseCount int64   `json:"would_repurchase_count"`
		VerifiedCount        int64   `json:"verified_count"`
		TotalHelpfulVotes    int64   `json:"total_helpful_votes"`
	}

	if err := r.DB.Model(&EnhancedReviewGORM{}).
		Select("COUNT(*) as total_reviews, AVG(overall_rating) as avg_overall_rating, "+
			"AVG(value_rating) as avg_value_rating, "+
			"COUNT(CASE WHEN would_repurchase = 1 THEN 1 END) as would_repurchase_count, "+
			"COUNT(CASE WHEN is_verified_purchase = 1 THEN 1 END) as verified_count, "+
			"SUM(helpful_count) as total_helpful_votes").
		Where("perfume_id = ?", perfumeID).
		Scan(&result).Error; err != nil {
		return nil, fmt.Errorf("failed to get basic stats: %w", err)
	}

	stats.TotalReviews = int(result.TotalReviews)
	stats.AverageOverallRating = result.AvgOverallRating
	stats.AverageValueRating = result.AvgValueRating

	if stats.TotalReviews > 0 {
		stats.WouldRepurchasePercentage = float64(result.WouldRepurchaseCount) / float64(stats.TotalReviews) * 100
		stats.VerifiedPurchasePercentage = float64(result.VerifiedCount) / float64(stats.TotalReviews) * 100
		stats.HelpfulVotesPercentage = float64(result.TotalHelpfulVotes) / float64(stats.TotalReviews)
	}

	// Get rating distribution
	stats.RatingDistribution = make(map[int]int)
	for i := 1; i <= 5; i++ {
		var count int64
		r.DB.Model(&EnhancedReviewGORM{}).
			Where("perfume_id = ? AND overall_rating = ?", perfumeID, i).
			Count(&count)
		stats.RatingDistribution[i] = int(count)
	}

	// Get longevity distribution
	longevityRatings := []string{"very-poor", "poor", "average", "good", "excellent"}
	stats.LongevityDistribution = make(map[string]int)
	for _, rating := range longevityRatings {
		var count int64
		r.DB.Model(&EnhancedReviewGORM{}).
			Where("perfume_id = ? AND longevity_rating = ?", perfumeID, rating).
			Count(&count)
		stats.LongevityDistribution[rating] = int(count)
	}

	// Get sillage distribution
	sillageRatings := []string{"very-light", "light", "moderate", "heavy", "very-heavy"}
	stats.SillageDistribution = make(map[string]int)
	for _, rating := range sillageRatings {
		var count int64
		r.DB.Model(&EnhancedReviewGORM{}).
			Where("perfume_id = ? AND sillage_rating = ?", perfumeID, rating).
			Count(&count)
		stats.SillageDistribution[rating] = int(count)
	}

	// Get average longevity and sillage ratings (most common)
	var avgLongevity, avgSillage string
	r.DB.Model(&EnhancedReviewGORM{}).
		Select("longevity_rating").
		Where("perfume_id = ?", perfumeID).
		Group("longevity_rating").
		Order("COUNT(*) DESC").
		Limit(1).
		Scan(&avgLongevity)
	r.DB.Model(&EnhancedReviewGORM{}).
		Select("sillage_rating").
		Where("perfume_id = ?", perfumeID).
		Group("sillage_rating").
		Order("COUNT(*) DESC").
		Limit(1).
		Scan(&avgSillage)
	stats.AverageLongevityRating = avgLongevity
	stats.AverageSillageRating = avgSillage

	// Get popular occasions (simplified - this would need more complex JSON parsing in real implementation)
	// For now, we'll use a placeholder
	stats.PopularOccasions = []PopularUsage{}
	stats.PopularSeasons = []PopularUsage{}

	// Get recent reviews count (last 30 days)
	var recentCount int64
	r.DB.Model(&EnhancedReviewGORM{}).
		Where("perfume_id = ? AND created_at >= datetime('now', '-30 days')", perfumeID).
		Count(&recentCount)
	stats.RecentReviewsCount = int(recentCount)

	// Calculate engagement score
	var avgCommentLength float64
	r.DB.Model(&EnhancedReviewGORM{}).
		Select("AVG(LENGTH(comment))").
		Where("perfume_id = ?", perfumeID).
		Scan(&avgCommentLength)
	stats.EngagementScore = (stats.AverageOverallRating + stats.HelpfulVotesPercentage + (avgCommentLength/100)) / 3

	return stats, nil
}

// MarkHelpful marks a review as helpful by a user
func (r *EnhancedReviewRepositoryGORM) MarkHelpful(reviewID int, userIdentifier string) error {
	// Check if user already voted
	var count int64
	if err := r.DB.Model(&ReviewHelpfulVote{}).
		Where("review_id = ? AND user_identifier = ?", reviewID, userIdentifier).
		Count(&count).Error; err != nil {
		return fmt.Errorf("failed to check existing vote: %w", err)
	}

	if count > 0 {
		return fmt.Errorf("user already marked this review as helpful")
	}

	// Use transaction
	return r.DB.Transaction(func(tx *gorm.DB) error {
		// Add vote
		if err := tx.Create(&ReviewHelpfulVote{
			ReviewID:       reviewID,
			UserIdentifier: userIdentifier,
		}).Error; err != nil {
			return fmt.Errorf("failed to add helpful vote: %w", err)
		}

		// Update helpful count
		if err := tx.Model(&EnhancedReviewGORM{}).
			Where("id = ?", reviewID).
			Update("helpful_count", gorm.Expr("helpful_count + 1")).Error; err != nil {
			return fmt.Errorf("failed to update helpful count: %w", err)
		}

		return nil
	})
}

// ReportReview reports a review
func (r *EnhancedReviewRepositoryGORM) ReportReview(reviewID int, reason, description, userIdentifier string) error {
	if err := r.DB.Create(&ReviewReport{
		ReviewID:       reviewID,
		Reason:         reason,
		Description:    description,
		UserIdentifier: userIdentifier,
	}).Error; err != nil {
		return fmt.Errorf("failed to report review: %w", err)
	}

	return nil
}

// parseJSONFields parses JSON string fields to slices for response
func (r *EnhancedReviewRepositoryGORM) parseJSONFields(review *EnhancedReviewGORM) {
	if review.Pros != "" {
		json.Unmarshal([]byte(review.Pros), &review.ProsParsed)
	}
	if review.Cons != "" {
		json.Unmarshal([]byte(review.Cons), &review.ConsParsed)
	}
	if review.Occasions != "" {
		json.Unmarshal([]byte(review.Occasions), &review.OccasionsParsed)
	}
	if review.Seasons != "" {
		json.Unmarshal([]byte(review.Seasons), &review.SeasonsParsed)
	}
}