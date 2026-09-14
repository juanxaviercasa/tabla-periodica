import React from "react";
import { groupsData, periodsData } from "../data/groupPeriodData.js";
import { X, Layers, Atom, Sparkles } from "lucide-react";

/**
 * GroupPeriodInspector:
 * 1. Interactive 18 group column headers (IUPAC & CAS).
 * 2. Interactive 7 period row headers (n=1..7, K-Q).
 * 3. Inspection banner displaying terminal configuration, family name, common ox states.
 */
export function GroupHeaders({
  activeGroup,
  onHoverGroup,
  onClickGroup,
  onClearGroup
}) {
  return (
    <div className="periodic-group-headers-row" role="row" aria-label="Grupos de la tabla periódica">
      {/* Spacer for the period column */}
      <div className="group-header-corner-spacer" title="Grupos y Familias">
        <span className="corner-label-top">Gr</span>
        <span className="corner-divider">/</span>
        <span className="corner-label-bottom">Per</span>
      </div>

      <div className="periodic-group-headers-grid">
        {groupsData.map((grp) => {
          const isSelected = activeGroup === grp.number;
          return (
            <button
              key={grp.number}
              type="button"
              className={`group-col-header ${isSelected ? "is-active" : ""}`}
              onMouseEnter={() => onHoverGroup && onHoverGroup(grp.number)}
              onMouseLeave={() => onHoverGroup && onHoverGroup(null)}
              onClick={() => onClickGroup && onClickGroup(grp.number)}
              title={`Grupo ${grp.iupac} (${grp.cas}) · ${grp.name}\nTerminación: ${grp.valenceTerminal}`}
              aria-label={`Grupo ${grp.iupac}, ${grp.cas}, ${grp.name}`}
              style={{ gridColumn: grp.number }}
            >
              <span className="group-iupac">{grp.iupac}</span>
              <span className="group-cas">{grp.cas}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PeriodHeaders({
  activePeriod,
  onHoverPeriod,
  onClickPeriod
}) {
  return (
    <div className="periodic-period-headers-col" role="columnheader" aria-label="Períodos de la tabla periódica">
      {periodsData.map((p) => {
        const isSelected = activePeriod === p.number;
        return (
          <button
            key={p.number}
            type="button"
            className={`period-row-header ${isSelected ? "is-active" : ""}`}
            onMouseEnter={() => onHoverPeriod && onHoverPeriod(p.number)}
            onMouseLeave={() => onHoverPeriod && onHoverPeriod(null)}
            onClick={() => onClickPeriod && onClickPeriod(p.number)}
            title={`Período ${p.number} (Nivel n=${p.n}, Capa ${p.shellLetter}) · ${p.elementCount} elementos\nSubcapas: ${p.subshells}`}
            aria-label={`Período ${p.number}, nivel ${p.n}`}
            style={{ gridRow: p.number }}
          >
            <span className="period-number">{p.number}</span>
            <span className="period-shell">{p.shellLetter}</span>
          </button>
        );
      })}
    </div>
  );
}

export function GroupPeriodBanner({
  focusedGroup,
  focusedPeriod,
  activeBlock,
  onClear
}) {
  if (!focusedGroup && !focusedPeriod && !activeBlock) return null;

  const grp = focusedGroup ? groupsData.find((g) => g.number === focusedGroup) : null;
  const per = focusedPeriod ? periodsData.find((p) => p.number === focusedPeriod) : null;

  return (
    <div className="group-period-inspector-banner" role="status" aria-live="polite">
      <div className="inspector-badge-icon">
        <Atom size={20} className="pulse-icon" />
      </div>

      <div className="inspector-info-content">
        {grp && (
          <>
            <div className="inspector-title-row">
              <span className="inspector-pill">
                Grupo {grp.iupac} (CAS: {grp.cas})
              </span>
              <h3 className="inspector-name">{grp.name}</h3>
              <span className="inspector-subshell-tag">Bloque {grp.subshell.toUpperCase()}</span>
            </div>

            <div className="inspector-stats-row">
              <div className="inspector-stat">
                <span className="stat-lbl">Config. Terminal:</span>
                <strong className="stat-val stat-val-config">{grp.valenceTerminal}</strong>
              </div>
              <div className="inspector-stat">
                <span className="stat-lbl">e⁻ de Valencia:</span>
                <strong className="stat-val">{grp.valenceElectrons}</strong>
              </div>
              <div className="inspector-stat">
                <span className="stat-lbl">Estados de Oxidación:</span>
                <strong className="stat-val">{grp.commonOx}</strong>
              </div>
            </div>

            <p className="inspector-desc">{grp.description}</p>
          </>
        )}

        {per && (
          <>
            <div className="inspector-title-row">
              <span className="inspector-pill">
                Período {per.number} (n = {per.n})
              </span>
              <h3 className="inspector-name">Capa Cuántica {per.shellLetter}</h3>
              <span className="inspector-subshell-tag">{per.elementCount} Elementos</span>
            </div>

            <div className="inspector-stats-row">
              <div className="inspector-stat">
                <span className="stat-lbl">Llenado de Subcapas:</span>
                <strong className="stat-val stat-val-config">{per.subshells}</strong>
              </div>
              <div className="inspector-stat">
                <span className="stat-lbl">Rango de Elementos:</span>
                <strong className="stat-val">{per.elementsRange}</strong>
              </div>
            </div>

            <p className="inspector-desc">{per.description}</p>
          </>
        )}

        {activeBlock && !grp && !per && (
          <div className="inspector-title-row">
            <span className="inspector-pill">Bloque Cuántico</span>
            <h3 className="inspector-name">Orbital Diferenciador: Bloque {activeBlock.toUpperCase()}</h3>
          </div>
        )}
      </div>

      <button
        type="button"
        className="inspector-close-btn"
        onClick={onClear}
        title="Cerrar inspección de grupo/período"
        aria-label="Cerrar inspección"
      >
        <X size={16} />
      </button>
    </div>
  );
}
