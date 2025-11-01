package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	"../models"
	"github.com/go-playground/validator/v10"
)

// EnhancedReviewHandler handles enhanced review HTTP requests
type EnhancedReviewHandler struct {
	reviewModel *models.EnhancedReviewModel
	validator   *validator.Validate
}

// NewEnhancedReviewHandler creates a new enhanced review handler
func NewEnhancedReviewHandler(reviewModel *models.EnhancedReviewModel) *EnhancedReviewHandler {
	return &EnhancedReviewHandler{
		reviewModel: reviewModel,
		validator:   validator.New(),
	}
}

// Response represents a standard API response
type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// ErrorResponse represents a detailed error response
type ErrorResponse struct {
	Success bool                   `json:"success"`
	Message string                 `json:"message"`
	Errors  map[string]interface{} `json:"errors,omitempty"`
}

// CreateEnhancedReview handles POST /api/enhanced-reviews
func (h *EnhancedReviewHandler) CreateEnhancedReview(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req models.CreateEnhancedReviewRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.sendError(w, http.StatusBadRequest, "Invalid JSON format", map[string]interface{}{"json": err.Error()})
		return
	}

	// Validate request
	if err := h.validator.Struct(&req); err != nil {
		validationErrors := make(map[string]interface{})
		for _, err := range err.(validator.ValidationErrors) {
			field := err.Field()
			switch err.Tag() {
			case "required":
				validationErrors[field] = "This field is required"
			case "min":
				validationErrors[field] = fmt.Sprintf("Minimum %s characters", err.Param())
			case "max":
				validationErrors[field] = fmt.Sprintf("Maximum %s characters", err.Param())
			case "email":
				validationErrors[field] = "Invalid email format"
			case "oneof":
				validationErrors[field] = fmt.Sprintf("Must be one of: %s", err.Param())
			default:
				validationErrors[field] = "Invalid value"
			}
		}

		h.sendError(w, http.StatusBadRequest, "Validation failed", validationErrors)
		return
	}

	// Additional validation
	if len(req.Pros) == 0 && len(req.Cons) == 0 {
		h.sendError(w, http.StatusBadRequest, "At least one pro or con is required", nil)
		return
	}

	if len(req.Occasions) == 0 {
		h.sendError(w, http.StatusBadRequest, "At least one occasion must be selected", nil)
		return
	}

	if len(req.Seasons) == 0 {
		h.sendError(w, http.StatusBadRequest, "At least one season must be selected", nil)
		return
	}

	// Create review
	review, err := h.reviewModel.Create(&req)
	if err != nil {
		log.Printf("Failed to create enhanced review: %v", err)
		h.sendError(w, http.StatusInternalServerError, "Failed to create review", nil)
		return
	}

	h.sendSuccess(w, http.StatusCreated, "Review created successfully", review)
}

// GetEnhancedReviews handles GET /api/enhanced-reviews
func (h *EnhancedReviewHandler) GetEnhancedReviews(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Parse query parameters
	options := models.ReviewFilterOptions{}

	// Get perfume_id from query
	if perfumeIDStr := r.URL.Query().Get("perfume_id"); perfumeIDStr != "" {
		perfumeID, err := strconv.Atoi(perfumeIDStr)
		if err != nil {
			h.sendError(w, http.StatusBadRequest, "Invalid perfume_id", nil)
			return
		}
		options.PerfumeID = perfumeID
	} else {
		h.sendError(w, http.StatusBadRequest, "perfume_id is required", nil)
		return
	}

	// Parse optional filters
	if ratingStr := r.URL.Query().Get("rating"); ratingStr != "" && ratingStr != "all" {
		if rating, err := strconv.Atoi(ratingStr); err == nil && rating >= 1 && rating <= 5 {
			options.Rating = &rating
		}
	}

	options.Longevity = r.URL.Query().Get("longevity")
	options.Sillage = r.URL.Query().Get("sillage")
	options.SearchTerm = r.URL.Query().Get("search")
	options.SortBy = r.URL.Query().Get("sort_by")
	if options.SortBy == "" {
		options.SortBy = "most-recent"
	}

	if wouldRepurchaseStr := r.URL.Query().Get("would_repurchase"); wouldRepurchaseStr != "" && wouldRepurchaseStr != "all" {
		if wouldRepurchase, err := strconv.ParseBool(wouldRepurchaseStr); err == nil {
			options.WouldRepurchase = &wouldRepurchase
		}
	}

	if verifiedStr := r.URL.Query().Get("verified_purchase"); verifiedStr != "" && verifiedStr != "all" {
		if verified, err := strconv.ParseBool(verifiedStr); err == nil {
			options.VerifiedPurchase = &verified
		}
	}

	// Parse pagination
	if limitStr := r.URL.Query().Get("limit"); limitStr != "" {
		if limit, err := strconv.Atoi(limitStr); err == nil && limit > 0 {
			options.Limit = limit
		}
	}
	if offsetStr := r.URL.Query().Get("offset"); offsetStr != "" {
		if offset, err := strconv.Atoi(offsetStr); err == nil && offset >= 0 {
			options.Offset = offset
		}
	}

	// Get reviews
	reviews, err := h.reviewModel.GetByPerfumeID(options)
	if err != nil {
		log.Printf("Failed to get enhanced reviews: %v", err)
		h.sendError(w, http.StatusInternalServerError, "Failed to get reviews", nil)
		return
	}

	h.sendSuccess(w, http.StatusOK, "Reviews retrieved successfully", reviews)
}

