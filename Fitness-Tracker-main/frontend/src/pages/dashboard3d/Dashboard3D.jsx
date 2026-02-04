import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalorieRing3D from '../../components/3d/CalorieRing3D';
import BodyModel3D from '../../components/3d/BodyModel3D';
import './Dashboard3D.scss';

const MotionCard = motion(Card);

export default function Dashboard3D() {
  const [nutritionData, setNutritionData] = useState({
    calories: { consumed: 1450, goal: 2000 },
    protein: { consumed: 85, goal: 150 },
    carbs: { consumed: 180, goal: 250 },
    fat: { consumed: 45, goal: 65 }
  });

  const [stats, setStats] = useState({
    streak: 12,
    level: 8,
    totalWorkouts: 156,
    caloriesBurned: 45230
  });

  const [todayWorkouts] = useState([
    { name: 'Bench Press', targetMuscle: 'chest', sets: 4, reps: 10 },
    { name: 'Squats', targetMuscle: 'quadriceps', sets: 4, reps: 12 },
    { name: 'Bicep Curls', targetMuscle: 'biceps', sets: 3, reps: 15 }
  ]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut'
      }
    })
  };

  const StatCard = ({ icon, title, value, color, index }) => (
    <MotionCard
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="stat-card"
      sx={{
        background: `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`,
        border: `1px solid ${color}60`,
        backdropFilter: 'blur(10px)'
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight="bold" color={color}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ fontSize: '3rem', color: color, opacity: 0.7 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </MotionCard>
  );

  return (
    <Box className="dashboard-3d" sx={{ p: 3, background: '#0a0e27', minHeight: '100vh' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h3" color="white" gutterBottom fontWeight="bold" mb={4}>
          🚀 Your Fitness Journey
        </Typography>
      </motion.div>

      {/* Stats Overview */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<LocalFireDepartmentIcon />}
            title="Current Streak"
            value={`${stats.streak} days`}
            color="#ff6b6b"
            index={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<EmojiEventsIcon />}
            title="Level"
            value={stats.level}
            color="#ffd93d"
            index={1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<FitnessCenterIcon />}
            title="Total Workouts"
            value={stats.totalWorkouts}
            color="#6bcf7f"
            index={2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TrendingUpIcon />}
            title="Calories Burned"
            value={stats.caloriesBurned.toLocaleString()}
            color="#4ecdc4"
            index={3}
          />
        </Grid>
      </Grid>

      {/* 3D Nutrition Rings */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} lg={6}>
          <MotionCard
            custom={4}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            sx={{ background: 'transparent', boxShadow: 'none' }}
          >
            <CardContent sx={{ p: 0 }}>
              <Typography variant="h5" color="white" mb={2} fontWeight="bold">
                📊 Today's Nutrition
              </Typography>
              <CalorieRing3D data={nutritionData} />
            </CardContent>
          </MotionCard>
        </Grid>

        {/* 3D Body Model */}
        <Grid item xs={12} lg={6}>
          <MotionCard
            custom={5}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            sx={{ background: 'transparent', boxShadow: 'none' }}
          >
            <CardContent sx={{ p: 0 }}>
              <Typography variant="h5" color="white" mb={2} fontWeight="bold">
                💪 Active Muscle Groups
              </Typography>
              <BodyModel3D workoutData={todayWorkouts} />
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>

      {/* Today's Workouts */}
      <MotionCard
        custom={6}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        sx={{
          background: 'linear-gradient(135deg, #667eea40 0%, #764ba240 100%)',
          border: '1px solid #667eea60',
          backdropFilter: 'blur(10px)'
        }}
      >
        <CardContent>
          <Typography variant="h5" color="white" mb={3} fontWeight="bold">
            🏋️ Today's Workout Plan
          </Typography>
          <Grid container spacing={2}>
            {todayWorkouts.map((workout, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    p: 2,
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <Typography variant="h6" color="white" fontWeight="bold">
                    {workout.name}
                  </Typography>
                  <Box mt={1}>
                    <Chip
                      label={workout.targetMuscle}
                      size="small"
                      sx={{ mr: 1, background: '#4ecdc4', color: 'white' }}
                    />
                    <Chip
                      label={`${workout.sets} sets × ${workout.reps} reps`}
                      size="small"
                      sx={{ background: '#ff6b6b', color: 'white' }}
                    />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box mt={3} display="flex" gap={2}>
            <Button
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 'bold'
              }}
            >
              Start Workout
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ borderColor: 'white', color: 'white' }}
            >
              View Full Plan
            </Button>
          </Box>
        </CardContent>
      </MotionCard>
    </Box>
  );
}
