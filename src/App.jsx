import { Component, lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  Atom,
  BookOpen,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Compass,
  Download,
  Eye,
  FileText,
  Filter,
  Flame,
  Layers,
  Lightbulb,
  ListChecks,
  Moon,
  Pause,
  Play,
  Plus,
  QrCode,
  RotateCcw,
  Scale,
  Search,
  ShieldAlert,
  Shuffle,
  Sparkles,
  Sun,
  Target,
  ArrowUpRight,
  Thermometer,
  X,
  ZoomIn,
  MessageCircle
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
import { ElementSpellerModal } from "./components/ElementSpellerModal.jsx";
import { StudyGuideModal } from "./components/StudyGuideModal.jsx";
import { LaminasViewerModal } from "./components/LaminasViewerModal.jsx";
import { communityUrl, whatsappCommunityUrl } from "./config.js";
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
  {
    id: "francio",
    tag: "Rareza Natural",
    category: "Metales Alcalinos",
    elements: ["Fr"],
    title: "El elemento natural más escaso de la Tierra",
    text: "El Francio (Fr, Z=87) es tan inestable que se calcula que en toda la corteza terrestre solo existen entre 20 y 30 gramos en cualquier momento.",
    examTip: "En exámenes nunca te pedirán reacciones químicas del Francio: todos sus isótopos son intensamente radiactivos (el ²²³Fr tiene una vida media de apenas 22 minutos)."
  },
  {
    id: "liquidos",
    tag: "Fases a 25 °C",
    category: "Estados de Agregación",
    elements: ["Hg", "Br"],
    title: "Los únicos 2 elementos líquidos a temperatura ambiente",
    text: "En toda la tabla de 118 elementos, a 25 °C y 1 atm solo existen dos líquidos: el Mercurio (Hg, metal) y el Bromo (Br, no metal).",
    examTip: "Pregunta trampa recurrente: el Galio (Ga, 29.7 °C) y el Cesio (Cs, 28.5 °C) son sólidos a 25 °C estándar, aunque funden fácilmente con el calor de la mano."
  },
  {
    id: "wolframio",
    tag: "Punto de Fusión",
    category: "Metales de Transición",
    elements: ["W"],
    title: "El metal con mayor punto de fusión de la tabla",
    text: "El Wolframio o Tungsteno (W, Z=74) resiste hasta los 3422 °C antes de fundirse. Por eso fue la base de los filamentos de lámparas incandescentes durante más de un siglo.",
    examTip: "Su símbolo W proviene de su nombre mineralógico alemán 'Wolfram'. Pertenece al grupo 6 (VIB) y período 6."
  },
  {
    id: "densidad",
    tag: "Densidad Extrema",
    category: "Metales de Transición",
    elements: ["Os", "Ir"],
    title: "Las dos sustancias naturales más densas del planeta",
    text: "El Osmio (Os, 22.59 g/cm³) y el Iridio (Ir, 22.56 g/cm³) duplican la densidad del plomo. Una simple botella de 1 litro llena de Osmio pesaría más de 22.5 kilogramos.",
    examTip: "En la tabla periódica, la densidad máxima se sitúa en el bloque d inferior central (período 6, metales de transición pesados)."
  },
  {
    id: "helio",
    tag: "Astronomía",
    category: "Gases Nobles",
    elements: ["He"],
    title: "Descubierto en el Sol antes que en la propia Tierra",
    text: "El Helio (He, Z=2) fue detectado en 1868 como una línea espectral amarilla en la corona solar durante un eclipse en la India, 27 años antes de ser aislado en un laboratorio terrestre.",
    examTip: "Su nombre proviene de 'Helios' (dios griego del Sol). Es el segundo elemento más abundante del universo observable después del Hidrógeno."
  },
  {
    id: "fluor",
    tag: "Electronegatividad",
    category: "Halógenos",
    elements: ["F"],
    title: "El elemento más electronegativo y voraz",
    text: "El Flúor (F, Z=9) encabeza la escala de Pauling con 3.98 de electronegatividad. Es tan ávido de electrones que reacciona violentamente con agua, vidrio y metales nobles.",
    examTip: "Tendencia periódica de oro: la electronegatividad aumenta hacia la derecha en un período y hacia arriba en un grupo, alcanzando su ápice en el Flúor."
  },
  {
    id: "antiserrucho",
    tag: "Trampa UNI Clásica",
    category: "Configuración Electrónica",
    elements: ["Cr", "Cu"],
    title: "Las anomalías d⁴ y d⁹ (Regla del Antiserrucho)",
    text: "El Cromo (Cr, Z=24) y el Cobre (Cu, Z=29) rompen la regla de Aufbau estándar: terminan en 4s¹ 3d⁵ y 4s¹ 3d¹⁰ para lograr orbitales semillenos o llenos de menor energía.",
    examTip: "¡Trampa fija en UNI y San Marcos! Escribir 4s² 3d⁴ para el Cr o 4s² 3d⁹ para el Cu te anula el problema de configuración electrónica."
  },
  {
    id: "carbono",
    tag: "Alotropía",
    category: "Carbonoides",
    elements: ["C"],
    title: "Del grafito blando al diamante indestructible",
    text: "El Carbono (C) posee la alotropía más espectacular: en grafito forma láminas hexagonales conductoras y lubricantes (sp²); en diamante forma una red tetraédrica hiperdura y aislante (sp³).",
    examTip: "Alótropos clásicos de examen: Carbono (grafito/diamante), Oxígeno (O₂/O₃), Fósforo (blanco/rojo) y Azufre (rómbico/monoclínico)."
  },
  {
    id: "galio",
    tag: "Predicción Mendeléyev",
    category: "Metales Térreos",
    elements: ["Ga"],
    title: "El elemento predicho con exactitud matemática",
    text: "Dmitri Mendeléyev predijo en 1869 las propiedades exactas del 'Eka-aluminio': masa atómica ~68, densidad 5.9 g/cm³ y bajo punto de fusión. En 1875 se descubrió el Galio confirmándolo.",
    examTip: "Mendeléyev dejó casilleros vacíos para elementos desconocidos (Eka-boro = Escandio, Eka-aluminio = Galio, Eka-silicio = Germanio), consolidando su ley periódica."
  },
  {
    id: "oro",
    tag: "Maleabilidad Extrema",
    category: "Metales Nobles",
    elements: ["Au"],
    title: "Un solo gramo cubre un metro cuadrado",
    text: "El Oro (Au, Z=79) es el metal más maleable que existe. Con apenas 1 gramo se puede laminar una hoja semitransparente de 1 m² con unos 200 átomos de grosor.",
    examTip: "El oro no reacciona con ácidos simples (HCl, HNO₃ por separado). Solo se disuelve en agua regia (mezcla 3:1 de HCl y HNO₃ concentrados)."
  },
  {
    id: "astato",
    tag: "Radioisótopos",
    category: "Halógenos",
    elements: ["At"],
    title: "Menos de 1 gramo en toda la corteza terrestre",
    text: "El Ástato (At, Z=85) es el segundo elemento natural más escaso del planeta. Su desintegración radiactiva es tan veloz que nunca se ha visto a simple vista una masa macroscópica.",
    examTip: "Pertenece al grupo 17 (VIIA). Aunque se clasifica como halógeno, sus propiedades físicas evidencian un marcado carácter metálico por efecto relativista."
  },
  {
    id: "hidrogeno",
    tag: "El Huérfano de la Tabla",
    category: "No Metales",
    elements: ["H"],
    title: "El 75% de la masa de todo el Cosmos",
    text: "El Hidrógeno (H) constituye tres cuartas partes de la materia ordinaria del universo. Aunque se dibuja sobre el grupo 1 por tener 1s¹, no es un metal alcalino sino un gas diatómico (H₂).",
    examTip: "Pregunta teórica frecuente: el Hidrógeno NO forma parte de la familia de los metales alcalinos; carece de grupo químico idéntico al resto."
  }
];

