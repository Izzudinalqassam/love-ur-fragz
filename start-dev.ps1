# Start Development Servers Script for Perfume Website

Write-Host "Starting Perfume Website Development Servers..." -ForegroundColor Green
Write-Host ""

# Start backend in background job
Start-Job -Name "Backend" -ScriptBlock {
    Set-Location backend
    Write-Host "Starting Go Backend..." -ForegroundColor Yellow
    go run cmd/server/main.go cmd/server/seed.go
}

# Wait for backend to initialize
Start-Sleep -Seconds 3

# Start frontend in background job  
Start-Job -Name "Frontend" -ScriptBlock {
    Set-Location frontend
    Write-Host "Starting React Frontend..." -ForegroundColor Yellow
    npm run dev
}

# Display information
Write-Host ""
Write-Host "✅ Both servers are starting..." -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔧 Backend:  http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "👤 Admin Login:" -ForegroundColor Yellow
Write-Host "   Username: admin" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White
Write-Host ""

Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Gray

# Wait for user input to stop
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    Write-Host "Stopping all servers..." -ForegroundColor Red
    Get-Job | Stop-Job
    Get-Job | Remove-Job
    Write-Host "All servers stopped." -ForegroundColor Green
}
