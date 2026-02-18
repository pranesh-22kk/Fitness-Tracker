/* Advanced 3D BMR Calculator with Nutrition Goals */
import React, { useState, useContext, useRef } from 'react';
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Float,
  Sphere,
  MeshDistortMaterial,
  PerspectiveCamera,
  Sparkles
} from "@react-three/drei";
import { motion } from "framer-motion";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Paper,
  Chip,
  Slider,
  Radio,
  RadioGroup,
  FormControlLabel
} from "@mui/material";
import { AuthContext } from "../../utils/authentication/auth-context";
import axios from "axios";
import Navbar from "../../components/navbar/navbar";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import "./advancedBmrCalculator.scss";

/* Animated Flame Icon for 3D Scene */
const AnimatedFlame = () => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={meshRef}>
        {/* Flame shape */}
        <Sphere args={[0.6, 32, 32]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#ff6b35"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0}
          />
        </Sphere>
        <Sphere args={[0.4, 32, 32]} position={[0, 0.3, 0]}>
          <MeshDistortMaterial
            color="#ffa94d"
            attach="material"
            distort={0.5}
            speed={3}
            roughness={0}
          />
        </Sphere>
        <Sphere args={[0.2, 32, 32]} position={[0, 0.6, 0]}>
          <MeshDistortMaterial
            color="#ffd93d"
            attach="material"
            distort={0.3}
            speed={4}
            roughness={0}
          />
        </Sphere>
      </group>
    </Float>
  );
};

/* Floating Energy Orb */
const EnergyOrb = ({ position, color, speed = 1 }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={1}>
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
    </Float>
  );
};

/* 3D Background Scene */
const BmrScene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
      
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ff6b35" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4dabf7" />
      
      <AnimatedFlame />
      <EnergyOrb position={[-3, 2, -2]} color="#ff6b35" speed={0.8} />
      <EnergyOrb position={[3, -2, -3]} color="#ffa94d" speed={1.2} />
      <EnergyOrb position={[-2, -1, -4]} color="#4dabf7" speed={1} />
      <EnergyOrb position={[2, 1, -2]} color="#51cf66" speed={0.9} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={100} scale={10} size={2} speed={0.4} opacity={0.6} color="#ff6b35" />
    </>
  );
};

