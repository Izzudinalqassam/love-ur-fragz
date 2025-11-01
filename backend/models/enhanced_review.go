package models

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"time"
)

// EnhancedReview represents the enhanced review model
type EnhancedReview struct {
	ID                  int       `json:"id"`
	PerfumeID           int       `json:"perfume_id"`
	UserName            string    `json:"user_name"`
	UserEmail          string    `json:"user_email,omitempty"`
	OverallRating       int       `json:"overall_rating"`
	LongevityRating     string    `json:"longevity_rating"`
	SillageRating       string    `json:"sillage_rating"`
	ValueRating         int       `json:"value_rating"`
	Title               string    `json:"title"`
	Comment             string    `json:"comment"`
	Pros               []string  `json:"pros"`
	Cons               []string  `json:"cons"`
	Occasions          []string  `json:"occasions"`
	Seasons            []string  `json:"seasons"`
	WouldRepurchase    bool      `json:"would_repurchase"`
	IsVerifiedPurchase bool      `json:"is_verified_purchase"`
	HelpfulCount       int       `json:"helpful_count"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

// EnhancedReviewStats represents statistics for enhanced reviews
type EnhancedReviewStats struct {
	PerfumeID                    int                    `json:"perfume_id"`
	TotalReviews                 int                    `json:"total_reviews"`
	AverageOverallRating         float64                `json:"average_overall_rating"`
	AverageLongevityRating       string                 `json:"average_longevity_rating"`
	AverageSillageRating         string                 `json:"average_sillage_rating"`
	AverageValueRating           float64                `json:"average_value_rating"`
	RatingDistribution           map[int]int            `json:"rating_distribution"`
	LongevityDistribution        map[string]int         `json:"longevity_distribution"`
	SillageDistribution          map[string]int         `json:"sillage_distribution"`
	PopularOccasions             []PopularUsage         `json:"popular_occasions"`
	PopularSeasons               []PopularUsage         `json:"popular_seasons"`
	WouldRepurchasePercentage    float64                `json:"would_repurchase_percentage"`
	VerifiedPurchasePercentage   float64                `json:"verified_purchase_percentage"`
	HelpfulVotesPercentage       float64                `json:"helpful_votes_percentage"`
	RecentReviewsCount           int                    `json:"recent_reviews_count"`
	EngagementScore              float64                `json:"engagement_score"`
}

// PopularUsage represents popular occasions/seasons
type PopularUsage struct {
	Occasion string `json:"occasion"`
	Count    int    `json:"count"`
}

// CreateEnhancedReviewRequest represents request to create enhanced review
type CreateEnhancedReviewRequest struct {
	PerfumeID           int      `json:"perfume_id" validate:"required"`
	UserName            string   `json:"user_name" validate:"required,min=2,max=100"`
	UserEmail          string   `json:"user_email,omitempty" validate:"omitempty,email,max=255"`
	OverallRating       int      `json:"overall_rating" validate:"required,min=1,max=5"`
	LongevityRating     string   `json:"longevity_rating" validate:"required,oneof=very-poor poor average good excellent"`
	SillageRating       string   `json:"sillage_rating" validate:"required,oneof=very-light light moderate heavy very-heavy"`
	ValueRating         int      `json:"value_rating" validate:"required,min=1,max=5"`
	Title               string   `json:"title" validate:"required,min=5,max=500"`
	Comment             string   `json:"comment" validate:"required,min=20,max=2000"`
	Pros               []string `json:"pros" validate:"dive,min=1,max=100"`
	Cons               []string `json:"cons" validate:"dive,min=1,max=100"`
	Occasions          []string `json:"occasions" validate:"dive,oneof=daily work casual date-night formal party wedding sport travel special-occasion"`
	Seasons            []string `json:"seasons" validate:"dive,oneof=spring summer fall winter all-season"`
	WouldRepurchase    bool     `json:"would_repurchase"`
}

// ReviewFilterOptions represents filtering options
type ReviewFilterOptions struct {
	PerfumeID          int      `json:"perfume_id"`
	Rating            *int     `json:"rating,omitempty"`
	Longevity         string   `json:"longevity,omitempty"`
	Sillage           string   `json:"sillage,omitempty"`
	WouldRepurchase   *bool    `json:"would_repurchase,omitempty"`
	VerifiedPurchase  *bool    `json:"verified_purchase,omitempty"`
	SearchTerm        string   `json:"search_term,omitempty"`
	SortBy            string   `json:"sort_by,omitempty"` // most-recent, most-helpful, highest-rating, lowest-rating
	Limit             int      `json:"limit,omitempty"`
	Offset            int      `json:"offset,omitempty"`
}

// EnhancedReviewModel handles enhanced review database operations
type EnhancedReviewModel struct {
	DB *sql.DB
}

// NewEnhancedReviewModel creates a new enhanced review model
func NewEnhancedReviewModel(db *sql.DB) *EnhancedReviewModel {
	return &EnhancedReviewModel{DB: db}
}

// Create creates a new enhanced review
func (m *EnhancedReviewModel) Create(review *CreateEnhancedReviewRequest) (*EnhancedReview, error) {
	// Convert slices to JSON
	prosJSON, _ := json.Marshal(review.Pros)
	consJSON, _ := json.Marshal(review.Cons)
	occasionsJSON, _ := json.Marshal(review.Occasions)
	seasonsJSON, _ := json.Marshal(review.Seasons)

	query := `
		INSERT INTO enhanced_reviews (
			perfume_id, user_name, user_email, overall_rating, longevity_rating,
			sillage_rating, value_rating, title, comment, pros, cons, occasions,
			seasons, would_repurchase, is_verified_purchase
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	result, err := m.DB.Exec(query,
		review.PerfumeID, review.UserName, review.UserEmail, review.OverallRating,
		review.LongevityRating, review.SillageRating, review.ValueRating,
		review.Title, review.Comment, string(prosJSON), string(consJSON),
		string(occasionsJSON), string(seasonsJSON), review.WouldRepurchase, false,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create enhanced review: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, fmt.Errorf("failed to get last insert id: %w", err)
	}

	return m.GetByID(int(id))
}

// GetByID retrieves an enhanced review by ID
func (m *EnhancedReviewModel) GetByID(id int) (*EnhancedReview, error) {
	query := `
		SELECT id, perfume_id, user_name, user_email, overall_rating, longevity_rating,
			   sillage_rating, value_rating, title, comment, pros, cons, occasions,
			   seasons, would_repurchase, is_verified_purchase, helpful_count,
			   created_at, updated_at
		FROM enhanced_reviews
		WHERE id = ?
	`

	review := &EnhancedReview{}
	var prosJSON, consJSON, occasionsJSON, seasonsJSON string

	err := m.DB.QueryRow(query, id).Scan(
		&review.ID, &review.PerfumeID, &review.UserName, &review.UserEmail,
		&review.OverallRating, &review.LongevityRating, &review.SillageRating,
		&review.ValueRating, &review.Title, &review.Comment, &prosJSON, &consJSON,
		&occasionsJSON, &seasonsJSON, &review.WouldRepurchase,
		&review.IsVerifiedPurchase, &review.HelpfulCount, &review.CreatedAt,
		&review.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("enhanced review not found")
		}
		return nil, fmt.Errorf("failed to get enhanced review: %w", err)
	}

	// Parse JSON fields
	json.Unmarshal([]byte(prosJSON), &review.Pros)
	json.Unmarshal([]byte(consJSON), &review.Cons)
	json.Unmarshal([]byte(occasionsJSON), &review.Occasions)
	json.Unmarshal([]byte(seasonsJSON), &review.Seasons)

	return review, nil
}

