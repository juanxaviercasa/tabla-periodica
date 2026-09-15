import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Atom,
  CheckCircle,
  CheckCircle2,
  Minus,
  Plus,
  Scale,
  Sparkles,
  Zap,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Award,
  HelpCircle,
  Flame,
  Layers,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { elements118 } from "./data.js";
import { isotopesData } from "./data/isotopesData.js";
import { misconceptionsData } from "./data/misconceptionsData.js";
import { MisconceptionsGuideModal } from "./components/MisconceptionsGuideModal.jsx";
import { AtomicBohrVisualizer } from "./components/AtomicBohrVisualizer.jsx";
import { IonizationQuantumJumpWidget } from "./components/IonizationQuantumJumpWidget.jsx";

// Pre-university admission challenge list for active inquiry
const admissionChallenges = [
  {
    id: 1,
    title: "Catión Sodio Isoelectrónico con el Neón",
    prompt: "Construye el catión sodio monovalente (²³₁₁Na⁺): 11 protones, 12 neutrones y 10 electrones.",
    target: { p: 11, n: 12, e: 10 },
    concept: "Especies isoelectrónicas y cationes: el Na⁺ pierde 1 e⁻ quedando con 10 e⁻ como el Neón.",
    exam: "UNI / San Marcos"
  },
  {
    id: 2,
    title: "Anión Sulfuro Divalente",
    prompt: "Construye el anión sulfuro (³²₁₆S²⁻): 16 protones, 16 neutrones y 18 electrones.",
    target: { p: 16, n: 16, e: 18 },
    concept: "Aniones y expansión de radio: al ganar 2 e⁻ la repulsión interelectrónica expande el radio (r(S²⁻) > r(S)).",
    exam: "UNMSM"
  },
  {
    id: 3,
    title: "Radioisótopo Carbono-14",
    prompt: "Construye el isótopo inestable de Carbono-14 (¹⁴₆C): 6 protones, 8 neutrones y 6 electrones neutros.",
    target: { p: 6, n: 8, e: 6 },
    concept: "Inestabilidad nuclear: N/Z = 8/6 = 1.33 excede la estabilidad ligera (N/Z=1), emitiendo radiación beta (β⁻).",
    exam: "Química Nuclear UNI"
  },
  {
    id: 4,
    title: "Catión Férrico Paramagnético",
    prompt: "Construye el catión férrico (⁵⁶₂₆Fe³⁺): 26 protones, 30 neutrones y 23 electrones.",
    target: { p: 26, n: 30, e: 23 },
    concept: "Ionización de metales de transición: el Fe pierde los 2 electrones 4s y 1 electrón 3d, quedando [Ar] 3d⁵.",
    exam: "UNI / San Marcos"
  },
  {
    id: 5,
    title: "Partícula Alfa Neutra (Helio-4)",
    prompt: "Construye el átomo neutro de Helio-4 (⁴₂He): 2 protones, 2 neutrones y 2 electrones.",
    target: { p: 2, n: 2, e: 2 },
    concept: "Estabilidad máxima nuclear: núcleo par-par con N=2 y Z=2 (números mágicos de nucleones).",
    exam: "Física y Química Nuclear"
  }
];

const presets = [
  { name: "Hidrógeno-1", symbol: "H", p: 1, n: 0, e: 1 },
  { name: "Helio-4", symbol: "He", p: 2, n: 2, e: 2 },
  { name: "Carbono-12", symbol: "C", p: 6, n: 6, e: 6 },
  { name: "Sodio-23", symbol: "Na", p: 11, n: 12, e: 11 },
  { name: "Cloro-35", symbol: "Cl", p: 17, n: 18, e: 17 },
  { name: "Hierro-56", symbol: "Fe", p: 26, n: 30, e: 26 }
];

