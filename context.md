# LuxScents Perfume Website - Project Context

## 🎯 Project Overview

LuxScents adalah website parfum luxury dengan sistem rekomendasi intelligent yang menggunakan algoritma multi-faktor dan quiz personalisasi untuk menemukan fragrance signature yang sempurna untuk setiap pengguna.

**Status**: Development
**Version**: 1.0.0
**Author**: LuxScents Team

## 🏗️ Architecture & Tech Stack

### Backend (Go)
- **Framework**: Gin Web Framework v1.9.1
- **Database**: SQLite dengan GORM ORM
- **Authentication**: JWT (golang-jwt/jwt/v5)
- **Password Hashing**: bcrypt (golang.org/x/crypto)
- **Environment**: godotenv untuk configuration management

### Frontend (React + TypeScript)
- **Framework**: React 19.1.1 dengan TypeScript
- **Build Tool**: Vite 7.1.7
- **Styling**: TailwindCSS 4.1.16
- **State Management**: Zustand 5.0.8
- **HTTP Client**: Axios 1.13.1
- **Forms**: React Hook Form 7.65.0 dengan Zod validation
- **Routing**: React Router DOM 7.9.5
- **Data Fetching**: TanStack React Query 5.90.5
- **Charts**: Recharts 3.3.0
- **Icons**: Lucide React 0.548.0

## 📁 Project Structure

```
luxscents-perfume-website/
├── backend/                    # Go backend application
│   ├── cmd/server/            # Main server entry point
│   ├── internal/              # Private application code
│   │   ├── config/           # Configuration management
│   │   ├── db/               # Database connection & setup
│   │   ├── handlers/         # HTTP handlers/controllers
│   │   ├── middleware/       # HTTP middleware
│   │   ├── models/           # Data models and structs
│   │   ├── repositories/     # Data access layer
│   │   └── services/         # Business logic layer
│   ├── db/migrations/         # Database migration files
│   ├── uploads/              # File upload storage
│   ├── perfume.db            # SQLite database
│   └── go.mod/go.sum         # Go dependency files
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/           # Page-level components
│   │   ├── services/        # API service functions
│   │   ├── stores/          # Zustand state stores
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   ├── lib/             # Library configurations
│   │   └── assets/          # Static assets
│   ├── public/              # Public static files
│   └── package.json         # Node.js dependencies
├── node_modules/            # Shared Node.js dependencies
├── package.json            # Root package.json with scripts
└── README.md               # Project documentation
```

## 🗄️ Database Schema

### Tables Overview

**Database**: SQLite (`perfume.db`)
**Migration System**: Manual SQL migrations
**Total Records**: 940 perfumes, 157 aroma tags, 3,772 notes

### Core Tables

#### `perfumes`
- **Purpose**: Main product catalog
- **Key Fields**: name, brand, type, category, target_audience, longevity, sillage, price, description, image_url
- **Soft Delete**: deleted_at column
- **Indexes**: brand, category, target_audience, deleted_at

#### `aroma_tags`
- **Purpose**: Standardized fragrance taxonomy
- **Key Fields**: slug (unique), name
- **Soft Delete**: deleted_at column
- **Usage**: Many-to-many relationship with perfumes

#### `perfume_aromas` (Junction Table)
- **Purpose**: Many-to-many relationship between perfumes and aroma tags
- **Foreign Keys**: perfume_id, aroma_tag_id
- **Constraints**: CASCADE delete

#### `notes`
- **Purpose**: Detailed fragrance notes (top, middle, base)
- **Key Fields**: perfume_id, type (top/middle/base), note_name, intensity
- **Types**: Top notes, Middle notes, Base notes

#### `admins`
- **Purpose**: Admin user authentication
- **Key Fields**: username, email, password, first_name, last_name, is_active
- **Security**: Password hashing, unique constraints on username/email

### Key Features
- **Soft Deletes**: All main tables use deleted_at for soft deletion
- **Proper Indexing**: Optimized queries with strategic indexes
- **Foreign Key Constraints**: Data integrity maintained
- **Audit Fields**: created_at, updated_at timestamps

## 🚀 Key Features & Functionality