// GetByPerfumeID retrieves enhanced reviews for a perfume with filtering and sorting
func (m *EnhancedReviewModel) GetByPerfumeID(options ReviewFilterOptions) ([]*EnhancedReview, error) {
	whereClause := "WHERE perfume_id = ?"
	args := []interface{}{options.PerfumeID}

	// Add filters
	if options.Rating != nil {
		whereClause += " AND overall_rating = ?"
		args = append(args, *options.Rating)
	}

	if options.Longevity != "" && options.Longevity != "all" {
		whereClause += " AND longevity_rating = ?"
		args = append(args, options.Longevity)
	}

	if options.Sillage != "" && options.Sillage != "all" {
		whereClause += " AND sillage_rating = ?"
		args = append(args, options.Sillage)
	}

	if options.WouldRepurchase != nil {
		whereClause += " AND would_repurchase = ?"
		args = append(args, *options.WouldRepurchase)
	}

	if options.VerifiedPurchase != nil {
		whereClause += " AND is_verified_purchase = ?"
		args = append(args, *options.VerifiedPurchase)
	}

	if options.SearchTerm != "" {
		whereClause += " AND (title LIKE ? OR comment LIKE ? OR user_name LIKE ?)"
		searchPattern := "%" + options.SearchTerm + "%"
		args = append(args, searchPattern, searchPattern, searchPattern)
	}

	// Add sorting
	orderBy := "ORDER BY created_at DESC"
	switch options.SortBy {
	case "most-helpful":
		orderBy = "ORDER BY helpful_count DESC, created_at DESC"
	case "highest-rating":
		orderBy = "ORDER BY overall_rating DESC, created_at DESC"
	case "lowest-rating":
		orderBy = "ORDER BY overall_rating ASC, created_at DESC"
	}

	// Add pagination
	limitClause := ""
	if options.Limit > 0 {
		limitClause = "LIMIT ?"
		args = append(args, options.Limit)
		if options.Offset > 0 {
			limitClause += " OFFSET ?"
			args = append(args, options.Offset)
		}
	}

	query := fmt.Sprintf(`
		SELECT id, perfume_id, user_name, user_email, overall_rating, longevity_rating,
			   sillage_rating, value_rating, title, comment, pros, cons, occasions,
			   seasons, would_repurchase, is_verified_purchase, helpful_count,
			   created_at, updated_at
		FROM enhanced_reviews
		%s %s %s
	`, whereClause, orderBy, limitClause)

	rows, err := m.DB.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to query enhanced reviews: %w", err)
	}
	defer rows.Close()

	var reviews []*EnhancedReview
	for rows.Next() {
		review := &EnhancedReview{}
		var prosJSON, consJSON, occasionsJSON, seasonsJSON string

		err := rows.Scan(
			&review.ID, &review.PerfumeID, &review.UserName, &review.UserEmail,
			&review.OverallRating, &review.LongevityRating, &review.SillageRating,
			&review.ValueRating, &review.Title, &review.Comment, &prosJSON, &consJSON,
			&occasionsJSON, &seasonsJSON, &review.WouldRepurchase,
			&review.IsVerifiedPurchase, &review.HelpfulCount, &review.CreatedAt,
			&review.UpdatedAt,
		)

		if err != nil {
			return nil, fmt.Errorf("failed to scan enhanced review: %w", err)
		}

		// Parse JSON fields
		json.Unmarshal([]byte(prosJSON), &review.Pros)
		json.Unmarshal([]byte(consJSON), &review.Cons)
		json.Unmarshal([]byte(occasionsJSON), &review.Occasions)
		json.Unmarshal([]byte(seasonsJSON), &review.Seasons)

		reviews = append(reviews, review)
	}

	return reviews, nil
}

