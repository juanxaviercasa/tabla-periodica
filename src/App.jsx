import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { CheckCircle, ChevronDown, Flame, ListChecks, MessageCircle, Moon, Search, Sun } from "lucide-react";
import { categories, elements, topics } from "./data.js";
import { contactUrl } from "./config.js";
import { getBestScore, getDiagnostic, getDueReviewCount, getDueQuestions, getMistakes, getStudyStreak } from "./storage.js";

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
    <aside className="contact-cta" aria-label="Material de química por WhatsApp"><span>¿Quieres todo el material?</span><a href={contactUrl} target="_blank" rel="noreferrer"><MessageCircle size={15} aria-hidden="true" /> WhatsApp</a></aside>
    <footer className="site-footer">Desarrollado por <a href="https://juan.cabellosalirrosas.com" target="_blank" rel="noreferrer">Xavier Cabello</a></footer>
  </div>;
}

function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [tableLayer, setTableLayer] = useState("families");
  const [openTopic, setOpenTopic] = useState(null);
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
      <img src="/visuals/periodic-layers.jpg" alt="Capas de la tabla periódica" className="section-banner" loading="lazy" />
      <h2 id="table-heading" className="sr-only">Tabla periódica priorizada</h2>
      <label className="search"><Search size={17} aria-hidden="true" /><span className="sr-only">Buscar elemento</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busca por nombre, símbolo o número — ej. hierro, Fe, 26" /></label>
      <div className="filters" role="group" aria-label="Filtrar elementos">{categories.map((item) => <button key={item.id} className={category === item.id ? "active" : ""} onClick={() => setCategory(item.id)} aria-pressed={category === item.id}>{item.label} <small>{item.count}</small></button>)}</div>
      <div className="table-layers" role="group" aria-label="Capas de la tabla">{tableLayers.map((layer) => <button key={layer.id} className={tableLayer === layer.id ? "active" : ""} onClick={() => setTableLayer(layer.id)} aria-pressed={tableLayer === layer.id}>{layer.label}</button>)}</div>
      <div className={`periodic-grid layer-${tableLayer}`} aria-live="polite">{filtered.map((element) => <button key={element.z} className={`element family-${element.family.toLowerCase().replaceAll(" ", "-")}`} style={{ gridColumn: element.col, gridRow: element.row }} aria-label={`${element.name}, número atómico ${element.z}`}><small>{element.z}</small><b aria-hidden="true">{element.symbol}</b><span aria-hidden="true">{tableLayer === "families" ? element.mass : layerValue(element, tableLayer)}</span></button>)}</div>
      {!filtered.length && <p className="empty-state">No encontramos elementos con esa búsqueda.</p>}
    </section>
    <section className="topics" aria-labelledby="topics-heading"><div className="section-heading"><div><h2 id="topics-heading">Chuletas por tema</h2><p>Ocho recorridos para estudiar, practicar y revisar.</p></div><span>{completedTopics}/{topics.length} completados</span></div>{topics.map((topic) => { const best = getBestScore(topic.id); const mistakes = getMistakes(topic.id); return <article className={`topic ${openTopic === topic.id ? "expanded" : ""}`} key={topic.id}><button className="topic-toggle" onClick={() => setOpenTopic(openTopic === topic.id ? null : topic.id)} aria-expanded={openTopic === topic.id}><span className="topic-number">{topic.number}</span><span><strong>{topic.title}</strong><small>{topic.tag}{best ? ` · Mejor: ${best.score}/${best.total}` : " · Sin intentar"}</small></span><ChevronDown size={17} aria-hidden="true" /></button>{openTopic === topic.id && <div className="topic-body"><div className="topic-meta"><span>{topic.level}</span><span>{topic.duration}</span></div><p>{topic.description}</p><p className="prerequisite"><strong>Antes de empezar:</strong> {topic.prerequisite}</p><div className="topic-actions"><Link className="primary-action" to={`/quiz/${topic.id}`}><ListChecks size={16} aria-hidden="true" /> Practicar este tema</Link>{mistakes.length > 0 && <Link className="secondary-action" to={`/quiz/${topic.id}?mode=mistakes`}><CheckCircle size={16} aria-hidden="true" /> Repasar {mistakes.length} error{mistakes.length === 1 ? "" : "es"}</Link>}</div></div>}</article>; })}</section>
  </main>;
}

function App() { return <Layout><Suspense fallback={<main className="quiz-page"><p>Cargando práctica...</p></main>}><Routes><Route path="/" element={<Home />} /><Route path="/diagnostico" element={<DiagnosticPage />} /><Route path="/laboratorio" element={<LabPage />} /><Route path="/docentes" element={<TeacherPage />} /><Route path="/quiz/:topicId" element={<QuizPage />} /><Route path="*" element={<section className="not-found"><h1>Página no encontrada</h1><Link to="/">Volver al inicio</Link></section>} /></Routes></Suspense></Layout>; }

export default App;
