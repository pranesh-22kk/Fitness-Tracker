import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  ContactShadows,
  Float,
  MeshDistortMaterial,
  Sphere,
  Box,
  Cylinder,
  Text,
  Stars
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

function HumanBody({ highlightedMuscles = [] }) {
  const groupRef = useRef();
  const [hoveredPart, setHoveredPart] = useState(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const muscleGroups = {
    chest: { position: [0, 1.2, 0.4], scale: [0.9, 0.5, 0.5], color: '#ff6b6b', emoji: '💪' },
    shoulders: { position: [0, 1.6, 0], scale: [1.4, 0.4, 0.6], color: '#4ecdc4', emoji: '🏋️' },
    biceps: { position: [0.7, 1, 0.1], scale: [0.3, 0.6, 0.3], color: '#ffe66d', emoji: '💪' },
    abs: { position: [0, 0.5, 0.3], scale: [0.7, 0.8, 0.4], color: '#95e1d3', emoji: '🔥' },
    quadriceps: { position: [0, -0.5, 0.2], scale: [0.8, 1.1, 0.5], color: '#f38181', emoji: '⚡' },
    calves: { position: [0, -1.9, 0.1], scale: [0.6, 0.7, 0.6], color: '#aa96da', emoji: '🦵' },
  };

  const MuscleGroup = ({ name, position, scale, color, emoji }) => {
    const meshRef = useRef();
    const isHighlighted = highlightedMuscles.includes(name);
    const isHovered = hoveredPart === name;
    
    useFrame((state) => {
      if (meshRef.current && (isHighlighted || isHovered)) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.05);
      }
    });

    return (
      <Float speed={isHighlighted ? 3 : 1} rotationIntensity={isHighlighted ? 0.3 : 0.1}>
        <mesh
          ref={meshRef}
          position={position}
          scale={scale}
          onPointerOver={() => setHoveredPart(name)}
          onPointerOut={() => setHoveredPart(null)}
        >
          <boxGeometry />
          <MeshDistortMaterial
            color={isHighlighted || isHovered ? color : '#2a2a3a'}
            emissive={isHighlighted || isHovered ? color : '#000'}
            emissiveIntensity={isHighlighted ? 1.5 : isHovered ? 0.8 : 0}
            metalness={0.5}
            roughness={0.2}
            distort={isHighlighted || isHovered ? 0.4 : 0.1}
            speed={isHighlighted ? 3 : 1}
          />
        </mesh>
        {(isHighlighted || isHovered) && (
          <Text
            position={[position[0] + 2, position[1], position[2]]}
            fontSize={0.3}
            color={color}
            anchorX="left"
            outlineWidth={0.02}
            outlineColor="#000"
          >
            {emoji} {name.toUpperCase()}
          </Text>
        )}
      </Float>
    );
  };

  return (
    <group ref={groupRef}>
      <Stars radius={50} depth={30} count={2000} factor={3} saturation={0} fade speed={0.5} />
      
      <Float speed={2} rotationIntensity={0.1}>
        <Sphere args={[0.4, 32, 32]} position={[0, 2.1, 0]}>
          <MeshDistortMaterial
            color="#ffd6a5"
            emissive="#ff9a56"
            emissiveIntensity={0.3}
            metalness={0.2}
            roughness={0.6}
            distort={0.2}
            speed={1}
          />
        </Sphere>
      </Float>
      
      <Cylinder args={[0.18, 0.2, 0.4, 16]} position={[0, 1.75, 0]}>
        <meshStandardMaterial color="#ffd6a5" metalness={0.2} roughness={0.7} />
      </Cylinder>

      <Box args={[1.1, 1.6, 0.7]} position={[0, 0.8, 0]}>
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.4} 
          roughness={0.5}
          emissive="#667eea"
          emissiveIntensity={0.1}
        />
      </Box>

      {Object.entries(muscleGroups).map(([name, props]) => (
        <MuscleGroup key={name} name={name} {...props} />
      ))}

      <Float speed={1.5}>
        <Cylinder args={[0.14, 0.12, 1.3, 16]} position={[-0.75, 0.9, 0]} rotation={[0, 0, 0.1]}>
          <meshStandardMaterial color="#2a2a3a" metalness={0.3} roughness={0.6} emissive="#4ecdc4" emissiveIntensity={0.1} />
        </Cylinder>
      </Float>
      <Float speed={1.5}>
        <Cylinder args={[0.14, 0.12, 1.3, 16]} position={[0.75, 0.9, 0]} rotation={[0, 0, -0.1]}>
          <meshStandardMaterial color="#2a2a3a" metalness={0.3} roughness={0.6} emissive="#4ecdc4" emissiveIntensity={0.1} />
        </Cylinder>
      </Float>

      <Float speed={1}>
        <Cylinder args={[0.2, 0.17, 1.9, 16]} position={[-0.28, -1.3, 0]}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.6} emissive="#764ba2" emissiveIntensity={0.1} />
        </Cylinder>
      </Float>
      <Float speed={1}>
        <Cylinder args={[0.2, 0.17, 1.9, 16]} position={[0.28, -1.3, 0]}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.6} emissive="#764ba2" emissiveIntensity={0.1} />
        </Cylinder>
      </Float>
    </group>
  );
}

