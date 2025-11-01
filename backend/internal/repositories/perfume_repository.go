package repositories

import (
	"fmt"

	"perfume-website/internal/models"

	"gorm.io/gorm"
)

type PerfumeRepository interface {
	Create(perfume *models.Perfume) error
	GetByID(id uint) (*models.Perfume, error)
	GetAll() ([]models.Perfume, error)
	Update(perfume *models.Perfume) error
	Delete(id uint) error
	GetByAromaTags(aromaTagIDs []uint) ([]models.Perfume, error)
	GetWithRelations(id uint) (*models.Perfume, error)
	GetAllWithRelations() ([]models.Perfume, error)
	GetWithPagination(page, limit int, search, brand, aroma string) ([]models.Perfume, int64, error)
	GetAllPerfumes() ([]models.Perfume, error)
	Count() (int64, error)
//GetCategories() ([]map[string]interface{}, error)
}

type perfumeRepository struct {
	db *gorm.DB
}

func NewPerfumeRepository(db *gorm.DB) PerfumeRepository {
	return &perfumeRepository{db: db}
}

func (r *perfumeRepository) Create(perfume *models.Perfume) error {
	return r.db.Create(perfume).Error
}

func (r *perfumeRepository) GetByID(id uint) (*models.Perfume, error) {
	var perfume models.Perfume
	err := r.db.First(&perfume, id).Error
	if err != nil {
		return nil, err
	}
	return &perfume, nil
}

func (r *perfumeRepository) GetAll() ([]models.Perfume, error) {
	var perfumes []models.Perfume
	err := r.db.Find(&perfumes).Error
	return perfumes, err
}

func (r *perfumeRepository) GetWithRelations(id uint) (*models.Perfume, error) {
	var perfume models.Perfume
	err := r.db.Preload("AromaTags").Preload("Notes").First(&perfume, id).Error
	if err != nil {
		return nil, err
	}
	return &perfume, nil
}

func (r *perfumeRepository) GetAllWithRelations() ([]models.Perfume, error) {
	var perfumes []models.Perfume
	err := r.db.Preload("AromaTags").Preload("Notes").Find(&perfumes).Error
	return perfumes, err
}

func (r *perfumeRepository) Update(perfume *models.Perfume) error {
	return r.db.Save(perfume).Error
}

func (r *perfumeRepository) Delete(id uint) error {
	return r.db.Delete(&models.Perfume{}, id).Error
}

func (r *perfumeRepository) GetByAromaTags(aromaTagIDs []uint) ([]models.Perfume, error) {
	var perfumes []models.Perfume
	
	// Query perfumes that have any of the specified aroma tags
	err := r.db.Preload("AromaTags").Preload("Notes").
		Joins("JOIN perfume_aromas ON perfume_aromas.perfume_id = perfumes.id").
		Where("perfume_aromas.aroma_tag_id IN ?", aromaTagIDs).
		Group("perfumes.id").
		Find(&perfumes).Error
	
	if err != nil {
		return nil, fmt.Errorf("failed to get perfumes by aroma tags: %w", err)
	}
	
	return perfumes, nil
}

func (r *perfumeRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&models.Perfume{}).Count(&count).Error
	return count, err
}

// GetWithPagination retrieves perfumes with pagination and filtering
func (r *perfumeRepository) GetWithPagination(page, limit int, search, brand, aroma string) ([]models.Perfume, int64, error) {
	var perfumes []models.Perfume
	var total int64

	offset := (page - 1) * limit

	// Build base query
	query := r.db.Model(&models.Perfume{})

	// Apply filters
	if search != "" {
		query = query.Where("name LIKE ? OR description LIKE ?", "%"+search+"%", "%"+search+"%")
	}
	if brand != "" {
		query = query.Where("brand = ?", brand)
	}
	if aroma != "" {
		query = query.Joins("JOIN perfume_aromas ON perfume_aromas.perfume_id = perfumes.id").
			Joins("JOIN aroma_tags ON aroma_tags.id = perfume_aromas.aroma_tag_id").
			Where("aroma_tags.slug = ?", aroma)
	}

	// Get total count
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results with relations
	err := query.Preload("AromaTags").Preload("Notes").
		Offset(offset).
		Limit(limit).
		Find(&perfumes).Error

	if err != nil {
		return nil, 0, err
	}

	return perfumes, total, nil
}

// GetAllPerfumes returns all perfumes with relations
func (r *perfumeRepository) GetAllPerfumes() ([]models.Perfume, error) {
	var perfumes []models.Perfume
	err := r.db.Preload("AromaTags").Preload("Notes").Find(&perfumes).Error
	if err != nil {
		return nil, fmt.Errorf("failed to get all perfumes: %w", err)
	}
	return perfumes, nil
}
