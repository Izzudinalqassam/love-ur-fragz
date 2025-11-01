package services

import (
	"fmt"
	"math"
	"sort"
	"strings"
	"time"

	"perfume-website/internal/models"
	"perfume-website/internal/repositories"
)

type QuizService struct {
	quizRepo      repositories.QuizRepository
	perfumeRepo   repositories.PerfumeRepository
	aromaRepo     repositories.AromaRepository
}

func NewQuizService(quizRepo repositories.QuizRepository, perfumeRepo repositories.PerfumeRepository, aromaRepo repositories.AromaRepository) *QuizService {
	return &QuizService{
		quizRepo:    quizRepo,
		perfumeRepo: perfumeRepo,
		aromaRepo:   aromaRepo,
	}
}

// GetAdvancedRecommendations generates personalized perfume recommendations based on quiz responses
func (s *QuizService) GetAdvancedRecommendations(req models.AdvancedRecommendationRequest) (*models.AdvancedRecommendationResponse, error) {
	// Get personality analysis
	personality := s.analyzePersonality(req.QuizPreferences)

	// Get candidate perfumes from database
	perfumes, err := s.getCandidatePerfumes(req)
	if err != nil {
		return nil, fmt.Errorf("failed to get candidate perfumes: %w", err)
	}

	// Score each perfume
	results := s.scorePerfumes(perfumes, req, personality)

	// Sort by overall score
	sort.Slice(results, func(i, j int) bool {
		return results[i].OverallScore > results[j].OverallScore
	})

	// Limit results
	if len(results) > req.MaxResults {
		results = results[:req.MaxResults]
	}

	// Generate tips
	tips := s.generateTips(personality, req.QuizPreferences)

	// Get alternatives (perfumes with slightly different profiles)
	alternatives := s.getAlternatives(results, req)

	response := &models.AdvancedRecommendationResponse{
		Results:             results,
		PersonalityAnalysis: personality,
		RecommendationLogic: models.RecommendationLogic{
			Algorithm:          "Multi-Factor Advanced Recommendation v2.0",
			FactorsConsidered:  []string{"Profile Match", "Season Suitability", "Occasion Appropriateness", "Performance Match", "Uniqueness Bonus"},
			Weighting:          map[string]float64{"profile": 0.4, "season": 0.2, "occasion": 0.2, "performance": 0.1, "uniqueness": 0.1},
			ProcessDescription: "Our algorithm analyzes your personality traits, scent preferences, and usage patterns to find perfect matches from our database of 940+ perfumes.",
		},
		Tips:         tips,
		Alternatives: alternatives,
	}

	return response, nil
}

// SaveQuizResponse saves a quiz response to the database
func (s *QuizService) SaveQuizResponse(quiz models.PersonalityQuiz) (*models.PersonalityQuiz, error) {
	quiz.CreatedAt = time.Now()
	quiz.UpdatedAt = time.Now()

	err := s.quizRepo.SaveQuizResponse(&quiz)
	if err != nil {
		return nil, fmt.Errorf("failed to save quiz response: %w", err)
	}

	return &quiz, nil
}

// GetQuizStatistics returns statistics about quiz responses
func (s *QuizService) GetQuizStatistics() (map[string]interface{}, error) {
	return s.quizRepo.GetQuizStatistics()
}

