import { useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, CheckCircle, X } from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { topics } from "./data.js";
import { getDueQuestions, saveQuizResult } from "./storage.js";
import { communityUrl } from "./config.js";

function Result({ topic, questions, answers, score, onRetry, reviewMode }) {
  const perfectScore = score === questions.length;
  return <section className="result"><div className="score">{perfectScore && !reviewMode && <img src="/visuals/achievement-unlocked.jpg" alt="Logro desbloqueado" className="achievement-img" loading="lazy" />}<div><strong>{score}/{questions.length}</strong><span>{reviewMode ? "Repaso de errores" : "Tu resultado"}</span></div></div>{!perfectScore && <a href={communityUrl} target="_blank" rel="noreferrer" className="quiz-mistake-cta"><strong>Sabías el dato. Te falló el ejercicio.</strong><span>Eso es lo que resolvemos en el grupo →</span></a>}<h2>Revisión</h2>{questions.map((question, index) => { const correct = answers[index] === question.answer; return <article className={`review ${correct ? "correct" : "wrong"}`} key={question.id}><div><span>{correct ? <Check size={15} /> : <X size={15} />}</span><strong>{question.q}</strong></div><p>Tu respuesta: {question.options[answers[index]] ?? "Sin respuesta"}</p><p>Correcta: {question.options[question.answer]}</p><small>{question.explain}</small></article>; })}<div className="result-actions"><button className="secondary-action" onClick={onRetry}>{reviewMode ? "Repetir repaso" : "Reintentar"}</button><Link className="primary-action" to="/">Volver a los temas</Link></div></section>;
}

export default function QuizPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const topic = topics.find((item) => item.id === topicId);
  const reviewMode = searchParams.get("mode") === "mistakes";
  const questions = useMemo(() => {
    if (!topic) return [];
    const mistakeIds = getDueQuestions(topic.id);
    return reviewMode && mistakeIds.length ? topic.questions.filter((question) => mistakeIds.includes(question.id)) : topic.questions;
  }, [topic, reviewMode]);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  if (!topic) return <section className="not-found"><h1>Tema no encontrado</h1><Link to="/">Volver a los temas</Link></section>;
  if (!questions.length) return <section className="not-found"><h1>No hay errores pendientes</h1><p>Responde el quiz completo para construir tu repaso personalizado.</p><Link to={`/quiz/${topic.id}`}>Practicar el tema</Link></section>;

  const question = questions[index];
  const restart = () => { setIndex(0); setSelected(null); setAnswers([]); setFinished(false); setStarted(true); };
  const submit = () => {
    if (selected === null) return;
    const next = [...answers, selected];
    if (index === questions.length - 1) {
      const result = next.reduce((total, answer, answerIndex) => total + (answer === questions[answerIndex].answer ? 1 : 0), 0);
      const mistakes = next.reduce((ids, answer, answerIndex) => answer === questions[answerIndex].answer ? ids : [...ids, questions[answerIndex].id], []);
      if (!reviewMode) saveQuizResult(topic.id, result, questions.length, mistakes, questions.map((question, questionIndex) => ({ questionId: question.id, correct: next[questionIndex] === question.answer })));
      setAnswers(next); setFinished(true);
    } else { setAnswers(next); setSelected(null); setIndex(index + 1); }
  };
  const score = answers.reduce((total, answer, answerIndex) => total + (answer === questions[answerIndex].answer ? 1 : 0), 0);

  return <main className="quiz-page"><button className="back-button" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Volver</button><div className="quiz-header"><span>Tema {topic.number}{reviewMode ? " · Repaso" : ""}</span><h1>{topic.title}</h1>{started && !finished && <p>Pregunta {index + 1} de {questions.length}</p>}</div>{!started ? <section className="lesson-card"><div className="lesson-kicker"><CheckCircle size={16} /> Antes de practicar</div><h2>{reviewMode ? "Vamos a recuperar tus errores." : topic.microLesson.objective}</h2>{!reviewMode && topic.microLesson.images && <div className="lesson-gallery">{topic.microLesson.images.map(img => <img key={img} src={`/visuals/${img}`} alt="" loading="lazy" />)}</div>}{reviewMode ? <p>Este recorrido contiene solo las preguntas que fallaste anteriormente. Lee cada explicación y vuelve a intentarlo.</p> : <p>En menos de {topic.duration}, fija estas tres ideas y luego comprueba cuánto recuerdas.</p>}{!reviewMode && <ul>{topic.microLesson.points.map((point) => <li key={point}>{point}</li>)}</ul>}<button className="primary-action lesson-start" onClick={() => setStarted(true)}>{reviewMode ? "Empezar repaso" : "Entendido, practicar"} <ArrowUpRight size={16} /></button></section> : finished ? <Result topic={topic} questions={questions} answers={answers} score={score} reviewMode={reviewMode} onRetry={restart} /> : <section className="question-card"><div className="progress"><span style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div><h2>{question.q}</h2><div className="options">{question.options.map((option, optionIndex) => <button key={option} className={selected === optionIndex ? "selected" : ""} onClick={() => setSelected(optionIndex)} aria-pressed={selected === optionIndex}>{option}</button>)}</div><button className="primary-action next-button" disabled={selected === null} onClick={submit}>{index === questions.length - 1 ? "Ver resultado" : "Siguiente"} <ArrowUpRight size={16} /></button></section>}</main>;
}
