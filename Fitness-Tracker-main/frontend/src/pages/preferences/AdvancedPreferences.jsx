/* Advanced 3D Nutrition Preferences Page */
import React, { useContext, useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Float,
  Sphere,
  MeshDistortMaterial,
  PerspectiveCamera,
  Environment,
  Sparkles
} from "@react-three/drei";
import { motion } from "framer-motion";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Container,
  Grid,
  Paper,
  Chip
} from "@mui/material";
import { AuthContext } from "../../utils/authentication/auth-context";
import axios from "axios";
import Navbar from "../../components/navbar/navbar";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import "./advancedPreferences.scss";

/* Preferences names */
const VEGAN = "Vegan";
const VEGETARIAN = "Vegetarian";

/* Restrictions names */
const COCONUT = "Coconut";
const EGGS = "Eggs";
const FISH = "Fish";
const GLUTEN = "Gluten";
const SESAME = "Sesame";
const SHELLFISH = "Shellfish";
const SOY = "Soy";
const TREE_NUTS = "Tree Nuts";
const WHEAT = "Wheat";
const MILK = "Milk";
const PEANUTS = "Peanuts";

// Animated Food Icon
function AnimatedFoodIcon() {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <group ref={groupRef}>
        {/* Apple shape */}
        <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#4ade80"
            metalness={0.8}
            roughness={0.2}
            emissive="#4ade80"
            emissiveIntensity={0.4}
          />
        </Sphere>
        {/* Leaf */}
        <mesh position={[0.3, 1.2, 0]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.3, 0.8, 0.1]} />
          <meshStandardMaterial
            color="#22c55e"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Floating Orbs
function FloatingOrb({ position, color, speed = 1 }) {
  const orbRef = useRef();

  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
      orbRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <Sphere ref={orbRef} args={[0.6, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </Sphere>
    </Float>
  );
}

// 3D Background Scene
function NutritionScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
      />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4ade80" />
      <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
      <Sparkles count={80} scale={10} size={3} speed={0.3} color="#4ade80" />
      <Environment preset="night" />

      <AnimatedFoodIcon />
      <FloatingOrb position={[-3, 2, -2]} color="#4ade80" speed={0.8} />
      <FloatingOrb position={[3, -2, -3]} color="#22c55e" speed={1.2} />
      <FloatingOrb position={[-2, -1, -4]} color="#16a34a" speed={1} />
      <FloatingOrb position={[2, 1, -2]} color="#84cc16" speed={0.9} />
    </>
  );
}

