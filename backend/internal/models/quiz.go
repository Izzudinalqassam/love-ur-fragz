package models

import "time"

// Personality Quiz Models
type PersonalityQuiz struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"not null"`
	Email       string    `json:"email"`
	Age         int       `json:"age"`
	Gender      string    `json:"gender"`
	Lifestyle   string    `json:"lifestyle"`   // active, relaxed, professional, creative
	Preferences QuizPreferences `json:"preferences" gorm:"embedded"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type QuizPreferences struct {
	// Occasion preferences
	DailyWear       bool   `json:"daily_wear"`
	SpecialEvents   bool   `json:"special_events"`
	NightOut        bool   `json:"night_out"`
	Work            bool   `json:"work"`
	Dates           bool   `json:"dates"`

	// Seasonal preferences
	Spring          bool   `json:"spring"`
	Summer          bool   `json:"summer"`
	Fall            bool   `json:"fall"`
	Winter          bool   `json:"winter"`
	YearRound       bool   `json:"year_round"`

	// Scent preferences
	LightFresh      bool   `json:"light_fresh"`
	WarmSpicy       bool   `json:"warm_spicy"`
	SweetGourmand   bool   `json:"sweet_gourmand"`
	WoodyEarthy     bool   `json:"woody_earthy"`
	FloralRomantic  bool   `json:"floral_romantic"`
	CitrusEnergizing bool  `json:"citrus_energizing"`

	// Performance preferences
	Longevity       string `json:"longevity"`       // light, medium, long
	Sillage         string `json:"sillage"`         // subtle, moderate, heavy
	Projection      string `json:"projection"`      // close, moderate, far

	// Style preferences
	Classic         bool   `json:"classic"`
	Modern          bool   `json:"modern"`
	Unique          bool   `json:"unique"`
	SafeBet         bool   `json:"safe_bet"`

	// Budget preference
	PriceRange      string `json:"price_range"`     // budget, mid, luxury, designer
}

type UserProfile struct {
	ID              uint              `json:"id" gorm:"primaryKey"`
	QuizID          uint              `json:"quiz_id" gorm:"index"`
	Quiz            PersonalityQuiz   `json:"quiz" gorm:"foreignKey:QuizID"`

	// Computed preferences
	ScentProfile    ScentProfile      `json:"scent_profile" gorm:"embedded"`

	// Interaction history
	ViewedPerfumes  []uint            `json:"viewed_perfumes" gorm:"serializer:json"`
	FavoritedPerfumes []uint          `json:"favorited_perfumes" gorm:"serializer:json"`

	// Recommendation history
	RecommendationHistory []RecommendationRecord `json:"recommendation_history" gorm:"serializer:json"`

	CreatedAt       time.Time         `json:"created_at"`
	UpdatedAt       time.Time         `json:"updated_at"`
}

type ScentProfile struct {
	PrimaryFamilies   []string  `json:"primary_families"`
	SecondaryFamilies []string  `json:"secondary_families"`
	PreferredNotes    []string  `json:"preferred_notes"`
	AvoidedNotes      []string  `json:"avoided_notes"`

	// Personality traits
	AdventurousLevel float64   `json:"adventurous_level"`    // 0-1
	EleganceLevel     float64   `json:"elegance_level"`       // 0-1
	EnergyLevel       float64   `json:"energy_level"`         // 0-1
	RomanceLevel      float64   `json:"romance_level"`        // 0-1

	// Seasonal weights
	SpringWeight      float64   `json:"spring_weight"`       // 0-1
	SummerWeight      float64   `json:"summer_weight"`       // 0-1
	FallWeight        float64   `json:"fall_weight"`         // 0-1
	WinterWeight      float64   `json:"winter_weight"`       // 0-1

	// Occasion weights
	CasualWeight      float64   `json:"casual_weight"`       // 0-1
	FormalWeight      float64   `json:"formal_weight"`       // 0-1
	EveningWeight     float64   `json:"evening_weight"`      // 0-1
	ProfessionalWeight float64 `json:"professional_weight"` // 0-1
}

type RecommendationRecord struct {
	QuizResponse      QuizPreferences    `json:"quiz_response"`
	RecommendedPerfumes []PerfumeScore  `json:"recommended_perfumes"`
	UserFeedback      []FeedbackRecord  `json:"user_feedback"`
	Timestamp         time.Time         `json:"timestamp"`
}

type PerfumeScore struct {
	PerfumeID    uint    `json:"perfume_id"`
	Perfume      Perfume `json:"perfume"`
	Score        float64 `json:"score"`
	MatchReason  string  `json:"match_reason"`
	Confidence   float64 `json:"confidence"`
}

type FeedbackRecord struct {
	PerfumeID    uint    `json:"perfume_id"`
	Rating       int     `json:"rating"`         // 1-5
	Feedback     string  `json:"feedback"`
	Purchased    bool    `json:"purchased"`
	Timestamp    time.Time `json:"timestamp"`
}

// Advanced Recommendation Request
type AdvancedRecommendationRequest struct {
	QuizPreferences      `json:"quiz_preferences"`
	CurrentSituation     string `json:"current_situation"`      // work, date, casual, special
	Season              string `json:"season"`                   // spring, summer, fall, winter
	TimeOfDay           string `json:"time_of_day"`             // morning, afternoon, evening, night
	DesiredImpression   string `json:"desired_impression"`      // confident, elegant, playful, mysterious
	MaxResults          int    `json:"max_results"`             // default: 6
	ExcludeIDs          []uint `json:"exclude_ids"`             // previously viewed/not interested
}

type AdvancedRecommendationResponse struct {
	Results              []AdvancedRecommendationResult `json:"results"`
	PersonalityAnalysis  PersonalityAnalysis           `json:"personality_analysis"`
	RecommendationLogic  RecommendationLogic          `json:"recommendation_logic"`
	Tips                 []string                      `json:"tips"`
	Alternatives         []Perfume                     `json:"alternatives"`
}

type AdvancedRecommendationResult struct {
	Perfume             Perfume   `json:"perfume"`
	OverallScore        float64   `json:"overall_score"`

	// Detailed scoring breakdown
	ProfileMatch        float64   `json:"profile_match"`        // 0-1
	SeasonMatch         float64   `json:"season_match"`         // 0-1
	OccasionMatch       float64   `json:"occasion_match"`       // 0-1
	PerformanceMatch    float64   `json:"performance_match"`    // 0-1
	UniquenessBonus     float64   `json:"uniqueness_bonus"`     // 0-1

	MatchReasons        []string  `json:"match_reasons"`
	Warnings            []string  `json:"warnings"`
	BestFor            []string  `json:"best_for"`
	WearTiming         []string  `json:"wear_timing"`
	Longevity           string    `json:"longevity"`
	Projection          string    `json:"projection"`

	Confidence          float64   `json:"confidence"`           // 0-1
	Rank                int       `json:"rank"`
}

type PersonalityAnalysis struct {
	ScentPersonality    string   `json:"scent_personality"`     // "The Romantic Explorer", etc.
	KeyTraits          []string `json:"key_traits"`
	StyleDescription    string   `json:"style_description"`
	RecommendationStyle string   `json:"recommendation_style"`
}

type RecommendationLogic struct {
	Algorithm          string   `json:"algorithm"`
	FactorsConsidered  []string `json:"factors_considered"`
	Weighting          map[string]float64 `json:"weighting"`
	ProcessDescription string   `json:"process_description"`
}