import { BarChart3, BookOpen, CheckCircle, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { elements, topics } from "./data.js";
import { getDueReviewCount, getQuestionMastery } from "./storage.js";

export default function TeacherPage() {
  const masteryCount = topics.reduce((total, topic) => total + topic.questions.filter((question) => getQuestionMastery(topic.id, question.id).streak >= 2).length, 0);
  const reviewCount = getDueReviewCount();
  return <main className="teacher-page"><div className="teacher-hero"><span className="eyebrow">Vista de acompañamiento</span><h1>El aprendizaje también se puede observar.</h1><p>Un panel local para detectar qué conceptos dominan los estudiantes y dónde conviene intervenir.</p></div><div className="teacher-metrics"><article><BarChart3 size={20} /><strong>{masteryCount}</strong><span>preguntas dominadas</span></article><article><BookOpen size={20} /><strong>{reviewCount}</strong><span>repasos pendientes</span></article><article><CheckCircle size={20} /><strong>{elements.length}</strong><span>elementos priorizados</span></article></div><section className="teacher-section"><h2>Lectura rápida del curso</h2><p>Usa los resultados del diagnóstico y los errores de los quizzes para decidir qué explicación trabajar en clase. Esta vista no envía datos: funciona con el progreso guardado en este dispositivo.</p><div className="teacher-topic-list">{topics.map((topic) => <div key={topic.id}><span>{topic.number}. {topic.title}</span><strong>{topic.questions.filter((question) => getQuestionMastery(topic.id, question.id).attempts > 0).length}/{topic.questions.length} preguntas exploradas</strong></div>)}</div></section><Link className="secondary-action" to="/"><LinkIcon size={16} /> Volver a la plataforma</Link></main>;
}
