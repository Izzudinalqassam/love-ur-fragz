package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"perfume-website/internal/models"
	"perfume-website/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

// EnhancedReviewHandler handles enhanced review HTTP requests
type EnhancedReviewHandler struct {
	service  *services.EnhancedReviewService
	validator *validator.Validate
}

// NewEnhancedReviewHandler creates a new enhanced review handler
func NewEnhancedReviewHandler(service *services.EnhancedReviewService) *EnhancedReviewHandler {
	return &EnhancedReviewHandler{
		service:  service,
		validator: validator.New(),
	}
}

// CreateEnhancedReview handles POST /api/enhanced-reviews
func (h *EnhancedReviewHandler) CreateEnhancedReview(c *gin.Context) {
	var req models.CreateEnhancedReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid JSON format",
		})
		return
	}

	// Simple validation
	if req.UserName == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Name is required",
		})
		return
	}

	if req.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Title is required",
		})
		return
	}

	if req.Comment == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Review is required",
		})
		return
	}

	// Create review
	review, err := h.service.CreateReview(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to create review",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Review created successfully",
		"data":    review,
	})
}

// GetEnhancedReviews handles GET /api/enhanced-reviews
func (h *EnhancedReviewHandler) GetEnhancedReviews(c *gin.Context) {
	// Parse query parameters
	options := models.ReviewFilterOptions{}

	// Get perfume_id from query
	perfumeIDStr := c.Query("perfume_id")
	if perfumeIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "perfume_id is required",
		})
		return
	}

	perfumeID, err := strconv.Atoi(perfumeIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid perfume_id",
		})
		return
	}
	options.PerfumeID = perfumeID

	// Parse optional filters
	if ratingStr := c.Query("rating"); ratingStr != "" && ratingStr != "all" {
		if rating, err := strconv.Atoi(ratingStr); err == nil && rating >= 1 && rating <= 5 {
			options.Rating = &rating
		}
	}

	options.Longevity = c.Query("longevity")
	options.Sillage = c.Query("sillage")
	options.SearchTerm = c.Query("search")
	options.SortBy = c.Query("sort_by")

	if wouldRepurchaseStr := c.Query("would_repurchase"); wouldRepurchaseStr != "" && wouldRepurchaseStr != "all" {
		if wouldRepurchase, err := strconv.ParseBool(wouldRepurchaseStr); err == nil {
			options.WouldRepurchase = &wouldRepurchase
		}
	}

	if verifiedStr := c.Query("verified_purchase"); verifiedStr != "" && verifiedStr != "all" {
		if verified, err := strconv.ParseBool(verifiedStr); err == nil {
			options.VerifiedPurchase = &verified
		}
	}

	// Parse pagination
	if limitStr := c.Query("limit"); limitStr != "" {
		if limit, err := strconv.Atoi(limitStr); err == nil && limit > 0 {
			options.Limit = limit
		}
	}
	if offsetStr := c.Query("offset"); offsetStr != "" {
		if offset, err := strconv.Atoi(offsetStr); err == nil && offset >= 0 {
			options.Offset = offset
		}
	}

	// Get reviews
	reviews, err := h.service.GetReviews(options)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to get reviews",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Reviews retrieved successfully",
		"data":    reviews,
	})
}

// GetEnhancedReviewStats handles GET /api/enhanced-reviews/stats
func (h *EnhancedReviewHandler) GetEnhancedReviewStats(c *gin.Context) {
	perfumeIDStr := c.Query("perfume_id")
	if perfumeIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "perfume_id is required",
		})
		return
	}

	perfumeID, err := strconv.Atoi(perfumeIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid perfume_id",
		})
		return
	}

	stats, err := h.service.GetReviewStats(perfumeID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to get review stats",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Stats retrieved successfully",
		"data":    stats,
	})
}

// MarkReviewHelpful handles POST /api/enhanced-reviews/:id/helpful
func (h *EnhancedReviewHandler) MarkReviewHelpful(c *gin.Context) {
	reviewIDStr := c.Param("id")
	reviewID, err := strconv.Atoi(reviewIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid review ID",
		})
		return
	}

	// Get user identifier (IP address since no auth system)
	userIdentifier := getUserIdentifier(c)

	err = h.service.MarkReviewHelpful(reviewID, userIdentifier)
	if err != nil {
		if err.Error() == "user already marked this review as helpful" {
			c.JSON(http.StatusConflict, gin.H{
				"success": false,
				"error":   "You have already marked this review as helpful",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to mark review as helpful",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Review marked as helpful",
	})
}

// ReportReview handles POST /api/enhanced-reviews/:id/report
func (h *EnhancedReviewHandler) ReportReview(c *gin.Context) {
	reviewIDStr := c.Param("id")
	reviewID, err := strconv.Atoi(reviewIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid review ID",
		})
		return
	}

	var req struct {
		Reason      string `json:"reason" validate:"required"`
		Description string `json:"description"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid JSON format",
		})
		return
	}

	// Validate request
	if err := h.validator.Struct(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Validation failed",
			"errors": map[string]interface{}{"reason": "Reason is required"},
		})
		return
	}

	// Get user identifier
	userIdentifier := getUserIdentifier(c)

	err = h.service.ReportReview(reviewID, req.Reason, req.Description, userIdentifier)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to report review",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Review reported successfully",
	})
}

// GetReviewByID handles GET /api/enhanced-reviews/:id
func (h *EnhancedReviewHandler) GetReviewByID(c *gin.Context) {
	reviewIDStr := c.Param("id")
	reviewID, err := strconv.Atoi(reviewIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid review ID",
		})
		return
	}

	review, err := h.service.GetReviewByID(reviewID)
	if err != nil {
		if err.Error() == "enhanced review not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Review not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to get review",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Review retrieved successfully",
		"data":    review,
	})
}

// getUserIdentifier gets a user identifier for voting/reporting (IP address in this case)
func getUserIdentifier(c *gin.Context) string {
	// Try to get real IP from forwarded headers first
	forwarded := c.GetHeader("X-Forwarded-For")
	if forwarded != "" {
		ips := strings.Split(forwarded, ",")
		return strings.TrimSpace(ips[0])
	}

	realIP := c.GetHeader("X-Real-IP")
	if realIP != "" {
		return realIP
	}

	// Fallback to remote address
	return c.ClientIP()
}