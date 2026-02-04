/* Modern Exercise Tracker with 3D UI */
import Navbar from "../../components/navbar/navbar";
import "./exerciseTracker.scss";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../utils/authentication/auth-context";
import axios from "axios";
import { motion } from "framer-motion";
import { Canvas, useFrame } from '@react-three/fiber';
import { Box as ThreeBox, Sphere, Float, OrbitControls, MeshDistortMaterial, Stars } from '@react-three/drei';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import { FiActivity, FiZap, FiTrendingUp, FiAward } from 'react-icons/fi';
import { GiWeightLiftingUp, GiRunningShoe } from 'react-icons/gi';

// 3D Dumbbell Component
function Dumbbell3D({ position }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
      <group ref={groupRef} position={position}>
        {/* Bar */}
        <ThreeBox args={[2, 0.15, 0.15]}>
          <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
        </ThreeBox>
        {/* Left Weight */}
        <Sphere args={[0.4, 32, 32]} position={[-1.2, 0, 0]}>
          <meshStandardMaterial color="#ff6b6b" metalness={0.6} roughness={0.3} />
        </Sphere>
        {/* Right Weight */}
        <Sphere args={[0.4, 32, 32]} position={[1.2, 0, 0]}>
          <meshStandardMaterial color="#ff6b6b" metalness={0.6} roughness={0.3} />
        </Sphere>
      </group>
    </Float>
  );
}

function Scene3D() {
  return (
    <>
      <color attach="background" args={['rgba(10, 0, 21, 0)']} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={1} />
      <Stars radius={50} depth={30} count={800} factor={2} fade speed={0.5} />
      
      <Dumbbell3D position={[0, 0, 0]} />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.8}
      />
    </>
  );
}

