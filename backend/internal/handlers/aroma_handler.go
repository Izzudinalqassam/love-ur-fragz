package handlers

import (
	"net/http"
	"strconv"

	"perfume-website/internal/models"
	"perfume-website/internal/services"

	"github.com/gin-gonic/gin"
)

type AromaHandler struct {
	aromaService services.AromaService
}

func NewAromaHandler(aromaService services.AromaService) *AromaHandler {
	return &AromaHandler{
		aromaService: aromaService,
	}
}

// GetAllAromas returns all aroma tags
func (h *AromaHandler) GetAllAromas(c *gin.Context) {
	aromas, err := h.aromaService.GetAllAromas()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, aromas)
}

// GetAroma returns a single aroma tag by ID
func (h *AromaHandler) GetAroma(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid aroma ID"})
		return
	}

	aroma, err := h.aromaService.GetAroma(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Aroma not found"})
		return
	}

	c.JSON(http.StatusOK, aroma)
}

// CreateAroma creates a new aroma tag (admin only)
func (h *AromaHandler) CreateAroma(c *gin.Context) {
	var aroma models.AromaTag
	if err := c.ShouldBindJSON(&aroma); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.aromaService.CreateAroma(&aroma); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, aroma)
}

// UpdateAroma updates an existing aroma tag (admin only)
func (h *AromaHandler) UpdateAroma(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid aroma ID"})
		return
	}

	var aroma models.AromaTag
	if err := c.ShouldBindJSON(&aroma); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	aroma.ID = uint(id)
	if err := h.aromaService.UpdateAroma(&aroma); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, aroma)
}

// DeleteAroma deletes an aroma tag (admin only)
func (h *AromaHandler) DeleteAroma(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid aroma ID"})
		return
	}

	if err := h.aromaService.DeleteAroma(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Aroma tag deleted successfully"})
}
