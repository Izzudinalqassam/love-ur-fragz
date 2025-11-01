package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerPort      string
	DatabaseURL     string
	JWTSecret       string
	Environment     string
	UploadPath      string
	DatabaseDriver  string
}

func LoadConfig() (*Config, error) {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		// .env file not found, use environment variables
		fmt.Println("No .env file found, using environment variables")
	}

	config := &Config{
		ServerPort:      getEnv("SERVER_PORT", "8080"),
		DatabaseURL:     getEnv("DATABASE_URL", "./perfume.db"),
		JWTSecret:       getEnv("JWT_SECRET", "your-super-secret-jwt-key-change-in-production"),
		Environment:     getEnv("ENVIRONMENT", "development"),
		UploadPath:      getEnv("UPLOAD_PATH", "./uploads"),
		DatabaseDriver:  getEnv("DATABASE_DRIVER", "sqlite"),
	}

	// Validate required fields
	if config.JWTSecret == "your-super-secret-jwt-key-change-in-production" && config.Environment == "production" {
		return nil, fmt.Errorf("JWT_SECRET must be set in production")
	}

	return config, nil
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

// For easy migration to PostgreSQL/MySQL later
func GetDatabaseDialect(driver string) string {
	switch driver {
	case "postgres":
		return "postgres"
	case "mysql":
		return "mysql"
	case "sqlite":
		fallthrough
	default:
		return "sqlite"
	}
}