// GetPersonalityTypes returns available personality types
func (s *QuizService) GetPersonalityTypes() []map[string]interface{} {
	return []map[string]interface{}{
		{
			"type":        "The Romantic Elegant",
			"traits":      []string{"Sophisticated", "Charming", "Timeless"},
			"description": "You appreciate classic, romantic fragrances that exude elegance and grace.",
			"best_notes":  []string{"Rose", "Jasmine", "Vanilla", "Amber"},
		},
		{
			"type":        "The Adventurous Explorer",
			"traits":      []string{"Bold", "Curious", "Free-spirited"},
			"description": "You love unique, unconventional scents that tell a story and make a statement.",
			"best_notes":  []string{"Leather", "Incense", "Oud", "Spices"},
		},
		{
			"type":        "The Modern Professional",
			"traits":      []string{"Confident", "Sophisticated", "Ambitious"},
			"description": "You prefer clean, contemporary fragrances that project success and refinement.",
			"best_notes":  []string{"Citrus", "Vetiver", "Sandalwood", "Musk"},
		},
		{
			"type":        "The Creative Soul",
			"traits":      []string{"Artistic", "Expressive", "Unique"},
			"description": "You're drawn to artistic, complex compositions that inspire creativity and individuality.",
			"best_notes":  []string{"Patchouli", "Incense", "Unusual Florals", "Gourmand"},
		},
		{
			"type":        "The Natural Spirit",
			"traits":      []string{"Grounded", "Authentic", "Harmonious"},
			"description": "You love earthy, natural scents that connect you to nature and create a sense of peace.",
			"best_notes":  []string{"Green Notes", "Woods", "Herbs", "Earth"},
		},
		{
			"type":        "The Charismatic Socialite",
			"traits":      []string{"Magnetic", "Energetic", "Sociable"},
			"description": "You enjoy bright, alluring fragrances that make you memorable and draw people in.",
			"best_notes":  []string{"Fruits", "Florals", "Sweet Notes", "Spices"},
		},
	}
}

// Private helper methods

func (s *QuizService) analyzePersonality(pref models.QuizPreferences) models.PersonalityAnalysis {
	var scentProfile []string
	var traits []string
	var personality string

	// Determine scent profile based on preferences
	scentScores := map[string]float64{
		"light_fresh":      0,
		"warm_spicy":       0,
		"sweet_gourmand":   0,
		"woody_earthy":     0,
		"floral_romantic":  0,
		"citrus_energizing": 0,
	}

	if pref.LightFresh {
		scentScores["light_fresh"]++
	}
	if pref.WarmSpicy {
		scentScores["warm_spicy"]++
	}
	if pref.SweetGourmand {
		scentScores["sweet_gourmand"]++
	}
	if pref.WoodyEarthy {
		scentScores["woody_earthy"]++
	}
	if pref.FloralRomantic {
		scentScores["floral_romantic"]++
	}
	if pref.CitrusEnergizing {
		scentScores["citrus_energizing"]++
	}

	// Find dominant scent profile
	maxScore := 0.0
	for profile, score := range scentScores {
		if score > maxScore {
			maxScore = score
			scentProfile = []string{profile}
		}
	}

	// Determine personality based on scent profile and other preferences
	switch {
	case pref.FloralRomantic && pref.SweetGourmand:
		personality = "The Romantic Elegant"
		traits = []string{"Sophisticated", "Charming", "Timeless"}
	case pref.WarmSpicy && pref.Unique:
		personality = "The Adventurous Explorer"
		traits = []string{"Bold", "Curious", "Free-spirited"}
	case pref.CitrusEnergizing && pref.Work:
		personality = "The Modern Professional"
		traits = []string{"Confident", "Sophisticated", "Ambitious"}
	case pref.WoodyEarthy && pref.Unique:
		personality = "The Creative Soul"
		traits = []string{"Artistic", "Expressive", "Unique"}
	case pref.LightFresh && pref.DailyWear:
		personality = "The Natural Spirit"
		traits = []string{"Grounded", "Authentic", "Harmonious"}
	default:
		personality = "The Charismatic Socialite"
		traits = []string{"Magnetic", "Energetic", "Sociable"}
	}

	return models.PersonalityAnalysis{
		ScentPersonality: personality,
		KeyTraits:        traits,
		StyleDescription: s.getStyleDescription(personality, scentProfile),
		RecommendationStyle: fmt.Sprintf("Based on your %s personality, we recommend fragrances that reflect your %s nature.",
			personality, strings.ToLower(strings.Join(traits, ", "))),
	}
}

