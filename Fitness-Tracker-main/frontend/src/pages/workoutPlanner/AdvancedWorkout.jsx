/* Advanced 3D Workout Tracker with Real-time Backend Integration */
import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Sphere,
  Cylinder,
  Float,
  Text,
  MeshDistortMaterial,
  Stars,
  Environment,
  PerspectiveCamera
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress
} from '@mui/material';
import axios from 'axios';
import Navbar from '../../components/navbar/navbar';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './advancedWorkout.scss';

// 3D Dumbbell Animation
function AnimatedDumbbell({ position, rotation, isActive }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current && isActive) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.5;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  return (
    <Float speed={isActive ? 4 : 1} rotationIntensity={isActive ? 1 : 0.2}>
      <group ref={groupRef} position={position} rotation={rotation}>
        {/* Bar */}
        <Cylinder args={[0.05, 0.05, 1.5, 16]}>
          <meshStandardMaterial
            color={isActive ? '#43e97b' : '#667eea'}
            metalness={0.9}
            roughness={0.1}
            emissive={isActive ? '#43e97b' : '#667eea'}
            emissiveIntensity={isActive ? 0.5 : 0.2}
          />
        </Cylinder>

        {/* Weights */}
        {[-0.65, 0.65].map((y, i) => (
          <Cylinder key={i} args={[0.2, 0.2, 0.15, 16]} position={[0, y, 0]}>
            <meshStandardMaterial
              color={isActive ? '#f093fb' : '#764ba2'}
              metalness={0.8}
              roughness={0.2}
              emissive={isActive ? '#f093fb' : '#764ba2'}
              emissiveIntensity={isActive ? 0.4 : 0.2}
            />
          </Cylinder>
        ))}
      </group>
    </Float>
  );
}

// 3D Exercise Rep Counter
function RepCounter({ reps, position }) {
  return (
    <group position={position}>
      <Sphere args={[0.8, 32, 32]}>
        <MeshDistortMaterial
          color="#667eea"
          distort={0.2}
          speed={1}
          metalness={0.8}
          roughness={0.2}
          emissive="#667eea"
          emissiveIntensity={0.4}
        />
      </Sphere>

      <Text
        position={[0, 0, 0.9]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {reps}
      </Text>

      <Text
        position={[0, -0.4, 0.9]}
        fontSize={0.15}
        color="rgba(255,255,255,0.7)"
        anchorX="center"
        anchorY="middle"
      >
        REPS
      </Text>
    </group>
  );
}

// Main 3D Scene
function WorkoutScene({ activeExercise, currentReps }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <OrbitControls
        enableZoom={true}
        minDistance={5}
        maxDistance={12}
        maxPolarAngle={Math.PI / 1.5}
      />

      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-5, 5, 5]} intensity={0.8} color="#667eea" />
      <spotLight position={[0, 10, 0]} intensity={0.6} angle={0.4} />

      <Stars radius={100} depth={50} count={2000} factor={3} />

      {/* Dumbbells in formation */}
      <AnimatedDumbbell
        position={[-2, 0, 0]}
        rotation={[0, 0, Math.PI / 4]}
        isActive={activeExercise !== null}
      />
      <AnimatedDumbbell
        position={[2, 0, 0]}
        rotation={[0, 0, -Math.PI / 4]}
        isActive={activeExercise !== null}
      />

      {/* Rep Counter */}
      {activeExercise && (
        <RepCounter
          reps={currentReps}
          position={[0, 0, 0]}
        />
      )}

      <Environment preset="night" />
    </>
  );
}

