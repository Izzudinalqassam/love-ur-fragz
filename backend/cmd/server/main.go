package main

import (
	"log"

	"perfume-website/internal/config"
	"perfume-website/internal/db"
	"perfume-website/internal/handlers"
	"perfume-website/internal/middleware"
	"perfume-website/internal/models"
	"perfume-website/internal/repositories"
	"perfume-website/internal/services"

	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize database
	database, err := db.NewDatabase(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer database.Close()

	// Database is already populated with CSV import data

	// Initialize repositories
	adminRepo := repositories.NewAdminRepository(database.GetDB())
	perfumeRepo := repositories.NewPerfumeRepository(database.GetDB())
	aromaRepo := repositories.NewAromaRepository(database.GetDB())
	quizRepo := repositories.NewQuizRepository(database.GetDB())
	enhancedReviewRepo := models.NewEnhancedReviewRepositoryGORM(database.GetDB())

	// Run auto migration for enhanced reviews
	if err := enhancedReviewRepo.AutoMigrate(); err != nil {
		log.Fatalf("Failed to auto-migrate enhanced reviews: %v", err)
	}

	// Initialize services
	authService := services.NewAuthService(adminRepo, cfg.JWTSecret)
	perfumeService := services.NewPerfumeService(perfumeRepo, aromaRepo)
	aromaService := services.NewAromaService(aromaRepo)
	quizService := services.NewQuizService(*quizRepo, perfumeRepo, aromaRepo)
	enhancedReviewService := services.NewEnhancedReviewService(enhancedReviewRepo)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	perfumeHandler := handlers.NewPerfumeHandler(perfumeService)
	aromaHandler := handlers.NewAromaHandler(aromaService)
	quizHandler := handlers.NewQuizHandler(quizService)
	enhancedReviewHandler := handlers.NewEnhancedReviewHandler(enhancedReviewService)

	// Set Gin mode
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Initialize router
	router := gin.Default()

	// Enable CORS
	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Public routes
	api := router.Group("/api")
	{
		// Authentication
		api.POST("/auth/login", authHandler.Login)

		// Public perfume endpoints
		api.GET("/perfumes", perfumeHandler.GetAllPerfumes)
		api.GET("/perfumes/:id", perfumeHandler.GetPerfume)
		api.POST("/recommend", perfumeHandler.RecommendPerfumes)

		// Public aroma endpoints
		api.GET("/aromas", aromaHandler.GetAllAromas)
		api.GET("/aromas/:id", aromaHandler.GetAroma)

		// Quiz endpoints
		api.POST("/quiz/recommendations", quizHandler.GetAdvancedRecommendations)
		api.POST("/quiz/save", quizHandler.SaveQuizResponse)
		api.GET("/quiz/stats", quizHandler.GetQuizStats)
		api.GET("/quiz/personality-types", quizHandler.GetPersonalityTypes)

		// Enhanced Review endpoints
		api.POST("/enhanced-reviews", enhancedReviewHandler.CreateEnhancedReview)
		api.GET("/enhanced-reviews", enhancedReviewHandler.GetEnhancedReviews)
		api.GET("/enhanced-reviews/stats", enhancedReviewHandler.GetEnhancedReviewStats)
		api.GET("/enhanced-reviews/:id", enhancedReviewHandler.GetReviewByID)
		api.POST("/enhanced-reviews/:id/helpful", enhancedReviewHandler.MarkReviewHelpful)
		api.POST("/enhanced-reviews/:id/report", enhancedReviewHandler.ReportReview)
	}

	// Protected routes (admin only)
	admin := api.Group("/admin")
	admin.Use(middleware.AuthMiddleware(authService))
	{
		// Admin profile
		admin.GET("/profile", authHandler.GetProfile)

		// Admin perfume management
		admin.POST("/perfumes", perfumeHandler.CreatePerfume)
		admin.PUT("/perfumes/:id", perfumeHandler.UpdatePerfume)
		admin.DELETE("/perfumes/:id", perfumeHandler.DeletePerfume)

		// Admin aroma management
		admin.POST("/aromas", aromaHandler.CreateAroma)
		admin.PUT("/aromas/:id", aromaHandler.UpdateAroma)
		admin.DELETE("/aromas/:id", aromaHandler.DeleteAroma)
	}

	// Start server
	log.Printf("Server starting on port %s", cfg.ServerPort)
	if err := router.Run(":" + cfg.ServerPort); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
