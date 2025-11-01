package main

import (
	"log"

	"perfume-website/internal/models"
	"perfume-website/internal/repositories"

	"gorm.io/gorm"
)

func seedData(db *gorm.DB) error {
	// Initialize repositories
	adminRepo := repositories.NewAdminRepository(db)
	aromaRepo := repositories.NewAromaRepository(db)
	perfumeRepo := repositories.NewPerfumeRepository(db)

	// Create admin user if not exists
	if _, err := adminRepo.GetByUsername("admin"); err != nil {
		admin := &models.Admin{
			Username:  "admin",
			Email:     "admin@perfume.com",
			Password:  "admin123", // Will be hashed by BeforeCreate hook
			FirstName: "Admin",
			LastName:  "User",
			IsActive:  true,
		}
		if err := adminRepo.Create(admin); err != nil {
			return err
		}
		log.Println("Created admin user: admin/admin123")
	}

	// Create aroma tags
	aromas := []models.AromaTag{
		{Slug: "floral", Name: "Floral"},
		{Slug: "woody", Name: "Woody"},
		{Slug: "citrus", Name: "Citrus"},
		{Slug: "sweet", Name: "Sweet"},
		{Slug: "spicy", Name: "Spicy"},
		{Slug: "fresh", Name: "Fresh"},
		{Slug: "oriental", Name: "Oriental"},
		{Slug: "aquatic", Name: "Aquatic"},
		{Slug: "green", Name: "Green"},
		{Slug: "fruity", Name: "Fruity"},
		{Slug: "gourmand", Name: "Gourmand"},
		{Slug: "powdery", Name: "Powdery"},
	}

	for _, aroma := range aromas {
		if _, err := aromaRepo.GetBySlug(aroma.Slug); err != nil {
			if err := aromaRepo.Create(&aroma); err != nil {
				return err
			}
		}
	}

	// Get aroma tags for relationships
	floral, _ := aromaRepo.GetBySlug("floral")
	woody, _ := aromaRepo.GetBySlug("woody")
	citrus, _ := aromaRepo.GetBySlug("citrus")
	sweet, _ := aromaRepo.GetBySlug("sweet")
	spicy, _ := aromaRepo.GetBySlug("spicy")
	fresh, _ := aromaRepo.GetBySlug("fresh")
	aquatic, _ := aromaRepo.GetBySlug("aquatic")
	powdery, _ := aromaRepo.GetBySlug("powdery")
	gourmand, _ := aromaRepo.GetBySlug("gourmand")

	// Create sample perfumes
	perfumes := []models.Perfume{
		{
			Name:          "Chanel No. 5",
			Brand:         "Chanel",
			Type:          "EDP",
			Category:      "Floral",
			TargetAudience: "Women",
			Longevity:     "High",
			Sillage:       "Medium",
			Price:         150.00,
			Description:   "The iconic floral aldehyde fragrance that revolutionized perfumery.",
			ImageURL:      "/images/chanel-no5.jpg",
			AromaTags:     []models.AromaTag{*floral, *powdery},
			Notes: []models.Note{
				{Type: models.NoteTypeTop, NoteName: "Aldehydes", Intensity: 8},
				{Type: models.NoteTypeTop, NoteName: "Neroli", Intensity: 6},
				{Type: models.NoteTypeMiddle, NoteName: "Rose", Intensity: 7},
				{Type: models.NoteTypeMiddle, NoteName: "Jasmine", Intensity: 8},
				{Type: models.NoteTypeBase, NoteName: "Sandalwood", Intensity: 6},
				{Type: models.NoteTypeBase, NoteName: "Vanilla", Intensity: 5},
			},
		},
		{
			Name:          "Sauvage",
			Brand:         "Dior",
			Type:          "EDT",
			Category:      "Woody",
			TargetAudience: "Men",
			Longevity:     "Medium",
			Sillage:       "High",
			Price:         120.00,
			Description:   "A radically fresh composition with a powerful trail of ambroxan.",
			ImageURL:      "/images/dior-sauvage.jpg",
			AromaTags:     []models.AromaTag{*fresh, *woody, *spicy},
			Notes: []models.Note{
				{Type: models.NoteTypeTop, NoteName: "Bergamot", Intensity: 7},
				{Type: models.NoteTypeTop, NoteName: "Pepper", Intensity: 6},
				{Type: models.NoteTypeMiddle, NoteName: "Sichuan Pepper", Intensity: 8},
				{Type: models.NoteTypeMiddle, NoteName: "Lavender", Intensity: 6},
				{Type: models.NoteTypeBase, NoteName: "Ambroxan", Intensity: 9},
				{Type: models.NoteTypeBase, NoteName: "Cedarwood", Intensity: 7},
			},
		},
		{
			Name:          "Black Opium",
			Brand:         "Yves Saint Laurent",
			Type:          "EDP",
			Category:      "Oriental",
			TargetAudience: "Women",
			Longevity:     "Very High",
			Sillage:       "High",
			Price:         135.00,
			Description:   "A glamorous and addictive fragrance with coffee and vanilla notes.",
			ImageURL:      "/images/ysl-black-opium.jpg",
			AromaTags:     []models.AromaTag{*sweet, *spicy, *gourmand},
			Notes: []models.Note{
				{Type: models.NoteTypeTop, NoteName: "Pear", Intensity: 7},
				{Type: models.NoteTypeTop, NoteName: "Pink Pepper", Intensity: 6},
				{Type: models.NoteTypeMiddle, NoteName: "Coffee", Intensity: 9},
				{Type: models.NoteTypeMiddle, NoteName: "Jasmine", Intensity: 6},
				{Type: models.NoteTypeBase, NoteName: "Vanilla", Intensity: 8},
				{Type: models.NoteTypeBase, NoteName: "Patchouli", Intensity: 7},
			},
		},
		{
			Name:          "Acqua di Gio",
			Brand:         "Giorgio Armani",
			Type:          "EDT",
			Category:      "Aquatic",
			TargetAudience: "Men",
			Longevity:     "Medium",
			Sillage:       "Medium",
			Price:         110.00,
			Description:   "A fresh, aquatic fragrance inspired by the Mediterranean sea.",
			ImageURL:      "/images/armani-acqua-di-gio.jpg",
			AromaTags:     []models.AromaTag{*aquatic, *fresh, *citrus},
			Notes: []models.Note{
				{Type: models.NoteTypeTop, NoteName: "Lemon", Intensity: 7},
				{Type: models.NoteTypeTop, NoteName: "Bergamot", Intensity: 8},
				{Type: models.NoteTypeMiddle, NoteName: "Sea Notes", Intensity: 9},
				{Type: models.NoteTypeMiddle, NoteName: "Rosemary", Intensity: 6},
				{Type: models.NoteTypeBase, NoteName: "Cedar", Intensity: 7},
				{Type: models.NoteTypeBase, NoteName: "Musk", Intensity: 6},
			},
		},
		{
			Name:          "La Vie Est Belle",
			Brand:         "Lancôme",
			Type:          "EDP",
			Category:      "Floral",
			TargetAudience: "Women",
			Longevity:     "High",
			Sillage:       "Medium",
			Price:         125.00,
			Description:   "A sweet and floral fragrance that celebrates happiness and joy.",
			ImageURL:      "/images/lancome-la-vie-est-belle.jpg",
			AromaTags:     []models.AromaTag{*floral, *sweet, *gourmand},
			Notes: []models.Note{
				{Type: models.NoteTypeTop, NoteName: "Blackcurrant", Intensity: 7},
				{Type: models.NoteTypeTop, NoteName: "Pear", Intensity: 6},
				{Type: models.NoteTypeMiddle, NoteName: "Iris", Intensity: 8},
				{Type: models.NoteTypeMiddle, NoteName: "Jasmine", Intensity: 7},
				{Type: models.NoteTypeBase, NoteName: "Vanilla", Intensity: 9},
				{Type: models.NoteTypeBase, NoteName: "Praline", Intensity: 8},
			},
		},
		{
			Name:          "Bleu de Chanel",
			Brand:         "Chanel",
			Type:          "EDT",
			Category:      "Woody",
			TargetAudience: "Men",
			Longevity:     "High",
			Sillage:       "High",
			Price:         140.00,
			Description:   "A sophisticated woody aromatic fragrance for the modern man.",
			ImageURL:      "/images/chanel-bleu.jpg",
			AromaTags:     []models.AromaTag{*woody, *citrus, *fresh},
			Notes: []models.Note{
				{Type: models.NoteTypeTop, NoteName: "Lemon", Intensity: 7},
				{Type: models.NoteTypeTop, NoteName: "Mint", Intensity: 6},
				{Type: models.NoteTypeMiddle, NoteName: "Ginger", Intensity: 7},
				{Type: models.NoteTypeMiddle, NoteName: "Jasmine", Intensity: 5},
				{Type: models.NoteTypeBase, NoteName: "Sandalwood", Intensity: 8},
				{Type: models.NoteTypeBase, NoteName: "Cedar", Intensity: 7},
			},
		},
	}

	for _, perfume := range perfumes {
		// Check if perfume already exists
		if _, err := perfumeRepo.GetByID(perfume.ID); err != nil {
			if err := perfumeRepo.Create(&perfume); err != nil {
				return err
			}
		}
	}

	log.Println("Database seeded successfully!")
	return nil
}
