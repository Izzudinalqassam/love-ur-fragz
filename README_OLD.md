# 🌟 Luxury Fragrance Discovery Platform

A modern, AI-powered fragrance discovery platform that helps users find their perfect signature scent through personalized quizzes, community reviews, and an extensive catalog of luxury perfumes.

## ✨ Features

### 🎯 Core Features
- **Simplified 3-Step Quiz System**: Personalized fragrance recommendations in 2-3 minutes
- **Extensive Perfume Catalog**: Browse and search luxury fragrances with advanced filtering
- **Community Reviews**: Like, dislike, and comment on perfumes with persistent data
- **3D Animated Headers**: Dynamic backgrounds with floating orbs and particles
- **Responsive Design**: Optimized for desktop, tablet, and mobile

### 🔍 Smart Recommendation Algorithm
- Multi-Factor Analysis (Profile 40%, Season 20%, Occasion 20%, Performance 10%, Uniqueness 10%)
- Personality-Based Matching with 6 scent personalities (Light & Fresh, Warm & Spicy, etc.)
- Context-Aware recommendations considering occasions and seasons
- Advanced scoring system with visual feedback

### 🎨 Visual Design & UX
- **Modern UI/UX**: Clean, elegant interface with gradient effects
- **Interactive Elements**: Smooth transitions and micro-interactions
- **Consistent Branding**: Unified design language across all pages
- **3D Animations**: Hardware-accelerated floating orbs and particles
- **Mobile Optimized**: Touch-friendly interface with responsive layouts

### 🔧 Technical Features
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **State Management**: Zustand with localStorage persistence
- **Backend**: Go with SQLite database
- **Performance Optimized**: Lazy loading and hardware acceleration
- **Data Persistence**: Community data saved automatically to localStorage

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Go 1.21+
- Modern web browser

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd fragrance-discovery-platform
```

2. **Install frontend dependencies**
```bash
cd frontend
npm install
```

3. **Setup backend**
```bash
cd ../backend
go mod download
```

4. **Start the development servers**

**Backend (Terminal 1)**:
```bash
cd backend
go run main.go
```
Server runs on `http://localhost:8080`

**Frontend (Terminal 2)**:
```bash
cd frontend
npm run dev
```
App runs on `http://localhost:5173` (or next available port)

## 📁 Project Structure

```
fragrance-discovery-platform/
├── backend/                    # Go API server
│   ├── internal/
│   │   ├── handlers/          # API route handlers
│   │   ├── models/            # Database models
│   │   ├── services/          # Business logic
│   │   └── repositories/      # Data access layer
│   ├── Perfumes_dataset.csv   # Perfume data
│   └── main.go               # Application entry point
├── frontend/                  # React frontend
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── catalog/      # Perfume catalog components
│   │   │   ├── community/    # Community features
│   │   │   ├── home/         # Homepage components
│   │   │   ├── quiz/         # Quiz components
│   │   │   ├── ui/           # Base UI components
│   │   │   └── admin/        # Admin panel
│   │   ├── pages/            # Page components
│   │   ├── stores/           # State management
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API services
│   │   ├── types/            # TypeScript types
│   │   ├── lib/              # Utilities
│   │   └── data/             # Static data
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🎮 Usage Guide

### 1. Take the Fragrance Quiz
Navigate to `/quiz` and complete our 3-step personalized quiz:
- **Step 1**: Personal style & scent preferences (2-3 scent personalities)
- **Step 2**: Usage context & occasions (2+ occasions, 1-2 seasons)
- **Step 3**: Performance & impression preferences (longevity & desired impression)

### 2. Browse the Catalog
Visit `/catalog` to explore our fragrance collection:
- Search by name, brand, or notes
- Filter by category, concentration, aroma profile
- Sort by relevance, price, or rating
- View detailed information and community reviews

### 3. Community Features
- **Like/Dislike**: Quick feedback on fragrances
- **Comments**: Share detailed reviews and experiences
- **Persistent Data**: All interactions are saved automatically to localStorage

### 4. Admin Panel (if applicable)
Access `/admin` for fragrance management:
- Add/edit perfume information
- Manage community content
- View analytics and insights

## 🛠️ Development

### Available Scripts

**Frontend**:
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
```

