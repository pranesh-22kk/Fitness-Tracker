/* Modern Meal Tracker with 3D UI */
import Navbar from "../../components/navbar/navbar";
import "./mealTracker.scss";
import { useContext, useState, useEffect, useRef, useMemo } from "react";
import { AuthContext } from "../../utils/authentication/auth-context";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Float, OrbitControls, MeshDistortMaterial, Stars } from '@react-three/drei';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  TextField
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { FiCoffee, FiSun, FiMoon, FiPlus } from 'react-icons/fi';
import ROUTES from "../../routes";

// 3D Food Sphere
function FoodSphere({ mealType, position }) {
  const meshRef = useRef();
  
  const colors = {
    breakfast: { base: "#ffd93d", emissive: "#ff9800" },
    lunch: { base: "#4fc3f7", emissive: "#00bcd4" },
    dinner: { base: "#ff6b6b", emissive: "#ff4757" },
    snack: { base: "#26de81", emissive: "#20bf6b" }
  };

  const color = colors[mealType] || colors.breakfast;
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <Sphere ref={meshRef} args={[0.8, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color.base}
          emissive={color.emissive}
          emissiveIntensity={0.4}
          distort={0.2}
          speed={1.5}
          roughness={0.3}
          metalness={0.6}
        />
      </Sphere>
    </Float>
  );
}

function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={1} />
      <Stars radius={50} depth={30} count={800} factor={2} fade speed={0.5} />
      
      <FoodSphere mealType="breakfast" position={[-2, 0, 0]} />
      <FoodSphere mealType="lunch" position={[0, 0.5, 0]} />
      <FoodSphere mealType="dinner" position={[2, 0, 0]} />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

