package models

import (
	"time"

	"gorm.io/gorm"
)

type Perfume struct {
	ID            uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Name          string    `json:"name" gorm:"not null;size:255"`
	Brand         string    `json:"brand" gorm:"not null;size:255"`
	Type          string    `json:"type" gorm:"not null;size:50"`
	Category      string    `json:"category" gorm:"not null;size:100"`
	TargetAudience string    `json:"target_audience" gorm:"not null;size:50"`
	Longevity     string    `json:"longevity" gorm:"not null;size:50"`
	Sillage       string    `json:"sillage" gorm:"not null;size:50"`
	Price         float64   `json:"price" gorm:"not null"`
	Description   string    `json:"description" gorm:"type:text"`
	ImageURL      string    `json:"image_url" gorm:"size:500"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `json:"deleted_at,omitempty"`
	
	// Relationships
	AromaTags []AromaTag `json:"aroma_tags" gorm:"many2many:perfume_aromas;"`
	Notes      []Note      `json:"notes" gorm:"foreignKey:PerfumeID"`
}

type NoteType string

const (
	NoteTypeTop    NoteType = "top"
	NoteTypeMiddle NoteType = "middle"
	NoteTypeBase   NoteType = "base"
)

type Note struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	PerfumeID uint      `json:"perfume_id" gorm:"not null"`
	Type      NoteType  `json:"type" gorm:"not null"`
	NoteName  string    `json:"note_name" gorm:"not null"`
	Intensity int       `json:"intensity"` // 1-10 scale
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	// Relationship
	Perfume Perfume `json:"-" gorm:"foreignKey:PerfumeID"`
}

type AromaTag struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Slug      string         `json:"slug" gorm:"uniqueIndex;not null"`
	Name      string         `json:"name" gorm:"not null"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Perfumes []Perfume `json:"-" gorm:"many2many:perfume_aromas;"`
}

type PerfumeAroma struct {
	PerfumeID   uint `json:"perfume_id" gorm:"primaryKey"`
	AromaTagID  uint `json:"aroma_tag_id" gorm:"primaryKey"`
	CreatedAt   time.Time `json:"created_at"`

	// Relationships
	Perfume  Perfume  `json:"-" gorm:"foreignKey:PerfumeID"`
	AromaTag AromaTag `json:"-" gorm:"foreignKey:AromaTagID"`
}

// DTOs for API responses
type PerfumeResponse struct {
	ID           uint             `json:"id"`
	Name         string           `json:"name"`
	Brand        string           `json:"brand"`
	Description  string           `json:"description"`
	Concentration string          `json:"concentration"`
	Longevity    int              `json:"longevity"`
	Sillage      int              `json:"sillage"`
	Price        float64          `json:"price"`
	ImageURL     string           `json:"image_url"`
	AromaTags    []AromaTag       `json:"aroma_tags"`
	Notes        []Note           `json:"notes"`
	CreatedAt    time.Time        `json:"created_at"`
	UpdatedAt    time.Time        `json:"updated_at"`
}

type RecommendationRequest struct {
	Aromas []string `json:"aromas" binding:"required"`
}

type RecommendationResultResponse struct {
	Perfume PerfumeResponse `json:"perfume"`
	Score    float64        `json:"score"`
}

type RecommendationResponse struct {
	Results          []RecommendationResultResponse `json:"results"`
	BlendExplanation string                     `json:"explanation"`
}
