# 🚀 Enhanced Fitness Tracker - 3D Edition

A modern, feature-rich fitness tracking application with stunning 3D visualizations, gamification, and comprehensive health monitoring.

## ✨ New Features

### 🎨 3D Visualizations
- **Interactive 3D Calorie Rings** - Real-time animated rings showing nutrition progress
- **3D Body Model** - Interactive body visualization highlighting active muscle groups
- **3D Charts & Graphs** - Beautiful data visualizations for progress tracking
- **Smooth Animations** - Framer Motion powered transitions and effects

### 💪 Workout Management
- **Exercise Library** - 10+ exercises with detailed descriptions
- **Custom Workout Builder** - Create personalized workout routines
- **Workout Templates** - Pre-built plans (Push Day, Pull Day, Leg Day, HIIT)
- **Real-time Tracking** - Track sets, reps, weight, and duration
- **Calorie Estimation** - Automatic calorie burn calculations

### 🏆 Gamification System
- **Level System** - Progress through levels by earning XP
- **Achievements** - 8+ unlockable achievements with progress tracking
- **Streak Tracking** - Daily workout streaks with visualization
- **Points & Rewards** - Earn points for completing goals
- **Leaderboard** - Compete with other users (coming soon)

### 📊 Advanced Analytics
- **Weekly Progress Charts** - Area charts showing calorie burn trends
- **Strength Progress Radar** - Visual representation of strength gains
- **Progress Photos** - Track transformation with photos
- **Body Measurements** - Track weight, body fat, and measurements
- **Nutrition Insights** - Detailed macro tracking with AI suggestions

### 🎯 Dashboard Enhancements
- **3D Dashboard** - Immersive dashboard with animated statistics
- **Real-time Stats** - Current streak, level, total workouts, calories burned
- **Today's Nutrition** - 3D ring visualization of macro goals
- **Active Muscles** - See which muscle groups you're targeting today

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - Modern UI library
- **Three.js** - 3D graphics engine
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **Framer Motion** - Animation library
- **Material-UI** - Component library
- **Recharts** - Advanced charting library
- **React Router** - Navigation
- **Sass** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Node Schedule** - Cron jobs

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend directory:
```env
MONGO_URL=mongodb://localhost:27017/fitness-tracker
JWT_SECRET=your_jwt_secret_key_here
PORT=8000
```

4. Start backend server:
```bash
npm start
```

Backend will run on http://localhost:8000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies (this will install all new 3D libraries):
```bash
npm install
```

3. Start frontend development server:
```bash
npm start
```

Frontend will run on http://localhost:3000

## 🚀 Quick Start

1. **Start MongoDB**:
```bash
mongod
```

2. **Start Backend** (in one terminal):
```bash
cd backend
npm start
```

3. **Start Frontend** (in another terminal):
```bash
cd frontend
npm start
```

4. **Create an Account**:
   - Visit http://localhost:3000
   - Click "Register"
   - Fill in your details
   - Start tracking!

## 📱 New Pages & Routes

### 3D Dashboard
- **URL**: `/dashboard3d`
- **Features**: 3D nutrition rings, body model, animated stats
- **Description**: Your main hub with all key metrics in stunning 3D

### Workout Planner
- **URL**: `/workoutPlanner`
- **Features**: Exercise library, custom workouts, templates
- **Description**: Build and save custom workout routines

### Achievements
- **URL**: `/achievements`
- **Features**: Unlockable achievements, progress charts, streak tracking
- **Description**: Track your journey and unlock rewards

## 🎮 How to Use

### Creating a Workout
1. Go to Workout Planner (`/workoutPlanner`)
2. Browse the exercise library
3. Click "+" to add exercises
4. Customize sets and reps
5. Click "Start Workout" to begin

### Tracking Nutrition
1. Visit 3D Dashboard (`/dashboard3d`)
2. View real-time 3D nutrition rings
3. Track calories, protein, carbs, and fats
4. See progress towards daily goals

### Earning Achievements
1. Complete workouts to earn XP
2. Maintain streaks for bonus points
3. Visit Achievements page to see progress
4. Unlock achievements to level up

## 🔧 New API Endpoints

### Workouts
- `GET /api/workouts` - Get all workouts
- `POST /api/workouts` - Create workout
- `GET /api/workouts/:id` - Get specific workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout
- `GET /api/workouts/summary/weekly` - Weekly summary

### Stats
- `GET /api/stats` - Get user stats
- `POST /api/stats/achievements` - Unlock achievement
- `GET /api/stats/leaderboard` - Get leaderboard

### Progress
- `GET /api/progress` - Get all progress entries
- `POST /api/progress` - Create progress entry
- `GET /api/progress/latest` - Get latest entry
- `DELETE /api/progress/:id` - Delete entry

## 🎨 Color Scheme

The app uses a modern dark theme with vibrant accent colors:
- **Primary Background**: `#0a0e27` (Dark Blue)
- **Accent Colors**: 
  - Red: `#ff6b6b` (Calories)
  - Teal: `#4ecdc4` (Protein)
  - Yellow: `#ffe66d` (Carbs)
  - Green: `#a8e6cf` (Fat)
- **Gradients**: Multiple gradient overlays for depth

## 🏗️ Project Structure

```
Fitness-Tracker-main/
├── backend/
│   ├── models/
│   │   ├── workout.js          (NEW)
│   │   ├── userStats.js        (NEW)
│   │   ├── progressEntry.js    (NEW)
│   │   └── ...existing models
│   ├── routes/
│   │   ├── workouts.js         (NEW)
│   │   ├── stats.js            (NEW)
│   │   ├── progress.js         (NEW)
│   │   └── ...existing routes
│   └── index.js                (UPDATED)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── 3d/             (NEW)
│   │   │       ├── CalorieRing3D.jsx
│   │   │       └── BodyModel3D.jsx
│   │   ├── pages/
│   │   │   ├── dashboard3d/    (NEW)
│   │   │   ├── workoutPlanner/ (NEW)
│   │   │   ├── achievements/   (NEW)
│   │   │   └── ...existing pages
│   │   ├── app.jsx             (UPDATED)
│   │   └── routes.jsx          (UPDATED)
│   └── package.json            (UPDATED)
```

## 🔥 Key Improvements Over Original

1. **Visual Appeal**: Modern 3D UI vs basic 2D interface
2. **Engagement**: Gamification with levels, achievements, streaks
3. **Functionality**: Comprehensive workout planning and tracking
4. **User Experience**: Smooth animations and intuitive design
5. **Data Visualization**: Interactive 3D charts and graphs
6. **Motivation**: Progress tracking and reward systems

## 🐛 Troubleshooting

### 3D Components Not Rendering
- Ensure WebGL is enabled in your browser
- Update to latest Chrome/Firefox/Edge
- Check browser console for errors

### MongoDB Connection Issues
```bash
# Make sure MongoDB is running
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # Mac
```

### Port Already in Use
```bash
# Kill process on port 8000 (backend)
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

## 📝 Future Enhancements

- [ ] AI-powered workout recommendations
- [ ] Social features (friends, challenges)
- [ ] Wearable device integration
- [ ] Meal planning with recipes
- [ ] Video exercise demonstrations
- [ ] Voice-guided workouts
- [ ] Mobile app (React Native)
- [ ] Dark/Light theme toggle
- [ ] Export data to CSV/PDF
- [ ] Multi-language support

## 📄 License

MIT License - See LICENSE file

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Three.js community for amazing 3D capabilities
- Material-UI for beautiful components
- React Three Fiber for seamless React integration
- All open-source contributors

---

Made with ❤️ and lots of ☕

Happy Tracking! 💪🚀
