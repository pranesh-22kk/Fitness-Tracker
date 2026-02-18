/* Advanced 3D Landing Page with Glassmorphism & Particles */
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stars, 
  Float, 
  Sphere, 
  MeshDistortMaterial,
  PerspectiveCamera,
  Environment,
  Sparkles,
  Text3D,
  Center
} from '@react-three/drei';
import { motion } from 'framer-motion';
import { Box, Button, Typography, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/authentication/auth-context';
import { useContext } from 'react';
import ROUTES from '../../routes';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import './advancedHome.scss';

// Animated 3D Dumbbell
function AnimatedDumbbell() {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Dumbbell bar */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 3, 32]} />
          <meshStandardMaterial 
            color="#667eea" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#667eea"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Weights */}
        {[-1.3, 1.3].map((pos, i) => (
          <group key={i} position={[0, pos, 0]}>
            <mesh>
              <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
              <meshStandardMaterial 
                color="#764ba2" 
                metalness={0.8} 
                roughness={0.2}
                emissive="#764ba2"
                emissiveIntensity={0.2}
              />
            </mesh>
          </group>
        ))}
      </group>
    </Float>
  );
}

// Particle Field
function ParticleField() {
  const particlesRef = useRef();
  const particleCount = 1000;
  
  const particles = React.useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#667eea"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Floating Stats Orb
function StatsOrb({ position, color, intensity }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={1}>
      <Sphere ref={meshRef} args={[0.5, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={intensity}
        />
      </Sphere>
    </Float>
  );
}

// Main Scene
function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
        autoRotate
        autoRotateSpeed={0.5}
      />
      
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#667eea" />
      <spotLight position={[5, 5, 5]} intensity={0.8} angle={0.3} penumbra={1} color="#764ba2" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={100} scale={10} size={2} speed={0.4} color="#667eea" />
      
      {/* Main 3D Objects */}
      <AnimatedDumbbell />
      <ParticleField />
      
      {/* Decorative Orbs */}
      <StatsOrb position={[-3, 2, -2]} color="#f093fb" intensity={0.5} />
      <StatsOrb position={[3, -2, -2]} color="#4facfe" intensity={0.5} />
      <StatsOrb position={[0, 3, -3]} color="#43e97b" intensity={0.5} />
      
      <Environment preset="night" />
    </>
  );
}