export default function BodyModel3D({ workoutData = [] }) {
  const highlightedMuscles = workoutData.map(w => w.targetMuscle);

  return (
    <div style={{ 
      width: '100%', 
      height: '650px', 
      background: 'linear-gradient(135deg, #1a0033 0%, #0f0520 50%, #1a1a3e 100%)',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 0 100px rgba(118,75,162,0.1)',
      position: 'relative'
    }}>
      <Canvas gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 1, 6]} />
        
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 15, 10]} angle={0.2} penumbra={1} intensity={2} color="#4fc3f7" castShadow />
        <spotLight position={[-10, 15, -5]} angle={0.2} penumbra={1} intensity={1.5} color="#ff6b6b" />
        <pointLight position={[0, 5, 5]} intensity={1.5} color="#ffe66d" />
        
        <HumanBody highlightedMuscles={highlightedMuscles} />
        
        <ContactShadows
          rotation-x={Math.PI / 2}
          position={[0, -2.7, 0]}
          opacity={0.6}
          width={10}
          height={10}
          blur={3}
          far={4}
          color="#667eea"
        />
        
        <Environment preset="night" />
        
        <EffectComposer>
          <Bloom intensity={1.2} luminanceThreshold={0.3} luminanceSmoothing={0.9} />
          <Vignette eskil={false} offset={0.1} darkness={0.5} />
        </EffectComposer>
        
        <OrbitControls 
          enableZoom={true} 
          minDistance={4}
          maxDistance={12}
          maxPolarAngle={Math.PI / 1.6}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      <div style={{
        position: 'absolute',
        top: '25px',
        left: '25px',
        color: 'white',
        background: 'linear-gradient(135deg, rgba(102,126,234,0.3) 0%, rgba(118,75,162,0.3) 100%)',
        backdropFilter: 'blur(20px)',
        padding: '20px',
        borderRadius: '16px',
        fontFamily: 'Arial',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', fontWeight: 'bold', color: '#4fc3f7' }}>
          ⚡ Active Muscle Groups
        </h3>
        {highlightedMuscles.length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: '20px', listStyle: 'none' }}>
            {[...new Set(highlightedMuscles)].map((muscle, idx) => (
              <li key={muscle} style={{ 
                marginBottom: '8px', 
                fontSize: '14px',
                animation: `fadeInUp 0.5s ease ${idx * 0.1}s both`
              }}>
                <span style={{ marginRight: '8px' }}>🔥</span>
                {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ margin: 0, fontStyle: 'italic', color: 'rgba(255,255,255,0.6)' }}>
            💤 No active workouts
          </p>
        )}
      </div>
    </div>
  );
}
