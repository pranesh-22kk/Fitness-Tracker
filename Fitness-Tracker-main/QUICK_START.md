# 🚀 Quick Start Guide - Enhanced Fitness Tracker

## Installation Steps

### 1. Install Dependencies

**Frontend:**
```bash
cd "Fitness-Tracker-main"
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the `backend` directory:

```env
MONGO_URL=mongodb://localhost:27017/fitness-tracker
JWT_SECRET=your_super_secret_jwt_key_here_12345
PORT=8000
```

### 3. Start MongoDB

**Windows:**
```powershell
# Start MongoDB service
net start MongoDB

# Or if using MongoDB Compass, just open it
```

**Mac/Linux:**
```bash
# Start MongoDB
brew services start mongodb-community
# or
sudo systemctl start mongod
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

You should see:
```
Backend is running. Listening on port 8000
Attempting to connect to MongoDB.
Successfully connected to MongoDB.
```

**Terminal 2 - Frontend:**
```bash
cd "Fitness-Tracker-main"
npm start
```

Browser will automatically open at: http://localhost:3000

## 🎯 First Steps

### 1. Create Account
- Click "Register"
- Fill in your details
- Click "Sign Up"

### 2. Set Up Profile
- Go to "Personal Info"
- Enter your height, weight, age
- Set your fitness goals

### 3. Explore New Features

#### 🎨 3D Dashboard
```
URL: http://localhost:3000/dashboard3d
```
- View animated 3D nutrition rings
- See 3D body model with muscle groups
- Track your daily stats

#### 💪 Workout Planner
```
URL: http://localhost:3000/workoutPlanner
```
- Browse exercise library (10+ exercises)
- Create custom workouts
- Use pre-built templates
- Track sets, reps, and weight

#### 🏆 Achievements
```
URL: http://localhost:3000/achievements
```
- View unlocked achievements
- Track your streak
- See level progress
- Analyze weekly activity

#### 📊 Progress Tracker
```
URL: http://localhost:3000/progressTracker
```
- Log weight and body fat
- Track measurements
- View progress charts
- Add progress photos

## 🔧 Troubleshooting

### Issue: MongoDB Not Connected
```powershell
# Check if MongoDB is running
Get-Service MongoDB
# or
mongod --version
```

### Issue: Port Already in Use
```powershell
# Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: 3D Components Not Showing
- Update your browser to latest version
- Enable hardware acceleration in browser settings
- Try Chrome or Firefox (best WebGL support)

## 📱 Feature Guide

### Creating Your First Workout

1. Go to Workout Planner
2. Click category filter (Chest, Back, Legs, etc.)
3. Click "+" on any exercise to add it
4. Exercise appears in "Your Workout" panel
5. Click "Start Workout" when ready

### Tracking Nutrition

1. Go to 3D Dashboard
2. View your nutrition rings
3. Each ring shows:
   - Red = Calories
   - Teal = Protein
   - Yellow = Carbs
   - Green = Fat

### Earning Achievements

Achievements unlock automatically when you:
- ✅ Complete your first workout (+10 XP)
- 🔥 Maintain a 7-day streak (+25 XP)
- 💯 Complete 100 workouts (+100 XP)
- ⚡ Burn 50,000 calories (+150 XP)

### Leveling Up

You earn XP from:
- Completing workouts: **50 XP**
- Unlocking achievements: **Varies by achievement**
- Maintaining streaks: **Bonus XP**

Level up formula: `XP needed = Level × 100`

## 🎮 Keyboard Shortcuts

- `Ctrl + K` - Quick search (coming soon)
- `Ctrl + N` - New workout (coming soon)
- `Ctrl + S` - Save progress (coming soon)

## 🌐 API Testing

Test backend endpoints with:

```bash
# Get user stats
curl http://localhost:8000/api/stats

# Create workout
curl -X POST http://localhost:8000/api/workouts \
  -H "Content-Type: application/json" \
  -d '{"name":"Morning Workout","exercises":[]}'

# Get all workouts
curl http://localhost:8000/api/workouts
```

## 📊 Sample Data

The app comes with sample data to help you explore features:
- 7 days of weight progress
- 3 months of measurements
- Pre-configured achievements
- Exercise library with 10+ exercises

## 🎨 UI Tour

### Color Meanings
- 🔴 Red (#ff6b6b) - Calories, warnings
- 🔵 Teal (#4ecdc4) - Protein, primary actions
- 🟡 Yellow (#ffe66d) - Carbs, highlights
- 🟢 Green (#a8e6cf) - Fat, success states
- 🟣 Purple (#667eea) - Premium features

### Icons Guide
- 🔥 = Streak/Hot
- 💪 = Strength/Workout
- 🏆 = Achievement
- ⚡ = Energy/Calories
- 📊 = Analytics/Charts

## 💡 Pro Tips

1. **Daily Check-in**: Visit dashboard daily to maintain streak
2. **Plan Ahead**: Create workouts in advance using templates
3. **Track Everything**: Log weight weekly for accurate progress
4. **Mix It Up**: Try different workout categories
5. **Set Goals**: Use progress tracker to set and achieve milestones

## 🆘 Need Help?

- Check the main `ENHANCED_README.md` for detailed docs
- Open an issue on GitHub
- Check browser console for errors (F12)

## 🎉 You're Ready!

Start your fitness journey with:
1. ✅ MongoDB running
2. ✅ Backend running on port 8000
3. ✅ Frontend running on port 3000
4. ✅ Account created

**Now go to:** http://localhost:3000/dashboard3d

Happy tracking! 💪🚀
