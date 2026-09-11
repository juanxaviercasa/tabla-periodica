import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { topics } from "./data.js";
import { saveQuizResult } from "./storage.js";

function Result({ topic, answers, score, onRetry }) {
  return <section className="result"><div className="score"><strong>{score}/{topic.questions.length}</strong><span>Tu resultado</span></div><h2>Revisión</h2>{topic.questions.map((question, index) => { const correct = answers[index] === question.answer; return <article className={`review ${correct ? "correct" : "wrong"}`} key={question.q}><div><span>{correct ? <Check size={15} /> : <X size={15} />}</span><strong>{question.q}</strong></div><p>Tu respuesta: {question.options[answers[index]] ?? "Sin respuesta"}</p><p>Correcta: {question.options[question.answer]}</p><small>{question.explain}</small></article>; })}<div className="result-actions"><button className="secondary-action" onClick={onRetry}>Reintentar</button><Link className="primary-action" to="/">Volver a los temas</Link></div></section>;
}

export default function QuizPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const topic = topics.find((item) => item.id === topicId);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  if (!topic) return <section className="not-found"><h1>Tema no encontrado</h1><Link to="/">Volver a los temas</Link></section>;
  const question = topic.questions[index];
  const submit = () => { if (selected === null) return; const next = [...answers, selected]; if (index === topic.questions.length - 1) { const result = next.reduce((total, answer, answerIndex) => total + (answer === topic.questions[answerIndex].answer ? 1 : 0), 0); saveQuizResult(topic.id, result, topic.questions.length); setAnswers(next); setFinished(true); } else { setAnswers(next); setSelected(null); setIndex(index + 1); } };
  const score = answers.reduce((total, answer, answerIndex) => total + (answer === topic.questions[answerIndex].answer ? 1 : 0), 0);
  return <main className="quiz-page"><button className="back-button" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Volver</button><div className="quiz-header"><span>Tema {topic.number}</span><h1>{topic.title}</h1>{!finished && <p>Pregunta {index + 1} de {topic.questions.length}</p>}</div>{finished ? <Result topic={topic} answers={answers} score={score} onRetry={() => { setIndex(0); setSelected(null); setAnswers([]); setFinished(false); }} /> : <section className="question-card"><div className="progress"><span style={{ width: `${((index + 1) / topic.questions.length) * 100}%` }} /></div><h2>{question.q}</h2><div className="options">{question.options.map((option, optionIndex) => <button key={option} className={selected === optionIndex ? "selected" : ""} onClick={() => setSelected(optionIndex)} aria-pressed={selected === optionIndex}>{option}</button>)}</div><button className="primary-action next-button" disabled={selected === null} onClick={submit}>{index === topic.questions.length - 1 ? "Ver resultado" : "Siguiente"} <ArrowUpRight size={16} /></button></section>}</main>;
}
