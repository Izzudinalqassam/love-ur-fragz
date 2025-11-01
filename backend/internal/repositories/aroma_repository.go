package repositories

import (
	"perfume-website/internal/models"

	"gorm.io/gorm"
)

type AromaRepository interface {
	Create(aroma *models.AromaTag) error
	GetByID(id uint) (*models.AromaTag, error)
	GetBySlug(slug string) (*models.AromaTag, error)
	GetAll() ([]models.AromaTag, error)
	Update(aroma *models.AromaTag) error
	Delete(id uint) error
	GetBySlugs(slugs []string) ([]models.AromaTag, error)
	Count() (int64, error)
}

type aromaRepository struct {
	db *gorm.DB
}

func NewAromaRepository(db *gorm.DB) AromaRepository {
	return &aromaRepository{db: db}
}

func (r *aromaRepository) Create(aroma *models.AromaTag) error {
	return r.db.Create(aroma).Error
}

func (r *aromaRepository) GetByID(id uint) (*models.AromaTag, error) {
	var aroma models.AromaTag
	err := r.db.First(&aroma, id).Error
	if err != nil {
		return nil, err
	}
	return &aroma, nil
}

func (r *aromaRepository) GetBySlug(slug string) (*models.AromaTag, error) {
	var aroma models.AromaTag
	err := r.db.Where("slug = ?", slug).First(&aroma).Error
	if err != nil {
		return nil, err
	}
	return &aroma, nil
}

func (r *aromaRepository) GetAll() ([]models.AromaTag, error) {
	var aromas []models.AromaTag
	err := r.db.Find(&aromas).Error
	return aromas, err
}

func (r *aromaRepository) Update(aroma *models.AromaTag) error {
	return r.db.Save(aroma).Error
}

func (r *aromaRepository) Delete(id uint) error {
	return r.db.Delete(&models.AromaTag{}, id).Error
}

func (r *aromaRepository) GetBySlugs(slugs []string) ([]models.AromaTag, error) {
	var aromas []models.AromaTag
	err := r.db.Where("slug IN ?", slugs).Find(&aromas).Error
	return aromas, err
}

func (r *aromaRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&models.AromaTag{}).Count(&count).Error
	return count, err
}
