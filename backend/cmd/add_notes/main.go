package main

import (
	"fmt"
	"log"
	"math/rand"

	"perfume-website/internal/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	_ "modernc.org/sqlite"
)

// Sample notes by category
var notesByCategory = map[string][]struct {
	Type     models.NoteType
	Notes    []string
	Intensity int
}{
	"Fresh Scent": {
		{Type: models.NoteTypeTop, Notes: []string{"Bergamot", "Lemon", "Neroli"}, Intensity: 7},
		{Type: models.NoteTypeMiddle, Notes: []string{"Jasmine", "Green Tea", "Marine"}, Intensity: 5},
		{Type: models.NoteTypeBase, Notes: []string{"Musk", "Cedar", "Sandalwood"}, Intensity: 3},
	},
	"Woody Spicy": {
		{Type: models.NoteTypeTop, Notes: []string{"Black Pepper", "Cardamom", "Ginger"}, Intensity: 6},
		{Type: models.NoteTypeMiddle, Notes: []string{"Sandalwood", "Cedarwood", "Patchouli"}, Intensity: 7},
		{Type: models.NoteTypeBase, Notes: []string{"Vanilla", "Amber", "Leather"}, Intensity: 5},
	},
	"Woody Aromatic": {
		{Type: models.NoteTypeTop, Notes: []string{"Lavender", "Rosemary", "Basil"}, Intensity: 6},
		{Type: models.NoteTypeMiddle, Notes: []string{"Vetiver", "Geranium", "Clary Sage"}, Intensity: 5},
		{Type: models.NoteTypeBase, Notes: []string{"Oakmoss", "Tonka Bean", "Sandalwood"}, Intensity: 4},
	},
	"Amber Floral": {
		{Type: models.NoteTypeTop, Notes: []string{"Peach", "Apricot", "Pink Pepper"}, Intensity: 5},
		{Type: models.NoteTypeMiddle, Notes: []string{"Rose", "Jasmine", "Tuberose"}, Intensity: 8},
		{Type: models.NoteTypeBase, Notes: []string{"Amber", "Vanilla", "Sandalwood"}, Intensity: 6},
	},
	"Floral Fruity": {
		{Type: models.NoteTypeTop, Notes: []string{"Apple", "Berry", "Mandarin"}, Intensity: 6},
		{Type: models.NoteTypeMiddle, Notes: []string{"Peony", "Freesia", "Lily"}, Intensity: 7},
		{Type: models.NoteTypeBase, Notes: []string{"Musk", "Patchouli", "Vanilla"}, Intensity: 4},
	},
	"Oriental Vanilla": {
		{Type: models.NoteTypeTop, Notes: []string{"Orange Blossom", "Bergamot", "Neroli"}, Intensity: 5},
		{Type: models.NoteTypeMiddle, Notes: []string{"Vanilla", "Tonka Bean", "Cacao"}, Intensity: 8},
		{Type: models.NoteTypeBase, Notes: []string{"Sandalwood", "Amber", "Musk"}, Intensity: 6},
	},
	"Mass Pleaser": {
		{Type: models.NoteTypeTop, Notes: []string{"Lemon", "Apple", "Pineapple"}, Intensity: 7},
		{Type: models.NoteTypeMiddle, Notes: []string{"Jasmine", "Rose", "Patchouli"}, Intensity: 6},
		{Type: models.NoteTypeBase, Notes: []string{"Vanilla", "Musk", "Oakmoss"}, Intensity: 5},
	},
	"Aromatic Fougere": {
		{Type: models.NoteTypeTop, Notes: []string{"Lavender", "Rosemary", "Thyme"}, Intensity: 6},
		{Type: models.NoteTypeMiddle, Notes: []string{"Geranium", "Vetiver", "Carnation"}, Intensity: 5},
		{Type: models.NoteTypeBase, Notes: []string{"Oakmoss", "Tonka Bean", "Leather"}, Intensity: 4},
	},
	"Default": {
		{Type: models.NoteTypeTop, Notes: []string{"Bergamot", "Lemon", "Neroli"}, Intensity: 6},
		{Type: models.NoteTypeMiddle, Notes: []string{"Jasmine", "Rose", "Lavender"}, Intensity: 6},
		{Type: models.NoteTypeBase, Notes: []string{"Musk", "Vanilla", "Sandalwood"}, Intensity: 5},
	},
}

func main() {
	// Open database
	db, err := gorm.Open(sqlite.Dialector{
		DriverName: "sqlite",
		DSN:        "./perfume.db",
	}, &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Get all perfumes
	var perfumes []models.Perfume
	if err := db.Find(&perfumes).Error; err != nil {
		log.Fatal("Failed to fetch perfumes:", err)
	}

	fmt.Printf("Found %d perfumes\n", len(perfumes))

	// Clear existing notes
	db.Exec("DELETE FROM notes")
	fmt.Println("Cleared existing notes")

	notesCreated := 0

	// Add notes to each perfume
	for _, perfume := range perfumes {
		categoryNotes, exists := notesByCategory[perfume.Category]
		if !exists {
			categoryNotes = notesByCategory["Default"]
			fmt.Printf("Using default notes for category: %s\n", perfume.Category)
		}

		// Create notes for each type
		for _, noteGroup := range categoryNotes {
			// Randomly select 1-2 notes from this group
			numNotes := rand.Intn(2) + 1 // 1 or 2 notes
			selectedNotes := make(map[string]bool)

			for i := 0; i < numNotes && len(selectedNotes) < len(noteGroup.Notes); i++ {
				randNote := noteGroup.Notes[rand.Intn(len(noteGroup.Notes))]
				if !selectedNotes[randNote] {
					note := models.Note{
						PerfumeID: perfume.ID,
						Type:      noteGroup.Type,
						NoteName:  randNote,
						Intensity: noteGroup.Intensity + rand.Intn(3) - 1, // ±1 variation
					}

					if err := db.Create(&note).Error; err != nil {
						log.Printf("Failed to create note for perfume %s: %v", perfume.Name, err)
					} else {
						notesCreated++
						selectedNotes[randNote] = true
					}
				}
			}
		}

		if (len(perfumes)-notesCreated/3)%100 == 0 && notesCreated > 0 {
			fmt.Printf("Processed %d perfumes, created %d notes...\n", len(perfumes)-notesCreated/3, notesCreated)
		}
	}

	fmt.Printf("Successfully created %d notes for %d perfumes!\n", notesCreated, len(perfumes))

	// Verify notes were created
	var totalNotes int64
	db.Model(&models.Note{}).Count(&totalNotes)
	fmt.Printf("Total notes in database: %d\n", totalNotes)
}