### Smart Recommendation Algorithm
- **Multi-Factor Analysis**: Profile (40%), Season (20%), Occasion (20%), Performance (10%), Uniqueness (10%)
- **Personality-Based Matching**: Deep user preference analysis
- **Context-Aware**: Season, time, and occasion consideration
- **Advanced Scoring**: Confidence scoring with visual feedback

### Interactive Personality Quiz
- **4-Step Journey**: Engaging and intuitive user experience
- **Lifestyle Profiling**: Active, Relaxed, Professional, Creative personas
- **Visual Scent Selection**: 6 aroma profiles with emoji and gradient colors
- **Real-time Feedback**: Dynamic blend descriptions during selection

### User Profiling System
- **Scent Personality Analysis**: 'The Romantic Elegant', 'The Adventurous Explorer', etc.
- **Detailed Trait Mapping**: Energy, elegance, romance, adventure levels
- **Seasonal Preferences**: Weighting for each season
- **Occasion Suitability**: Work, dating, casual, special events

### Admin Dashboard Features
- **Product Management**: CRUD operations for perfumes
- **Aroma Management**: Tag system for fragrance classification
- **User Analytics**: Quiz results and recommendation tracking
- **Content Management**: Image uploads, product descriptions

## 🎨 UI/UX Design System

### Visual Elements
- **3D Animated Backgrounds**: Floating orbs, magic particles, gradient waves
- **Interactive Cards**: Hover effects, smooth transitions, visual feedback
- **Progress Visualization**: Step-by-step progress with visual indicators
- **Responsive Design**: Mobile and desktop optimized

### Design Patterns
- **Component-Based Architecture**: Reusable React components
- **State Management**: Zustand for global state
- **Form Validation**: Zod schemas with React Hook Form
- **Error Handling**: Comprehensive error boundaries and user feedback

## 🔧 Development Environment

### Local Development
- **Frontend**: http://localhost:5175 (Vite dev server)
- **Backend**: http://localhost:8080 (Go Gin server)
- **Enhanced Quiz**: http://localhost:5175/quiz
- **Original Quiz**: http://localhost:5175/recommendations

### Development Scripts
```bash
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Frontend only
npm run dev:backend      # Backend only
npm run build:frontend   # Build frontend for production
npm run build:backend    # Build backend binary
npm run install:deps     # Install all dependencies
```

## 📊 Data & Content

### Perfume Dataset
- **Source**: Perfumes_dataset.csv (141KB)
- **Records**: 940+ perfumes with complete metadata
- **Categories**: Various fragrance types and brands
- **Features**: Price, longevity, sillage, target audience

### Aroma Classification
- **Total Tags**: 157 unique aroma categories
- **Classification**: Standardized fragrance taxonomy
- **Relationships**: Complex many-to-many mappings

## 🔐 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure admin authentication
- **Password Hashing**: bcrypt encryption
- **Session Management**: Token-based API security

### Data Protection
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: GORM parameterized queries
- **CORS Configuration**: Proper cross-origin resource sharing

## 🚦 API Architecture

### RESTful Endpoints
- **Authentication**: `/api/auth/login`, `/api/auth/refresh`
- **Products**: `/api/perfumes`, `/api/perfumes/:id`
- **Recommendations**: `/api/recommendations/quiz`, `/api/recommendations/personality`
- **Admin**: `/api/admin/perfumes`, `/api/admin/aromas`

### Data Flow
1. **Frontend**: React components with state management
2. **API Layer**: Axios HTTP client with React Query
3. **Backend**: Gin handlers with middleware
4. **Services**: Business logic and recommendation engine
5. **Repositories**: Data access with GORM
6. **Database**: SQLite with optimized schema

## 🎯 Development Guidelines

### Code Organization
- **Separation of Concerns**: Clear distinction between layers
- **TypeScript**: Strict typing throughout frontend
- **Go Conventions**: Standard Go project structure
- **Component Reusability**: Modular React components

### Best Practices
- **Error Handling**: Comprehensive error boundaries
- **Performance**: Optimized database queries and React rendering
- **Testing**: Unit tests for business logic
- **Documentation**: Clear code comments and API documentation

---

*This context document provides a comprehensive overview of the LuxScents perfume recommendation system. For specific implementation details, refer to the respective source code files and documentation.*