# 🏗️ Architecture Documentation

## Overview

Love Ur Fragz is a full-stack web application following a modern microservices-inspired architecture with clear separation between frontend and backend concerns.

## System Architecture

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   Frontend      │ ◄──────────────► │    Backend      │
│   (React)       │                 │    (Go)         │
│                 │                 │                 │
│ - UI Components │                 │ - API Endpoints │
│ - State Mgmt    │                 │ - Business Logic│
│ - Routing       │                 │ - Database      │
└─────────────────┘                 └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │   Database      │
                                    │   (SQLite)      │
                                    │                 │
                                    │ - Perfumes      │
                                    │ - Reviews       │
                                    │ - Users         │
                                    │ - Aromas        │
                                    └─────────────────┘
```

## Frontend Architecture

### Technology Stack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router** for navigation
- **React Query** for server state

### Component Architecture

```
src/
├── components/          # Reusable UI Components
│   ├── ui/             # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── ...
│   ├── community/      # Community-related components
│   │   ├── LikeDislikeButton.tsx
│   │   ├── CommentSection.tsx
│   │   └── ...
│   ├── catalog/        # Catalog-related components
│   │   ├── PerfumeCard.tsx
│   │   ├── EnhancedPerfumeCard.tsx
│   │   └── ...
│   ├── perfume/        # Individual perfume components
│   └── quiz/           # Quiz components
├── pages/              # Route-level components
│   ├── HomePage.tsx
│   ├── PerfumeCatalog.tsx
│   ├── PerfumeDetail.tsx
│   └── ...
├── hooks/              # Custom React hooks
│   ├── usePerfumeCatalog.ts
│   ├── useQuiz.ts
│   └── ...
├── stores/             # Zustand state stores
│   ├── communityStore.ts
│   ├── authStore.ts
│   └── ...
├── services/           # API services
│   ├── api.ts
│   └── perfumeService.ts
├── types/              # TypeScript definitions
│   ├── index.ts
│   └── community.ts
└── utils/              # Utility functions
```

### State Management Pattern

#### Community Store (Zustand)
```typescript
interface CommunityStore {
  // State
  reviews: Record<number, PerfumeReview[]>
  reviewStats: Record<number, PerfumeReviewStats>

  // Actions
  addReview: (review: PerfumeReview) => void
  updateReviewStats: (perfumeId: number, stats: Partial<PerfumeReviewStats>) => void
  getReviews: (perfumeId: number) => PerfumeReview[]
  getReviewStats: (perfumeId: number) => PerfumeReviewStats | null
  clearAllData: () => void
  resetCommunityData: () => void
}
```

#### Data Flow
1. User interactions trigger actions in components
2. Actions update Zustand store state
3. Store persists to localStorage
4. Components re-render based on state changes
5. API calls made through React Query for server sync

## Backend Architecture

### Technology Stack
- **Go 1.19+** programming language
- **Gin Framework** for HTTP routing
- **GORM** for database ORM
- **SQLite** for data persistence
- **JWT** for authentication

### Project Structure
```
backend/
├── main.go              # Application entry point
├── models/              # Database models
│   ├── perfume.go
│   ├── aroma.go
│   ├── user.go
│   └── review.go
├── handlers/            # HTTP request handlers
│   ├── perfume.go
│   ├── aroma.go
│   ├── admin.go
│   └── quiz.go
├── middleware/          # Request middleware
│   ├── auth.go
│   ├── cors.go
│   └── logging.go
├── database/            # Database setup
│   ├── connection.go
│   └── migrations.go
├── utils/               # Utility functions
│   ├── response.go
│   └── validation.go
└── go.mod              # Go dependencies
```

### API Design Patterns

#### RESTful Endpoints
```
GET    /api/perfumes           # List perfumes
GET    /api/perfumes/:id       # Get perfume
POST   /api/admin/perfumes     # Create perfume
PUT    /api/admin/perfumes/:id # Update perfume
DELETE /api/admin/perfumes/:id # Delete perfume

