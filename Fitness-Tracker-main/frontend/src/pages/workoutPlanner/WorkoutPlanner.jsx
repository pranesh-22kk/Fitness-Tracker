import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, TextField, Chip, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import TimerIcon from '@mui/icons-material/Timer';
import './WorkoutPlanner.scss';

const MotionCard = motion(Card);

const exerciseDatabase = [
  { 
    id: 1, 
    name: 'Bench Press', 
    category: 'Chest', 
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    targetMuscles: ['chest', 'shoulders'],
    calories: 180,
    description: 'Classic compound movement for chest development'
  },
  { 
    id: 2, 
    name: 'Squats', 
    category: 'Legs', 
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    targetMuscles: ['quadriceps', 'glutes'],
    calories: 220,
    description: 'King of all exercises for lower body'
  },
  { 
    id: 3, 
    name: 'Deadlift', 
    category: 'Back', 
    difficulty: 'Advanced',
    equipment: 'Barbell',
    targetMuscles: ['back', 'hamstrings'],
    calories: 250,
    description: 'Full body compound movement'
  },
  { 
    id: 4, 
    name: 'Pull-ups', 
    category: 'Back', 
    difficulty: 'Intermediate',
    equipment: 'Pull-up Bar',
    targetMuscles: ['back', 'biceps'],
    calories: 150,
    description: 'Upper body pulling exercise'
  },
  { 
    id: 5, 
    name: 'Shoulder Press', 
    category: 'Shoulders', 
    difficulty: 'Beginner',
    equipment: 'Dumbbells',
    targetMuscles: ['shoulders'],
    calories: 140,
    description: 'Build strong shoulders'
  },
  { 
    id: 6, 
    name: 'Bicep Curls', 
    category: 'Arms', 
    difficulty: 'Beginner',
    equipment: 'Dumbbells',
    targetMuscles: ['biceps'],
    calories: 90,
    description: 'Isolate and build biceps'
  },
  { 
    id: 7, 
    name: 'Tricep Dips', 
    category: 'Arms', 
    difficulty: 'Beginner',
    equipment: 'Dip Bar',
    targetMuscles: ['triceps'],
    calories: 120,
    description: 'Effective tricep builder'
  },
  { 
    id: 8, 
    name: 'Lunges', 
    category: 'Legs', 
    difficulty: 'Beginner',
    equipment: 'Bodyweight',
    targetMuscles: ['quadriceps', 'glutes'],
    calories: 130,
    description: 'Unilateral leg exercise'
  },
  { 
    id: 9, 
    name: 'Plank', 
    category: 'Core', 
    difficulty: 'Beginner',
    equipment: 'Bodyweight',
    targetMuscles: ['abs'],
    calories: 60,
    description: 'Core stability exercise'
  },
  { 
    id: 10, 
    name: 'Burpees', 
    category: 'Full Body', 
    difficulty: 'Advanced',
    equipment: 'Bodyweight',
    targetMuscles: ['full body'],
    calories: 300,
    description: 'High intensity full body movement'
  }
];

const workoutTemplates = [
  {
    name: 'Push Day',
    exercises: [1, 5, 6],
    description: 'Chest, shoulders, and triceps'
  },
  {
    name: 'Pull Day',
    exercises: [3, 4, 6],
    description: 'Back and biceps'
  },
  {
    name: 'Leg Day',
    exercises: [2, 8],
    description: 'Lower body focus'
  },
  {
    name: 'Full Body HIIT',
    exercises: [10, 2, 4, 9],
    description: 'High intensity workout'
  }
];