func (s *QuizService) getStyleDescription(personality string, scentProfile []string) string {
	descriptions := map[string]string{
		"The Romantic Elegant":  "You appreciate classic, romantic fragrances that exude elegance and grace.",
		"The Adventurous Explorer": "You love unique, unconventional scents that tell a story and make a statement.",
		"The Modern Professional": "You prefer clean, contemporary fragrances that project success and refinement.",
		"The Creative Soul":     "You're drawn to artistic, complex compositions that inspire creativity and individuality.",
		"The Natural Spirit":    "You love earthy, natural scents that connect you to nature and create a sense of peace.",
		"The Charismatic Socialite": "You enjoy bright, alluring fragrances that make you memorable and draw people in.",
	}

	if desc, exists := descriptions[personality]; exists {
		return desc
	}
	return "You have unique preferences that deserve special consideration."
}

func (s *QuizService) getCandidatePerfumes(req models.AdvancedRecommendationRequest) ([]models.Perfume, error) {
	// Get all perfumes from database - in a real implementation, this would be more sophisticated
	perfumes, err := s.perfumeRepo.GetAllWithRelations()
	if err != nil {
		return nil, err
	}

	// Filter out excluded IDs
	if len(req.ExcludeIDs) > 0 {
		var filtered []models.Perfume
		for _, perfume := range perfumes {
			excluded := false
			for _, id := range req.ExcludeIDs {
				if perfume.ID == id {
					excluded = true
					break
				}
			}
			if !excluded {
				filtered = append(filtered, perfume)
			}
		}
		perfumes = filtered
	}

	return perfumes, nil
}

func (s *QuizService) scorePerfumes(perfumes []models.Perfume, req models.AdvancedRecommendationRequest, personality models.PersonalityAnalysis) []models.AdvancedRecommendationResult {
	var results []models.AdvancedRecommendationResult

	for i, perfume := range perfumes {
		result := s.scoreSinglePerfume(perfume, req, personality, i+1)
		results = append(results, result)
	}

	return results
}

func (s *QuizService) scoreSinglePerfume(perfume models.Perfume, req models.AdvancedRecommendationRequest, personality models.PersonalityAnalysis, rank int) models.AdvancedRecommendationResult {
	// Profile Match (40% weight)
	profileMatch := s.calculateProfileMatch(perfume, req.QuizPreferences)

	// Season Match (20% weight)
	seasonMatch := s.calculateSeasonMatch(perfume, req.Season)

	// Occasion Match (20% weight)
	occasionMatch := s.calculateOccasionMatch(perfume, req.CurrentSituation, req.QuizPreferences)

	// Performance Match (10% weight)
	performanceMatch := s.calculatePerformanceMatch(perfume, req.QuizPreferences)

	// Uniqueness Bonus (10% weight)
	uniquenessBonus := s.calculateUniquenessBonus(perfume, req.QuizPreferences)

	// Overall score calculation
	overallScore := (profileMatch * 0.4) + (seasonMatch * 0.2) + (occasionMatch * 0.2) + (performanceMatch * 0.1) + (uniquenessBonus * 0.1)

	// Generate match reasons
	matchReasons := s.generateMatchReasons(perfume, profileMatch, seasonMatch, occasionMatch, req.QuizPreferences)

	// Determine best for and wear timing
	bestFor := s.getBestFor(perfume, req.QuizPreferences)
	wearTiming := s.getWearTiming(perfume, req.QuizPreferences)

	return models.AdvancedRecommendationResult{
		Perfume:          perfume,
		OverallScore:     overallScore,
		ProfileMatch:     profileMatch,
		SeasonMatch:      seasonMatch,
		OccasionMatch:    occasionMatch,
		PerformanceMatch: performanceMatch,
		UniquenessBonus:  uniquenessBonus,
		MatchReasons:     matchReasons,
		BestFor:          bestFor,
		WearTiming:       wearTiming,
		Longevity:        perfume.Longevity,
		Projection:       perfume.Sillage,
		Confidence:       math.Min(overallScore+0.1, 1.0),
		Rank:             rank,
	}
}

