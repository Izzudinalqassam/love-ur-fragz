package repositories

import (
	"perfume-website/internal/models"

	"gorm.io/gorm"
)

type QuizRepository struct {
	db *gorm.DB
}

func NewQuizRepository(db *gorm.DB) *QuizRepository {
	return &QuizRepository{
		db: db,
	}
}

// SaveQuizResponse saves a new quiz response to the database
func (r *QuizRepository) SaveQuizResponse(quiz *models.PersonalityQuiz) error {
	return r.db.Create(quiz).Error
}

// GetQuizByID retrieves a quiz by ID
func (r *QuizRepository) GetQuizByID(id uint) (*models.PersonalityQuiz, error) {
	var quiz models.PersonalityQuiz
	err := r.db.First(&quiz, id).Error
	if err != nil {
		return nil, err
	}
	return &quiz, nil
}

// GetQuizStatistics returns statistics about quiz responses
func (r *QuizRepository) GetQuizStatistics() (map[string]interface{}, error) {
	var stats map[string]interface{}

	// Get total quiz responses
	var totalResponses int64
	if err := r.db.Model(&models.PersonalityQuiz{}).Count(&totalResponses).Error; err != nil {
		return nil, err
	}

	// Get popular scent preferences
	var scentPreferences []struct {
		Count     int64  `json:"count"`
		ScentType string `json:"scent_type"`
	}

	// Query for each scent preference
	scentQueries := map[string]string{
		"light_fresh":      "SELECT COUNT(*) as count, 'light_fresh' as scent_type FROM personality_quizzes WHERE preferences_light_fresh = true",
		"warm_spicy":       "SELECT COUNT(*) as count, 'warm_spicy' as scent_type FROM personality_quizzes WHERE preferences_warm_spicy = true",
		"sweet_gourmand":   "SELECT COUNT(*) as count, 'sweet_gourmand' as scent_type FROM personality_quizzes WHERE preferences_sweet_gourmand = true",
		"woody_earthy":     "SELECT COUNT(*) as count, 'woody_earthy' as scent_type FROM personality_quizzes WHERE preferences_woody_earthy = true",
		"floral_romantic":  "SELECT COUNT(*) as count, 'floral_romantic' as scent_type FROM personality_quizzes WHERE preferences_floral_romantic = true",
		"citrus_energizing": "SELECT COUNT(*) as count, 'citrus_energizing' as scent_type FROM personality_quizzes WHERE preferences_citrus_energizing = true",
	}

	for _, query := range scentQueries {
		var result struct {
			Count     int64  `json:"count"`
			ScentType string `json:"scent_type"`
		}
		if err := r.db.Raw(query).Scan(&result).Error; err == nil {
			scentPreferences = append(scentPreferences, result)
		}
	}

	// Get lifestyle distribution
	var lifestyleDistribution []struct {
		Lifestyle string `json:"lifestyle"`
		Count     int64  `json:"count"`
	}

	if err := r.db.Model(&models.PersonalityQuiz{}).
		Select("lifestyle, COUNT(*) as count").
		Group("lifestyle").
		Scan(&lifestyleDistribution).Error; err != nil {
		return nil, err
	}

	// Get seasonal preferences
	var seasonalPreferences []struct {
		Count  int64  `json:"count"`
		Season string `json:"season"`
	}

	seasonQueries := map[string]string{
		"spring":     "SELECT COUNT(*) as count, 'spring' as season FROM personality_quizzes WHERE preferences_spring = true",
		"summer":     "SELECT COUNT(*) as count, 'summer' as season FROM personality_quizzes WHERE preferences_summer = true",
		"fall":       "SELECT COUNT(*) as count, 'fall' as season FROM personality_quizzes WHERE preferences_fall = true",
		"winter":     "SELECT COUNT(*) as count, 'winter' as season FROM personality_quizzes WHERE preferences_winter = true",
		"year_round": "SELECT COUNT(*) as count, 'year_round' as season FROM personality_quizzes WHERE preferences_year_round = true",
	}

	for _, query := range seasonQueries {
		var result struct {
			Count  int64  `json:"count"`
			Season string `json:"season"`
		}
		if err := r.db.Raw(query).Scan(&result).Error; err == nil {
			seasonalPreferences = append(seasonalPreferences, result)
		}
	}

	stats = map[string]interface{}{
		"total_responses":         totalResponses,
		"scent_preferences":       scentPreferences,
		"lifestyle_distribution":  lifestyleDistribution,
		"seasonal_preferences":    seasonalPreferences,
	}

	return stats, nil
}

// GetPopularPerfumesByQuizData returns perfumes that are popular among users with similar preferences
func (r *QuizRepository) GetPopularPerfumesByQuizData(preferences models.QuizPreferences, limit int) ([]models.Perfume, error) {
	var perfumes []models.Perfume

	// This is a simplified implementation - in a real system, you would have more sophisticated
	// querying based on the quiz data and user interactions
	query := r.db.Preload("AromaTags").
		Preload("Notes").
		Joins("INNER JOIN perfume_aromas ON perfume_aromas.perfume_id = perfumes.id").
		Joins("INNER JOIN aroma_tags ON aroma_tags.id = perfume_aromas.aroma_tag_id").
		Group("perfumes.id").
		Order("perfumes.price DESC"). // Simple ordering - in real implementation this would be based on actual popularity
		Limit(limit)

	if err := query.Find(&perfumes).Error; err != nil {
		return nil, err
	}

	return perfumes, nil
}