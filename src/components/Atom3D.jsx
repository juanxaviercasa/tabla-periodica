import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Torus, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Nucleus Component
const Nucleus = ({ protons, neutrons }) => {
  const particles = useMemo(() => {
    const arr = [];
    const radius = Math.pow(protons + neutrons, 1/3) * 0.4; // Scale radius based on particle count
    
    // Generate Protons (Green)
    for (let i = 0; i < protons; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.cbrt(Math.random()) * radius;
      arr.push({
        position: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        ],
        type: 'proton'
      });
    }
    
    // Generate Neutrons (Orange)
    for (let i = 0; i < neutrons; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.cbrt(Math.random()) * radius;
      arr.push({
        position: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        ],
        type: 'neutron'
      });
    }
    
    return arr;
  }, [protons, neutrons]);

  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.x += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <Sphere key={i} args={[0.3, 16, 16]} position={p.position}>
          <meshStandardMaterial 
            color={p.type === 'proton' ? '#4aff4a' : '#ffaa00'} 
            roughness={0.4} 
            metalness={0.1}
          />
        </Sphere>
      ))}
      <pointLight intensity={2} distance={10} color="#ffffff" />
    </group>
  );
};

// Orbit Component
const ElectronOrbit = ({ radius, numElectrons, speed, tiltX, tiltY }) => {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Rotate the entire orbit slightly for a 3D effect
      groupRef.current.rotation.z = clock.getElapsedTime() * speed * 0.5;
    }
  });

  const electrons = useMemo(() => {
    return Array.from({ length: numElectrons }).map((_, i) => {
      const angle = (i / numElectrons) * Math.PI * 2;
      return { angle };
    });
  }, [numElectrons]);

  return (
    <group rotation={[tiltX, tiltY, 0]}>
      {/* The Torus Ring */}
      <Torus args={[radius, 0.05, 16, 100]}>
        <meshStandardMaterial 
          color="#ffe600" 
          emissive="#ffe600"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </Torus>

      {/* The Electrons */}
      <group ref={groupRef}>
        {electrons.map((e, i) => (
          <Sphere 
            key={i} 
            args={[0.25, 16, 16]} 
            position={[Math.cos(e.angle) * radius, Math.sin(e.angle) * radius, 0]}
          >
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#fff566"
              emissiveIntensity={2}
            />
          </Sphere>
        ))}
      </group>
    </group>
  );
};

// Main Atom Component
export default function Atom3D({ z, mass, shells }) {
  const protons = z;
  const neutrons = Math.max(0, Math.round(mass) - z);

  // Default to 1 shell if config is invalid or empty
  const activeShells = shells && shells.length > 0 ? shells : [1];

  return (
    <div style={{ width: '100%', height: '100%', cursor: 'grab' }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Adds subtle background stars for depth */}
        <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
        
        <group>
          <Nucleus protons={protons} neutrons={neutrons} />
          
          {activeShells.map((numElectrons, i) => {
            const shellRadius = 3 + (i * 1.5);
            // Alternate tilts for a chaotic 3D look
            const tiltX = (Math.PI / 4) * (i % 2 === 0 ? 1 : -1) + (i * 0.2);
            const tiltY = (Math.PI / 6) * (i % 3 === 0 ? 1 : -1) - (i * 0.1);
            const speed = 0.5 - (i * 0.05); // Outer shells move slower
            
            return (
              <ElectronOrbit 
                key={i}
                radius={shellRadius}
                numElectrons={numElectrons}
                speed={speed > 0.1 ? speed : 0.1}
                tiltX={tiltX}
                tiltY={tiltY}
              />
            );
          })}
        </group>
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={true}
          minDistance={5}
          maxDistance={30}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
