package db

import (
	"fmt"

	"perfume-website/internal/config"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	_ "modernc.org/sqlite"
)

type Database struct {
	DB *gorm.DB
}

func NewDatabase(cfg *config.Config) (*Database, error) {
	var db *gorm.DB
	var err error

	// Configure GORM logger based on environment
	logLevel := logger.Silent
	if cfg.Environment == "development" {
		logLevel = logger.Info
	}

	switch config.GetDatabaseDialect(cfg.DatabaseDriver) {
	case "sqlite":
		// Use modernc.org/sqlite driver (CGO-free)
		db, err = gorm.Open(sqlite.Dialector{
			DriverName: "sqlite",
			DSN:        cfg.DatabaseURL,
		}, &gorm.Config{
			Logger: logger.Default.LogMode(logLevel),
		})
	default:
		return nil, fmt.Errorf("unsupported database driver: %s", cfg.DatabaseDriver)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Skip auto-migration since we're using manual migrations
	// The schema is already created by the import script

	return &Database{DB: db}, nil
}

// GetDB returns the underlying GORM database instance
func (d *Database) GetDB() *gorm.DB {
	return d.DB
}

// Close closes the database connection
func (d *Database) Close() error {
	sqlDB, err := d.DB.DB()
	if err != nil {
		return err
	}
	return sqlDB.Close()
}
