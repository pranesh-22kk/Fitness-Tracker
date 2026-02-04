# Enhanced Fitness Tracker - Installation Script
# Run this in PowerShell from the project root

Write-Host "🚀 Enhanced Fitness Tracker - Setup Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is installed
Write-Host "Checking MongoDB installation..." -ForegroundColor Yellow
$mongoVersion = mongod --version 2>$null
if ($mongoVersion) {
    Write-Host "✓ MongoDB found" -ForegroundColor Green
} else {
    Write-Host "⚠ MongoDB not found. Please install MongoDB from https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Installing Dependencies..." -ForegroundColor Cyan
Write-Host ""

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location "Fitness-Tracker-main\backend"
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Backend installation failed" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host ""
Write-Host "Installing frontend dependencies (this may take a few minutes)..." -ForegroundColor Yellow
Set-Location ".."
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend installation failed" -ForegroundColor Red
    exit 1
}

# Create .env file if it doesn't exist
Write-Host ""
Write-Host "⚙️ Setting up environment..." -ForegroundColor Cyan
Set-Location "backend"
if (!(Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    @"
MONGO_URL=mongodb://localhost:27017/fitness-tracker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=8000
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host "⚠ Please update the JWT_SECRET in backend/.env for production" -ForegroundColor Yellow
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

Set-Location ".."

Write-Host ""
Write-Host "✨ Installation Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Make sure MongoDB is running:" -ForegroundColor White
Write-Host "   net start MongoDB" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start the backend (in one terminal):" -ForegroundColor White
Write-Host "   cd Fitness-Tracker-main\backend" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start the frontend (in another terminal):" -ForegroundColor White
Write-Host "   cd Fitness-Tracker-main" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Open your browser to:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - Quick Start: QUICK_START.md" -ForegroundColor Gray
Write-Host "   - Full Docs: ENHANCED_README.md" -ForegroundColor Gray
Write-Host "   - Changes: CHANGES.md" -ForegroundColor Gray
Write-Host ""
Write-Host "Happy Tracking! 💪🚀" -ForegroundColor Green
