# Advanced 3D UI - Fitness Tracker

## 🚀 Overview

This is a complete overhaul of the Fitness Tracker application featuring cutting-edge 3D visualizations, glassmorphism design, and full backend integration.

## ✨ New Features

### 1. **Advanced 3D Home Page** (`AdvancedHome.jsx`)
- Immersive 3D dumbbell animation
- Particle field effects with 1000+ particles
- Floating stat orbs with distortion materials
- Glassmorphism UI cards
- Auto-rotating orbit controls
- Smooth scroll animations with Framer Motion
- Dynamic gradient text effects

**Features:**
- 3D animated dumbbells that respond to user interaction
- Sparkles and star field for cosmic effect
- Feature cards with hover animations
- Responsive design for mobile and desktop
- Direct navigation to dashboard, workouts, nutrition, and achievements

### 2. **Advanced Dashboard** (`AdvancedDashboard.jsx`)
- Real-time 3D data visualization
- Interactive stat orbs showing:
  - Daily calorie intake
  - Weekly workout count
  - Protein consumption
  - Overall progress
- 3D bar chart for weekly calorie tracking
- Live backend data integration
- User avatar and level system
- Recent activity feeds

**Backend Integration:**
- `GET /api/stats/user` - Fetches user statistics
- `GET /api/users/:id` - Retrieves user data
- `GET /api/workouts/recent` - Gets recent workouts
- `GET /api/saved/recent` - Fetches recent meals

### 3. **Advanced Workout Tracker** (`AdvancedWorkout.jsx`)
- 3D animated dumbbells that activate during workouts
- Real-time rep counter with 3D sphere
- Live timer and set tracking
- Interactive workout creation dialog
- Exercise library with difficulty levels
- Play/pause/stop controls
- Progress bar showing workout completion

**Backend Integration:**
- `GET /api/workouts` - Fetches all user workouts
- `POST /api/workouts` - Creates new workout plans
- `POST /api/workouts/complete` - Saves completed workout data

### 4. **Enhanced Meal Tracker**
- Fixed import errors (TextField, icon replacements)
- Removed FiApple (not in react-icons/fi) → replaced with FiPlus
- Maintains existing 3D food sphere visualizations
- Nutrition pie charts with glassmorphism

## 🎨 Design System

### Color Palette
```scss
Primary Gradient: #667eea → #764ba2
Secondary Gradient: #f093fb → #f5576c
Success Gradient: #43e97b → #38f9d7
Info Gradient: #4facfe → #00f2fe
```

### Glassmorphism
```scss
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
```

### Typography
- Headings: Font weight 700-800
- Body text: rgba(255, 255, 255, 0.7)
- Captions: rgba(255, 255, 255, 0.5)

## 📦 Dependencies

Make sure these are installed:
```json
{
  "@react-three/fiber": "^8.x",
  "@react-three/drei": "^9.x",
  "@mui/material": "^5.x",
  "@mui/x-charts": "^6.x",
  "framer-motion": "^10.x",
  "react-icons": "^4.x",
  "axios": "^1.x"
}
```

## 🛠️ Installation & Setup

### Step 1: Install Dependencies
```bash
cd Fitness-Tracker-main/frontend
npm install --legacy-peer-deps
```

### Step 2: Start the Application
```bash
# Terminal 1 - Start Backend
cd ../../backend
npm install
npm start

# Terminal 2 - Start Frontend
cd ../Fitness-Tracker-main/frontend
npm start
```

### Step 3: Access the Application
Open your browser to `http://localhost:3000`

## 🗂️ File Structure

```
frontend/src/
├── pages/
│   ├── home/
│   │   ├── AdvancedHome.jsx          # New 3D landing page
│   │   ├── advancedHome.scss         # Styles for landing
│   │   └── home.jsx                  # Original home (kept)
│   ├── dashboard3d/
│   │   ├── AdvancedDashboard.jsx     # New 3D dashboard
│   │   ├── advancedDashboard.scss    # Dashboard styles
│   │   └── Dashboard3D.jsx           # Original (kept)
│   ├── workoutPlanner/
│   │   ├── AdvancedWorkout.jsx       # New 3D workout tracker
│   │   ├── advancedWorkout.scss      # Workout styles
│   │   └── WorkoutPlanner.jsx        # Original (kept)
│   └── mealTracker/
│       └── mealTracker.jsx           # Fixed imports
├── app.jsx                           # Updated routes
└── routes.jsx                        # Added new routes
```