// Main Component
export default function AdvancedHome() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <FitnessCenterIcon sx={{ fontSize: 40 }} />,
      title: 'Dashboard',
      description: 'View your fitness overview with 3D visualizations',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      path: '/dashboard'
    },
    {
      icon: <FitnessCenterIcon sx={{ fontSize: 40 }} />,
      title: 'Workout Planner',
      description: 'Create and track workout routines with real-time rep counter',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      path: '/workouts'
    },
    {
      icon: <RestaurantIcon sx={{ fontSize: 40 }} />,
      title: 'Meal Tracker',
      description: 'Track daily meals and nutrition with 3D food visualizations',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      path: '/mealTracker'
    },
    {
      icon: <SettingsIcon sx={{ fontSize: 40 }} />,
      title: 'Nutrition Preferences',
      description: 'Set dietary preferences and food restrictions',
      color: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
      path: '/preferences'
    },
    {
      icon: <RestaurantIcon sx={{ fontSize: 40 }} />,
      title: 'Nutrition Goals',
      description: 'Advanced nutrition planning with macros, timing, and hydration',
      color: 'linear-gradient(135deg, #74c0fc 0%, #51cf66 100%)',
      path: '/nutritionGoals'
    },
    {
      icon: <FitnessCenterIcon sx={{ fontSize: 40 }} />,
      title: 'Exercise Tracker',
      description: 'Track individual exercises and monitor your performance',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      path: '/exerciseTracker'
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      title: 'Progress Tracker',
      description: 'Visualize your fitness journey with detailed analytics',
      color: 'linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%)',
      path: '/progressTracker'
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
      title: 'Achievements',
      description: 'Track milestones and celebrate your fitness victories',
      color: 'linear-gradient(135deg, #ffd93d 0%, #ff9800 100%)',
      path: '/achievements'
    },
    {
      icon: <RestaurantIcon sx={{ fontSize: 40 }} />,
      title: 'Menu Browser',
      description: 'Browse dining court menus and nutritional information',
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      path: '/menu/all'
    },
    {
      icon: <RestaurantIcon sx={{ fontSize: 40 }} />,
      title: 'Food Info',
      description: 'Search and view detailed nutritional information',
      color: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
      path: '/foodInfo'
    },
    {
      icon: <RestaurantIcon sx={{ fontSize: 40 }} />,
      title: 'Saved Items',
      description: 'Access your saved favorite menu items',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      path: '/savedMenuItems'
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      title: 'Popular Items',
      description: 'Discover trending and popular menu choices',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      path: '/popularMenuItems'
    },
    {
      icon: <RestaurantIcon sx={{ fontSize: 40 }} />,
      title: 'Recommendations',
      description: 'Get personalized menu recommendations',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      path: '/recommendedMenuItems'
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      title: 'Nutrition Details',
      description: 'Deep dive into macro and micronutrients',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      path: '/lowLevelNutrition'
    },
    {
      icon: <LocalFireDepartmentIcon sx={{ fontSize: 40 }} />,
      title: 'BMR & Nutrition Goals',
      description: 'Calculate metabolic rate and set personalized nutrition goals',
      color: 'linear-gradient(135deg, #ff6b35 0%, #ffa94d 100%)',
      path: '/bmrInfo'
    },
    {
      icon: <FitnessCenterIcon sx={{ fontSize: 40 }} />,
      title: 'Health Tracker',
      description: 'Track other health metrics and vital signs',
      color: 'linear-gradient(135deg, #ffd93d 0%, #ff9800 100%)',
      path: '/otherHealthTracker'
    },
    {
      icon: <FitnessCenterIcon sx={{ fontSize: 40 }} />,
      title: 'Personal Info',
      description: 'Manage your profile and personal details',
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      path: '/personalInfo'
    },
    {
      icon: <FitnessCenterIcon sx={{ fontSize: 40 }} />,
      title: 'Preferences',
      description: 'Customize your app settings and preferences',
      color: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
      path: '/preferences'
    }
  ];

  return (
    <div className="advanced-home">
      {/* 3D Canvas Background */}
      <div className="canvas-container" style={{ opacity: 1 - scrollY / 1000 }}>
        <Canvas>
          <Scene />
        </Canvas>
      </div>

      {/* Hero Section */}
      <motion.div
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Typography 
              variant="h1" 
              className="hero-title"
              sx={{
                fontSize: { xs: '3rem', md: '5rem' },
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                mb: 2
              }}
            >
              Transform Your Fitness
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 4,
                fontSize: { xs: '1.2rem', md: '1.5rem' }
              }}
            >
              Experience the future of fitness tracking with immersive 3D visualizations
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate(user ? ROUTES.DASHBOARD : ROUTES.REGISTER)}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    px: 5,
                    py: 2,
                    fontSize: '1.1rem',
                    borderRadius: '50px',
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      boxShadow: '0 15px 40px rgba(102, 126, 234, 0.6)'
                    }
                  }}
                >
                  {user ? 'Go to Dashboard' : 'Start Free Trial'}
                </Button>
              </motion.div>
              
              {!user && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate(ROUTES.LOGIN)}
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      px: 5,
                      py: 2,
                      fontSize: '1.1rem',
                      borderRadius: '50px',
                      backdropFilter: 'blur(10px)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      '&:hover': {
                        borderColor: '#667eea',
                        background: 'rgba(102, 126, 234, 0.1)'
                      }
                    }}
                  >
                    Sign In
                  </Button>
                </motion.div>
              )}
            </Box>
          </motion.div>
        </Container>
      </motion.div>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, mt: 15 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              color: 'white',
              fontWeight: 800,
              mb: 2
            }}
          >
            Explore All Features
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.7)',
              mb: 6
            }}
          >
            Everything you need to track your fitness journey in one place
          </Typography>
        </motion.div>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Box
                  className="feature-card"
                  onClick={() => user && navigate(feature.path)}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    p: 4,
                    textAlign: 'center',
                    cursor: user ? 'pointer' : 'default',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '20px',
                      background: feature.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      color: 'white'
                    }}
                  >
                    {feature.icon}
                  </Box>
                  
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                    {feature.title}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {feature.description}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Quick Access Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box sx={{ mt: 10, mb: 10, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
              Ready to start?
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              {user && (
                <>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate(ROUTES.DASHBOARD)}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      px: 4,
                      py: 1.5,
                      borderRadius: '50px'
                    }}
                  >
                    View Dashboard
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate(ROUTES.SETTINGS)}
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      borderRadius: '50px',
                      '&:hover': {
                        borderColor: '#667eea',
                        background: 'rgba(102, 126, 234, 0.1)'
                      }
                    }}
                  >
                    Settings
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </motion.div>

        {/* Stats Section - Only show if logged in */}
        {user && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box sx={{ mt: 10, mb: 10 }}>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 4, textAlign: 'center' }}>
              Community Stats
            </Typography>
            <Grid container spacing={4} textAlign="center">
              {[
                { value: '50K+', label: 'Active Users' },
                { value: '1M+', label: 'Workouts Logged' },
                { value: '4.9', label: 'Average Rating' },
                { value: '24/7', label: 'Support' }
              ].map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
                      {stat.label}
                    </Typography>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>
        )}
      </Container>
    </div>
  );
}