// Evaluates nuclear stability based on N/Z band of stability
function evaluateNuclearStability(p, n) {
  if (p === 0) return { stable: false, ratio: 0, reason: "Sin protones en el núcleo" };
  if (p === 1 && n === 0) return { stable: true, ratio: 0, reason: "Protio estable (único núcleo sin neutrones)" };
  if (p === 1 && n === 1) return { stable: true, ratio: 1.0, reason: "Deuterio estable" };
  if (p === 1 && n >= 2) return { stable: false, ratio: n / p, reason: "Tritio inestable (emisión β⁻)" };

  const ratio = n / p;

  if (p <= 20) {
    if (ratio >= 0.95 && ratio <= 1.15) {
      return { stable: true, ratio, reason: "Cinturón de estabilidad: N/Z ≈ 1.0 para núcleos ligeros (Z ≤ 20)" };
    } else if (ratio > 1.15) {
      return { stable: false, ratio, reason: "Inestable por exceso de neutrones (desintegración por emisión β⁻)" };
    } else {
      return { stable: false, ratio, reason: "Inestable por déficit de neutrones (desintegración por emisión β⁺ o captura electrónica)" };
    }
  } else {
    if (ratio >= 1.15 && ratio <= 1.55) {
      return { stable: true, ratio, reason: "Cinturón de estabilidad: N/Z ≈ 1.25 a 1.50 para núcleos medianos y pesados" };
    } else if (ratio > 1.55) {
      return { stable: false, ratio, reason: "Inestable por exceso de neutrones (emisor beta β⁻)" };
    } else {
      return { stable: false, ratio, reason: "Inestable por exceso de protones (emisor alfa α o captura e⁻)" };
    }
  }
}

