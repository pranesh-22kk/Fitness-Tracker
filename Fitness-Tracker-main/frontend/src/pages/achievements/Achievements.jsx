import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Confetti from 'react-confetti';
import './Achievements.scss';

const MotionCard = motion(Card);

const achievements = [
  { id: 1, name: 'First Workout', description: 'Complete your first workout', icon: '💪', unlocked: true, points: 10 },
  { id: 2, name: 'Week Warrior', description: '7 day streak', icon: '🔥', unlocked: true, points: 25 },
  { id: 3, name: 'Century Club', description: '100 workouts completed', icon: '💯', unlocked: true, points: 100 },
  { id: 4, name: 'Calorie Crusher', description: 'Burn 50,000 calories', icon: '⚡', unlocked: true, points: 150 },
  { id: 5, name: 'Iron Will', description: '30 day streak', icon: '🏆', unlocked: false, points: 200, progress: 40 },
  { id: 6, name: 'Beast Mode', description: '500 workouts completed', icon: '🦁', unlocked: false, points: 500, progress: 31 },
  { id: 7, name: 'Marathon', description: 'Exercise for 100 hours', icon: '🏃', unlocked: false, points: 300, progress: 65 },
  { id: 8, name: 'Protein Master', description: 'Hit protein goal 60 days', icon: '🥩', unlocked: false, points: 150, progress: 80 }
];

const weeklyProgress = [
  { day: 'Mon', workouts: 1, calories: 450 },
  { day: 'Tue', workouts: 1, calories: 520 },
  { day: 'Wed', workouts: 0, calories: 0 },
  { day: 'Thu', workouts: 2, calories: 680 },
  { day: 'Fri', workouts: 1, calories: 420 },
  { day: 'Sat', workouts: 2, calories: 750 },
  { day: 'Sun', workouts: 1, calories: 490 }
];

const strengthProgress = [
  { exercise: 'Bench', value: 85 },
  { exercise: 'Squat', value: 92 },
  { exercise: 'Deadlift', value: 78 },
  { exercise: 'OHP', value: 65 },
  { exercise: 'Pull-up', value: 88 }
];

