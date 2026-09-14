/**
 * Esquema unificado oficial de la Tabla Periódica (118 elementos IUPAC)
 * compatible con requerimientos de educación superior y preparación preuniversitaria.
 */
export interface PeriodicElement {
  /** Número atómico oficial (1 a 118) */
  number: number;
  /** Símbolo químico oficial (ej. "H", "Fe", "Og") */
  symbol: string;
  /** Nombre oficial en español (ej. "Hidrógeno", "Hierro") */
  name: string;
  /** Masa atómica estándar IUPAC (u) */
  atomic_mass: string;
  /** Arreglo de electrones por nivel cuántico principal [K, L, M, N, O, P, Q] */
  shells: number[];
  /** Configuración electrónica cuántica completa o semántica */
  electron_configuration: string;
  /** Estados de oxidación más comunes en nomenclatura */
  oxidation_states: string;
  /** Electronegatividad en la escala de Pauling */
  electronegativity: string;
  /** Categoría pedagógica ("basic", "variable", "loose", "full") */
  category: string;
  /** Resumen enciclopédico de aplicaciones e importancia */
  summary: string;
  /** Notas didácticas de examen, reglas de formulación y nomenclatura */
  study_notes: string;

  // Alias de compatibilidad retroactiva
  z: number;
  mass: string;
  config: string;
  ox: string;
  en: string;
  nomenclaturaNotes: string;

  // Propiedades espaciales y de clasificación periódica
  col: number;
  row: number;
  period: number;
  group: number;
  family: string;
  block: 's' | 'p' | 'd' | 'f';
  phase: 'sólido' | 'líquido' | 'gas' | 'sintético';
  radius: number;
  ionization: number;
  isPreUni: boolean;
}

export interface CategoryFilter {
  id: string;
  label: string;
  count: number;
}

export interface FamilyFilter {
  id: string;
  label: string;
  color?: string;
}

export interface BlockFilter {
  id: string;
  label: string;
  desc?: string;
}

export interface PhaseFilter {
  id: string;
  label: string;
}
