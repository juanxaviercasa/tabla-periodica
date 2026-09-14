import React, { useState, useEffect } from "react";
import {
  X,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  BookOpen,
  ChevronRight,
  Eye,
  EyeOff,
  Lightbulb,
  Award
} from "lucide-react";
import { misconceptionsData } from "../data/misconceptionsData.js";

export function MisconceptionsGuideModal({ isOpen, onClose }) {
  const [selectedMisconceptionId, setSelectedMisconceptionId] = useState(
    misconceptionsData[0].id
  );
  const [revealedAnswers, setRevealedAnswers] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const current =
    misconceptionsData.find((m) => m.id === selectedMisconceptionId) ||
    misconceptionsData[0];

  const isAnswerRevealed = !!revealedAnswers[current.id];

  const toggleAnswer = () => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [current.id]: !prev[current.id]
    }));
  };

  return (
    <div
      className="misconceptions-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="misconceptions-modal-title"
    >
      <div
        className="misconceptions-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="misconceptions-modal-header">
          <div className="header-badge-row">
            <span className="modal-kicker">
              <ShieldAlert size={14} /> Didáctica Antialucinación · Royal Society of Chemistry
            </span>
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Cerrar guía"
            >
              <X size={18} />
            </button>
          </div>
          <h2 id="misconceptions-modal-title">
            Guía de Errores Frecuentes de Examen (Chemical Misconceptions)
          </h2>
          <p>
            El aprendizaje profundo ocurre al confrontar las trampas conceptuales clásicas que hacen
            perder puntos en los exámenes de admisión de San Marcos (UNMSM) y la UNI.
          </p>
        </header>

        {/* Body Split */}
        <div className="misconceptions-body-split">
          {/* Sidebar Tabs */}
          <nav className="misconceptions-sidebar" aria-label="Lista de errores frecuentes">
            {misconceptionsData.map((item, idx) => {
              const isSelected = item.id === current.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`misconception-nav-item ${isSelected ? "active" : ""}`}
                  onClick={() => setSelectedMisconceptionId(item.id)}
                >
                  <div className="nav-item-top">
                    <span className="nav-item-num">0{idx + 1}</span>
                    <span className="nav-item-tag">{item.tag}</span>
                  </div>
                  <strong className="nav-item-title">{item.title}</strong>
                </button>
              );
            })}
          </nav>

          {/* Main Inspection View */}
          <section className="misconception-detail-view">
            <div className="detail-hero-tag">
              <span className="tag-pill">{current.tag}</span>
              <h3>{current.title}</h3>
            </div>

            {/* Trap vs Science Cards */}
            <div className="trap-versus-science-grid">
              {/* Trap */}
              <div className="confrontation-card card-trap">
                <div className="card-flag-row">
                  <AlertTriangle size={17} className="text-crimson" />
                  <strong>❌ El Error / Trampa Habitual:</strong>
                </div>
                <p>{current.trapDescription}</p>
              </div>

              {/* Science */}
              <div className="confrontation-card card-science">
                <div className="card-flag-row">
                  <CheckCircle2 size={17} className="text-emerald" />
                  <strong>✅ La Realidad Científica Demostrada:</strong>
                </div>
                <p>{current.scientificReality}</p>
              </div>
            </div>

            {/* Key Comparison */}
            <div className="key-comparison-callout">
              <div className="callout-header">
                <Lightbulb size={16} className="text-amber" />
                <span>Comparación Clave para Recordar:</span>
              </div>
              <code>{current.keyComparison}</code>
            </div>

            {/* Admission Tip */}
            <div className="admission-tip-banner">
              <Award size={18} className="text-amber" />
              <div>
                <strong>Clave de Admisión Preuniversitaria (UNI / UNMSM):</strong>
                <p>{current.admissionTip}</p>
              </div>
            </div>

            {/* Exam Question Flashcard */}
            {current.examQuestion && (
              <div className="modal-exam-flashcard">
                <div className="flashcard-header-bar">
                  <HelpCircle size={16} className="text-indigo" />
                  <span>Pregunta Tipo Examen de Admisión:</span>
                </div>

                <h4 className="exam-question-prompt">
                  {current.examQuestion.prompt}
                </h4>

                <button
                  type="button"
                  className={`modal-toggle-answer-btn ${isAnswerRevealed ? "revealed" : ""}`}
                  onClick={toggleAnswer}
                >
                  {isAnswerRevealed ? (
                    <>
                      <EyeOff size={15} /> Ocultar solución
                    </>
                  ) : (
                    <>
                      <Eye size={15} /> Revelar solución y justificación paso a paso
                    </>
                  )}
                </button>

                {isAnswerRevealed && (
                  <div className="revealed-solution-box">
                    <div className="solution-tag">
                      <CheckCircle2 size={15} className="text-emerald" />
                      <strong>Respuesta Correcta Explicada:</strong>
                    </div>
                    <p>{current.examQuestion.answer}</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <footer className="misconceptions-modal-footer">
          <button type="button" className="primary-action" onClick={onClose}>
            Entendido, volver a la plataforma
          </button>
        </footer>
      </div>
    </div>
  );
}
