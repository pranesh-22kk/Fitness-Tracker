/* Advanced 3D Login Page with Glassmorphism */
import React, { useEffect, useRef, useContext, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Float,
  Sphere,
  MeshDistortMaterial,
  PerspectiveCamera,
  Environment,
  Text
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton
} from "@mui/material";
import { Visibility, VisibilityOff, Login as LoginIcon, PersonAdd } from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../../utils/authentication/auth-helper";
import { AuthContext } from "../../utils/authentication/auth-context";
import RegexUtil from "../../utils/regex-util";
import ROUTES from "../../routes";
import "./login.scss";

// Animated 3D Sphere Orb
function FloatingOrb({ position, color, speed = 1 }) {
  const orbRef = useRef();

  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
      orbRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      orbRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <Sphere ref={orbRef} args={[0.8, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </Sphere>
    </Float>
  );
}

// Background Scene
function LoginScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#667eea" />

      <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
      
      <FloatingOrb position={[-3, 1, -2]} color="#667eea" speed={0.8} />
      <FloatingOrb position={[3, -1, -3]} color="#764ba2" speed={1.2} />
      <FloatingOrb position={[0, 2, -4]} color="#f093fb" speed={1} />
      
      <Environment preset="night" />
    </>
  );
}

export default function Login() {
    const JUST_REGISTERED_MESSAGE = "Your registration was successful!";
    
    const [recentlyRegistered, setRecentlyRegistered] = useState(false);
    const [emailOrPhoneOrUsername, setEmailOrPhoneOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isValidCredentials, setIsValidCredentials] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const { dispatch } = useContext(AuthContext);
    const [user, setUser] = useState({});
    const isFirstRender = useRef(true);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const loginMethod = RegexUtil.isValidPhoneFormat(emailOrPhoneOrUsername)
            ? RegexUtil.stripNonDigits(emailOrPhoneOrUsername)
            : emailOrPhoneOrUsername;
        
        login({ loginMethod, password }, dispatch).then((returnedUser) => {
            setUser(returnedUser);
            if (returnedUser) {
                // Redirect to dashboard after successful login
                setTimeout(() => navigate(ROUTES.DASHBOARD), 500);
            }
        });
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (user == null) {
            setIsValidCredentials(false);
        }
    }, [user]);

    useEffect(() => {
        if (location.state != null) {
            setRecentlyRegistered(location.state.justRegistered);
        }
    }, [location.state]);

    useEffect(() => {
        if (recentlyRegistered) {
            window.history.replaceState({}, document.title, null);
            setTimeout(() => setRecentlyRegistered(false), 5000);
        }
    }, [recentlyRegistered]);

    return (
        <div className="advanced-login">
            {/* 3D Background */}
            <div className="canvas-container">
                <Canvas>
                    <LoginScene />
                </Canvas>
            </div>

            {/* Login Form */}
            <motion.div
                className="login-content"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Box className="glass-card">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Typography variant="h3" className="title" gutterBottom>
                            Welcome Back
                        </Typography>
                        <Typography variant="body1" className="subtitle" gutterBottom>
                            Sign in to continue your fitness journey
                        </Typography>
                    </motion.div>

                    {/* Success Message */}
                    <AnimatePresence>
                        {recentlyRegistered && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                                    {JUST_REGISTERED_MESSAGE}
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error Message */}
                    <AnimatePresence>
                        {!isValidCredentials && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                    Invalid login credentials
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Login Form */}
                    <form onSubmit={handleLogin}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <TextField
                                fullWidth
                                label="Email, Phone, or Username"
                                variant="outlined"
                                value={emailOrPhoneOrUsername}
                                onChange={(e) => setEmailOrPhoneOrUsername(e.target.value)}
                                sx={{ mb: 3 }}
                                className="input-field"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ mb: 3 }}
                                className="input-field"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                type="submit"
                                startIcon={<LoginIcon />}
                                className="login-button"
                                sx={{ mb: 3, py: 1.5 }}
                            >
                                Sign In
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            style={{ textAlign: 'center' }}
                        >
                            <Typography variant="body2" className="signup-text">
                                New to Titan Health?{" "}
                                <Link to={ROUTES.REGISTER} className="signup-link">
                                    <PersonAdd sx={{ verticalAlign: 'middle', fontSize: 18, mr: 0.5 }} />
                                    Start Free Trial
                                </Link>
                            </Typography>
                        </motion.div>
                    </form>
                </Box>
            </motion.div>
        </div>
    );
}