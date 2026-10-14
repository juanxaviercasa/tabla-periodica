import { elements118 } from "../elementsData.js";
import { isotopesData } from "./isotopesData.js";

// Exceptions are supplied by the neutral atom's catalog configuration.
// Cations lose electrons from the highest n first, then the highest l.
const orbitalOrder = ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p", "6s", "4f", "5d", "6p", "7s", "5f", "6d", "7p", "8s"];
const capacities = { s: 2, p: 6, d: 10, f: 14 };

function parseConfiguration(configuration) {
  const orbitals = new Map();
  const core = configuration.match(/^\[([A-Za-z]+)\]/);
  if (core) {
    const noble = elements118.find(e => e.symbol === core[1]);
    if (noble) for (const [key, value] of parseConfiguration(noble.electron_configuration)) orbitals.set(key, value);
  }
  for (const match of configuration.matchAll(/(\d[spdf])(\d+)/g)) orbitals.set(match[1], Number(match[2]));
  return orbitals;
}

export function getShellDistribution(element, electrons) {
  if (!element || !Number.isInteger(electrons) || electrons < 0) return [];
  if (electrons === element.number) return [...element.shells];
  const orbitals = parseConfiguration(element.electron_configuration);
  const count = () => [...orbitals.values()].reduce((sum, value) => sum + value, 0);
  const removalOrder = [...orbitals.keys()].sort((a, b) => Number(b[0]) - Number(a[0]) || "spdf".indexOf(b[1]) - "spdf".indexOf(a[1]));
  for (const key of removalOrder) {
    const remove = Math.min(orbitals.get(key), Math.max(0, count() - electrons));
    orbitals.set(key, orbitals.get(key) - remove);
  }
  for (const key of orbitalOrder) {
    if (count() >= electrons) break;
    const occupied = orbitals.get(key) ?? 0;
    orbitals.set(key, occupied + Math.min(capacities[key[1]] - occupied, electrons - count()));
  }
  const shells = [];
  for (const [key, value] of orbitals) {
    const shell = Number(key[0]) - 1;
    shells[shell] = (shells[shell] ?? 0) + value;
  }
  while (shells.length && !shells.at(-1)) shells.pop();
  return Array.from(shells, value => value ?? 0);
}

// Small supplementary catalog for the builder's presets; remaining data comes
// from isotopesData. Missing records are explicitly unknown, never inferred.
// Sources: Jefferson Lab (NNDC), https://stem-tools.jlab.org/itselemental/
const builderNuclides = {
  "2-3": { stable: true }, "2-4": { stable: true },
  "6-11": { stable: false },
  "11-23": { stable: true },
  "19-39": { stable: true }, "19-40": { stable: false }, "19-41": { stable: true },
  "20-42": { stable: true }, "20-43": { stable: true }, "20-44": { stable: true },
};

export function getNuclearStability(protons, neutrons) {
  const ratio = protons > 0 ? neutrons / protons : 0;
  const mass = protons + neutrons;
  const element = elements118.find(e => e.number === protons);
  const isotope = isotopesData[element?.symbol]?.isotopes.find(i => i.a === mass);
  const record = isotope ? { stable: isotope.is_stable, decay: isotope.decay_mode } : builderNuclides[`${protons}-${mass}`];
  if (!record || typeof record.stable !== "boolean") return {
    stable: null, ratio,
    reason: "Este núclido no está incluido en el catálogo consultado. La relación N/Z por sí sola no determina su estabilidad ni su desintegración.",
  };
  return {
    stable: record.stable, ratio,
    reason: record.stable
      ? `${element.name}-${mass}: isótopo estable registrado.`
      : `${element.name}-${mass}: isótopo radiactivo registrado.${record.decay ? ` Desintegración: ${record.decay}.` : " Consulta una base nuclear para conocer su desintegración."}`,
    source: `https://stem-tools.jlab.org/itselemental/iso${String(protons).padStart(3, "0")}`,
  };
}

export function normalizeLabTab(tab) {
  if (["jump", "ionizations", "ionization"].includes(tab)) return "ionization";
  return tab === "isotopes" ? "isotopes" : "builder";
}
