# 🌸 Love Ur Fragz - Community Fragrance Discovery Platform

> A modern, community-driven fragrance discovery platform where users can explore, rate, and share their experiences with perfumes.

## 📖 About

Love Ur Fragz is a full-stack web application designed for fragrance enthusiasts to discover new perfumes, share their opinions, and engage with a community of like-minded individuals. The platform focuses on community interaction rather than commercial transactions.

### 🎯 Key Features

- **🔍 Perfume Catalog**: Browse and search through an extensive collection of fragrances
- **⭐ Community Rating**: Like/dislike system with detailed rating mechanism
- **💬 Comment System**: Share detailed reviews and experiences
- **🧠 Smart Quiz**: 3-step personalized fragrance recommendation quiz
- **🎨 Modern UI**: Beautiful, responsive design with smooth animations
- **⚡ Real-time Updates**: Live statistics and community interactions
- **📱 Mobile Responsive**: Optimized for all device sizes

## 🏗️ Architecture

### Tech Stack

#### Frontend (React + TypeScript)
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **React Query** - Server state management
- **Lucide React** - Beautiful icon library

#### Backend (Go + Gin)
- **Go** - High-performance backend language
- **Gin Framework** - HTTP web framework
- **GORM** - Go ORM for database operations
- **SQLite** - Lightweight database for development
- **JWT Authentication** - Secure admin authentication

### Project Structure

```
love-ur-fragz/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── stores/         # Zustand state management
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                 # Go backend API
│   ├── main.go            # Application entry point
│   ├── models/            # Database models
│   ├── handlers/          # HTTP handlers
│   ├── middleware/        # Middleware functions
│   ├── database/          # Database configuration
│   └── go.mod             # Go dependencies
├── docs/                   # Documentation
├── scripts/               # Utility scripts
├── README.md              # This file
└── .gitignore             # Git ignore rules
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Go** (v1.19 or higher)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Izzudinalqassam/love-ur-fragz.git
   cd love-ur-fragz
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   go mod download
   ```

4. **Setup Database**
   ```bash
   cd backend
   go run main.go  # This will auto-create the SQLite database
   ```

### Running the Application

#### Option 1: Using the Development Script (Recommended)

```bash
# From root directory
node start-dev.js
```

This will automatically start both frontend and backend servers.

#### Option 2: Manual Start

**Start Backend Server**
```bash
cd backend
go run main.go
# Backend runs on http://localhost:8080
```

**Start Frontend Server** (in separate terminal)
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Admin Panel**: http://localhost:5173/admin/login

## 📚 API Documentation

### Public Endpoints

#### Perfumes
- `GET /api/perfumes` - Get all perfumes with pagination
- `GET /api/perfumes/{id}` - Get specific perfume details
- `GET /api/perfumes/search?q={query}` - Search perfumes

#### Aromas/Notes
- `GET /api/aromas` - Get all aroma categories
- `GET /api/aromas/{id}` - Get specific aroma details

#### Quiz System
- `GET /api/quiz/questions` - Get quiz questions
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/recommendations/{result}` - Get recommendations

### Admin Endpoints (Authentication Required)

#### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout

#### Perfume Management
- `GET /api/admin/perfumes` - List all perfumes
- `POST /api/admin/perfumes` - Create new perfume
- `PUT /api/admin/perfumes/{id}` - Update perfume
- `DELETE /api/admin/perfumes/{id}` - Delete perfume

#### Aroma Management
- `GET /api/admin/aromas` - List all aromas
- `POST /api/admin/aromas` - Create new aroma
- `PUT /api/admin/aromas/{id}` - Update aroma
- `DELETE /api/admin/aromas/{id}` - Delete aroma

## 🎨 Frontend Components

### Core Components

#### Navigation
- `Navbar` - Main navigation with responsive design
- `CatalogHeader` - Catalog page header with search

#### Product Display
- `PerfumeCard` - Basic perfume display card
- `EnhancedPerfumeCard` - Advanced card with community features
- `PerfumeDetails` - Detailed product view

#### Community Features
- `LikeDislikeButton` - Community rating system
- `CommentSection` - User comment display and submission
- `CommunityStats` - Rating statistics display

#### Interactive Features
- `QuizStep1/2/3` - 3-step fragrance discovery quiz
- `CatalogFilters` - Advanced filtering system
- `Pagination` - Results pagination

### State Management

#### Community Store
```typescript
interface CommunityStore {
  reviews: Record<number, PerfumeReview[]>
  reviewStats: Record<number, PerfumeReviewStats>
  addReview: (review: PerfumeReview) => void
  getReviews: (perfumeId: number) => PerfumeReview[]
  getReviewStats: (perfumeId: number) => PerfumeReviewStats | null
}
```

#### Authentication Store
```typescript
interface AuthStore {
  user: User | null
  token: string | null
  login: (credentials: LoginCredentials) => void
  logout: () => void
}
```

## 🎯 User Features

### 1. Perfume Discovery
- Browse catalog with advanced filtering
- Search by name, brand, or aroma notes
- View detailed perfume information
- Check community ratings and reviews

### 2. Community Interaction
- Like/dislike perfumes
- Write detailed reviews
- View community statistics
- See what others are saying

### 3. Personalized Recommendations
- Take 3-step fragrance quiz
- Get personalized recommendations
- Discover new fragrances based on preferences

### 4. Admin Features
- Manage perfume database
- Add/edit aroma categories
- Moderate community content
- View platform statistics

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DB_PATH=./database/fragrances.db

# JWT Secret
JWT_SECRET=your-secret-key-here

# Server Configuration
PORT=8080
GIN_MODE=debug
```

### Frontend Configuration

The frontend can be configured via `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME="Love Ur Fragz"
```

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test                    # Run tests
npm run test:coverage      # Run with coverage
```

### Backend Tests
```bash
cd backend
go test ./...              # Run all tests
go test -v ./...           # Verbose output
```

### E2E Testing
```bash
npm run test:e2e           # End-to-end tests
```

## 📦 Build & Deployment

### Frontend Build
```bash
cd frontend
npm run build              # Production build
```

### Backend Build
```bash
cd backend
go build -o bin/server     # Build executable
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful component and variable names
- Write tests for new features
- Update documentation
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Fragrance data and information from various sources
- Community members for their valuable reviews and ratings
- Open source libraries and tools that made this project possible

## 📞 Support

For support, questions, or suggestions:

- Create an issue on GitHub
- Contact the development team
- Join our community discussions

---

**Made with ❤️ by fragrance enthusiasts, for fragrance enthusiasts**