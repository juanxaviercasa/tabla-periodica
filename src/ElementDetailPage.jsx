import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Sparkles,
  Zap,
  Flame,
  Atom,
  Info,
  AlertTriangle,
  Compass,
  Search,
  Sun,
  Moon,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  HelpCircle,
  Scale,
  ShieldAlert
} from "lucide-react";
import { elements118, iupacFamilies } from "./data.js";
import { getElementPedagogy } from "./data/pedagogyData.js";
import { getElementIsotopes } from "./data/isotopesData.js";
import { MisconceptionsGuideModal } from "./components/MisconceptionsGuideModal.jsx";

const AtomViewer3D = lazy(() => import("./components/AtomViewer3D.jsx"));

// Shell capacity lookup: 2 * n^2 (K=2, L=8, M=18, N=32, O=50, P=72, Q=98)
const MAX_SHELL_CAPACITY = [2, 8, 18, 32, 50, 72, 98];
const SHELL_LETTERS = ["K", "L", "M", "N", "O", "P", "Q"];

// Formats electron configurations like "[Ar] 4s2 3d10 4p2" into superscripts
function FormatConfig({ configStr }) {
  if (!configStr) return <span>—</span>;

  const parts = configStr.split(" ");
  return (
    <span className="config-formatted">
      {parts.map((part, index) => {
        if (part.startsWith("[")) {
          return (
            <span key={index} className="config-kernel">
              {part}{" "}
            </span>
          );
        }
        const match = part.match(/^(\d+[spdf])(\d+)$/);
        if (match) {
          return (
            <span key={index} className="config-subshell">
              {match[1]}
              <sup>{match[2]}</sup>{" "}
            </span>
          );
        }
        return <span key={index}>{part} </span>;
      })}
    </span>
  );
}

