import React, { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Target,
  Atom,
  Zap,
  Thermometer,
  Scale,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  ExternalLink,
  ArrowRight,
  Search,
  RotateCcw,
  Users,
  ArrowUpRight
} from "lucide-react";
import { communityUrl } from "../config.js";

export const STUDY_GUIDE_MODULES = [
  {
    id: "strategy",
    icon: Target,
    badge: "Estrategia",
    title: "1. Los 38 Esenciales vs IUPAC",
    summary: "Por qué dominar 38 elementos te da más del 90% del puntaje en química de admisión.",
    color: "#f59e0b",
    tags: ["Pre-UNI", "Modo Estudio", "IUPAC", "San Marcos", "Pareto"],
    content: {
      lead: "En un examen de admisión competitivo (UNI, San Marcos, Villarreal, Callao, PUCP), memorizar los 118 elementos a ciegas es ineficiente y contraproducente.",
      principles: [
        {
          heading: "El Principio de Pareto (Regla 80/20):",
          text: "El 92% de las preguntas de estructura atómica, tabla periódica, enlaces y estequiometría se centran en los primeros 4 períodos (Z = 1 al 36), más metales nobles y pesados representativos (Ag, Au, Hg, Pb, U)."
        },
        {
          heading: "Modo Estudio Pre-UNI vs Modo IUPAC Completo:",
          text: "Usa el selector superior 'Modo Estudio Pre-UNI' para atenuar los 80 elementos de relleno y enfocarte en los 38 con estrella dorada ★. Cuando necesites investigar elementos raros, sintéticos o lantánidos, cambia a 'Modo IUPAC'."
        },
        {
          heading: "La Tríada de Oro (Z, Símbolo, Masa redondeada):",
          text: "Memoriza las masas atómicas clave más usadas en estequiometría: H = 1, C = 12, N = 14, O = 16, Na = 23, Mg = 24, Al = 27, P = 31, S = 32, Cl = 35.5, K = 39, Ca = 40, Fe = 56, Cu = 63.5."
        }
      ],
      examTip: "En UNI nunca te pedirán el peso atómico del Lawrencio o del Moscovio; pero dominar que el Cloro es 35.5 y el Carbono es 12 te ahorrará hasta 3 minutos por problema de cálculo estequiométrico.",
      actionLabel: "Activar Modo Estudio en la Tabla",
      actionType: "study-mode"
    }
  },
  {
    id: "structure",
    icon: Atom,
    badge: "Átomo",
    title: "2. Modelo Bohr 2D vs Cuántico 3D",
    summary: "Visualiza niveles energéticos (K, L, M, N) y electrones de valencia para deducir el grupo.",
    color: "#3b82f6",
    tags: ["Bohr", "Rydberg", "Configuración", "Valencia", "3D"],
    content: {
      lead: "El comportamiento químico de cualquier elemento depende casi exclusivamente de sus electrones en el último nivel (electrones de valencia).",
      principles: [
        {
          heading: "Modelo Bohr 2D Vectorial (Ligero y Didáctico):",
          text: "Ideal para conteo rápido. Muestra órbitas concéntricas con animación circular independiente y destaca en dorado el nivel más externo. Además, muestra la regla de Rydberg (capacidad máxima 2n²: capa K=2, L=8, M=18, N=32)."
        },
        {
          heading: "Visor Cuántico 3D (Espacial e Inmersivo):",
          text: "Construido con WebGL (Three.js), permite rotar libremente el átomo con el ratón o el dedo para comprender que los electrones ocupan un volumen tridimensional, no planos fijos."
        },
        {
          heading: "Deducción Instantánea del Grupo y Período:",
          text: "El número de capas ocupadas = Período. El número de electrones en la última capa = Grupo A (para elementos representativos de los bloques s y p)."
        }
      ],
      examTip: "Para el Aluminio (Z=13), sus capas son [2, 8, 3]. Tiene 3 capas → Período 3. Tiene 3 electrones de valencia → Grupo IIIA (Grupo 13 IUPAC). ¡Así de directo se responde en admisión!",
      actionLabel: "Ir al Laboratorio Atómico",
      actionType: "navigate-lab"
    }
  },
  {
    id: "quantum-jump",
    icon: Zap,
    badge: "Ionización",
    title: "3. Salto Cuántico de Energías de Ionización",
    summary: "Aprende el truco de las ionizaciones sucesivas para deducir familias en preguntas misteriosas.",
    color: "#eab308",
    tags: ["Ionización", "Salto Cuántico", "Gas Noble", "Cationes", "Energía"],
    content: {
      lead: "Las preguntas tipo 'Elemento Misterioso con I₁, I₂, I₃...' son un clásico infaltable en el examen de admisión UNI.",
      principles: [
        {
          heading: "¿Por qué I₁ < I₂ < I₃ siempre crece?:",
          text: "Al arrancar electrones, la relación protones/electrones aumenta, contrayendo la nube y aumentando la fuerza de atracción nuclear efectiva (Zeff) sobre los electrones restantes."
        },
        {
          heading: "La Regla del Salto Drástico (Salto Cuántico):",
          text: "Cuando se terminan los electrones del nivel de valencia y se intenta arrancar un electrón de la capa interna (isoelectrónica con un gas noble), la energía se multiplica por 3.5× hasta más de 10×."
        },
        {
          heading: "La Fórmula Mnemotécnica Pre-UNI:",
          text: "Si el salto gigantesco ocurre al pasar a Iₙ₊₁, el elemento tiene exactamente 'n' electrones de valencia y pertenece al Grupo 'n'A."
        }
      ],
      examTip: "Ejemplo: I₁ = 496 kJ/mol, I₂ = 4562 kJ/mol (¡salto de 9.2×!). El salto está en I₂ → Tiene 1 electrón de valencia → Es del Grupo IA (Alcalino, como el Sodio).",
      actionLabel: "Abrir Calculadora de Salto Cuántico",
      actionType: "navigate-lab-jump"
    }
  },
  {
    id: "thermal-heatmap",
    icon: Thermometer,
    badge: "Termodinámica",
    title: "4. Termómetro Térmico y Mapas de Calor",
    summary: "Observa los estados de agregación a cualquier temperatura y vectores de tendencias periódicas.",
    color: "#06b6d4",
    tags: ["Termómetro", "Estados", "Fusión", "Ebullición", "Electronegatividad"],
    content: {
      lead: "La materia no es estática. Cambiar la temperatura revela propiedades físicas profundas de cada enlace.",
      principles: [
        {
          heading: "El Termómetro Térmico (0 K a 6000 K):",
          text: "Arrastra el deslizador para ver cómo cada elemento cambia de color entre Sólido, Líquido y Gas según sus puntos reales de fusión y ebullición."
        },
        {
          heading: "La Pregunta de Oro sobre Elementos Líquidos a 298 K (25 °C):",
          text: "En toda la tabla periódica a condiciones estándar (1 atm, 25 °C = 298 K), solo existen DOS elementos líquidos: el Bromo (Br₂, no metal rojizo) y el Mercurio (Hg, metal líquido brillante). El Galio y el Cesio funden cerca de 30 °C."
        },
        {
          heading: "Mapas de Calor (Heatmaps) y Vectores de Tendencia:",
          text: "Activa las capas de Electronegatividad (máximo en Flúor = 4.0), Radio Atómico (máximo en Francio / Cesio) y 1.ª Energía de Ionización para ver los vectores de crecimiento con flechas directas."
        }
      ],
      examTip: "Recuerda la regla de las flechas: El Radio Atómico crece hacia ABAJO y hacia la IZQUIERDA (el Francio es el más gordo). La Electronegatividad y la Ionización crecen en sentido contrario: hacia ARRIBA y hacia la DERECHA (hacia el Flúor y Helio).",
      actionLabel: "Probar Termómetro en la Tabla",
      actionType: "tool-temperature"
    }
  },
  {
    id: "comparator",
    icon: Scale,
    badge: "Enlaces",
    title: "5. Comparador Atómico y Predicción de Enlaces",
    summary: "Compara 2 elementos lado a lado y predice el tipo de enlace según la regla de Linus Pauling.",
    color: "#8b5cf6",
    tags: ["Pauling", "Enlace Iónico", "Covalente", "Delta EN", "Comparador"],
    content: {
      lead: "¿Cómo saber si dos elementos formarán un enlace iónico o covalente sin memorizar miles de compuestos?",
      principles: [
        {
          heading: "Selección en la Tabla con [+]:",
          text: "En la tabla periódica, haz clic en el botón [+] de dos elementos (ej. Na y Cl, o H y O) y abre el 'Comparador'."
        },
        {
          heading: "La Escala de Diferencia de Electronegatividad (ΔEN):",
          text: "Calcula ΔEN = |EN₁ - EN₂|:\n• ΔEN ≥ 1.7 → Enlace Iónico predominante (transferencia de electrones, ej. NaCl con ΔEN = 2.23).\n• 0.4 < ΔEN < 1.7 → Enlace Covalente Polar (compartición asimétrica, dipolos, ej. H₂O con ΔEN = 1.24).\n• ΔEN ≤ 0.4 → Enlace Covalente Apolar / No polar (compartición simétrica, ej. Cl₂ con ΔEN = 0, CH₄ con ΔEN = 0.35)."
        },
        {
          heading: "Análisis Cuántico Comparativo:",
          text: "El comparador contrasta lado a lado sus radios, afinidades, densidades y configuraciones electrónicas completas."
        }
      ],
      examTip: "Cuidado con la trampa típica: HF tiene ΔEN = 1.78, pero es un gas covalente polar molecular con enlace por puente de hidrógeno; BeCl₂ tiene carácter covalente pese a ser metal-no metal.",
      actionLabel: "Abrir Comparador Atómico",
      actionType: "tool-comparator"
    }
  },
  {
    id: "speller",
    icon: Sparkles,
    badge: "Gamificación",
    title: "6. Deletreo Químico (Word Speller)",
    summary: "Gamificación mnemotécnica: sintetiza cualquier palabra con símbolos y masas atómicas reales.",
    color: "#ec4899",
    tags: ["Speller", "Mnemotécnica", "Masa Molar", "Palabras", "Juegos"],
    content: {
      lead: "Aprender los símbolos químicos no tiene por qué ser aburrido. Usa la lingüística para fijarlos en tu memoria de largo plazo.",
      principles: [
        {
          heading: "¿Cómo funciona el algoritmo de síntesis?:",
          text: "Escribe tu nombre, un país o una palabra (ej. CHOCOLATE, GENIO, PERU, TIERRA, CAFE). El algoritmo descompone las letras en símbolos atómicos válidos de 1 o 2 caracteres."
        },
        {
          heading: "Cálculo de Masa Molar y Estadísticas Reales:",
          text: "Cada palabra sintetizada calcula la masa molar molecular total (Σ masa atómica), el número atómico acumulado (Σ Z) y el porcentaje de elementos Pre-UNI que contiene."
        },
        {
          heading: "Variantes Múltiples de Deletreo:",
          text: "Si una palabra tiene varias formas posibles (ej. GENIO como Ge+N+I+O o Ge+Ni+O), puedes alternar entre las variantes con un clic."
        }
      ],
      examTip: "Al hacer clic en cualquier tarjeta del deletreo químico, saltas directamente a la ficha pedagógica y visualizador 3D de ese elemento.",
      actionLabel: "Probar Deletreo Químico",
      actionType: "tool-speller"
    }
  },
  {
    id: "traps",
    icon: ShieldAlert,
    badge: "Trampas RSC",
    title: "7. Los 6 Errores Conceptuales Clásicos (RSC)",
    summary: "Supera los errores y trampas más frecuentes identificados por la Royal Society of Chemistry.",
    color: "#ef4444",
    tags: ["RSC", "Trampas", "Octeto", "Antiserrucho", "Radio Iónico"],
    content: {
      lead: "Los postulantes a menudo pierden puntos no por falta de estudio, sino por caer en mitos y generalizaciones falsas.",
      principles: [
        {
          heading: "Trampa 1: Creer que la Regla del Octeto es universal e inviolable:",
          text: "Realidad: Existen moléculas con octeto incompleto (BF₃ con 6 e⁻, BeCl₂ con 4 e⁻), octeto expandido (PCl₅ con 10 e⁻, SF₆ con 12 e⁻) y especies con número impar de electrones (NO, NO₂)."
        },
        {
          heading: "Trampa 2: Confundir Radio Iónico con Radio Atómico:",
          text: "Realidad: Al ganar electrones (anión), la nube se expande (r_anión > r_neutro). Al perder electrones (catión), la nube se contrae fuertemente (r_catión < r_neutro). Para especies isoelectrónicas: a mayor Z, menor radio."
        },
        {
          heading: "Trampa 3: La regla del Antiserrucho (Configuración Anómala):",
          text: "Realidad: En los subniveles d⁴ y d⁹ ocurre un salto de estabilidad semilleno o lleno: Cr (Z=24) es [Ar] 4s¹ 3d⁵ (NO 4s² 3d⁴); Cu (Z=29) es [Ar] 4s¹ 3d¹⁰ (NO 4s² 3d⁹)."
        }
      ],
      examTip: "Abre el botón 'Trampas RSC' en la barra de herramientas de la tabla para revisar los 6 casos con justificación rigurosa y preguntas modelo de examen.",
      actionLabel: "Ver las 6 Trampas Clásicas",
      actionType: "tool-misconceptions"
    }
  },
  {
    id: "community",
    icon: Users,
    badge: "Comunidad Skool",
    title: "8. Grupo de Estudio y Clases en Vivo",
    summary: "Resuelve dudas con otros postulantes, accede a solucionarios UNI/San Marcos y clases en vivo en Skool.",
    color: "#10b981",
    tags: ["Comunidad", "Skool", "UNI", "San Marcos", "Clases en vivo", "Solucionarios", "Admisión"],
    content: {
      lead: "El ingreso a la universidad no tiene por qué ser un camino solitario. Únete al espacio oficial de postulantes en Química Zenit.",
      principles: [
        {
          heading: "Dudas y Consultas 24/7:",
          text: "Sube fotos de problemas difíciles de academias (CepreUNI, Pre San Marcos, Vallejo, Aduni). Entre postulantes avanzados y profesores resolvemos el paso a paso detallado."
        },
        {
          heading: "Simulacros y Bancos de Admisión en PDF:",
          text: "Descarga bancos de preguntas clasificadas por temas (enlace químico, tabla periódica, estequiometría, gases) con claves rigurosamente verificadas."
        },
        {
          heading: "Sesiones y Clases en Vivo:",
          text: "Participa en transmisiones periódicas donde analizamos las fijas de admisión y estrategias para resolver preguntas en menos de 90 segundos."
        }
      ],
      examTip: "Aprender en comunidad aumenta en un 64% la retención conceptual y evita que pierdas horas atascado en un problema de examen.",
      actionLabel: "Acceder a la Comunidad en Skool",
      actionType: "open-community"
    }
  }
];

