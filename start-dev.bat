@echo off
title LuxScents Development Environment
color 0A

echo ===============================================
echo   LuxScents Development Environment
echo ===============================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if Go is installed
go version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Go is not installed or not in PATH
    echo Please install Go from https://golang.org/
    pause
    exit /b 1
)

echo [INFO] Checking dependencies...

:: Install frontend dependencies if needed
if not exist "frontend\node_modules" (
    echo [INFO] Installing frontend dependencies...
    cd frontend
    npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install frontend dependencies
        pause
        exit /b 1
    )
    cd ..
)

:: Check backend dependencies
echo [INFO] Checking backend dependencies...
cd backend
go mod download
if errorlevel 1 (
    echo [ERROR] Failed to download backend dependencies
    pause
    exit /b 1
)
cd ..

echo [SUCCESS] Dependencies are ready!
echo.

:: Check if ports are available
echo [INFO] Checking port availability...
netstat -an | findstr :5173 >nul
if not errorlevel 1 (
    echo [WARNING] Port 5173 is already in use (Frontend)
    echo Please close the application using this port
    pause
    exit /b 1
)

netstat -an | findstr :8080 >nul
if not errorlevel 1 (
    echo [WARNING] Port 8080 is already in use (Backend)
    echo Please close the application using this port
    pause
    exit /b 1
)

echo [SUCCESS] Ports are available!
echo.

echo [INFO] Starting development servers...
echo   - Frontend: http://localhost:5173
echo   - Backend:  http://localhost:8080
echo   - Health:   http://localhost:8080/health
echo.
echo [INFO] You can close this window after both servers start
echo ===============================================
echo.

:: Start backend in new window
start "LuxScents Backend" cmd /k "cd backend && echo =============================================== && echo   Backend Server Starting... && echo =============================================== && echo. && go run cmd/server/main.go cmd/server/seed.go"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: Start frontend in new window
start "LuxScents Frontend" cmd /k "cd frontend && echo =============================================== && echo   Frontend Server Starting... && echo =============================================== && echo. && npm run dev"

echo.
echo [SUCCESS] Both servers are starting in separate windows!
echo.
echo Quick Access:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8080
echo   Health:   http://localhost:8080/health
echo.
echo Admin Login:
echo   Username: admin
echo   Password: admin123
echo.
echo Press any key to close this window...
pause >nul
