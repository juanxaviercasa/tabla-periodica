import React from "react";
import { periodicTrendsData } from "../data/groupPeriodData.js";
import { Activity, X, HelpCircle } from "lucide-react";
import { getHeatmapColor } from "../data/thermalCalculations.js";

export { getHeatmapColor };


/**
 * HeatmapLegend:
 * Renders the color scale bar with min, median, max values and property units.
 */
export function HeatmapLegend({
  activePropertyId,
  onChangeProperty,
  onClearHeatmap
}) {
  if (!activePropertyId) return null;

  const currentTrend = periodicTrendsData.find((t) => t.id === activePropertyId);
  if (!currentTrend) return null;

  const median = ((currentTrend.min + currentTrend.max) / 2).toFixed(
    currentTrend.unit === "Pauling" || currentTrend.unit === "g/cm³" ? 2 : 0
  );

  return (
    <div className="heatmap-legend-container" role="region" aria-label="Escala del Mapa de Calor">
      <div className="heatmap-legend-top">
        <div className="heatmap-property-info">
          <Activity size={16} className="heatmap-pulse-icon" />
          <span className="heatmap-badge">Mapa de Calor Activo</span>
          <strong className="heatmap-prop-title">{currentTrend.label}</strong>
          <span className="heatmap-unit">({currentTrend.unit})</span>
        </div>

        <button
          type="button"
          className="heatmap-close-action"
          onClick={onClearHeatmap}
          title="Desactivar mapa de calor"
          aria-label="Desactivar mapa de calor"
        >
          <X size={15} /> <span>Desactivar</span>
        </button>
      </div>

      <div className="heatmap-scale-wrapper">
        <div className="heatmap-scale-labels">
          <span className="scale-tick tick-min">
            Mín: <strong>{currentTrend.min} {currentTrend.unit}</strong>
          </span>
          <span className="scale-tick tick-mid">
            Media: <strong>{median} {currentTrend.unit}</strong>
          </span>
          <span className="scale-tick tick-max">
            Máx: <strong>{currentTrend.max} {currentTrend.unit}</strong>
          </span>
        </div>

        <div className="heatmap-gradient-bar" aria-hidden="true">
          <div className="gradient-track"></div>
        </div>
      </div>

      <div className="heatmap-aux-legend">
        <div className="aux-legend-item">
          <span className="missing-data-swatch"></span>
          <small>Sin dato aplicable / Sintético (S/D)</small>
        </div>
        <small className="aux-legend-tip">{currentTrend.shortDesc}</small>
      </div>
    </div>
  );
}