export function StudyGuideModal({ isOpen, onClose, onExecuteAction }) {
  const [activeTabId, setActiveTabId] = useState("strategy");
  const [searchQuery, setSearchQuery] = useState("");
  const [readModules, setReadModules] = useState(() => {
    try {
      const saved = localStorage.getItem("quimica-preuni-guide-read");
      return saved ? JSON.parse(saved) : ["strategy"];
    } catch {
      return ["strategy"];
    }
  });

  // Sync read modules to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("quimica-preuni-guide-read", JSON.stringify(readModules));
    } catch (err) {
      console.warn("Could not persist guide progress:", err);
    }
  }, [readModules]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const activeModule = useMemo(() => {
    return STUDY_GUIDE_MODULES.find((m) => m.id === activeTabId) || STUDY_GUIDE_MODULES[0];
  }, [activeTabId]);

  const currentIndex = STUDY_GUIDE_MODULES.findIndex((m) => m.id === activeModule.id);
  const totalModules = STUDY_GUIDE_MODULES.length;

  const toggleModuleRead = (id) => {
    setReadModules((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const markCurrentAsReadAndNext = () => {
    if (!readModules.includes(activeModule.id)) {
      setReadModules((prev) => [...prev, activeModule.id]);
    }
    if (currentIndex < totalModules - 1) {
      setActiveTabId(STUDY_GUIDE_MODULES[currentIndex + 1].id);
    }
  };

  // Filter modules based on search
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return STUDY_GUIDE_MODULES;
    const q = searchQuery.toLowerCase();
    return STUDY_GUIDE_MODULES.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q)) ||
        m.content.lead.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  const progressPercent = Math.round((readModules.length / totalModules) * 100);

  return (
    <div className="guide-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="guide-title">
      <div className="guide-modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="guide-modal-header">
          <div className="guide-header-title-wrap">
            <div className="guide-header-icon-box">
              <BookOpen size={22} className="text-amber-bright" />
            </div>
            <div>
              <div className="guide-eyebrow">
                <Flame size={13} className="text-purple-bright" />
                <span>Metodología de Estudio Pre-UNI y Universitario</span>
              </div>
              <h2 id="guide-title" className="guide-title">
                ¿Cómo estudiar y dominar la química con esta app?
              </h2>
            </div>
          </div>

          <div className="guide-header-actions">
            <div className="guide-progress-pill" title={`${readModules.length} de ${totalModules} módulos revisados`}>
              <span className="progress-dot" />
              <span>{readModules.length}/{totalModules} leídos ({progressPercent}%)</span>
            </div>
            <button
              type="button"
              className="guide-close-btn"
              onClick={onClose}
              aria-label="Cerrar guía"
              title="Cerrar (Esc)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="guide-search-row">
          <div className="guide-search-box">
            <Search size={15} className="guide-search-icon" />
            <input
              type="text"
              className="guide-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tema, concepto o trampa (ej. salto cuántico, octeto, bromo, radio, pauling)..."
              aria-label="Buscar en la guía de estudio"
            />
            {searchQuery && (
              <button
                type="button"
                className="guide-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Limpiar búsqueda"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Modal Main Layout: Navigation Sidebar / Tabs & Content Viewer */}
        <div className="guide-body-layout">
          {/* Module Nav Pills / Tabs List */}
          <nav className="guide-nav-sidebar" aria-label="Módulos de la guía">
            <div className="guide-nav-list">
              {filteredModules.map((mod) => {
                const IconComp = mod.icon;
                const isSelected = mod.id === activeTabId;
                const isRead = readModules.includes(mod.id);

                return (
                  <button
                    key={mod.id}
                    type="button"
                    className={`guide-nav-item ${isSelected ? "active" : ""} ${isRead ? "is-read" : ""}`}
                    onClick={() => setActiveTabId(mod.id)}
                    aria-current={isSelected ? "true" : undefined}
                  >
                    <div className="nav-item-icon-col" style={{ color: mod.color }}>
                      <IconComp size={16} />
                    </div>
                    <div className="nav-item-text-col">
                      <div className="nav-item-top-row">
                        <span className="nav-item-badge">{mod.badge}</span>
                        {isRead && <CheckCircle2 size={13} className="nav-check-icon" />}
                      </div>
                      <div className="nav-item-title">{mod.title}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Module Content Pane */}
          <article className="guide-content-pane">
            <header className="module-content-header">
              <div className="module-title-row">
                <div
                  className="module-icon-pill"
                  style={{
                    backgroundColor: `${activeModule.color}22`,
                    borderColor: activeModule.color,
                    color: activeModule.color
                  }}
                >
                  {React.createElement(activeModule.icon, { size: 18 })}
                  <span>{activeModule.badge}</span>
                </div>
                <h3 className="module-heading">{activeModule.title}</h3>
              </div>
              <p className="module-lead-text">{activeModule.content.lead}</p>
            </header>

            {/* Principles Cards */}
            <div className="module-principles-list">
              {activeModule.content.principles.map((pr, idx) => (
                <div key={idx} className="principle-card">
                  <h4 className="principle-title">{pr.heading}</h4>
                  <p className="principle-body">{pr.text}</p>
                </div>
              ))}
            </div>

            {/* Exam Tip Callout Box */}
            <div className="module-exam-tip-box">
              <div className="tip-box-header">
                <Sparkles size={16} className="tip-icon" />
                <strong>Tip de Oro para el Examen de Admisión:</strong>
              </div>
              <p className="tip-box-text">{activeModule.content.examTip}</p>
            </div>

            {/* Interactive Module Action Bar */}
            <div className="module-action-bar">
              <button
                type="button"
                className="guide-action-btn primary"
                onClick={() => {
                  if (activeModule.content.actionType === "open-community") {
                    window.open(communityUrl, "_blank", "noopener,noreferrer");
                  } else if (onExecuteAction) {
                    onExecuteAction(activeModule.content.actionType);
                  }
                  onClose();
                }}
              >
                <span>{activeModule.content.actionLabel}</span>
                {activeModule.content.actionType === "open-community" ? (
                  <ArrowUpRight size={15} />
                ) : (
                  <ArrowRight size={15} />
                )}
              </button>

              <button
                type="button"
                className={`guide-mark-read-btn ${readModules.includes(activeModule.id) ? "active" : ""}`}
                onClick={() => toggleModuleRead(activeModule.id)}
              >
                <CheckCircle2 size={15} />
                <span>
                  {readModules.includes(activeModule.id)
                    ? "Módulo completado"
                    : "Marcar como aprendido"}
                </span>
              </button>
            </div>

            {/* Reciprocity Footer Ribbon on other tabs */}
            {activeModule.id !== "community" && (
              <aside className="guide-community-strip">
                <div className="guide-community-strip-info">
                  <Users size={16} className="text-emerald" />
                  <span>
                    ¿Dudas con este tema? Pregunta a postulantes y profesores en la <strong>Comunidad Oficial Skool</strong>.
                  </span>
                </div>
                <a
                  href={communityUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="guide-community-strip-link"
                >
                  <span>Acceder</span>
                  <ArrowUpRight size={13} />
                </a>
              </aside>
            )}
          </article>
        </div>

        {/* Modal Footer Navigation */}
        <div className="guide-modal-footer">
          <button
            type="button"
            className="guide-footer-nav-btn"
            disabled={currentIndex === 0}
            onClick={() => setActiveTabId(STUDY_GUIDE_MODULES[currentIndex - 1].id)}
          >
            <ChevronLeft size={16} />
            <span>Anterior</span>
          </button>

          <div className="guide-footer-step-counter">
            <span>Paso {currentIndex + 1} de {totalModules}</span>
          </div>

          {currentIndex < totalModules - 1 ? (
            <button
              type="button"
              className="guide-footer-nav-btn next"
              onClick={markCurrentAsReadAndNext}
            >
              <span>Siguiente</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="guide-footer-nav-btn finish"
              onClick={onClose}
            >
              <span>¡Listo para estudiar!</span>
              <CheckCircle2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
