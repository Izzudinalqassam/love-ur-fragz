package main

import (
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"strings"

	"perfume-website/internal/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	_ "modernc.org/sqlite"
)

func main() {
	// Open database using modernc.org/sqlite driver (CGO-free)
	db, err := gorm.Open(sqlite.Dialector{
		DriverName: "sqlite",
		DSN:        "./perfume.db",
	}, &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Skip auto-migration and use manual schema
	// The tables should be created by the initial migration

	// Open CSV file
	file, err := os.Open("Perfumes_dataset.csv")
	if err != nil {
		log.Fatal("Failed to open CSV file:", err)
	}
	defer file.Close()

	// Read CSV line by line to handle malformed records
	reader := csv.NewReader(file)
	records := make([][]string, 0)
	
	// Skip header first
	_, err = reader.Read()
	if err != nil {
		log.Fatal("Failed to read CSV header:", err)
	}

	lineNum := 2 // Start from line 2 (after header)
	for {
		record, err := reader.Read()
		if err != nil {
			if err.Error() == "EOF" {
				break
			}
			fmt.Printf("Skipping line %d: %v\n", lineNum, err)
			lineNum++
			continue
		}

		if len(record) >= 5 {
			records = append(records, record)
		} else {
			fmt.Printf("Skipping invalid line %d: %v\n", lineNum, record)
		}
		lineNum++
	}

	fmt.Printf("Read %d valid records from CSV\n", len(records))

	// Create aroma tags map from categories
	aromaTagsMap := make(map[string]models.AromaTag)
	uniqueCategories := make(map[string]bool)

	// First pass: collect unique categories
	for _, record := range records {
		if len(record) >= 4 {
			category := strings.TrimSpace(record[3])
			if category != "" {
				uniqueCategories[category] = true
			}
		}
	}

	// Create aroma tags for categories
	for category := range uniqueCategories {
		slug := strings.ToLower(strings.ReplaceAll(category, " ", "-"))
		aromaTag := models.AromaTag{
			Name: category,
			Slug: slug,
		}
		
		// Check if already exists
		var existingTag models.AromaTag
		result := db.Where("slug = ?", slug).First(&existingTag)
		if result.Error == gorm.ErrRecordNotFound {
			if err := db.Create(&aromaTag).Error; err != nil {
				log.Printf("Failed to create aroma tag %s: %v", category, err)
				continue
			}
			aromaTagsMap[category] = aromaTag
		} else {
			aromaTagsMap[category] = existingTag
		}
	}

	// Second pass: import perfumes
	for i, record := range records {
		if len(record) < 5 {
			continue
		}

		brand := strings.TrimSpace(record[0])
		perfumeName := strings.TrimSpace(record[1])
		perfumeType := strings.TrimSpace(record[2])
		category := strings.TrimSpace(record[3])
		targetAudience := strings.TrimSpace(record[4])
		longevity := "Medium"
		
		// Handle longevity if available (6th column)
		if len(record) > 5 {
			longevity = strings.TrimSpace(record[5])
		}

		if brand == "" || perfumeName == "" {
			continue
		}

		// Create perfume
		perfume := models.Perfume{
			Name:          perfumeName,
			Brand:         brand,
			Type:          perfumeType,
			Category:      category,
			TargetAudience: targetAudience,
			Longevity:     mapLongevity(longevity),
			Sillage:       "Medium", // Default value
			Price:         100.0,   // Default price
			Description:    fmt.Sprintf("%s by %s is a %s fragrance for %s with %s longevity. Belongs to %s category.", 
				perfumeName, brand, perfumeType, targetAudience, longevity, category),
		}

		// Check if perfume already exists
		var existingPerfume models.Perfume
		result := db.Where("name = ? AND brand = ?", perfume.Name, perfume.Brand).First(&existingPerfume)
		if result.Error == gorm.ErrRecordNotFound {
			if err := db.Create(&perfume).Error; err != nil {
				log.Printf("Failed to create perfume %s: %v", perfume.Name, err)
				continue
			}
		} else {
			perfume.ID = existingPerfume.ID
			if err := db.Save(&perfume).Error; err != nil {
				log.Printf("Failed to update perfume %s: %v", perfume.Name, err)
				continue
			}
		}

		// Associate with aroma tag if category exists
		if aromaTag, exists := aromaTagsMap[category]; exists {
			var perfumeAroma models.PerfumeAroma
			result := db.Where("perfume_id = ? AND aroma_tag_id = ?", perfume.ID, aromaTag.ID).First(&perfumeAroma)
			if result.Error == gorm.ErrRecordNotFound {
				perfumeAroma = models.PerfumeAroma{
					PerfumeID:  perfume.ID,
					AromaTagID: aromaTag.ID,
				}
				if err := db.Create(&perfumeAroma).Error; err != nil {
					log.Printf("Failed to create perfume-aroma association for %s: %v", perfume.Name, err)
				}
			}
		}

		if (i+1)%100 == 0 {
			fmt.Printf("Imported %d perfumes...\n", i+1)
		}
	}

	fmt.Printf("Successfully imported %d perfumes!\n", len(records))
	fmt.Printf("Created %d unique aroma tags!\n", len(aromaTagsMap))
}

func mapLongevity(longevity string) string {
	switch strings.ToLower(longevity) {
	case "strong", "very strong":
		return "Strong"
	case "medium", "medium-strong":
		return "Medium"
	case "light", "light-medium":
		return "Light"
	default:
		return "Medium"
	}
}
