package services

import (
	"perfume-website/internal/models"
	"perfume-website/internal/repositories"
)

type PerfumeService interface {
	CreatePerfume(perfume *models.Perfume) error
	GetPerfume(id uint) (*models.Perfume, error)
	GetAllPerfumes() ([]models.Perfume, error)
	UpdatePerfume(perfume *models.Perfume) error
	DeletePerfume(id uint) error
	GetPerfumeWithRelations(id uint) (*models.Perfume, error)
	GetAllPerfumesWithRelations() ([]models.Perfume, error)
	GetPerfumesWithPagination(page, limit int, search, brand, aroma string) ([]models.Perfume, int64, error)
	RecommendPerfumes(aromaSlugs []string) (*models.RecommendationResponse, error)
//GetCategories() ([]map[string]interface{}, error)
}

type perfumeService struct {
	perfumeRepo repositories.PerfumeRepository
	aromaRepo   repositories.AromaRepository
}

func NewPerfumeService(perfumeRepo repositories.PerfumeRepository, aromaRepo repositories.AromaRepository) PerfumeService {
	return &perfumeService{
		perfumeRepo: perfumeRepo,
		aromaRepo:   aromaRepo,
	}
}

func (s *perfumeService) CreatePerfume(perfume *models.Perfume) error {
	return s.perfumeRepo.Create(perfume)
}

func (s *perfumeService) GetPerfume(id uint) (*models.Perfume, error) {
	return s.perfumeRepo.GetByID(id)
}

func (s *perfumeService) GetAllPerfumes() ([]models.Perfume, error) {
	return s.perfumeRepo.GetAll()
}

func (s *perfumeService) UpdatePerfume(perfume *models.Perfume) error {
	return s.perfumeRepo.Update(perfume)
}

func (s *perfumeService) DeletePerfume(id uint) error {
	return s.perfumeRepo.Delete(id)
}

func (s *perfumeService) GetPerfumeWithRelations(id uint) (*models.Perfume, error) {
	return s.perfumeRepo.GetWithRelations(id)
}

func (s *perfumeService) GetAllPerfumesWithRelations() ([]models.Perfume, error) {
	return s.perfumeRepo.GetAllWithRelations()
}

// GetPerfumesWithPagination retrieves perfumes with pagination and filtering
func (s *perfumeService) GetPerfumesWithPagination(page, limit int, search, brand, aroma string) ([]models.Perfume, int64, error) {
	return s.perfumeRepo.GetWithPagination(page, limit, search, brand, aroma)
}

type PerfumeScore struct {
	Perfume *models.Perfume
	Score   float64
}

func (s *perfumeService) RecommendPerfumes(aromaSlugs []string) (*models.RecommendationResponse, error) {
	// Get all perfumes with relations
	perfumes, err := s.perfumeRepo.GetAllWithRelations()
	if err != nil {
		return nil, err
	}

	// Simple recommendation based on aroma tags
	var results []models.RecommendationResultResponse
	for _, perfume := range perfumes {
		score := 0.5 // Base score

		// Check if perfume has matching aroma tags
		for _, aroma := range perfume.AromaTags {
			for _, targetAroma := range aromaSlugs {
				if aroma.Slug == targetAroma {
					score += 0.3
				}
			}
		}

		// Create perfume response
		perfumeResp := models.PerfumeResponse{
			ID:           perfume.ID,
			Name:         perfume.Name,
			Brand:        perfume.Brand,
			Description:  perfume.Description,
			Concentration: perfume.Type,
			Longevity:    mapStringToInt(perfume.Longevity),
			Sillage:      mapStringToInt(perfume.Sillage),
			Price:        perfume.Price,
			ImageURL:     perfume.ImageURL,
			AromaTags:    perfume.AromaTags,
			Notes:        perfume.Notes,
			CreatedAt:    perfume.CreatedAt,
			UpdatedAt:    perfume.UpdatedAt,
		}

		results = append(results, models.RecommendationResultResponse{
			Perfume: perfumeResp,
			Score:   score,
		})
	}

	// Sort by score
	for i := 0; i < len(results); i++ {
		for j := i + 1; j < len(results); j++ {
			if results[j].Score > results[i].Score {
				results[i], results[j] = results[j], results[i]
			}
		}
	}

	// Limit results
	if len(results) > 6 {
		results = results[:6]
	}

	return &models.RecommendationResponse{
		Results:          results,
		BlendExplanation: "Based on your aroma preferences, we found these matching fragrances.",
	}, nil
}

// Helper function to convert string longevity/sillage to int
func mapStringToInt(value string) int {
	switch value {
	case "Strong", "Very Strong":
		return 80
	case "Medium":
		return 60
	case "Light":
		return 40
	default:
		return 50
	}
}