## 🔧 Backend API Endpoints

### User Stats
```javascript
GET /api/stats/user
Headers: { Authorization: 'Bearer <token>' }
Response: {
  totalCalories: number,
  totalWorkouts: number,
  totalProtein: number,
  calorieGoal: number,
  proteinGoal: number
}
```

### Workouts
```javascript
GET /api/workouts
GET /api/workouts/recent
POST /api/workouts
POST /api/workouts/complete
Headers: { Authorization: 'Bearer <token>' }
```

### Meals
```javascript
GET /api/saved/recent
Headers: { Authorization: 'Bearer <token>' }
```

## 🎯 Key Components

### 3D Elements
- **AnimatedDumbbell**: Rotating 3D dumbbell with metallic materials
- **ParticleField**: 1000+ floating particles
- **StatsOrb**: Distorting sphere for data visualization
- **RepCounter**: Real-time 3D rep display
- **CalorieBar**: 3D bar chart for weekly data

### UI Components
- **Glass Cards**: Translucent cards with blur effect
- **Feature Cards**: Hover-animated info cards
- **Active Workout Display**: Live workout tracking UI
- **Create Workout Dialog**: Modal for workout creation

## 🎮 User Interactions

### Home Page
- Scroll to reveal features
- Click feature cards to navigate (when logged in)
- Auto-rotating 3D scene
- Parallax effects on scroll

### Dashboard
- Orbit around 3D scene
- Click stat cards for details
- View real-time data updates
- Navigate to different sections

### Workout Tracker
- Start/pause/stop workouts
- Increment reps with button click
- Create custom workout plans
- Track multiple exercises and sets

## 📱 Responsive Design

All components are fully responsive:
- **Desktop**: Full 3D experience with orbit controls
- **Tablet**: Optimized 3D with touch controls
- **Mobile**: Reduced particle count, simplified 3D

## 🚦 Next Steps

### To Continue Development:

1. **Run the Application**
   ```bash
   cd Fitness-Tracker-main/frontend
   npm start
   ```

2. **Verify Backend is Running**
   ```bash
   cd backend
   npm start
   ```

3. **Test New Features**
   - Visit `/` for the new home page
   - Login and go to `/dashboard` for 3D dashboard
   - Navigate to `/workouts` for workout tracker

4. **Additional Enhancements** (Optional):
   - Add 3D progress visualization
   - Implement achievement animations
   - Create 3D body visualization
   - Add sound effects for interactions
   - Implement VR/AR mode

## ⚡ Performance Tips

1. **Reduce Particle Count on Low-End Devices**
   ```javascript
   const particleCount = window.innerWidth < 768 ? 500 : 1000;
   ```

2. **Lazy Load 3D Components**
   ```javascript
   const AdvancedDashboard = lazy(() => import('./pages/dashboard3d/AdvancedDashboard'));
   ```

3. **Optimize Canvas Rendering**
   ```javascript
   <Canvas dpr={[1, 2]} performance={{ min: 0.5 }}>
   ```

## 🐛 Troubleshooting

### Issue: FiApple import error
**Fixed**: Replaced with `FiPlus` icon from react-icons/fi

### Issue: TextField not defined
**Fixed**: Added TextField to MUI imports

### Issue: Backend connection fails
**Solution**: Ensure backend is running on port 5000 and CORS is enabled

### Issue: 3D scene not rendering
**Solution**: Clear browser cache and ensure WebGL is enabled

## 📄 License

MIT License - Feel free to modify and use for your projects!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📧 Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using React Three Fiber, Material-UI, and Framer Motion**
