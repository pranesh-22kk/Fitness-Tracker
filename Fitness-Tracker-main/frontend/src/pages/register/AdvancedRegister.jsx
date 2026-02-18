/* Ultra Advanced 3D Register Page - Premium Design */
import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Float,
  Sphere,
  MeshDistortMaterial,
  PerspectiveCamera,
  Environment,
  Torus,
  RoundedBox,
  Sparkles,
  Text
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  LinearProgress
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonAdd,
  Login as LoginIcon,
  Email,
  Phone,
  Person,
  Lock,
  Celebration
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import RegexUtil from "../../utils/regex-util";
import ROUTES from "../../routes";
import "./AdvancedRegister.scss";

// Animated 3D Dumbbell (matching home page)
function AnimatedDumbbell({ position }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef} position={position} scale={0.6}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 3, 32]} />
          <meshStandardMaterial 
            color="#00f2fe" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#00f2fe"
            emissiveIntensity={0.5}
          />
        </mesh>
        {[-1.3, 1.3].map((pos, i) => (
          <group key={i} position={[0, pos, 0]}>
            <mesh>
              <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
              <meshStandardMaterial 
                color="#4facfe" 
                metalness={0.8} 
                roughness={0.2}
                emissive="#4facfe"
                emissiveIntensity={0.3}
              />
            </mesh>
          </group>
        ))}
      </group>
    </Float>
  );
}

// Animated 3D Torus
function FloatingTorus({ position, color, speed = 1 }) {
  const torusRef = useRef();

  useFrame((state) => {
    if (torusRef.current) {
      torusRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      torusRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
      torusRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={1}>
      <Torus ref={torusRef} args={[1, 0.4, 16, 100]} position={position}>
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </Torus>
    </Float>
  );
}

// Floating Orb
function FloatingOrb({ position, color }) {
  const orbRef = useRef();

  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
      orbRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      orbRef.current.rotation.z = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <Sphere ref={orbRef} args={[0.8, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.5}
          speed={3}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.6}
        />
      </Sphere>
    </Float>
  );
}

// Background Scene
function RegisterScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />

      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#4facfe" />
      <pointLight position={[0, 10, 5]} intensity={1} color="#00f2fe" />

      <Stars radius={150} depth={60} count={7000} factor={5} fade speed={1.5} />
      <Sparkles count={100} scale={10} size={2} speed={0.5} color="#ffffff" />

      <AnimatedDumbbell position={[0, 0, -2]} />
      <FloatingTorus position={[-4, 1, -4]} color="#4facfe" speed={0.6} />
      <FloatingTorus position={[4, -1, -5]} color="#00f2fe" speed={0.8} />
      <FloatingOrb position={[-3, -2, -3]} color="#a8edea" />
      <FloatingOrb position={[3, 2, -4]} color="#fed6e3" />
      <FloatingOrb position={[0, -3, -6]} color="#f093fb" />

      <Environment preset="night" />
    </>
  );
}

export default function AdvancedRegister() {
  const ERROR_MESSAGES = {
    EXISTING_CREDENTIALS_ERROR: "Email, phone number, or username already taken.",
    INVALID_EMAIL_ERROR: "Invalid email format.",
    INVALID_PHONE_ERROR: "Invalid phone format.",
    INVALID_USERNAME_ERROR: `Invalid username. Minimum length: ${RegexUtil.MIN_USERNAME_LENGTH}`,
    INVALID_PASSWORD_ERROR: `Invalid password. Minimum length: ${RegexUtil.MIN_PASSWORD_LENGTH}`,
    GENERIC_SERVER_ERROR: "Registration failed. Please try again later.",
    DIDNT_AGREE_TERMS_ERROR: "You must agree to the terms and conditions."
  };

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValidCredentials, setIsValidCredentials] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsValidCredentials(true);

    if (!RegexUtil.isValidEmailFormat(email)) {
      setIsValidCredentials(false);
      setErrorMessage(ERROR_MESSAGES.INVALID_EMAIL_ERROR);
      return;
    }
    if (!RegexUtil.isValidPhoneFormat(phone)) {
      setIsValidCredentials(false);
      setErrorMessage(ERROR_MESSAGES.INVALID_PHONE_ERROR);
      return;
    }
    if (!RegexUtil.isValidUsernameFormat(username)) {
      setIsValidCredentials(false);
      setErrorMessage(ERROR_MESSAGES.INVALID_USERNAME_ERROR);
      return;
    }
    if (!RegexUtil.isValidPasswordFormat(password)) {
      setIsValidCredentials(false);
      setErrorMessage(ERROR_MESSAGES.INVALID_PASSWORD_ERROR);
      return;
    }
    if (!termsAgreed) {
      setIsValidCredentials(false);
      setErrorMessage(ERROR_MESSAGES.DIDNT_AGREE_TERMS_ERROR);
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("auth/register", {
        username,
        email,
        phone,
        password
      });

      navigate(ROUTES.LOGIN, {
        state: { justRegistered: true }
      });
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setErrorMessage(ERROR_MESSAGES.EXISTING_CREDENTIALS_ERROR);
      } else {
        console.log(err);
        setErrorMessage(ERROR_MESSAGES.GENERIC_SERVER_ERROR);
      }
      setIsValidCredentials(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="advanced-register">
      {/* 3D Background */}
      <div className="canvas-container">
        <Canvas>
          <RegisterScene />
        </Canvas>
      </div>

      {/* Register Form */}
      <motion.div
        className="register-content"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Box className="glass-card">
          {/* Header with Icon */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="header-section"
          >
            <Box className="icon-container">
              <Celebration sx={{ fontSize: 50, color: "#4facfe" }} />
            </Box>
            <Typography variant="h2" className="title">
              Join Titan Health
            </Typography>
            <Typography variant="body1" className="subtitle">
              Transform your fitness journey with advanced 3D tracking
            </Typography>
          </motion.div>

          {/* Progress Bar */}
          {isLoading && (
            <LinearProgress 
              sx={{ 
                mb: 3, 
                backgroundColor: 'rgba(255,255,255,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#4facfe'
                }
              }} 
            />
          )}

          {/* Error Message */}
          <AnimatePresence>
            {!isValidCredentials && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Alert severity="error" className="error-alert" sx={{ mb: 3 }}>
                  {errorMessage}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Registration Form */}
          <form onSubmit={handleRegister}>
            <Box className="form-grid">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'rgba(255,255,255,0.5)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              {/* Phone Field */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                  placeholder="(555) 123-4567"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: 'rgba(255,255,255,0.5)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              {/* Username Field */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: 'rgba(255,255,255,0.5)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
              >
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'rgba(255,255,255,0.5)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>
            </Box>

            {/* Terms Checkbox */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ marginTop: '24px' }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="checkbox"
                  />
                }
                label={
                  <Typography variant="body2" className="checkbox-label">
                    I agree to the <span className="highlight">Terms and Conditions</span> and <span className="highlight">Privacy Policy</span>
                  </Typography>
                }
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={isLoading}
                startIcon={<PersonAdd />}
                className="register-button"
              >
                {isLoading ? "Creating Account..." : "Create Free Account"}
              </Button>
            </motion.div>
          </form>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="login-section"
          >
            <Typography variant="body2" className="login-text">
              Already have an account?{" "}
              <Link to={ROUTES.LOGIN} className="login-link">
                <LoginIcon sx={{ verticalAlign: "middle", fontSize: 18, mr: 0.5 }} />
                Sign In
              </Link>
            </Typography>
          </motion.div>
        </Box>
      </motion.div>
    </div>
  );
}
