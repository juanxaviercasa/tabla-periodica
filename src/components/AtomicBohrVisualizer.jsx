import React, { useState, useMemo } from "react";
import {
  Play,
  Pause,
  Layers,
  Sparkles,
  Info,
  RotateCcw,
  Zap,
  Atom
} from "lucide-react";

// Energy level labels (Bohr-Rydberg)
const SHELL_LETTERS = ["K", "L", "M", "N", "O", "P", "Q"];
const MAX_SHELL_CAPACITY = [2, 8, 18, 32, 50, 72, 98];

export function AtomicBohrVisualizer({
  element,
  protons: propProtons,
  neutrons: propNeutrons,
  electrons: propElectrons,
  shells: propShells,
  symbol: propSymbol,
  name: propName,
  netCharge: propNetCharge,
  interactive = true,
  showControls = true,
  className = ""
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedShellIdx, setSelectedShellIdx] = useState(null);
  const [showLetters, setShowLetters] = useState(false); // false = n=1, true = K, L, M

  // Resolved atomic parameters
  const z = propProtons !== undefined ? propProtons : element?.z || element?.number || 1;
  const standardMass = element ? parseFloat(element.atomic_mass || element.mass) || z * 2 : z * 2;
  const n = propNeutrons !== undefined ? propNeutrons : Math.max(0, Math.round(standardMass) - z);
  const e = propElectrons !== undefined ? propElectrons : element ? z : 1;
  const sym = propSymbol || element?.symbol || (z ? `Z=${z}` : "?");
  const elemName = propName || element?.name || "Átomo";
  const charge = propNetCharge !== undefined ? propNetCharge : z - e;

  // Resolved shells array
  const activeShells = useMemo(() => {
    if (propShells && propShells.length > 0) {
      return propShells;
    }
    if (element?.shells && element.shells.length > 0) {
      return element.shells;
    }
    // Fallback: fill shells up to 2, 8, 18, 32...
    let remaining = e;
    const shells = [];
    for (const cap of MAX_SHELL_CAPACITY) {
      if (remaining <= 0) break;
      const fill = Math.min(remaining, cap);
      shells.push(fill);
      remaining -= fill;
    }
    return shells.length > 0 ? shells : [0];
  }, [propShells, element, e]);

  const numShells = activeShells.length;
  const valenceShellIdx = numShells - 1;
  const valenceElectrons = activeShells[valenceShellIdx] || 0;

  // Geometry constants for 520x520 SVG canvas
  const cx = 260;
  const cy = 260;
  const nucleusRadius = Math.min(42, Math.max(28, 22 + Math.log2(Math.max(1, z)) * 4.5));
  const minOrbitR = nucleusRadius + 26;
  const maxOrbitR = 236;

  const orbitRadii = useMemo(() => {
    if (numShells <= 1) return [minOrbitR + 45];
    const step = (maxOrbitR - minOrbitR) / (numShells - 1);
    return activeShells.map((_, idx) => minOrbitR + idx * step);
  }, [numShells, activeShells, minOrbitR, maxOrbitR]);

  // Speeds per shell in seconds (inner shells orbit faster)
  const shellDurations = [6, 10, 15, 21, 28, 36, 45];

  return (
    <div className={`atomic-bohr-container ${className}`}>
      {/* Visualizer Top Bar / Controls */}
      {showControls && (
        <div className="bohr-toolbar">
          <div className="bohr-badge-left">
            <span className="bohr-title">
              <Atom size={14} /> Modelo Atómico de Bohr
            </span>
            <span className="bohr-subtitle">
              {sym} · {elemName} (Z={z}, A={z + n})
            </span>
          </div>

          <div className="bohr-actions-right">
            <button
              type="button"
              className="bohr-btn"
              onClick={() => setShowLetters((prev) => !prev)}
              title="Alternar entre números cuánticos (n=1,2..) y notación espectroscópica (K, L, M..)"
            >
              <Layers size={13} />
              <span>{showLetters ? "Notación n" : "Notación K-L-M"}</span>
            </button>

            <button
              type="button"
              className={`bohr-btn ${isPlaying ? "active" : ""}`}
              onClick={() => setIsPlaying((prev) => !prev)}
              title={isPlaying ? "Pausar rotación de órbitas" : "Reanudar rotación"}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span>{isPlaying ? "Pausar" : "Animar"}</span>
            </button>
          </div>
        </div>
      )}

      {/* SVG Canvas */}
      <div className="bohr-canvas-wrap">
        <svg
          viewBox="0 0 520 520"
          className="bohr-svg-viewport"
          aria-label={`Modelo atómico de Bohr para ${elemName}`}
        >
          <defs>
            {/* Soft outer glow filter for electrons */}
            <filter id="bohr-electron-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Valence Shell Glow */}
            <filter id="bohr-valence-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Nucleus radial gradient */}
            <radialGradient id="nucleus-gradient" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="60%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#881337" />
            </radialGradient>

            {/* Electron radial gradient */}
            <radialGradient id="electron-gradient" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </radialGradient>
          </defs>

          {/* Background concentric reference grids */}
          <circle cx={cx} cy={cy} r={nucleusRadius + 12} className="bohr-nucleus-halo" />

          {/* Concentric Bohr Orbits */}
          {activeShells.map((count, sIdx) => {
            const r = orbitRadii[sIdx];
            const isValence = sIdx === valenceShellIdx && numShells > 0;
            const isSelected = selectedShellIdx === sIdx;
            const duration = shellDurations[sIdx % shellDurations.length];
            const dir = sIdx % 2 === 0 ? 1 : -1;

            return (
              <g
                key={`shell-${sIdx}`}
                className={`bohr-orbit-group ${isValence ? "is-valence" : ""} ${isSelected ? "is-selected" : ""}`}
                onClick={() => setSelectedShellIdx(selectedShellIdx === sIdx ? null : sIdx)}
                style={{ cursor: interactive ? "pointer" : "default" }}
              >
                {/* Orbit Path Ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  className={`bohr-orbit-ring ${isValence ? "valence-ring" : ""}`}
                  filter={isValence ? "url(#bohr-valence-glow)" : undefined}
                />

                {/* Shell Quantum Label */}
                <text
                  x={cx}
                  y={cy - r - 7}
                  className="bohr-shell-tag"
                  textAnchor="middle"
                >
                  {showLetters
                    ? `${SHELL_LETTERS[sIdx] || `C${sIdx + 1}`} (${count}e⁻)`
                    : `n=${sIdx + 1} (${count}e⁻)`}
                </text>

                {/* Orbiting Electrons Group with SVG/CSS rotation */}
                <g
                  className="bohr-electrons-rotator"
                  style={{
                    transformOrigin: `${cx}px ${cy}px`,
                    animation: isPlaying
                      ? `bohrSpin ${duration}s linear infinite ${dir === -1 ? "reverse" : "normal"}`
                      : "none"
                  }}
                >
                  {Array.from({ length: count }).map((_, eIdx) => {
                    const angle = (2 * Math.PI * eIdx) / count - Math.PI / 2;
                    const ex = cx + r * Math.cos(angle);
                    const ey = cy + r * Math.sin(angle);
                    return (
                      <g key={`e-${sIdx}-${eIdx}`} className="bohr-electron-node">
                        {/* Outer Glow Circle */}
                        <circle
                          cx={ex}
                          cy={ey}
                          r={6.5}
                          fill="none"
                          stroke="rgba(56, 189, 248, 0.4)"
                          strokeWidth="1.5"
                        />
                        {/* Core Electron Sphere */}
                        <circle
                          cx={ex}
                          cy={ey}
                          r={4.2}
                          fill="url(#electron-gradient)"
                          filter="url(#bohr-electron-glow)"
                        />
                      </g>
                    );
                  })}
                </g>
              </g>
            );
          })}

          {/* Central Dense Nucleus */}
          <g
            className="bohr-nucleus-group"
            onClick={() => setSelectedShellIdx(null)}
            style={{ cursor: "pointer" }}
          >
            {/* Pulsing core aura */}
            <circle
              cx={cx}
              cy={cy}
              r={nucleusRadius + 6}
              className="bohr-nucleus-pulse"
            />

            {/* Nucleus Core Sphere */}
            <circle
              cx={cx}
              cy={cy}
              r={nucleusRadius}
              fill="url(#nucleus-gradient)"
              stroke="#fb7185"
              strokeWidth="2"
              className="bohr-nucleus-core"
            />

            {/* Central Symbol & Protons */}
            <text
              x={cx}
              y={cy - 2}
              className="bohr-nucleus-symbol"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {sym}
            </text>

            <text
              x={cx}
              y={cy + 13}
              className="bohr-nucleus-sub"
              textAnchor="middle"
            >
              {z}p⁺ {n > 0 ? `· ${n}n⁰` : ""}
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Shell Capacity Ribbon */}
      <div className="bohr-shells-ribbon">
        {activeShells.map((count, sIdx) => {
          const cap = MAX_SHELL_CAPACITY[sIdx] || (2 * (sIdx + 1) ** 2);
          const isVal = sIdx === valenceShellIdx;
          const isSelected = selectedShellIdx === sIdx;
          const letter = SHELL_LETTERS[sIdx] || `C${sIdx + 1}`;

          return (
            <button
              key={sIdx}
              type="button"
              className={`bohr-shell-pill ${isVal ? "is-valence" : ""} ${isSelected ? "selected" : ""}`}
              onClick={() => setSelectedShellIdx(selectedShellIdx === sIdx ? null : sIdx)}
              title={`Capa ${sIdx + 1} (${letter}): ${count} electrones de ${cap} máx (2n²)`}
            >
              <div className="pill-top">
                <span className="pill-level">{letter} (n={sIdx + 1})</span>
                {isVal && <span className="pill-val-tag">Valencia</span>}
              </div>
              <div className="pill-counts">
                <strong>{count}</strong>
                <span>/ {cap} e⁻</span>
              </div>
              <div className="pill-bar-track">
                <div
                  className="pill-bar-fill"
                  style={{ width: `${Math.min(100, (count / cap) * 100)}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Pedagogical Readout Box */}
      <div className="bohr-pedagogy-footer">
        <div className="bohr-stat-cell">
          <small>Electrones de Valencia:</small>
          <strong>
            {valenceElectrons} e⁻ en capa {SHELL_LETTERS[valenceShellIdx]} (n={numShells})
          </strong>
        </div>

        <div className="bohr-stat-cell">
          <small>Estado Eléctrico:</small>
          <strong>
            {charge === 0
              ? "Neutro (q = 0)"
              : charge > 0
              ? `Catión (+${charge})`
              : `Anión (${charge})`}
          </strong>
        </div>

        <div className="bohr-stat-cell">
          <small>Regla de Rydberg (2n²):</small>
          <span className="bohr-mono-text">
            [{activeShells.join(", ")}] de [{MAX_SHELL_CAPACITY.slice(0, numShells).join(", ")}]
          </span>
        </div>
      </div>
    </div>
  );
}