export default function WorkoutPlanner() {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];

  const addExercise = (exercise) => {
    if (!selectedExercises.find(e => e.id === exercise.id)) {
      setSelectedExercises([...selectedExercises, { ...exercise, sets: 3, reps: 10 }]);
    }
  };

  const removeExercise = (id) => {
    setSelectedExercises(selectedExercises.filter(e => e.id !== id));
  };

  const loadTemplate = (template) => {
    const exercises = template.exercises.map(id => {
      const exercise = exerciseDatabase.find(e => e.id === id);
      return { ...exercise, sets: 3, reps: 10 };
    });
    setSelectedExercises(exercises);
  };

  const startWorkout = () => {
    setActiveWorkout({
      exercises: selectedExercises,
      startTime: new Date(),
      completed: []
    });
  };

  const filteredExercises = filterCategory === 'All' 
    ? exerciseDatabase 
    : exerciseDatabase.filter(e => e.category === filterCategory);

  const totalCalories = selectedExercises.reduce((sum, e) => sum + e.calories, 0);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return '#4caf50';
      case 'Intermediate': return '#ff9800';
      case 'Advanced': return '#f44336';
      default: return '#757575';
    }
  };

  return (
    <Box className="workout-planner" sx={{ p: 3, background: '#0a0e27', minHeight: '100vh' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h3" color="white" gutterBottom fontWeight="bold" mb={1}>
          🏋️ Workout Planner
        </Typography>
        <Typography variant="body1" color="rgba(255,255,255,0.7)" mb={4}>
          Build your custom workout routine with our exercise library
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {/* Exercise Library */}
        <Grid item xs={12} md={8}>
          <MotionCard
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              background: 'linear-gradient(135deg, #1e3c7240 0%, #2a529840 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <CardContent>
              <Typography variant="h5" color="white" mb={2} fontWeight="bold">
                Exercise Library
              </Typography>

              {/* Category Filter */}
              <Box mb={3} display="flex" gap={1} flexWrap="wrap">
                {categories.map(cat => (
                  <Chip
                    key={cat}
                    label={cat}
                    onClick={() => setFilterCategory(cat)}
                    sx={{
                      background: filterCategory === cat ? '#667eea' : 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '&:hover': { background: filterCategory === cat ? '#764ba2' : 'rgba(255,255,255,0.2)' }
                    }}
                  />
                ))}
              </Box>

              {/* Exercise Cards */}
              <Grid container spacing={2}>
                {filteredExercises.map((exercise) => (
                  <Grid item xs={12} sm={6} key={exercise.id}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: 2,
                          border: '1px solid rgba(255,255,255,0.1)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'rgba(255,255,255,0.1)',
                            borderColor: '#667eea'
                          }
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                          <Typography variant="h6" color="white" fontWeight="bold">
                            {exercise.name}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => addExercise(exercise)}
                            sx={{ color: '#4caf50' }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                        <Typography variant="body2" color="rgba(255,255,255,0.7)" mb={1}>
                          {exercise.description}
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          <Chip
                            label={exercise.difficulty}
                            size="small"
                            sx={{
                              background: getDifficultyColor(exercise.difficulty),
                              color: 'white',
                              fontSize: '0.7rem'
                            }}
                          />
                          <Chip
                            label={exercise.equipment}
                            size="small"
                            sx={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.7rem' }}
                          />
                          <Chip
                            label={`${exercise.calories} cal`}
                            size="small"
                            sx={{ background: '#ff6b6b', color: 'white', fontSize: '0.7rem' }}
                          />
                        </Box>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Selected Workout */}
        <Grid item xs={12} md={4}>
          <MotionCard
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              background: 'linear-gradient(135deg, #667eea40 0%, #764ba240 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              position: 'sticky',
              top: 20
            }}
          >
            <CardContent>
              <Typography variant="h5" color="white" mb={2} fontWeight="bold">
                Your Workout
              </Typography>

              {/* Quick Templates */}
              <Box mb={3}>
                <Typography variant="subtitle2" color="rgba(255,255,255,0.7)" mb={1}>
                  Quick Templates:
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  {workoutTemplates.map((template, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      size="small"
                      onClick={() => loadTemplate(template)}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.3)',
                        color: 'white',
                        textTransform: 'none',
                        justifyContent: 'flex-start'
                      }}
                    >
                      <Box textAlign="left">
                        <div style={{ fontWeight: 'bold' }}>{template.name}</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{template.description}</div>
                      </Box>
                    </Button>
                  ))}
                </Box>
              </Box>

              {/* Selected Exercises */}
              <Box mb={2}>
                {selectedExercises.length > 0 ? (
                  <AnimatePresence>
                    {selectedExercises.map((exercise, index) => (
                      <motion.div
                        key={exercise.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box
                          sx={{
                            p: 1.5,
                            mb: 1,
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: 1,
                            border: '1px solid rgba(255,255,255,0.2)'
                          }}
                        >
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body1" color="white" fontWeight="500">
                              {exercise.name}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => removeExercise(exercise.id)}
                              sx={{ color: '#f44336' }}
                            >
                              ✕
                            </IconButton>
                          </Box>
                          <Typography variant="caption" color="rgba(255,255,255,0.6)">
                            {exercise.sets} sets × {exercise.reps} reps
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <Box
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      color: 'rgba(255,255,255,0.5)',
                      border: '2px dashed rgba(255,255,255,0.2)',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="body2">
                      Add exercises to build your workout
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Workout Stats */}
              {selectedExercises.length > 0 && (
                <Box
                  sx={{
                    p: 2,
                    mb: 2,
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 2
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="rgba(255,255,255,0.7)">
                        Exercises
                      </Typography>
                      <Typography variant="h6" color="white" fontWeight="bold">
                        {selectedExercises.length}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="rgba(255,255,255,0.7)">
                        Est. Calories
                      </Typography>
                      <Typography variant="h6" color="#ff6b6b" fontWeight="bold">
                        {totalCalories}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Action Buttons */}
              <Box display="flex" flexDirection="column" gap={1}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={selectedExercises.length === 0}
                  onClick={startWorkout}
                  startIcon={<PlayArrowIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontWeight: 'bold',
                    '&:disabled': {
                      background: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  Start Workout
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  fullWidth
                  disabled={selectedExercises.length === 0}
                  onClick={() => setSelectedExercises([])}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white'
                  }}
                >
                  Clear All
                </Button>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    </Box>
  );
}
