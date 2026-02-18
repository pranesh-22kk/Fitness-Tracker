# Cleanup Script - Remove Unnecessary Files and Folders
# Run this script from: C:\Users\Pranesh\Fitness-Tracker\Fitness-Tracker-main

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CLEANING UP UNNECESSARY FILES" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$removedCount = 0

# Function to safely remove file or directory
function Remove-SafeItem {
    param($Path, $ItemName)
    if (Test-Path $Path) {
        try {
            Remove-Item -Path $Path -Recurse -Force
            Write-Host "✓ Removed: $ItemName" -ForegroundColor Green
            return 1
        } catch {
            Write-Host "✗ Failed to remove: $ItemName - $($_.Exception.Message)" -ForegroundColor Red
            return 0
        }
    } else {
        Write-Host "- Skipped: $ItemName (not found)" -ForegroundColor Gray
        return 0
    }
}

Write-Host "Removing OLD/UNUSED page files..." -ForegroundColor Yellow
Write-Host ""

# OLD home files (using AdvancedHome)
$removedCount += Remove-SafeItem "frontend/src/pages/home/home.jsx" "home/home.jsx"
$removedCount += Remove-SafeItem "frontend/src/pages/home/home.scss" "home/home.scss"

# OLD register files (using AdvancedRegister)
$removedCount += Remove-SafeItem "frontend/src/pages/register/register.jsx" "register/register.jsx"
$removedCount += Remove-SafeItem "frontend/src/pages/register/register.scss" "register/register.scss"

# OLD preferences files (using AdvancedPreferences)
$removedCount += Remove-SafeItem "frontend/src/pages/preferences/preferences.jsx" "preferences/preferences.jsx"
$removedCount += Remove-SafeItem "frontend/src/pages/preferences/preferences.scss" "preferences/preferences.scss"

# OLD bmrInfo files (using AdvancedBmrCalculator)
$removedCount += Remove-SafeItem "frontend/src/pages/bmrInfo/bmrInfo.jsx" "bmrInfo/bmrInfo.jsx"
$removedCount += Remove-SafeItem "frontend/src/pages/bmrInfo/bmrInfo.scss" "bmrInfo/bmrInfo.scss"

# OLD lowLevelNutrition files (using AdvancedNutritionDetails)
$removedCount += Remove-SafeItem "frontend/src/pages/lowLevelNutrition/lowLevelNutrition.jsx" "lowLevelNutrition/lowLevelNutrition.jsx"
$removedCount += Remove-SafeItem "frontend/src/pages/lowLevelNutrition/lowLevelNutrition.scss" "lowLevelNutrition/lowLevelNutrition.scss"

# OLD dashboard3d files (using AdvancedDashboard)
$removedCount += Remove-SafeItem "frontend/src/pages/dashboard3d/Dashboard3D.jsx" "dashboard3d/Dashboard3D.jsx"
$removedCount += Remove-SafeItem "frontend/src/pages/dashboard3d/Dashboard3D.scss" "dashboard3d/Dashboard3D.scss"

# OLD workoutPlanner files (using AdvancedWorkout)
$removedCount += Remove-SafeItem "frontend/src/pages/workoutPlanner/WorkoutPlanner.jsx" "workoutPlanner/WorkoutPlanner.jsx"
$removedCount += Remove-SafeItem "frontend/src/pages/workoutPlanner/WorkoutPlanner.scss" "workoutPlanner/WorkoutPlanner.scss"

# OLD dashboard folder (unused)
$removedCount += Remove-SafeItem "frontend/src/pages/dashboard" "pages/dashboard/ (entire folder)"

Write-Host ""
Write-Host "Removing DUPLICATE documentation files..." -ForegroundColor Yellow
Write-Host ""

# Remove duplicate/outdated documentation
$removedCount += Remove-SafeItem "ADVANCED_3D_UI_README.md" "ADVANCED_3D_UI_README.md"
$removedCount += Remove-SafeItem "FIXES_APPLIED.md" "FIXES_APPLIED.md"
$removedCount += Remove-SafeItem "IMPLEMENTATION_GUIDE.md" "IMPLEMENTATION_GUIDE.md"
$removedCount += Remove-SafeItem "LOGIN_REGISTER_UI_UPDATE.md" "LOGIN_REGISTER_UI_UPDATE.md"
$removedCount += Remove-SafeItem "TEST_REPORT.md" "TEST_REPORT.md"
$removedCount += Remove-SafeItem "UPDATES_SUMMARY.md" "UPDATES_SUMMARY.md"

Write-Host ""
Write-Host "Removing OLD backend/frontend folders at root level..." -ForegroundColor Yellow
Write-Host ""

# Remove old duplicates at root level (outside Fitness-Tracker-main)
$removedCount += Remove-SafeItem "../backend" "../backend/ (root level duplicate)"
$removedCount += Remove-SafeItem "../frontend" "../frontend/ (root level duplicate)"

Write-Host ""
Write-Host "Removing 3D component files (if not used)..." -ForegroundColor Yellow
Write-Host ""

# Check if 3d components exist and are unused
$removedCount += Remove-SafeItem "frontend/src/components/3d" "components/3d/ (unused 3D components)"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CLEANUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Total items removed: $removedCount" -ForegroundColor Yellow
Write-Host ""
Write-Host "Remaining structure:" -ForegroundColor Cyan
Write-Host "  ✓ backend/ - Active backend server" -ForegroundColor White
Write-Host "  ✓ frontend/ - Active React app" -ForegroundColor White
Write-Host "  ✓ Essential documentation files" -ForegroundColor White
Write-Host "  ✓ Deployment configurations" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Test the application: npm start (in frontend folder)" -ForegroundColor White
Write-Host "  2. Verify everything still works" -ForegroundColor White
Write-Host "  3. Commit changes: git add . && git commit -m 'Cleanup unnecessary files'" -ForegroundColor White
Write-Host ""