**Backend**:
```bash
go run main.go       # Start development server
go build             # Build binary
go test ./...        # Run tests
```

### Key Components

#### Quiz System (Simplified)
- **SimpleQuizStep1.tsx**: Personal preferences (gender + 2-3 scent personalities)
- **SimpleQuizStep2.tsx**: Context & occasions (occasions + seasons)
- **SimpleQuizStep3.tsx**: Performance settings (longevity + impression)
- **useQuiz.ts**: Quiz state management with 3 steps total

#### Catalog System
- **EnhancedPerfumeCard.tsx**: Perfume cards with community stats (no quick view)
- **CatalogHeader.tsx**: Header with 3D animations matching home page style
- **EnhancedCatalogFilters.tsx**: Advanced filtering capabilities

#### Community Features
- **LikeDislikeButton.tsx**: Interactive rating system
- **CommentSection.tsx**: Review and comment functionality
- **communityStore.ts**: Community data persistence with localStorage

### State Management

#### Zustand Stores
- **authStore**: User authentication
- **communityStore**: Community data (reviews, stats) with persistence
- **usePerfumeCatalog**: Catalog state and filtering

All community data persists to localStorage automatically and survives page refreshes.

## 🎨 Styling & Design

### Design System
- **Colors**: Luxury grays, gold/yellow accents (`text-yellow-400`)
- **Typography**: Serif fonts for headings (`font-serif`), sans-serif for body
- **Animations**: Smooth transitions, 3D effects with hardware acceleration
- **Spacing**: Consistent margin/padding scale
- **Responsive**: Mobile-first approach with Tailwind breakpoints

### Visual Features
- **3D Backgrounds**: Floating orbs, magic particles, gradient waves
- **Gradient Text**: `bg-gradient-to-r from-white via-yellow-200 to-white`
- **Interactive Cards**: Hover effects, scale transforms, shadow transitions
- **Consistent Headers**: Same 3D animation style across home and catalog pages

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill processes using ports 5173-5180
   netstat -ano | findstr :5173
   taskkill /PID <PID> /F
   ```

2. **Backend not connecting**
   - Ensure backend is running on `http://localhost:8080`
   - Check API URL in frontend environment variables

3. **Community data not persisting after refresh**
   - Fixed! Removed auto-reset function from App.tsx
   - Data now persists correctly in localStorage
   - Check browser localStorage settings

4. **Images not loading**
   - Check perfume image URLs in database
   - Verify backend static file serving

### Performance Tips
- Enable lazy loading for images
- Use browser caching headers
- Optimize image formats (WebP)
- Monitor bundle size

## 📊 Recent Updates & Improvements

### ✅ Completed Features
- [x] **Simplified 3-Step Quiz**: Reduced from 4 to 3 steps for better UX
- [x] **Consistent Header Design**: Catalog header now matches home page with 3D animations
- [x] **Community Data Persistence**: Fixed data loss on refresh issue
- [x] **Removed Quick View**: Cleaner card design with view details only
- [x] **Mobile Optimization**: Enhanced responsive design and touch interactions
- [x] **Performance Improvements**: Hardware-accelerated animations and optimized rendering

### 🔄 Current Status
- **Quiz**: 3-step system (Personal → Context → Performance)
- **Catalog**: Full browsing with advanced filtering
- **Community**: Like/dislike and comment system with persistence
- **Design**: Consistent luxury theme across all pages
- **Data**: Automatic localStorage persistence for all user interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for type safety
- Follow Tailwind CSS naming conventions
- Write meaningful commit messages
- Include tests for new features

## 📋 Current Development Status

**Application is ready for production use with:**
- ✅ Fully functional quiz system
- ✅ Complete perfume catalog
- ✅ Community features with data persistence
- ✅ Responsive design
- ✅ Modern UI/UX with 3D animations
- ✅ Performance optimizations

**Next Priority Features (Ready for Implementation):**
1. 📱 Wishlist/Favorites System
2. 🔍 Advanced Search & Filtering
3. ⚖️ Product Comparison Tool
4. 📝 Enhanced Perfume Details

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Fragrance data from various industry sources
- UI inspiration from modern e-commerce platforms
- Community feedback and testing
- Open source contributors

## 📞 Support

For support or questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation

---

**Built with ❤️ for fragrance enthusiasts worldwide**