export default function AdvancedWorkout() {
  const [workouts, setWorkouts] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentReps, setCurrentReps] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    exercises: [],
    difficulty: 'intermediate'
  });
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: 3,
    reps: 10,
    duration: 0
  });

  const timerRef = useRef(null);

  useEffect(() => {
    fetchWorkouts();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get('/api/workouts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setWorkouts(response.data || []);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      // Don't set fake data - leave empty
      setWorkouts([]);
    }
  };

  const startWorkout = (workout) => {
    setActiveWorkout(workout);
    setCurrentExerciseIndex(0);
    setCurrentReps(0);
    setCurrentSet(1);
    setTimer(0);
    setIsRunning(true);

    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const pauseWorkout = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resumeWorkout = () => {
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const stopWorkout = async () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    // Save workout to backend
    try {
      await axios.post('/api/workouts/complete', {
        workoutId: activeWorkout._id,
        duration: timer,
        completedExercises: currentExerciseIndex + 1
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (error) {
      console.error('Error saving workout:', error);
    }

    setActiveWorkout(null);
    setTimer(0);
  };

  const nextExercise = () => {
    if (currentExerciseIndex < activeWorkout.exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setCurrentReps(0);
      setCurrentSet(1);
    } else {
      stopWorkout();
    }
  };

  const incrementRep = () => {
    const currentExercise = activeWorkout.exercises[currentExerciseIndex];
    if (currentReps < currentExercise.reps - 1) {
      setCurrentReps((prev) => prev + 1);
    } else {
      if (currentSet < currentExercise.sets) {
        setCurrentSet((prev) => prev + 1);
        setCurrentReps(0);
      } else {
        nextExercise();
      }
    }
  };

  const createWorkout = async () => {
    try {
      const response = await axios.post('/api/workouts', newWorkout, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setWorkouts([...workouts, response.data]);
      setOpenDialog(false);
      setNewWorkout({ name: '', exercises: [], difficulty: 'intermediate' });
    } catch (error) {
      console.error('Error creating workout:', error);
    }
  };

  const addExerciseToWorkout = () => {
    setNewWorkout({
      ...newWorkout,
      exercises: [...newWorkout.exercises, newExercise]
    });
    setNewExercise({ name: '', sets: 3, reps: 10, duration: 0 });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#43e97b';
      case 'intermediate': return '#f093fb';
      case 'advanced': return '#ff6b6b';
      default: return '#667eea';
    }
  };

  return (
    <div className="advanced-workout">
      <Navbar />

      {/* 3D Background */}
      <div className="workout-canvas">
        <Canvas>
          <WorkoutScene
            activeExercise={activeWorkout ? currentExerciseIndex : null}
            currentReps={currentReps}
          />
        </Canvas>
      </div>

      {/* Content */}
      <div className="workout-content">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="workout-header"
        >
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 800 }}>
            Workout Planner
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 4,
              borderRadius: '50px'
            }}
          >
            Create Workout
          </Button>
        </motion.div>

        {/* Active Workout Session */}
        <AnimatePresence>
          {activeWorkout && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="active-workout glass-card">
                <CardContent>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                      {activeWorkout.exercises[currentExerciseIndex].name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 2 }}>
                      <Box>
                        <Typography variant="h2" sx={{ color: '#667eea', fontWeight: 800 }}>
                          {formatTime(timer)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          DURATION
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="h2" sx={{ color: '#43e97b', fontWeight: 800 }}>
                          {currentSet}/{activeWorkout.exercises[currentExerciseIndex].sets}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          SETS
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="h2" sx={{ color: '#f093fb', fontWeight: 800 }}>
                          {currentReps + 1}/{activeWorkout.exercises[currentExerciseIndex].reps}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          REPS
                        </Typography>
                      </Box>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={((currentExerciseIndex + 1) / activeWorkout.exercises.length) * 100}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        mb: 3,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #667eea, #764ba2)',
                          borderRadius: 5
                        }
                      }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                      <IconButton
                        onClick={incrementRep}
                        sx={{
                          width: 80,
                          height: 80,
                          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)',
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        <CheckCircleIcon sx={{ fontSize: 40 }} />
                      </IconButton>

                      {isRunning ? (
                        <IconButton
                          onClick={pauseWorkout}
                          sx={{
                            width: 80,
                            height: 80,
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            color: 'white'
                          }}
                        >
                          <PauseIcon sx={{ fontSize: 40 }} />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={resumeWorkout}
                          sx={{
                            width: 80,
                            height: 80,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white'
                          }}
                        >
                          <PlayArrowIcon sx={{ fontSize: 40 }} />
                        </IconButton>
                      )}

                      <IconButton
                        onClick={stopWorkout}
                        sx={{
                          width: 80,
                          height: 80,
                          background: 'linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%)',
                          color: 'white'
                        }}
                      >
                        <StopIcon sx={{ fontSize: 40 }} />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Workout List */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {workouts.length === 0 ? (
            <Grid item xs={12}>
              <Card className="glass-card">
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <FitnessCenterIcon sx={{ fontSize: 80, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
                  <Typography variant="h5" sx={{ color: 'white', mb: 1 }}>
                    No Workouts Yet
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                    Create your first workout plan to get started!
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      px: 4,
                      py: 1.5,
                      borderRadius: '50px'
                    }}
                  >
                    Create First Workout
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            workouts.map((workout, index) => (
            <Grid item xs={12} md={6} lg={4} key={workout._id || index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="workout-card glass-card">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                        {workout.name}
                      </Typography>
                      
                      <Chip
                        label={workout.difficulty}
                        sx={{
                          background: getDifficultyColor(workout.difficulty),
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>

                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                      {workout.exercises.length} exercises
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      {workout.exercises.slice(0, 3).map((exercise, i) => (
                        <Typography
                          key={i}
                          variant="caption"
                          sx={{
                            display: 'block',
                            color: 'rgba(255,255,255,0.6)',
                            mb: 0.5
                          }}
                        >
                          • {exercise.name} - {exercise.sets}x{exercise.reps}
                        </Typography>
                      ))}
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => startWorkout(workout)}
                      disabled={activeWorkout !== null}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '50px',
                        py: 1.5
                      }}
                    >
                      Start Workout
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))
          )}
        </Grid>
      </div>

      {/* Create Workout Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(15, 20, 50, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px'
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Create New Workout</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Workout Name"
            value={newWorkout.name}
            onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
            sx={{
              mt: 2,
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }
              }
            }}
          />

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Difficulty</InputLabel>
            <Select
              value={newWorkout.difficulty}
              onChange={(e) => setNewWorkout({ ...newWorkout, difficulty: e.target.value })}
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="h6" sx={{ color: 'white', mt: 3, mb: 2 }}>
            Add Exercises
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Exercise Name"
                value={newExercise.name}
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                sx={{
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Sets"
                value={newExercise.sets}
                onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })}
                sx={{
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }
                  }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Reps"
                value={newExercise.reps}
                onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) })}
                sx={{
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }
                  }
                }}
              />
            </Grid>
          </Grid>

          <Button
            fullWidth
            onClick={addExerciseToWorkout}
            sx={{ mt: 2, color: '#667eea' }}
          >
            Add Exercise
          </Button>

          {newWorkout.exercises.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                Exercises Added:
              </Typography>
              {newWorkout.exercises.map((ex, i) => (
                <Chip
                  key={i}
                  label={`${ex.name} (${ex.sets}x${ex.reps})`}
                  sx={{
                    mr: 1,
                    mb: 1,
                    background: 'rgba(102, 126, 234, 0.3)',
                    color: 'white'
                  }}
                />
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Cancel
          </Button>
          <Button
            onClick={createWorkout}
            variant="contained"
            disabled={!newWorkout.name || newWorkout.exercises.length === 0}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