const AdvancedPreferences = () => {
  const { user } = useContext(AuthContext);
  const userId = user._id;

  /* Preference flags */
  const [vegetarian, setVegetarian] = useState(false);
  const [vegan, setVegan] = useState(false);

  /* Restriction flags */
  const [coconut, setCoconut] = useState(false);
  const [eggs, setEggs] = useState(false);
  const [fish, setFish] = useState(false);
  const [gluten, setGluten] = useState(false);
  const [sesame, setSesame] = useState(false);
  const [shellfish, setShellfish] = useState(false);
  const [soy, setSoy] = useState(false);
  const [treeNuts, setTreeNuts] = useState(false);
  const [wheat, setWheat] = useState(false);
  const [milk, setMilk] = useState(false);
  const [peanuts, setPeanuts] = useState(false);

  /* Temp prefs and restriction arrays */
  const [prefs, setPrefs] = useState([]);
  const [rests, setRests] = useState([]);

  /* Handlers for toggling checkboxes */
  const handleVegetarian = () => setVegetarian(!vegetarian);
  const handleVegan = () => setVegan(!vegan);
  const handleCoconut = () => setCoconut(!coconut);
  const handleEggs = () => setEggs(!eggs);
  const handleFish = () => setFish(!fish);
  const handleGluten = () => setGluten(!gluten);
  const handleSesame = () => setSesame(!sesame);
  const handleShellfish = () => setShellfish(!shellfish);
  const handleSoy = () => setSoy(!soy);
  const handleTreeNuts = () => setTreeNuts(!treeNuts);
  const handleWheat = () => setWheat(!wheat);
  const handleMilk = () => setMilk(!milk);
  const handlePeanuts = () => setPeanuts(!peanuts);

  const [shouldUpdatePrefs, setShouldUpdatePrefs] = useState(false);
  const [shouldUpdateRests, setShouldUpdateRests] = useState(false);

  const isFirstRender = useRef(true);

  /* Load initial preferences and restrictions */
  useEffect(() => {
    const setInitialPreferences = async () => {
      try {
        const response = await axios.get("users/preferences/" + userId, {
          headers: { token: "Bearer " + user.accessToken },
        });
        const initialPreferences = response.data;
        const preferences = [];
        if (initialPreferences.includes(VEGAN)) {
          setVegan(true);
          preferences.push(VEGAN);
        }
        if (initialPreferences.includes(VEGETARIAN)) {
          setVegetarian(true);
          preferences.push(VEGETARIAN);
        }
        setPrefs(preferences);
        setShouldUpdatePrefs(true);
      } catch (error) {
        console.log("Failed to get initial preferences: " + error);
      }
    };

    const setInitialRestrictions = async () => {
      try {
        const response = await axios.get("users/restrictions/" + userId, {
          headers: { token: "Bearer " + user.accessToken },
        });
        const initialRestrictions = response.data;
        if (initialRestrictions.includes(COCONUT)) setCoconut(true);
        if (initialRestrictions.includes(EGGS)) setEggs(true);
        if (initialRestrictions.includes(FISH)) setFish(true);
        if (initialRestrictions.includes(GLUTEN)) setGluten(true);
        if (initialRestrictions.includes(SESAME)) setSesame(true);
        if (initialRestrictions.includes(SHELLFISH)) setShellfish(true);
        if (initialRestrictions.includes(SOY)) setSoy(true);
        if (initialRestrictions.includes(TREE_NUTS)) setTreeNuts(true);
        if (initialRestrictions.includes(WHEAT)) setWheat(true);
        if (initialRestrictions.includes(MILK)) setMilk(true);
        if (initialRestrictions.includes(PEANUTS)) setPeanuts(true);
        setRests(initialRestrictions);
        setShouldUpdateRests(true);
      } catch (error) {
        console.log("Failed to get initial restrictions: " + error);
      }
    };

    if (isFirstRender.current) {
      setInitialPreferences();
      setInitialRestrictions();
      isFirstRender.current = false;
    }
    // eslint-disable-next-line
  }, []);

  /* Update preferences when they change */
  useEffect(() => {
    if (!shouldUpdatePrefs) return;

    const preferences = [];
    if (vegetarian) preferences.push(VEGETARIAN);
    if (vegan) preferences.push(VEGAN);
    setPrefs(preferences);
    // eslint-disable-next-line
  }, [vegetarian, vegan]);

  /* Update preferences in DB */
  useEffect(() => {
    if (!shouldUpdatePrefs) return;

    const updatePreferencesInDB = async () => {
      try {
        await axios.put(
          "users/preferences",
          { userId: userId, preferences: prefs },
          { headers: { token: "Bearer " + user.accessToken } }
        );
        console.log("Successfully updated preferences: " + prefs);
      } catch (error) {
        console.log("Failed to update preferences: " + error);
      }
    };
    updatePreferencesInDB();
    // eslint-disable-next-line
  }, [prefs]);

  /* Update restrictions when they change */
  useEffect(() => {
    if (!shouldUpdateRests) return;

    const restrictions = [];
    if (coconut) restrictions.push(COCONUT);
    if (eggs) restrictions.push(EGGS);
    if (fish) restrictions.push(FISH);
    if (gluten) restrictions.push(GLUTEN);
    if (sesame) restrictions.push(SESAME);
    if (shellfish) restrictions.push(SHELLFISH);
    if (soy) restrictions.push(SOY);
    if (treeNuts) restrictions.push(TREE_NUTS);
    if (wheat) restrictions.push(WHEAT);
    if (milk) restrictions.push(MILK);
    if (peanuts) restrictions.push(PEANUTS);
    setRests(restrictions);
    // eslint-disable-next-line
  }, [coconut, eggs, fish, gluten, sesame, shellfish, soy, treeNuts, wheat, milk, peanuts]);

  /* Update restrictions in DB */
  useEffect(() => {
    if (!shouldUpdateRests) return;

    const updateRestrictionsInDB = async () => {
      try {
        await axios.put(
          "users/restrictions",
          { userId: userId, restrictions: rests },
          { headers: { token: "Bearer " + user.accessToken } }
        );
        console.log("Successfully updated restrictions: " + rests);
      } catch (error) {
        console.log("Failed to update restrictions: " + error);
      }
    };
    updateRestrictionsInDB();
    // eslint-disable-next-line
  }, [rests]);

  const restrictionsData = [
    { name: COCONUT, checked: coconut, handler: handleCoconut },
    { name: EGGS, checked: eggs, handler: handleEggs },
    { name: FISH, checked: fish, handler: handleFish },
    { name: GLUTEN, checked: gluten, handler: handleGluten },
    { name: SESAME, checked: sesame, handler: handleSesame },
    { name: SHELLFISH, checked: shellfish, handler: handleShellfish },
    { name: SOY, checked: soy, handler: handleSoy },
    { name: TREE_NUTS, checked: treeNuts, handler: handleTreeNuts },
    { name: WHEAT, checked: wheat, handler: handleWheat },
    { name: MILK, checked: milk, handler: handleMilk },
    { name: PEANUTS, checked: peanuts, handler: handlePeanuts },
  ];

  return (
    <div className="advanced-preferences">
      <Navbar />

      {/* 3D Background */}
      <div className="canvas-container">
        <Canvas>
          <NutritionScene />
        </Canvas>
      </div>

      {/* Content */}
      <Container maxWidth="lg" className="preferences-content">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box className="header-section">
            <Box className="icon-container">
              <RestaurantIcon sx={{ fontSize: 50, color: "#4ade80" }} />
            </Box>
            <Typography variant="h2" className="title">
              Nutrition Preferences
            </Typography>
            <Typography variant="body1" className="subtitle">
              Customize your dietary preferences and restrictions for personalized recommendations
            </Typography>
          </Box>
        </motion.div>

        {/* Summary Chips */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Box className="summary-chips">
            <Chip
              icon={<LocalFloristIcon />}
              label={`${prefs.length} Preferences`}
              className="chip-green"
            />
            <Chip
              icon={<HealthAndSafetyIcon />}
              label={`${rests.length} Restrictions`}
              className="chip-red"
            />
          </Box>
        </motion.div>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          {/* Dietary Preferences Card */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Paper className="glass-card preferences-card">
                <Box className="card-header">
                  <LocalDiningIcon sx={{ fontSize: 32, color: "#4ade80" }} />
                  <Typography variant="h5" className="card-title">
                    Dietary Preferences
                  </Typography>
                </Box>
                <FormGroup className="checkbox-group">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={vegetarian}
                        onChange={handleVegetarian}
                        className="custom-checkbox"
                      />
                    }
                    label={VEGETARIAN}
                    className="checkbox-label"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={vegan}
                        onChange={handleVegan}
                        className="custom-checkbox"
                      />
                    }
                    label={VEGAN}
                    className="checkbox-label"
                  />
                </FormGroup>
              </Paper>
            </motion.div>
          </Grid>

          {/* Dietary Restrictions Card */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Paper className="glass-card restrictions-card">
                <Box className="card-header">
                  <HealthAndSafetyIcon sx={{ fontSize: 32, color: "#ef4444" }} />
                  <Typography variant="h5" className="card-title">
                    Dietary Restrictions
                  </Typography>
                  <Typography variant="body2" className="card-subtitle">
                    Select allergens and ingredients to avoid
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {restrictionsData.map((restriction, index) => (
                    <Grid item xs={12} sm={6} md={4} key={restriction.name}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={restriction.checked}
                              onChange={restriction.handler}
                              className="custom-checkbox restriction"
                            />
                          }
                          label={`${restriction.name} free`}
                          className="checkbox-label restriction"
                        />
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default AdvancedPreferences;
