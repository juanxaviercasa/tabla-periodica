import { StudyImage } from "./components/StudyImage.jsx";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, CheckCircle, Sparkles, X } from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { topics } from "./data.js";
import { getDueQuestions, getMistakes, saveQuizResult } from "./storage.js";
import { communityUrl } from "./config.js";

function Result({ topic, questions, answers, score, onRetry, reviewMode }) {
  const perfectScore = score === questions.length;
  return (
    <section className="result">
      <div className="score">
        {perfectScore && !reviewMode && (
          <StudyImage
            src="/visuals/achievement-unlocked.jpg"
            alt="Logro desbloqueado"
            className="achievement-img"
            loading="lazy"
          />
        )}
        <div>
          <strong>{score}/{questions.length}</strong>
          <span>{reviewMode ? "Tu repaso" : "Tu resultado"}</span>
        </div>
      </div>

      {/* Reciprocity-Driven Community CTA */}
      {!perfectScore ? (
        <a
          href={communityUrl}
          target="_blank"
          rel="noreferrer"
          className="quiz-mistake-cta"
          title="Comunidad Química Zenit en Skool"
        >
          <div className="cta-mistake-badge">
            <Sparkles size={13} />
            <span>Comunidad Oficial Química Zenit</span>
          </div>
          <strong>Revisa las explicaciones y refuerza los conceptos que te costaron.</strong>
          <span>Eso es exactamente lo que resolvemos en vivo con bancos en Skool →</span>
        </a>
      ) : (
        <a
          href={communityUrl}
          target="_blank"
          rel="noreferrer"
          className="quiz-perfect-cta"
          title="Comunidad de Élite Química Zenit en Skool"
        >
          <div className="cta-perfect-badge">
            <Sparkles size={13} />
            <span>¡Todas las respuestas correctas!</span>
          </div>
          <strong>Buen resultado en esta práctica de {topic.title}.</strong>
          <span>Lleva tu preparación al siguiente nivel con simulacros avanzados en Skool →</span>
        </a>
      )}

      <h2>Revisión</h2>
      {questions.map((question, index) => {
        const correct = answers[index] === question.answer;
        return (
          <article className={`review ${correct ? "correct" : "wrong"}`} key={question.id}>
            <div>
              <span>{correct ? <Check size={15} /> : <X size={15} />}</span>
              <strong>{question.q}</strong>
            </div>
            <p>Tu respuesta: {question.options[answers[index]] ?? "Sin respuesta"}</p>
            <p>Correcta: {question.options[question.answer]}</p>
            <small>{question.explain}</small>
          </article>
        );
      })}

      <div className="result-actions">
        <button className="secondary-action" onClick={onRetry}>
          {reviewMode ? "Repetir repaso" : "Reintentar"}
        </button>
        <Link className="primary-action" to="/">
          Volver a los temas
        </Link>
      </div>
    </section>
  );
}

export default function QuizPage() {
  const { topicId } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  return <QuizSession key={`${topicId}:${mode}`} topicId={topicId} mode={mode} />;
}

function QuizSession({ topicId, mode }) {
  const navigate = useNavigate();
  const topic = topics.find((item) => item.id === topicId);
  const reviewMode = mode === "mistakes" || mode === "review";
  const [revision, setRevision] = useState(0);
  const [persisted, setPersisted] = useState(true);
  const questions = useMemo(() => {
    if (!topic) return [];
    const ids = mode === "mistakes" ? getMistakes(topic.id) : getDueQuestions(topic.id);
    return reviewMode ? topic.questions.filter((question) => ids.includes(question.id)) : topic.questions;
  }, [topic, mode, reviewMode, revision]);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  if (!topic) return <section className="not-found"><h1>Tema no encontrado</h1><Link to="/">Volver a los temas</Link></section>;
  if (!questions.length) return <main className="not-found"><h1>{mode === "mistakes" ? "No hay errores pendientes" : "No hay repasos programados para hoy"}</h1><p>Puedes practicar el tema completo o volver cuando tengas preguntas pendientes.</p><Link to={`/quiz/${topic.id}`}>Practicar el tema</Link></main>;

  const question = questions[index];
  const restart = () => { setRevision(value => value + 1); setIndex(0); setSelected(null); setAnswers([]); setFinished(false); setStarted(true); };
  const submit = () => {
    if (selected === null) return;
    const next = [...answers, selected];
    if (index === questions.length - 1) {
      const result = next.reduce((total, answer, answerIndex) => total + (answer === questions[answerIndex].answer ? 1 : 0), 0);
      const mistakes = next.reduce((ids, answer, answerIndex) => answer === questions[answerIndex].answer ? ids : [...ids, questions[answerIndex].id], []);
      setPersisted(saveQuizResult(topic.id, result, questions.length, mistakes, questions.map((question, questionIndex) => ({ questionId: question.id, correct: next[questionIndex] === question.answer })), { review: reviewMode }));
      setAnswers(next); setFinished(true);
    } else { setAnswers(next); setSelected(null); setIndex(index + 1); }
  };
  const score = answers.reduce((total, answer, answerIndex) => total + (answer === questions[answerIndex].answer ? 1 : 0), 0);

  return <main className="quiz-page">{!persisted && <p className="storage-notice" role="status">Tu navegador no pudo guardar el progreso. Puedes continuar; se conservará durante esta sesión.</p>}<button className="back-button" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Volver</button><div className="quiz-header"><span>Tema {topic.number}{reviewMode ? " · Repaso" : ""}</span><h1>{topic.title}</h1>{started && !finished && <p>Pregunta {index + 1} de {questions.length}</p>}</div>{!started ? <section className="lesson-card"><div className="lesson-kicker"><CheckCircle size={16} /> Antes de practicar</div><h2>{reviewMode ? (mode === "mistakes" ? "Vamos a recuperar tus errores." : "Vamos a repasar lo que aprendiste.") : topic.microLesson.objective}</h2>{!reviewMode && topic.microLesson.images && <div className="lesson-gallery">{topic.microLesson.images.map(img => <StudyImage key={img} src={`/visuals/${img}`} alt="" loading="lazy" />)}</div>}{reviewMode ? <p>{mode === "mistakes" ? "Este recorrido contiene solo las preguntas que fallaste anteriormente." : "Este recorrido contiene las preguntas cuyo repaso está programado para hoy."} Lee cada explicación y vuelve a intentarlo.</p> : <p>En menos de {topic.duration}, fija estas tres ideas y luego comprueba cuánto recuerdas.</p>}{!reviewMode && <ul>{topic.microLesson.points.map((point) => <li key={point}>{point}</li>)}</ul>}<button className="primary-action lesson-start" onClick={() => setStarted(true)}>{reviewMode ? "Empezar repaso" : "Entendido, practicar"} <ArrowUpRight size={16} /></button></section> : finished ? <Result topic={topic} questions={questions} answers={answers} score={score} reviewMode={reviewMode} onRetry={restart} /> : <section className="question-card"><div className="progress"><span style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div><h2>{question.q}</h2><div className="options">{question.options.map((option, optionIndex) => <button key={option} className={selected === optionIndex ? "selected" : ""} onClick={() => setSelected(optionIndex)} aria-pressed={selected === optionIndex}>{option}</button>)}</div><button className="primary-action next-button" disabled={selected === null} onClick={submit}>{index === questions.length - 1 ? "Ver resultado" : "Siguiente"} <ArrowUpRight size={16} /></button></section>}</main>;
}
