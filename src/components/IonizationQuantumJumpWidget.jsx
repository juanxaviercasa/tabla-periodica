import React, { useState, useMemo } from "react";
import {
  Zap,
  TrendingUp,
  Award,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  Calculator,
  Eye,
  Info
} from "lucide-react";
import {
  ionizationData,
  calculateQuantumJump,
  PREUNI_IONIZATION_CHALLENGES
} from "../data/ionizationData.js";

export function IonizationQuantumJumpWidget({
  element,
  initialMode = "element", // "element" | "challenge" | "calculator"
  className = ""
}) {
  const [activeTab, setActiveTab] = useState(initialMode);

  // Element analysis state
  const z = element?.z || element?.number || 11; // default to Na for demo if null
  const elementEnergies = useMemo(() => {
    return ionizationData[z] || [element?.ionization || 1000];
  }, [z, element]);

  const elementJump = useMemo(() => {
    return calculateQuantumJump(elementEnergies);
  }, [elementEnergies]);

  // Challenge mode state
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentChallenge = PREUNI_IONIZATION_CHALLENGES[challengeIdx % PREUNI_IONIZATION_CHALLENGES.length];

  // Custom calculator state
  const [customInput, setCustomInput] = useState("578, 1817, 2745, 11577");
  const customEnergies = useMemo(() => {
    return customInput
      .split(/[\s,]+/)
      .map((val) => parseFloat(val))
      .filter((num) => !isNaN(num) && num > 0);
  }, [customInput]);

  const customJump = useMemo(() => {
    return calculateQuantumJump(customEnergies);
  }, [customEnergies]);

  return (
    <div className={`quantum-jump-widget ${className}`}>
      {/* Widget Header */}
      <div className="jump-widget-header">
        <div className="jump-title-group">
          <div className="jump-icon-badge">
            <Zap size={18} />
          </div>
          <div>
            <span className="jump-eyebrow">Diagnóstico Cuántico Pre-UNI</span>
            <h3 className="jump-heading">Salto Cuántico de Energías de Ionización (I₁ → I₂ → I₃)</h3>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="jump-tabs-nav">
          <button
            type="button"
            className={`jump-tab-btn ${activeTab === "element" ? "active" : ""}`}
            onClick={() => setActiveTab("element")}
          >
            <TrendingUp size={13} />
            <span>{element ? `${element.symbol} (Z=${z})` : "Elemento"}</span>
          </button>
          <button
            type="button"
            className={`jump-tab-btn ${activeTab === "challenge" ? "active" : ""}`}
            onClick={() => setActiveTab("challenge")}
          >
            <Award size={13} />
            <span>Reto Examen UNI</span>
          </button>
          <button
            type="button"
            className={`jump-tab-btn ${activeTab === "calculator" ? "active" : ""}`}
            onClick={() => setActiveTab("calculator")}
          >
            <Calculator size={13} />
            <span>Calculadora</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ELEMENT SUCCESSIVE IONIZATION ANALYSIS */}
      {activeTab === "element" && (
        <div className="jump-tab-content">
          <div className="jump-element-summary">
            <p className="jump-desc-text">
              Las energías de ionización sucesivas representan la energía necesaria para arrancar el 1°, 2°, 3° y subsiguientes electrones en estado gaseoso.
              Observa cómo se produce un <strong>salto exponencial</strong> cuando se intenta arrancar un electrón de la capa interna (gas noble).
            </p>
          </div>

          {/* Bar Chart Visualization of Successive Ionizations */}
          <div className="jump-chart-stage">
            <div className="jump-bars-container">
              {elementEnergies.map((val, idx) => {
                const maxVal = Math.max(...elementEnergies);
                const heightPct = Math.max(16, Math.min(100, Math.round((Math.log10(val) / Math.log10(maxVal || 1)) * 100)));
                const isJumpTrigger = elementJump.jumpIndex === idx + 1;
                const ratioObj = elementJump.ratios.find((r) => r.from === idx + 1);

                return (
                  <div key={idx} className="jump-bar-column">
                    {/* Floating Jump Factor Pill if jump occurs here */}
                    {ratioObj && (
                      <div
                        className={`jump-ratio-badge ${ratioObj.ratio === elementJump.maxRatio && elementJump.hasJump ? "highest-jump" : ""}`}
                        title={`Incremento de ${ratioObj.ratio}× respecto a la ionización anterior`}
                      >
                        <span>{ratioObj.ratio}×</span>
                        {ratioObj.ratio === elementJump.maxRatio && elementJump.hasJump && (
                          <small>⚡ Salto</small>
                        )}
                      </div>
                    )}

                    <div className="jump-bar-track">
                      <div
                        className={`jump-bar-fill ${isJumpTrigger && elementJump.hasJump ? "valence-edge" : ""}`}
                        style={{ height: `${heightPct}%` }}
                      >
                        <span className="jump-bar-val">{val}</span>
                      </div>
                    </div>

                    <div className="jump-bar-label">
                      <strong>I<sub>{idx + 1}</sub></strong>
                      <small>{val} kJ/mol</small>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Diagnosis & Predicted Properties */}
          <div className="jump-diagnosis-card">
            <div className="diagnosis-head">
              <Sparkles size={16} className="text-amber" />
              <h4>Diagnóstico de Estructura de Valencia:</h4>
            </div>
            <p className="diagnosis-text">{elementJump.diagnosis}</p>

            <div className="jump-predictions-row">
              <div className="pred-item">
                <small>Electrones de Valencia:</small>
                <strong>{elementJump.valenceElectrons} e⁻</strong>
              </div>
              <div className="pred-item">
                <small>Grupo Teórico IUPAC:</small>
                <strong>{elementJump.prediction.group}</strong>
              </div>
              <div className="pred-item">
                <small>Catión Estable Típico:</small>
                <strong className="text-sky">{elementJump.prediction.ion}</strong>
              </div>
              <div className="pred-item">
                <small>Óxido Característico:</small>
                <strong>{elementJump.prediction.oxide}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRE-UNI CHALLENGE (MYSTERY ELEMENT X) */}
      {activeTab === "challenge" && (
        <div className="jump-tab-content">
          <div className="challenge-card">
            <div className="challenge-meta-row">
              <span className="challenge-badge">
                <Award size={12} /> Pregunta {challengeIdx + 1} de {PREUNI_IONIZATION_CHALLENGES.length}
              </span>
              <button
                type="button"
                className="challenge-next-btn"
                onClick={() => {
                  setChallengeIdx((prev) => (prev + 1) % PREUNI_IONIZATION_CHALLENGES.length);
                  setSelectedOption(null);
                  setShowExplanation(false);
                }}
              >
                <span>Siguiente Reto</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <h4 className="challenge-title">{currentChallenge.title}</h4>
            <p className="challenge-context">{currentChallenge.context}</p>

            {/* Micro Energies Table */}
            <div className="challenge-energies-strip">
              {currentChallenge.energies.map((e, idx) => (
                <div key={idx} className="challenge-energy-pill">
                  <span className="pill-sub">I<sub>{idx + 1}</sub></span>
                  <strong className="pill-num">{e}</strong>
                  <small>kJ/mol</small>
                </div>
              ))}
            </div>

            <p className="challenge-question">
              <strong>Pregunta:</strong> {currentChallenge.question}
            </p>

            {/* Options */}
            <div className="challenge-options-grid">
              {currentChallenge.options.map((opt, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const isCorrect = optIdx === currentChallenge.correctIdx;
                let btnClass = "challenge-opt-btn";
                if (selectedOption !== null) {
                  if (isCorrect) btnClass += " is-correct";
                  else if (isSelected) btnClass += " is-wrong";
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    className={btnClass}
                    onClick={() => {
                      setSelectedOption(optIdx);
                      setShowExplanation(true);
                    }}
                  >
                    <span className="opt-letter">{["A", "B", "C", "D"][optIdx]})</span>
                    <span className="opt-text">{opt}</span>
                    {selectedOption !== null && isCorrect && <CheckCircle2 size={16} />}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="challenge-feedback-box">
                <div className="feedback-status">
                  {selectedOption === currentChallenge.correctIdx ? (
                    <strong className="text-emerald">¡Respuesta Correcta! Excelente análisis cuántico.</strong>
                  ) : (
                    <strong className="text-rose">Respuesta incorrecta. Revisa el salto cuántico abajo:</strong>
                  )}
                </div>
                <p className="feedback-rationale">{currentChallenge.rationale}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOM CALCULATOR */}
      {activeTab === "calculator" && (
        <div className="jump-tab-content">
          <div className="calculator-input-card">
            <label htmlFor="jump-calc-input" className="calc-label">
              <span>Ingresa las energías de ionización sucesivas (separadas por comas o espacios):</span>
              <small>Ejemplo: 496, 4562, 6910, 9543 (kJ/mol)</small>
            </label>
            <div className="calc-input-group">
              <input
                id="jump-calc-input"
                type="text"
                className="calc-text-input"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Valores en kJ/mol"
              />
              <button
                type="button"
                className="calc-reset-btn"
                onClick={() => setCustomInput("738, 1451, 7733, 10543")}
                title="Cargar ejemplo de Grupo IIA"
              >
                <RotateCcw size={14} /> Ejemplo
              </button>
            </div>
          </div>

          {/* Calculator Results */}
          {customEnergies.length >= 2 ? (
            <div className="calc-results-block">
              <div className="calc-ratios-row">
                {customJump.ratios.map((r, idx) => (
                  <div
                    key={idx}
                    className={`calc-ratio-box ${r.ratio === customJump.maxRatio && customJump.hasJump ? "highlight-jump" : ""}`}
                  >
                    <span className="ratio-step">I<sub>{r.to}</sub> / I<sub>{r.from}</sub></span>
                    <strong className="ratio-val">{r.ratio}×</strong>
                    <small>{r.prevVal} → {r.nextVal}</small>
                  </div>
                ))}
              </div>

              <div className="calc-diagnosis-banner">
                <h4>Predicción de Clasificación Periódica:</h4>
                <p>{customJump.diagnosis}</p>
                <div className="jump-predictions-row">
                  <div className="pred-item">
                    <small>Electrones de Valencia:</small>
                    <strong>{customJump.valenceElectrons} e⁻</strong>
                  </div>
                  <div className="pred-item">
                    <small>Grupo Sugerido:</small>
                    <strong>{customJump.prediction.group}</strong>
                  </div>
                  <div className="pred-item">
                    <small>Catión Estable:</small>
                    <strong className="text-sky">{customJump.prediction.ion}</strong>
                  </div>
                  <div className="pred-item">
                    <small>Óxido Típico:</small>
                    <strong>{customJump.prediction.oxide}</strong>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="calc-empty-note">
              <Info size={18} />
              <span>Por favor ingresa al menos 2 valores numéricos positivos para calcular los cocientes de salto.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
