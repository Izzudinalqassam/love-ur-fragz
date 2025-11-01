package models

import "time"

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
	OverallRating       int      `json:"overall_rating" validate:"required,min=1,max=5"`
	LongevityRating     string   `json:"longevity_rating" validate:"required,oneof=very-poor poor average good excellent"`
	SillageRating       string   `json:"sillage_rating" validate:"required,oneof=very-light light moderate heavy very-heavy"`
	ValueRating         int      `json:"value_rating" validate:"required,min=1,max=5"`
	Title               string   `json:"title" validate:"required,min=3,max=200"`
	Comment             string   `json:"comment" validate:"required,min=10,max=1000"`
	Pros               []string `json:"pros" validate:"dive,min=1,max=50"`
	Cons               []string `json:"cons" validate:"dive,min=1,max=50"`
	Occasions          []string `json:"occasions" validate:"dive,oneof=daily work casual date-night formal party special-occasion"`
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

// ReviewHelpfulVote represents helpful vote tracking
type ReviewHelpfulVote struct {
	ID             int       `json:"id" gorm:"primaryKey"`
	ReviewID       int       `json:"review_id" gorm:"not null"`
	UserIdentifier string    `json:"user_identifier" gorm:"not null;size:255"`
	CreatedAt      time.Time `json:"created_at" gorm:"autoCreateTime"`
}

// TableName specifies the table name for ReviewHelpfulVote
func (ReviewHelpfulVote) TableName() string {
	return "review_helpful_votes"
}

// ReviewReport represents review reports
type ReviewReport struct {
	ID             int       `json:"id" gorm:"primaryKey"`
	ReviewID       int       `json:"review_id" gorm:"not null"`
	Reason         string    `json:"reason" gorm:"not null;size:255"`
	Description    string    `json:"description" gorm:"type:text"`
	UserIdentifier string    `json:"user_identifier" gorm:"not null;size:255"`
	CreatedAt      time.Time `json:"created_at" gorm:"autoCreateTime"`
}

// TableName specifies the table name for ReviewReport
func (ReviewReport) TableName() string {
	return "review_reports"
}