// GetStats retrieves enhanced review statistics for a perfume
func (m *EnhancedReviewModel) GetStats(perfumeID int) (*EnhancedReviewStats, error) {
	stats := &EnhancedReviewStats{PerfumeID: perfumeID}

	// Get basic stats
	query := `
		SELECT
			COUNT(*) as total_reviews,
			AVG(overall_rating) as avg_overall_rating,
			AVG(value_rating) as avg_value_rating,
			COUNT(CASE WHEN would_repurchase = 1 THEN 1 END) as would_repurchase_count,
			COUNT(CASE WHEN is_verified_purchase = 1 THEN 1 END) as verified_count,
			SUM(helpful_count) as total_helpful_votes
		FROM enhanced_reviews
		WHERE perfume_id = ?
	`

	var avgOverall, avgValue sql.NullFloat64
	var wouldRepurchaseCount, verifiedCount, totalHelpfulVotes int

	err := m.DB.QueryRow(query, perfumeID).Scan(
		&stats.TotalReviews, &avgOverall, &avgValue,
		&wouldRepurchaseCount, &verifiedCount, &totalHelpfulVotes,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to get basic stats: %w", err)
	}

	if avgOverall.Valid {
		stats.AverageOverallRating = avgOverall.Float64
	}
	if avgValue.Valid {
		stats.AverageValueRating = avgValue.Float64
	}

	if stats.TotalReviews > 0 {
		stats.WouldRepurchasePercentage = float64(wouldRepurchaseCount) / float64(stats.TotalReviews) * 100
		stats.VerifiedPurchasePercentage = float64(verifiedCount) / float64(stats.TotalReviews) * 100
		stats.HelpfulVotesPercentage = float64(totalHelpfulVotes) / float64(stats.TotalReviews)
	}

	// Get rating distribution
	stats.RatingDistribution = make(map[int]int)
	for i := 1; i <= 5; i++ {
		var count int
		m.DB.QueryRow("SELECT COUNT(*) FROM enhanced_reviews WHERE perfume_id = ? AND overall_rating = ?", perfumeID, i).Scan(&count)
		stats.RatingDistribution[i] = count
	}

	// Get longevity distribution
	longevityRatings := []string{"very-poor", "poor", "average", "good", "excellent"}
	stats.LongevityDistribution = make(map[string]int)
	for _, rating := range longevityRatings {
		var count int
		m.DB.QueryRow("SELECT COUNT(*) FROM enhanced_reviews WHERE perfume_id = ? AND longevity_rating = ?", perfumeID, rating).Scan(&count)
		stats.LongevityDistribution[rating] = count
	}

	// Get sillage distribution
	sillageRatings := []string{"very-light", "light", "moderate", "heavy", "very-heavy"}
	stats.SillageDistribution = make(map[string]int)
	for _, rating := range sillageRatings {
		var count int
		m.DB.QueryRow("SELECT COUNT(*) FROM enhanced_reviews WHERE perfume_id = ? AND sillage_rating = ?", perfumeID, rating).Scan(&count)
		stats.SillageDistribution[rating] = count
	}

	// Get average longevity and sillage ratings
	var avgLongevity, avgSillage string
	m.DB.QueryRow(`
		SELECT longevity_rating FROM enhanced_reviews
		WHERE perfume_id = ? GROUP BY longevity_rating
		ORDER BY COUNT(*) DESC LIMIT 1
	`, perfumeID).Scan(&avgLongevity)
	m.DB.QueryRow(`
		SELECT sillage_rating FROM enhanced_reviews
		WHERE perfume_id = ? GROUP BY sillage_rating
		ORDER BY COUNT(*) DESC LIMIT 1
	`, perfumeID).Scan(&avgSillage)
	stats.AverageLongevityRating = avgLongevity
	stats.AverageSillageRating = avgSillage

	// Get popular occasions (parse JSON and count)
	occasionsQuery := `
		SELECT occasions FROM enhanced_reviews WHERE perfume_id = ? AND occasions IS NOT NULL AND occasions != ''
	`
	rows, err := m.DB.Query(occasionsQuery, perfumeID)
	if err == nil {
		defer rows.Close()
		occasionCounts := make(map[string]int)
		for rows.Next() {
			var occasionsJSON string
			rows.Scan(&occasionsJSON)
			var occasions []string
			json.Unmarshal([]byte(occasionsJSON), &occasions)
			for _, occasion := range occasions {
				occasionCounts[occasion]++
			}
		}

		// Convert to popular usage format and sort
		for occasion, count := range occasionCounts {
			stats.PopularOccasions = append(stats.PopularOccasions, PopularUsage{Occasion: occasion, Count: count})
		}
	}

	// Get recent reviews count (last 30 days)
	m.DB.QueryRow(`
		SELECT COUNT(*) FROM enhanced_reviews
		WHERE perfume_id = ? AND created_at >= datetime('now', '-30 days')
	`, perfumeID).Scan(&stats.RecentReviewsCount)

	// Calculate engagement score (based on ratings, comments length, helpful votes)
	var avgCommentLength float64
	m.DB.QueryRow("SELECT AVG(LENGTH(comment)) FROM enhanced_reviews WHERE perfume_id = ?", perfumeID).Scan(&avgCommentLength)
	stats.EngagementScore = (stats.AverageOverallRating + stats.HelpfulVotesPercentage + (avgCommentLength/100)) / 3

	return stats, nil
}