export default function Achievements() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [userLevel, setUserLevel] = useState(8);
  const [xp, setXp] = useState(650);
  const [xpToNext, setXpToNext] = useState(1000);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  useEffect(() => {
    // Trigger confetti on mount to celebrate
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  }, []);

  return (
    <Box className="achievements-page" sx={{ p: 3, background: '#0a0e27', minHeight: '100vh' }}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h3" color="white" gutterBottom fontWeight="bold" mb={1}>
          🏆 Achievements & Progress
        </Typography>
        <Typography variant="body1" color="rgba(255,255,255,0.7)" mb={4}>
          Track your journey and unlock rewards
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {/* Level Progress */}
        <Grid item xs={12}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              background: 'linear-gradient(135deg, #667eea40 0%, #764ba240 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={3}>
                  <Box textAlign="center">
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ffd93d 0%, #ff9800 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        boxShadow: '0 10px 40px rgba(255,217,61,0.4)',
                        border: '4px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      <Typography variant="h2" fontWeight="bold" color="white">
                        {userLevel}
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="white" mt={2} fontWeight="bold">
                      Level {userLevel}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Typography variant="h6" color="white" mb={1}>
                    {xp} / {xpToNext} XP to Level {userLevel + 1}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(xp / xpToNext) * 100}
                    sx={{
                      height: 20,
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 10
                      }
                    }}
                  />
                  <Grid container spacing={2} mt={2}>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                        <EmojiEventsIcon sx={{ fontSize: 30, color: '#ffd93d', mb: 1 }} />
                        <Typography variant="h5" color="white" fontWeight="bold">{unlockedCount}/{achievements.length}</Typography>
                        <Typography variant="caption" color="rgba(255,255,255,0.7)">Achievements</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                        <WhatshotIcon sx={{ fontSize: 30, color: '#ff6b6b', mb: 1 }} />
                        <Typography variant="h5" color="white" fontWeight="bold">12</Typography>
                        <Typography variant="caption" color="rgba(255,255,255,0.7)">Day Streak</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                        <FitnessCenterIcon sx={{ fontSize: 30, color: '#4ecdc4', mb: 1 }} />
                        <Typography variant="h5" color="white" fontWeight="bold">156</Typography>
                        <Typography variant="caption" color="rgba(255,255,255,0.7)">Workouts</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                        <TrendingUpIcon sx={{ fontSize: 30, color: '#a8e6cf', mb: 1 }} />
                        <Typography variant="h5" color="white" fontWeight="bold">{totalPoints}</Typography>
                        <Typography variant="caption" color="rgba(255,255,255,0.7)">Total Points</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Achievement Cards */}
        <Grid item xs={12}>
          <Typography variant="h5" color="white" mb={2} fontWeight="bold">
            🎯 Your Achievements
          </Typography>
          <Grid container spacing={2}>
            {achievements.map((achievement, index) => (
              <Grid item xs={12} sm={6} md={3} key={achievement.id}>
                <MotionCard
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  sx={{
                    background: achievement.unlocked
                      ? 'linear-gradient(135deg, #4caf5040 0%, #2e7d3240 100%)'
                      : 'linear-gradient(135deg, #42424240 0%, #30303040 100%)',
                    backdropFilter: 'blur(10px)',
                    border: achievement.unlocked
                      ? '2px solid #4caf50'
                      : '2px solid rgba(255,255,255,0.1)',
                    position: 'relative',
                    overflow: 'visible'
                  }}
                >
                  <CardContent>
                    <Box textAlign="center">
                      <Box
                        sx={{
                          fontSize: '3rem',
                          filter: achievement.unlocked ? 'none' : 'grayscale(100%)',
                          opacity: achievement.unlocked ? 1 : 0.3,
                          mb: 1
                        }}
                      >
                        {achievement.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        color="white"
                        fontWeight="bold"
                        mb={0.5}
                        sx={{ opacity: achievement.unlocked ? 1 : 0.5 }}
                      >
                        {achievement.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="rgba(255,255,255,0.7)"
                        display="block"
                        mb={1}
                      >
                        {achievement.description}
                      </Typography>
                      <Box
                        sx={{
                          background: achievement.unlocked ? '#4caf50' : 'rgba(255,255,255,0.1)',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          display: 'inline-block',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {achievement.points} Points
                      </Box>
                      {!achievement.unlocked && achievement.progress && (
                        <Box mt={2}>
                          <Typography variant="caption" color="rgba(255,255,255,0.7)" mb={0.5} display="block">
                            {achievement.progress}% Complete
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={achievement.progress}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              background: 'rgba(255,255,255,0.1)',
                              '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: 3
                              }
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                    {achievement.unlocked && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: '#4caf50',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 20px rgba(76,175,80,0.5)'
                        }}
                      >
                        ✓
                      </Box>
                    )}
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <MotionCard
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            sx={{
              background: 'linear-gradient(135deg, #1e3c7240 0%, #2a529840 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <CardContent>
              <Typography variant="h6" color="white" mb={3} fontWeight="bold">
                📈 Weekly Activity
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyProgress}>
                  <defs>
                    <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }}
                  />
                  <Area type="monotone" dataKey="calories" stroke="#ff6b6b" fillOpacity={1} fill="url(#colorCalories)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <MotionCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            sx={{
              background: 'linear-gradient(135deg, #667eea40 0%, #764ba240 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <CardContent>
              <Typography variant="h6" color="white" mb={3} fontWeight="bold">
                💪 Strength Progress
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={strengthProgress}>
                  <PolarGrid stroke="rgba(255,255,255,0.2)" />
                  <PolarAngleAxis dataKey="exercise" stroke="rgba(255,255,255,0.7)" />
                  <PolarRadiusAxis stroke="rgba(255,255,255,0.5)" />
                  <Radar name="Progress" dataKey="value" stroke="#4ecdc4" fill="#4ecdc4" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    </Box>
  );
}
