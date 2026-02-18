# Quick Vercel Deployment Script
# Run this after setting up MongoDB Atlas

# Step 1: Install Vercel CLI (if not installed)
Write-Host "Installing Vercel CLI..." -ForegroundColor Green
npm install -g vercel

# Step 2: Login to Vercel
Write-Host "`nLogging into Vercel..." -ForegroundColor Green
vercel login

# Step 3: Deploy to preview
Write-Host "`nDeploying to preview environment..." -ForegroundColor Green
vercel

# Step 4: Display next steps
Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "DEPLOYMENT PREVIEW CREATED!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Go to Vercel Dashboard" -ForegroundColor White
Write-Host "2. Add Environment Variables:" -ForegroundColor White
Write-Host "   - MONGODB_URI (from MongoDB Atlas)" -ForegroundColor Gray
Write-Host "   - JWT_SECRET (generate with: node -e 'console.log(require(`"crypto`").randomBytes(32).toString(`"hex`"))')" -ForegroundColor Gray
Write-Host "   - NODE_ENV = production" -ForegroundColor Gray
Write-Host "   - FRONTEND_URL = https://your-app.vercel.app" -ForegroundColor Gray
Write-Host "`n3. Deploy to production:" -ForegroundColor White
Write-Host "   vercel --prod" -ForegroundColor Cyan
Write-Host "`n==================================" -ForegroundColor Cyan

# Uncomment to auto-deploy to production (after adding env vars)
# Write-Host "`nDeploying to production..." -ForegroundColor Green
# vercel --prod
