# 🏋️ Fitness Tracker - Complete User Guide

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [User Guide](#user-guide)
- [Modules Overview](#modules-overview)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

**Fitness Tracker** is a comprehensive health and fitness management platform with stunning 3D visualizations, real-time tracking, and intelligent nutrition insights. Built with React, Node.js, MongoDB, and Three.js for an immersive user experience.

### Key Technologies
- **Frontend**: React 18.2.0, Material-UI 5, Three.js, React Three Fiber
- **Backend**: Node.js, Express, MongoDB
- **Features**: JWT Authentication, Real-time tracking, 3D Visualizations, Responsive Design

---

## ✨ Features

### 🔐 Authentication & Onboarding
- **Modern Login/Register**: Beautiful 3D animated login and registration pages
- **Personalized Preferences**: Set your fitness goals, dietary preferences, and health metrics
- **Secure Authentication**: JWT-based token authentication

### 🍽️ Nutrition Tracking
- **Meal Tracker**: Log breakfast, lunch, dinner, and snacks with detailed nutritional information
- **Food Database**: Access comprehensive food information with macros and micronutrients
- **Nutrition Goals**: Set and track daily calorie, protein, carbs, and fat goals
- **Micronutrient Tracking**: Monitor 20+ vitamins, minerals, and essential nutrients
- **BMR Calculator**: Calculate your Basal Metabolic Rate and daily calorie needs
- **Meal Planning**: Save favorite meals, view popular items, get personalized recommendations

### 💪 Exercise & Fitness
- **Exercise Tracker**: Log weight lifting, cardio, and other exercises
- **Workout Planner**: Create and follow custom workout routines (Advanced)
- **Progress Tracking**: Monitor your fitness journey with detailed charts and graphs
- **Achievements**: Unlock badges and milestones as you progress

### 📊 Health Monitoring
- **Weight Tracking**: Log daily weight with trend analysis
- **Sleep Tracking**: Monitor sleep duration and quality
- **Water Intake**: Track daily hydration levels
- **Supplement Tracking**: Log vitamins and supplements

### 🎨 3D Visualizations
- **Interactive Dashboards**: Immersive 3D data visualizations
- **Animated Charts**: Real-time animated progress indicators
- **Particle Effects**: Beautiful visual effects throughout the app
- **Smooth Transitions**: Framer Motion animations for seamless navigation

---

## 🚀 Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

### Backend Setup
```bash
# Navigate to backend directory
cd Fitness-Tracker-main/backend

# Install dependencies
npm install

# Create .env file with:
# MONGODB_URI=mongodb://localhost:27017/fitness-tracker
# JWT_SECRET=your-secret-key-here
# PORT=8000

# Start MongoDB service
# Windows: net start MongoDB
# Mac/Linux: sudo systemctl start mongod

# Run backend server
node index.js
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd Fitness-Tracker-main/frontend

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start
```

---

## 🎮 Running the Application

### Step 1: Start Backend (Port 8000)
```bash
cd Fitness-Tracker-main/backend
node index.js
```
✅ You should see: "Server is running on port 8000" and "MongoDB connected"

### Step 2: Start Frontend (Port 3000)
```bash
cd Fitness-Tracker-main/frontend
npm start
```
✅ Browser will open automatically at `http://localhost:3000`

### Step 3: Create Account
1. Click "Register" on the home page
2. Fill in your details (email, password, username)
3. Complete preferences (height, weight, activity level, dietary restrictions)
4. Start tracking your fitness journey!

---

## 📱 User Guide

### 1. **Home Dashboard** (`/`)
- Overview of your daily progress
- Quick access to all modules
- Recent activity summary
- 3D animated welcome screen

### 2. **Meal Tracking** (`/mealTracker`)
**How to Log a Meal:**
1. Navigate to Meal Tracker
2. Click "ADD FOOD ITEM"
3. Enter food details:
   - Food Name
   - Calories
   - Protein (g)
   - Carbohydrates (g)
   - Fat (g)
   - Servings
   - Serving Size
   - Meal Type (Breakfast/Lunch/Dinner/Snack)
4. Click "Add Food"
5. View your meal in the list with nutritional breakdown

**Features:**
- ✅ Filter by meal type (All, Breakfast, Lunch, Dinner, Snack)
- ✅ Filter by date
- ✅ Daily nutrition summary (calories, macros)
- ✅ 3D particle visualizations
- ✅ Meal icons and color coding

### 3. **Nutrition Goals** (`/nutritionGoals`)
**How to Set Goals:**
1. Navigate to Nutrition Goals
2. Select your goal type:
   - Weight Loss (calorie deficit)
   - Maintenance (balanced)
   - Muscle Gain (calorie surplus)
3. Adjust macro ratios:
   - Protein slider (10-50%)
   - Carbohydrates slider (20-60%)
   - Fat slider (15-40%)
4. Set daily calorie target
5. Click "Save Goals"

**Features:**
- ✅ Visual macro distribution pie chart
- ✅ Daily calorie recommendations
- ✅ Progress bars for each nutrient
- ✅ Goal achievement indicators

### 4. **Nutrition Details** (`/lowLevelNutrition`)
**Track 20+ Nutrients:**
- **Macros & Energy**: Calories, Protein, Carbs, Fat, Fiber, Sugar, Sodium
- **Vitamins**: A, C, D, E, K, B6, B12, Folate, Thiamin, Riboflavin
- **Minerals**: Calcium, Iron, Magnesium, Zinc, Potassium
- **Other**: Cholesterol, Saturated Fat, Trans Fat, Water

**How to Update:**
1. Click "Edit" icon on any nutrient card
2. Enter new value
3. Click "Save" or "Cancel"
4. View progress bar (Low/Good/High indicators)

### 5. **Exercise Tracking** (`/exerciseTracker`)
**How to Log Exercise:**
1. Navigate to Exercise Tracker
2. Click "ADD ENTRY"
3. Fill in details:
   - Exercise Name
   - Exercise Type (Weight Lifting/Cardio/Other)
   - Sets (for weight lifting)
   - Reps (for weight lifting)
   - Weight (lbs)
   - Duration (minutes)
   - Distance (miles, for cardio)
   - Calories Burned
4. Click "Add Entry"

**Features:**
- ✅ Categorized by exercise type
- ✅ Detailed exercise logs with all metrics
- ✅ Date filtering
- ✅ 3D scene with animated spheres

### 6. **Health Tracking** (`/otherHealthTracker`)
**Track Multiple Health Metrics:**

**Weight:**
- Daily weight logs (lbs/kg)
- Trend charts
- Goal comparison

**Sleep:**
- Sleep duration (hours)
- Sleep quality tracking
- Weekly averages

**Water:**
- Daily water intake (oz)
- Hydration goals
- Visual progress

**Supplements:**
- Supplement name
- Dosage tracking
- Daily logging

### 7. **BMR Calculator** (`/bmrInfo`)
**Calculate Your Basal Metabolic Rate:**
1. Enter your details:
   - Age
   - Gender
   - Height (cm)
   - Weight (kg)
   - Activity Level (Sedentary to Extra Active)
2. View results:
   - BMR (calories at rest)
   - TDEE (total daily energy expenditure)
   - Recommended calories for your goals

**Features:**
- ✅ Mifflin-St Jeor equation
- ✅ Activity multipliers
- ✅ Goal-based recommendations
- ✅ 3D animated calculations

### 8. **Progress Tracking** (`/progressTracker`)
- Weight change over time
- Body measurements
- Fitness milestones
- Before/after comparisons
- Charts and graphs

### 9. **Achievements** (`/achievements`)
- Unlock badges for milestones
- Streak tracking
- Goal completion rewards
- Leaderboard (if enabled)

### 10. **Settings** (`/settings`)
- Update personal information
- Change password
- Notification preferences
- Privacy settings
- Theme customization

---

## 🔧 Modules Overview

### ✅ **Fully Functional Modules**

#### 1. **Authentication System**
- ✅ Login with JWT tokens
- ✅ Registration with validation
- ✅ Password encryption
- ✅ Preferences onboarding
- ✅ Secure routes

#### 2. **Meal Tracker**
- ✅ Add food items with dialog form
- ✅ All 8 fields working (name, calories, protein, carbs, fat, servings, serving size, meal type)
- ✅ Date filtering (shows today's meals by default)
- ✅ Meal type filtering (breakfast, lunch, dinner, snack, all)
- ✅ Daily nutrition summary
- ✅ 3D particle background
- ✅ Real-time updates
- ✅ Form validation
- ✅ Success/error alerts

#### 3. **Exercise Tracker**
- ✅ Add exercise entries (weight lifting, cardio, other)
- ✅ All fields functional (name, type, sets, reps, weight, duration, distance, calories)
- ✅ Endpoint: `PUT /api/users/addExercise/:userId`
- ✅ Response handling for liftingLog, cardioLog, otherExerciseLog
- ✅ Error handling with console logs
- ✅ Success/error alerts

#### 4. **Health Tracker (Weight, Sleep, Water, Supplements)**
- ✅ Weight tracking with validation
- ✅ Sleep tracking with hours input
- ✅ Water intake tracking
- ✅ Supplement logging
- ✅ All endpoints working (`/weight`, `/sleep`, `/water`, `/supplement`)
- ✅ Form validation and alerts
- ✅ Real-time updates

#### 5. **Nutrition Goals**
- ✅ Set daily calorie goals
- ✅ Macro ratio sliders (protein, carbs, fat)
- ✅ Goal type selection (loss, maintenance, gain)
- ✅ Visual progress indicators
- ✅ Save/load functionality
- ✅ 3D animated scene

#### 6. **Nutrition Details (Micronutrients)**
- ✅ 20+ nutrient tracking
- ✅ Inline editing per nutrient
- ✅ 4 tabs: Macros, Vitamins, Minerals, Other
- ✅ Progress bars with color indicators
- ✅ GET/PUT endpoints
- ✅ 3D vitamin molecule animations

#### 7. **BMR Calculator**
- ✅ Age, gender, height, weight inputs
- ✅ Activity level selection
- ✅ BMR and TDEE calculations
- ✅ Goal-based calorie recommendations
- ✅ 3D animated background

#### 8. **Settings Page**
- ✅ Update personal information
- ✅ Change settings
- ✅ Report issues
- ✅ 3D particle background

### 🔄 **Backend API Endpoints**

#### User Routes (`/api/users`)
- ✅ `GET /allFoods/:userId` - Get all food items
- ✅ `PUT /addFood/:userId` - Add new food item
- ✅ `PUT /addExercise/:userId` - Add exercise entry
- ✅ `PUT /weight/:userId` - Add weight entry
- ✅ `PUT /sleep/:userId` - Add sleep entry
- ✅ `PUT /water/:userId` - Add water entry
- ✅ `PUT /supplement/:userId` - Add supplement entry
- ✅ `GET /nutrition/:userId` - Get nutrition details
- ✅ `PUT /nutrition/:userId` - Update nutrition details
- ✅ `GET /nutritionGoals/:userId` - Get nutrition goals
- ✅ `PUT /nutritionGoals/:userId` - Update nutrition goals

#### Auth Routes (`/api/auth`)
- ✅ `POST /register` - Register new user
- ✅ `POST /login` - Login user
- ✅ `PUT /preferences/:userId` - Update preferences

### 🎨 **3D Visualizations & UI**
- ✅ React Three Fiber Canvas components
- ✅ Animated particle systems
- ✅ Floating geometric shapes
- ✅ Gradient backgrounds
- ✅ Material-UI components
- ✅ Framer Motion animations
- ✅ Responsive design
- ✅ Dark/light theme support

### 🔧 **Technical Improvements**
- ✅ Fixed CORS headers (added "token" to allowedHeaders)
- ✅ Endpoint corrections (addFood, addExercise, allFoods)
- ✅ Field name mappings (exerciseName, exerciseType)
- ✅ Date validation in filters
- ✅ WebGL context optimization (preserveDrawingBuffer: false)
- ✅ Canvas memoization to prevent re-renders
- ✅ Dialog-based forms instead of navigation
- ✅ Comprehensive error handling
- ✅ Console logging for debugging
- ✅ Alert feedback for users

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. **"Network Error" when adding entries**
**Solution:** 
- Ensure backend is running on port 8000
- Check MongoDB is running
- Verify CORS is configured correctly
- Check browser console for specific error

#### 2. **"Invalid time value" error in Meal Tracker**
**Solution:** Fixed! The date field is now automatically added when adding food items.

#### 3. **WebGL Context Lost**
**Solution:** Fixed! Canvas components are now memoized and optimized with `preserveDrawingBuffer: false`.

#### 4. **"Add Entry" button not working**
**Solution:** All entry buttons are fixed with proper error handling and validation.

#### 5. **Food items not displaying**
**Solution:**
- Check date filter (default is today)
- Verify food was added successfully (check console)
- Try "All" meal type filter
- Refresh page

#### 6. **Exercise not saving**
**Solution:** Fixed! Endpoint changed to `/addExercise` with correct field names (exerciseName, exerciseType).

#### 7. **Port already in use**
**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

#### 8. **MongoDB connection failed**
**Solution:**
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

#### 9. **Compilation errors**
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## 📊 Data Models

### User
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  preferences: {
    height: Number,
    weight: Number,
    age: Number,
    gender: String,
    activityLevel: String,
    dietaryRestrictions: [String]
  },
  foodItems: [{
    foodName: String,
    calories: Number,
    protein: Number,
    carbohydrates: Number,
    fat: Number,
    servings: Number,
    servingSize: String,
    mealType: String,
    date: Date
  }],
  exerciseLog: [{
    liftingLog: Array,
    cardioLog: Array,
    otherExerciseLog: Array
  }],
  healthMetrics: {
    weight: [{value: Number, date: Date}],
    sleep: [{hours: Number, date: Date}],
    water: [{amount: Number, date: Date}],
    supplements: [{name: String, dose: String, date: Date}]
  },
  nutritionGoals: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  }
}
```

---

## 🎯 Best Practices

### For Users
1. **Log meals immediately** - Most accurate tracking
2. **Set realistic goals** - Start with maintenance, adjust as needed
3. **Track consistently** - Daily logging shows best results
4. **Use meal prep** - Plan and log meals in advance
5. **Stay hydrated** - Log water intake throughout the day
6. **Review progress weekly** - Check trends and adjust goals

### For Developers
1. **Always test endpoints** - Use Postman or console.log
2. **Validate user input** - Check for empty fields and invalid data
3. **Handle errors gracefully** - Show user-friendly messages
4. **Optimize 3D scenes** - Use memoization and reduce contexts
5. **Keep backend running** - Use nodemon for auto-restart
6. **Check CORS** - Ensure all headers are allowed

---

## 📝 Version Information

**Current Version:** 2.0.0  
**Last Updated:** February 18, 2026  
**Status:** ✅ Production Ready  

### Recent Updates
- ✅ Fixed meal tracker "Add Food Item" functionality
- ✅ Added date validation in meal filtering
- ✅ Fixed exercise tracker endpoints
- ✅ Fixed health tracker (weight, sleep, water, supplements)
- ✅ Optimized WebGL contexts
- ✅ Added comprehensive error handling
- ✅ Created modern 3D UIs for all pages
- ✅ Fixed CORS configuration
- ✅ Added dialog-based forms
- ✅ Improved validation and alerts

---

## 🤝 Support

### Getting Help
- Check this guide first
- Review console logs in browser (F12)
- Check backend terminal for errors
- Verify MongoDB is running
- Ensure ports 3000 and 8000 are available

### Contact
- Report issues via `/reportProblem` page
- Check GitHub repository for updates
- Review ENHANCED_README.md for technical details

---

## 🎉 Getting Started Checklist

- [ ] Install Node.js and MongoDB
- [ ] Clone/download the repository
- [ ] Install backend dependencies (`npm install`)
- [ ] Install frontend dependencies (`npm install --legacy-peer-deps`)
- [ ] Start MongoDB service
- [ ] Start backend server (port 8000)
- [ ] Start frontend server (port 3000)
- [ ] Create account and set preferences
- [ ] Log your first meal
- [ ] Track your first exercise
- [ ] Set nutrition goals
- [ ] Start your fitness journey! 🚀

---

**Enjoy your fitness journey with Fitness Tracker!** 💪🏋️‍♀️🥗

