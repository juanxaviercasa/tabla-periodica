export function getCatalogSources(element) {
  const z = element.number;
  const uncertain = z >= 104;
  const rsc = `https://periodic-table.rsc.org/element/${z}/`;
  return [
    { property: "Identidad, grupo y configuración", url: rsc, source: "Royal Society of Chemistry", note: uncertain ? "Configuraciones de elementos superpesados pueden ser predicciones." : "Configuración del átomo neutro en estado fundamental." },
    { property: "Masa atómica", url: "https://ciaaw.org/atomic-weights.htm", source: "CIAAW / IUPAC", note: z === 43 || z === 61 || (z >= 84 && ![90, 91, 92].includes(z)) ? "Sin peso atómico estándar: el número del catálogo corresponde a un isótopo seleccionado, no a un promedio natural." : "Valor escolar redondeado; el estándar puede ser un intervalo según la composición isotópica." },
    { property: "Energías de ionización", url: "https://physics.nist.gov/PhysRefData/ASD/ionEnergy.html", source: "NIST Atomic Spectra Database", note: uncertain ? "Valores del catálogo orientativos: no asumir que todas las ionizaciones fueron medidas." : "Átomos e iones gaseosos; kJ/mol. Consultar incertidumbre y nivel de ionización en la fuente." },
    { property: "Radio, electronegatividad y propiedades físicas", url: rsc, source: "Royal Society of Chemistry", note: "El radio depende de su definición; densidad y fases dependen de temperatura, presión y alótropo. El catálogo heredado no conserva las condiciones de cada valor: úsalo como referencia didáctica." },
    { property: "Isótopos", url: `https://stem-tools.jlab.org/itselemental/iso${String(z).padStart(3, "0")}`, source: "Jefferson Lab / NNDC", note: "El laboratorio utiliza un catálogo parcial y muestra explícitamente los núclidos sin registro." },
  ];
}