const MealTracker = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [foodItems, setFoodItems] = useState([]);
  const [mealFilter, setMealFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (location.state?.refresh) {
      getFoodItems();
    }
  }, [location]);

  const isFirstRender = useRef(true);

  const getFoodItems = async () => {
    try {
      const res = await axios.get(`users/allFoods/${user._id}`, {
        headers: { token: `Bearer ${user.accessToken}` }
      });
      setFoodItems(res.data || []);
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      getFoodItems();
      isFirstRender.current = false;
    }
  }, []);

  const getMealIcon = (mealType) => {
    switch (mealType?.toLowerCase()) {
      case 'breakfast': return <FiCoffee />;
      case 'lunch': return <FiSun />;
      case 'dinner': return <FiMoon />;
      case 'snack': return <FiPlus />;
      default: return <FiCoffee />;
    }
  };

  const getMealColor = (mealType) => {
    switch (mealType?.toLowerCase()) {
      case 'breakfast': return '#ffd93d';
      case 'lunch': return '#4fc3f7';
      case 'dinner': return '#ff6b6b';
      case 'snack': return '#26de81';
      default: return '#667eea';
    }
  };

  const filteredItems = foodItems.filter(item => {
    const itemDate = new Date(item.date).toISOString().split('T')[0];
    const matchesDate = itemDate === dateFilter;
    const matchesMeal = mealFilter === 'all' || item.mealType?.toLowerCase() === mealFilter.toLowerCase();
    return matchesDate && matchesMeal;
  });

  const groupedMeals = {
    breakfast: filteredItems.filter(item => item.mealType?.toLowerCase() === 'breakfast'),
    lunch: filteredItems.filter(item => item.mealType?.toLowerCase() === 'lunch'),
    dinner: filteredItems.filter(item => item.mealType?.toLowerCase() === 'dinner'),
    snack: filteredItems.filter(item => item.mealType?.toLowerCase() === 'snack')
  };

  const totalNutrition = filteredItems.reduce((acc, item) => ({
    calories: acc.calories + (parseFloat(item.calories) || 0),
    protein: acc.protein + (parseFloat(item.protein) || 0),
    carbs: acc.carbs + (parseFloat(item.carbs) || 0),
    fat: acc.fat + (parseFloat(item.fat) || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const chartData = [
    { label: 'Protein', value: totalNutrition.protein, color: '#ff6b6b' },
    { label: 'Carbs', value: totalNutrition.carbs, color: '#4fc3f7' },
    { label: 'Fat', value: totalNutrition.fat, color: '#ffd93d' }
  ].filter(item => item.value > 0);

  // Memoize the 3D Canvas to prevent re-renders
  const canvas3D = useMemo(() => (
    <div className="canvas-background">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }} 
        dpr={[1, 1.5]}
        gl={{ preserveDrawingBuffer: false, antialias: false }}
      >
        <Scene3D />
      </Canvas>
    </div>
  ), []);

  return (
    <div className="meal-tracker">
      <Navbar />
      
      {canvas3D}

      <div className="content-container">
        <motion.div
          className="header-section"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h3" className="page-title">
            🍽️ Meal Tracker
          </Typography>
          <Typography variant="subtitle1" className="page-subtitle">
            Track your daily nutrition and meals
          </Typography>
        </motion.div>

        {/* Filters */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Meal Type</InputLabel>
              <Select
                value={mealFilter}
                onChange={(e) => setMealFilter(e.target.value)}
                label="Meal Type"
                sx={{
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' },
                  '.MuiSvgIcon-root': { color: 'rgba(255,255,255,0.7)' }
                }}
              >
                <MenuItem value="all">All Meals</MenuItem>
                <MenuItem value="breakfast">Breakfast</MenuItem>
                <MenuItem value="lunch">Lunch</MenuItem>
                <MenuItem value="dinner">Dinner</MenuItem>
                <MenuItem value="snack">Snacks</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              type="date"
              label="Date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true, sx: { color: 'rgba(255,255,255,0.7)' } }}
              sx={{
                '.MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#667eea' }
                }
              }}
            />
          </Grid>
        </Grid>

        {/* Nutrition Summary */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card className="nutrition-card">
              <CardContent>
                <Typography variant="h6" className="card-title" sx={{ mb: 3 }}>
                  Daily Nutrition Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box className="nutrition-stat">
                      <Typography variant="h4" sx={{ color: '#667eea', fontWeight: 900 }}>
                        {Math.round(totalNutrition.calories)}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">Calories</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box className="nutrition-stat">
                      <Typography variant="h4" sx={{ color: '#ff6b6b', fontWeight: 900 }}>
                        {Math.round(totalNutrition.protein)}g
                      </Typography>
                      <Typography variant="caption" color="textSecondary">Protein</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box className="nutrition-stat">
                      <Typography variant="h4" sx={{ color: '#4fc3f7', fontWeight: 900 }}>
                        {Math.round(totalNutrition.carbs)}g
                      </Typography>
                      <Typography variant="caption" color="textSecondary">Carbs</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box className="nutrition-stat">
                      <Typography variant="h4" sx={{ color: '#ffd93d', fontWeight: 900 }}>
                        {Math.round(totalNutrition.fat)}g
                      </Typography>
                      <Typography variant="caption" color="textSecondary">Fat</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className="chart-card">
              <CardContent>
                <Typography variant="h6" className="card-title" sx={{ mb: 2 }}>
                  Macro Distribution
                </Typography>
                {chartData.length > 0 && (
                  <PieChart
                    series={[{ data: chartData.map((d, i) => ({ id: i, value: d.value, label: d.label, color: d.color })) }]}
                    height={200}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Add Meal Button */}
        <Box sx={{ mb: 3 }}>
          <Link to={ROUTES.MENU + "/Earhart"} style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              startIcon={<FiPlus />}
              className="add-button"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '12px 30px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 30px rgba(102, 126, 234, 0.6)'
                }
              }}
            >
              Add Food Item
            </Button>
          </Link>
        </Box>

        {/* Meal Groups */}
        {Object.entries(groupedMeals).map(([mealType, items]) => (
          items.length > 0 && (
            <motion.div
              key={mealType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="meal-group-card" sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box sx={{ fontSize: '2rem', color: getMealColor(mealType) }}>
                      {getMealIcon(mealType)}
                    </Box>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, textTransform: 'capitalize' }}>
                      {mealType}
                    </Typography>
                    <Chip 
                      label={`${items.length} items`} 
                      size="small" 
                      sx={{ 
                        background: `${getMealColor(mealType)}30`,
                        color: getMealColor(mealType),
                        border: `1px solid ${getMealColor(mealType)}60`
                      }}
                    />
                  </Box>
                  <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
                  <Grid container spacing={2}>
                    {items.map((item, idx) => (
                      <Grid item xs={12} sm={6} md={4} key={idx}>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <Box className="food-item">
                            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                              {item.name}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              <Chip label={`${Math.round(item.calories)} cal`} size="small" />
                              {item.protein > 0 && <Chip label={`${Math.round(item.protein)}g P`} size="small" color="error" />}
                              {item.carbs > 0 && <Chip label={`${Math.round(item.carbs)}g C`} size="small" color="info" />}
                              {item.fat > 0 && <Chip label={`${Math.round(item.fat)}g F`} size="small" color="warning" />}
                            </Box>
                          </Box>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          )
        ))}

        {filteredItems.length === 0 && (
          <Card className="empty-state">
            <CardContent>
              <Typography variant="h6" color="textSecondary" align="center">
                No meals logged for this date
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
                Start tracking your meals to see your nutrition data
              </Typography>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MealTracker;
