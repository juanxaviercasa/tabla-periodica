import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
  Lightbulb,
  ExternalLink,
  Layers,
  Flame,
  ChevronLeft,
  ChevronRight,
  Info
} from "lucide-react";
import {
  decomposeWord,
  getSpellerStats,
  spellPhrase,
  POPULAR_CHEM_WORDS
} from "../utils/elementSpeller.js";
import { iupacFamilies } from "../elementsData.js";

// Helper to get family color
function getFamilyColor(familyName) {
  const match = iupacFamilies.find((f) => f.id === familyName);
  return match?.color || "#64748b";
}

export function ElementSpellerModal({ isOpen, onClose, onSelectElement }) {
  const [inputText, setInputText] = useState("GENIO");
  const [wordSolutionsIdx, setWordSolutionsIdx] = useState({});
  const [copied, setCopied] = useState(false);

  // Close on Escape key
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

  // Spell the input phrase
  const phraseResult = useMemo(() => {
    return spellPhrase(inputText);
  }, [inputText]);

  // Aggregate selected elements across all words
  const activeElements = useMemo(() => {
    const all = [];
    phraseResult.words.forEach((w, wIdx) => {
      if (w.spellable && w.solutions.length > 0) {
        const solIdx = wordSolutionsIdx[wIdx] || 0;
        const safeIdx = Math.min(solIdx, w.solutions.length - 1);
        const chosen = w.solutions[safeIdx];
        all.push(...chosen);
      }
    });
    return all;
  }, [phraseResult, wordSolutionsIdx]);

  // Calculate stats
  const stats = useMemo(() => {
    return getSpellerStats(activeElements);
  }, [activeElements]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!stats.formulaText) return;
    const textToCopy = `${stats.formulaText} = ${stats.fullDescription}\n(Total protones: ${stats.totalProtons} | Masa molar: ${stats.totalMass} u)`;
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSelectPreset = (word) => {
    setInputText(word);
    setWordSolutionsIdx({});
  };

  const cycleSolution = (wordIdx, totalSolutions, step) => {
    setWordSolutionsIdx((prev) => {
      const current = prev[wordIdx] || 0;
      const next = (current + step + totalSolutions) % totalSolutions;
      return { ...prev, [wordIdx]: next };
    });
  };

  return (
    <div
      className="speller-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="speller-modal-title"
    >
      <div
        className="speller-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="speller-modal-header">
          <div className="speller-title-wrap">
            <div className="speller-icon-badge">
              <span className="speller-emoji">🔤</span>
            </div>
            <div>
              <div className="speller-eyebrow">
                <Sparkles size={13} />
                <span>Laboratorio de Gamificación Lingüística</span>
              </div>
              <h2 id="speller-modal-title">Deletreo Químico (Word Speller)</h2>
              <p className="speller-subtitle">
                Escribe palabras o frases y sintetízalas en secuencias de elementos químicos con masa molar y número atómico reales.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="speller-close-btn"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="speller-modal-body">
          {/* Input & Preset Bar */}
          <div className="speller-controls-card">
            <label htmlFor="speller-input" className="speller-input-label">
              <span>Ingresa una palabra o frase:</span>
              <span className="speller-char-hint">
                Se detectarán automáticamente símbolos químicos válidos (1 o 2 letras)
              </span>
            </label>
            <div className="speller-input-group">
              <input
                id="speller-input"
                type="text"
                className="speller-text-input"
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value.toUpperCase());
                  setWordSolutionsIdx({});
                }}
                placeholder="Ejemplo: CHOCOLATE, GENIO, PERU..."
                autoFocus
                maxLength={45}
              />
              {inputText && (
                <button
                  type="button"
                  className="speller-clear-btn"
                  onClick={() => {
                    setInputText("");
                    setWordSolutionsIdx({});
                  }}
                  title="Limpiar texto"
                >
                  <RotateCcw size={15} />
                </button>
              )}
            </div>

            {/* Popular quick presets */}
            <div className="speller-presets-tray">
              <span className="presets-label">Palabras populares:</span>
              <div className="presets-pills">
                {POPULAR_CHEM_WORDS.map((p) => (
                  <button
                    key={p.word}
                    type="button"
                    className={`preset-pill-btn ${inputText === p.word ? "active" : ""}`}
                    onClick={() => handleSelectPreset(p.word)}
                    title={p.desc}
                  >
                    <strong>{p.word}</strong>
                    <small>{p.tag}</small>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Spelling Showcase Stage */}
          <div className="speller-stage-card">
            {phraseResult.words.length === 0 ? (
              <div className="speller-empty-state">
                <Sparkles size={40} className="pulse-slow" />
                <h3>Escribe cualquier palabra arriba</h3>
                <p>
                  Descubre cómo tu nombre, tu comida preferida o conceptos científicos se deletrean en la tabla periódica.
                </p>
              </div>
            ) : (
              <div className="speller-words-flow">
                {phraseResult.words.map((w, wIdx) => {
                  const solIdx = wordSolutionsIdx[wIdx] || 0;
                  const totalSolutions = w.solutions.length;

                  if (!w.spellable) {
                    return (
                      <div key={wIdx} className="speller-unspellable-card">
                        <div className="unspellable-tag">Sin combinación 100% IUPAC</div>
                        <div className="unspellable-word">{w.original}</div>
                        <p>
                          No existe una combinación exacta de los 118 elementos que forme esta palabra completa.
                          Prueba con palabras como <em>GENIO, CHOCOLATE, PERÚ, TIERRA, CAFÉ</em>.
                        </p>
                      </div>
                    );
                  }

                  const activeSolution = w.solutions[Math.min(solIdx, totalSolutions - 1)];

                  return (
                    <div key={wIdx} className="speller-word-cluster">
                      {totalSolutions > 1 && (
                        <div className="solution-switcher-bar">
                          <span className="solution-count-tag">
                            Variante {solIdx + 1} de {totalSolutions}
                          </span>
                          <div className="solution-nav-btns">
                            <button
                              type="button"
                              className="sol-nav-btn"
                              onClick={() => cycleSolution(wIdx, totalSolutions, -1)}
                              title="Variante anterior"
                            >
                              <ChevronLeft size={14} />
                            </button>
                            <button
                              type="button"
                              className="sol-nav-btn"
                              onClick={() => cycleSolution(wIdx, totalSolutions, 1)}
                              title="Variante siguiente"
                            >
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Element Tiles Grid */}
                      <div className="speller-tiles-grid">
                        {activeSolution.map((elem, eIdx) => {
                          const famColor = getFamilyColor(elem.family);
                          return (
                            <div
                              key={`${elem.symbol}-${eIdx}`}
                              className={`speller-periodic-tile ${elem.isPreUni ? "is-preuni" : ""}`}
                              style={{
                                "--element-color": famColor
                              }}
                              onClick={() => {
                                if (onSelectElement) {
                                  onSelectElement(elem);
                                  onClose();
                                }
                              }}
                              title={`Clic para inspeccionar a fondo el ${elem.name} (Z=${elem.z})`}
                            >
                              <div className="tile-top-bar">
                                <span className="tile-z" title="Número atómico">{elem.z}</span>
                                <span className="tile-mass" title="Masa atómica">{elem.atomic_mass || elem.mass}</span>
                              </div>
                              <div className="tile-symbol-wrap">
                                <span className="tile-symbol">{elem.symbol}</span>
                              </div>
                              <div className="tile-bottom-bar">
                                <span className="tile-name">{elem.name}</span>
                                {elem.isPreUni && (
                                  <span className="tile-preuni-star" title="Elemento Clave Pre-UNI">★</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Real-time Chemical Metrics & Summary Bar */}
          {activeElements.length > 0 && (
            <div className="speller-metrics-grid">
              <div className="metric-box">
                <span className="metric-label">Protones Totales (Σ Z)</span>
                <strong className="metric-value">{stats.totalProtons} p⁺</strong>
                <small className="metric-hint">Carga nuclear acumulada</small>
              </div>

              <div className="metric-box">
                <span className="metric-label">Masa Molar Teórica</span>
                <strong className="metric-value">{stats.totalMass} g/mol</strong>
                <small className="metric-hint">Suma ponderada isotópica</small>
              </div>

              <div className="metric-box">
                <span className="metric-label">Elementos Clave Pre-UNI</span>
                <strong className="metric-value highlight-accent">
                  {stats.preuniCount} / {stats.totalElements} ({stats.preuniPercent}%)
                </strong>
                <small className="metric-hint">De los 38 que sí caen en admisión</small>
              </div>

              <div className="metric-box">
                <span className="metric-label">Familias Involucradas</span>
                <div className="families-badges-wrap">
                  {stats.families.map((fam) => (
                    <span
                      key={fam}
                      className="speller-fam-badge"
                      style={{
                        borderColor: getFamilyColor(fam),
                        color: getFamilyColor(fam)
                      }}
                    >
                      {fam}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Didactic Context Banner */}
          <div className="speller-didactic-card">
            <div className="didactic-icon-wrap">
              <Lightbulb size={20} />
            </div>
            <div className="didactic-content">
              <h4>¿Cómo funciona el Deletreo Químico?</h4>
              <p>
                Los símbolos de los 118 elementos de la tabla periódica IUPAC constan de 1 o 2 letras
                (la primera siempre en mayúscula y la segunda en minúscula). Mediante grafos de correspondencia fonética,
                podemos encontrar las secuencias atómicas que componen palabras reales. Además, al pulsar sobre cualquiera
                de las tarjetas puedes explorar su configuración electrónica y comportamiento en el laboratorio.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="speller-modal-footer">
          <div className="footer-status-text">
            {stats.formulaText ? (
              <span>
                Fórmula construida: <strong>{stats.formulaText}</strong> ({activeElements.length} átomos)
              </span>
            ) : (
              <span>Escribe una palabra para ver el resultado</span>
            )}
          </div>
          <div className="footer-actions-group">
            <button
              type="button"
              className={`speller-copy-btn ${copied ? "copied" : ""}`}
              onClick={handleCopy}
              disabled={activeElements.length === 0}
            >
              {copied ? (
                <>
                  <Check size={16} /> ¡Copiado al portapapeles!
                </>
              ) : (
                <>
                  <Copy size={16} /> Copiar Deletreo
                </>
              )}
            </button>
            <button
              type="button"
              className="speller-done-btn"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