// GetEnhancedReviewStats handles GET /api/enhanced-reviews/stats
func (h *EnhancedReviewHandler) GetEnhancedReviewStats(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get perfume_id from query
	perfumeIDStr := r.URL.Query().Get("perfume_id")
	if perfumeIDStr == "" {
		h.sendError(w, http.StatusBadRequest, "perfume_id is required", nil)
		return
	}

	perfumeID, err := strconv.Atoi(perfumeIDStr)
	if err != nil {
		h.sendError(w, http.StatusBadRequest, "Invalid perfume_id", nil)
		return
	}

	// Get stats
	stats, err := h.reviewModel.GetStats(perfumeID)
	if err != nil {
		log.Printf("Failed to get enhanced review stats: %v", err)
		h.sendError(w, http.StatusInternalServerError, "Failed to get review stats", nil)
		return
	}

	h.sendSuccess(w, http.StatusOK, "Stats retrieved successfully", stats)
}

// MarkReviewHelpful handles POST /api/enhanced-reviews/{id}/helpful
func (h *EnhancedReviewHandler) MarkReviewHelpful(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get review ID from URL
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 4 {
		h.sendError(w, http.StatusBadRequest, "Invalid URL", nil)
		return
	}

	reviewID, err := strconv.Atoi(pathParts[3])
	if err != nil {
		h.sendError(w, http.StatusBadRequest, "Invalid review ID", nil)
		return
	}

	// Get user identifier (IP address since no auth system)
	userIdentifier := getUserIdentifier(r)

	// Mark as helpful
	err = h.reviewModel.MarkHelpful(reviewID, userIdentifier)
	if err != nil {
		if err.Error() == "user already marked this review as helpful" {
			h.sendError(w, http.StatusConflict, "You have already marked this review as helpful", nil)
			return
		}
		log.Printf("Failed to mark review as helpful: %v", err)
		h.sendError(w, http.StatusInternalServerError, "Failed to mark review as helpful", nil)
		return
	}

	h.sendSuccess(w, http.StatusOK, "Review marked as helpful", nil)
}

// ReportReview handles POST /api/enhanced-reviews/{id}/report
func (h *EnhancedReviewHandler) ReportReview(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get review ID from URL
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 4 {
		h.sendError(w, http.StatusBadRequest, "Invalid URL", nil)
		return
	}

	reviewID, err := strconv.Atoi(pathParts[3])
	if err != nil {
		h.sendError(w, http.StatusBadRequest, "Invalid review ID", nil)
		return
	}

	// Parse request body
	var req struct {
		Reason      string `json:"reason" validate:"required"`
		Description string `json:"description"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.sendError(w, http.StatusBadRequest, "Invalid JSON format", nil)
		return
	}

	// Validate request
	if err := h.validator.Struct(&req); err != nil {
		h.sendError(w, http.StatusBadRequest, "Validation failed", map[string]interface{}{"reason": "Reason is required"})
		return
	}

	// Get user identifier
	userIdentifier := getUserIdentifier(r)

	// Report review
	err = h.reviewModel.ReportReview(reviewID, req.Reason, req.Description, userIdentifier)
	if err != nil {
		log.Printf("Failed to report review: %v", err)
		h.sendError(w, http.StatusInternalServerError, "Failed to report review", nil)
		return
	}

	h.sendSuccess(w, http.StatusOK, "Review reported successfully", nil)
}

// GetReviewByID handles GET /api/enhanced-reviews/{id}
func (h *EnhancedReviewHandler) GetReviewByID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get review ID from URL
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 4 {
		h.sendError(w, http.StatusBadRequest, "Invalid URL", nil)
		return
	}

	reviewID, err := strconv.Atoi(pathParts[3])
	if err != nil {
		h.sendError(w, http.StatusBadRequest, "Invalid review ID", nil)
		return
	}

	// Get review
	review, err := h.reviewModel.GetByID(reviewID)
	if err != nil {
		if err.Error() == "enhanced review not found" {
			h.sendError(w, http.StatusNotFound, "Review not found", nil)
			return
		}
		log.Printf("Failed to get review: %v", err)
		h.sendError(w, http.StatusInternalServerError, "Failed to get review", nil)
		return
	}

	h.sendSuccess(w, http.StatusOK, "Review retrieved successfully", review)
}

// Helper methods

func (h *EnhancedReviewHandler) sendSuccess(w http.ResponseWriter, statusCode int, message string, data interface{}) {
	w.WriteHeader(statusCode)
	response := Response{
		Success: true,
		Message: message,
		Data:    data,
	}
	json.NewEncoder(w).Encode(response)
}

func (h *EnhancedReviewHandler) sendError(w http.ResponseWriter, statusCode int, message string, errors map[string]interface{}) {
	w.WriteHeader(statusCode)
	var response interface{}

	if errors != nil {
		response = ErrorResponse{
			Success: false,
			Message: message,
			Errors:  errors,
		}
	} else {
		response = Response{
			Success: false,
			Error:   message,
		}
	}

	json.NewEncoder(w).Encode(response)
}

// getUserIdentifier gets a user identifier for voting/reporting (IP address in this case)
func getUserIdentifier(r *http.Request) string {
	// Try to get real IP from forwarded headers first
 forwarded := r.Header.Get("X-Forwarded-For")
 if forwarded != "" {
  ips := strings.Split(forwarded, ",")
  return strings.TrimSpace(ips[0])
 }

 realIP := r.Header.Get("X-Real-IP")
 if realIP != "" {
  return realIP
 }

 // Fallback to remote address
 return r.RemoteAddr
}