import React, { Suspense, lazy, useState, useEffect } from "react";
import { X, ArrowLeftRight, Check, Zap, Flame, Droplets, Wind, Scale, HelpCircle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const AtomViewer3D = lazy(() => import("./AtomViewer3D.jsx"));

export function ElementComparatorModal({
  compareElements,
  onRemoveElement,
  onClearAll,
  onClose
}) {
  const [active3dAtom, setActive3dAtom] = useState(0); // 0 for Element A, 1 for Element B

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!compareElements || compareElements.length === 0) return null;

  const elemA = compareElements[0];
  const elemB = compareElements[1] || null;

  // Predict bond type based on electronegativity difference
  const enA = elemA && elemA.en && elemA.en !== "—" ? parseFloat(elemA.en) : null;
  const enB = elemB && elemB.en && elemB.en !== "—" ? parseFloat(elemB.en) : null;

  let deltaEn = null;
  let bondPrediction = null;

  if (enA !== null && enB !== null) {
    deltaEn = Math.abs(enA - enB).toFixed(2);
    const d = parseFloat(deltaEn);
    if (d >= 1.7) {
      bondPrediction = {
        type: "Enlace Iónico Predominante",
        desc: "Fuerte transferencia de electrones; alta diferencia de electronegatividad (ΔEN ≥ 1.7). Típico entre un metal muy electropositivo y un no metal.",
        badgeClass: "bond-ionic"
      };
    } else if (d > 0.4) {
      bondPrediction = {
        type: "Enlace Covalente Polar",
        desc: "Compartición asimétrica de pares electrónicos (0.4 < ΔEN < 1.7); formación de dipolos eléctricos permanentes.",
        badgeClass: "bond-polar"
      };
    } else {
      bondPrediction = {
        type: "Enlace Covalente Apolar",
        desc: "Compartición prácticamente equitativa de la nube de valencia (ΔEN ≤ 0.4); nube electrónica simétrica.",
        badgeClass: "bond-apolar"
      };
    }
  }

  return (
    <div className="comparator-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="comparator-modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="comparator-modal-header">
          <div className="comparator-title-wrap">
            <div className="comparator-icon-badge">
              <Scale size={20} />
            </div>
            <div>
              <h2>Comparador Químico Comparativo</h2>
              <p>
                {elemB
                  ? `Analizando ${elemA.name} (${elemA.symbol}) frente a ${elemB.name} (${elemB.symbol})`
                  : `Seleccionado 1 de 2: ${elemA.name} (${elemA.symbol}). Elige un segundo elemento en la tabla.`}
              </p>
            </div>
          </div>

          <div className="comparator-header-actions">
            <button
              type="button"
              className="comparator-clear-btn"
              onClick={onClearAll}
              title="Limpiar selección"
            >
              Reiniciar
            </button>
            <button
              type="button"
              className="comparator-close-btn"
              onClick={onClose}
              aria-label="Cerrar comparador"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="comparator-body-scroll">
          {/* Dual Specimen & 3D Stage Cards */}
          <div className="comparator-cards-split">
            {/* Card A */}
            <div className={`comparator-element-card family-${elemA.family.toLowerCase().replace(/ /g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}>
              <div className="card-top-identity">
                <span className="card-z">Z = {elemA.z}</span>
                <button
                  type="button"
                  className="card-remove-btn"
                  onClick={() => onRemoveElement(elemA.z)}
                  title="Quitar elemento"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="card-hero-row">
                <div className="card-specimen-thumbnail">
                  <img
                    src={`/real-elements/${elemA.symbol.toLowerCase()}.jpg`}
                    alt={`Muestra de ${elemA.name}`}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <span className="card-symbol-huge">{elemA.symbol}</span>
                </div>
                <div className="card-titles">
                  <h3>{elemA.name}</h3>
                  <div className="card-family-tag">{elemA.family}</div>
                  <span className="card-quantum-tag">
                    Período {elemA.period} · Grupo {elemA.group} · Bloque {elemA.block.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="card-cta-row">
                <Link
                  to={`/elemento/${elemA.symbol.toLowerCase()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-detail-link"
                >
                  Ver ficha completa ↗
                </Link>
                <button
                  type="button"
                  className={`card-3d-toggle-btn ${active3dAtom === 0 ? "active" : ""}`}
                  onClick={() => setActive3dAtom(0)}
                >
                  Ver Modelo 3D
                </button>
              </div>
            </div>

            {/* Middle Versus / Bond Predictor */}
            <div className="comparator-versus-divider">
              <span className="versus-pill">VS</span>
              {deltaEn !== null && bondPrediction && (
                <div className={`comparator-bond-callout ${bondPrediction.badgeClass}`}>
                  <span className="bond-callout-title">Predicción de Enlace</span>
                  <strong className="delta-en-number">ΔEN = {deltaEn}</strong>
                  <span className="bond-type-name">{bondPrediction.type}</span>
                  <small className="bond-type-desc">{bondPrediction.desc}</small>
                </div>
              )}
            </div>

            {/* Card B (or empty placeholder slot) */}
            {elemB ? (
              <div className={`comparator-element-card family-${elemB.family.toLowerCase().replace(/ /g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}>
                <div className="card-top-identity">
                  <span className="card-z">Z = {elemB.z}</span>
                  <button
                    type="button"
                    className="card-remove-btn"
                    onClick={() => onRemoveElement(elemB.z)}
                    title="Quitar elemento"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="card-hero-row">
                  <div className="card-specimen-thumbnail">
                    <img
                      src={`/real-elements/${elemB.symbol.toLowerCase()}.jpg`}
                      alt={`Muestra de ${elemB.name}`}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <span className="card-symbol-huge">{elemB.symbol}</span>
                  </div>
                  <div className="card-titles">
                    <h3>{elemB.name}</h3>
                    <div className="card-family-tag">{elemB.family}</div>
                    <span className="card-quantum-tag">
                      Período {elemB.period} · Grupo {elemB.group} · Bloque {elemB.block.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="card-cta-row">
                  <Link
                    to={`/elemento/${elemB.symbol.toLowerCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-detail-link"
                  >
                    Ver ficha completa ↗
                  </Link>
                  <button
                    type="button"
                    className={`card-3d-toggle-btn ${active3dAtom === 1 ? "active" : ""}`}
                    onClick={() => setActive3dAtom(1)}
                  >
                    Ver Modelo 3D
                  </button>
                </div>
              </div>
            ) : (
              <div className="comparator-element-card empty-slot">
                <div className="empty-slot-content">
                  <div className="empty-slot-icon">+</div>
                  <h4>Selecciona el 2º elemento</h4>
                  <p>Haz clic en cualquier casilla de la tabla periódica para contrastarlo con {elemA.name}.</p>
                </div>
              </div>
            )}
          </div>

          {/* Interactive 3D Model Stage for the Active Selected Atom */}
          <div className="comparator-3d-section">
            <div className="comparator-3d-header">
              <h4>
                Modelo Atómico Cuántico 3D:{" "}
                <strong>
                  {active3dAtom === 0
                    ? `${elemA.name} (${elemA.symbol})`
                    : elemB ? `${elemB.name} (${elemB.symbol})` : `${elemA.name} (${elemA.symbol})`}
                </strong>
              </h4>
              <div className="comparator-3d-tabs">
                <button
                  type="button"
                  className={active3dAtom === 0 ? "active" : ""}
                  onClick={() => setActive3dAtom(0)}
                >
                  {elemA.symbol} ({elemA.name})
                </button>
                {elemB && (
                  <button
                    type="button"
                    className={active3dAtom === 1 ? "active" : ""}
                    onClick={() => setActive3dAtom(1)}
                  >
                    {elemB.symbol} ({elemB.name})
                  </button>
                )}
              </div>
            </div>

            <div className="comparator-3d-viewport">
              <Suspense fallback={<div className="comparator-loading">Cargando átomo 3D...</div>}>
                <AtomViewer3D element={active3dAtom === 0 ? elemA : (elemB || elemA)} />
              </Suspense>
            </div>
          </div>

          {/* Side-by-Side Metrics Table */}
          {elemB && (
            <div className="comparator-table-section">
              <h4 className="metrics-table-title">Matriz Comparativa de Propiedades Periódicas</h4>
              <div className="comparator-metrics-table">
                <div className="metrics-row header-row">
                  <div className="col-prop">Propiedad</div>
                  <div className="col-val-a">{elemA.symbol} ({elemA.name})</div>
                  <div className="col-diff">Comparativa</div>
                  <div className="col-val-b">{elemB.symbol} ({elemB.name})</div>
                </div>

                {/* Atomic Mass */}
                <div className="metrics-row">
                  <div className="col-prop">Masa Atómica</div>
                  <div className="col-val-a">{elemA.mass} u</div>
                  <div className="col-diff">
                    {Number(elemA.mass) > Number(elemB.mass) ? (
                      <span className="diff-win-a">{elemA.symbol} es más masivo</span>
                    ) : (
                      <span className="diff-win-b">{elemB.symbol} es más masivo</span>
                    )}
                  </div>
                  <div className="col-val-b">{elemB.mass} u</div>
                </div>

                {/* Electronegativity */}
                <div className="metrics-row">
                  <div className="col-prop">Electronegatividad (Pauling)</div>
                  <div className="col-val-a">{elemA.en || "—"}</div>
                  <div className="col-diff">
                    {deltaEn ? `ΔEN = ${deltaEn}` : "—"}
                  </div>
                  <div className="col-val-b">{elemB.en || "—"}</div>
                </div>

                {/* Atomic Radius */}
                <div className="metrics-row">
                  <div className="col-prop">Radio Atómico</div>
                  <div className="col-val-a">{elemA.radius ? `${elemA.radius} pm` : "—"}</div>
                  <div className="col-diff">
                    {elemA.radius && elemB.radius ? (
                      elemA.radius > elemB.radius ? `${elemA.symbol} mayor nube` : `${elemB.symbol} mayor nube`
                    ) : "—"}
                  </div>
                  <div className="col-val-b">{elemB.radius ? `${elemB.radius} pm` : "—"}</div>
                </div>

                {/* Ionization Energy */}
                <div className="metrics-row">
                  <div className="col-prop">1ª Energía de Ionización</div>
                  <div className="col-val-a">{elemA.ionization ? `${elemA.ionization} kJ/mol` : "—"}</div>
                  <div className="col-diff">
                    {elemA.ionization && elemB.ionization ? (
                      elemA.ionization > elemB.ionization
                        ? `${elemA.symbol} retiene más su e⁻`
                        : `${elemB.symbol} retiene más su e⁻`
                    ) : "—"}
                  </div>
                  <div className="col-val-b">{elemB.ionization ? `${elemB.ionization} kJ/mol` : "—"}</div>
                </div>

                {/* Melting Point */}
                <div className="metrics-row">
                  <div className="col-prop">Punto de Fusión</div>
                  <div className="col-val-a">{elemA.melt ? `${elemA.melt} K` : "—"}</div>
                  <div className="col-diff">
                    {elemA.melt && elemB.melt ? (
                      elemA.melt > elemB.melt
                        ? `${elemA.symbol} funde a mayor T`
                        : `${elemB.symbol} funde a mayor T`
                    ) : "—"}
                  </div>
                  <div className="col-val-b">{elemB.melt ? `${elemB.melt} K` : "—"}</div>
                </div>

                {/* Boiling Point */}
                <div className="metrics-row">
                  <div className="col-prop">Punto de Ebullición</div>
                  <div className="col-val-a">{elemA.boil ? `${elemA.boil} K` : "—"}</div>
                  <div className="col-diff">
                    {elemA.boil && elemB.boil ? (
                      elemA.boil > elemB.boil
                        ? `${elemA.symbol} ebulle a mayor T`
                        : `${elemB.symbol} ebulle a mayor T`
                    ) : "—"}
                  </div>
                  <div className="col-val-b">{elemB.boil ? `${elemB.boil} K` : "—"}</div>
                </div>

                {/* Density */}
                <div className="metrics-row">
                  <div className="col-prop">Densidad a 293 K</div>
                  <div className="col-val-a">{elemA.density ? `${elemA.density} g/cm³` : "—"}</div>
                  <div className="col-diff">
                    {elemA.density && elemB.density ? (
                      elemA.density > elemB.density
                        ? `${elemA.symbol} es más denso`
                        : `${elemB.symbol} es más denso`
                    ) : "—"}
                  </div>
                  <div className="col-val-b">{elemB.density ? `${elemB.density} g/cm³` : "—"}</div>
                </div>

                {/* Oxidation States */}
                <div className="metrics-row">
                  <div className="col-prop">Estados de Oxidación</div>
                  <div className="col-val-a">{elemA.ox || "—"}</div>
                  <div className="col-diff">Valencias</div>
                  <div className="col-val-b">{elemB.ox || "—"}</div>
                </div>

                {/* Configuration */}
                <div className="metrics-row">
                  <div className="col-prop">Configuración Cuántica</div>
                  <div className="col-val-a font-mono">{elemA.config || elemA.electron_configuration}</div>
                  <div className="col-diff">Estructura e⁻</div>
                  <div className="col-val-b font-mono">{elemB.config || elemB.electron_configuration}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ElementComparatorModal;
