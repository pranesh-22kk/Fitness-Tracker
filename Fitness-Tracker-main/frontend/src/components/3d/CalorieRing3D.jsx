import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text, 
  MeshDistortMaterial, 
  Sparkles, 
  Stars,
  Float,
  MeshWobbleMaterial,
  Sphere
} from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

function ParticleField() {
  const count = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#4fc3f7"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function AnimatedRing({ progress, color, radius, label, value, index }) {
  const ringRef = useRef();
  const textRef = useRef();
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.3 + index * 0.5;
    }
    if (textRef.current) {
      textRef.current.rotation.z = -state.clock.elapsedTime * 0.3 - index * 0.5;
    }
  });

  const curve = useMemo(() => {
    const points = [];
    const angle = (progress / 100) * Math.PI * 2;
    for (let i = 0; i <= 100; i++) {
      const t = (i / 100) * angle;
      points.push(new THREE.Vector3(
        Math.cos(t - Math.PI / 2) * radius,
        Math.sin(t - Math.PI / 2) * radius,
        0
      ));
    }
    return new THREE.CatmullRomCurve3(points);
  }, [progress, radius]);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={ringRef}>
        <mesh>
          <tubeGeometry args={[curve, 100, 0.2, 16, false]} />
          <MeshDistortMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.5}
            distort={0.3}
            speed={3}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        
        <Sphere args={[radius * 0.1, 32, 32]} position={[0, 0, 0.5]}>
          <MeshWobbleMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2}
            factor={0.5}
            speed={2}
            transparent
            opacity={0.7}
          />
        </Sphere>
        
        <Text
          ref={textRef}
          position={[0, 0, 0.5]}
          fontSize={0.9}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {value}
        </Text>
        <Text
          position={[0, -1.5, 0.5]}
          fontSize={0.35}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}

function Scene({ calories, protein, carbs, fat }) {
  const calorieProgress = Math.min((calories.consumed / calories.goal) * 100, 100);
  const proteinProgress = Math.min((protein.consumed / protein.goal) * 100, 100);
  const carbsProgress = Math.min((carbs.consumed / carbs.goal) * 100, 100);
  const fatProgress = Math.min((fat.consumed / fat.goal) * 100, 100);

  return (
    <>
      <color attach="background" args={['#050510']} />
      
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#4fc3f7" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#ff6b6b" />
      <spotLight position={[0, 20, 0]} intensity={1.5} angle={0.3} penumbra={1} color="#ffffff" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={100} scale={20} size={3} speed={0.4} color="#4fc3f7" />
      <ParticleField />
      
      <AnimatedRing 
        progress={calorieProgress} 
        color="#ff6b6b" 
        radius={4} 
        label="CALORIES"
        value={`${calories.consumed}/${calories.goal}`}
        index={0}
      />
      <AnimatedRing 
        progress={proteinProgress} 
        color="#4ecdc4" 
        radius={5.5} 
        label="PROTEIN"
        value={`${protein.consumed}g/${protein.goal}g`}
        index={1}
      />
      <AnimatedRing 
        progress={carbsProgress} 
        color="#ffe66d" 
        radius={7} 
        label="CARBS"
        value={`${carbs.consumed}g/${carbs.goal}g`}
        index={2}
      />
      <AnimatedRing 
        progress={fatProgress} 
        color="#a8e6cf" 
        radius={8.5} 
        label="FATS"
        value={`${fat.consumed}g/${fat.goal}g`}
        index={3}
      />
      
      <EffectComposer>
        <Bloom 
          intensity={1.5} 
          luminanceThreshold={0.2} 
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.001, 0.001]}
        />
      </EffectComposer>
      
      <OrbitControls 
        enableZoom={true}
        minDistance={10}
        maxDistance={25}
        autoRotate 
        autoRotateSpeed={0.3}
        enablePan={false}
      />
    </>
  );
}

export default function CalorieRing3D({ data }) {
  return (
    <div style={{ 
      width: '100%', 
      height: '600px', 
      background: 'linear-gradient(135deg, #0a0015 0%, #1a0033 50%, #0f0520 100%)',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 0 100px rgba(102,126,234,0.1)'
    }}>
      <Canvas camera={{ position: [0, 0, 18], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        <Scene 
          calories={data?.calories || { consumed: 1650, goal: 2000 }}
          protein={data?.protein || { consumed: 95, goal: 150 }}
          carbs={data?.carbs || { consumed: 210, goal: 250 }}
          fat={data?.fat || { consumed: 52, goal: 65 }}
        />
      </Canvas>
    </div>
  );
}