const ExerciseTracker = () => {
  const { user } = useContext(AuthContext);
  const userId = user._id;

  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [time, setTime] = useState('');
  const [exerciseType, setExerciseType] = useState('');
  const [exerciseDate, setExerciseDate] = useState('');

  const [weightLiftingExercises, setLiftingExercises] = useState([]);
  const [cardioExercises, setCardioExercises] = useState([]);
  const [otherExercises, setOtherExercises] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [sortType, setSortType] = useState('all');

  const isFirstRender = useRef(true);

  useEffect(() => {
    const getExercises = async () => {
      try {
        const res = await axios.get(`users/exercises/${userId}`, {
          headers: { token: `Bearer ${user.accessToken}` }
        });

        const exercises = res.data || [];
        setAllExercises(exercises);
        
        setLiftingExercises(exercises.filter(ex => ex.type === 'Weight Lifting'));
        setCardioExercises(exercises.filter(ex => ex.type === 'Cardio'));
        setOtherExercises(exercises.filter(ex => ex.type === 'Other'));
      } catch (error) {
        console.error(error);
      }
    };

    if (isFirstRender.current) {
      getExercises();
      isFirstRender.current = false;
    }
  }, [userId, user.accessToken]);

  const handleAddExercise = async () => {
    if (!exerciseName || !exerciseType) return;

    try {
      const res = await axios.put(
        `users/exercise/${userId}`,
        {
          name: exerciseName,
          sets: sets || 0,
          reps: reps || 0,
          time: time || 0,
          type: exerciseType,
          date: exerciseDate || new Date().toISOString()
        },
        { headers: { token: `Bearer ${user.accessToken}` } }
      );

      const exercises = res.data.exerciseLog || [];
      setAllExercises(exercises);
      setLiftingExercises(exercises.filter(ex => ex.type === 'Weight Lifting'));
      setCardioExercises(exercises.filter(ex => ex.type === 'Cardio'));
      setOtherExercises(exercises.filter(ex => ex.type === 'Other'));

      setExerciseName('');
      setSets('');
      setReps('');
      setTime('');
      setExerciseType('');
      setExerciseDate('');
    } catch (error) {
      console.error(error);
    }
  };

  const getFilteredExercises = () => {
    switch (sortType) {
      case 'lifting': return weightLiftingExercises;
      case 'cardio': return cardioExercises;
      case 'other': return otherExercises;
      default: return allExercises;
    }
  };

  const filteredExercises = getFilteredExercises();

  const exerciseCounts = {
    lifting: weightLiftingExercises.length,
    cardio: cardioExercises.length,
    other: otherExercises.length,
    total: allExercises.length
  };

  const chartData = [
    { label: 'Weight Lifting', value: exerciseCounts.lifting, color: '#ff6b6b' },
    { label: 'Cardio', value: exerciseCounts.cardio, color: '#4fc3f7' },
    { label: 'Other', value: exerciseCounts.other, color: '#26de81' }
  ].filter(item => item.value > 0);

  return (
    <div className="exercise-tracker">
      <Navbar />
      
      <div className="canvas-background">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 1.5]}>
          <Scene3D />
        </Canvas>
      </div>

      <div className="content-container">
        <motion.div
          className="header-section"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h3" className="page-title">
            <FiActivity /> Exercise Tracker
          </Typography>
          <Typography variant="subtitle1" className="page-subtitle">
            Track your workouts and monitor progress
          </Typography>
        </motion.div>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="stat-card">
                <CardContent>
                  <Typography variant="h6" className="card-title">
                    <GiWeightLiftingUp /> Weight Lifting
                  </Typography>
                  <Typography variant="h3" className="stat-value" style={{ color: '#ff6b6b' }}>
                    {exerciseCounts.lifting}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={3}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="stat-card">
                <CardContent>
                  <Typography variant="h6" className="card-title">
                    <GiRunningShoe /> Cardio
                  </Typography>
                  <Typography variant="h3" className="stat-value" style={{ color: '#4fc3f7' }}>
                    {exerciseCounts.cardio}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={3}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="stat-card">
                <CardContent>
                  <Typography variant="h6" className="card-title">
                    <FiZap /> Other
                  </Typography>
                  <Typography variant="h3" className="stat-value" style={{ color: '#26de81' }}>
                    {exerciseCounts.other}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={3}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="stat-card">
                <CardContent>
                  <Typography variant="h6" className="card-title">
                    <FiAward /> Total Workouts
                  </Typography>
                  <Typography variant="h3" className="stat-value" style={{ color: '#a29bfe' }}>
                    {exerciseCounts.total}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Add Exercise Form */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card className="input-card">
              <CardContent>
                <Typography variant="h6" className="card-title">
                  <FiTrendingUp /> Add New Exercise
                </Typography>
                <Box className="input-group">
                  <TextField
                    label="Exercise Name"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    fullWidth
                    variant="outlined"
                    className="input-field"
                  />
                  <FormControl fullWidth className="input-field">
                    <InputLabel>Exercise Type</InputLabel>
                    <Select
                      value={exerciseType}
                      onChange={(e) => setExerciseType(e.target.value)}
                      label="Exercise Type"
                    >
                      <MenuItem value="Weight Lifting">Weight Lifting</MenuItem>
                      <MenuItem value="Cardio">Cardio</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <TextField
                        label="Sets"
                        type="number"
                        value={sets}
                        onChange={(e) => setSets(e.target.value)}
                        fullWidth
                        variant="outlined"
                        className="input-field"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Reps"
                        type="number"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        fullWidth
                        variant="outlined"
                        className="input-field"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Time (min)"
                        type="number"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        fullWidth
                        variant="outlined"
                        className="input-field"
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    label="Date"
                    type="date"
                    value={exerciseDate}
                    onChange={(e) => setExerciseDate(e.target.value)}
                    fullWidth
                    variant="outlined"
                    className="input-field"
                    InputLabelProps={{ shrink: true }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddExercise}
                    fullWidth
                    className="add-button"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    Add Exercise
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Exercise Chart */}
          <Grid item xs={12} md={6}>
            <Card className="chart-card">
              <CardContent>
                <Typography variant="h6" className="card-title">Exercise Distribution</Typography>
                {chartData.length > 0 && (
                  <BarChart
                    xAxis={[{ scaleType: 'band', data: chartData.map(d => d.label) }]}
                    series={[{ data: chartData.map(d => d.value), color: '#667eea' }]}
                    height={300}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Exercise List */}
          <Grid item xs={12}>
            <Card className="history-card">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" className="card-title">Exercise Log</Typography>
                  <FormControl sx={{ minWidth: 200 }}>
                    <Select
                      value={sortType}
                      onChange={(e) => setSortType(e.target.value)}
                      variant="outlined"
                      size="small"
                    >
                      <MenuItem value="all">All Exercises</MenuItem>
                      <MenuItem value="lifting">Weight Lifting</MenuItem>
                      <MenuItem value="cardio">Cardio</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box className="history-list">
                  {filteredExercises.slice().reverse().map((exercise, idx) => (
                    <motion.div
                      key={idx}
                      className="history-item exercise-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Box>
                        <Typography variant="h6">{exercise.name}</Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          {exercise.sets > 0 && <Chip label={`${exercise.sets} sets`} size="small" />}
                          {exercise.reps > 0 && <Chip label={`${exercise.reps} reps`} size="small" />}
                          {exercise.time > 0 && <Chip label={`${exercise.time} min`} size="small" />}
                          <Chip 
                            label={exercise.type} 
                            size="small" 
                            color={exercise.type === 'Weight Lifting' ? 'error' : exercise.type === 'Cardio' ? 'info' : 'success'}
                          />
                        </Box>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(exercise.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ExerciseTracker;