function FactCarousel() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showExamTip, setShowExamTip] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  const currentFact = chemistryFacts[currentIndex] || chemistryFacts[0];

  // Auto-advance every 9 seconds, pauses when user requests
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % chemistryFacts.length);
      setShowExamTip(false);
    }, 9000);
    return () => clearInterval(timer);
  }, [isPaused, currentIndex]);

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + chemistryFacts.length) % chemistryFacts.length);
    setShowExamTip(false);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % chemistryFacts.length);
    setShowExamTip(false);
  };

  const handleShuffle = (e) => {
    e?.stopPropagation();
    let nextIdx = Math.floor(Math.random() * chemistryFacts.length);
    if (nextIdx === currentIndex) {
      nextIdx = (currentIndex + 1) % chemistryFacts.length;
    }
    setCurrentIndex(nextIdx);
    setShowExamTip(false);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStart(null);
  };

  return (
    <div
      className={`fact-carousel ${isPaused ? "is-paused" : ""}`}
      aria-label="Datos curiosos sobre química y tips de examen"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header Row with Eyebrow, Category Tag & Playback Controls */}
      <div className="fact-carousel-header">
        <div className="fact-header-left">
          <span className="fact-eyebrow">
            <Lightbulb size={15} className="text-amber" aria-hidden="true" />
            <span>¿Sabías que...?</span>
          </span>
          <span className="fact-tag-badge">{currentFact.tag}</span>
        </div>

        {/* Carousel Control Bar */}
        <div className="fact-controls" role="toolbar" aria-label="Controles del carrusel">
          <button
            type="button"
            className="fact-ctrl-btn"
            onClick={handlePrev}
            aria-label="Dato anterior"
            title="Dato anterior"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            className={`fact-ctrl-btn ${isPaused ? "active-pause" : ""}`}
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? "Reanudar rotación automática" : "Pausar rotación"}
            title={isPaused ? "Reanudar rotación automática" : "Pausar rotación"}
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
          </button>

          <button
            type="button"
            className="fact-ctrl-btn"
            onClick={handleNext}
            aria-label="Siguiente dato"
            title="Siguiente dato"
          >
            <ChevronRight size={16} />
          </button>

          <button
            type="button"
            className="fact-ctrl-btn shuffle-btn"
            onClick={handleShuffle}
            aria-label="Dato aleatorio"
            title="Dato al azar"
          >
            <Shuffle size={13} />
          </button>
        </div>
      </div>

      {/* Main Fact Card */}
      <div className="fact-carousel-body" key={currentFact.id}>
        <h3 className="fact-title">{currentFact.title}</h3>
        <p className="fact-text">{currentFact.text}</p>

        {/* Elements Group & Exam Tip Toggle */}
        <div className="fact-footer-row">
          {currentFact.elements && currentFact.elements.length > 0 && (
            <div className="fact-elements-group">
              <span className="fact-elements-label">Explorar elemento:</span>
              {currentFact.elements.map((sym) => {
                const elData = elements.find((e) => e.symbol === sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    className="fact-element-chip"
                    onClick={() => navigate(`/elemento/${sym.toLowerCase()}`)}
                    title={`Ver ficha completa de ${elData?.name || sym} (Z=${elData?.z || "?"})`}
                  >
                    <strong>{sym}</strong>
                    <span>{elData?.name || sym}</span>
                    <ArrowUpRight size={12} />
                  </button>
                );
              })}
            </div>
          )}

          {currentFact.examTip && (
            <button
              type="button"
              className={`fact-tip-toggle ${showExamTip ? "expanded" : ""}`}
              onClick={() => setShowExamTip(!showExamTip)}
              aria-expanded={showExamTip}
            >
              <Sparkles size={13} />
              <span>{showExamTip ? "Ocultar tip admisión" : "¿Cómo cae en el examen?"}</span>
            </button>
          )}
        </div>

        {/* Revealed Admission Tip Box */}
        {showExamTip && currentFact.examTip && (
          <div className="fact-exam-tip-revealed">
            <strong>Clave Pre-UNI / San Marcos:</strong>
            <p>{currentFact.examTip}</p>
          </div>
        )}
      </div>

      {/* Navigation Indicators & Status */}
      <div className="fact-carousel-bottom">
        <div className="carousel-dots" role="tablist" aria-label="Indicadores de datos curiosos">
          {chemistryFacts.map((fact, idx) => (
            <button
              key={fact.id}
              type="button"
              className={`dot ${idx === currentIndex ? "active" : ""}`}
              onClick={() => {
                setCurrentIndex(idx);
                setShowExamTip(false);
              }}
              aria-label={`Ver dato ${idx + 1}: ${fact.title}`}
              title={fact.title}
            />
          ))}
        </div>

        <div className="fact-counter">
          <span>{currentIndex + 1} de {chemistryFacts.length}</span>
          {isPaused && <span className="fact-paused-indicator">· Pausado</span>}
        </div>
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
  const navigate = useNavigate();
  const [streak, setStreak] = useState(getStudyStreak());
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("quimica-preuni-theme") === "dark"
  );
  const [showSpellerModal, setShowSpellerModal] = useState(false);
  const [showLaminasModal, setShowLaminasModal] = useState(false);
  const [selectedLaminaId, setSelectedLaminaId] = useState("completa");

  useEffect(() => {
    const handleOpenSpeller = () => setShowSpellerModal(true);
    window.addEventListener("open-speller-modal", handleOpenSpeller);
    return () => window.removeEventListener("open-speller-modal", handleOpenSpeller);
  }, []);

  useEffect(() => {
    const handleOpenLaminas = (e) => {
      if (e?.detail?.laminaId) setSelectedLaminaId(e.detail.laminaId);
      setShowLaminasModal(true);
    };
    window.addEventListener("open-laminas", handleOpenLaminas);
    return () => window.removeEventListener("open-laminas", handleOpenLaminas);
  }, []);

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
      {/* Top Authority Bar: Química Zenit en Skool */}
      <div className="top-authority-bar">
        <div className="top-authority-inner">
          <div className="top-authority-left">
            <span className="top-authority-badge">
              <span className="live-dot" aria-hidden="true" />
              <span>Química Zenit</span>
            </span>
            <span className="top-authority-text">
              Comunidad oficial de preparación intensiva para la UNI y San Marcos
            </span>
          </div>
          <a
            href={communityUrl}
            target="_blank"
            rel="noreferrer"
            className="top-authority-link"
            title="Conocer la comunidad de aprendizaje Química Zenit en Skool"
          >
            <span>Conocer Comunidad</span>
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
      </div>

      <header className="site-header">
        <Link className="brand" to="/" aria-label="38 Elementos, inicio">
          <img
            src={darkMode ? "/logo-dark.svg" : "/logo.svg"}
            alt="38 Elementos · La tabla periódica que sí cae"
          />
        </Link>
        <div className="header-actions">
          {/* Downloadable Laminas Button (Smooth Scroll to Bottom Section) */}
          <button
            type="button"
            className="laminas-nav-btn"
            onClick={() => {
              const el = document.getElementById("laminas-descarga");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
                el.classList.add("laminas-pulse-glow");
                setTimeout(() => el.classList.remove("laminas-pulse-glow"), 2200);
              } else {
                setSelectedLaminaId("completa");
                setShowLaminasModal(true);
              }
            }}
            aria-label="Ir a descargar Láminas de Estudio Gratis"
            title="Ir a la sección de láminas didácticas para descargar en PDF e Imagen HD"
          >
            <span className="nav-gift-emoji">📥</span>
            <span className="nav-gift-text">Láminas Gratis ↓</span>
            <span className="nav-gift-short-text">Láminas</span>
          </button>
          <button
            type="button"
            className="guide-nav-btn"
            onClick={() => window.dispatchEvent(new CustomEvent("open-study-guide"))}
            aria-label="Abrir Guía de Estudio"
            title="Guía de Estudio: ¿cómo estudiar la tabla periódica y aprovechar la app al 100%?"
          >
            <BookOpen size={14} />
            <span className="guide-btn-text">¿Cómo Estudiar?</span>
            <span className="guide-btn-short-text">Guía</span>
          </button>
          <button
            type="button"
            className="speller-nav-btn"
            onClick={() => setShowSpellerModal(true)}
            aria-label="Abrir Deletreo Químico"
            title="Deletreo Químico: convierte cualquier palabra en elementos de la tabla periódica"
          >
            <span className="speller-btn-emoji">🔤</span>
            <span className="speller-btn-text">Deletreo Químico</span>
          </button>
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
      <aside className="contact-cta" aria-label="Únete a la comunidad de Química Zenit">
        <div className="contact-cta-left">
          <div className="contact-cta-badge">
            <span className="live-dot" aria-hidden="true" />
            <span>Comunidad Oficial en Skool</span>
          </div>
          <strong className="contact-cta-title">¿Postulas a la UNI o San Marcos?</strong>
          <p className="contact-cta-desc">
            Únete a la comunidad de aprendizaje de Química Zenit: clases intensivas, bancos de admisión oficiales resueltos paso a paso y simulacros semanales.
          </p>
        </div>
        <div className="contact-cta-actions">
          <button
            type="button"
            className="contact-cta-qr-btn"
            onClick={() => setShowLaminasModal(true)}
            title="Ver código QR para escanear con tu celular"
          >
            <QrCode size={15} />
            <span>Ver QR</span>
          </button>
          <a
            href={communityUrl}
            target="_blank"
            rel="noreferrer"
            className="contact-cta-button"
            title="Acceder a la comunidad oficial Química Zenit en Skool"
          >
            <span>Acceder a Skool</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </aside>
      <footer className="site-footer">
        Desarrollado por{" "}
        <a href="https://juan.cabellosalirrosas.com" target="_blank" rel="noreferrer">
          Xavier Cabello
        </a>
      </footer>

      {/* Deletreo Químico (Word Speller) Modal */}
      <ElementSpellerModal
        isOpen={showSpellerModal}
        onClose={() => setShowSpellerModal(false)}
        onSelectElement={(el) => navigate(`/elemento/${el.symbol.toLowerCase()}`)}
      />

      {/* Visor Oficial de Láminas de Estudio en PDF */}
      <LaminasViewerModal
        isOpen={showLaminasModal}
        onClose={() => setShowLaminasModal(false)}
        initialLaminaId={selectedLaminaId}
      />
    </div>
  );
}

