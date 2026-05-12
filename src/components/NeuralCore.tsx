import { useFrame, useThree } from '@react-three/fiber';
import { motion } from 'motion/react';
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

interface NeuralCoreProps {
  active: boolean;
  volume: number;
  isThinking?: boolean;
}

export const NeuralCore: React.FC<NeuralCoreProps> = ({ active, volume, isThinking }) => {
  const mainCount = 3000;
  const shellCount = 1000;
  const mainPoints = useRef<THREE.Points>(null);
  const shellPoints = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const mainParticles = useMemo(() => {
    const temp = new Float32Array(mainCount * 3);
    for (let i = 0; i < mainCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 3; // Lighter/Bigger core
      temp[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      temp[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      temp[i * 3 + 2] = r * Math.cos(phi);
    }
    return temp;
  }, [mainCount]);

  const shellParticles = useMemo(() => {
    const temp = new Float32Array(shellCount * 3);
    for (let i = 0; i < shellCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const r = 4.5 + Math.random() * 0.5;
        temp[i * 3] = r * Math.cos(theta);
        temp[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
        temp[i * 3 + 2] = r * Math.sin(theta);
    }
    return temp;
  }, [shellCount]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (mainPoints.current) {
        const positionAttribute = mainPoints.current.geometry.getAttribute('position');
        const positions = positionAttribute.array as Float32Array;
    
        for (let i = 0; i < mainCount; i++) {
          const i3 = i * 3;
          const x = positions[i3];
          const y = positions[i3 + 1];
          const z = positions[i3 + 2];
    
          const angle = 0.001 * (active ? 3 : 1);
          positions[i3] = x * Math.cos(angle) - z * Math.sin(angle);
          positions[i3 + 2] = x * Math.sin(angle) + z * Math.cos(angle);
    
          if (active && volume > 0.01) {
            const factor = 1 + Math.sin(time * 15 + i) * volume * 0.4;
            positions[i3] *= factor;
            positions[i3 + 1] *= factor;
            positions[i3 + 2] *= factor;
          }
          
          if (isThinking) {
            const pulse = 1 + Math.sin(time * 20) * 0.02;
            positions[i3] *= pulse;
            positions[i3 + 1] *= pulse;
            positions[i3 + 2] *= pulse;
          }
        }
        positionAttribute.needsUpdate = true;
        mainPoints.current.rotation.y += 0.002;
    }

    if (shellPoints.current) {
        shellPoints.current.rotation.y -= 0.005;
        shellPoints.current.rotation.x = Math.sin(time * 0.5) * 0.2;
    }
  });

  return (
    <group>
      {/* Main Neural Core */}
      <points ref={mainPoints}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={mainCount}
            array={mainParticles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color={isThinking ? "#00f2ff" : (active ? "#00f2ff" : "#005577")}
          transparent
          opacity={isThinking ? 0.8 : 0.4}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Holographic Orbit Shell */}
      <points ref={shellPoints}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={shellCount}
            array={shellParticles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#00f2ff"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Center Glow Glow */}
      <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial 
            color="#00f2ff" 
            transparent 
            opacity={isThinking ? 0.1 : 0.05} 
            blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
