/* Modern Health Tracker with 3D UI */
import Navbar from "../../components/navbar/navbar";
import "./otherHealthTracker.scss";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../utils/authentication/auth-context";
import axios from "axios";
import { motion } from "framer-motion";
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Float, OrbitControls, MeshDistortMaterial, Stars } from '@react-three/drei';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Chip
} from "@mui/material";
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import BedIcon from '@mui/icons-material/Bed';
import ScaleIcon from '@mui/icons-material/Scale';
import MedicationIcon from '@mui/icons-material/Medication';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { LineChart } from '@mui/x-charts';

// 3D Animated Health Sphere
function HealthSphere({ type, position }) {
  const meshRef = useRef();
  
  const colors = {
    weight: { base: "#ff6b6b", emissive: "#ff4757" },
    sleep: { base: "#a29bfe", emissive: "#6c5ce7" },
    water: { base: "#4fc3f7", emissive: "#00bcd4" },
    supplement: { base: "#26de81", emissive: "#20bf6b" }
  };

  const color = colors[type] || colors.water;
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <Sphere ref={meshRef} args={[0.8, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color.base}
          emissive={color.emissive}
          emissiveIntensity={0.5}
          distort={0.25}
          speed={1.5}
          roughness={0.2}
          metalness={0.7}
        />
      </Sphere>
    </Float>
  );
}

function Scene3D({ activeTab }) {
  const types = ['weight', 'sleep', 'water', 'supplement'];
  
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1.5} />
      <pointLight position={[-5, -5, -5]} intensity={1} />
      <Stars radius={50} depth={30} count={500} factor={2} fade speed={0.5} />
      
      <HealthSphere type={types[activeTab]} position={[0, 0, 0]} />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

const activityMap = new Map([
  ["Sedentary", 0],
  ["[none]", 0],
  ["Lightly Active", 1],
  ["Moderately Active", 2],
  ["Very Active", 3],
  ["Extremely Active", 4]
]);

