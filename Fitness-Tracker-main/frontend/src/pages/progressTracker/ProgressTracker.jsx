import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, TextField, Tabs, Tab } from '@mui/material';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import './ProgressTracker.scss';

const MotionCard = motion(Card);

// Sample data - in real app, fetch from backend
const weightData = [
  { date: 'Jan 1', weight: 180, bodyFat: 22 },
  { date: 'Jan 8', weight: 178, bodyFat: 21.5 },
  { date: 'Jan 15', weight: 176, bodyFat: 21 },
  { date: 'Jan 22', weight: 175, bodyFat: 20.5 },
  { date: 'Jan 29', weight: 173, bodyFat: 20 },
  { date: 'Feb 5', weight: 171, bodyFat: 19.5 },
  { date: 'Feb 12', weight: 170, bodyFat: 19 }
];

const measurementData = [
  { date: 'Jan 1', chest: 42, waist: 34, hips: 40, biceps: 15, thighs: 24 },
  { date: 'Feb 1', chest: 43, waist: 32, hips: 39, biceps: 15.5, thighs: 24.5 },
  { date: 'Mar 1', chest: 44, waist: 31, hips: 38, biceps: 16, thighs: 25 }
];

export default function ProgressTracker() {
  const [tabValue, setTabValue] = useState(0);
  const [newEntry, setNewEntry] = useState({
    weight: '',
    bodyFat: '',
    chest: '',
    waist: '',
    hips: '',
    biceps: '',
    thighs: ''
  });

  const currentWeight = weightData[weightData.length - 1].weight;
  const startWeight = weightData[0].weight;
  const weightChange = currentWeight - startWeight;
  const weightChangePercent = ((weightChange / startWeight) * 100).toFixed(1);

  const handleAddEntry = () => {
    console.log('Adding entry:', newEntry);
    // In real app, POST to /api/progress
  };

  const StatBox = ({ label, value, trend, color }) => (
    <Box
      sx={{
        p: 2,
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 2,
        border: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center'
      }}
    >
      <Typography variant="caption" color="rgba(255,255,255,0.7)" mb={1} display="block">
        {label}
      </Typography>
      <Typography variant="h4" color={color} fontWeight="bold" mb={0.5}>
        {value}
      </Typography>
      {trend && (
        <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
          {trend > 0 ? (
            <TrendingUpIcon sx={{ fontSize: 16, color: '#4caf50' }} />
          ) : (
            <TrendingDownIcon sx={{ fontSize: 16, color: '#ff6b6b' }} />
          )}
          <Typography variant="caption" color={trend > 0 ? '#4caf50' : '#ff6b6b'}>
            {Math.abs(trend)}%
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Box className="progress-tracker" sx={{ p: 3, background: '#0a0e27', minHeight: '100vh' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h3" color="white" gutterBottom fontWeight="bold" mb={1}>
          📈 Progress Tracker
        </Typography>
        <Typography variant="body1" color="rgba(255,255,255,0.7)" mb={4}>
          Track your transformation journey with detailed metrics
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <StatBox
                label="Current Weight"
                value={`${currentWeight} lbs`}
                trend={weightChangePercent}
                color="#4ecdc4"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatBox
                label="Total Lost"
                value={`${Math.abs(weightChange)} lbs`}
                color="#ff6b6b"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatBox
                label="Body Fat"
                value={`${weightData[weightData.length - 1].bodyFat}%`}
                trend={-2.5}
                color="#ffe66d"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatBox
                label="Goal Progress"
                value="78%"
                color="#a8e6cf"
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
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
                ⚖️ Weight Progress
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weightData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ecdc4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4ecdc4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }}
                  />
                  <Area type="monotone" dataKey="weight" stroke="#4ecdc4" fillOpacity={1} fill="url(#colorWeight)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={6}>
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
                📊 Body Fat Percentage
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bodyFat" 
                    stroke="#ffe66d" 
                    strokeWidth={3}
                    dot={{ fill: '#ffe66d', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Add New Entry */}
        <Grid item xs={12}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{
              background: 'linear-gradient(135deg, #ff6b6b40 0%, #f4433640 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <CardContent>
              <Typography variant="h6" color="white" mb={3} fontWeight="bold">
                ➕ Add New Progress Entry
              </Typography>
              
              <Tabs 
                value={tabValue} 
                onChange={(e, v) => setTabValue(v)}
                sx={{
                  mb: 3,
                  '& .MuiTab-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .Mui-selected': { color: 'white' },
                  '& .MuiTabs-indicator': { backgroundColor: '#ff6b6b' }
                }}
              >
                <Tab label="Weight & Body Fat" />
                <Tab label="Measurements" />
                <Tab label="Photos" />
              </Tabs>

              {tabValue === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Weight (lbs)"
                      type="number"
                      value={newEntry.weight}
                      onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                          '&.Mui-focused fieldset': { borderColor: '#ff6b6b' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Body Fat %"
                      type="number"
                      value={newEntry.bodyFat}
                      onChange={(e) => setNewEntry({...newEntry, bodyFat: e.target.value})}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                          '&.Mui-focused fieldset': { borderColor: '#ff6b6b' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={handleAddEntry}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        height: '56px'
                      }}
                    >
                      Add Entry
                    </Button>
                  </Grid>
                </Grid>
              )}

              {tabValue === 1 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      label="Chest (in)"
                      type="number"
                      value={newEntry.chest}
                      onChange={(e) => setNewEntry({...newEntry, chest: e.target.value})}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      label="Waist (in)"
                      type="number"
                      value={newEntry.waist}
                      onChange={(e) => setNewEntry({...newEntry, waist: e.target.value})}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      label="Hips (in)"
                      type="number"
                      value={newEntry.hips}
                      onChange={(e) => setNewEntry({...newEntry, hips: e.target.value})}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      label="Biceps (in)"
                      type="number"
                      value={newEntry.biceps}
                      onChange={(e) => setNewEntry({...newEntry, biceps: e.target.value})}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                      fullWidth
                      label="Thighs (in)"
                      type="number"
                      value={newEntry.thighs}
                      onChange={(e) => setNewEntry({...newEntry, thighs: e.target.value})}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                      }}
                    />
                  </Grid>
                </Grid>
              )}

              {tabValue === 2 && (
                <Box textAlign="center" py={5}>
                  <MonitorWeightIcon sx={{ fontSize: 60, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
                  <Typography variant="h6" color="rgba(255,255,255,0.7)">
                    Progress Photos Coming Soon!
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.5)" mt={1}>
                    Upload front, side, and back photos to track your transformation
                  </Typography>
                </Box>
              )}
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    </Box>
  );
}
