import React, { useMemo } from "react";
import { Thermometer, Snowflake, Flame, Droplets, Wind, RotateCcw, X } from "lucide-react";
import { getElementPhaseAtTemp } from "../data/thermalCalculations.js";

export { getElementPhaseAtTemp };


export function TemperatureSlider({
  temperatureK,
  onChangeTemperature,
  tempUnit,
  onToggleTempUnit,
  elements,
  onClose
}) {
  // Compute live breakdown counts across all 118 elements
  const stats = useMemo(() => {
    let solids = 0;
    let liquids = [];
    let gases = [];
    let unknowns = 0;

    for (const el of elements) {
      const phase = getElementPhaseAtTemp(el, temperatureK);
      if (phase === "solid") solids++;
      else if (phase === "liquid") liquids.push(el.symbol);
      else if (phase === "gas") gases.push(el.symbol);
      else unknowns++;
    }

    return {
      solidsCount: solids,
      liquids,
      gases,
      unknownsCount: unknowns
    };
  }, [elements, temperatureK]);

  // Conversions
  const displayVal = tempUnit === "C" ? (temperatureK - 273.15).toFixed(1) : Math.round(temperatureK);
  const displayAlt = tempUnit === "C" ? `${Math.round(temperatureK)} K` : `${(temperatureK - 273.15).toFixed(1)} °C`;

  // Quick Preset Points
  const presets = [
    { label: "Cero Absoluto", k: 0, icon: "❄️" },
    { label: "Congelación H₂O", k: 273.15, icon: "🧊" },
    { label: "Ambiente (20°C)", k: 293.15, icon: "🌡️" },
    { label: "Ebullición H₂O", k: 373.15, icon: "♨️" },
    { label: "Fusión Fe", k: 1811, icon: "🔥" },
    { label: "Fusión Wolframio", k: 3695, icon: "⚡" }
  ];

  return (
    <div className="temperature-slider-card" role="region" aria-label="Control de Temperatura y Estados">
      <div className="temp-card-header">
        <div className="temp-header-left">
          <div className="temp-icon-badge">
            <Thermometer size={18} />
          </div>
          <div>
            <h4 className="temp-title">Control Térmico y Estados de Agregación</h4>
            <span className="temp-subtitle">
              Simulación de fases físicas según puntos de fusión y ebullición
            </span>
          </div>
        </div>

        <div className="temp-header-actions">
          <button
            type="button"
            className="temp-unit-toggle"
            onClick={onToggleTempUnit}
            title={`Cambiar a ${tempUnit === "K" ? "grados Celsius (°C)" : "Kelvin (K)"}`}
          >
            Modo: <strong>{tempUnit === "K" ? "Kelvin (K)" : "Celsius (°C)"}</strong>
          </button>

          <button
            type="button"
            className="temp-close-action"
            onClick={onClose}
            aria-label="Cerrar control de temperatura"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Main Slider & Readout */}
      <div className="temp-slider-viewport">
        <div className="temp-readout-box">
          <span className="readout-primary">
            {displayVal} <span className="readout-unit">{tempUnit === "K" ? "K" : "°C"}</span>
          </span>
          <span className="readout-secondary">≈ {displayAlt}</span>
        </div>

        <div className="temp-slider-track-wrap">
          <input
            type="range"
            min="0"
            max="6000"
            step="1"
            value={temperatureK}
            onChange={(e) => onChangeTemperature(Number(e.target.value))}
            className="temp-range-input"
            aria-label="Selector de temperatura en Kelvin"
          />

          <div className="temp-slider-ticks" aria-hidden="true">
            <span>0 K</span>
            <span>1000 K</span>
            <span>2000 K</span>
            <span>3000 K</span>
            <span>4000 K</span>
            <span>5000 K</span>
            <span>6000 K</span>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="temp-presets-row" role="group" aria-label="Puntos térmicos notables">
        <span className="presets-label">Puntos notables:</span>
        <div className="presets-chips-wrap">
          {presets.map((preset) => {
            const isActive = Math.abs(temperatureK - preset.k) < 2;
            return (
              <button
                key={preset.label}
                type="button"
                className={`preset-chip ${isActive ? "active" : ""}`}
                onClick={() => onChangeTemperature(preset.k)}
              >
                <span>{preset.icon}</span>
                <span>{preset.label}</span>
                <small>({preset.k} K)</small>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Aggregation States Counter Bar */}
      <div className="temp-states-summary-bar">
        <div className="state-stat-pill solid">
          <Snowflake size={14} />
          <span>Sólidos: <strong>{stats.solidsCount}</strong></span>
        </div>

        <div className="state-stat-pill liquid">
          <Droplets size={14} />
          <span>
            Líquidos: <strong>{stats.liquids.length}</strong>
            {stats.liquids.length > 0 && stats.liquids.length <= 6 && (
              <small className="state-symbols">({stats.liquids.join(", ")})</small>
            )}
          </span>
        </div>

        <div className="state-stat-pill gas">
          <Wind size={14} />
          <span>
            Gases: <strong>{stats.gases.length}</strong>
            {stats.gases.length > 0 && stats.gases.length <= 8 && (
              <small className="state-symbols">({stats.gases.join(", ")})</small>
            )}
          </span>
        </div>

        {stats.unknownsCount > 0 && (
          <div className="state-stat-pill unknown">
            <RotateCcw size={14} />
            <span>Desconocidos / Sintéticos: <strong>{stats.unknownsCount}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}