function LaminasStudySection() {
  const openLaminas = (laminaId = "completa") => {
    window.dispatchEvent(new CustomEvent("open-laminas", { detail: { laminaId } }));
  };

  const LAMINAS_ITEMS = [
    {
      id: "completa",
      badge: "Lámina 1",
      title: "Tabla Periódica Completa",
      desc: "Didáctica oficial IUPAC con los 118 elementos organizados por períodos, grupos y masas atómicas.",
      previewImg: "/laminas/tabla-periodica-completa.png",
      pdfUrl: "/laminas/tabla-periodica-completa.pdf",
      pdfName: "Tabla_Periodica_Completa_QuimicaZenit.pdf",
      pdfSize: "218 KB",
      imageUrl: "/laminas/tabla-periodica-completa.png",
      imageName: "Tabla_Periodica_Completa_HD_QuimicaZenit.png",
      imageSize: "390 KB"
    },
    {
      id: "con-imagenes",
      badge: "Lámina 2",
      title: "Tabla con Imágenes Reales",
      desc: "Fotografías reales de los elementos en su estado natural para máxima fijación visual y nemotécnia.",
      previewImg: "/laminas/tabla-periodica-con-imagenes.png",
      pdfUrl: "/laminas/tabla-periodica-con-imagenes.pdf",
      pdfName: "Tabla_Periodica_con_Imagenes_QuimicaZenit.pdf",
      pdfSize: "614 KB",
      imageUrl: "/laminas/tabla-periodica-con-imagenes.png",
      imageName: "Tabla_Periodica_con_Imagenes_HD_QuimicaZenit.png",
      imageSize: "820 KB"
    }
  ];

  return (
    <section className="laminas-showcase-section" id="laminas-descarga" aria-label="Láminas didácticas de la tabla periódica">
      <div className="laminas-showcase-header">
        <div className="laminas-showcase-badge">
          <Sparkles size={13} className="text-amber" aria-hidden="true" />
          <span>Material Gratuito Descargable</span>
        </div>
        <h2 className="laminas-showcase-title">
          Láminas de la Tabla Periódica en Alta Resolución
        </h2>
        <p className="laminas-showcase-sub">
          Descarga en <strong>PDF vectorial (para imprimir sin pixelar)</strong> o en <strong>Imagen HD (para tu celular o tablet)</strong>. Ambas láminas en formato horizontal.
        </p>
      </div>

      <div className="laminas-cards-grid">
        {LAMINAS_ITEMS.map((item) => (
          <article key={item.id} className="lamina-showcase-card">
            {/* Visual Thumbnail (100% visible, never cropped) */}
            <div
              className="lamina-showcase-thumb-wrap"
              onClick={() => openLaminas(item.id)}
              title="Clic para abrir visor en pantalla completa con zoom"
            >
              <img
                src={item.previewImg}
                alt={item.title}
                className="lamina-showcase-img"
                loading="lazy"
              />
              <div className="lamina-thumb-overlay">
                <span className="lamina-zoom-tag">
                  <ZoomIn size={14} /> Ver con zoom
                </span>
              </div>
              <span className="lamina-orientation-tag">Horizontal (A4 / A3)</span>
            </div>

            {/* Content & Clean Download Toolbar */}
            <div className="lamina-showcase-info">
              <div className="lamina-badge-row">
                <span className="lamina-card-pill">{item.badge}</span>
                <span className="lamina-format-hint">PDF &amp; Imagen PNG</span>
              </div>
              <h3 className="lamina-item-title">{item.title}</h3>
              <p className="lamina-item-desc">{item.desc}</p>

              {/* Orderly Action Buttons: PDF, Imagen HD, and Explorar */}
              <div className="lamina-item-actions">
                <a
                  href={item.pdfUrl}
                  download={item.pdfName}
                  className="lamina-action-btn pdf"
                  title={`Descargar ${item.title} en PDF vectorial para imprimir`}
                >
                  <FileText size={15} />
                  <span>PDF ({item.pdfSize})</span>
                </a>

                <a
                  href={item.imageUrl}
                  download={item.imageName}
                  className="lamina-action-btn image"
                  title={`Descargar ${item.title} en imagen PNG alta resolución`}
                >
                  <Download size={15} />
                  <span>Imagen HD</span>
                </a>

                <button
                  type="button"
                  onClick={() => openLaminas(item.id)}
                  className="lamina-action-btn view"
                  title="Abrir visor interactivo con zoom"
                  aria-label={`Ver ${item.title} con zoom`}
                >
                  <Eye size={15} />
                  <span>Explorar</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* WhatsApp Free Admission Classes Funnel Card */}
      <div className="laminas-whatsapp-card">
        <div className="whatsapp-card-content">
          <div className="whatsapp-card-badge">
            <MessageCircle size={14} className="whatsapp-icon" aria-hidden="true" />
            <span>Comunidad de WhatsApp · Clases en Vivo Gratuitas</span>
          </div>
          <h3 className="whatsapp-card-title">
            ¿Quieres repasar las fijas de examen con clases en vivo gratuitas?
          </h3>
          <p className="whatsapp-card-desc">
            Únete a nuestro grupo de WhatsApp para postulantes. Compartimos enlaces a sesiones en vivo, solucionarios de exámenes de admisión (UNI / San Marcos) y tips de resolución rápida.
          </p>
        </div>
        <a
          href={whatsappCommunityUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-join-btn"
          title="Unirme al grupo de WhatsApp de clases gratuitas de Química Zenit"
        >
          <MessageCircle size={18} />
          <span className="whatsapp-btn-full-text">Unirme al Grupo de WhatsApp (Gratis)</span>
          <span className="whatsapp-btn-short-text">Unirme a WhatsApp (Gratis)</span>
          <ArrowUpRight size={15} />
        </a>
      </div>
    </section>
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

  useEffect(() => {
    const handleSetMode = (e) => {
      if (e.detail) setTableMode(e.detail);
    };
    const handleOpenAdvTool = (e) => {
      if (e.detail) setAdvancedTool(e.detail);
    };
    const handleOpenComp = () => {
      if (compareElements.length === 0) {
        const na = elements.find((el) => el.symbol === "Na");
        const cl = elements.find((el) => el.symbol === "Cl");
        if (na && cl) setCompareElements([na, cl]);
      }
      setShowComparatorModal(true);
    };
    const handleOpenMiscon = () => {
      setShowMisconceptionsModal(true);
    };
    window.addEventListener("set-table-mode", handleSetMode);
    window.addEventListener("open-adv-tool", handleOpenAdvTool);
    window.addEventListener("open-comparator-modal", handleOpenComp);
    window.addEventListener("open-misconceptions-modal", handleOpenMiscon);
    return () => {
      window.removeEventListener("set-table-mode", handleSetMode);
      window.removeEventListener("open-adv-tool", handleOpenAdvTool);
      window.removeEventListener("open-comparator-modal", handleOpenComp);
      window.removeEventListener("open-misconceptions-modal", handleOpenMiscon);
    };
  }, [compareElements]);

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

          <button
            type="button"
            className="adv-tool-btn"
            onClick={() => window.dispatchEvent(new CustomEvent("open-speller-modal"))}
            title="Deletreo Químico: escribe cualquier palabra y transfórmala en elementos de la tabla periódica"
          >
            <span style={{ fontSize: "14px" }}>🔤</span>
            <span>Deletreo</span>
            <span className="adv-pill">Speller</span>
          </button>

          <button
            type="button"
            className="adv-tool-btn"
            onClick={() => window.dispatchEvent(new CustomEvent("open-study-guide"))}
            title="Guía Maestra: metodología preuniversitaria y trucos para aprovechar la app"
          >
            <BookOpen size={15} />
            <span>¿Cómo Estudiar?</span>
            <span className="adv-pill">Tips UNI</span>
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

      {/* Strategic Downloadable Sheets Section & WhatsApp Funnel */}
      <LaminasStudySection />
    </main>
  );
}

class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("GlobalErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="quiz-page" style={{ padding: "2.5rem 1.5rem", textAlign: "center", maxWidth: "600px", margin: "4rem auto" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚛️</div>
          <h2>Algo inesperado ocurrió</h2>
          <p style={{ color: "var(--muted, #888)", margin: "1rem 0" }}>
            Se produjo un inconveniente al renderizar la vista. Puedes volver a la tabla periódica o recargar la página.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = "/";
              }}
            >
              Volver a la Tabla Periódica
            </button>
            <button
              type="button"
              className="action-btn"
              onClick={() => window.location.reload()}
            >
              Recargar
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

function App() {
  const navigate = useNavigate();
  const [showStudyGuide, setShowStudyGuide] = useState(false);

  useEffect(() => {
    const handleOpenGuide = () => setShowStudyGuide(true);
    window.addEventListener("open-study-guide", handleOpenGuide);
    return () => window.removeEventListener("open-study-guide", handleOpenGuide);
  }, []);

  // Global shortcut '?' or 'h'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.target &&
        (e.target.tagName === "INPUT" ||
          e.target.tagName === "TEXTAREA" ||
          e.target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "?" || (e.key === "h" && !e.ctrlKey && !e.metaKey && !e.altKey)) {
        e.preventDefault();
        setShowStudyGuide((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleExecuteGuideAction = (actionType) => {
    switch (actionType) {
      case "study-mode":
        localStorage.setItem("quimica-preuni-table-mode", "study");
        navigate("/");
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("set-table-mode", { detail: "study" }));
        }, 50);
        break;
      case "navigate-lab":
        navigate("/laboratorio");
        break;
      case "navigate-lab-jump":
        navigate("/laboratorio?tab=jump");
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("switch-lab-tab", { detail: "jump" }));
        }, 100);
        break;
      case "tool-temperature":
        navigate("/");
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("open-adv-tool", { detail: "temperature" }));
        }, 100);
        break;
      case "tool-comparator":
        navigate("/");
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("open-comparator-modal"));
        }, 100);
        break;
      case "tool-speller":
        window.dispatchEvent(new CustomEvent("open-speller-modal"));
        break;
      case "tool-misconceptions":
        window.dispatchEvent(new CustomEvent("open-misconceptions-modal"));
        break;
      default:
        break;
    }
  };

  return (
    <GlobalErrorBoundary>
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

      {/* Floating Global Guide Helper Button */}
      <button
        type="button"
        className="floating-guide-trigger"
        onClick={() => setShowStudyGuide(true)}
        aria-label="Abrir Guía de Estudio"
        title="Guía de Estudio: ¿cómo estudiar la tabla periódica? (Atajo: presiona ?)"
      >
        <span className="pulsing-dot" />
        <BookOpen size={16} />
        <span>¿Cómo Estudiar?</span>
      </button>

      {/* Interactive Master Study Guide Modal */}
      <StudyGuideModal
        isOpen={showStudyGuide}
        onClose={() => setShowStudyGuide(false)}
        onExecuteAction={handleExecuteGuideAction}
      />
    </GlobalErrorBoundary>
  );
}

export default App;