export default function ElementDetailPage() {
  const { elementId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [imageError, setImageError] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("quimica-preuni-theme") === "dark"
  );
  const [revealedQuiz, setRevealedQuiz] = useState({});
  const [showMisconceptionsModal, setShowMisconceptionsModal] = useState(false);

  useEffect(() => {
    setRevealedQuiz({});
  }, [elementId]);

  // Sync theme with document and localStorage
  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("quimica-preuni-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Sync with storage changes from other tabs (like homepage)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "quimica-preuni-theme") {
        setDarkMode(e.newValue === "dark");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Find element by symbol or atomic number
  const element = useMemo(() => {
    if (!elementId) return null;
    const cleanId = elementId.trim().toLowerCase();
    const bySymbol = elements118.find(
      (e) => e.symbol.toLowerCase() === cleanId
    );
    if (bySymbol) return bySymbol;

    const num = parseInt(cleanId, 10);
    if (!isNaN(num)) {
      return elements118.find((e) => e.number === num);
    }
    return null;
  }, [elementId]);

  // Grounded pedagogical knowledge & isotopes data
  const pedagogyRecord = useMemo(() => {
    if (!element) return null;
    return getElementPedagogy(element.number || element.z);
  }, [element]);

  const pedagogy = pedagogyRecord?.pedagogy;

  const isotopesRecord = useMemo(() => {
    if (!element) return null;
    return getElementIsotopes(element.symbol);
  }, [element]);

  const toggleQuiz = (idx) => {
    setRevealedQuiz((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Dynamic document title
  useEffect(() => {
    if (element) {
      document.title = `${element.name} (${element.symbol}) — Z=${element.number} | Ficha Atómica 3D`;
      setImageError(false);
    } else {
      document.title = "Elemento no encontrado — Tabla Periódica";
    }
  }, [element]);

  // Adjacent element links (Z-1 and Z+1)
  const prevElement = useMemo(() => {
    if (!element) return null;
    return elements118.find((e) => e.number === element.number - 1) || null;
  }, [element]);

  const nextElement = useMemo(() => {
    if (!element) return null;
    return elements118.find((e) => e.number === element.number + 1) || null;
  }, [element]);

  // Keyboard shortcuts: Left/Right arrows for adjacent elements
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      if (e.key === "ArrowLeft" && prevElement) {
        navigate(`/elemento/${prevElement.symbol.toLowerCase()}`);
      } else if (e.key === "ArrowRight" && nextElement) {
        navigate(`/elemento/${nextElement.symbol.toLowerCase()}`);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevElement, nextElement, navigate]);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Filtered elements for quick search dropdown
  const filteredJumpList = useMemo(() => {
    if (!searchQuery.trim()) return elements118.slice(0, 18);
    const q = searchQuery.toLowerCase().trim();
    return elements118
      .filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.symbol.toLowerCase().includes(q) ||
          String(e.number) === q
      )
      .slice(0, 20);
  }, [searchQuery]);

  if (!element) {
    return (
      <main className="element-detail-page element-not-found">
        <div className="not-found-card">
          <Atom size={56} className="spin-slow" />
          <h1>Elemento no encontrado</h1>
          <p>
            No pudimos encontrar el elemento químico con el identificador "
            <strong>{elementId}</strong>".
          </p>
          <div className="not-found-actions">
            <Link to="/" className="primary-action">
              <ArrowLeft size={16} /> Volver a la Tabla Periódica
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Calculated physical and nuclear metrics
  const z = element.number || element.z;
  const standardMass = parseFloat(element.atomic_mass || element.mass) || z * 2;
  const neutrons = Math.max(0, Math.round(standardMass) - z);
  const shells = Array.isArray(element.shells) && element.shells.length > 0
    ? element.shells
    : [1];
  const valenceElectrons = shells[shells.length - 1] || 1;

  // Family styling token
  const familyNormalized = element.family
    .toLowerCase()
    .replace(/ /g, "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const familyColorObj = iupacFamilies.find((f) => f.id === element.family);
  const familyColor = familyColorObj?.color || "#3b82f6";

  const paulingValue = parseFloat(element.electronegativity || element.en);
  const hasPauling = !isNaN(paulingValue) && paulingValue > 0;
  const enPercentage = hasPauling
    ? Math.min(100, Math.max(0, ((paulingValue - 0.7) / (4.0 - 0.7)) * 100))
    : 0;

  return (
    <div
      className={`element-detail-page family-theme-${familyNormalized}`}
      style={{ "--element-accent": familyColor }}
    >
      {/* Dynamic atmospheric radial backdrop */}
      <div className="detail-ambient-bg" aria-hidden="true" />

      {/* Top Floating Navigation Bar */}
      <header className="detail-topbar" role="banner">
        <div className="topbar-left">
          <Link
            to="/"
            className="topbar-back-btn"
            title="Volver a la Tabla Periódica general"
          >
            <ArrowLeft size={18} />
            <span className="back-text">Tabla Periódica</span>
          </Link>

          {/* Quick Search / Element Jumper */}
          <div className="quick-jump-container">
            <button
              type="button"
              className="quick-jump-toggle"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-expanded={searchOpen}
              aria-label="Buscar y saltar a otro elemento"
            >
              <Search size={15} />
              <span className="jump-current">
                <b>{element.symbol}</b> · {element.name}
              </span>
              <span className="jump-hint">Saltar ▾</span>
            </button>

            {searchOpen && (
              <div className="quick-jump-popover">
                <div className="jump-input-wrapper">
                  <Search size={14} />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, símbolo o Z..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="jump-results-list">
                  {filteredJumpList.map((item) => (
                    <Link
                      key={item.number}
                      to={`/elemento/${item.symbol.toLowerCase()}`}
                      className={`jump-item ${item.number === element.number ? "active" : ""}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <span className="jump-z">{item.number}</span>
                      <strong className="jump-sym">{item.symbol}</strong>
                      <span className="jump-name">{item.name}</span>
                      <small className="jump-fam">{item.family}</small>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="topbar-right">
          {/* Previous Element Button */}
          {prevElement ? (
            <Link
              to={`/elemento/${prevElement.symbol.toLowerCase()}`}
              className="topbar-nav-pill"
              title={`Elemento anterior: ${prevElement.name} (${prevElement.symbol})`}
              aria-label={`Elemento anterior: ${prevElement.name}`}
            >
              <ChevronLeft size={16} />
              <span className="nav-pill-sym">{prevElement.symbol}</span>
              <span className="nav-pill-z">Z={prevElement.number}</span>
            </Link>
          ) : (
            <span className="topbar-nav-pill disabled">
              <ChevronLeft size={16} /> Inicio
            </span>
          )}

          {/* Next Element Button */}
          {nextElement ? (
            <Link
              to={`/elemento/${nextElement.symbol.toLowerCase()}`}
              className="topbar-nav-pill"
              title={`Elemento siguiente: ${nextElement.name} (${nextElement.symbol})`}
              aria-label={`Elemento siguiente: ${nextElement.name}`}
            >
              <span className="nav-pill-z">Z={nextElement.number}</span>
              <span className="nav-pill-sym">{nextElement.symbol}</span>
              <ChevronRight size={16} />
            </Link>
          ) : (
            <span className="topbar-nav-pill disabled">
              Fin <ChevronRight size={16} />
            </span>
          )}

          {/* Share / Copy Link Button */}
          <button
            type="button"
            className={`topbar-share-btn ${copied ? "copied" : ""}`}
            onClick={handleCopyLink}
            title="Copiar enlace directo de esta ficha"
            aria-label="Copiar enlace de este elemento"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span className="share-text">{copied ? "¡Copiado!" : "Compartir"}</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="topbar-theme-toggle"
            onClick={() => setDarkMode((prev) => !prev)}
            title={darkMode ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
            aria-label={darkMode ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Main Dual Stage Showcase (Natural Specimen & 3D Quantum Atom) */}
      <main className="detail-container">
        <section className="detail-hero-showcase">
          {/* STAGE LEFT: Pure Natural Specimen Gallery (100% UNUNCROPPED) */}
          <div className="specimen-gallery-card">
            <div className="specimen-header">
              <span className="specimen-eyebrow">
                <Sparkles size={13} /> Muestra Natural en la Tierra
              </span>
              <span className="specimen-phase-badge">
                {element.phase.toUpperCase()}
              </span>
            </div>

            <div className="specimen-frame-wrapper">
              {!imageError ? (
                <>
                  {/* Atmospheric blurred ambient backlight generated from the image */}
                  <img
                    src={`/real-elements/${element.symbol.toLowerCase()}.jpg`}
                    alt=""
                    className="specimen-ambient-blur"
                    aria-hidden="true"
                  />

                  {/* Pristine Uncropped Photograph */}
                  <img
                    src={`/real-elements/${element.symbol.toLowerCase()}.jpg`}
                    alt={`Espécimen natural y apariencia física de ${element.name} (${element.symbol})`}
                    className="specimen-img-contain"
                    loading="eager"
                    onError={() => setImageError(true)}
                  />
                </>
              ) : (
                /* Holographic procedural visual artwork fallback */
                <div className="specimen-procedural-fallback">
                  <div className="fallback-orbits" aria-hidden="true">
                    <div className="fallback-ring ring-1" />
                    <div className="fallback-ring ring-2" />
                    <div className="fallback-ring ring-3" />
                  </div>
                  <div className="fallback-monogram">
                    <span className="fallback-z">{element.number}</span>
                    <span className="fallback-symbol">{element.symbol}</span>
                    <span className="fallback-name">{element.name}</span>
                  </div>
                  <small className="fallback-note">
                    Espécimen no disponible fotográficamente o sintético
                  </small>
                </div>
              )}
            </div>

            <div className="specimen-caption">
              <div className="specimen-identity">
                <span className="specimen-z-badge">Z = {element.number}</span>
                <h1 className="specimen-title">{element.name}</h1>
                <span className="specimen-symbol-pill">{element.symbol}</span>
              </div>
              <div className="specimen-family-tag" style={{ color: familyColor }}>
                ● {element.family} · Período {element.period} · Grupo {element.group}
              </div>
              {element.isPreUni && (
                <div className="preuni-distinction-badge">
                  ★ Elemento Prioritario de Examen Preuniversitario
                </div>
              )}
              <div className="specimen-lab-actions">
                <Link
                  to={`/laboratorio?sym=${element.symbol}&tab=builder`}
                  className="specimen-lab-btn lab-btn-builder"
                  title="Construye y modela este átomo e iones en el laboratorio interactivo"
                >
                  <Atom size={14} /> Experimentar en Laboratorio
                </Link>
                {isotopesRecord && (
                  <Link
                    to={`/laboratorio?sym=${element.symbol}&tab=isotopes`}
                    className="specimen-lab-btn lab-btn-isotopes"
                    title="Analizar abundancia y masa isotópica en el laboratorio"
                  >
                    <Scale size={14} /> Balanza Isotópica
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* STAGE RIGHT: 3D Interactive Quantum Laboratory */}
          <div className="quantum-lab-card">
            <div className="lab-header">
              <div className="lab-title-group">
                <span className="lab-eyebrow">
                  <Atom size={14} /> Laboratorio Cuántico 3D
                </span>
                <h2 className="lab-heading">Dinámica Orbital y Estructura Atómica</h2>
              </div>
              <div className="lab-hud-particles">
                <span className="particle-chip chip-protons">
                  <span className="particle-dot" /> {z} Protones (p⁺)
                </span>
                <span className="particle-chip chip-neutrons">
                  <span className="particle-dot" /> {neutrons} Neutrones (n⁰)
                </span>
                <span className="particle-chip chip-electrons">
                  <span className="particle-dot" /> {z} Electrones (e⁻)
                </span>
              </div>
            </div>

            {/* Interactive 3D Canvas Stage */}
            <div className="lab-canvas-viewport">
              <Suspense
                fallback={
                  <div className="lab-loading-state">
                    <Atom size={38} className="spin-slow" />
                    <p>Iniciando simulador cuántico 3D...</p>
                  </div>
                }
              >
                <AtomViewer3D element={element} />
              </Suspense>
            </div>

            <div className="lab-footer-note">
              <small>
                💡 Arrastra para orbitar en 3D · Scroll/Pellizco para zoom · Cambia entre Bohr y Nube Cuántica (REEMPE)
              </small>
            </div>
          </div>
        </section>

        {/* COMPREHENSIVE ATOMIC BENTO MATRIX */}
        <section className="detail-bento-grid">
          {/* Card 1: Identidad Atómica y Nuclear */}
          <article className="bento-card bento-identity">
            <div className="bento-card-header">
              <Zap size={18} className="bento-icon" />
              <h3>Identidad & Núcleo Atómico</h3>
            </div>
            <div className="metric-rows">
              <div className="metric-row">
                <span className="metric-label">Número Atómico (Z)</span>
                <strong className="metric-value highlight">{z}</strong>
              </div>
              <div className="metric-row">
                <span className="metric-label">Masa Atómica Estándar (A)</span>
                <strong className="metric-value">{standardMass} u</strong>
              </div>
              <div className="metric-row">
                <span className="metric-label">Neutrones Estándar (A - Z)</span>
                <strong className="metric-value">{neutrons} n⁰</strong>
              </div>
              <div className="metric-row">
                <span className="metric-label">Carga Nuclear Neta</span>
                <strong className="metric-value">+{z} e</strong>
              </div>
              <div className="metric-row">
                <span className="metric-label">Relación n⁰/p⁺</span>
                <strong className="metric-value">
                  {(neutrons / Math.max(z, 1)).toFixed(2)}
                </strong>
              </div>
            </div>
          </article>

          {/* Card 2: Arquitectura Electrónica y Niveles Cuánticos */}
          <article className="bento-card bento-quantum">
            <div className="bento-card-header">
              <Layers size={18} className="bento-icon" />
              <h3>Arquitectura Cuántica & Capas</h3>
            </div>

            <div className="quantum-config-box">
              <span className="config-label">Configuración Electrónica (Möller)</span>
              <div className="config-display">
                <FormatConfig
                  configStr={element.electron_configuration || element.config}
                />
              </div>
            </div>

            <div className="shells-visualizer">
              <span className="shells-title">
                Distribución por Capas ({shells.length} niveles activos · {valenceElectrons}e⁻ valencia):
              </span>
              <div className="shells-meter-list">
                {shells.map((count, index) => {
                  const maxCap = MAX_SHELL_CAPACITY[index] || 98;
                  const letter = SHELL_LETTERS[index] || `n=${index + 1}`;
                  const fillPct = Math.min(100, Math.round((count / maxCap) * 100));

                  return (
                    <div key={index} className="shell-meter-item">
                      <div className="shell-meter-info">
                        <span className="shell-name">
                          Capa <b>{letter}</b> (n={index + 1})
                        </span>
                        <span className="shell-count">
                          <b>{count}</b> / {maxCap} e⁻ ({fillPct}%)
                        </span>
                      </div>
                      <div className="shell-progress-track">
                        <div
                          className="shell-progress-fill"
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>

          {/* Card 3: Propiedades Periódicas & Termodinámicas */}
          <article className="bento-card bento-properties">
            <div className="bento-card-header">
              <Compass size={18} className="bento-icon" />
              <h3>Propiedades Periódicas & Estado</h3>
            </div>

            {/* Electronegativity with visual spectrum */}
            <div className="property-block en-block">
              <div className="en-header">
                <span className="en-label">Electronegatividad (Pauling)</span>
                <strong className="en-val">
                  {hasPauling ? paulingValue.toFixed(2) : "Inerte / Desconocida"}
                </strong>
              </div>
              {hasPauling ? (
                <div className="en-spectrum-container">
                  <div className="en-spectrum-bar">
                    <div
                      className="en-marker"
                      style={{ left: `${enPercentage}%` }}
                      title={`EN: ${paulingValue}`}
                    />
                  </div>
                  <div className="en-spectrum-labels">
                    <small>0.7 (Fr / Metales electropositivos)</small>
                    <small>3.98 (F / Más electronegativo)</small>
                  </div>
                </div>
              ) : (
                <div className="en-inert-badge">
                  Sin tendencia a atraer electrones de enlace
                </div>
              )}
            </div>

            <div className="property-mini-grid">
              <div className="mini-stat">
                <span className="mini-label">Radio Atómico</span>
                <strong className="mini-value">
                  {element.radius ? `${element.radius} pm` : "—"}
                </strong>
              </div>
              <div className="mini-stat">
                <span className="mini-label">1ª Energía de Ionización</span>
                <strong className="mini-value">
                  {element.ionization ? `${element.ionization} kJ/mol` : "—"}
                </strong>
              </div>
              <div className="mini-stat">
                <span className="mini-label">Bloque Cuántico</span>
                <strong className="mini-value">
                  Bloque {element.block.toUpperCase()}
                </strong>
              </div>
              <div className="mini-stat">
                <span className="mini-label">Fase Estándar (STP)</span>
                <strong className="mini-value">{element.phase}</strong>
              </div>
            </div>
          </article>

          {/* Card 4: Reactividad Química & Valencias */}
          <article className="bento-card bento-valencies">
            <div className="bento-card-header">
              <Flame size={18} className="bento-icon" />
              <h3>Reactividad & Estados de Oxidación</h3>
            </div>
            <div className="ox-states-container">
              <span className="ox-heading">Estados de Oxidación Frecuentes:</span>
              <div className="ox-chips-wrapper">
                {(element.oxidation_states || element.ox || "0")
                  .split(",")
                  .map((st, i) => (
                    <span key={i} className="ox-state-chip">
                      {st.trim()}
                    </span>
                  ))}
              </div>
            </div>
            <div className="reactivity-summary">
              <p>
                Los estados de oxidación indican el número de electrones que el átomo de{" "}
                <strong>{element.name}</strong> puede compartir, ceder o captar al enlazarse químicamente.
              </p>
            </div>
          </article>

          {/* MÓDULO 1: APRENDE EL CONCEPTO (SIN RODEOS) - 4 TARJETAS DIDÁCTICAS */}
          <section className="bento-card bento-pedagogical-container span-full">
            <div className="bento-card-header pedagogical-main-header">
              <div className="pedagogical-title-group">
                <BookOpen size={20} className="bento-icon icon-emerald" />
                <div>
                  <span className="bento-kicker">Metodología Activa & Grounding Científico</span>
                  <h3>Aprende el Concepto (Sin Rodeos)</h3>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="pedagogy-guide-btn"
                  onClick={() => setShowMisconceptionsModal(true)}
                  title="Confronta y aprende las 6 trampas de examen (RSC)"
                >
                  <ShieldAlert size={13} /> 6 Trampas RSC
                </button>
                <span className="verified-badge">
                  <CheckCircle2 size={13} /> Fuente de Verdad IUPAC / RSC
                </span>
              </div>
            </div>

            <div className="pedagogy-four-grid">
              {/* Tarjeta 1: Aplicación Real y Biomédica */}
              <article className="pedagogy-card card-application">
                <div className="card-top">
                  <div className="card-icon-badge icon-app">
                    <Sparkles size={16} />
                  </div>
                  <h4>1. Aplicación Real y Biomédica</h4>
                </div>
                <p>
                  {pedagogy?.everyday_context ||
                    element.summary ||
                    "Elemento fundamental en química aplicada, tecnología y procesos biológicos."}
                </p>
              </article>

              {/* Tarjeta 2: Trampa Típica de Examen */}
              <article className="pedagogy-card card-pitfall">
                <div className="card-top">
                  <div className="card-icon-badge icon-pitfall">
                    <AlertTriangle size={16} />
                  </div>
                  <h4>2. Trampa Típica de Examen (UNMSM / UNI)</h4>
                </div>
                <p>
                  {pedagogy?.exam_pitfall ||
                    element.study_notes ||
                    element.nomenclaturaNotes ||
                    "Compara cuidadosamente estados de oxidación y radio de cationes vs aniones en exámenes de admisión."}
                </p>
              </article>

              {/* Tarjeta 3: Desglose Cuántico Intuitivo */}
              <article className="pedagogy-card card-quantum">
                <div className="card-top">
                  <div className="card-icon-badge icon-quantum">
                    <Atom size={16} />
                  </div>
                  <h4>3. Desglose Cuántico Intuitivo</h4>
                </div>
                <div className="card-quantum-body">
                  <p>
                    <strong>Niveles y Capas:</strong>{" "}
                    {pedagogy?.quantum_breakdown?.level_explanation ||
                      `Posee ${shells.length} capas ocupadas y ${valenceElectrons} electrones de valencia.`}
                  </p>
                  {pedagogy?.quantum_breakdown?.anomalies_or_rules && (
                    <div className="quantum-rule-tag">
                      <strong>Regla / Anomalía:</strong>{" "}
                      {pedagogy.quantum_breakdown.anomalies_or_rules}
                    </div>
                  )}
                </div>
              </article>

              {/* Tarjeta 4: Relación con su Familia */}
              <article className="pedagogy-card card-family">
                <div className="card-top">
                  <div className="card-icon-badge icon-family">
                    <Compass size={16} />
                  </div>
                  <h4>4. Relación con su Familia ({element.family})</h4>
                </div>
                <p>
                  {pedagogy?.family_relationship ||
                    `Comparte la configuración terminal de valencia y patrones de reactividad química con los miembros de su grupo.`}
                </p>
              </article>
            </div>

            {/* Chemical Misconception Callout (RSC) */}
            {pedagogy?.misconception && (
              <div className="misconception-callout">
                <div className="misconception-header">
                  <HelpCircle size={18} className="misconception-icon" />
                  <strong>Desmontando el Error Frecuente (Chemical Misconception - RSC)</strong>
                </div>
                <p>{pedagogy.misconception}</p>
                <button
                  type="button"
                  className="misconception-open-modal-btn"
                  onClick={() => setShowMisconceptionsModal(true)}
                >
                  <ShieldAlert size={14} /> Explorar las 6 Trampas de Examen (Guía RSC)
                </button>
              </div>
            )}
          </section>

          {/* MÓDULO 2: AUTOEVALUACIÓN ACTIVA - PONTE A PRUEBA (FLASHCARDS) */}
          <section className="bento-card bento-flashcards-container span-full">
            <div className="bento-card-header">
              <Zap size={20} className="bento-icon icon-amber" />
              <div>
                <span className="bento-kicker">Evaluación Formativa con Feedback Inmediato</span>
                <h3>Ponte a Prueba: Flashcards Activas de Admisión</h3>
              </div>
            </div>

            <div className="flashcards-layout-grid">
              {(pedagogy?.self_check_quiz || []).map((quizItem, idx) => {
                const isRevealed = !!revealedQuiz[idx];
                return (
                  <div key={idx} className={`flashcard-interactive-box ${isRevealed ? "revealed" : ""}`}>
                    <div className="flashcard-meta-tags">
                      <span className="flashcard-exam-pill">{quizItem.exam_tag || "Pregunta de Examen"}</span>
                      <span className="flashcard-concept-pill">{quizItem.concept_tested}</span>
                    </div>

                    <h4 className="flashcard-prompt-text">{quizItem.question}</h4>

                    <button
                      type="button"
                      className={`flashcard-action-btn ${isRevealed ? "active" : ""}`}
                      onClick={() => toggleQuiz(idx)}
                      aria-expanded={isRevealed}
                    >
                      {isRevealed ? (
                        <>
                          <EyeOff size={15} /> Ocultar respuesta
                        </>
                      ) : (
                        <>
                          <Eye size={15} /> Revelar respuesta y fundamento paso a paso
                        </>
                      )}
                    </button>

                    {isRevealed && (
                      <div className="flashcard-answer-reveal">
                        <div className="answer-header-row">
                          <CheckCircle2 size={16} className="answer-check-icon" />
                          <strong>Solución Explicada:</strong>
                        </div>
                        <p className="answer-core-text">{quizItem.answer}</p>
                        {quizItem.explanation && (
                          <div className="answer-rationale-box">
                            <small>Fundamento didáctico para el examen:</small>
                            <p>{quizItem.explanation}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* MÓDULO 3: ISÓTOPOS Y MASA ATÓMICA PONDERADA (PHET STYLE) */}
          {isotopesRecord && (
            <section className="bento-card bento-isotopes-container span-full">
              <div className="bento-card-header">
                <Scale size={20} className="bento-icon icon-cyan" />
                <div>
                  <span className="bento-kicker">Abundancia Isotópica & Promedio Ponderado</span>
                  <h3>Isótopos y Origen de la Masa Atómica ({element.name})</h3>
                </div>
              </div>

              <div className="isotopes-intro-card">
                <h4>{isotopesRecord.question_addressed}</h4>
                <p>{isotopesRecord.explanation}</p>
              </div>

              <div className="isotopes-cards-grid">
                {isotopesRecord.isotopes.map((iso, i) => (
                  <div key={i} className="single-isotope-card">
                    <div className="isotope-card-top">
                      <strong className="iso-symbol">{iso.symbol}</strong>
                      <span className="iso-name">{iso.name}</span>
                      <span className={`iso-tag ${iso.is_stable ? "tag-stable" : "tag-decay"}`}>
                        {iso.decay_mode}
                      </span>
                    </div>

                    <div className="iso-nuclear-specs">
                      <span className="spec-badge">p⁺: <b>{iso.z}</b></span>
                      <span className="spec-badge">n⁰: <b>{iso.neutrons}</b></span>
                      <span className="spec-badge">A: <b>{iso.a}</b></span>
                      <span className="spec-badge">Masa: <b>{iso.mass_u} u</b></span>
                    </div>

                    <div className="iso-meter-box">
                      <div className="meter-labels">
                        <span>Abundancia en la Tierra:</span>
                        <strong>{iso.abundance_pct}%</strong>
                      </div>
                      <div className="meter-track">
                        <div
                          className="meter-fill"
                          style={{ width: `${Math.min(100, Math.max(3, iso.abundance_pct))}%` }}
                        />
                      </div>
                    </div>

                    {iso.highlight && (
                      <div className="iso-highlight-box">
                        💡 {iso.highlight}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {isotopesRecord.calculation_steps && (
                <div className="isotopes-math-box">
                  <span className="math-box-title">Cálculo de Masa Promedio Ponderada (Fórmula de Examen):</span>
                  <div className="math-steps-list">
                    {isotopesRecord.calculation_steps.map((step, sIdx) => (
                      <div key={sIdx} className="math-step-row">
                        <code>{step}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="isotopes-lab-footer-cta">
                <Link to="/laboratorio" className="primary-action">
                  <Atom size={16} /> Experimentar en el Simulador PhET de Isótopos y Átomos →
                </Link>
              </div>
            </section>
          )}
        </section>

        {/* Footer Navigation Bar */}
        <footer className="detail-footer">
          <div className="detail-footer-inner">
            <Link to="/" className="secondary-action">
              <ArrowLeft size={16} /> Volver al catálogo completo de la tabla
            </Link>
            <span className="footer-credits">
              Plataforma Educativa de Química Preuniversitaria · Catálogo Oficial 118 IUPAC
            </span>
          </div>
        </footer>

        {/* Chemical Misconceptions Modal */}
        <MisconceptionsGuideModal
          isOpen={showMisconceptionsModal}
          onClose={() => setShowMisconceptionsModal(false)}
        />
      </main>
    </div>
  );
}
