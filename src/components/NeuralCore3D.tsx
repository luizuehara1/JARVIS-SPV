import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleSphere = ({ isConnected, isSpeaking, isConnecting, hasError }: { 
  isConnected: boolean; 
  isSpeaking: boolean; 
  isConnecting: boolean;
  hasError: boolean;
}) => {
  const pointsRef = useRef<any>(null);
  
  const particleCount = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2.5 + Math.random() * 0.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Rotation speed based on state
    let speed = 0.2;
    if (isConnecting) speed = 1.0;
    if (isConnected) speed = 0.4;
    if (isSpeaking) speed = 0.8;
    
    pointsRef.current.rotation.y = time * speed;
    pointsRef.current.rotation.x = time * speed * 0.5;

    // Pulse effect
    if (isSpeaking) {
      const scale = 1 + Math.sin(time * 15) * 0.1;
      pointsRef.current.scale.set(scale, scale, scale);
    } else {
      pointsRef.current.scale.set(1, 1, 1);
    }
  });

  const color = hasError ? "#ff4444" : isConnected ? "#00f2ff" : "#ffffff";

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={color}
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const NeuralRings = ({ isConnected, isSpeaking }: { isConnected: boolean; isSpeaking: boolean }) => {
  const ring1 = useRef<any>(null);
  const ring2 = useRef<any>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    ring1.current.rotation.z = time * 0.5;
    ring2.current.rotation.x = time * 0.3;
    ring2.current.rotation.y = time * 0.4;

    if (isSpeaking) {
      ring1.current.scale.setScalar(1 + Math.sin(time * 10) * 0.05);
    }
  });

  return (
    <group>
      <mesh ref={ring1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.2, 0.01, 16, 100]} />
        <meshBasicMaterial color="#00f2ff" transparent opacity={0.2} />
      </mesh>
      <mesh ref={ring2} rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[3.5, 0.005, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>
    </group>
  );
};

const CentralCore = ({ isConnected, isSpeaking, hasError }: { 
  isConnected: boolean; 
  isSpeaking: boolean;
  hasError: boolean;
}) => {
  const coreRef = useRef<any>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (isSpeaking) {
      coreRef.current.distort = 0.4 + Math.sin(time * 10) * 0.2;
      coreRef.current.speed = 4;
    } else {
      coreRef.current.distort = 0.2;
      coreRef.current.speed = 1;
    }
  });

  const coreColor = hasError ? "#ff0000" : isConnected ? "#00f2ff" : "#444444";

  return (
    <Sphere args={[1.2, 64, 64]} scale={isConnected ? 1.2 : 1}>
      <MeshDistortMaterial
        ref={coreRef}
        color={coreColor}
        roughness={0.1}
        metalness={1}
        distort={0.2}
        speed={1}
        transparent
        opacity={0.8}
        emissive={coreColor}
        emissiveIntensity={isConnected ? 2 : 0.5}
      />
    </Sphere>
  );
};

export const NeuralCore3D: React.FC<{
  isConnected: boolean;
  isSpeaking: boolean;
  isConnecting: boolean;
  error: string | null;
}> = ({ isConnected, isSpeaking, isConnecting, error }) => {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f2ff" />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <group>
            <ParticleSphere 
              isConnected={isConnected} 
              isSpeaking={isSpeaking} 
              isConnecting={isConnecting}
              hasError={!!error}
            />
            <NeuralRings isConnected={isConnected} isSpeaking={isSpeaking} />
            <CentralCore 
              isConnected={isConnected} 
              isSpeaking={isSpeaking}
              hasError={!!error}
            />
          </group>
        </Float>

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};