export default function LabPage() {
  const [searchParams] = useSearchParams();
  const querySym = searchParams.get("sym") || searchParams.get("elemento");
  const queryTab = searchParams.get("tab");

  const initialTab =
    queryTab === "isotopes"
      ? "isotopes"
      : queryTab === "jump" || queryTab === "ionizations"
      ? "jump"
      : "builder";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showMisconceptionsModal, setShowMisconceptionsModal] = useState(false);

  useEffect(() => {
    const handleSwitch = (e) => {
      if (e.detail) setActiveTab(e.detail);
    };
    window.addEventListener("switch-lab-tab", handleSwitch);
    return () => window.removeEventListener("switch-lab-tab", handleSwitch);
  }, []);

  // Mode 1: Atom Builder State
  const [protons, setProtons] = useState(11);
  const [neutrons, setNeutrons] = useState(12);
  const [electrons, setElectrons] = useState(11);
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);

  // Mode 2: Isotopes & Atomic Mass State
  const [selectedIsoSym, setSelectedIsoSym] = useState("Cl");
  const [customAbundance, setCustomAbundance] = useState(null);

  // Current element identification based on Z = protons
  const currentElement = useMemo(() => {
    if (protons < 1) return null;
    return elements118.find((e) => e.number === protons) || null;
  }, [protons]);

  // Mass number A and net charge
  const massNumber = protons + neutrons;
  const netCharge = protons - electrons;

  // Nuclear stability
  const stabilityInfo = useMemo(() => {
    return evaluateNuclearStability(protons, neutrons);
  }, [protons, neutrons]);

  // Shell electron distribution (Bohr rule 2, 8, 18, 32...)
  const shellDistribution = useMemo(() => {
    let remaining = electrons;
    const maxCaps = [2, 8, 18, 32, 50, 72, 98];
    const shells = [];
    for (let cap of maxCaps) {
      if (remaining <= 0) break;
      const fill = Math.min(remaining, cap);
      shells.push(fill);
      remaining -= fill;
    }
    return shells.length > 0 ? shells : [0];
  }, [electrons]);

  // Current Challenge check
  const currentChallenge = admissionChallenges[activeChallengeIdx];
  const isChallengeMet = useMemo(() => {
    if (!currentChallenge) return false;
    const t = currentChallenge.target;
    return protons === t.p && neutrons === t.n && electrons === t.e;
  }, [currentChallenge, protons, neutrons, electrons]);

  useEffect(() => {
    if (queryTab === "isotopes") {
      setActiveTab("isotopes");
    } else if (queryTab === "builder") {
      setActiveTab("builder");
    } else if (queryTab === "ionization") {
      setActiveTab("ionization");
    }

    if (querySym) {
      const match = elements118.find(
        (e) => e.symbol.toLowerCase() === querySym.toLowerCase() || String(e.number) === querySym
      );
      if (match) {
        const p = match.number;
        const massVal = parseFloat(match.mass || match.atomic_mass) || p * 2;
        const n = Math.max(0, Math.round(massVal) - p);
        setProtons(p);
        setNeutrons(n);
        setElectrons(p);

        if (isotopesData[match.symbol]) {
          setSelectedIsoSym(match.symbol);
        }
      }
    }
  }, [querySym, queryTab]);

  const loadElement = (symbol) => {
    const match = elements118.find((e) => e.symbol === symbol);
    if (!match) return;
    const p = match.number;
    const massVal = parseFloat(match.mass || match.atomic_mass) || p * 2;
    const n = Math.max(0, Math.round(massVal) - p);
    setProtons(p);
    setNeutrons(n);
    setElectrons(p);
    if (isotopesData[match.symbol]) {
      setSelectedIsoSym(match.symbol);
    }
  };

  const loadPreset = (p, n, e) => {
    setProtons(p);
    setNeutrons(n);
    setElectrons(e);
  };

  const setBounded = (setter, val, min = 0, max = 118) => {
    setter(Math.max(min, Math.min(max, val)));
  };

  // Mode 2: Isotopes calculation
  const isotopeData = isotopesData[selectedIsoSym] || isotopesData["Cl"];
  const currentAbundances = useMemo(() => {
    if (customAbundance && customAbundance.symbol === selectedIsoSym) {
      return customAbundance.values;
    }
    return isotopeData.isotopes.map((iso) => iso.abundance_pct);
  }, [isotopeData, customAbundance, selectedIsoSym]);

  // Live average atomic mass calculation with custom or real abundances
  const calculatedAverageMass = useMemo(() => {
    let sum = 0;
    let totalPct = 0;
    isotopeData.isotopes.forEach((iso, idx) => {
      const pct = currentAbundances[idx] ?? iso.abundance_pct;
      sum += iso.mass_u * pct;
      totalPct += pct;
    });
    if (totalPct === 0) return 0;
    return sum / totalPct;
  }, [isotopeData, currentAbundances]);

  const handleAbundanceChange = (idx, newPct) => {
    const nextValues = [...currentAbundances];
    const otherIdx = idx === 0 ? 1 : 0;
    const clampedNew = Math.max(0, Math.min(100, parseFloat(newPct) || 0));
    nextValues[idx] = clampedNew;
    if (isotopeData.isotopes.length === 2) {
      nextValues[otherIdx] = parseFloat((100 - clampedNew).toFixed(2));
    }
    setCustomAbundance({
      symbol: selectedIsoSym,
      values: nextValues
    });
  };

  const resetIsotopes = () => {
    setCustomAbundance(null);
  };

  return (
    <main className="lab-page-redesigned">
      {/* Top Breadcrumb & Nav */}
      <div className="lab-page-topbar">
        <Link className="back-button" to="/">
          <ArrowLeft size={16} /> Volver a la Tabla Periódica
        </Link>
        <span className="lab-system-badge">
          <Sparkles size={14} /> Laboratorio Activo de Aprendizaje · PhET Framework
        </span>
        <button
          type="button"
          className="lab-topbar-guide-btn"
          onClick={() => setShowMisconceptionsModal(true)}
          title="Ver los 6 conceptos erróneos clásicos de examen (RSC)"
        >
          <ShieldAlert size={14} /> 6 Trampas de Examen (RSC)
        </button>
      </div>

      {/* Hero Header */}
      <header className="lab-hero-section">
        <div className="lab-hero-text">
          <span className="eyebrow">Didáctica Activa e Indagación Experimental</span>
          <h1>Laboratorio Interactivo de Estructura Atómica e Isótopos</h1>
          <p>
            Modela átomos, experimenta con iones, evalúa la estabilidad nuclear y descubre por qué las masas
            atómicas de la tabla periódica presentan decimales.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="lab-nav-tabs">
          <button
            type="button"
            className={`lab-tab-pill ${activeTab === "builder" ? "active" : ""}`}
            onClick={() => setActiveTab("builder")}
          >
            <Atom size={18} />
            <span>1. Constructor de Átomos e Iones</span>
          </button>
          <button
            type="button"
            className={`lab-tab-pill ${activeTab === "isotopes" ? "active" : ""}`}
            onClick={() => setActiveTab("isotopes")}
          >
            <Scale size={18} />
            <span>2. Isótopos y Masa Ponderada</span>
          </button>
          <button
            type="button"
            className={`lab-tab-pill ${activeTab === "ionization" ? "active" : ""}`}
            onClick={() => setActiveTab("ionization")}
          >
            <Zap size={18} />
            <span>3. Salto Cuántico (Ionización)</span>
          </button>
        </div>

      </header>

      {/* =========================================================================
          TAB 1: CONSTRUCTOR DE ÁTOMOS E IONES (PhET BUILD-AN-ATOM)
          ========================================================================= */}
      {activeTab === "builder" && (
        <section className="lab-mode-container builder-mode">
          {/* Main Dual Workbench */}
          <div className="builder-dual-grid">
            {/* STAGE LEFT: Visual Atom, Nuclide Symbol & Real-Time Readout */}
            <div className="builder-stage-card">
              <div className="stage-top-header">
                <span className="stage-label">Representación Visual en Tiempo Real</span>
                <span className={`charge-badge ${netCharge === 0 ? "neutral" : netCharge > 0 ? "cation" : "anion"}`}>
                  {netCharge === 0
                    ? "Átomo Neutro (q = 0)"
                    : netCharge > 0
                    ? `Catión (+${netCharge})`
                    : `Anión (${netCharge})`}
                </span>
              </div>

              {/* Graphic Vectorial Bohr Atom Stage */}
              <div className="lab-bohr-stage-wrapper">
                <AtomicBohrVisualizer
                  protons={protons}
                  neutrons={neutrons}
                  electrons={electrons}
                  shells={shellDistribution}
                  symbol={currentElement?.symbol || (protons ? `Z=${protons}` : "?")}
                  name={currentElement?.name || "Átomo en Laboratorio"}
                  netCharge={netCharge}
                  interactive={true}
                  showControls={true}
                />
              </div>


              {/* Nuclide Box IUPAC Notation: A Z X q */}
              <div className="nuclide-symbol-inspector">
                <div className="nuclide-symbol-block">
                  <div className="nuclide-left-col">
                    <span className="nuclide-mass-a" title="Número de masa A = protones + neutrones">
                      A = {massNumber}
                    </span>
                    <span className="nuclide-atomic-z" title="Número atómico Z = protones">
                      Z = {protons}
                    </span>
                  </div>
                  <strong className="nuclide-center-sym">
                    {currentElement?.symbol || "X"}
                  </strong>
                  <div className="nuclide-right-col">
                    <span className="nuclide-charge-q" title="Carga neta q = protones - electrones">
                      {netCharge === 0 ? "0" : netCharge > 0 ? `+${netCharge}` : `${netCharge}`}
                    </span>
                  </div>
                </div>

                <div className="nuclide-specs-list">
                  <div className="spec-item">
                    <small>Elemento:</small>
                    <strong>{currentElement?.name || "No definido"}</strong>
                  </div>
                  <div className="spec-item">
                    <small>Familia:</small>
                    <strong>{currentElement?.family || "—"}</strong>
                  </div>
                  <div className="spec-item">
                    <small>Distribución:</small>
                    <code>[{shellDistribution.join(", ")}]</code>
                  </div>
                </div>
              </div>

              {/* Nuclear Stability Indicator Bar */}
              <div className={`nuclear-stability-card ${stabilityInfo.stable ? "stable-box" : "unstable-box"}`}>
                <div className="stability-header-row">
                  <div className="stability-title">
                    {stabilityInfo.stable ? (
                      <CheckCircle2 size={17} className="text-emerald" />
                    ) : (
                      <AlertTriangle size={17} className="text-crimson" />
                    )}
                    <strong>{stabilityInfo.stable ? "Núcleo Estable" : "Núcleo Radiactivo / Inestable"}</strong>
                  </div>
                  <span className="ratio-tag">Relación N/Z = {stabilityInfo.ratio.toFixed(2)}</span>
                </div>
                <p>{stabilityInfo.reason}</p>
              </div>

              {/* Ionic Radius Rationale Box (Chemical Misconception Solved) */}
              <div className="radius-rationale-box">
                <span className="rationale-kicker">Comportamiento del Radio Atómico vs Iónico:</span>
                <p>
                  {netCharge === 0
                    ? "Al estar en equilibrio electrostático (p⁺ = e⁻), el radio atómico depende del balance entre Zeff y las capas ocupadas."
                    : netCharge > 0
                    ? `Al perder ${netCharge}e⁻, los protones restantes atraen la nube electrónica con mayor fuerza, contrayendo el radio: r(catión) < r(neutro).`
                    : `Al ganar ${Math.abs(netCharge)}e⁻, la repulsión mutua entre electrones expande la nube: r(anión) > r(neutro).`}
                </p>
              </div>
            </div>

            {/* STAGE RIGHT: Particle Controls, Presets & Admission Challenges */}
            <div className="builder-controls-column">
              {/* Particle Steppers */}
              <div className="stepper-panel-card">
                <h3>Control de Partículas Subatómicas</h3>

                {/* Protons */}
                <div className="particle-stepper-row row-protons">
                  <div className="stepper-label-group">
                    <strong>Protones (p⁺)</strong>
                    <small>Define la identidad química (Z)</small>
                  </div>
                  <div className="stepper-buttons-group">
                    <button
                      type="button"
                      onClick={() => setBounded(setProtons, protons - 1, 1, 118)}
                      aria-label="Quitar protón"
                    >
                      <Minus size={15} />
                    </button>
                    <b className="stepper-val text-protons">{protons}</b>
                    <button
                      type="button"
                      onClick={() => setBounded(setProtons, protons + 1, 1, 118)}
                      aria-label="Añadir protón"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>

                {/* Neutrons */}
                <div className="particle-stepper-row row-neutrons">
                  <div className="stepper-label-group">
                    <strong>Neutrones (n⁰)</strong>
                    <small>Define el isótopo y masa atómica (A)</small>
                  </div>
                  <div className="stepper-buttons-group">
                    <button
                      type="button"
                      onClick={() => setBounded(setNeutrons, neutrons - 1, 0, 180)}
                      aria-label="Quitar neutrón"
                    >
                      <Minus size={15} />
                    </button>
                    <b className="stepper-val text-neutrons">{neutrons}</b>
                    <button
                      type="button"
                      onClick={() => setBounded(setNeutrons, neutrons + 1, 0, 180)}
                      aria-label="Añadir neutrón"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>

                {/* Electrons */}
                <div className="particle-stepper-row row-electrons">
                  <div className="stepper-label-group">
                    <strong>Electrones (e⁻)</strong>
                    <small>Define la carga eléctrica y estado redox</small>
                  </div>
                  <div className="stepper-buttons-group">
                    <button
                      type="button"
                      onClick={() => setBounded(setElectrons, electrons - 1, 0, 118)}
                      aria-label="Quitar electrón"
                    >
                      <Minus size={15} />
                    </button>
                    <b className="stepper-val text-electrons">{electrons}</b>
                    <button
                      type="button"
                      onClick={() => setBounded(setElectrons, electrons + 1, 0, 118)}
                      aria-label="Añadir electrón"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="presets-quick-bar">
                  <span className="presets-label">Carga rápida de elementos clave:</span>
                  <div className="presets-buttons-wrap">
                    {presets.map((item) => (
                      <button
                        key={item.symbol}
                        type="button"
                        className="preset-chip-btn"
                        onClick={() => loadPreset(item.p, item.n, item.e)}
                      >
                        <b>{item.symbol}</b> ({item.name})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selector para los 118 elementos */}
                <div className="full-element-selector-bar">
                  <span className="presets-label">O selecciona cualquier elemento (1 al 118):</span>
                  <select
                    id="lab-full-element-select"
                    className="lab-element-select"
                    value={currentElement?.symbol || ""}
                    onChange={(e) => loadElement(e.target.value)}
                  >
                    <option value="" disabled>Selecciona un elemento...</option>
                    {elements118.map((elem) => (
                      <option key={elem.symbol} value={elem.symbol}>
                        Z={elem.number} · {elem.symbol} — {elem.name} ({elem.mass} u)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Admission Challenge Engine */}
              <div className="challenge-engine-card">
                <div className="challenge-header">
                  <div className="challenge-title-group">
                    <Award size={18} className="text-amber" />
                    <h4>Reto de Examen Preuniversitario</h4>
                  </div>
                  <span className="challenge-index-badge">
                    Reto {activeChallengeIdx + 1} de {admissionChallenges.length}
                  </span>
                </div>

                <div className="challenge-prompt-box">
                  <span className="challenge-exam-tag">{currentChallenge.exam}</span>
                  <h5>{currentChallenge.title}</h5>
                  <p>{currentChallenge.prompt}</p>
                </div>

                {isChallengeMet ? (
                  <div className="challenge-success-alert">
                    <CheckCircle2 size={20} className="text-emerald" />
                    <div>
                      <strong>¡Excelente! Reto superado con éxito.</strong>
                      <p>{currentChallenge.concept}</p>
                    </div>
                  </div>
                ) : (
                  <div className="challenge-hint-alert">
                    <small>Objetivo actual para completar el reto:</small>
                    <div className="target-specs-chips">
                      <span>Protones: <b>{currentChallenge.target.p}</b></span>
                      <span>Neutrones: <b>{currentChallenge.target.n}</b></span>
                      <span>Electrones: <b>{currentChallenge.target.e}</b></span>
                    </div>
                  </div>
                )}

                <div className="challenge-navigation-buttons">
                  <button
                    type="button"
                    className="challenge-nav-btn"
                    disabled={activeChallengeIdx === 0}
                    onClick={() => setActiveChallengeIdx((prev) => Math.max(0, prev - 1))}
                  >
                    ← Anterior
                  </button>
                  <button
                    type="button"
                    className="challenge-nav-btn primary"
                    onClick={() =>
                      setActiveChallengeIdx((prev) => (prev + 1) % admissionChallenges.length)
                    }
                  >
                    Siguiente reto →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 2: ISÓTOPOS Y MASA ATÓMICA PONDERADA (PhET ISOTOPES)
          ========================================================================= */}
      {activeTab === "isotopes" && (
        <section className="lab-mode-container isotopes-mode">
          {/* Top Element Picker */}
          <div className="isotope-selector-bar">
            <span className="selector-title">Selecciona un elemento de examen:</span>
            <div className="isotope-selector-buttons">
              {Object.keys(isotopesData).map((sym) => {
                const item = isotopesData[sym];
                const isSelected = selectedIsoSym === sym;
                return (
                  <button
                    key={sym}
                    type="button"
                    className={`iso-select-pill ${isSelected ? "active" : ""}`}
                    onClick={() => {
                      setSelectedIsoSym(sym);
                      setCustomAbundance(null);
                    }}
                  >
                    <b>{sym}</b> · {item.name} ({item.standard_mass} u)
                  </button>
                );
              })}
            </div>
          </div>

          {/* Misconception Solved Banner */}
          <div className="isotopes-solution-banner">
            <div className="banner-header">
              <HelpCircle size={20} className="text-cyan" />
              <h3>{isotopeData.question_addressed}</h3>
            </div>
            <p>{isotopeData.explanation}</p>
          </div>

          {/* Dual Workbench: Interactive Balance & Mathematical Breakdown */}
          <div className="isotopes-workbench-grid">
            {/* LEFT: Isotope Balance & Abundance Sliders */}
            <div className="balance-simulator-card">
              <div className="card-header-row">
                <h4>Simulador de Mezcla y Balanza Isotópica</h4>
                {customAbundance && (
                  <button type="button" className="reset-abundance-btn" onClick={resetIsotopes}>
                    <RotateCcw size={14} /> Restaurar valores naturales
                  </button>
                )}
              </div>

              <div className="isotopes-sliders-container">
                {isotopeData.isotopes.map((iso, idx) => {
                  const currentVal = currentAbundances[idx] ?? iso.abundance_pct;
                  return (
                    <div key={idx} className="isotope-interactive-row">
                      <div className="iso-row-header">
                        <div className="iso-id-group">
                          <strong className="iso-sym-tag">{iso.symbol}</strong>
                          <span className="iso-full-name">{iso.name}</span>
                          <span className="iso-mass-tag">m = {iso.mass_u} u</span>
                        </div>
                        <span className="iso-val-pct">
                          <b>{currentVal}%</b>
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="0.01"
                        value={currentVal}
                        onChange={(e) => handleAbundanceChange(idx, e.target.value)}
                        className="iso-slider"
                      />

                      <div className="iso-slider-hints">
                        <small>{iso.neutrons} neutrones</small>
                        <small className="nature-note">Natural: {iso.abundance_pct}%</small>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Balance Visualizer */}
              <div className="visual-balance-stage">
                <div className="balance-fulcrum">
                  <div className="balance-beam" />
                  <div className="fulcrum-triangle" />
                </div>
                <div className="balance-readout-card">
                  <span className="readout-label">Masa Atómica Promedio Ponderada Resultante:</span>
                  <strong className="readout-val">{calculatedAverageMass.toFixed(3)} u</strong>
                  <small className="readout-status">
                    {customAbundance
                      ? "⚠️ Valor simulado alterado por el usuario"
                      : `✅ Valor oficial de la tabla periódica (${isotopeData.standard_mass} u)`}
                  </small>
                </div>
              </div>
            </div>

            {/* RIGHT: Step-by-Step Mathematical Admission Resolution */}
            <div className="math-resolution-card">
              <div className="card-header-row">
                <BookOpen size={18} className="text-emerald" />
                <h4>Resolución Matemática Paso a Paso (Tipo Examen UNI / UNMSM)</h4>
              </div>

              <div className="formula-box">
                <span className="formula-kicker">Fórmula General del Promedio Ponderado:</span>
                <code>Ā = (m₁ × %₁ + m₂ × %₂ + ... + mn × %n) / 100%</code>
              </div>

              <div className="step-by-step-display">
                <span className="step-kicker">Aplicación Numérica con Datos Actuales:</span>
                <ol className="step-ordered-list">
                  <li>
                    <span>Multiplicar la masa de cada isótopo por su abundancia porcentual:</span>
                    <div className="step-calc-box">
                      {isotopeData.isotopes.map((iso, i) => {
                        const pct = currentAbundances[i] ?? iso.abundance_pct;
                        return (
                          <div key={i} className="step-term">
                            <code>
                              {iso.mass_u} u × {pct}% = {(iso.mass_u * pct).toFixed(2)}
                            </code>
                          </div>
                        );
                      })}
                    </div>
                  </li>
                  <li>
                    <span>Sumar las contribuciones y dividir entre el 100%:</span>
                    <div className="step-calc-box">
                      <code>
                        Ā = ({isotopeData.isotopes.map((iso, i) => {
                          const pct = currentAbundances[i] ?? iso.abundance_pct;
                          return (iso.mass_u * pct).toFixed(2);
                        }).join(" + ")}) / 100
                      </code>
                    </div>
                  </li>
                  <li className="final-step">
                    <strong>Resultado Final:</strong>
                    <code className="final-result">
                      Ā = {calculatedAverageMass.toFixed(3)} u
                    </code>
                  </li>
                </ol>
              </div>

              {/* Admission Exam Trap Reminder */}
              <div className="exam-trap-box">
                <AlertTriangle size={18} className="text-amber" />
                <div>
                  <strong>Trampa de Examen Frecuente:</strong>
                  <p>
                    Nunca confundas el <em>Número de Masa (A)</em> con la <em>Masa Atómica</em>.
                    El número de masa A es un número entero exacto (p⁺ + n⁰) propio de un átomo específico.
                    La masa atómica es un promedio estadístico con decimales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 3: SALTO CUÁNTICO DE IONIZACIÓN SUCESIVA (I1, I2, I3, I4)
          ========================================================================= */}
      {activeTab === "ionization" && (
        <section className="lab-mode-container ionization-mode">
          <IonizationQuantumJumpWidget
            element={currentElement}
            initialMode="element"
          />
        </section>
      )}

      {/* Royal Society of Chemistry Misconceptions Guide Modal */}

      <MisconceptionsGuideModal
        isOpen={showMisconceptionsModal}
        onClose={() => setShowMisconceptionsModal(false)}
      />
    </main>
  );
}