func (s *QuizService) calculateProfileMatch(perfume models.Perfume, pref models.QuizPreferences) float64 {
	score := 0.5 // Base score

	// Check aroma tags match
	perfumeAromas := make(map[string]bool)
	for _, aroma := range perfume.AromaTags {
		perfumeAromas[strings.ToLower(aroma.Name)] = true
	}

	// Match with user preferences
	if pref.LightFresh && (perfumeAromas["citrus"] || perfumeAromas["fresh"] || perfumeAromas["aquatic"]) {
		score += 0.2
	}
	if pref.WarmSpicy && (perfumeAromas["spicy"] || perfumeAromas["warm"] || perfumeAromas["oriental"]) {
		score += 0.2
	}
	if pref.SweetGourmand && (perfumeAromas["sweet"] || perfumeAromas["vanilla"] || perfumeAromas["gourmand"]) {
		score += 0.2
	}
	if pref.WoodyEarthy && (perfumeAromas["woody"] || perfumeAromas["earthy"] || perfumeAromas["cedar"]) {
		score += 0.2
	}
	if pref.FloralRomantic && (perfumeAromas["floral"] || perfumeAromas["rose"] || perfumeAromas["jasmine"]) {
		score += 0.2
	}
	if pref.CitrusEnergizing && (perfumeAromas["citrus"] || perfumeAromas["bergamot"] || perfumeAromas["lemon"]) {
		score += 0.2
	}

	return math.Min(score, 1.0)
}

func (s *QuizService) calculateSeasonMatch(perfume models.Perfume, season string) float64 {
	// Simple season matching based on fragrance characteristics
	score := 0.6 // Base score

	switch season {
	case "spring":
		if strings.Contains(strings.ToLower(perfume.Description), "fresh") ||
			strings.Contains(strings.ToLower(perfume.Description), "floral") {
			score += 0.3
		}
	case "summer":
		if strings.Contains(strings.ToLower(perfume.Description), "light") ||
			strings.Contains(strings.ToLower(perfume.Description), "citrus") ||
			strings.Contains(strings.ToLower(perfume.Description), "aquatic") {
			score += 0.3
		}
	case "fall":
		if strings.Contains(strings.ToLower(perfume.Description), "warm") ||
			strings.Contains(strings.ToLower(perfume.Description), "spicy") ||
			strings.Contains(strings.ToLower(perfume.Description), "woody") {
			score += 0.3
		}
	case "winter":
		if strings.Contains(strings.ToLower(perfume.Description), "rich") ||
			strings.Contains(strings.ToLower(perfume.Description), "deep") ||
			strings.Contains(strings.ToLower(perfume.Description), "oriental") {
			score += 0.3
		}
	}

	return math.Min(score, 1.0)
}

func (s *QuizService) calculateOccasionMatch(perfume models.Perfume, occasion string, pref models.QuizPreferences) float64 {
	score := 0.6 // Base score

	// Match perfume characteristics with occasion
	switch occasion {
	case "work":
		if perfume.Sillage == "Light" || perfume.Sillage == "Medium" {
			score += 0.3
		}
		if strings.Contains(strings.ToLower(perfume.Brand), "professional") ||
			strings.Contains(strings.ToLower(perfume.Description), "clean") {
			score += 0.1
		}
	case "date":
		if strings.Contains(strings.ToLower(perfume.Description), "romantic") ||
			strings.Contains(strings.ToLower(perfume.Description), "seductive") {
			score += 0.3
		}
	case "casual":
		if perfume.Price < 150 && perfume.Sillage == "Light" {
			score += 0.3
		}
	case "special":
		if perfume.Price > 100 || perfume.Sillage == "Heavy" {
			score += 0.3
		}
	}

	return math.Min(score, 1.0)
}

func (s *QuizService) calculatePerformanceMatch(perfume models.Perfume, pref models.QuizPreferences) float64 {
	score := 0.5 // Base score

	// Longevity match
	switch pref.Longevity {
	case "light":
		if perfume.Longevity == "Light" {
			score += 0.3
		}
	case "medium":
		if perfume.Longevity == "Medium" {
			score += 0.3
		}
	case "long":
		if perfume.Longevity == "Long" || perfume.Longevity == "Very Long" {
			score += 0.3
		}
	}

	// Sillage match
	switch pref.Sillage {
	case "subtle":
		if perfume.Sillage == "Light" {
			score += 0.2
		}
	case "moderate":
		if perfume.Sillage == "Medium" {
			score += 0.2
		}
	case "heavy":
		if perfume.Sillage == "Heavy" || perfume.Sillage == "Very Heavy" {
			score += 0.2
		}
	}

	return math.Min(score, 1.0)
}