const OtherHealthTracker = () => {
  const { user } = useContext(AuthContext);
  const userId = user._id;

  const [activeTab, setActiveTab] = useState(0);
  const [weightLog, setWeightLog] = useState([]);
  const [sleepLog, setSleepLog] = useState([]);
  const [waterLog, setWaterLog] = useState([]);
  const [supplementLog, setSupplementLog] = useState([]);
  const [recommendedWater, setRecommendedWater] = useState(0);
  const [activity, setActivity] = useState('');

  // Input states
  const [weightAmt, setWeightAmt] = useState('');
  const [weightDate, setWeightDate] = useState('');
  const [waterIntake, setWaterIntake] = useState('');
  const [waterDate, setWaterDate] = useState('');
  const [sleepLength, setSleepLength] = useState('');
  const [sleepDate, setSleepDate] = useState('');
  const [suppName, setSupplement] = useState('');
  const [suppAmt, setSuppAmt] = useState('');
  const [suppDate, setSuppDate] = useState('');

  function compare(a, b) {
    return new Date(a.date) - new Date(b.date);
  }

  const isFirstRender = useRef(true);
  
  useEffect(() => {
    const getAllEntries = async () => {
      try {
        const [weightRes, waterRes, sleepRes, suppRes, activityRes] = await Promise.all([
          axios.get(`users/weights/${userId}`, { headers: { token: `Bearer ${user.accessToken}` } }),
          axios.get(`users/water/${userId}`, { headers: { token: `Bearer ${user.accessToken}` } }),
          axios.get(`users/sleep/${userId}`, { headers: { token: `Bearer ${user.accessToken}` } }),
          axios.get(`users/supplement/${userId}`, { headers: { token: `Bearer ${user.accessToken}` } }),
          axios.get(`/users/activityInfo/${userId}`, { headers: { token: `Bearer ${user.accessToken}` } })
        ]);

        const resActivityLevel = activityRes.data.length === 0 ? "[none]" : activityRes.data[0].activityLevel;

        setWeightLog(weightRes.data.sort(compare));
        setWaterLog(waterRes.data.sort(compare));
        setSleepLog(sleepRes.data.sort(compare));
        setSupplementLog(suppRes.data.sort(compare));
        setActivity(resActivityLevel);
      } catch (error) {
        console.error(error);
      }
    };

    if (isFirstRender.current) {
      getAllEntries();
      isFirstRender.current = false;
    }
  }, [userId, user.accessToken]);

  useEffect(() => {
    if (weightLog.length > 0 && activity) {
      const latestWeight = parseInt(weightLog[weightLog.length - 1].weight);
      const activityMapping = activityMap.get(activity) || 0;
      setRecommendedWater(Math.round(((latestWeight * 0.5 + 12 * activityMapping * 0.25) / 8) / 0.5) * 0.5);
    }
  }, [weightLog, activity]);

  const handleAddWeight = async () => {
    if (!weightAmt || !weightDate) {
      alert('Please fill in both weight and date fields');
      return;
    }
    try {
      console.log('Adding weight:', { weight: weightAmt, date: weightDate });
      const res = await axios.put(
        `users/weight/${userId}`,
        { weight: weightAmt, date: weightDate },
        { headers: { token: `Bearer ${user.accessToken}` } }
      );
      console.log('Weight response:', res.data);
      if (res.data && res.data.weightLog) {
        setWeightLog(res.data.weightLog.sort(compare));
        setWeightAmt('');
        setWeightDate('');
        alert('Weight entry added successfully!');
      }
    } catch (error) {
      console.error('Error adding weight:', error);
      alert('Error adding weight entry: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleAddSleep = async () => {
    if (!sleepLength || !sleepDate) {
      alert('Please fill in both sleep hours and date fields');
      return;
    }
    try {
      console.log('Adding sleep:', { length: sleepLength, date: sleepDate });
      const res = await axios.put(
        `users/sleep/${userId}`,
        { length: sleepLength, date: sleepDate },
        { headers: { token: `Bearer ${user.accessToken}` } }
      );
      console.log('Sleep response:', res.data);
      if (res.data && res.data.sleepLog) {
        setSleepLog(res.data.sleepLog.sort(compare));
        setSleepLength('');
        setSleepDate('');
        alert('Sleep entry added successfully!');
      }
    } catch (error) {
      console.error('Error adding sleep:', error);
      alert('Error adding sleep entry: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleAddWater = async () => {
    if (!waterIntake || !waterDate) {
      alert('Please fill in both water intake and date fields');
      return;
    }
    try {
      console.log('Adding water:', { intake: waterIntake, date: waterDate });
      const res = await axios.put(
        `users/water/${userId}`,
        { intake: waterIntake, date: waterDate },
        { headers: { token: `Bearer ${user.accessToken}` } }
      );
      console.log('Water response:', res.data);
      if (res.data && res.data.waterLog) {
        setWaterLog(res.data.waterLog.sort(compare));
        setWaterIntake('');
        setWaterDate('');
        alert('Water entry added successfully!');
      }
    } catch (error) {
      console.error('Error adding water:', error);
      alert('Error adding water entry: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleAddSupplement = async () => {
    if (!suppName || !suppAmt || !suppDate) {
      alert('Please fill in all supplement fields');
      return;
    }
    try {
      console.log('Adding supplement:', { name: suppName, amount: suppAmt, date: suppDate });
      const res = await axios.put(
        `users/supplement/${userId}`,
        { name: suppName, amount: suppAmt, date: suppDate },
        { headers: { token: `Bearer ${user.accessToken}` } }
      );
      console.log('Supplement response:', res.data);
      if (res.data && res.data.supplementLog) {
        setSupplementLog(res.data.supplementLog.sort(compare));
        setSupplement('');
        setSuppAmt('');
        setSuppDate('');
        alert('Supplement entry added successfully!');
      }
    } catch (error) {
      console.error('Error adding supplement:', error);
      alert('Error adding supplement entry: ' + (error.response?.data?.error || error.message));
    }
  };

  const tabs = [
    { label: 'Weight', icon: <ScaleIcon />, color: '#ff6b6b' },
    { label: 'Sleep', icon: <BedIcon />, color: '#a29bfe' },
    { label: 'Water', icon: <LocalDrinkIcon />, color: '#4fc3f7' },
    { label: 'Supplements', icon: <MedicationIcon />, color: '#26de81' }
  ];

  const renderWeightTab = () => {
    const chartData = weightLog.map(entry => ({
      date: new Date(entry.date).toLocaleDateString(),
      weight: parseFloat(entry.weight)
    }));

    const trend = weightLog.length >= 2 
      ? weightLog[weightLog.length - 1].weight - weightLog[weightLog.length - 2].weight
      : 0;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="stat-card">
              <CardContent>
                <Typography variant="h6" className="card-title">
                  <ScaleIcon /> Current Weight
                </Typography>
                <Typography variant="h3" className="stat-value">
                  {weightLog.length > 0 ? `${weightLog[weightLog.length - 1].weight} lbs` : '--'}
                </Typography>
                {trend !== 0 && (
                  <Chip
                    icon={trend > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                    label={`${Math.abs(trend).toFixed(1)} lbs`}
                    color={trend > 0 ? 'error' : 'success'}
                    size="small"
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="chart-card">
              <CardContent>
                <Typography variant="h6" className="card-title">Weight Progress</Typography>
                {chartData.length > 0 && (
                  <LineChart
                    xAxis={[{ scaleType: 'point', data: chartData.map(d => d.date) }]}
                    series={[{ data: chartData.map(d => d.weight), color: '#ff6b6b', area: true }]}
                    height={250}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="input-card">
            <CardContent>
              <Typography variant="h6" className="card-title">Add Weight Entry</Typography>
              <Box className="input-group">
                <TextField
                  label="Weight (lbs)"
                  type="number"
                  value={weightAmt}
                  onChange={(e) => setWeightAmt(e.target.value)}
                  fullWidth
                  variant="outlined"
                  className="input-field"
                />
                <TextField
                  label="Date"
                  type="date"
                  value={weightDate}
                  onChange={(e) => setWeightDate(e.target.value)}
                  fullWidth
                  variant="outlined"
                  className="input-field"
                  InputLabelProps={{ shrink: true }}
                />
                <Button
                  variant="contained"
                  startIcon={<AddCircleIcon />}
                  onClick={handleAddWeight}
                  fullWidth
                  className="add-button"
                  style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%)' }}
                >
                  Add Entry
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="history-card">
            <CardContent>
              <Typography variant="h6" className="card-title">Recent Entries</Typography>
              <Box className="history-list">
                {weightLog.slice(-5).reverse().map((entry, idx) => (
                  <motion.div
                    key={idx}
                    className="history-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Typography variant="body1">
                      {entry.weight} lbs
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(entry.date).toLocaleDateString()}
                    </Typography>
                  </motion.div>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderSleepTab = () => {
    const chartData = sleepLog.map(entry => ({
      date: new Date(entry.date).toLocaleDateString(),
      hours: parseFloat(entry.length)
    }));

    const avgSleep = sleepLog.length > 0
      ? (sleepLog.reduce((sum, entry) => sum + parseFloat(entry.length), 0) / sleepLog.length).toFixed(1)
      : 0;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="stat-card">
              <CardContent>
                <Typography variant="h6" className="card-title">
                  <BedIcon /> Average Sleep
                </Typography>
                <Typography variant="h3" className="stat-value">
                  {avgSleep} hrs
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Recommended: 7-9 hours
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card className="chart-card">
            <CardContent>
              <Typography variant="h6" className="card-title">Sleep Pattern</Typography>
              {chartData.length > 0 && (
                <LineChart
                  xAxis={[{ scaleType: 'point', data: chartData.map(d => d.date) }]}
                  series={[{ data: chartData.map(d => d.hours), color: '#a29bfe', area: true }]}
                  height={250}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="input-card">
            <CardContent>
              <Typography variant="h6" className="card-title">Add Sleep Entry</Typography>
              <Box className="input-group">
                <TextField
                  label="Hours of Sleep"
                  type="number"
                  value={sleepLength}
                  onChange={(e) => setSleepLength(e.target.value)}
                  fullWidth
                  variant="outlined"
                  className="input-field"
                  inputProps={{ step: 0.5 }}
                />
                <TextField
                  label="Date & Time"
                  type="datetime-local"
                  value={sleepDate}
                  onChange={(e) => setSleepDate(e.target.value)}
                  fullWidth
                  variant="outlined"
                  className="input-field"
                  InputLabelProps={{ shrink: true }}
                />
                <Button
                  variant="contained"
                  startIcon={<AddCircleIcon />}
                  onClick={handleAddSleep}
                  fullWidth
                  className="add-button"
                  style={{ background: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)' }}
                >
                  Add Entry
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="history-card">
            <CardContent>
              <Typography variant="h6" className="card-title">Recent Entries</Typography>
              <Box className="history-list">
                {sleepLog.slice(-5).reverse().map((entry, idx) => (
                  <motion.div
                    key={idx}
                    className="history-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Typography variant="body1">
                      {entry.length} hours
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(entry.date).toLocaleString()}
                    </Typography>
                  </motion.div>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderWaterTab = () => {
    const chartData = waterLog.map(entry => ({
      date: new Date(entry.date).toLocaleDateString(),
      cups: parseFloat(entry.intake)
    }));

    const todayIntake = waterLog.filter(entry => 
      new Date(entry.date).toDateString() === new Date().toDateString()
    ).reduce((sum, entry) => sum + parseFloat(entry.intake), 0);

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="stat-card">
              <CardContent>
                <Typography variant="h6" className="card-title">
                  <LocalDrinkIcon /> Today's Intake
                </Typography>
                <Typography variant="h3" className="stat-value">
                  {todayIntake} cups
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Goal: {recommendedWater} cups
                </Typography>
                <Box className="progress-bar">
                  <Box 
                    className="progress-fill" 
                    style={{ 
                      width: `${Math.min((todayIntake / recommendedWater) * 100, 100)}%`,
                      background: 'linear-gradient(90deg, #4fc3f7 0%, #00bcd4 100%)'
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card className="chart-card">
            <CardContent>
              <Typography variant="h6" className="card-title">Water Intake History</Typography>
              {chartData.length > 0 && (
                <LineChart
                  xAxis={[{ scaleType: 'point', data: chartData.map(d => d.date) }]}
                  series={[{ data: chartData.map(d => d.cups), color: '#4fc3f7', area: true }]}
                  height={250}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="input-card">
            <CardContent>
              <Typography variant="h6" className="card-title">Add Water Entry</Typography>
              <Box className="input-group">
                <TextField
                  label="Cups of Water"
                  type="number"
                  value={waterIntake}
                  onChange={(e) => setWaterIntake(e.target.value)}
                  fullWidth
                  variant="outlined"
                  className="input-field"
                  inputProps={{ step: 0.5 }}
                />
                <TextField
                  label="Date"
                  type="date"
                  value={waterDate}
                  onChange={(e) => setWaterDate(e.target.value)}
                  fullWidth
                  variant="outlined"
                  className="input-field"
                  InputLabelProps={{ shrink: true }}
                />
                <Button
                  variant="contained"
                  startIcon={<AddCircleIcon />}
                  onClick={handleAddWater}
                  fullWidth
                  className="add-button"
                  style={{ background: 'linear-gradient(135deg, #4fc3f7 0%, #00bcd4 100%)' }}
                >
                  Add Entry
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="history-card">
            <CardContent>
              <Typography variant="h6" className="card-title">Recent Entries</Typography>
              <Box className="history-list">
                {waterLog.slice(-5).reverse().map((entry, idx) => (
                  <motion.div
                    key={idx}
                    className="history-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Typography variant="body1">
                      {entry.intake} cups
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(entry.date).toLocaleDateString()}
                    </Typography>
                  </motion.div>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderSupplementTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card className="input-card">
          <CardContent>
            <Typography variant="h6" className="card-title">Add Supplement</Typography>
            <Box className="input-group">
              <TextField
                label="Supplement Name"
                value={suppName}
                onChange={(e) => setSupplement(e.target.value)}
                fullWidth
                variant="outlined"
                className="input-field"
              />
              <TextField
                label="Amount"
                value={suppAmt}
                onChange={(e) => setSuppAmt(e.target.value)}
                fullWidth
                variant="outlined"
                className="input-field"
              />
              <TextField
                label="Date"
                type="date"
                value={suppDate}
                onChange={(e) => setSuppDate(e.target.value)}
                fullWidth
                variant="outlined"
                className="input-field"
                InputLabelProps={{ shrink: true }}
              />
              <Button
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={handleAddSupplement}
                fullWidth
                className="add-button"
                style={{ background: 'linear-gradient(135deg, #26de81 0%, #20bf6b 100%)' }}
              >
                Add Supplement
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card className="history-card">
          <CardContent>
            <Typography variant="h6" className="card-title">Supplement Log</Typography>
            <Box className="history-list">
              {supplementLog.slice(-10).reverse().map((entry, idx) => (
                <motion.div
                  key={idx}
                  className="history-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Box>
                    <Typography variant="body1">{entry.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {entry.amount} • {new Date(entry.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <div className="health-tracker">
      <Navbar />
      
      <div className="canvas-background">
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 50 }} 
          dpr={[1, 1.5]}
          gl={{ preserveDrawingBuffer: false, antialias: false }}
        >
          <Scene3D activeTab={activeTab} />
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
            Health Tracker
          </Typography>
          <Typography variant="subtitle1" className="page-subtitle">
            Monitor your daily health metrics
          </Typography>
        </motion.div>

        <Box className="tabs-container">
          {tabs.map((tab, index) => (
            <motion.div
              key={index}
              className={`tab-button ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ borderColor: activeTab === index ? tab.color : 'transparent' }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </motion.div>
          ))}
        </Box>

        <Box className="tab-content">
          {activeTab === 0 && renderWeightTab()}
          {activeTab === 1 && renderSleepTab()}
          {activeTab === 2 && renderWaterTab()}
          {activeTab === 3 && renderSupplementTab()}
        </Box>
      </div>
    </div>
  );
};

export default OtherHealthTracker;
