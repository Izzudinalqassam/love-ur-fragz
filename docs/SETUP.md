# 🚀 Setup Guide

This guide will help you set up the Love Ur Fragz development environment from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v18.0.0 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify with: `node --version`
- **Go** (v1.19 or higher)
  - Download from [golang.org](https://golang.org/dl/)
  - Verify with: `go version`
- **Git**
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify with: `git --version`

### Optional (Recommended)
- **VS Code** with extensions:
  - ES7+ React/Redux/React-Native snippets
  - TypeScript Importer
  - Prettier - Code formatter
  - ESLint
  - Go extension (for backend)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Izzudinalqassam/love-ur-fragz.git
cd love-ur-fragz
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Verify installation
npm run --version  # Should show npm version
```

#### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:8080

# App Configuration
VITE_APP_NAME="Love Ur Fragz"
VITE_APP_VERSION="1.0.0"

# Feature Flags
VITE_ENABLE_ADMIN=true
VITE_ENABLE_COMMUNITY=true
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Download Go modules
go mod download

# Verify installation
go version
```

#### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database Configuration
DB_PATH=./database/fragrances.db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE_HOURS=24

# Server Configuration
PORT=8080
GIN_MODE=debug

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 4. Database Initialization

```bash
# From backend directory
go run main.go

# This will automatically:
# 1. Create the database directory if it doesn't exist
# 2. Run database migrations
# 3. Seed initial data (aromas, sample perfumes)
```

The database will be created at `backend/database/fragrances.db`.

## Running the Application

### Option 1: Development Script (Recommended)

From the root directory:

```bash
# Start both frontend and backend
node start-dev.js

# Or using PowerShell
.\start-dev.ps1

# Or using Batch file (Windows)
start-dev.bat
```

This script will:
- Start the backend server on port 8080
- Start the frontend dev server on port 5173
- Open the application in your browser

### Option 2: Manual Startup

Open two separate terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
go run main.go
# Backend runs on: http://localhost:8080
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on: http://localhost:5173
```

### Access Points

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/api/health
- **Admin Panel**: http://localhost:5173/admin/login

## Verification

### 1. Check Frontend

Open http://localhost:5173 in your browser. You should see:
- ✅ Homepage with animated header
- ✅ Navigation menu
- ✅ Catalog page with perfumes
- ✅ Quiz system
- ✅ Community features

### 2. Check Backend

Test the API endpoints:

```bash
# Health check
curl http://localhost:8080/api/health

# Get perfumes
curl http://localhost:8080/api/perfumes

# Get aromas
curl http://localhost:8080/api/aromas
```

### 3. Check Database

Verify database file exists:
```bash
ls -la backend/database/fragrances.db
```

## Development Workflow

### Frontend Development

```bash
cd frontend

# Start development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build
```

### Backend Development

```bash
cd backend

# Run development server
go run main.go

# Build executable
go build -o bin/server

# Run tests
go test ./...

# Format code
go fmt ./...
```

### Database Management

```bash
cd backend

# Reset database (WARNING: This deletes all data)
rm database/fragrances.db
go run main.go  # Recreates with seed data

# Check database status
sqlite3 database/fragrances.db ".tables"
```

## Common Issues & Solutions

### Frontend Issues

**Issue: "Vite dev server not starting"**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: "API connection refused"**
- Check if backend is running on port 8080
- Verify `VITE_API_URL` in frontend `.env`
- Check for CORS issues in browser console

### Backend Issues

**Issue: "Database connection failed"**
```bash
# Create database directory
mkdir -p backend/database

# Check file permissions
ls -la backend/database/
```

**Issue: "Go modules not found"**
```bash
# Clean module cache
go clean -modcache
go mod download
```

### Port Conflicts

If ports 5173 or 8080 are in use:

```bash
# Kill processes on ports (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Kill processes on ports (macOS/Linux)
lsof -ti:5173 | xargs kill -9
```

Or change ports in:
- Frontend: `frontend/vite.config.ts`
- Backend: `backend/.env` (`PORT=8081`)

## IDE Configuration

### VS Code Extensions

Install these extensions for optimal development:

1. **ES7+ React/Redux/React-Native snippets**
2. **TypeScript Importer**
3. **Prettier - Code formatter**
4. **ESLint**
5. **Go**
6. **GitLens**
7. **Thunder Client** (for API testing)

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

## Production Deployment

### Frontend Build

```bash
cd frontend
npm run build
# Output in frontend/dist/
```

### Backend Build

```bash
cd backend
go build -o bin/server
# Output in backend/bin/server
```

### Environment Variables for Production

**Frontend (.env.production):**
```env
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME="Love Ur Fragz"
```

**Backend (.env.production):**
```env
DB_PATH=/var/lib/fragrances/app.db
JWT_SECRET=your-production-jwt-secret
PORT=8080
GIN_MODE=release
CORS_ORIGIN=https://yourdomain.com
```

## Getting Help

If you encounter issues:

1. **Check the logs**: Both frontend and backend provide detailed error logs
2. **Verify prerequisites**: Ensure all required software is installed
3. **Check environment variables**: Make sure all `.env` files are configured
4. **Consult the architecture documentation**: See `docs/ARCHITECTURE.md`
5. **Create an issue**: Report problems on GitHub

## Next Steps

Once the setup is complete:

1. Explore the application features
2. Read the architecture documentation
3. Review the API endpoints
4. Start making changes
5. Run the test suite
6. Deploy to staging

Happy coding! 🎉