GET    /api/aromas             # List aromas
POST   /api/admin/aromas       # Create aroma

POST   /api/admin/login        # Admin authentication
POST   /api/quiz/submit        # Submit quiz
```

#### Response Format
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

## Database Schema

### Core Tables

#### Perfumes
```sql
CREATE TABLE perfumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    description TEXT,
    concentration VARCHAR(100),
    category VARCHAR(100),
    target_audience VARCHAR(100),
    longevity VARCHAR(50),
    sillage VARCHAR(50),
    created_at DATETIME,
    updated_at DATETIME
);
```

#### Aromas
```sql
CREATE TABLE aromas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100),
    created_at DATETIME
);
```

#### Perfume_Aromas (Many-to-Many)
```sql
CREATE TABLE perfume_aromas (
    perfume_id INTEGER,
    aroma_id INTEGER,
    intensity INTEGER DEFAULT 1,
    PRIMARY KEY (perfume_id, aroma_id),
    FOREIGN KEY (perfume_id) REFERENCES perfumes(id),
    FOREIGN KEY (aroma_id) REFERENCES aromas(id)
);
```

## Security Architecture

### Authentication & Authorization
1. **JWT-based authentication** for admin users
2. **Role-based access control** (admin vs public)
3. **CORS configuration** for frontend-backend communication
4. **Input validation** on all endpoints

### Data Protection
1. **SQL injection prevention** via parameterized queries (GORM)
2. **XSS protection** in frontend (React auto-escapes)
3. **Input sanitization** for user-generated content
4. **Rate limiting** considerations for future implementation

## Performance Considerations

### Frontend Optimizations
1. **Code splitting** with React.lazy()
2. **Image optimization** with responsive loading
3. **Debounced search** to reduce API calls
4. **Virtual scrolling** for large lists (future)
5. **Caching strategy** with React Query

### Backend Optimizations
1. **Database indexing** on frequently queried fields
2. **Pagination** for large datasets
3. **Connection pooling** (GORM handles this)
4. **Response compression** with Gin middleware
5. **Caching headers** for static responses

## Deployment Architecture

### Development Environment
```
Frontend (Vite Dev Server) :3000
Backend (Go Dev Server)   :8080
Database (SQLite File)    ./database/fragrances.db
```

### Production Considerations
```
Frontend (Static Files)   : Nginx/CDN
Backend (Go Binary)       : Docker Container
Database (PostgreSQL)     : Cloud SQL/Managed DB
Load Balancer             : Nginx/ALB
```

## Scalability Patterns

### Horizontal Scaling
1. **Stateless frontend** - easy CDN distribution
2. **Stateless backend** - multiple instances possible
3. **Database read replicas** for read-heavy operations
4. **Caching layer** (Redis) for frequently accessed data

### Microservices Preparation
1. **Clear API boundaries** between services
2. **Separate database contexts** per domain
3. **Async communication** ready (message queues)
4. **Service discovery** considerations

## Monitoring & Observability

### Logging Strategy
1. **Structured logging** in backend (JSON format)
2. **Error tracking** in frontend (console + remote)
3. **Performance metrics** (load times, API response)
4. **User behavior analytics** (community features)

### Health Checks
```go
// Backend health endpoint
func HealthCheck(c *gin.Context) {
    c.JSON(200, gin.H{
        "status": "healthy",
        "timestamp": time.Now(),
        "version": "1.0.0",
    })
}
```

## Development Workflow

### Local Development
1. **Hot reload** for frontend (Vite)
2. **Air auto-reload** for backend (Go)
3. **Database migrations** on startup
4. **Seed data** for testing

### Code Quality
1. **TypeScript strict mode** for type safety
2. **ESLint + Prettier** for code formatting
3. **Go fmt + go vet** for backend consistency
4. **Unit tests** for critical business logic

This architecture supports the current requirements while providing a solid foundation for future growth and scalability.