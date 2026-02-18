/* Advanced 3D Nutrition Details & Micronutrients Tracker */
import React, { useState, useContext, useEffect, useRef } from 'react';
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
  Container,
  Grid,
  Paper,
  Typography,
  Box as MuiBox,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  IconButton,
  TextField,
  Tabs,
  Tab,
  CircularProgress
} from "@mui/material";
import { AuthContext } from "../../utils/authentication/auth-context";
import axios from "axios";
import Navbar from "../../components/navbar/navbar";
import SpaIcon from "@mui/icons-material/Spa";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import OpacityIcon from "@mui/icons-material/Opacity";
import GrainIcon from "@mui/icons-material/Grain";
import ScaleIcon from "@mui/icons-material/Scale";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import VitaminsIcon from "@mui/icons-material/Medication";
import MineralIcon from "@mui/icons-material/Diamond";
import "./advancedNutritionDetails.scss";

/* Animated Vitamin Molecule */
const VitaminMolecule = ({ position, color, size = 0.5 }) => {
  const meshRef = useRef();
  const speed = Math.random() * 0.5 + 0.5;
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.4;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.3;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={1.5}>
      <group ref={meshRef} position={position}>
        <Sphere args={[size, 32, 32]}>
          <MeshDistortMaterial
            color={color}
            attach="material"
            distort={0.5}
            speed={2}
            roughness={0.1}
            metalness={0.9}
          />
        </Sphere>
      </group>
    </Float>
  );
};

/* Nutrient Particle System */
const NutrientParticle = ({ position, color, shape = 'sphere' }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.002;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.2}>
      {shape === 'torus' ? (
        <Torus ref={meshRef} args={[0.3, 0.12, 16, 100]} position={position}>
          <MeshDistortMaterial color={color} distort={0.3} speed={2} metalness={0.8} />
        </Torus>
      ) : shape === 'box' ? (
        <RoundedBox ref={meshRef} args={[0.5, 0.5, 0.5]} radius={0.08} position={position}>
          <MeshDistortMaterial color={color} distort={0.4} speed={2} metalness={0.7} />
        </RoundedBox>
      ) : (
        <Sphere ref={meshRef} args={[0.4, 32, 32]} position={position}>
          <MeshDistortMaterial color={color} distort={0.4} speed={2} metalness={0.8} />
        </Sphere>
      )}
    </Float>
  );
};

/* 3D Scene */
const NutritionScene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 14]} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.25} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#a78bfa" />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#34d399" />
      <spotLight position={[0, 20, 0]} angle={0.3} intensity={1.5} color="#fbbf24" />
      
      {/* Vitamin Molecules */}
      <VitaminMolecule position={[-4, 3, -4]} color="#a78bfa" size={0.7} />
      <VitaminMolecule position={[4, -3, -5]} color="#34d399" size={0.5} />
      <VitaminMolecule position={[-3, -2, -3]} color="#fbbf24" size={0.6} />
      <VitaminMolecule position={[3, 2, -4]} color="#f472b6" size={0.5} />
      <VitaminMolecule position={[0, -4, -5]} color="#60a5fa" size={0.6} />
      
      {/* Nutrient Particles */}
      <NutrientParticle position={[-5, 1, -3]} color="#a78bfa" shape="torus" />
      <NutrientParticle position={[5, -1, -4]} color="#34d399" shape="box" />
      <NutrientParticle position={[-2, 4, -5]} color="#fbbf24" shape="sphere" />
      <NutrientParticle position={[2, -4, -3]} color="#f472b6" shape="torus" />
      
      <Stars radius={120} depth={60} count={5000} factor={5} saturation={0} fade speed={1} />
      <Sparkles count={100} scale={15} size={3} speed={0.4} opacity={0.6} color="#a78bfa" />
    </>
  );
};

