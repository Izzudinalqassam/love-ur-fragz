package services

import (
	"fmt"

	"perfume-website/internal/models"
	"perfume-website/internal/repositories"
)

type AromaService interface {
	CreateAroma(aroma *models.AromaTag) error
	GetAroma(id uint) (*models.AromaTag, error)
	GetAromaBySlug(slug string) (*models.AromaTag, error)
	GetAllAromas() ([]models.AromaTag, error)
	UpdateAroma(aroma *models.AromaTag) error
	DeleteAroma(id uint) error
	GetAromasBySlugs(slugs []string) ([]models.AromaTag, error)
}

type aromaService struct {
	aromaRepo repositories.AromaRepository
}

func NewAromaService(aromaRepo repositories.AromaRepository) AromaService {
	return &aromaService{
		aromaRepo: aromaRepo,
	}
}

func (s *aromaService) CreateAroma(aroma *models.AromaTag) error {
	// Check if slug already exists
	existingAroma, err := s.aromaRepo.GetBySlug(aroma.Slug)
	if err == nil && existingAroma != nil {
		return fmt.Errorf("aroma with slug '%s' already exists", aroma.Slug)
	}
	return s.aromaRepo.Create(aroma)
}

func (s *aromaService) GetAroma(id uint) (*models.AromaTag, error) {
	return s.aromaRepo.GetByID(id)
}

func (s *aromaService) GetAromaBySlug(slug string) (*models.AromaTag, error) {
	return s.aromaRepo.GetBySlug(slug)
}

func (s *aromaService) GetAllAromas() ([]models.AromaTag, error) {
	return s.aromaRepo.GetAll()
}

func (s *aromaService) UpdateAroma(aroma *models.AromaTag) error {
	// Check if slug already exists for another aroma
	existingAroma, err := s.aromaRepo.GetBySlug(aroma.Slug)
	if err == nil && existingAroma != nil && existingAroma.ID != aroma.ID {
		return fmt.Errorf("aroma with slug '%s' already exists", aroma.Slug)
	}
	return s.aromaRepo.Update(aroma)
}

func (s *aromaService) DeleteAroma(id uint) error {
	return s.aromaRepo.Delete(id)
}

func (s *aromaService) GetAromasBySlugs(slugs []string) ([]models.AromaTag, error) {
	return s.aromaRepo.GetBySlugs(slugs)
}
