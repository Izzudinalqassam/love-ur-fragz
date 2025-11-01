package services

import (
	"fmt"
	"time"

	"perfume-website/internal/models"
	"perfume-website/internal/repositories"

	"github.com/golang-jwt/jwt/v5"
)

type AuthService interface {
 Login(req *models.LoginRequest) (*models.LoginResponse, error)
	GenerateToken(admin *models.Admin) (string, error)
	ValidateToken(tokenString string) (*models.Admin, error)
}

type authService struct {
	adminRepo repositories.AdminRepository
	jwtSecret string
}

type JWTClaims struct {
	AdminID uint `json:"admin_id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func NewAuthService(adminRepo repositories.AdminRepository, jwtSecret string) AuthService {
	return &authService{
		adminRepo: adminRepo,
		jwtSecret: jwtSecret,
	}
}

func (s *authService) Login(req *models.LoginRequest) (*models.LoginResponse, error) {
	// Get admin by username
	admin, err := s.adminRepo.GetByUsername(req.Username)
	if err != nil {
		return nil, fmt.Errorf("invalid credentials")
	}

	// Check if admin is active
	if !admin.IsActive {
		return nil, fmt.Errorf("account is deactivated")
	}

	// Verify password
	if !admin.CheckPassword(req.Password) {
		return nil, fmt.Errorf("invalid credentials")
	}

	// Generate token
	token, err := s.GenerateToken(admin)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token: %w", err)
	}

	// Remove password from response
	admin.Password = ""

	return &models.LoginResponse{
		Token: token,
		Admin: *admin,
	}, nil
}

func (s *authService) GenerateToken(admin *models.Admin) (string, error) {
	claims := JWTClaims{
		AdminID:  admin.ID,
		Username: admin.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), // 24 hours
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}

func (s *authService) ValidateToken(tokenString string) (*models.Admin, error) {
	token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(s.jwtSecret), nil
	})

	if err != nil {
		return nil, fmt.Errorf("invalid token: %w", err)
	}

	if claims, ok := token.Claims.(*JWTClaims); ok && token.Valid {
		admin, err := s.adminRepo.GetByID(claims.AdminID)
		if err != nil {
			return nil, fmt.Errorf("admin not found")
		}

		if !admin.IsActive {
			return nil, fmt.Errorf("account is deactivated")
		}

		return admin, nil
	}

	return nil, fmt.Errorf("invalid token claims")
}
