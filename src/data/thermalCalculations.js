/**
 * thermalCalculations.js
 * Pure mathematical and physical calculation utilities for periodic thermal states and color interpolations.
 */

/**
 * Calculates physical aggregation state of an element at a given temperature in Kelvin
 * @param {Object} element - element object with melt and boil temperatures in Kelvin
 * @param {number} tempK - target temperature in Kelvin
 * @returns {"solid" | "liquid" | "gas" | "unknown"}
 */
export function getElementPhaseAtTemp(element, tempK) {
  if (!element) return "unknown";
  const melt = element.melt !== null && element.melt !== undefined ? Number(element.melt) : null;
  const boil = element.boil !== null && element.boil !== undefined ? Number(element.boil) : null;

  if (melt === null && boil === null) {
    return "unknown"; // Synthetic / unknown transuranic
  }

  // If we only have melting point
  if (boil === null && melt !== null) {
    return tempK < melt ? "solid" : "liquid";
  }

  // If we only have boiling point (e.g. noble gases or subliming elements)
  if (melt === null && boil !== null) {
    return tempK >= boil ? "gas" : "solid";
  }

  // Both melt and boil are known
  if (tempK < melt) {
    return "solid";
  } else if (tempK >= boil) {
    return "gas";
  } else {
    return "liquid";
  }
}

/**
 * Scientific multi-stop gradient color interpolator:
 * Low: Deep Indigo (#312e81) -> Cyan (#06b6d4) -> Emerald (#10b981) -> Amber (#f59e0b) -> Crimson (#ef4444)
 * @param {number|string|null} value
 * @param {number} min
 * @param {number} max
 * @returns {string|null} rgb(...) or null
 */
export function getHeatmapColor(value, min, max) {
  if (value === null || value === undefined || isNaN(value)) {
    return null;
  }

  const numVal = Number(value);
  if (isNaN(numVal)) return null;

  // Clamp normalized value between 0 and 1
  const t = Math.max(0, Math.min(1, (numVal - min) / (max - min || 1)));

  // Color stops: [t, [r, g, b]]
  const stops = [
    [0.0, [49, 46, 129]],    // Deep Indigo
    [0.25, [6, 182, 212]],   // Cyan
    [0.5, [16, 185, 129]],   // Emerald Green
    [0.75, [245, 158, 11]],  // Amber Orange
    [1.0, [239, 68, 68]]     // Bright Crimson
  ];

  let lower = stops[0];
  let upper = stops[stops.length - 1];

  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i][0] && t <= stops[i + 1][0]) {
      lower = stops[i];
      upper = stops[i + 1];
      break;
    }
  }

  const range = upper[0] - lower[0];
  const localT = range === 0 ? 0 : (t - lower[0]) / range;

  const r = Math.round(lower[1][0] + (upper[1][0] - lower[1][0]) * localT);
  const g = Math.round(lower[1][1] + (upper[1][1] - lower[1][1]) * localT);
  const b = Math.round(lower[1][2] + (upper[1][2] - lower[1][2]) * localT);

  return `rgb(${r}, ${g}, ${b})`;
}
