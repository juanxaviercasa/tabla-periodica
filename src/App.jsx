import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { CheckCircle, ChevronDown, Flame, ListChecks, MessageCircle, Search } from "lucide-react";
import { categories, elements, topics } from "./data.js";
import { contactUrl } from "./config.js";
import { getBestScore, getMistakes, getStudyStreak } from "./storage.js";

const QuizPage = lazy(() => import("./QuizPage.jsx"));

function Layout({ children }) {
  const [streak, setStreak] = useState(getStudyStreak());
  useEffect(() => { const update = () => setStreak(getStudyStreak()); window.addEventListener("study:updated", update); return () => window.removeEventListener("study:updated", update); }, []);
  return <div className="app-shell">
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Química Preuni, inicio"><img src="/logo.svg" alt="Química Preuni · Aprende lo que sí cae" /></Link>
      <span className="streak"><Flame size={16} aria-hidden="true" /> {streak} {streak === 1 ? "día" : "días"}</span>
    </header>
    {children}
    <aside className="mobile-cta" aria-label="Material de química por WhatsApp"><span>¿Quieres todo el material?</span><a href={contactUrl} target="_blank" rel="noreferrer"><MessageCircle size={15} aria-hidden="true" /> WhatsApp</a></aside>
  </div>;
}

function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [openTopic, setOpenTopic] = useState(null);
  const filtered = useMemo(() => elements.filter((element) => {
    const matchesQuery = `${element.name} ${element.symbol} ${element.z}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (category === "all" || element.category === category);
  }), [query, category]);
  const completedTopics = topics.filter((topic) => getBestScore(topic.id)).length;
  const nextTopic = topics.find((topic) => !getBestScore(topic.id)) ?? topics[0];

  return <main>
    <section className="hero"><div className="hero-number">38 <span>de 118</span></div><h1>Esto es lo que necesitas memorizar.</h1><p>Los 38 elementos marcados son los que sí caen en el examen. Los otros 80 están en gris: no pierdas tiempo con ellos.</p></section>
    <section className="study-guide" aria-labelledby="guide-heading"><div><span className="eyebrow">Ruta sugerida</span><h2 id="guide-heading">Aprende en orden, practica con intención.</h2><p>{completedTopics === 0 ? "Empieza por la base y avanza tema a tema." : `Has completado ${completedTopics} de ${topics.length} temas. Tu siguiente paso es ${nextTopic.title}.`}</p></div><Link className="primary-action" to={`/quiz/${nextTopic.id}`}><ListChecks size={16} aria-hidden="true" /> {completedTopics === topics.length ? "Repasar de nuevo" : "Continuar ruta"}</Link><div className="route-progress" aria-label={`${completedTopics} de ${topics.length} temas completados`}><span style={{ width: `${(completedTopics / topics.length) * 100}%` }} /></div></section>
    <section className="table-section" aria-labelledby="table-heading">
      <h2 id="table-heading" className="sr-only">Tabla periódica priorizada</h2>
      <label className="search"><Search size={17} aria-hidden="true" /><span className="sr-only">Buscar elemento</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busca por nombre, símbolo o número — ej. hierro, Fe, 26" /></label>
      <div className="filters" role="group" aria-label="Filtrar elementos">{categories.map((item) => <button key={item.id} className={category === item.id ? "active" : ""} onClick={() => setCategory(item.id)} aria-pressed={category === item.id}>{item.label} <small>{item.count}</small></button>)}</div>
      <div className="periodic-grid" aria-live="polite">{filtered.map((element) => <button key={element.z} className={`element family-${element.family.toLowerCase().replaceAll(" ", "-")}`} style={{ gridColumn: element.col, gridRow: element.row }} aria-label={`${element.name}, número atómico ${element.z}`}><small>{element.z}</small><b aria-hidden="true">{element.symbol}</b><span aria-hidden="true">{element.mass}</span></button>)}</div>
      {!filtered.length && <p className="empty-state">No encontramos elementos con esa búsqueda.</p>}
    </section>
    <section className="topics" aria-labelledby="topics-heading"><div className="section-heading"><div><h2 id="topics-heading">Chuletas por tema</h2><p>Ocho recorridos para estudiar, practicar y revisar.</p></div><span>{completedTopics}/{topics.length} completados</span></div>{topics.map((topic) => { const best = getBestScore(topic.id); const mistakes = getMistakes(topic.id); return <article className={`topic ${openTopic === topic.id ? "expanded" : ""}`} key={topic.id}><button className="topic-toggle" onClick={() => setOpenTopic(openTopic === topic.id ? null : topic.id)} aria-expanded={openTopic === topic.id}><span className="topic-number">{topic.number}</span><span><strong>{topic.title}</strong><small>{topic.tag}{best ? ` · Mejor: ${best.score}/${best.total}` : " · Sin intentar"}</small></span><ChevronDown size={17} aria-hidden="true" /></button>{openTopic === topic.id && <div className="topic-body"><div className="topic-meta"><span>{topic.level}</span><span>{topic.duration}</span></div><p>{topic.description}</p><p className="prerequisite"><strong>Antes de empezar:</strong> {topic.prerequisite}</p><div className="topic-actions"><Link className="primary-action" to={`/quiz/${topic.id}`}><ListChecks size={16} aria-hidden="true" /> Practicar este tema</Link>{mistakes.length > 0 && <Link className="secondary-action" to={`/quiz/${topic.id}?mode=mistakes`}><CheckCircle size={16} aria-hidden="true" /> Repasar {mistakes.length} error{mistakes.length === 1 ? "" : "es"}</Link>}<a className="secondary-action" href={contactUrl} target="_blank" rel="noreferrer"><MessageCircle size={16} aria-hidden="true" /> Material completo</a></div></div>}</article>; })}</section>
  </main>;
}

function App() { return <Layout><Suspense fallback={<main className="quiz-page"><p>Cargando práctica...</p></main>}><Routes><Route path="/" element={<Home />} /><Route path="/quiz/:topicId" element={<QuizPage />} /><Route path="*" element={<section className="not-found"><h1>Página no encontrada</h1><Link to="/">Volver al inicio</Link></section>} /></Routes></Suspense></Layout>; }

export default App;
