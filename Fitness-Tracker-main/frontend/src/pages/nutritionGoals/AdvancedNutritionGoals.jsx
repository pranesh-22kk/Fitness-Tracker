/* Advanced 3D Nutrition Goals Page */
import React, { useState, useContext, useRef, useEffect } from 'react';
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Float,
  Sphere,
  Torus,
  MeshDistortMaterial,
  PerspectiveCamera,
  Sparkles,
  RoundedBox
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Paper,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
  Tabs,
  Tab
} from "@mui/material";
import { AuthContext } from "../../utils/authentication/auth-context";
import axios from "axios";
import Navbar from "../../components/navbar/navbar";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SpaIcon from "@mui/icons-material/Spa";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RemoveIcon from "@mui/icons-material/Remove";
import SaveIcon from "@mui/icons-material/Save";
import "./advancedNutritionGoals.scss";

/* Animated Food Particles */
const FoodParticle = ({ position, color, icon = 'sphere' }) => {
  const meshRef = useRef();
  const speed = Math.random() * 0.5 + 0.3;
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.001;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      {icon === 'torus' ? (
        <Torus ref={meshRef} args={[0.4, 0.15, 16, 100]} position={position}>
          <MeshDistortMaterial
            color={color}
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </Torus>
      ) : icon === 'box' ? (
        <RoundedBox ref={meshRef} args={[0.6, 0.6, 0.6]} radius={0.1} position={position}>
          <MeshDistortMaterial
            color={color}
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.6}
          />
        </RoundedBox>
      ) : (
        <Sphere ref={meshRef} args={[0.5, 32, 32]} position={position}>
          <MeshDistortMaterial
            color={color}
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      )}
    </Float>
  );
};

/* Protein Molecule */
const ProteinMolecule = () => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[0.8, 32, 32]} position={[0, 0, 0]}>
        <MeshDistortMaterial color="#ff6b6b" distort={0.5} speed={3} />
      </Sphere>
      <Sphere args={[0.4, 32, 32]} position={[1, 0.5, 0]}>
        <MeshDistortMaterial color="#ff8787" distort={0.3} speed={2} />
      </Sphere>
      <Sphere args={[0.4, 32, 32]} position={[-1, -0.5, 0]}>
        <MeshDistortMaterial color="#ffa5a5" distort={0.3} speed={2} />
      </Sphere>
      <Sphere args={[0.3, 32, 32]} position={[0, 1, 0]}>
        <MeshDistortMaterial color="#ffc9c9" distort={0.3} speed={2.5} />
      </Sphere>
    </group>
  );
};

/* 3D Background Scene */
const NutritionScene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 12]} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.2} />
      
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#74c0fc" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#51cf66" />
      <spotLight position={[0, 15, 0]} angle={0.3} intensity={1} color="#ffd93d" />
      
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <ProteinMolecule />
      </Float>
      
      <FoodParticle position={[-4, 3, -3]} color="#51cf66" icon="sphere" />
      <FoodParticle position={[4, -3, -4]} color="#74c0fc" icon="torus" />
      <FoodParticle position={[-3, -2, -5]} color="#ffd93d" icon="box" />
      <FoodParticle position={[3, 2, -3]} color="#ff6b6b" icon="sphere" />
      <FoodParticle position={[0, -4, -4]} color="#a78bfa" icon="torus" />
      <FoodParticle position={[-5, 1, -2]} color="#fb923c" icon="box" />
      
      <Stars radius={100} depth={50} count={4000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={80} scale={12} size={3} speed={0.3} opacity={0.5} color="#74c0fc" />
    </>
  );
};

