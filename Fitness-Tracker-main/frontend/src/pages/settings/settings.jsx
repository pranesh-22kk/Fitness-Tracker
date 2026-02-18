/* Modern Settings Page with 3D UI */
import Navbar from "../../components/navbar/navbar";
import "./settings.scss";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Canvas, useFrame } from '@react-three/fiber';
import { Torus, Float, OrbitControls, Stars } from '@react-three/drei';
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import { logout } from "../../utils/authentication/auth-helper";
import { AuthContext } from "../../utils/authentication/auth-context";
import { useContext, useRef } from "react";
import ROUTES from "../../routes";
import { 
  FiUser, 
  FiSettings, 
  FiHeart, 
  FiBell, 
  FiAlertCircle, 
  FiTrash2, 
  FiLogOut 
} from 'react-icons/fi';

// 3D Gear Component
function Gear3D({ position, speed = 1 }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.01 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.1;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <Torus ref={meshRef} args={[1, 0.3, 16, 32]} position={position}>
        <meshStandardMaterial 
          color="#667eea" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#764ba2"
          emissiveIntensity={0.3}
        />
      </Torus>
    </Float>
  );
}

function Scene3D() {
  return (
    <>

      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={1} />
      <Stars radius={50} depth={30} count={800} factor={2} fade speed={0.5} />
      
      <Gear3D position={[-1.5, 0, 0]} speed={1} />
      <Gear3D position={[1.5, 0, 0]} speed={-0.8} />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

const Settings = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout(dispatch);
    navigate(ROUTES.LOGIN);
  };

  const settingsOptions = [
    {
      icon: <FiUser />,
      title: "Personal Information",
      description: "Update your profile and account details",
      link: ROUTES.PERSONAL_INFO,
      color: "#667eea",
      enabled: true
    },
    {
      icon: <FiHeart />,
      title: "Dietary Preferences",
      description: "Manage your food preferences and restrictions",
      link: ROUTES.PREFERENCES,
      color: "#ff6b6b",
      enabled: true
    },
    {
      icon: <FiBell />,
      title: "Notifications",
      description: "Configure notification settings",
      link: null,
      color: "#4fc3f7",
      enabled: false
    },
    {
      icon: <FiAlertCircle />,
      title: "Report a Problem",
      description: "Let us know about any issues",
      link: ROUTES.REPORT_PROBLEM,
      color: "#ffa502",
      enabled: true
    },
    {
      icon: <FiTrash2 />,
      title: "Delete Account",
      description: "Permanently remove your account",
      link: null,
      color: "#ff4757",
      enabled: false
    },
    {
      icon: <FiLogOut />,
      title: "Logout",
      description: "Sign out of your account",
      link: "/login",
      color: "#a29bfe",
      enabled: true,
      onClick: handleLogout
    }
  ];

  return (
    <div className="settings-page">
      <Navbar />
      
      <div className="canvas-background">
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 50 }} 
          dpr={[1, 1.5]}
          gl={{ preserveDrawingBuffer: false, antialias: false }}
        >
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
            <FiSettings /> Settings
          </Typography>
          <Typography variant="subtitle1" className="page-subtitle">
            Manage your account and preferences
          </Typography>
        </motion.div>

        <Grid container spacing={3}>
          {settingsOptions.map((option, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {option.enabled && option.link ? (
                  <Link to={option.link} className="settings-link" onClick={option.onClick}>
                    <Card className="settings-card" style={{ borderLeft: `4px solid ${option.color}` }}>
                      <CardContent>
                        <Box className="icon-container" style={{ background: `${option.color}20` }}>
                          <Box className="icon" style={{ color: option.color }}>
                            {option.icon}
                          </Box>
                        </Box>
                        <Typography variant="h6" className="card-title">
                          {option.title}
                        </Typography>
                        <Typography variant="body2" className="card-description">
                          {option.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                ) : (
                  <Card 
                    className="settings-card disabled" 
                    style={{ borderLeft: `4px solid ${option.color}`, opacity: 0.5 }}
                  >
                    <CardContent>
                      <Box className="icon-container" style={{ background: `${option.color}20` }}>
                        <Box className="icon" style={{ color: option.color }}>
                          {option.icon}
                        </Box>
                      </Box>
                      <Typography variant="h6" className="card-title">
                        {option.title}
                      </Typography>
                      <Typography variant="body2" className="card-description">
                        {option.description}
                      </Typography>
                      <Typography variant="caption" className="coming-soon">
                        Coming Soon
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <motion.div
          className="footer-note"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Typography variant="body2" color="textSecondary" align="center">
            Need help? Contact support or visit our help center
          </Typography>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