const AdvancedNutritionDetails = () => {
  const { user } = useContext(AuthContext);
  const userId = user?._id;

  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState({});

  // Macronutrients
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbohydrates, setCarbohydrates] = useState(0);
  const [fat, setFat] = useState(0);
  const [fiber, setFiber] = useState(0);
  const [sugar, setSugar] = useState(0);

  // Vitamins
  const [vitaminA, setVitaminA] = useState(0);
  const [vitaminC, setVitaminC] = useState(0);
  const [vitaminD, setVitaminD] = useState(0);
  const [vitaminE, setVitaminE] = useState(0);
  const [vitaminK, setVitaminK] = useState(0);
  const [vitaminB12, setVitaminB12] = useState(0);

  // Minerals
  const [calcium, setCalcium] = useState(0);
  const [iron, setIron] = useState(0);
  const [magnesium, setMagnesium] = useState(0);
  const [potassium, setPotassium] = useState(0);
  const [sodium, setSodium] = useState(0);
  const [zinc, setZinc] = useState(0);

  // Other
  const [water, setWater] = useState(0);
  const [cholesterol, setCholesterol] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNutritionInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getNutritionInfo = async () => {
    try {
      const res = await axios.get(`users/nutrition/${userId}`, {
        headers: { token: `Bearer ${user.accessToken}` }
      });
      const data = res.data;
      
      setCalories(data.calories || 0);
      setProtein(data.protein || 0);
      setCarbohydrates(data.carbohydrates || 0);
      setFat(data.fat || 0);
      setFiber(data.fiber || 0);
      setSugar(data.sugar || 0);
      
      setVitaminA(data.vitaminA || 0);
      setVitaminC(data.vitaminC || 0);
      setVitaminD(data.vitaminD || 0);
      setVitaminE(data.vitaminE || 0);
      setVitaminK(data.vitaminK || 0);
      setVitaminB12(data.vitaminB12 || 0);
      
      setCalcium(data.calcium || 0);
      setIron(data.iron || 0);
      setMagnesium(data.magnesium || 0);
      setPotassium(data.potassium || 0);
      setSodium(data.sodium || 0);
      setZinc(data.zinc || 0);
      
      setWater(data.water || 0);
      setCholesterol(data.cholesterol || 0);
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const updateNutrient = async (field, value) => {
    try {
      await axios.put(`users/nutrition/${userId}`, {
        userId,
        newEntry: { [field]: parseFloat(value) }
      }, {
        headers: { token: `Bearer ${user.accessToken}` }
      });
      setIsEditing({ ...isEditing, [field]: false });
      getNutritionInfo();
    } catch (err) {
      console.error(err);
    }
  };

  const NutrientCard = ({ 
    title, 
    value, 
    unit, 
    icon, 
    color, 
    dailyValue, 
    field,
    setValue 
  }) => {
    const percentage = dailyValue ? Math.round((value / dailyValue) * 100) : 0;
    const isLow = percentage < 30;
    const isHigh = percentage > 150;
    const isGood = !isLow && !isHigh;

    return (
      <Card className={`nutrient-card ${color}`}>
        <CardContent>
          <MuiBox className="card-header">
            <MuiBox className="title-section">
              {icon}
              <Typography variant="h6" className="nutrient-title">
                {title}
              </Typography>
            </MuiBox>
            {!isEditing[field] ? (
              <IconButton 
                size="small" 
                onClick={() => setIsEditing({ ...isEditing, [field]: true })}
                className="edit-btn"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            ) : (
              <MuiBox className="action-buttons">
                <IconButton 
                  size="small" 
                  onClick={() => updateNutrient(field, value)}
                  className="save-btn"
                >
                  <SaveIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => setIsEditing({ ...isEditing, [field]: false })}
                  className="cancel-btn"
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </MuiBox>
            )}
          </MuiBox>

          {isEditing[field] ? (
            <TextField
              type="number"
              value={value}
              onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
              fullWidth
              size="small"
              className="edit-input"
              InputProps={{ endAdornment: unit }}
            />
          ) : (
            <Typography variant="h3" className="nutrient-value">
              {value}
              <span className="unit">{unit}</span>
            </Typography>
          )}

          {dailyValue && (
            <>
              <MuiBox className="progress-section">
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(percentage, 100)} 
                  className={`progress-bar ${isLow ? 'low' : isHigh ? 'high' : 'good'}`}
                />
                <Typography variant="caption" className="percentage">
                  {percentage}% of DV
                </Typography>
              </MuiBox>
              <MuiBox className="status-chip">
                {isLow && (
                  <Chip 
                    icon={<WarningIcon />} 
                    label="Below Target" 
                    size="small" 
                    className="chip-low"
                  />
                )}
                {isGood && (
                  <Chip 
                    icon={<CheckCircleIcon />} 
                    label="Optimal" 
                    size="small" 
                    className="chip-good"
                  />
                )}
                {isHigh && (
                  <Chip 
                    icon={<WarningIcon />} 
                    label="Exceeds Target" 
                    size="small" 
                    className="chip-high"
                  />
                )}
              </MuiBox>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="advanced-nutrition-details">
      <Navbar />
      
      {/* 3D Canvas Background */}
      <div className="canvas-container">
        <Canvas>
          <NutritionScene />
        </Canvas>
      </div>

      <Container maxWidth="xl" className="nutrition-details-container">
        {/* Header */}
        <motion.div
          className="header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="icon-container">
            <SpaIcon sx={{ fontSize: 70, color: '#a78bfa' }} />
          </div>
          <Typography variant="h2" className="title">
            Nutrition Deep Dive
          </Typography>
          <Typography variant="h6" className="subtitle">
            Track and optimize your complete nutritional intake
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
              <Tab label="Macros & Energy" icon={<LocalFireDepartmentIcon />} />
              <Tab label="Vitamins" icon={<VitaminsIcon />} />
              <Tab label="Minerals" icon={<MineralIcon />} />
              <Tab label="Other Nutrients" icon={<OpacityIcon />} />
            </Tabs>
          </Paper>
        </motion.div>

        {/* Tab Content */}
        {loading ? (
          <MuiBox className="loading-container">
            <CircularProgress size={60} />
          </MuiBox>
        ) : (
          <AnimatePresence mode="wait">
            {/* Macros Tab */}
            {activeTab === 0 && (
              <motion.div
                key="macros"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={6} lg={4}>
                    <NutrientCard
                      title="Calories"
                      value={calories}
                      unit=" kcal"
                      icon={<LocalFireDepartmentIcon className="icon-fire" />}
                      color="fire"
                      dailyValue={2000}
                      field="calories"
                      setValue={setCalories}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <NutrientCard
                      title="Protein"
                      value={protein}
                      unit="g"
                      icon={<ScaleIcon className="icon-protein" />}
                      color="protein"
                      dailyValue={50}
                      field="protein"
                      setValue={setProtein}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <NutrientCard
                      title="Carbohydrates"
                      value={carbohydrates}
                      unit="g"
                      icon={<GrainIcon className="icon-carbs" />}
                      color="carbs"
                      dailyValue={300}
                      field="carbohydrates"
                      setValue={setCarbohydrates}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <NutrientCard
                      title="Fat"
                      value={fat}
                      unit="g"
                      icon={<OpacityIcon className="icon-fat" />}
                      color="fat"
                      dailyValue={70}
                      field="fat"
                      setValue={setFat}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <NutrientCard
                      title="Fiber"
                      value={fiber}
                      unit="g"
                      icon={<GrainIcon className="icon-fiber" />}
                      color="fiber"
                      dailyValue={25}
                      field="fiber"
                      setValue={setFiber}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <NutrientCard
                      title="Sugar"
                      value={sugar}
                      unit="g"
                      icon={<GrainIcon className="icon-sugar" />}
                      color="sugar"
                      dailyValue={50}
                      field="sugar"
                      setValue={setSugar}
                    />
                  </Grid>
                </Grid>
              </motion.div>
            )}

            {/* Vitamins Tab */}
            {activeTab === 1 && (
              <motion.div
                key="vitamins"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={6} lg={4}>
                    <NutrientCard
                      title="Vitamin A"
                      value={vitaminA}
                      unit=" µg"
                      icon={<VitaminsIcon className="icon-vitamin-a" />}
                      color="vitamin-a"
                      dailyValue={900}
                      field="vitaminA"
                      setValue={setVitaminA}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <NutrientCard
                      title="Vitamin C"
                      value={vitaminC}
                      unit=" mg"
                      icon={<VitaminsIcon className="icon-vitamin-c" />}
                      color="vitamin-c"
                      dailyValue={90}
                      field="vitaminC"
                      setValue={setVitaminC}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <NutrientCard
                      title="Vitamin D"
                      value={vitaminD}
                      unit=" µg"
                      icon={<VitaminsIcon className="icon-vitamin-d" />}
                      color="vitamin-d"
                      dailyValue={20}
                      field="vitaminD"
                      setValue={setVitaminD}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <NutrientCard
                      title="Vitamin E"
                      value={vitaminE}
                      unit=" mg"
                      icon={<VitaminsIcon className="icon-vitamin-e" />}
                      color="vitamin-e"
                      dailyValue={15}
                      field="vitaminE"
                      setValue={setVitaminE}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <NutrientCard
                      title="Vitamin K"
                      value={vitaminK}
                      unit=" µg"
                      icon={<VitaminsIcon className="icon-vitamin-k" />}
                      color="vitamin-k"
                      dailyValue={120}
                      field="vitaminK"
                      setValue={setVitaminK}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <NutrientCard
                      title="Vitamin B12"
                      value={vitaminB12}
                      unit=" µg"
                      icon={<VitaminsIcon className="icon-vitamin-b12" />}
                      color="vitamin-b12"
                      dailyValue={2.4}
                      field="vitaminB12"
                      setValue={setVitaminB12}
                    />
                  </Grid>
                </Grid>
              </motion.div>
            )}

            {/* Minerals Tab */}
            {activeTab === 2 && (
              <motion.div
                key="minerals"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={6} lg={4}>
                    <NutrientCard
                      title="Calcium"
                      value={calcium}
                      unit=" mg"
                      icon={<MineralIcon className="icon-calcium" />}
                      color="calcium"
                      dailyValue={1000}
                      field="calcium"
                      setValue={setCalcium}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <NutrientCard
                      title="Iron"
                      value={iron}
                      unit=" mg"
                      icon={<MineralIcon className="icon-iron" />}
                      color="iron"
                      dailyValue={18}
                      field="iron"
                      setValue={setIron}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <NutrientCard
                      title="Magnesium"
                      value={magnesium}
                      unit=" mg"
                      icon={<MineralIcon className="icon-magnesium" />}
                      color="magnesium"
                      dailyValue={400}
                      field="magnesium"
                      setValue={setMagnesium}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <NutrientCard
                      title="Potassium"
                      value={potassium}
                      unit=" mg"
                      icon={<MineralIcon className="icon-potassium" />}
                      color="potassium"
                      dailyValue={3500}
                      field="potassium"
                      setValue={setPotassium}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <NutrientCard
                      title="Sodium"
                      value={sodium}
                      unit=" mg"
                      icon={<MineralIcon className="icon-sodium" />}
                      color="sodium"
                      dailyValue={2300}
                      field="sodium"
                      setValue={setSodium}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <NutrientCard
                      title="Zinc"
                      value={zinc}
                      unit=" mg"
                      icon={<MineralIcon className="icon-zinc" />}
                      color="zinc"
                      dailyValue={11}
                      field="zinc"
                      setValue={setZinc}
                    />
                  </Grid>
                </Grid>
              </motion.div>
            )}

            {/* Other Nutrients Tab */}
            {activeTab === 3 && (
              <motion.div
                key="other"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid item xs={12} md={6}>
                    <NutrientCard
                      title="Water"
                      value={water}
                      unit=" ml"
                      icon={<OpacityIcon className="icon-water" />}
                      color="water"
                      dailyValue={2000}
                      field="water"
                      setValue={setWater}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <NutrientCard
                      title="Cholesterol"
                      value={cholesterol}
                      unit=" mg"
                      icon={<TrendingUpIcon className="icon-cholesterol" />}
                      color="cholesterol"
                      dailyValue={300}
                      field="cholesterol"
                      setValue={setCholesterol}
                    />
                  </Grid>
                </Grid>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </Container>
    </div>
  );
};

export default AdvancedNutritionDetails;
