import React from "react";
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Info, Compass, HelpCircle, X } from "lucide-react";
import { periodicTrendsData } from "../data/groupPeriodData.js";

/**
 * PeriodicTrendsOverlay:
 * Renders directional trend vectors and pedagogical callouts explaining periodic behaviors.
 */
export function PeriodicTrendsVectors({ activeTrendId, onClearTrend }) {
  if (!activeTrendId) return null;

  const trend = periodicTrendsData.find((t) => t.id === activeTrendId);
  if (!trend || (trend.dirH === "none" && trend.dirV === "none")) return null;

  return (
    <div className="periodic-trends-vectors-container" aria-live="polite">
      {/* Top Horizontal Vector Bar */}
      {trend.dirH !== "none" && (
        <div
          className={`trend-vector-bar horizontal dir-${trend.dirH}`}
          title={trend.increaseArrowLabelH}
        >
          {trend.dirH === "left" ? (
            <>
              <div className="vector-arrow-head">
                <ArrowLeft size={16} />
              </div>
              <div className="vector-line-track">
                <span className="vector-label">{trend.increaseArrowLabelH}</span>
              </div>
            </>
          ) : (
            <>
              <div className="vector-line-track">
                <span className="vector-label">{trend.increaseArrowLabelH}</span>
              </div>
              <div className="vector-arrow-head">
                <ArrowRight size={16} />
              </div>
            </>
          )}
        </div>
      )}

      {/* Left Vertical Vector Bar */}
      {trend.dirV !== "none" && (
        <div
          className={`trend-vector-bar vertical dir-${trend.dirV}`}
          title={trend.increaseArrowLabelV}
        >
          {trend.dirV === "up" ? (
            <>
              <div className="vector-arrow-head">
                <ArrowUp size={16} />
              </div>
              <div className="vector-line-track">
                <span className="vector-label vertical-text">{trend.increaseArrowLabelV}</span>
              </div>
            </>
          ) : (
            <>
              <div className="vector-line-track">
                <span className="vector-label vertical-text">{trend.increaseArrowLabelV}</span>
              </div>
              <div className="vector-arrow-head">
                <ArrowDown size={16} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function PeriodicTrendRationaleBanner({ activeTrendId, onClearTrend }) {
  if (!activeTrendId) return null;
  const trend = periodicTrendsData.find((t) => t.id === activeTrendId);
  if (!trend) return null;

  return (
    <div className="trend-rationale-card" role="region" aria-label={`Explicación de tendencia: ${trend.label}`}>
      <div className="trend-rationale-header">
        <div className="trend-title-group">
          <Compass size={18} className="trend-icon" />
          <span className="trend-badge">Tendencia Periódica</span>
          <h4>{trend.label}</h4>
          <span className="trend-unit-tag">Unidad: {trend.unit}</span>
        </div>

        <button
          type="button"
          className="trend-close-btn"
          onClick={onClearTrend}
          aria-label="Cerrar tendencia activa"
        >
          <X size={15} />
        </button>
      </div>

      <div className="trend-rationale-body">
        <div className="trend-directions-summary">
          {trend.dirH !== "none" && (
            <div className="dir-indicator-chip">
              <strong>En período (horizontal):</strong> {trend.increaseArrowLabelH}
            </div>
          )}
          {trend.dirV !== "none" && (
            <div className="dir-indicator-chip">
              <strong>En grupo (vertical):</strong> {trend.increaseArrowLabelV}
            </div>
          )}
        </div>

        <div className="trend-pedagogical-explanation">
          <Info size={16} className="explanation-icon" />
          <p>{trend.rationale}</p>
        </div>
      </div>
    </div>
  );
}
