import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { CheckCircle, ChevronDown, Flame, ListChecks, MessageCircle, Moon, Search, Sun, Target, X } from "lucide-react";
import { categories, elements, topics } from "./data.js";
import { communityUrl } from "./config.js";
import { getBestScore, getDiagnostic, getDueReviewCount, getDueQuestions, getMistakes, getStudyStreak } from "./storage.js";
import Atom3D from "./components/Atom3D.jsx";

const QuizPage = lazy(() => import("./QuizPage.jsx"));
const DiagnosticPage = lazy(() => import("./DiagnosticPage.jsx"));
const LabPage = lazy(() => import("./LabPage.jsx"));
const TeacherPage = lazy(() => import("./TeacherPage.jsx"));

const tableLayers = [
  { id: "families", label: "Familias" },
  { id: "radius", label: "Radio atómico" },
  { id: "ionization", label: "Ionización" }
];

function layerValue(element, layer) {
  if (layer === "radius") return `${element.row <= 3 ? "↑" : "↓"} ${element.col <= 2 ? "mayor" : "menor"}`;
  if (layer === "ionization") return `${element.col >= 13 ? "alta" : "media"}`;
  return element.family;
}

const chemistryFacts = [
  "El Francio es tan escaso que se estima que solo hay entre 20 a 30 gramos en toda la Tierra en cualquier momento.",
  "El Mercurio y el Bromo son los únicos elementos de la tabla que son líquidos a temperatura ambiente.",
  "El Carbono es la base de toda la vida conocida y puede formar más compuestos que todos los demás elementos combinados.",
  "El Titanio es tan fuerte como el acero pero 45% más ligero, y es casi completamente inmune a la corrosión."
];

function FactCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % chemistryFacts.length);
    }, 12000); // 12 segundos
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
            className={`dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); setIsPaused(true); }}
            aria-label={`Ver dato ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function ElementLegend() {
  return (
    <div className="element-legend">
      <span className="eyebrow">Cómo leer esta tabla:</span>
      <div className="legend-anatomy">
        <div className="element family-no-metal legend-box">
          <small>6</small>
          <b aria-hidden="true">C</b>
          <span aria-hidden="true">12.011</span>
        </div>
        <div className="legend-labels">
          <div className="label-item">← Número Atómico (Z)</div>
          <div className="label-item">← Símbolo Químico</div>
          <div className="label-item">← Masa Atómica</div>
        </div>
      </div>
    </div>
  );
}

const FormatConfig = ({ configStr }) => {
  if (!configStr) return '—';
  const parts = configStr.split(/([spdf]\d+)/);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/([spdf])(\d+)/);
        if (match) {
          return <span key={i}>{match[1]}<sup>{match[2]}</sup></span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

const Nucleus3D = ({ z, mass }) => {
  const protons = z;
  const neutrons = Math.round(mass) - z;
  
  const visualProtons = Math.min(protons, 20);
  const visualNeutrons = Math.min(neutrons, 25);
  
  const particles = useMemo(() => {
    const arr = [];
    for(let i = 0; i < visualProtons; i++) arr.push({ type: 'p' });
    for(let i = 0; i < visualNeutrons; i++) arr.push({ type: 'n' });
    arr.sort(() => Math.random() - 0.5);
    
    return arr.map(p => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 16;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const zTranslate = (Math.random() - 0.5) * 24;
      return { ...p, x, y, zTranslate };
    });
  }, [z, mass]);

  return (
    <div className="nucleus-3d-cluster">
      <div className="particles-container">
        {particles.map((p, i) => (
          <div 
            key={i} 
            className={`nucleon ${p.type}`} 
            style={{ transform: `translate3d(${p.x}px, ${p.y}px, ${p.zTranslate}px)` }} 
          />
        ))}
      </div>
      <div className="nucleus-label-overlay">
        <span>{z}p⁺</span>
        <span>{neutrons}n⁰</span>
      </div>
    </div>
  );
};

function ElementModal({ element, onClose }) {
  const [showLabels, setShowLabels] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!element) return null;
  const familyClass = `family-${element.family.toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`;
  
  const getExactElectronsPerShell = (configStr) => {
    if (!configStr) return [];
    
    const nobleGasCores = {
      '[He]': '1s2',
      '[Ne]': '1s2 2s2 2p6',
      '[Ar]': '1s2 2s2 2p6 3s2 3p6',
      '[Kr]': '1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6',
      '[Xe]': '1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6 5s2 4d10 5p6',
      '[Rn]': '1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6 5s2 4d10 5p6 6s2 4f14 5d10 6p6'
    };
    
    let expandedConfig = configStr;
    Object.keys(nobleGasCores).forEach(core => {
      if (expandedConfig.includes(core)) {
        expandedConfig = expandedConfig.replace(core, nobleGasCores[core]);
      }
    });

    const regex = /(\d)[spdf](\d+)/g;
    let match;
    const shells = {};
    
    while ((match = regex.exec(expandedConfig)) !== null) {
      const level = parseInt(match[1]);
      const electrons = parseInt(match[2]);
      
      if (!shells[level]) shells[level] = 0;
      shells[level] += electrons;
    }
    
    const maxLevel = Math.max(...Object.keys(shells).map(Number), 0);
    const result = [];
    for (let i = 1; i <= maxLevel; i++) {
      result.push(shells[i] || 0);
    }
    
    return result;
  };

  const electronsPerShell = useMemo(() => getExactElectronsPerShell(element.config), [element.config]);
  const renderShells = electronsPerShell.length > 0 ? electronsPerShell : Array.from({length: element.row}).map(() => 1);

  return (
    <div className={`modal-overlay-3d ${familyClass}-bg`} onClick={onClose}>
      <button className="modal-close-3d" onClick={onClose} aria-label="Cerrar"><X size={32} /></button>
      
      <div className="modal-split-layout" onClick={e => e.stopPropagation()}>
        
        {/* Left Side: Hero Image as Background */}
        <div className={`modal-hero-side ${familyClass}-bg`}>
          <img 
            src={`/real-elements/${element.symbol.toLowerCase()}.jpg`} 
            alt={`Apariencia natural de ${element.name}`} 
            className="hero-side-bg"
            onError={(e) => { e.target.style.opacity = 0; }}
          />
          <div className="hero-side-gradient"></div>
          
          <div className="hero-side-content">
            <span className="hero-z-large">Z = {element.z}</span>
            <h1 className="hero-symbol-giant">{element.symbol}</h1>
            <h2 className="hero-name-large">{element.name}</h2>
            <div className="hero-family-badge">{element.family}</div>
            
            <div className="hero-didactic-info">
              {element.category === "variable" && (
                <div className="didactic-alert-hero">
                  <strong>⚠️ Cuidado en Nomenclatura</strong>
                  <p>Este elemento usa diferentes sufijos (oso/ico) u otros prefijos según el estado de oxidación. Revisa bien sus valencias.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Atom and Data */}
        <div className="modal-data-side">
          
          <div className="atom-presentation">
            
            {/* Didactic Toggle Switch */}
            <div className="didactic-toggle-container">
              <span className="didactic-toggle-label">Ocultar Etiquetas</span>
              <div 
                className={`toggle-switch ${showLabels ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setShowLabels(!showLabels); }}
              >
                <div className="toggle-knob"></div>
              </div>
              <span className="didactic-toggle-label">Mostrar Etiquetas</span>
            </div>

            {/* Pedagogical Labels (Conditional) */}
            {showLabels && (
              <>
                <div className="pedagogical-label label-nucleus">
                  <span>Núcleo Atómico</span>
                  <small>(Protones + Neutrones)</small>
                </div>
                
                <div className="pedagogical-label label-cloud">
                  <span>Nube Electrónica / Zonas REEMPE</span>
                  <small>Niveles de Energía: {renderShells.length}</small>
                </div>
              </>
            )}

            <div className="atom-container-3d-large" style={{ position: 'relative', width: '100%', height: '350px' }}>
               <Atom3D z={element.z} mass={element.mass} shells={renderShells} />
            </div>
            
            <div className="electron-configuration-breakdown">
               Distribución cuántica: <strong>{renderShells.join(" - ")}</strong> electrones por capa (K, L, M...)
            </div>
          </div>

          <div className="data-grid-3d">
            <div className="glass-card">
              <span className="glass-label">Masa Atómica</span>
              <strong className="glass-value">{element.mass} u</strong>
            </div>
            <div className="glass-card">
              <span className="glass-label">Configuración Electrónica</span>
              <strong className="glass-value"><FormatConfig configStr={element.config} /></strong>
            </div>
            <div className="glass-card">
              <span className="glass-label">Estados de Oxidación</span>
              <strong className="glass-value">{element.ox || '—'}</strong>
            </div>
            <div className="glass-card">
              <span className="glass-label">Electronegatividad</span>
              <strong className="glass-value">{element.en || '—'}</strong>
            </div>
            <div className="glass-card">
              <span className="glass-label">Ubicación en Tabla</span>
              <strong className="glass-value">Grupo {element.col} / Periodo {element.row}</strong>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

function Layout({ children }) {
  const [streak, setStreak] = useState(getStudyStreak());
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("quimica-preuni-theme") === "dark");
  useEffect(() => { const update = () => setStreak(getStudyStreak()); window.addEventListener("study:updated", update); return () => window.removeEventListener("study:updated", update); }, []);
  useEffect(() => { document.documentElement.dataset.theme = darkMode ? "dark" : "light"; localStorage.setItem("quimica-preuni-theme", darkMode ? "dark" : "light"); }, [darkMode]);
  return <div className="app-shell">
    <header className="site-header">
      <Link className="brand" to="/" aria-label="38 Elementos, inicio"><img src={darkMode ? "/logo-dark.svg" : "/logo.svg"} alt="38 Elementos · La tabla periódica que sí cae" /></Link>
      <div className="header-actions"><span className="streak"><img src="/visuals/student-avatar.jpg" alt="Estudiante" className="avatar" loading="lazy" /><Flame size={16} aria-hidden="true" /> {streak} {streak === 1 ? "día" : "días"}</span><button className="theme-toggle" onClick={() => setDarkMode((current) => !current)} aria-label={darkMode ? "Cambiar a tema claro" : "Cambiar a tema oscuro"} title={darkMode ? "Tema claro" : "Tema oscuro"}>{darkMode ? <Sun size={17} /> : <Moon size={17} />}</button></div>
    </header>
    {children}
    <aside className="contact-cta" aria-label="Únete a la comunidad"><div><strong>Quiero aprender química de verdad</strong><small style={{ display: 'block', fontSize: '10px', opacity: 0.8, marginTop: '2px' }}>Clases en vivo · simulacros · comunidad</small></div><a href={communityUrl} target="_blank" rel="noreferrer"><Target size={15} aria-hidden="true" /> Unirme a Skool</a></aside>
    <footer className="site-footer">Desarrollado por <a href="https://juan.cabellosalirrosas.com" target="_blank" rel="noreferrer">Xavier Cabello</a></footer>
  </div>;
}

function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [tableLayer, setTableLayer] = useState("families");
  const [openTopic, setOpenTopic] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const filtered = useMemo(() => elements.filter((element) => {
    const matchesQuery = `${element.name} ${element.symbol} ${element.z}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (category === "all" || element.category === category);
  }), [query, category]);
  const completedTopics = topics.filter((topic) => getBestScore(topic.id)).length;
  const nextTopic = topics.find((topic) => getDueQuestions(topic.id).length > 0) ?? topics.find((topic) => !getBestScore(topic.id)) ?? topics[0];
  const diagnostic = getDiagnostic();
  const dueReviews = getDueReviewCount();

  return <main>
    <section className="learning-mode" aria-labelledby="mode-heading"><div><span className="eyebrow">Aprendizaje adaptativo</span><h2 id="mode-heading">Tu siguiente paso, con intención.</h2><p>{diagnostic ? `Diagnóstico completado: ${diagnostic.score}/${diagnostic.total}.` : "Haz un diagnóstico breve para que la plataforma te recomiende una ruta."}{dueReviews > 0 ? ` Tienes ${dueReviews} repaso${dueReviews === 1 ? "" : "s"} listo${dueReviews === 1 ? "" : "s"}.` : ""}</p></div><div className="learning-mode-actions">{!diagnostic && <Link className="secondary-action" to="/diagnostico"><ListChecks size={16} /> Hacer diagnóstico</Link>}{diagnostic && <Link className="secondary-action" to="/diagnostico">Ver mi mapa</Link>}<Link className="primary-action" to={`/quiz/${nextTopic.id}`}><ListChecks size={16} /> {dueReviews > 0 ? "Repasar ahora" : "Continuar ruta"}</Link></div></section>
    <section className="pathways" aria-label="Rutas de aprendizaje"><Link to={`/quiz/${nextTopic.id}`}><img src="/visuals/path-exam.jpg" alt="" loading="lazy" className="path-img" /><span className="eyebrow">Ruta Examen</span><strong>Practica con foco</strong><small>Preguntas, valencias y velocidad para tu próxima evaluación.</small></Link><Link to="/laboratorio"><img src="/visuals/path-understanding.jpg" alt="" loading="lazy" className="path-img" /><span className="eyebrow">Ruta Comprensión</span><strong>Explora el laboratorio</strong><small>Construye átomos y conecta estructura con comportamiento.</small></Link><Link to="/docentes"><img src="/visuals/teacher-learning-map.jpg" alt="" loading="lazy" className="path-img" /><span className="eyebrow">Para acompañar</span><strong>Vista docente</strong><small>Observa progreso y conceptos que necesitan intervención.</small></Link></section>
    <section className="hero"><img src="/visuals/hero-periodic-map.jpg" alt="Mapa de la tabla periódica" className="hero-img" loading="lazy" /><div className="hero-content"><div className="hero-number">38 <span>de 118</span></div><h1>Esto es lo que necesitas memorizar.</h1><p>Los 38 elementos marcados son los que sí caen en el examen. Los otros 80 están en gris: no pierdas tiempo con ellos.</p></div></section>
    <section className="study-guide" aria-labelledby="guide-heading"><div><span className="eyebrow">Ruta sugerida</span><h2 id="guide-heading">Aprende en orden, practica con intención.</h2><p>{completedTopics === 0 ? "Empieza por la base y avanza tema a tema." : `Has completado ${completedTopics} de ${topics.length} temas. Tu siguiente paso es ${nextTopic.title}.`}</p></div><Link className="primary-action" to={`/quiz/${nextTopic.id}`}><ListChecks size={16} aria-hidden="true" /> {completedTopics === topics.length ? "Repasar de nuevo" : "Continuar ruta"}</Link><div className="route-progress" aria-label={`${completedTopics} de ${topics.length} temas completados`}><span style={{ width: `${(completedTopics / topics.length) * 100}%` }} /></div>{completedTopics === topics.length && <img src="/visuals/module-certificate.jpg" alt="Certificado de completitud" className="certificate-img" loading="lazy" />}</section>
    <section className="table-section" aria-labelledby="table-heading">
      <FactCarousel />
      <h2 id="table-heading" className="sr-only">Tabla periódica priorizada</h2>
      <label className="search"><Search size={17} aria-hidden="true" /><span className="sr-only">Buscar elemento</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busca por nombre, símbolo o número — ej. hierro, Fe, 26" /></label>
      <div className="filters" role="group" aria-label="Filtrar elementos">{categories.map((item) => <button key={item.id} className={category === item.id ? "active" : ""} onClick={() => setCategory(item.id)} aria-pressed={category === item.id}>{item.label} <small>{item.count}</small></button>)}</div>
      <div className="table-controls-wrapper">
        <div className="table-layers" role="group" aria-label="Capas de la tabla">{tableLayers.map((layer) => <button key={layer.id} className={tableLayer === layer.id ? "active" : ""} onClick={() => setTableLayer(layer.id)} aria-pressed={tableLayer === layer.id}>{layer.label}</button>)}</div>
        <ElementLegend />
      </div>
      <div className={`periodic-grid layer-${tableLayer}`} aria-live="polite">
        {filtered.map((element) => (
          <button 
            key={element.z} 
            className={`element family-${element.family.toLowerCase().replaceAll(" ", "-")}`} 
            style={{ gridColumn: element.col, gridRow: element.row, cursor: 'pointer' }} 
            onClick={() => setSelectedElement(element)}
            aria-label={`${element.name}, número atómico ${element.z}`}
          >
            <small>{element.z}</small>
            <b aria-hidden="true">{element.symbol}</b>
            <span aria-hidden="true">{tableLayer === "families" ? element.mass : layerValue(element, tableLayer)}</span>
          </button>
        ))}
      </div>
      {!filtered.length && <p className="empty-state">No encontramos elementos con esa búsqueda.</p>}
    </section>
    <section className="topics" aria-labelledby="topics-heading"><div className="section-heading"><div><h2 id="topics-heading">Chuletas por tema</h2><p>Ocho recorridos para estudiar, practicar y revisar.</p></div><span>{completedTopics}/{topics.length} completados</span></div>{topics.map((topic) => { const best = getBestScore(topic.id); const mistakes = getMistakes(topic.id); return <article className={`topic ${openTopic === topic.id ? "expanded" : ""}`} key={topic.id}><button className="topic-toggle" onClick={() => setOpenTopic(openTopic === topic.id ? null : topic.id)} aria-expanded={openTopic === topic.id}><span className="topic-number">{topic.number}</span><span><strong>{topic.title}</strong><small>{topic.tag}{best ? ` · Mejor: ${best.score}/${best.total}` : " · Sin intentar"}</small></span><ChevronDown size={17} aria-hidden="true" /></button>{openTopic === topic.id && <div className="topic-body"><div className="topic-meta"><span>{topic.level}</span><span>{topic.duration}</span></div><p>{topic.description}</p><p className="prerequisite"><strong>Antes de empezar:</strong> {topic.prerequisite}</p><div className="topic-actions"><Link className="primary-action" to={`/quiz/${topic.id}`}><ListChecks size={16} aria-hidden="true" /> Practicar este tema</Link>{mistakes.length > 0 && <Link className="secondary-action" to={`/quiz/${topic.id}?mode=mistakes`}><CheckCircle size={16} aria-hidden="true" /> Repasar {mistakes.length} error{mistakes.length === 1 ? "" : "es"}</Link>}</div></div>}</article>; })}</section>
    <ElementModal element={selectedElement} onClose={() => setSelectedElement(null)} />
  </main>;
}

function App() { return <Layout><Suspense fallback={<main className="quiz-page"><p>Cargando práctica...</p></main>}><Routes><Route path="/" element={<Home />} /><Route path="/diagnostico" element={<DiagnosticPage />} /><Route path="/laboratorio" element={<LabPage />} /><Route path="/docentes" element={<TeacherPage />} /><Route path="/quiz/:topicId" element={<QuizPage />} /><Route path="*" element={<section className="not-found"><h1>Página no encontrada</h1><Link to="/">Volver al inicio</Link></section>} /></Routes></Suspense></Layout>; }

export default App;