const AdvancedBmrCalculator = () => {
  const { user } = useContext(AuthContext);
  const userId = user?._id;

  // BMR Calculation States
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [bmr, setBmr] = useState(null);
  const [tdee, setTdee] = useState(null);

  // Nutrition Goals States
  const [goal, setGoal] = useState('maintain'); // lose, maintain, gain
  const [weightChangeRate, setWeightChangeRate] = useState('moderate'); // slow, moderate, fast
  const [proteinRatio, setProteinRatio] = useState(30);
  const [carbsRatio, setCarbsRatio] = useState(40);
  const [fatsRatio, setFatsRatio] = useState(30);
  const [customCalories, setCustomCalories] = useState('');
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [waterIntake, setWaterIntake] = useState(8); // glasses per day
  const [proteinTiming, setProteinTiming] = useState('spread'); // spread, post-workout, both

  const activityMultipliers = {
    'Sedentary': 1.2,
    'Light': 1.375,
    'Moderate': 1.55,
    'Very Active': 1.725,
    'Extra Active': 1.9
  };

  const goalCalorieAdjustments = {
    'lose': {
      'slow': -250,    // 0.25 kg per week
      'moderate': -500, // 0.5 kg per week
      'fast': -750      // 0.75 kg per week
    },
    'maintain': {
      'slow': 0,
      'moderate': 0,
      'fast': 0
    },
    'gain': {
      'slow': 250,     // 0.25 kg per week
      'moderate': 500,  // 0.5 kg per week
      'fast': 750       // 0.75 kg per week
    }
  };

  const calculateBMR = () => {
    let bmrResult;
    if (gender === 'Male') {
      bmrResult = 88.362 + (13.397 * parseFloat(weight)) + (4.799 * parseFloat(height)) - (5.677 * parseFloat(age));
    } else {
      bmrResult = 447.593 + (9.247 * parseFloat(weight)) + (3.098 * parseFloat(height)) - (4.330 * parseFloat(age));
    }
    
    setBmr(Math.round(bmrResult));
    const tdeeResult = bmrResult * activityMultipliers[activityLevel];
    setTdee(Math.round(tdeeResult));

    saveBmrCalculation(bmrResult, tdeeResult);
  };

  const saveBmrCalculation = async (bmrValue, tdeeValue) => {
    try {
      await axios.post('/bmr/save', {
        userId,
        age,
        weight,
        height,
        gender,
        activityLevel,
        bmr: bmrValue,
        tdee: tdeeValue,
        date: new Date()
      }, {
        headers: { token: `Bearer ${user.accessToken}` }
      });
    } catch (error) {
      console.error('Error saving BMR calculation:', error);
    }
  };

  const saveNutritionGoals = async () => {
    const targetCalories = customCalories || getTargetCalories();
    try {
      await axios.post('/nutrition/goals', {
        userId,
        goal,
        weightChangeRate,
        targetCalories,
        proteinRatio,
        carbsRatio,
        fatsRatio,
        mealsPerDay,
        waterIntake,
        proteinTiming,
        date: new Date()
      }, {
        headers: { token: `Bearer ${user.accessToken}` }
      });
    } catch (error) {
      console.error('Error saving nutrition goals:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateBMR();
  };

  const getTargetCalories = () => {
    if (customCalories) return parseInt(customCalories);
    if (!tdee) return 0;
    return tdee + goalCalorieAdjustments[goal][weightChangeRate];
  };

  const getMacros = () => {
    const targetCalories = getTargetCalories();
    return {
      protein: Math.round((targetCalories * proteinRatio / 100) / 4), // 4 cal per gram
      carbs: Math.round((targetCalories * carbsRatio / 100) / 4),
      fats: Math.round((targetCalories * fatsRatio / 100) / 9) // 9 cal per gram
    };
  };

  const handleMacroChange = (macro, value) => {
    const remaining = 100 - value;
    
    if (macro === 'protein') {
      setProteinRatio(value);
      const carbsFatsTotal = carbsRatio + fatsRatio;
      if (carbsFatsTotal > 0) {
        setCarbsRatio(Math.round((carbsRatio / carbsFatsTotal) * remaining));
        setFatsRatio(Math.round((fatsRatio / carbsFatsTotal) * remaining));
      }
    } else if (macro === 'carbs') {
      setCarbsRatio(value);
      const proteinFatsTotal = proteinRatio + fatsRatio;
      if (proteinFatsTotal > 0) {
        setProteinRatio(Math.round((proteinRatio / proteinFatsTotal) * remaining));
        setFatsRatio(Math.round((fatsRatio / proteinFatsTotal) * remaining));
      }
    } else if (macro === 'fats') {
      setFatsRatio(value);
      const proteinCarbsTotal = proteinRatio + carbsRatio;
      if (proteinCarbsTotal > 0) {
        setProteinRatio(Math.round((proteinRatio / proteinCarbsTotal) * remaining));
        setCarbsRatio(Math.round((carbsRatio / proteinCarbsTotal) * remaining));
      }
    }
  };

  const macros = getMacros();

  return (
    <div className="advanced-bmr">
      <Navbar />
      
      {/* 3D Canvas Background */}
      <div className="canvas-container">
        <Canvas>
          <BmrScene />
        </Canvas>
      </div>

      <Container maxWidth="lg" className="bmr-container">
        {/* Header */}
        <motion.div
          className="header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="icon-container">
            <LocalFireDepartmentIcon sx={{ fontSize: 60, color: '#ff6b35' }} />
          </div>
          <Typography variant="h3" className="title">
            BMR & Nutrition Calculator
          </Typography>
          <Typography variant="subtitle1" className="subtitle">
            Calculate your metabolic rate and set personalized nutrition goals
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {/* BMR Calculator Card */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Paper className="glass-card bmr-card">
                <Typography variant="h5" className="card-title">
                  <FitnessCenterIcon sx={{ mr: 1 }} />
                  Calculate Your BMR
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Age"
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="custom-input"
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth className="custom-select">
                        <InputLabel>Gender</InputLabel>
                        <Select
                          value={gender}
                          label="Gender"
                          onChange={(e) => setGender(e.target.value)}
                          required
                        >
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Weight (kg)"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="custom-input"
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Height (cm)"
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="custom-input"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth className="custom-select">
                        <InputLabel>Activity Level</InputLabel>
                        <Select
                          value={activityLevel}
                          label="Activity Level"
                          onChange={(e) => setActivityLevel(e.target.value)}
                          required
                        >
                          <MenuItem value="Sedentary">Sedentary (little/no exercise)</MenuItem>
                          <MenuItem value="Light">Light (1-3 days/week)</MenuItem>
                          <MenuItem value="Moderate">Moderate (3-5 days/week)</MenuItem>
                          <MenuItem value="Very Active">Very Active (6-7 days/week)</MenuItem>
                          <MenuItem value="Extra Active">Extra Active (intense daily)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className="calculate-btn"
                        startIcon={<LocalFireDepartmentIcon />}
                      >
                        Calculate BMR & TDEE
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                {bmr && tdee && (
                  <motion.div
                    className="results-section"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Box className="result-card">
                      <Typography variant="h6" className="result-label">BMR</Typography>
                      <Typography variant="h4" className="result-value">{bmr}</Typography>
                      <Typography variant="caption" className="result-unit">calories/day at rest</Typography>
                    </Box>
                    <Box className="result-card">
                      <Typography variant="h6" className="result-label">TDEE</Typography>
                      <Typography variant="h4" className="result-value">{tdee}</Typography>
                      <Typography variant="caption" className="result-unit">total daily expenditure</Typography>
                    </Box>
                  </motion.div>
                )}
              </Paper>
            </motion.div>
          </Grid>

          {/* Nutrition Goals Card */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Paper className="glass-card nutrition-card">
                <Typography variant="h5" className="card-title">
                  <RestaurantIcon sx={{ mr: 1 }} />
                  Nutrition Goals
                </Typography>

                {tdee ? (
                  <Box>
                    {/* Goal Selection */}
                    <Typography variant="subtitle2" className="section-label">Your Goal</Typography>
                    <RadioGroup
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="goal-radio-group"
                    >
                      <FormControlLabel 
                        value="lose" 
                        control={<Radio className="custom-radio" />} 
                        label="Lose Weight" 
                      />
                      <FormControlLabel 
                        value="maintain" 
                        control={<Radio className="custom-radio" />} 
                        label="Maintain Weight" 
                      />
                      <FormControlLabel 
                        value="gain" 
                        control={<Radio className="custom-radio" />} 
                        label="Gain Weight" 
                      />
                    </RadioGroup>

                    {/* Weight Change Rate */}
                    {goal !== 'maintain' && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" className="section-label">Rate of Change</Typography>
                        <FormControl fullWidth className="custom-select" size="small">
                          <Select
                            value={weightChangeRate}
                            onChange={(e) => setWeightChangeRate(e.target.value)}
                          >
                            <MenuItem value="slow">
                              Slow ({goal === 'lose' ? '-0.25' : '+0.25'} kg/week, {goal === 'lose' ? '-250' : '+250'} cal)
                            </MenuItem>
                            <MenuItem value="moderate">
                              Moderate ({goal === 'lose' ? '-0.5' : '+0.5'} kg/week, {goal === 'lose' ? '-500' : '+500'} cal)
                            </MenuItem>
                            <MenuItem value="fast">
                              Fast ({goal === 'lose' ? '-0.75' : '+0.75'} kg/week, {goal === 'lose' ? '-750' : '+750'} cal)
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    )}

                    {/* Target Calories */}
                    <Box className="calories-section">
                      <Chip
                        icon={<TrendingUpIcon />}
                        label={`Target: ${getTargetCalories()} calories/day`}
                        className="calories-chip"
                      />
                      <TextField
                        fullWidth
                        label="Custom Calories (optional)"
                        type="number"
                        value={customCalories}
                        onChange={(e) => setCustomCalories(e.target.value)}
                        className="custom-input"
                        sx={{ mt: 2 }}
                      />
                    </Box>

                    {/* Meals Per Day */}
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" className="section-label">
                        Meals Per Day: {mealsPerDay} ({Math.round(getTargetCalories() / mealsPerDay)} cal/meal)
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

                    {/* Water Intake */}
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" className="section-label">
                        Water Intake: {waterIntake} glasses/day ({waterIntake * 250}ml)
                      </Typography>
                      <Slider
                        value={waterIntake}
                        onChange={(e, val) => setWaterIntake(val)}
                        min={4}
                        max={15}
                        step={1}
                        marks
                        className="water-slider"
                      />
                    </Box>

                    {/* Protein Timing */}
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" className="section-label">Protein Distribution</Typography>
                      <FormControl fullWidth className="custom-select" size="small">
                        <Select
                          value={proteinTiming}
                          onChange={(e) => setProteinTiming(e.target.value)}
                        >
                          <MenuItem value="spread">Evenly spread throughout the day</MenuItem>
                          <MenuItem value="post-workout">Concentrated post-workout</MenuItem>
                          <MenuItem value="both">Both spread + post-workout boost</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    {/* Macro Distribution */}
                    <Typography variant="subtitle2" className="section-label" sx={{ mt: 3 }}>
                      Macro Distribution
                    </Typography>
                    
                    <Box className="macro-slider">
                      <Typography variant="body2" className="macro-label">
                        Protein: {proteinRatio}% ({macros.protein}g)
                      </Typography>
                      <Slider
                        value={proteinRatio}
                        onChange={(e, val) => handleMacroChange('protein', val)}
                        min={10}
                        max={50}
                        className="protein-slider"
                      />
                    </Box>

                    <Box className="macro-slider">
                      <Typography variant="body2" className="macro-label">
                        Carbs: {carbsRatio}% ({macros.carbs}g)
                      </Typography>
                      <Slider
                        value={carbsRatio}
                        onChange={(e, val) => handleMacroChange('carbs', val)}
                        min={10}
                        max={60}
                        className="carbs-slider"
                      />
                    </Box>

                    <Box className="macro-slider">
                      <Typography variant="body2" className="macro-label">
                        Fats: {fatsRatio}% ({macros.fats}g)
                      </Typography>
                      <Slider
                        value={fatsRatio}
                        onChange={(e, val) => handleMacroChange('fats', val)}
                        min={15}
                        max={50}
                        className="fats-slider"
                      />
                    </Box>

                    <Typography variant="caption" className="macro-info">
                      Total: {proteinRatio + carbsRatio + fatsRatio}% (should equal 100%)
                    </Typography>

                    <Button
                      fullWidth
                      variant="contained"
                      className="save-goals-btn"
                      startIcon={<RestaurantIcon />}
                      onClick={saveNutritionGoals}
                      sx={{ mt: 3 }}
                    >
                      Save Nutrition Goals
                    </Button>
                  </Box>
                ) : (
                  <Box className="empty-state">
                    <LocalFireDepartmentIcon sx={{ fontSize: 80, opacity: 0.3 }} />
                    <Typography variant="body1" sx={{ mt: 2, opacity: 0.7 }}>
                      Calculate your BMR first to set nutrition goals
                    </Typography>
                  </Box>
                )}
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default AdvancedBmrCalculator;
