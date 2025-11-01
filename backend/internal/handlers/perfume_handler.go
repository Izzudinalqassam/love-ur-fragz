package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"perfume-website/internal/models"
	"perfume-website/internal/services"

	"github.com/gin-gonic/gin"
)

type PerfumeHandler struct {
	perfumeService services.PerfumeService
}

func NewPerfumeHandler(perfumeService services.PerfumeService) *PerfumeHandler {
	return &PerfumeHandler{
		perfumeService: perfumeService,
	}
}

// mapStringToInt converts string longevity/sillage to int
func mapStringToInt(value string) int {
	switch strings.ToLower(value) {
	case "strong", "very strong":
		return 80
	case "medium":
		return 60
	case "light":
		return 40
	default:
		return 50
	}
}

// GetAllPerfumes returns all perfumes with relations (with pagination)
func (h *PerfumeHandler) GetAllPerfumes(c *gin.Context) {
	// Get pagination parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "12"))
	search := c.Query("search")
	brand := c.Query("brand")
	aroma := c.Query("aroma")

	// Validate pagination
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 12
	}

	perfumes, total, err := h.perfumeService.GetPerfumesWithPagination(page, limit, search, brand, aroma)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var responses []models.PerfumeResponse
	for _, perfume := range perfumes {
		responses = append(responses, models.PerfumeResponse{
			ID:           perfume.ID,
			Name:         perfume.Name,
			Brand:        perfume.Brand,
			Description:  perfume.Description,
			Concentration: perfume.Type, // Use Type as concentration
			Longevity:    mapStringToInt(perfume.Longevity),
			Sillage:      mapStringToInt(perfume.Sillage),
			Price:        perfume.Price,
			ImageURL:     perfume.ImageURL,
			AromaTags:    perfume.AromaTags,
			Notes:        perfume.Notes,
			CreatedAt:    perfume.CreatedAt,
			UpdatedAt:    perfume.UpdatedAt,
		})
	}

	// Calculate pagination info
	totalPages := int((total + int64(limit) - 1) / int64(limit))

	c.JSON(http.StatusOK, gin.H{
		"data":        responses,
		"pagination": gin.H{
			"current_page": page,
			"total_pages":  totalPages,
			"total_items":  total,
			"per_page":     limit,
			"has_next":     page < totalPages,
			"has_prev":     page > 1,
		},
	})
}

// GetPerfume returns a single perfume by ID
func (h *PerfumeHandler) GetPerfume(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid perfume ID"})
		return
	}

	perfume, err := h.perfumeService.GetPerfumeWithRelations(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Perfume not found"})
		return
	}

	response := models.PerfumeResponse{
		ID:           perfume.ID,
		Name:         perfume.Name,
		Brand:        perfume.Brand,
		Description:  perfume.Description,
		Concentration: perfume.Type, // Use Type as concentration
		Longevity:    mapStringToInt(perfume.Longevity),
		Sillage:      mapStringToInt(perfume.Sillage),
		Price:        perfume.Price,
		ImageURL:     perfume.ImageURL,
		AromaTags:    perfume.AromaTags,
		Notes:        perfume.Notes,
		CreatedAt:    perfume.CreatedAt,
		UpdatedAt:    perfume.UpdatedAt,
	}

	c.JSON(http.StatusOK, response)
}

// CreatePerfume creates a new perfume (admin only)
func (h *PerfumeHandler) CreatePerfume(c *gin.Context) {
	var perfume models.Perfume
	if err := c.ShouldBindJSON(&perfume); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.perfumeService.CreatePerfume(&perfume); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, perfume)
}

// UpdatePerfume updates an existing perfume (admin only)
func (h *PerfumeHandler) UpdatePerfume(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid perfume ID"})
		return
	}

	var perfume models.Perfume
	if err := c.ShouldBindJSON(&perfume); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	perfume.ID = uint(id)
	if err := h.perfumeService.UpdatePerfume(&perfume); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, perfume)
}

// DeletePerfume deletes a perfume (admin only)
func (h *PerfumeHandler) DeletePerfume(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid perfume ID"})
		return
	}

	if err := h.perfumeService.DeletePerfume(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Perfume deleted successfully"})
}

// RecommendPerfumes returns perfume recommendations based on aroma preferences
func (h *PerfumeHandler) RecommendPerfumes(c *gin.Context) {
	var req models.RecommendationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := h.perfumeService.RecommendPerfumes(req.Aromas)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, response)
}


// // GetCategories returns fragrance categories with counts
// func (h *PerfumeHandler) GetCategories(c *gin.Context) {
// 	categories, err := h.perfumeService.GetCategories()
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}
// 
// 	c.JSON(http.StatusOK, categories)
// }
