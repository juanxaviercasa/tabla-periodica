const metalFamilies = new Set(["Alcalino", "Alcalinotérreo", "Transición", "Metal", "Lantánido", "Actínido"]);

export function getBondGuidance(a, b) {
  if (!a || !b) return null;
  const metalA = metalFamilies.has(a.family);
  const metalB = metalFamilies.has(b.family);
  if (a.family === "Gas noble" || b.family === "Gas noble") return { type: "Se necesita un compuesto concreto", desc: "Los gases nobles no permiten inferir un enlace habitual solo por comparar electronegatividades.", badgeClass: "bond-apolar" };
  if (metalA && metalB) return { type: "Enlace metálico en una aleación", desc: "Entre metales predomina el modelo de electrones deslocalizados; una pequeña ΔEN no significa enlace covalente apolar.", badgeClass: "bond-metallic" };
  const values = [a.en, b.en].map(value => value === "—" || value === null || value === undefined ? NaN : Number(value));
  if (!values.every(Number.isFinite)) return null;
  const difference = Math.abs(values[0] - values[1]);
  const note = " Es una orientación: confirma la estructura del compuesto; ΔEN no fija una frontera exacta entre tipos de enlace.";
  if ((metalA || metalB) && difference >= 1.7) return { type: "Mayor carácter iónico probable", desc: "Para este par metal/no metal, la diferencia de electronegatividad favorece el carácter iónico." + note, badgeClass: "bond-ionic" };
  return difference > 0.4
    ? { type: "Enlace covalente polar probable", desc: "La diferencia de electronegatividad favorece una distribución desigual de electrones compartidos." + note, badgeClass: "bond-polar" }
    : { type: "Enlace covalente poco polar probable", desc: "La diferencia de electronegatividad es pequeña." + note, badgeClass: "bond-apolar" };
}
