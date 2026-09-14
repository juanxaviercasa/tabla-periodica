import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import {
  Activity,
  Atom,
  Check,
  CheckCircle,
  ChevronDown,
  Columns3,
  Compass,
  Filter,
  Flame,
  Layers,
  ListChecks,
  Moon,
  Plus,
  RotateCcw,
  Scale,
  Search,
  ShieldAlert,
  Sparkles,
  Sun,
  Target,
  Thermometer,
  X
} from "lucide-react";
import {
  categories,
  elements,
  topics,
  iupacFamilies,
  quantumBlocks,
  aggregationPhases,
  periodicTablePlaceholders
} from "./data.js";
import {
  groupsData,
  periodsData,
  periodicTrendsData
} from "./data/groupPeriodData.js";
import {
  GroupHeaders,
  PeriodHeaders,
  GroupPeriodBanner
} from "./components/GroupPeriodInspector.jsx";
import {
  PeriodicTrendsVectors,
  PeriodicTrendRationaleBanner
} from "./components/PeriodicTrendsOverlay.jsx";
import {
  HeatmapLegend,
  getHeatmapColor
} from "./components/HeatmapLegend.jsx";
import {
  TemperatureSlider,
  getElementPhaseAtTemp
} from "./components/TemperatureSlider.jsx";
import { ElementComparatorModal } from "./components/ElementComparatorModal.jsx";
import { MisconceptionsGuideModal } from "./components/MisconceptionsGuideModal.jsx";
import { communityUrl } from "./config.js";
import {
  getBestScore,
  getDiagnostic,
  getDueReviewCount,
  getDueQuestions,
  getMistakes,
  getStudyStreak
} from "./storage.js";

const QuizPage = lazy(() => import("./QuizPage.jsx"));
const DiagnosticPage = lazy(() => import("./DiagnosticPage.jsx"));
const LabPage = lazy(() => import("./LabPage.jsx"));
const TeacherPage = lazy(() => import("./TeacherPage.jsx"));
const ElementDetailPage = lazy(() => import("./ElementDetailPage.jsx"));
const loadAtomViewer = () => import("./components/AtomViewer3D.jsx");
const AtomViewer3D = lazy(loadAtomViewer);

const tableLayers = [
  { id: "families", label: "Familias" },
  { id: "en", label: "Electronegatividad" },
  { id: "radius", label: "Radio atómico" },
  { id: "ionization", label: "Ionización" },
  { id: "mass", label: "Masa atómica" }
];

function layerValue(element, layer) {
  if (layer === "radius") return element.radius ? `${element.radius} pm` : "—";
  if (layer === "ionization") return element.ionization ? `${element.ionization} kJ` : "—";
  if (layer === "en") return element.en !== "—" ? `EN ${element.en}` : "—";
  if (layer === "mass") return element.mass;
  return element.family;
}

function getElementTrendValue(element, propertyId) {
  if (!element) return null;
  switch (propertyId) {
    case "en":
      return element.electronegativity && element.electronegativity !== "—"
        ? parseFloat(element.electronegativity)
        : (element.en && element.en !== "—" ? parseFloat(element.en) : null);
    case "radius":
      return element.radius ? parseFloat(element.radius) : null;
    case "ionization":
      return element.ionization ? parseFloat(element.ionization) : null;
    case "affinity":
      return element.electron_affinity !== null && element.electron_affinity !== undefined
        ? parseFloat(element.electron_affinity)
        : null;
    case "melt":
      return element.melt !== null && element.melt !== undefined
        ? parseFloat(element.melt)
        : null;
    case "boil":
      return element.boil !== null && element.boil !== undefined
        ? parseFloat(element.boil)
        : null;
    case "density":
      return element.density !== null && element.density !== undefined
        ? parseFloat(element.density)
        : null;
    case "metallic":
      return element.isMetal ? 100 : (element.family && element.family.includes("Metaloide") ? 50 : 10);
    default:
      return null;
  }
}



const examTrapDefinitions = {
  antiserrucho: {
    title: "Anomalías de Configuración Electrónica (Regla Antiserrucho)",
    elements: ["Cr", "Cu", "Mo", "Ag", "Au", "Pt", "Pd"],
    description:
      "En exámenes de admisión (UNI/UNMSM) es pregunta obligada la configuración anómala: Cr (Z=24, [Ar] 4s¹ 3d⁵) y Cu (Z=29, [Ar] 4s¹ 3d¹⁰). Transfieren un electrón s a la subcapa d para lograr semi-llenado (d⁵) o llenado completo (d¹⁰), alcanzando máxima simetría cuántica y estabilidad de intercambio."
  },
  anfoterismo: {
    title: "Elementos con Comportamiento Anfótero y Valencias Múltiples",
    elements: ["Cr", "Mn", "V", "N", "Bi", "Al", "Zn", "Pb", "Sn"],
    description:
      "Trampa clásica de examen: estos elementos cambian drásticamente su función química según su estado de oxidación. Por ejemplo, el Manganeso (Mn) forma óxidos básicos con +2 y +3 (MnO, Mn₂O₃), es anfótero con +4 (MnO₂), y forma anhídridos ácidos con +6 y +7 (MnO₃, Mn₂O₇). El Cromo (Cr) actúa como metal con +2 y +3, y como no metal con +6 (anhídrido crómico CrO₃)."
  },
  "liquidos-gases": {
    title: "Estados de Agregación No Sólidos a Condiciones Estándar (STP 25°C)",
    elements: ["Hg", "Br", "H", "He", "N", "O", "F", "Ne", "Cl", "Ar", "Kr", "Xe", "Rn"],
    description:
      "En toda la tabla periódica a 25°C y 1 atm solo existen 2 elementos líquidos: Mercurio (Hg, único metal líquido) y Bromo (Br, único no metal líquido). Solo existen 11 elementos gaseosos (los 6 gases nobles monoatómicos He, Ne, Ar, Kr, Xe, Rn más las moléculas diatómicas H₂, N₂, O₂, F₂, Cl₂). Todos los demás 105 elementos son sólidos."
  },
  isoelectronicos: {
    title: "Especies Químicas Isoelectrónicas en Exámenes de Admisión",
    elements: ["N", "O", "F", "Ne", "Na", "Mg", "Al", "P", "S", "Cl", "Ar", "K", "Ca"],
    description:
      "Pregunta recurrente: ordenar cationes y aniones isoelectrónicos por radio atómico/iónico. Para especies isoelectrónicas con 10 electrones (configuración de Neón): r(N³⁻) > r(O²⁻) > r(F⁻) > r(Ne) > r(Na⁺) > r(Mg²⁺) > r(Al³⁺). A mayor carga nuclear Z, mayor atracción sobre los 10 electrones y menor radio iónico."
  }
};

const chemistryFacts = [
  "El Francio es tan escaso que se estima que solo hay entre 20 a 30 gramos en toda la Tierra en cualquier momento.",
  "El Mercurio y el Bromo son los únicos elementos de la tabla que son líquidos a temperatura ambiente.",
  "El Carbono es la base de toda la vida conocida y puede formar más compuestos que todos los demás elementos combinados.",
  "El Titanio es tan fuerte como el acero pero 45% más ligero, y es casi completamente inmune a la corrosión.",
  "El Osmio es la sustancia natural más densa de la Tierra: un litro pesa más de 22.5 kilogramos.",
  "El Helio fue descubierto en el Sol mediante espectroscopía antes de ser hallado en la Tierra."
];

function FactCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % chemistryFacts.length);
    }, 12000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div
      className="fact-carousel"
      aria-label="Datos curiosos sobre química"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={() => setIsPaused(true)}
    >
      <span className="eyebrow">💡 ¿Sabías que...?</span>
      <p className="fact-text" key={currentIndex}>{chemistryFacts[currentIndex]}</p>
      <div className="carousel-dots">
        {chemistryFacts.map((_, idx) => (
          <button
            key={idx}
            className={`dot ${idx === currentIndex ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(idx);
              setIsPaused(true);
            }}
            aria-label={`Ver dato ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function ElementLegend({ tableMode, tableLayer = "families" }) {
  const [highlightedPart, setHighlightedPart] = useState(null);

  const layerInfo = useMemo(() => {
    switch (tableLayer) {
      case "radius":
        return {
          val: "67 pm",
          label: "Radio Atómico",
          detail: "67 pm (radio covalente en picómetros)",
          badge: "Radio"
        };
      case "ionization":
        return {
          val: "1086 kJ",
          label: "1.ª Energía de Ionización",
          detail: "1086 kJ/mol (energía de arranque)",
          badge: "E.I."
        };
      case "en":
        return {
          val: "EN 2.55",
          label: "Electronegatividad",
          detail: "2.55 (escala de Pauling)",
          badge: "Pauling"
        };
      case "mass":
        return {
          val: "12.011",
          label: "Masa Atómica",
          detail: "12.011 u (peso atómico estándar)",
          badge: "Masa"
        };
      case "families":
      default:
        return {
          val: tableMode === "study" ? "12.011" : "No metal",
          label: tableMode === "study" ? "Masa Atómica" : "Familia Química",
          detail: tableMode === "study" ? "12.011 u (peso atómico)" : "No metal (clasificación)",
          badge: tableMode === "study" ? "Masa" : "Familia"
        };
    }
  }, [tableLayer, tableMode]);

  return (
    <div
      className="element-legend"
      role="region"
      aria-label="Guía de anatomía y lectura de casillas"
    >
      <div className="legend-header">
        <span className="legend-header-title">
          <Sparkles size={12} aria-hidden="true" /> Cómo leer cada casilla:
        </span>
        <span className="legend-header-pill">Guía de Casilla</span>
      </div>

      <div className="legend-anatomy">
        {/* Sample Tile (Carbon Z=6) */}
        <div
          className="legend-sample-tile"
          aria-label="Casilla de ejemplo: Carbono, Z=6, símbolo C, 12.011"
        >
          <div className="legend-tile-top">
            <span
              className={`legend-tile-z ${highlightedPart === "z" ? "is-highlighted" : ""}`}
              title="Número atómico Z (protones)"
            >
              6
            </span>
            <span
              className={`legend-tile-star ${highlightedPart === "star" ? "is-highlighted" : ""}`}
              title="Elemento esencial de examen preuniversitario"
            >
              ★
            </span>
          </div>

          <b
            className={`legend-tile-sym ${highlightedPart === "sym" ? "is-highlighted" : ""}`}
            aria-hidden="true"
          >
            C
          </b>

          <div className="legend-tile-bottom">
            <span className="legend-tile-name">Carbono</span>
            <span
              className={`legend-tile-prop ${highlightedPart === "prop" ? "is-highlighted" : ""}`}
            >
              {layerInfo.val}
            </span>
          </div>
        </div>

        {/* Anatomical Callout Indicators */}
        <div className="legend-callout-list">
          <div
            className={`legend-callout-row ${highlightedPart === "z" ? "is-active" : ""}`}
            onMouseEnter={() => setHighlightedPart("z")}
            onMouseLeave={() => setHighlightedPart(null)}
          >
            <span className="callout-arrow" aria-hidden="true">←</span>
            <span className="callout-tag tag-z">Z</span>
            <div className="callout-info">
              <span className="callout-title">Número Atómico (Z)</span>
              <span className="callout-desc">6 protones en el núcleo atómico</span>
            </div>
          </div>

          <div
            className={`legend-callout-row ${highlightedPart === "sym" ? "is-active" : ""}`}
            onMouseEnter={() => setHighlightedPart("sym")}
            onMouseLeave={() => setHighlightedPart(null)}
          >
            <span className="callout-arrow" aria-hidden="true">←</span>
            <span className="callout-tag tag-sym">Símbolo</span>
            <div className="callout-info">
              <span className="callout-title">Símbolo Químico</span>
              <span className="callout-desc">C · Identificador IUPAC (Carbono)</span>
            </div>
          </div>

          <div
            className={`legend-callout-row ${highlightedPart === "prop" ? "is-active" : ""}`}
            onMouseEnter={() => setHighlightedPart("prop")}
            onMouseLeave={() => setHighlightedPart(null)}
          >
            <span className="callout-arrow" aria-hidden="true">←</span>
            <span className="callout-tag tag-prop">{layerInfo.badge}</span>
            <div className="callout-info">
              <span className="callout-title">Propiedad / {layerInfo.label}</span>
              <span className="callout-desc">{layerInfo.detail}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`legend-preuni-footer ${highlightedPart === "star" ? "is-active" : ""}`}
        onMouseEnter={() => setHighlightedPart("star")}
        onMouseLeave={() => setHighlightedPart(null)}
        title="Elemento esencial preuniversitario"
      >
        <span className="preuni-star-badge" aria-hidden="true">★</span>
        <div className="preuni-footer-text">
          <strong>★ = Elemento esencial de examen preuniversitario</strong>
          <span>Priorizado en temarios de admisión (UNI, San Marcos, PUCP)</span>
        </div>
      </div>
    </div>
  );
}

const FormatConfig = ({ configStr }) => {
  if (!configStr) return "—";
  const parts = configStr.split(/([spdf]\d+)/);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/([spdf])(\d+)/);
        if (match) {
          return (
            <span key={i}>
              {match[1]}
              <sup>{match[2]}</sup>
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

function ElementModal({ element, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!element) return null;

  const familyClass = `family-${element.family
    .toLowerCase()
    .replace(/ /g, "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")}`;

  return (
    <div className={`modal-overlay-3d ${familyClass}-bg`} onClick={onClose}>
      <button className="modal-close-3d" onClick={onClose} aria-label="Cerrar">
        <X size={32} />
      </button>

      <div className="modal-split-layout" onClick={(e) => e.stopPropagation()}>
        {/* Left Side: Hero Image & Information */}
        <div className={`modal-hero-side ${familyClass}-bg`}>
          <img
            src={`/real-elements/${element.symbol.toLowerCase()}.jpg`}
            alt={`Apariencia natural de ${element.name}`}
            className="hero-side-bg"
            onError={(e) => {
              e.target.style.opacity = 0;
            }}
          />
          <div className="hero-side-gradient"></div>

          <div className="hero-side-content">
            <span className="hero-z-large">Z = {element.z}</span>
            <h1 className="hero-symbol-giant">{element.symbol}</h1>
            <h2 className="hero-name-large">{element.name}</h2>
            <div className="hero-family-badge">{element.family}</div>

            <div className="modal-meta-chips">
              {element.isPreUni && (
                <span className="meta-chip chip-preuni">★ 38 Esencial Preuni</span>
              )}
              <span className="meta-chip">Bloque {element.block.toUpperCase()}</span>
              <span className="meta-chip">{element.phase}</span>
              <span className="meta-chip">
                Período {element.period} · Grupo {element.group}
              </span>
            </div>

            <div className="hero-didactic-info">
              {(element.study_notes || element.nomenclaturaNotes) && (
                <div className="didactic-alert-hero">
                  <strong>⚠️ Clave de Examen y Notas de Estudio</strong>
                  <p>{element.study_notes || element.nomenclaturaNotes}</p>
                </div>
              )}
              {element.summary && (
                <div className="didactic-summary">
                  <p>{element.summary}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: AtomViewer3D and Periodic Data */}
        <div className="modal-data-side">
          <Suspense
            fallback={
              <div className="atom-loading-box">
                <span>Cargando modelo atómico 3D...</span>
              </div>
            }
          >
            <AtomViewer3D element={element} />
          </Suspense>

          <div className="data-grid-3d">
            <div className="glass-card">
              <span className="glass-label">Masa Atómica</span>
              <strong className="glass-value">{element.atomic_mass || element.mass} u</strong>
            </div>
            <div className="glass-card">
              <span className="glass-label">Configuración Cuántica</span>
              <strong className="glass-value">
                <FormatConfig configStr={element.electron_configuration || element.config} />
              </strong>
            </div>
            <div className="glass-card">
              <span className="glass-label">Estados de Oxidación</span>
              <strong className="glass-value">{element.oxidation_states || element.ox || "—"}</strong>
            </div>
            <div className="glass-card">
              <span className="glass-label">Electronegatividad</span>
              <strong className="glass-value">
                {(element.electronegativity || element.en) !== "—"
                  ? `${element.electronegativity || element.en} (Pauling)`
                  : "—"}
              </strong>
            </div>

            <div className="glass-card">
              <span className="glass-label">Radio Atómico</span>
              <strong className="glass-value">
                {element.radius ? `${element.radius} pm` : "—"}
              </strong>
            </div>
            <div className="glass-card">
              <span className="glass-label">1ª Energía de Ionización</span>
              <strong className="glass-value">
                {element.ionization ? `${element.ionization} kJ/mol` : "—"}
              </strong>
            </div>
            <div className="glass-card">
              <span className="glass-label">Bloque / Nivel</span>
              <strong className="glass-value">
                Bloque {element.block.toUpperCase()} · Período {element.period}
              </strong>
            </div>
            <div className="glass-card">
              <span className="glass-label">Electrones por Capa</span>
              <strong className="glass-value">
                {(element.shells || []).join(" - ") || "—"}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Layout({ children }) {
  const [streak, setStreak] = useState(getStudyStreak());
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("quimica-preuni-theme") === "dark"
  );

  useEffect(() => {
    const update = () => setStreak(getStudyStreak());
    window.addEventListener("study:updated", update);
    return () => window.removeEventListener("study:updated", update);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("quimica-preuni-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="38 Elementos, inicio">
          <img
            src={darkMode ? "/logo-dark.svg" : "/logo.svg"}
            alt="38 Elementos · La tabla periódica que sí cae"
          />
        </Link>
        <div className="header-actions">
          <span className="streak">
            <img
              src="/visuals/student-avatar.jpg"
              alt="Estudiante"
              className="avatar"
              loading="lazy"
            />
            <Flame size={16} aria-hidden="true" /> {streak} {streak === 1 ? "día" : "días"}
          </span>
          <button
            className="theme-toggle"
            onClick={() => setDarkMode((current) => !current)}
            aria-label={darkMode ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
            title={darkMode ? "Tema claro" : "Tema oscuro"}
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </header>
      {children}
      <aside className="contact-cta" aria-label="Únete a la comunidad">
        <div>
          <strong>Quiero aprender química de verdad</strong>
          <small style={{ display: "block", fontSize: "10px", opacity: 0.8, marginTop: "2px" }}>
            Clases en vivo · simulacros · comunidad
          </small>
        </div>
        <a href={communityUrl} target="_blank" rel="noreferrer">
          <Target size={15} aria-hidden="true" /> Unirme a Skool
        </a>
      </aside>
      <footer className="site-footer">
        Desarrollado por{" "}
        <a href="https://juan.cabellosalirrosas.com" target="_blank" rel="noreferrer">
          Xavier Cabello
        </a>
      </footer>
    </div>
  );
}

function Home() {
  const [tableMode, setTableMode] = useState(
    () => localStorage.getItem("quimica-preuni-table-mode") || "study"
  );
  const [studyDimOther, setStudyDimOther] = useState(true);
  const [query, setQuery] = useState("");
  const [examTrapFilter, setExamTrapFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const [selectedFamily, setSelectedFamily] = useState("all");
  const [selectedBlock, setSelectedBlock] = useState("all");
  const [selectedPhase, setSelectedPhase] = useState("all");
  const [tableLayer, setTableLayer] = useState("families");
  const [openTopic, setOpenTopic] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);

  // Advanced Interactive Tools State (Inspector, Trends, Heatmap, Temperature, Comparator)
  const [advancedTool, setAdvancedTool] = useState(null); // null | "inspector" | "trends" | "heatmap" | "temperature"

  // Inspector Sub-state
  const [focusedGroup, setFocusedGroup] = useState(null);
  const [lockedGroup, setLockedGroup] = useState(null);
  const [focusedPeriod, setFocusedPeriod] = useState(null);
  const [lockedPeriod, setLockedPeriod] = useState(null);
  const [activeBlock, setActiveBlock] = useState("all");

  // Trends Sub-state
  const [activeTrendId, setActiveTrendId] = useState("radius");

  // Heatmap Sub-state
  const [heatmapPropertyId, setHeatmapPropertyId] = useState("en");

  // Temperature Simulation Sub-state
  const [temperatureK, setTemperatureK] = useState(293.15); // ~20°C standard ambient
  const [tempUnit, setTempUnit] = useState("K");

  // Element Comparator Sub-state
  const [isComparing, setIsComparing] = useState(false);
  const [compareElements, setCompareElements] = useState([]);
  const [showComparatorModal, setShowComparatorModal] = useState(false);

  // Chemical Misconceptions Modal (RSC)
  const [showMisconceptionsModal, setShowMisconceptionsModal] = useState(false);

  const handleToggleCompare = (element) => {
    setCompareElements((prev) => {
      const exists = prev.some((el) => el.z === element.z);
      if (exists) {
        return prev.filter((el) => el.z !== element.z);
      }
      if (prev.length >= 2) {
        return [prev[0], element];
      }
      return [...prev, element];
    });
  };

  useEffect(() => {
    localStorage.setItem("quimica-preuni-table-mode", tableMode);
    const shell = document.querySelector(".app-shell");
    if (shell) {
      if (tableMode === "iupac") {
        shell.classList.add("shell-mode-iupac");
      } else {
        shell.classList.remove("shell-mode-iupac");
      }
    }
    return () => {
      const shell = document.querySelector(".app-shell");
      if (shell) shell.classList.remove("shell-mode-iupac");
    };
  }, [tableMode]);

  // Preload 3D atomic viewer during idle time for instant modal opening
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        const id = window.requestIdleCallback(() => {
          loadAtomViewer();
        });
        return () => window.cancelIdleCallback(id);
      } else {
        const timer = setTimeout(() => {
          loadAtomViewer();
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Compute elements to display reactively
  const { displayElements, countMatching } = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (tableMode === "study") {
      if (!studyDimOther) {
        // Only return matching preuni elements
        const list = elements.filter((el) => {
          if (!el.isPreUni) return false;
          const matchesQ =
            !q || `${el.name} ${el.symbol} ${el.z}`.toLowerCase().includes(q);
          const matchesCat = category === "all" || el.category === category;
          return matchesQ && matchesCat;
        });
        return { displayElements: list, countMatching: list.length };
      }

      // Map view: full grid with 38 highlighted and other 80 dimmed
      const list = elements.map((el) => {
        const matchesQ =
          !q || `${el.name} ${el.symbol} ${el.z}`.toLowerCase().includes(q);
        const matchesCat = category === "all" || el.category === category;
        const isActive = el.isPreUni && matchesQ && matchesCat;
        return {
          ...el,
          isDimmed: !isActive,
          isHighlighted: isActive
        };
      });
      const matchingCount = list.filter((e) => !e.isDimmed).length;
      return { displayElements: list, countMatching: matchingCount };
    }

    // IUPAC 118 Mode:
    const activeTargetGroup = lockedGroup || focusedGroup;
    const activeTargetPeriod = lockedPeriod || focusedPeriod;

    const list = elements.map((el) => {
      const matchesQ =
        !q || `${el.name} ${el.symbol} ${el.z}`.toLowerCase().includes(q);
      const matchesFam = selectedFamily === "all" || el.family === selectedFamily;
      const matchesBlock = selectedBlock === "all" || el.block === selectedBlock;
      const matchesPhase = selectedPhase === "all" || el.phase === selectedPhase;

      let matchesExamTrap = true;
      if (examTrapFilter !== "all" && examTrapDefinitions[examTrapFilter]) {
        matchesExamTrap = examTrapDefinitions[examTrapFilter].elements.includes(el.symbol);
      }

      // Group / Period / Quantum Block inspector filter
      let matchesInspector = true;
      if (advancedTool === "inspector") {
        if (activeTargetGroup && el.group !== activeTargetGroup) {
          matchesInspector = false;
        }
        if (activeTargetPeriod && el.period !== activeTargetPeriod) {
          matchesInspector = false;
        }
        if (activeBlock !== "all" && el.block !== activeBlock) {
          matchesInspector = false;
        }
      }

      const isMatch = matchesQ && matchesFam && matchesBlock && matchesPhase && matchesInspector && matchesExamTrap;

      const hasActiveFilters =
        Boolean(q) ||
        selectedFamily !== "all" ||
        selectedBlock !== "all" ||
        selectedPhase !== "all" ||
        examTrapFilter !== "all" ||
        (advancedTool === "inspector" &&
          (Boolean(activeTargetGroup) || Boolean(activeTargetPeriod) || activeBlock !== "all"));

      return {
        ...el,
        isDimmed: !isMatch,
        isHighlighted: isMatch && hasActiveFilters
      };
    });
    const matchingCount = list.filter((e) => !e.isDimmed).length;
    return { displayElements: list, countMatching: matchingCount };
  }, [
    tableMode,
    studyDimOther,
    query,
    category,
    selectedFamily,
    selectedBlock,
    selectedPhase,
    examTrapFilter,
    advancedTool,
    focusedGroup,
    lockedGroup,
    focusedPeriod,
    lockedPeriod,
    activeBlock
  ]);

  const completedTopics = topics.filter((topic) => getBestScore(topic.id)).length;
  const nextTopic =
    topics.find((topic) => getDueQuestions(topic.id).length > 0) ??
    topics.find((topic) => !getBestScore(topic.id)) ??
    topics[0];
  const diagnostic = getDiagnostic();
  const dueReviews = getDueReviewCount();

  const handlePlaceholderClick = (seriesName) => {
    if (tableMode !== "iupac") {
      setTableMode("iupac");
    }
    setSelectedFamily(seriesName === "Lantánidos" ? "Lantánido" : "Actínido");
  };

  const showSeriesPlaceholders = tableMode === "iupac" || studyDimOther;

  return (
    <main>
      <section className="learning-mode" aria-labelledby="mode-heading">
        <div>
          <span className="eyebrow">Aprendizaje adaptativo</span>
          <h2 id="mode-heading">Tu siguiente paso, con intención.</h2>
          <p>
            {diagnostic
              ? `Diagnóstico completado: ${diagnostic.score}/${diagnostic.total}.`
              : "Haz un diagnóstico breve para que la plataforma te recomiende una ruta."}
            {dueReviews > 0
              ? ` Tienes ${dueReviews} repaso${dueReviews === 1 ? "" : "s"} listo${dueReviews === 1 ? "" : "s"}.`
              : ""}
          </p>
        </div>
        <div className="learning-mode-actions">
          {!diagnostic && (
            <Link className="secondary-action" to="/diagnostico">
              <ListChecks size={16} /> Hacer diagnóstico
            </Link>
          )}
          {diagnostic && (
            <Link className="secondary-action" to="/diagnostico">
              Ver mi mapa
            </Link>
          )}
          <Link className="primary-action" to={`/quiz/${nextTopic.id}`}>
            <ListChecks size={16} /> {dueReviews > 0 ? "Repasar ahora" : "Continuar ruta"}
          </Link>
        </div>
      </section>

      <section className="pathways" aria-label="Rutas de aprendizaje">
        <Link to={`/quiz/${nextTopic.id}`}>
          <img src="/visuals/path-exam.jpg" alt="" loading="lazy" className="path-img" />
          <span className="eyebrow">Ruta Examen</span>
          <strong>Practica con foco</strong>
          <small>Preguntas, valencias y velocidad para tu próxima evaluación.</small>
        </Link>
        <Link to="/laboratorio">
          <img src="/visuals/path-understanding.jpg" alt="" loading="lazy" className="path-img" />
          <span className="eyebrow">Ruta Comprensión</span>
          <strong>Laboratorio PhET</strong>
          <small>Construye átomos, iones e isótopos con masa ponderada real.</small>
        </Link>
        <Link to="/docentes">
          <img src="/visuals/teacher-learning-map.jpg" alt="" loading="lazy" className="path-img" />
          <span className="eyebrow">Para acompañar</span>
          <strong>Vista docente</strong>
          <small>Observa progreso y conceptos que necesitan intervención.</small>
        </Link>
      </section>

      {/* Chemical Misconceptions Callout Banner */}
      <section className="misconceptions-callout-banner" aria-label="Trampas de examen y conceptos erróneos">
        <div className="banner-icon-wrap">
          <ShieldAlert size={28} />
        </div>
        <div className="banner-content">
          <span className="banner-badge">Didáctica Antialucinación · Estándar RSC</span>
          <h3>¿Sabías que el radio atómico disminuye hacia la derecha?</h3>
          <p>
            Aprende y supera las 6 trampas conceptuales clásicas de los exámenes UNI y San Marcos:
            atracción <em>Z</em><sub>eff</sub>, orden de pérdida de electrones en metales de transición, antiserrucho,
            valencia vs estado de oxidación y el cálculo de masa atómica decimal.
          </p>
        </div>
        <button
          type="button"
          className="banner-action-btn"
          onClick={() => setShowMisconceptionsModal(true)}
        >
          <Sparkles size={15} /> Explorar 6 Trampas de Examen
        </button>
      </section>

      {/* Hero Section adaptative to tableMode */}
      <section className="hero">
        <img
          src="/visuals/hero-periodic-map.jpg"
          alt="Mapa de la tabla periódica"
          className="hero-img"
          loading="lazy"
        />
        <div className="hero-content">
          {tableMode === "study" ? (
            <>
              <div className="hero-number">
                38 <span>de 118</span>
              </div>
              <h1>Esto es lo que necesitas memorizar.</h1>
              <p>
                Los 38 elementos marcados son los que sí caen en el examen. Los otros 80 están en
                gris: no pierdas tiempo con ellos.
              </p>
            </>
          ) : (
            <>
              <div className="hero-number">
                118 <span>IUPAC</span>
              </div>
              <h1>Catálogo Periódico Completo Oficial.</h1>
              <p>
                Explora los 118 elementos químicos, con configuración cuántica, bloques s, p, d, f,
                lantánidos, actínidos y visor 3D volumétrico.
              </p>
            </>
          )}
        </div>
      </section>

      <section className="study-guide" aria-labelledby="guide-heading">
        <div>
          <span className="eyebrow">Ruta sugerida</span>
          <h2 id="guide-heading">Aprende en orden, practica con intención.</h2>
          <p>
            {completedTopics === 0
              ? "Empieza por la base y avanza tema a tema."
              : `Has completado ${completedTopics} de ${topics.length} temas. Tu siguiente paso es ${nextTopic.title}.`}
          </p>
        </div>
        <Link className="primary-action" to={`/quiz/${nextTopic.id}`}>
          <ListChecks size={16} aria-hidden="true" />{" "}
          {completedTopics === topics.length ? "Repasar de nuevo" : "Continuar ruta"}
        </Link>
        <div
          className="route-progress"
          aria-label={`${completedTopics} de ${topics.length} temas completados`}
        >
          <span style={{ width: `${(completedTopics / topics.length) * 100}%` }} />
        </div>
        {completedTopics === topics.length && (
          <img
            src="/visuals/module-certificate.jpg"
            alt="Certificado de completitud"
            className="certificate-img"
            loading="lazy"
          />
        )}
      </section>

      <section className={`table-section mode-${tableMode}`} aria-labelledby="table-heading">
        <FactCarousel />
        <h2 id="table-heading" className="sr-only">
          Tabla periódica interactiva
        </h2>

        {/* Dual Mode Switcher Toolbar */}
        <div className="table-mode-switch-wrapper">
          <div className="mode-toggle-group" role="tablist" aria-label="Modo de visualización de la tabla">
            <button
              role="tab"
              aria-selected={tableMode === "study"}
              className={`mode-btn ${tableMode === "study" ? "active" : ""}`}
              onClick={() => setTableMode("study")}
            >
              <Target size={16} aria-hidden="true" />
              <span>Modo Estudio (38 Esenciales)</span>
              <span className="mode-pill">Preuni</span>
            </button>
            <button
              role="tab"
              aria-selected={tableMode === "iupac"}
              className={`mode-btn ${tableMode === "iupac" ? "active" : ""}`}
              onClick={() => setTableMode("iupac")}
            >
              <Atom size={16} aria-hidden="true" />
              <span>Modo Completo (118 IUPAC)</span>
              <span className="mode-pill">Oficial</span>
            </button>
          </div>

          <div className="mode-aux-options">
            {tableMode === "study" ? (
              <label>
                <input
                  type="checkbox"
                  checked={studyDimOther}
                  onChange={(e) => setStudyDimOther(e.target.checked)}
                />
                <span>Mostrar mapa con otros 80 atenuados</span>
              </label>
            ) : (
              <span className="filter-count-badge">
                Mostrando {countMatching} de 118 elementos
              </span>
            )}
          </div>
        </div>

        {/* Advanced Tools Toolbar (Disponible en ambos modos) */}
        <div className="advanced-tools-toolbar" role="toolbar" aria-label="Herramientas analíticas avanzadas">
          <button
            type="button"
            className={`adv-tool-btn ${advancedTool === "inspector" ? "active" : ""}`}
            onClick={() => {
              setAdvancedTool((curr) => (curr === "inspector" ? null : "inspector"));
              setLockedGroup(null);
              setFocusedGroup(null);
              setLockedPeriod(null);
              setFocusedPeriod(null);
              setActiveBlock("all");
            }}
            title="Inspecciona grupos IUPAC/CAS, períodos y configuraciones terminales"
          >
            <Columns3 size={15} />
            <span>Grupos y Períodos</span>
            <span className="adv-pill">Inspector</span>
          </button>

          <button
            type="button"
            className={`adv-tool-btn ${advancedTool === "trends" ? "active" : ""}`}
            onClick={() => setAdvancedTool((curr) => (curr === "trends" ? null : "trends"))}
            title="Vectores direccionales y justificación teórica de tendencias periódicas"
          >
            <Compass size={15} />
            <span>Tendencias Periódicas</span>
            <span className="adv-pill">Vectores</span>
          </button>

          <button
            type="button"
            className={`adv-tool-btn ${advancedTool === "heatmap" ? "active" : ""}`}
            onClick={() => setAdvancedTool((curr) => (curr === "heatmap" ? null : "heatmap"))}
            title="Gradiente cromático interactivo para EN, radios, ionización y puntos térmicos"
          >
            <Activity size={15} />
            <span>Mapa de Calor</span>
            <span className="adv-pill">Heatmap</span>
          </button>

          <button
            type="button"
            className={`adv-tool-btn ${advancedTool === "temperature" ? "active" : ""}`}
            onClick={() => setAdvancedTool((curr) => (curr === "temperature" ? null : "temperature"))}
            title="Simulador termodinámico de estados de agregación de 0 a 6000 K"
          >
            <Thermometer size={15} />
            <span>Temperatura y Fases</span>
            <span className="adv-pill">{Math.round(temperatureK)} K</span>
          </button>

          <button
            type="button"
            className={`adv-tool-btn ${isComparing ? "active" : ""}`}
            onClick={() => {
              setIsComparing(true);
              if (compareElements.length < 2) {
                const na = elements.find((e) => e.symbol === "Na");
                const cl = elements.find((e) => e.symbol === "Cl");
                if (na && cl) {
                  setCompareElements([na, cl]);
                }
              }
              setShowComparatorModal(true);
            }}
            title="Comparación lado a lado de 2 elementos con visor 3D y predicción de enlace"
          >
            <Scale size={15} />
            <span>Comparador</span>
            <span className="adv-pill">{compareElements.length > 0 ? `${compareElements.length}/2` : "Lado a Lado"}</span>
          </button>

          <button
            type="button"
            className="adv-tool-btn"
            onClick={() => setShowMisconceptionsModal(true)}
            title="Confronta y supera los 6 errores conceptuales y trampas clásicas de exámenes (Royal Society of Chemistry)"
          >
            <ShieldAlert size={15} />
            <span>Trampas RSC</span>
            <span className="adv-pill">6 Errores</span>
          </button>

          {advancedTool && (
            <button
              type="button"
              className="secondary-action"
              style={{ marginLeft: "auto", padding: "4px 10px", fontSize: "11px", minHeight: "28px" }}
              onClick={() => {
                setAdvancedTool(null);
                setLockedGroup(null);
                setFocusedGroup(null);
                setLockedPeriod(null);
                setFocusedPeriod(null);
                setActiveBlock("all");
              }}
            >
              <RotateCcw size={12} /> Desactivar herramientas
            </button>
          )}
        </div>

        {/* Inspector Subcontrols and Banner */}
        {advancedTool === "inspector" && (
          <>
            <div className="advanced-subcontrols-bar">
              <span className="subcontrol-label">Bloques Cuánticos:</span>
              <div className="subcontrol-chips">
                {["all", "s", "p", "d", "f"].map((blk) => (
                  <button
                    key={blk}
                    type="button"
                    className={`subcontrol-chip ${activeBlock === blk ? "active" : ""}`}
                    onClick={() => {
                      setActiveBlock(blk);
                      setLockedGroup(null);
                      setFocusedGroup(null);
                      setLockedPeriod(null);
                      setFocusedPeriod(null);
                    }}
                  >
                    {blk === "all" ? "Todos los bloques" : `Bloque ${blk.toUpperCase()}`}
                  </button>
                ))}
              </div>
              {(lockedGroup || lockedPeriod || activeBlock !== "all") && (
                <button
                  type="button"
                  className="secondary-action"
                  style={{ marginLeft: "auto", padding: "3px 8px", fontSize: "11px", minHeight: "26px" }}
                  onClick={() => {
                    setLockedGroup(null);
                    setFocusedGroup(null);
                    setLockedPeriod(null);
                    setFocusedPeriod(null);
                    setActiveBlock("all");
                  }}
                >
                  Limpiar selección
                </button>
              )}
            </div>

            <GroupPeriodBanner
              focusedGroup={lockedGroup || focusedGroup}
              focusedPeriod={lockedPeriod || focusedPeriod}
              activeBlock={activeBlock !== "all" ? activeBlock : null}
              onClear={() => {
                setLockedGroup(null);
                setFocusedGroup(null);
                setLockedPeriod(null);
                setFocusedPeriod(null);
                setActiveBlock("all");
              }}
            />
          </>
        )}

        {/* Trends Subcontrols and Banner */}
        {advancedTool === "trends" && (
          <>
            <div className="advanced-subcontrols-bar">
              <span className="subcontrol-label">Propiedad Periódica:</span>
              <div className="subcontrol-chips">
                {periodicTrendsData.map((tr) => (
                  <button
                    key={tr.id}
                    type="button"
                    className={`subcontrol-chip ${activeTrendId === tr.id ? "active" : ""}`}
                    onClick={() => setActiveTrendId(tr.id)}
                  >
                    {tr.label}
                  </button>
                ))}
              </div>
            </div>
            <PeriodicTrendRationaleBanner
              activeTrendId={activeTrendId}
              onClearTrend={() => setAdvancedTool(null)}
            />
          </>
        )}

        {/* Heatmap Subcontrols and Legend */}
        {advancedTool === "heatmap" && (
          <>
            <div className="advanced-subcontrols-bar">
              <span className="subcontrol-label">Métrica de Calor:</span>
              <div className="subcontrol-chips">
                {periodicTrendsData.map((tr) => (
                  <button
                    key={tr.id}
                    type="button"
                    className={`subcontrol-chip ${heatmapPropertyId === tr.id ? "active" : ""}`}
                    onClick={() => setHeatmapPropertyId(tr.id)}
                  >
                    {tr.label}
                  </button>
                ))}
              </div>
            </div>
            <HeatmapLegend
              activePropertyId={heatmapPropertyId}
              onChangeProperty={setHeatmapPropertyId}
              onClearHeatmap={() => setAdvancedTool(null)}
            />
          </>
        )}

        {/* Temperature Simulator */}
        {advancedTool === "temperature" && (
          <TemperatureSlider
            temperatureK={temperatureK}
            onChangeTemperature={setTemperatureK}
            tempUnit={tempUnit}
            onToggleTempUnit={() => setTempUnit((u) => (u === "K" ? "C" : "K"))}
            elements={displayElements}
            onClose={() => setAdvancedTool(null)}
          />
        )}

        {/* Search input common to both modes */}
        <label className="search">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Buscar elemento</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Busca por nombre, símbolo o número — ej. hierro, Fe, 26, oro, Au, 79"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{ background: "none", border: "none", color: "inherit", padding: 0 }}
              aria-label="Limpiar búsqueda"
            >
              <X size={15} />
            </button>
          )}
        </label>

        {/* Mode-specific Filters */}
        {tableMode === "study" ? (
          <div className="filters" role="group" aria-label="Filtrar elementos preuniversitarios">
            {categories.map((item) => (
              <button
                key={item.id}
                className={category === item.id ? "active" : ""}
                onClick={() => setCategory(item.id)}
                aria-pressed={category === item.id}
              >
                {item.label} <small>{item.count}</small>
              </button>
            ))}
          </div>
        ) : (
          <div className="advanced-filters-bar" role="toolbar" aria-label="Filtros avanzados IUPAC">
            <div className="filter-select-group">
              <label htmlFor="filter-family">Familia:</label>
              <select
                id="filter-family"
                value={selectedFamily}
                onChange={(e) => setSelectedFamily(e.target.value)}
              >
                {iupacFamilies.map((fam) => (
                  <option key={fam.id} value={fam.id}>
                    {fam.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-select-group">
              <label htmlFor="filter-block">Bloque:</label>
              <select
                id="filter-block"
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
              >
                {quantumBlocks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-select-group">
              <label htmlFor="filter-phase">Estado:</label>
              <select
                id="filter-phase"
                value={selectedPhase}
                onChange={(e) => setSelectedPhase(e.target.value)}
              >
                {aggregationPhases.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {(selectedFamily !== "all" || selectedBlock !== "all" || selectedPhase !== "all") && (
              <button
                className="secondary-action"
                style={{ padding: "4px 8px", minHeight: "32px" }}
                onClick={() => {
                  setSelectedFamily("all");
                  setSelectedBlock("all");
                  setSelectedPhase("all");
                  setExamTrapFilter("all");
                }}
              >
                Reiniciar filtros
              </button>
            )}
          </div>
        )}

                {/* Quick Exam Traps Focus Bar */}
        <div className="exam-traps-bar" role="toolbar" aria-label="Filtros rápidos de trampas de examen">
          <div className="traps-label-group">
            <AlertTriangle size={14} className="text-amber" />
            <span>Foco Trampas UNI / San Marcos:</span>
          </div>
          <div className="traps-buttons-group">
            <button
              type="button"
              className={`trap-pill-btn ${examTrapFilter === "all" ? "active" : ""}`}
              onClick={() => setExamTrapFilter("all")}
            >
              Todos
            </button>
            <button
              type="button"
              className={`trap-pill-btn ${examTrapFilter === "antiserrucho" ? "active" : ""}`}
              onClick={() => setExamTrapFilter((curr) => (curr === "antiserrucho" ? "all" : "antiserrucho"))}
              title="Elementos con anomalías cuánticas Aufbau: Cr, Cu, Mo, Ag, Au, Pt, Pd"
            >
              ⚡ Antiserrucho (Cr, Cu...)
            </button>
            <button
              type="button"
              className={`trap-pill-btn ${examTrapFilter === "anfoterismo" ? "active" : ""}`}
              onClick={() => setExamTrapFilter((curr) => (curr === "anfoterismo" ? "all" : "anfoterismo"))}
              title="Elementos anfóteros y valencias variables por función: Mn, Cr, V, N, Al, Zn, Pb, Sn"
            >
              🧪 Anfóteros & Val. Variable (Mn, Cr...)
            </button>
            <button
              type="button"
              className={`trap-pill-btn ${examTrapFilter === "liquidos-gases" ? "active" : ""}`}
              onClick={() => setExamTrapFilter((curr) => (curr === "liquidos-gases" ? "all" : "liquidos-gases"))}
              title="Hg y Br (únicos 2 líquidos a 25°C) más los 11 gases elementales"
            >
              💧 Líquidos & Gases (STP)
            </button>
            <button
              type="button"
              className={`trap-pill-btn ${examTrapFilter === "isoelectronicos" ? "active" : ""}`}
              onClick={() => setExamTrapFilter((curr) => (curr === "isoelectronicos" ? "all" : "isoelectronicos"))}
              title="Especies y átomos isoelectrónicos de examen (con Neón Z=10 y Argón Z=18)"
            >
              🎯 Isoelectrónicos
            </button>
          </div>
          {examTrapFilter !== "all" && (
            <button
              type="button"
              className="trap-clear-btn"
              onClick={() => setExamTrapFilter("all")}
              title="Quitar filtro de trampa de examen"
            >
              <X size={13} /> Limpiar foco
            </button>
          )}
        </div>

        {/* Contextual Rationale Banner for Active Exam Trap */}
        {examTrapFilter !== "all" && examTrapDefinitions[examTrapFilter] && (
          <div className="exam-trap-banner">
            <div className="trap-banner-header">
              <div className="trap-banner-title">
                <AlertTriangle size={18} className="text-amber" />
                <strong>{examTrapDefinitions[examTrapFilter].title}</strong>
              </div>
              <button
                type="button"
                className="trap-banner-close"
                onClick={() => setExamTrapFilter("all")}
                aria-label="Cerrar aviso de trampa de examen"
              >
                <X size={16} />
              </button>
            </div>
            <p className="trap-banner-text">{examTrapDefinitions[examTrapFilter].description}</p>
            <div className="trap-banner-elements-list">
              <small>Elementos destacados:</small>
              {examTrapDefinitions[examTrapFilter].elements.map((sym) => (
                <span key={sym} className="trap-elem-chip">
                  <b>{sym}</b>
                </span>
              ))}
            </div>
          </div>
        )}

<div className="table-controls-wrapper">
          <div className="table-layers" role="group" aria-label="Capas de la tabla">
            {tableLayers.map((layer) => (
              <button
                key={layer.id}
                className={tableLayer === layer.id ? "active" : ""}
                onClick={() => setTableLayer(layer.id)}
                aria-pressed={tableLayer === layer.id}
              >
                {layer.label}
              </button>
            ))}
          </div>
          <ElementLegend tableMode={tableMode} tableLayer={tableLayer} />
        </div>

        {/* The Periodic Board Layout */}
        <div className="periodic-board-container">
          {advancedTool === "trends" && (
            <PeriodicTrendsVectors
              activeTrendId={activeTrendId}
              onClearTrend={() => setActiveTrendId(null)}
            />
          )}

          <div className="periodic-board-scroll">
            {(tableMode === "iupac" || advancedTool === "inspector") && (
              <GroupHeaders
                activeGroup={lockedGroup || focusedGroup}
                onHoverGroup={(grp) => !lockedGroup && setFocusedGroup(grp)}
                onClickGroup={(grp) => {
                  setLockedGroup((prev) => (prev === grp ? null : grp));
                  setLockedPeriod(null);
                  setActiveBlock("all");
                }}
                onClearGroup={() => {
                  setLockedGroup(null);
                  setFocusedGroup(null);
                }}
              />
            )}

            <div className="periodic-board-main-row">
              {(tableMode === "iupac" || advancedTool === "inspector") && (
                <PeriodHeaders
                  activePeriod={lockedPeriod || focusedPeriod}
                  onHoverPeriod={(p) => !lockedPeriod && setFocusedPeriod(p)}
                  onClickPeriod={(p) => {
                    setLockedPeriod((prev) => (prev === p ? null : p));
                    setLockedGroup(null);
                    setActiveBlock("all");
                  }}
                />
              )}

              <div
                className={`periodic-grid layer-${tableLayer} ${
                  showSeriesPlaceholders ? "has-f-block" : ""
                } ${advancedTool === "heatmap" ? "is-heatmap-active" : ""}`}
                aria-live="polite"
              >
                {/* Series Placeholders for Lanthanides and Actinides */}
                {showSeriesPlaceholders && (
                  <>
                    <button
                      type="button"
                      className="table-placeholder"
                      style={{ gridColumn: 3, gridRow: 6 }}
                      onClick={() => handlePlaceholderClick("Lantánidos")}
                      title="Ver serie de los Lantánidos (Z=57 a 71)"
                      aria-label="Serie Lantánidos 57 a 71"
                    >
                      <small>57-71</small>
                      <b>La-Lu</b>
                    </button>

                    <button
                      type="button"
                      className="table-placeholder"
                      style={{ gridColumn: 3, gridRow: 7 }}
                      onClick={() => handlePlaceholderClick("Actínidos")}
                      title="Ver serie de los Actínidos (Z=89 a 103)"
                      aria-label="Serie Actínidos 89 a 103"
                    >
                      <small>89-103</small>
                      <b>Ac-Lr</b>
                    </button>

                    {/* F-Block Series Row Labels in Rows 9 and 10 (Row 8 is spacer) */}
                    <div
                      className="series-label series-label-lanthanides"
                      style={{ gridColumn: "1 / 4", gridRow: 9 }}
                    >
                      <span>Lantánidos · 57–71</span>
                      <span className="series-arrow" aria-hidden="true">➔</span>
                    </div>

                    <div
                      className="series-label series-label-actinides"
                      style={{ gridColumn: "1 / 4", gridRow: 10 }}
                    >
                      <span>Actínidos · 89–103</span>
                      <span className="series-arrow" aria-hidden="true">➔</span>
                    </div>
                  </>
                )}

                {/* Render Elements */}
                {displayElements.map((element) => {
                  const familyClass = `family-${element.family
                    .toLowerCase()
                    .replace(/ /g, "-")
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")}`;

                  const isCompareSelected = compareElements.some((el) => el.z === element.z);

                  // Phase at current temperature
                  const phaseAtTemp =
                    advancedTool === "temperature"
                      ? getElementPhaseAtTemp(element, temperatureK)
                      : null;

                  // Trend value for heatmap
                  const trendVal =
                    advancedTool === "heatmap"
                      ? getElementTrendValue(element, heatmapPropertyId)
                      : null;
                  const currentTrend =
                    advancedTool === "heatmap"
                      ? periodicTrendsData.find((t) => t.id === heatmapPropertyId)
                      : null;

                  const heatmapColor =
                    currentTrend && trendVal !== null
                      ? getHeatmapColor(trendVal, currentTrend.min, currentTrend.max)
                      : null;

                  const hasNoHeatmapData =
                    advancedTool === "heatmap" && trendVal === null;

                  const classes = [
                    "element",
                    familyClass,
                    element.isDimmed ? "is-dimmed" : "",
                    element.isHighlighted ? "is-preuni-highlight" : "",
                    phaseAtTemp ? `phase-${phaseAtTemp}` : "",
                    hasNoHeatmapData ? "has-no-heatmap-data" : "",
                    isCompareSelected ? "is-selected-for-compare" : ""
                  ]
                    .filter(Boolean)
                    .join(" ");

                  // Grid row: Row 8 is a dedicated separator gap between Period 7 and F-Block.
                  // Lanthanides (row 8) -> gridRow 9; Actinides (row 9) -> gridRow 10.
                  const gridRow =
                    showSeriesPlaceholders && element.row >= 8
                      ? element.row + 1
                      : element.row;

                  const cardStyle = {
                    gridColumn: element.col,
                    gridRow: gridRow,
                    cursor: "pointer",
                    textDecoration: "none",
                    ...(heatmapColor
                      ? {
                          backgroundColor: heatmapColor,
                          borderColor: "rgba(255, 255, 255, 0.45)"
                        }
                      : {})
                  };

                  const bottomDisplay =
                    advancedTool === "heatmap"
                      ? trendVal !== null
                        ? `${trendVal} ${currentTrend ? currentTrend.unit : ""}`
                        : "—"
                      : tableLayer === "families"
                      ? element.mass
                      : layerValue(element, tableLayer);

                  return (
                    <Link
                      key={element.z}
                      to={`/elemento/${element.symbol.toLowerCase()}`}
                      className={classes}
                      data-row={element.row}
                      style={cardStyle}
                      onClick={(e) => {
                        if (isComparing) {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleCompare(element);
                        }
                      }}
                      onMouseEnter={loadAtomViewer}
                      onTouchStart={loadAtomViewer}
                      onFocus={loadAtomViewer}
                      title={
                        isComparing
                          ? `Seleccionar ${element.name} para comparar`
                          : `Ver ficha de estudio y estructura de ${element.name} (${element.symbol})`
                      }
                      aria-label={`${element.name}, número atómico ${element.z}, símbolo ${element.symbol}`}
                    >
                      {isComparing && (
                        <span className="element-compare-badge" title="Comparar">
                          {isCompareSelected ? <Check size={8} /> : <Plus size={8} />}
                        </span>
                      )}
                      <small>{element.z}</small>
                      <b aria-hidden="true">{element.symbol}</b>
                      <span aria-hidden="true">{bottomDisplay}</span>
                      {advancedTool === "temperature" && phaseAtTemp && (
                        <span
                          className="element-phase-tag"
                          title={`Fase a ${Math.round(temperatureK)} K: ${phaseAtTemp}`}
                        >
                          {phaseAtTemp === "liquid" ? "💧" : phaseAtTemp === "gas" ? "💨" : ""}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {!displayElements.length && (
          <p className="empty-state">No encontramos elementos con ese criterio de búsqueda.</p>
        )}
      </section>

      <section className="topics" aria-labelledby="topics-heading">
        <div className="section-heading">
          <div>
            <h2 id="topics-heading">Chuletas por tema</h2>
            <p>Ocho recorridos para estudiar, practicar y revisar.</p>
          </div>
          <span>
            {completedTopics}/{topics.length} completados
          </span>
        </div>
        {topics.map((topic) => {
          const best = getBestScore(topic.id);
          const mistakes = getMistakes(topic.id);
          return (
            <article className={`topic ${openTopic === topic.id ? "expanded" : ""}`} key={topic.id}>
              <button
                className="topic-toggle"
                onClick={() => setOpenTopic(openTopic === topic.id ? null : topic.id)}
                aria-expanded={openTopic === topic.id}
              >
                <span className="topic-number">{topic.number}</span>
                <span>
                  <strong>{topic.title}</strong>
                  <small>
                    {topic.tag}
                    {best ? ` · Mejor: ${best.score}/${best.total}` : " · Sin intentar"}
                  </small>
                </span>
                <ChevronDown size={17} aria-hidden="true" />
              </button>
              {openTopic === topic.id && (
                <div className="topic-body">
                  <div className="topic-meta">
                    <span>{topic.level}</span>
                    <span>{topic.duration}</span>
                  </div>
                  <p>{topic.description}</p>
                  <p className="prerequisite">
                    <strong>Antes de empezar:</strong> {topic.prerequisite}
                  </p>
                  <div className="topic-actions">
                    <Link className="primary-action" to={`/quiz/${topic.id}`}>
                      <ListChecks size={16} aria-hidden="true" /> Practicar este tema
                    </Link>
                    {mistakes.length > 0 && (
                      <Link className="secondary-action" to={`/quiz/${topic.id}?mode=mistakes`}>
                        <CheckCircle size={16} aria-hidden="true" /> Repasar {mistakes.length} error
                        {mistakes.length === 1 ? "" : "es"}
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </section>

      <ElementModal element={selectedElement} onClose={() => setSelectedElement(null)} />

      {/* Floating Compare Tray */}
      {isComparing && compareElements.length > 0 && (
        <aside className="floating-compare-tray" role="region" aria-label="Bandeja de comparación">
          <div className="tray-chips-wrap">
            <Scale size={18} />
            <span>Comparar ({compareElements.length}/2):</span>
            {compareElements.map((el) => (
              <span key={el.z} className="tray-element-chip">
                <strong>{el.symbol}</strong> ({el.name})
                <button
                  type="button"
                  onClick={() => handleToggleCompare(el)}
                  style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: "0 2px" }}
                  aria-label={`Quitar ${el.name}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {compareElements.length < 2 && (
              <small style={{ opacity: 0.8, fontStyle: "italic", marginLeft: "4px" }}>
                + Selecciona 1 más en la tabla
              </small>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
            <button
              type="button"
              className="tray-btn-open"
              onClick={() => setShowComparatorModal(true)}
            >
              <Scale size={14} /> Abrir Comparación
            </button>

            <button
              type="button"
              className="tray-btn-clear"
              onClick={() => setCompareElements([])}
              title="Limpiar selección"
            >
              Limpiar
            </button>
          </div>
        </aside>
      )}

      {/* Side-by-Side Comparator Modal */}
      {showComparatorModal && (
        <ElementComparatorModal
          compareElements={compareElements}
          onRemoveElement={(el) => handleToggleCompare(el)}
          onClearAll={() => setCompareElements([])}
          onClose={() => setShowComparatorModal(false)}
        />
      )}

      {/* Royal Society of Chemistry Misconceptions Guide Modal */}
      <MisconceptionsGuideModal
        isOpen={showMisconceptionsModal}
        onClose={() => setShowMisconceptionsModal(false)}
      />
    </main>
  );
}

function App() {
  return (
    <Suspense
      fallback={
        <main className="quiz-page">
          <p>Cargando...</p>
        </main>
      }
    >
      <Routes>
        <Route path="/elemento/:elementId" element={<ElementDetailPage />} />
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/diagnostico" element={<DiagnosticPage />} />
                <Route path="/laboratorio" element={<LabPage />} />
                <Route path="/docentes" element={<TeacherPage />} />
                <Route path="/quiz/:topicId" element={<QuizPage />} />
                <Route
                  path="*"
                  element={
                    <section className="not-found">
                      <h1>Página no encontrada</h1>
                      <Link to="/">Volver al inicio</Link>
                    </section>
                  }
                />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