func (s *QuizService) calculateUniquenessBonus(perfume models.Perfume, pref models.QuizPreferences) float64 {
	if pref.Unique {
		// Bonus for less common brands or unique compositions
		if perfume.Price > 200 {
			return 0.8
		}
		return 0.6
	}

	if pref.SafeBet {
		// Bonus for popular, well-known options
		if perfume.Price < 100 {
			return 0.7
		}
	}

	return 0.5
}

func (s *QuizService) generateMatchReasons(perfume models.Perfume, profileMatch, seasonMatch, occasionMatch float64, pref models.QuizPreferences) []string {
	var reasons []string

	if profileMatch > 0.7 {
		reasons = append(reasons, "Perfect match for your scent preferences")
	}
	if seasonMatch > 0.7 {
		reasons = append(reasons, fmt.Sprintf("Ideal for %s weather", s.getCurrentSeason()))
	}
	if occasionMatch > 0.7 {
		reasons = append(reasons, "Perfect for your intended occasion")
	}
	if perfume.Price < 100 {
		reasons = append(reasons, "Great value for your budget")
	}
	if perfume.Longevity == "Long" || perfume.Longevity == "Very Long" {
		reasons = append(reasons, "Long-lasting fragrance")
	}

	if len(reasons) == 0 {
		reasons = append(reasons, "Interesting option worth exploring")
	}

	return reasons
}

func (s *QuizService) getBestFor(perfume models.Perfume, pref models.QuizPreferences) []string {
	var bestFor []string

	if pref.Work {
		bestFor = append(bestFor, "Office Wear")
	}
	if pref.Dates {
		bestFor = append(bestFor, "Date Nights")
	}
	if pref.SpecialEvents {
		bestFor = append(bestFor, "Special Events")
	}
	if pref.DailyWear {
		bestFor = append(bestFor, "Daily Wear")
	}

	if len(bestFor) == 0 {
		bestFor = append(bestFor, "Versatile Wear")
	}

	return bestFor
}

func (s *QuizService) getWearTiming(perfume models.Perfume, pref models.QuizPreferences) []string {
	var timing []string

	if pref.Longevity == "light" {
		timing = append(timing, "Reapply during the day")
	}
	if pref.Longevity == "long" {
		timing = append(timing, "Lasts all day")
	}

	if perfume.Sillage == "Heavy" {
		timing = append(timing, "Apply sparingly")
	}

	if len(timing) == 0 {
		timing = append(timing, "Apply to pulse points")
	}

	return timing
}

func (s *QuizService) generateTips(personality models.PersonalityAnalysis, pref models.QuizPreferences) []string {
	var tips []string

	tips = append(tips, "Apply fragrance to pulse points for better longevity")

	if pref.Work {
		tips = append(tips, "Choose subtle scents for professional environments")
	}
	if pref.Dates {
		tips = append(tips, "Apply 30 minutes before your date for optimal effect")
	}
	if pref.Unique {
		tips = append(tips, "Layer with unscented lotion to make unique fragrances last longer")
	}

	tips = append(tips, "Store fragrances in a cool, dark place to preserve quality")

	return tips
}

func (s *QuizService) getAlternatives(results []models.AdvancedRecommendationResult, req models.AdvancedRecommendationRequest) []models.Perfume {
	// Get some alternative perfumes with slightly different profiles
	alternatives, err := s.getCandidatePerfumes(req)
	if err != nil {
		return []models.Perfume{}
	}

	// Return a few alternatives that weren't in the main results
	var alts []models.Perfume
	for _, alt := range alternatives {
		inResults := false
		for _, res := range results {
			if alt.ID == res.Perfume.ID {
				inResults = true
				break
			}
		}
		if !inResults && len(alts) < 3 {
			alts = append(alts, alt)
		}
	}

	return alts
}

func (s *QuizService) getCurrentSeason() string {
	// Simple implementation - in real system, use current date
	return "current season"
}