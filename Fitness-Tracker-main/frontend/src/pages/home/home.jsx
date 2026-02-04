import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Sphere, 
  MeshDistortMaterial, 
  Stars,
  Float,
  Center,
  PresentationControls
} from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiActivity, 
  FiTrendingUp, 
  FiTarget, 
  FiZap, 
  FiAward,
  FiHeart,
  FiBarChart2,
  FiCalendar
} from 'react-icons/fi';
import Navbar from "../../components/navbar/navbar";
import "./home.scss";

function Dumbbell({ position, color, speed = 1 }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * speed * 0.15;
      groupRef.current.rotation.z = state.clock.elapsedTime * speed * 0.2;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.2;
    }
  });

  return (
    <Float speed={speed * 0.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} position={position}>
        {/* Left weight */}
        <Sphere args={[0.6, 32, 32]} position={[-1.2, 0, 0]}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            roughness={0.3}
            metalness={0.8}
          />
        </Sphere>
        {/* Right weight */}
        <Sphere args={[0.6, 32, 32]} position={[1.2, 0, 0]}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            roughness={0.3}
            metalness={0.8}
          />
        </Sphere>
        {/* Bar */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 2.4, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>
      </group>
    </Float>
  );
}

function Scene3D() {
  return (
    <>
      <color attach="background" args={['#0a0015']} />
      <fog attach="fog" args={['#0a0015', 5, 25]} />
      
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#667eea" />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#764ba2" />
      <spotLight position={[0, 15, 0]} intensity={2} angle={0.3} penumbra={1} color="#f093fb" />
      
      <Stars radius={100} depth={50} count={1000} factor={2} saturation={0} fade speed={0.5} />
      
      <Dumbbell position={[-4, 2, -5]} color="#667eea" speed={0.7} />
      <Dumbbell position={[4, -1, -6]} color="#764ba2" speed={0.5} />
      <Dumbbell position={[0, 3, -8]} color="#f093fb" speed={0.6} />
      
      <PresentationControls
        global
        zoom={0.8}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <Center>
          <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.25}>
            <group position={[0, 0, 0]} scale={1.2}>
              {/* Kettlebell handle */}
              <mesh position={[0, 1, 0]}>
                <torusGeometry args={[0.8, 0.2, 16, 32, Math.PI]} />
                <meshStandardMaterial
                  color="#f093fb"
                  emissive="#667eea"
                  emissiveIntensity={0.4}
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
              {/* Kettlebell ball */}
              <Sphere args={[1, 32, 32]} position={[0, -0.3, 0]}>
                <MeshDistortMaterial
                  color="#f093fb"
                  emissive="#667eea"
                  emissiveIntensity={0.3}
                  distort={0.1}
                  speed={0.6}
                  metalness={0.7}
                  roughness={0.2}
                />
              </Sphere>
            </group>
          </Float>
        </Center>
      </PresentationControls>

      
      <EffectComposer multisampling={0}>
        <Bloom 
          intensity={1.2} 
          luminanceThreshold={0.3} 
          luminanceSmoothing={0.8}
        />
      </EffectComposer>
      
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        autoRotate 
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

const Home = () => {
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const features = [
    {
      icon: <FiActivity />,
      title: "Track Everything",
      description: "Monitor calories, macros, workouts, and progress in real-time with advanced analytics"
    },
    {
      icon: <FiTrendingUp />,
      title: "3D Visualizations",
      description: "Experience your fitness data like never before with stunning 3D graphics and animations"
    },
    {
      icon: <FiTarget />,
      title: "Smart Goals",
      description: "Set personalized targets and let AI guide you to achieve your fitness objectives"
    },
    {
      icon: <FiZap />,
      title: "Workout Planner",
      description: "Access hundreds of exercises with custom workout templates and progression tracking"
    },
    {
      icon: <FiAward />,
      title: "Achievements",
      description: "Unlock badges, level up, and stay motivated with gamified fitness milestones"
    },
    {
      icon: <FiHeart />,
      title: "Health Insights",
      description: "Get detailed analysis of your BMR, TDEE, and personalized nutrition recommendations"
    }
  ];

  const stats = [
    { icon: <FiBarChart2 />, value: "Real-Time", label: "Calorie Tracking" },
    { icon: <FiActivity />, value: "Custom", label: "Workout Plans" },
    { icon: <FiAward />, value: "Progress", label: "Achievements" },
    { icon: <FiCalendar />, value: "Daily", label: "Nutrition Goals" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  useEffect(() => {
    let timeoutId;
    const handleMouseMove = (e) => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        setMousePosition({
          x: (e.clientX / window.innerWidth - 0.5) * 0.5,
          y: (e.clientY / window.innerHeight - 0.5) * 0.5
        });
        timeoutId = null;
      }, 50);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="home">
      <Navbar />
      
      <div className="canvas-container">
        <Canvas 
          camera={{ position: [0, 0, 8], fov: 60 }}
          dpr={[1, 1.5]}
          performance={{ min: 0.5 }}
          frameloop="demand"
          gl={{ antialias: false, powerPreference: "high-performance" }}
        >
          <Scene3D />
        </Canvas>
      </div>

      <div className="hero-content">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.h1
            className="hero-title"
            style={{
              transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px)`
            }}
          >
            Transform Your
            <span className="gradient-text"> Fitness Journey</span>
          </motion.h1>
          
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Track your nutrition, plan workouts, and achieve your fitness goals with
            powerful 3D visualizations and personalized insights
          </motion.p>

          <motion.div
            className="cta-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button 
              className="cta-primary"
              onClick={() => navigate('/register')}
            >
              <FiZap className="btn-icon" />
              Start Free Trial
            </button>
            <button 
              className="cta-secondary"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          className="stats-grid"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="features-section">
        <motion.h2
          className="features-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Why Choose <span className="gradient-text">FitTracker Pro</span>
        </motion.h2>

        <div className="features-carousel">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFeature}
              className="feature-card-large"
              initial={{ opacity: 0, x: 100, rotateY: 90 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -100, rotateY: -90 }}
              transition={{ duration: 0.6 }}
            >
              <div className="feature-icon-large">
                {features[currentFeature].icon}
              </div>
              <h3>{features[currentFeature].title}</h3>
              <p>{features[currentFeature].description}</p>
            </motion.div>
          </AnimatePresence>

          <div className="feature-indicators">
            {features.map((_, index) => (
              <div
                key={index}
                className={`indicator ${index === currentFeature ? 'active' : ''}`}
                onClick={() => setCurrentFeature(index)}
              />
            ))}
          </div>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        className="final-cta"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2>Ready to Start Your Fitness Journey?</h2>
        <p>Begin tracking your progress today with powerful tools and insights</p>
        <button 
          className="cta-primary large"
          onClick={() => navigate('/register')}
        >
          <FiZap className="btn-icon" />
          Get Started - Create Account
        </button>
      </motion.div>

      <div className="particle-overlay" />
    </div>
  );
};

export default Home;
