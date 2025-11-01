package handlers

import (
	"net/http"

	"perfume-website/internal/models"
	"perfume-website/internal/services"

	"github.com/gin-gonic/gin"
)

type QuizHandler struct {
	quizService *services.QuizService
}

func NewQuizHandler(quizService *services.QuizService) *QuizHandler {
	return &QuizHandler{
		quizService: quizService,
	}
}

// GetAdvancedRecommendations returns personalized perfume recommendations based on quiz responses
func (h *QuizHandler) GetAdvancedRecommendations(c *gin.Context) {
	var req models.AdvancedRecommendationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request format",
			"details": err.Error(),
		})
		return
	}

	// Set default max results if not provided
	if req.MaxResults == 0 {
		req.MaxResults = 6
	}

	response, err := h.quizService.GetAdvancedRecommendations(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to generate recommendations",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

// SaveQuizResponse saves user's quiz responses for future improvements
func (h *QuizHandler) SaveQuizResponse(c *gin.Context) {
	var quiz models.PersonalityQuiz
	if err := c.ShouldBindJSON(&quiz); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid quiz data format",
			"details": err.Error(),
		})
		return
	}

	savedQuiz, err := h.quizService.SaveQuizResponse(quiz)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to save quiz response",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, savedQuiz)
}

// GetQuizStats returns statistics about quiz responses and popular preferences
func (h *QuizHandler) GetQuizStats(c *gin.Context) {
	stats, err := h.quizService.GetQuizStatistics()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to retrieve quiz statistics",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, stats)
}

// GetPersonalityTypes returns available personality types and their descriptions
func (h *QuizHandler) GetPersonalityTypes(c *gin.Context) {
	personalities := h.quizService.GetPersonalityTypes()
	c.JSON(http.StatusOK, personalities)
}