import React, { Component, useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { Play, Pause, Eye, EyeOff, RotateCcw, Sparkles, Orbit } from "lucide-react";

// Error Boundary for WebGL/Three.js context safety
export class AtomErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("AtomViewer3D WebGL fallback triggered:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="atom-loading-box">
          <p>Vista 3D atómica no disponible en este dispositivo (modo compatibilidad)</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Shell label names K, L, M, N, O, P, Q
const SHELL_NAMES = ["K", "L", "M", "N", "O", "P", "Q"];

// Fixed symmetrical 3D tilt orientations for each shell (pitch, yaw, roll)
const SHELL_TILTS = [
  [0.15, 0.1, 0.05],
  [Math.PI / 4, Math.PI / 6, 0.2],
  [-Math.PI / 3, Math.PI / 4, -0.3],
  [Math.PI / 5, -Math.PI / 3, 0.4],
  [-Math.PI / 4, -Math.PI / 5, -0.5],
  [Math.PI / 3, Math.PI / 5, 0.6],
  [-Math.PI / 5, Math.PI / 3, -0.4]
];

// Volumetric 3D Nucleus Component with GPU Instancing & Memory Disposal
function VolumetricNucleus({ z, mass, isPaused }) {
  const protons = z;
  const neutrons = Math.max(0, Math.round(mass) - z);
  const total = protons + neutrons;

  // Optimize visible sample count for constant 60fps while maintaining exact p/n ratio
  const sampleCount = useMemo(() => {
    if (total <= 35) return Math.max(total, 1);
    return Math.min(48, Math.max(28, Math.round(Math.pow(total, 0.75))));
  }, [total]);

  const pCount = useMemo(() => {
    if (total <= 35) return protons;
    return Math.round((protons / (total || 1)) * sampleCount);
  }, [protons, total, sampleCount]);

  const { pPositions, nPositions } = useMemo(() => {
    const list = [];
    const radius = Math.max(0.65, Math.pow(sampleCount, 1 / 3) * 0.38);

    for (let i = 0; i < sampleCount; i++) {
      const isProton = i < pCount;
      const r = radius * Math.cbrt((i + 0.5) / sampleCount);
      const phi = Math.acos(1 - (2 * (i + 0.5)) / sampleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const zPos = r * Math.cos(phi);

      list.push({ pos: [x, y, zPos], isProton });
    }

    list.sort(() => Math.random() - 0.5);
    return {
      pPositions: list.filter((item) => item.isProton).map((item) => item.pos),
      nPositions: list.filter((item) => !item.isProton).map((item) => item.pos)
    };
  }, [sampleCount, pCount]);

  const pMeshRef = useRef();
  const nMeshRef = useRef();
  const groupRef = useRef();

  // GPU instanced matrices update
  useEffect(() => {
    const dummy = new THREE.Object3D();
    if (pMeshRef.current && pPositions.length > 0) {
      pPositions.forEach((pos, i) => {
        dummy.position.set(pos[0], pos[1], pos[2]);
        dummy.updateMatrix();
        pMeshRef.current.setMatrixAt(i, dummy.matrix);
      });
      pMeshRef.current.instanceMatrix.needsUpdate = true;
    }
    if (nMeshRef.current && nPositions.length > 0) {
      nPositions.forEach((pos, i) => {
        dummy.position.set(pos[0], pos[1], pos[2]);
        dummy.updateMatrix();
        nMeshRef.current.setMatrixAt(i, dummy.matrix);
      });
      nMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [pPositions, nPositions]);

  useFrame((_, delta) => {
    if (groupRef.current && !isPaused) {
      groupRef.current.rotation.y += delta * 0.4;
      groupRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central warm glow light originating inside the nucleus */}
      <pointLight intensity={2.5} distance={7} color="#ffffff" />
      <pointLight intensity={1.2} distance={5} color="#22c55e" />

      {pPositions.length > 0 && (
        <instancedMesh ref={pMeshRef} args={[null, null, pPositions.length]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial
            color="#22c55e"
            roughness={0.3}
            metalness={0.25}
            emissive="#15803d"
            emissiveIntensity={0.35}
          />
        </instancedMesh>
      )}

      {nPositions.length > 0 && (
        <instancedMesh ref={nMeshRef} args={[null, null, nPositions.length]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial
            color="#f59e0b"
            roughness={0.35}
            metalness={0.2}
            emissive="#b45309"
            emissiveIntensity={0.25}
          />
        </instancedMesh>
      )}
    </group>
  );
}

// Single Electron Orbit Layer (Bohr Mode) with GPU Instancing for Electrons
function SpatialElectronOrbit({
  levelIndex,
  radius,
  electronCount,
  tilt,
  isPaused,
  showLabels
}) {
  const electronsGroupRef = useRef();
  const instancedElectronsRef = useRef();

  // Speed inversely proportional to shell level (inner shells fast, outer slower)
  const speed = 1.4 / Math.pow(levelIndex + 1, 0.75);

  useFrame((_, delta) => {
    if (electronsGroupRef.current && !isPaused) {
      electronsGroupRef.current.rotation.z += delta * speed;
    }
  });

  // Evenly spaced angles for electrons on this ring
  const electronPositions = useMemo(() => {
    return Array.from({ length: electronCount }).map((_, i) => {
      const angle = (i / electronCount) * Math.PI * 2;
      return [Math.cos(angle) * radius, Math.sin(angle) * radius, 0];
    });
  }, [electronCount, radius]);

  useEffect(() => {
    if (instancedElectronsRef.current && electronPositions.length > 0) {
      const dummy = new THREE.Object3D();
      electronPositions.forEach((pos, i) => {
        dummy.position.set(pos[0], pos[1], pos[2]);
        dummy.updateMatrix();
        instancedElectronsRef.current.setMatrixAt(i, dummy.matrix);
      });
      instancedElectronsRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [electronPositions]);

  const shellLabel = SHELL_NAMES[levelIndex] || `n=${levelIndex + 1}`;

  return (
    <group rotation={tilt}>
      {/* Luminous orbital ring track */}
      <mesh>
        <torusGeometry args={[radius, 0.032, 16, 80]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.5}
          transparent
          opacity={0.4}
          roughness={0.2}
        />
      </mesh>

      {/* Orbiting glowing electrons via InstancedMesh for 60 FPS */}
      <group ref={electronsGroupRef}>
        <instancedMesh
          ref={instancedElectronsRef}
          args={[null, null, electronPositions.length]}
        >
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#fef08a"
            emissiveIntensity={2.8}
            roughness={0.1}
            metalness={0.1}
          />
        </instancedMesh>
      </group>

      {/* Floating 3D Shell Marker */}
      {showLabels && (
        <group position={[radius * 0.95, radius * 0.3, 0]}>
          <Html center distanceFactor={16} zIndexRange={[100, 0]}>
            <div className="orbit-html-badge">
              <strong>{shellLabel}</strong>
              <span>{electronCount}e⁻</span>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

// Quantum Cloud Mode (Wave-Mechanical probability density orbitals)
function QuantumCloudOrbitals({ shells, isPaused }) {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current && !isPaused) {
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.z += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {shells.map((count, i) => {
        const radius = 2.4 + i * 1.35;
        const opacity = Math.max(0.12, 0.35 - i * 0.035);
        return (
          <group key={i}>
            <mesh>
              <sphereGeometry args={[radius, 32, 32]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? "#38bdf8" : "#818cf8"}
                emissive={i % 2 === 0 ? "#0284c7" : "#4f46e5"}
                emissiveIntensity={0.3}
                transparent
                opacity={opacity}
                roughness={0.6}
              />
            </mesh>
            {/* Shimmering particle points inside orbital cloud */}
            {Array.from({ length: Math.min(count * 3, 28) }).map((_, j) => {
              const theta = Math.random() * Math.PI * 2;
              const phi = Math.acos(2 * Math.random() - 1);
              const r = radius * (0.85 + Math.random() * 0.3);
              return (
                <mesh
                  key={j}
                  position={[
                    r * Math.sin(phi) * Math.cos(theta),
                    r * Math.sin(phi) * Math.sin(theta),
                    r * Math.cos(phi)
                  ]}
                >
                  <sphereGeometry args={[0.07, 8, 8]} />
                  <meshBasicMaterial color="#fef08a" transparent opacity={0.7} />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
}

// Inner Scene Container
function AtomScene({
  element,
  shells,
  isPaused,
  showLabels,
  modelMode,
  controlsRef
}) {
  const z = element.number || element.z;
  const mass = parseFloat(element.atomic_mass || element.mass) || z * 2;

  // Compute camera distance adaptively according to number of shells
  const maxRadius = useMemo(() => {
    return 2.6 + (shells.length - 1) * 1.35;
  }, [shells]);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[12, 15, 10]} intensity={1.4} />
      <directionalLight position={[-12, -10, -10]} intensity={0.6} color="#93c5fd" />

      {/* Volumetric 3D Nucleus with GPU Instancing */}
      <VolumetricNucleus z={z} mass={mass} isPaused={isPaused} />

      {/* Orbital Representation: Bohr vs Quantum Cloud */}
      {modelMode === "bohr" ? (
        <group>
          {shells.map((count, i) => {
            const shellRadius = 2.6 + i * 1.35;
            const tilt = SHELL_TILTS[i % SHELL_TILTS.length];
            return (
              <SpatialElectronOrbit
                key={i}
                levelIndex={i}
                radius={shellRadius}
                electronCount={count}
                tilt={tilt}
                isPaused={isPaused}
                showLabels={showLabels}
              />
            );
          })}
        </group>
      ) : (
        <QuantumCloudOrbitals shells={shells} isPaused={isPaused} />
      )}

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={3.5}
        maxDistance={Math.max(38, maxRadius * 3.8)}
        autoRotate={!isPaused}
        autoRotateSpeed={0.5}
        makeDefault
      />
    </>
  );
}

// Main Interactive AtomViewer3D Component
export default function AtomViewer3D({ element }) {
  const [isPaused, setIsPaused] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [modelMode, setModelMode] = useState("bohr"); // 'bohr' | 'cloud'
  const controlsRef = useRef();

  // Parse exact shells array (defaulting safely to element.shells)
  const shells = useMemo(() => {
    if (!element) return [1];
    if (Array.isArray(element.shells) && element.shells.length > 0) {
      return element.shells;
    }
    return [1];
  }, [element]);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const totalElectrons = useMemo(() => {
    return shells.reduce((a, b) => a + b, 0);
  }, [shells]);

  const cameraConfig = useMemo(() => {
    const maxR = 2.6 + (shells.length - 1) * 1.35;
    const zDist = Math.max(16, maxR * 2.35);
    const yDist = Math.min(5, 2.5 + shells.length * 0.35);
    return {
      position: [0, yDist, zDist],
      fov: 42
    };
  }, [shells]);

  if (!element) return null;

  return (
    <div className="atom-viewer-3d-wrapper">
      {/* 3D Interactive Canvas with cleanup on unmount */}
      <div className="atom-canvas-stage">
        <AtomErrorBoundary>
          <Canvas
            camera={cameraConfig}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            onCreated={({ gl }) => {
              // Proper pixel ratio clamping to preserve GPU memory on retina displays
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            }}
          >
            <AtomScene
              element={element}
              shells={shells}
              isPaused={isPaused}
              showLabels={showLabels}
              modelMode={modelMode}
              controlsRef={controlsRef}
            />
          </Canvas>
        </AtomErrorBoundary>
      </div>

      {/* Floating Modern Interactive Control Bar */}
      <div className="atom-viewer-toolbar" role="toolbar" aria-label="Controles del visor 3D">
        <div className="toolbar-group">
          <button
            type="button"
            className={`toolbar-btn ${isPaused ? "active" : ""}`}
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? "Reanudar rotación orbital" : "Pausar animación"}
            aria-label={isPaused ? "Reanudar animación" : "Pausar animación"}
          >
            {isPaused ? <Play size={15} /> : <Pause size={15} />}
            <span>{isPaused ? "Reanudar" : "Pausar"}</span>
          </button>

          <button
            type="button"
            className={`toolbar-btn ${showLabels ? "active" : ""}`}
            onClick={() => setShowLabels(!showLabels)}
            title="Mostrar u ocultar etiquetas de capas K, L, M..."
            aria-label="Alternar etiquetas cuánticas"
          >
            {showLabels ? <Eye size={15} /> : <EyeOff size={15} />}
            <span>Etiquetas</span>
          </button>

          <button
            type="button"
            className={`toolbar-btn ${modelMode === "cloud" ? "mode-cloud" : "mode-bohr"}`}
            onClick={() => setModelMode(modelMode === "bohr" ? "cloud" : "bohr")}
            title="Alternar entre Modelo clásico de Bohr y Nube cuántica (REEMPE)"
            aria-label="Alternar modelo físico"
          >
            {modelMode === "bohr" ? <Orbit size={15} /> : <Sparkles size={15} />}
            <span>{modelMode === "bohr" ? "Bohr (Órbitas)" : "Nube Cuántica"}</span>
          </button>

          <button
            type="button"
            className="toolbar-btn icon-only"
            onClick={handleResetCamera}
            title="Centrar vista 3D"
            aria-label="Centrar vista"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        {/* Real-time Quantum Configuration Badge */}
        <div className="atom-distribution-badge">
          <span className="dist-label">Distribución Cuántica:</span>
          <span className="dist-formula">
            {shells.map((count, idx) => (
              <span key={idx} className="dist-shell">
                <small>{SHELL_NAMES[idx] || idx + 1}</small>
                <b>{count}</b>
              </span>
            ))}
          </span>
          <span className="dist-total">({totalElectrons}e⁻)</span>
        </div>
      </div>
    </div>
  );
}