const AdvancedNutritionGoals = () => {
  const { user } = useContext(AuthContext);
  const userId = user?._id;

  // Tab State
  const [activeTab, setActiveTab] = useState(0);

  // Goal States
  const [goal, setGoal] = useState('maintain');
  const [targetCalories, setTargetCalories] = useState(2000);
  const [currentWeight, setCurrentWeight] = useState(70);
  const [targetWeight, setTargetWeight] = useState(70);
  const [weeklyGoal, setWeeklyGoal] = useState(0.5);

  // Macro States
  const [proteinGrams, setProteinGrams] = useState(150);
  const [carbsGrams, setCarbsGrams] = useState(200);
  const [fatsGrams, setFatsGrams] = useState(65);

  // Meal Planning
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [snacksPerDay, setSnacksPerDay] = useState(2);

  // Hydration
  const [waterIntake, setWaterIntake] = useState(8);

  // Timing
  const [proteinTiming, setProteinTiming] = useState('spread');
  const [carbTiming, setCarbTiming] = useState('balanced');

  // Micronutrients
  const [fiberGoal, setFiberGoal] = useState(30);
  const [sodiumLimit, setSodiumLimit] = useState(2300);
  const [sugarLimit, setSugarLimit] = useState(50);

  useEffect(() => {
    loadNutritionGoals();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNutritionGoals = async () => {
    try {
      const response = await axios.get(`/nutrition/goals/${userId}`, {
        headers: { token: `Bearer ${user.accessToken}` }
      });
      if (response.data) {
        const data = response.data;
        setGoal(data.goal || 'maintain');
        setTargetCalories(data.targetCalories || 2000);
        setProteinGrams(data.proteinGrams || 150);
        setCarbsGrams(data.carbsGrams || 200);
        setFatsGrams(data.fatsGrams || 65);
        setMealsPerDay(data.mealsPerDay || 3);
        setSnacksPerDay(data.snacksPerDay || 2);
        setWaterIntake(data.waterIntake || 8);
        setProteinTiming(data.proteinTiming || 'spread');
        setCarbTiming(data.carbTiming || 'balanced');
        setFiberGoal(data.fiberGoal || 30);
        setSodiumLimit(data.sodiumLimit || 2300);
        setSugarLimit(data.sugarLimit || 50);
      }
    } catch (error) {
      console.error('Error loading nutrition goals:', error);
    }
  };

  const saveNutritionGoals = async () => {
    try {
      await axios.post('/nutrition/goals/save', {
        userId,
        goal,
        targetCalories,
        currentWeight,
        targetWeight,
        weeklyGoal,
        proteinGrams,
        carbsGrams,
        fatsGrams,
        mealsPerDay,
        snacksPerDay,
        waterIntake,
        proteinTiming,
        carbTiming,
        fiberGoal,
        sodiumLimit,
        sugarLimit,
        date: new Date()
      }, {
        headers: { token: `Bearer ${user.accessToken}` }
      });
      alert('Nutrition goals saved successfully!');
    } catch (error) {
      console.error('Error saving nutrition goals:', error);
    }
  };

  const getTotalCalories = () => {
    return (proteinGrams * 4) + (carbsGrams * 4) + (fatsGrams * 9);
  };

  const getMacroPercentages = () => {
    const total = getTotalCalories();
    return {
      protein: Math.round((proteinGrams * 4 / total) * 100),
      carbs: Math.round((carbsGrams * 4 / total) * 100),
      fats: Math.round((fatsGrams * 9 / total) * 100)
    };
  };

  const percentages = getMacroPercentages();
  const caloriesPerMeal = Math.round(targetCalories / mealsPerDay);
  const proteinPerMeal = Math.round(proteinGrams / mealsPerDay);

  return (
    <div className="advanced-nutrition-goals">
      <Navbar />
      
      {/* 3D Canvas Background */}
      <div className="canvas-container">
        <Canvas>
          <NutritionScene />
        </Canvas>
      </div>

      <Container maxWidth="xl" className="nutrition-container">
        {/* Header */}
        <motion.div
          className="header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="icon-container">
            <RestaurantIcon sx={{ fontSize: 70, color: '#74c0fc' }} />
          </div>
          <Typography variant="h2" className="title">
            Nutrition Goals Hub
          </Typography>
          <Typography variant="h6" className="subtitle">
            Design your perfect nutrition plan with precision and science
          </Typography>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Paper className="tabs-container glass-card">
            <Tabs 
              value={activeTab} 
              onChange={(e, val) => setActiveTab(val)}
              centered
              className="custom-tabs"
            >
              <Tab label="Calories & Goals" icon={<LocalFireDepartmentIcon />} />
              <Tab label="Macronutrients" icon={<FastfoodIcon />} />
              <Tab label="Meal Planning" icon={<AccessTimeIcon />} />
              <Tab label="Micronutrients" icon={<SpaIcon />} />
            </Tabs>
          </Paper>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 0 && (
            <motion.div
              key="tab0"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Goal Selection */}
                <Grid item xs={12}>
                  <Paper className="glass-card">
                    <Typography variant="h5" className="section-title">
                      <TrendingUpIcon sx={{ mr: 1 }} />
                      Your Fitness Goal
                    </Typography>
                    <ToggleButtonGroup
                      value={goal}
                      exclusive
                      onChange={(e, val) => val && setGoal(val)}
                      className="goal-toggle-group"
                      fullWidth
                    >
                      <ToggleButton value="lose" className="toggle-btn lose">
                        <TrendingDownIcon sx={{ mr: 1 }} />
                        Lose Weight
                      </ToggleButton>
                      <ToggleButton value="maintain" className="toggle-btn maintain">
                        <RemoveIcon sx={{ mr: 1 }} />
                        Maintain
                      </ToggleButton>
                      <ToggleButton value="gain" className="toggle-btn gain">
                        <TrendingUpIcon sx={{ mr: 1 }} />
                        Gain Weight
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Paper>
                </Grid>

                {/* Calorie Target */}
                <Grid item xs={12} md={6}>
                  <Paper className="glass-card calorie-card">
                    <Typography variant="h5" className="section-title">
                      <LocalFireDepartmentIcon sx={{ mr: 1 }} />
                      Daily Calorie Target
                    </Typography>
                    <Box className="calorie-display">
                      <Typography variant="h2" className="calorie-number">
                        {targetCalories}
                      </Typography>
                      <Typography variant="h6" className="calorie-label">
                        calories/day
                      </Typography>
                    </Box>
                    <Slider
                      value={targetCalories}
                      onChange={(e, val) => setTargetCalories(val)}
                      min={1200}
                      max={4000}
                      step={50}
                      marks={[
                        { value: 1200, label: '1200' },
                        { value: 2000, label: '2000' },
                        { value: 3000, label: '3000' },
                        { value: 4000, label: '4000' }
                      ]}
                      className="calorie-slider"
                    />
                  </Paper>
                </Grid>

                {/* Weight Goals */}
                <Grid item xs={12} md={6}>
                  <Paper className="glass-card">
                    <Typography variant="h5" className="section-title">
                      <FitnessCenterIcon sx={{ mr: 1 }} />
                      Weight Goals
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body1" className="input-label">
                        Current Weight: {currentWeight} kg
                      </Typography>
                      <Slider
                        value={currentWeight}
                        onChange={(e, val) => setCurrentWeight(val)}
                        min={40}
                        max={150}
                        step={0.5}
                        className="weight-slider"
                      />
                    </Box>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body1" className="input-label">
                        Target Weight: {targetWeight} kg
                      </Typography>
                      <Slider
                        value={targetWeight}
                        onChange={(e, val) => setTargetWeight(val)}
                        min={40}
                        max={150}
                        step={0.5}
                        className="weight-slider"
                      />
                    </Box>
                    {goal !== 'maintain' && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="body1" className="input-label">
                          Weekly Goal: {weeklyGoal} kg/week
                        </Typography>
                        <Slider
                          value={weeklyGoal}
                          onChange={(e, val) => setWeeklyGoal(val)}
                          min={0.25}
                          max={1}
                          step={0.25}
                          marks
                          className="goal-slider"
                        />
                        <Typography variant="caption" className="info-text">
                          Estimated time: {Math.abs(Math.round((targetWeight - currentWeight) / weeklyGoal))} weeks
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div
              key="tab1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Macro Overview */}
                <Grid item xs={12}>
                  <Paper className="glass-card macro-overview">
                    <Typography variant="h5" className="section-title">
                      Macro Distribution
                    </Typography>
                    <Box className="macro-stats">
                      <Box className="macro-stat protein-stat">
                        <Typography variant="h4">{proteinGrams}g</Typography>
                        <Typography variant="body2">Protein</Typography>
                        <Typography variant="caption">{percentages.protein}%</Typography>
                      </Box>
                      <Box className="macro-stat carbs-stat">
                        <Typography variant="h4">{carbsGrams}g</Typography>
                        <Typography variant="body2">Carbs</Typography>
                        <Typography variant="caption">{percentages.carbs}%</Typography>
                      </Box>
                      <Box className="macro-stat fats-stat">
                        <Typography variant="h4">{fatsGrams}g</Typography>
                        <Typography variant="body2">Fats</Typography>
                        <Typography variant="caption">{percentages.fats}%</Typography>
                      </Box>
                    </Box>
                    <Typography variant="h6" className="total-cals">
                      Total: {getTotalCalories()} calories
                    </Typography>
                  </Paper>
                </Grid>

                {/* Protein */}
                <Grid item xs={12} md={4}>
                  <Paper className="glass-card macro-card protein-card">
                    <Typography variant="h6" className="macro-title">
                      🥩 Protein
                    </Typography>
                    <Typography variant="body2" className="macro-info">
                      {proteinGrams}g = {proteinGrams * 4} calories
                    </Typography>
                    <Slider
                      value={proteinGrams}
                      onChange={(e, val) => setProteinGrams(val)}
                      min={50}
                      max={300}
                      step={5}
                      className="protein-slider"
                    />
                    <LinearProgress 
                      variant="determinate" 
                      value={percentages.protein} 
                      className="protein-progress"
                    />
                  </Paper>
                </Grid>

                {/* Carbs */}
                <Grid item xs={12} md={4}>
                  <Paper className="glass-card macro-card carbs-card">
                    <Typography variant="h6" className="macro-title">
                      🍞 Carbohydrates
                    </Typography>
                    <Typography variant="body2" className="macro-info">
                      {carbsGrams}g = {carbsGrams * 4} calories
                    </Typography>
                    <Slider
                      value={carbsGrams}
                      onChange={(e, val) => setCarbsGrams(val)}
                      min={50}
                      max={400}
                      step={5}
                      className="carbs-slider"
                    />
                    <LinearProgress 
                      variant="determinate" 
                      value={percentages.carbs} 
                      className="carbs-progress"
                    />
                  </Paper>
                </Grid>

                {/* Fats */}
                <Grid item xs={12} md={4}>
                  <Paper className="glass-card macro-card fats-card">
                    <Typography variant="h6" className="macro-title">
                      🥑 Fats
                    </Typography>
                    <Typography variant="body2" className="macro-info">
                      {fatsGrams}g = {fatsGrams * 9} calories
                    </Typography>
                    <Slider
                      value={fatsGrams}
                      onChange={(e, val) => setFatsGrams(val)}
                      min={30}
                      max={150}
                      step={5}
                      className="fats-slider"
                    />
                    <LinearProgress 
                      variant="determinate" 
                      value={percentages.fats} 
                      className="fats-progress"
                    />
                  </Paper>
                </Grid>
              </Grid>
            </motion.div>
          )}

          {activeTab === 2 && (
            <motion.div
              key="tab2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Meal Frequency */}
                <Grid item xs={12} md={6}>
                  <Paper className="glass-card">
                    <Typography variant="h5" className="section-title">
                      <AccessTimeIcon sx={{ mr: 1 }} />
                      Meal Frequency
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body1" className="input-label">
                        Meals per day: {mealsPerDay} ({caloriesPerMeal} cal/meal)
                      </Typography>
                      <Slider
                        value={mealsPerDay}
                        onChange={(e, val) => setMealsPerDay(val)}
                        min={2}
                        max={6}
                        step={1}
                        marks
                        className="meals-slider"
                      />
                    </Box>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body1" className="input-label">
                        Snacks per day: {snacksPerDay}
                      </Typography>
                      <Slider
                        value={snacksPerDay}
                        onChange={(e, val) => setSnacksPerDay(val)}
                        min={0}
                        max={4}
                        step={1}
                        marks
                        className="snacks-slider"
                      />
                    </Box>
                  </Paper>
                </Grid>

                {/* Hydration */}
                <Grid item xs={12} md={6}>
                  <Paper className="glass-card hydration-card">
                    <Typography variant="h5" className="section-title">
                      <WaterDropIcon sx={{ mr: 1 }} />
                      Daily Hydration
                    </Typography>
                    <Box className="water-display">
                      <Typography variant="h2" className="water-number">
                        {waterIntake}
                      </Typography>
                      <Typography variant="h6" className="water-label">
                        glasses ({waterIntake * 250}ml)
                      </Typography>
                    </Box>
                    <Slider
                      value={waterIntake}
                      onChange={(e, val) => setWaterIntake(val)}
                      min={4}
                      max={15}
                      step={1}
                      marks
                      className="water-slider"
                    />
                  </Paper>
                </Grid>

                {/* Nutrient Timing */}
                <Grid item xs={12}>
                  <Paper className="glass-card">
                    <Typography variant="h5" className="section-title">
                      Nutrient Timing Strategy
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1" className="input-label" gutterBottom>
                          Protein Distribution
                        </Typography>
                        <ToggleButtonGroup
                          value={proteinTiming}
                          exclusive
                          onChange={(e, val) => val && setProteinTiming(val)}
                          className="timing-toggle"
                          fullWidth
                        >
                          <ToggleButton value="spread">Spread Evenly</ToggleButton>
                          <ToggleButton value="post-workout">Post-Workout</ToggleButton>
                          <ToggleButton value="both">Both</ToggleButton>
                        </ToggleButtonGroup>
                        <Typography variant="caption" className="info-text">
                          {proteinPerMeal}g protein per meal
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1" className="input-label" gutterBottom>
                          Carbohydrate Timing
                        </Typography>
                        <ToggleButtonGroup
                          value={carbTiming}
                          exclusive
                          onChange={(e, val) => val && setCarbTiming(val)}
                          className="timing-toggle"
                          fullWidth
                        >
                          <ToggleButton value="balanced">Balanced</ToggleButton>
                          <ToggleButton value="pre-workout">Pre-Workout</ToggleButton>
                          <ToggleButton value="post-workout">Post-Workout</ToggleButton>
                        </ToggleButtonGroup>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </motion.div>
          )}

          {activeTab === 3 && (
            <motion.div
              key="tab3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                  <Paper className="glass-card micro-card">
                    <Typography variant="h6" className="micro-title">
                      🌾 Fiber Goal
                    </Typography>
                    <Typography variant="h4" className="micro-value">
                      {fiberGoal}g
                    </Typography>
                    <Slider
                      value={fiberGoal}
                      onChange={(e, val) => setFiberGoal(val)}
                      min={20}
                      max={50}
                      step={5}
                      className="fiber-slider"
                    />
                    <Typography variant="caption" className="micro-info">
                      Recommended: 25-35g/day
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper className="glass-card micro-card">
                    <Typography variant="h6" className="micro-title">
                      🧂 Sodium Limit
                    </Typography>
                    <Typography variant="h4" className="micro-value">
                      {sodiumLimit}mg
                    </Typography>
                    <Slider
                      value={sodiumLimit}
                      onChange={(e, val) => setSodiumLimit(val)}
                      min={1500}
                      max={3000}
                      step={100}
                      className="sodium-slider"
                    />
                    <Typography variant="caption" className="micro-info">
                      Recommended: &lt;2300mg/day
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper className="glass-card micro-card">
                    <Typography variant="h6" className="micro-title">
                      🍬 Sugar Limit
                    </Typography>
                    <Typography variant="h4" className="micro-value">
                      {sugarLimit}g
                    </Typography>
                    <Slider
                      value={sugarLimit}
                      onChange={(e, val) => setSugarLimit(val)}
                      min={25}
                      max={100}
                      step={5}
                      className="sugar-slider"
                    />
                    <Typography variant="caption" className="micro-info">
                      Recommended: &lt;50g/day
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Save Button */}
        <motion.div
          className="save-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Button
            variant="contained"
            size="large"
            className="save-button"
            startIcon={<SaveIcon />}
            onClick={saveNutritionGoals}
          >
            Save Nutrition Goals
          </Button>
        </motion.div>
      </Container>
    </div>
  );
};

export default AdvancedNutritionGoals;