// MarkHelpful marks a review as helpful by a user
func (m *EnhancedReviewModel) MarkHelpful(reviewID int, userIdentifier string) error {
	// Check if user already voted
	var count int
	err := m.DB.QueryRow("SELECT COUNT(*) FROM review_helpful_votes WHERE review_id = ? AND user_identifier = ?", reviewID, userIdentifier).Scan(&count)
	if err != nil {
		return fmt.Errorf("failed to check existing vote: %w", err)
	}

	if count > 0 {
		return fmt.Errorf("user already marked this review as helpful")
	}

	// Add vote
	_, err = m.DB.Exec("INSERT INTO review_helpful_votes (review_id, user_identifier) VALUES (?, ?)", reviewID, userIdentifier)
	if err != nil {
		return fmt.Errorf("failed to add helpful vote: %w", err)
	}

	// Update helpful count
	_, err = m.DB.Exec("UPDATE enhanced_reviews SET helpful_count = helpful_count + 1 WHERE id = ?", reviewID)
	if err != nil {
		return fmt.Errorf("failed to update helpful count: %w", err)
	}

	return nil
}

// ReportReview reports a review
func (m *EnhancedReviewModel) ReportReview(reviewID int, reason, description, userIdentifier string) error {
	_, err := m.DB.Exec(`
		INSERT INTO review_reports (review_id, reason, description, user_identifier)
		VALUES (?, ?, ?, ?)
	`, reviewID, reason, description, userIdentifier)

	if err != nil {
		return fmt.Errorf("failed to report review: %w", err)
	}

	return nil
}