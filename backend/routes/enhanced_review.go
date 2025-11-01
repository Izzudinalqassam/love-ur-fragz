package routes

import (
	"../handlers"
	"../models"
	"database/sql"

	"github.com/gorilla/mux"
)

// EnhancedReviewRoutes configures enhanced review routes
func EnhancedReviewRoutes(router *mux.Router, db *sql.DB) {
	// Initialize models and handlers
	reviewModel := models.NewEnhancedReviewModel(db)
	reviewHandler := handlers.NewEnhancedReviewHandler(reviewModel)

	// Enhanced review endpoints
	api := router.PathPrefix("/api").Subrouter()

	// CRUD operations
	api.HandleFunc("/enhanced-reviews", reviewHandler.CreateEnhancedReview).Methods("POST")
	api.HandleFunc("/enhanced-reviews", reviewHandler.GetEnhancedReviews).Methods("GET")
	api.HandleFunc("/enhanced-reviews/stats", reviewHandler.GetEnhancedReviewStats).Methods("GET")

	// Individual review operations
	api.HandleFunc("/enhanced-reviews/{id}", reviewHandler.GetReviewByID).Methods("GET")
	api.HandleFunc("/enhanced-reviews/{id}/helpful", reviewHandler.MarkReviewHelpful).Methods("POST")
	api.HandleFunc("/enhanced-reviews/{id}/report", reviewHandler.ReportReview).Methods("POST")
}