import "./ScoreBar.css";

/* =============================================================================
   ScoreBar — uma dimensão do diagnóstico (Organização, Liquidez, ...).
   Trilho contínuo com um marcador; o número à direita. Calmo, sem semáforo.
   ============================================================================= */

type Tone = "auto" | "positive" | "attention" | "forming" | "neutral";

export interface ScoreBarProps {
  label: string;
  /** Valor na escala (0–max). */
  value: number;
  max?: number;
  tone?: Tone;
  /** Esconde o número à direita. */
  hideValue?: boolean;
  className?: string;
}

function resolveTone(tone: Tone, ratio: number): Exclude<Tone, "auto"> {
  if (tone !== "auto") return tone;
  if (ratio >= 0.75) return "positive";
  if (ratio >= 0.5) return "neutral";
  return "attention";
}

export function ScoreBar({
  label,
  value,
  max = 10,
  tone = "auto",
  hideValue = false,
  className = "",
}: ScoreBarProps) {
  const ratio = Math.max(0, Math.min(1, value / max));
  const resolved = resolveTone(tone, ratio);
  const pct = `${ratio * 100}%`;

  return (
    <div className={`uf-score uf-score--${resolved} ${className}`}>
      <span className="uf-score__label">{label}</span>
      <span
        className="uf-score__track"
        role="meter"
        aria-valuenow={Math.round(value * 10) / 10}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <span className="uf-score__fill" style={{ width: pct }} />
        <span className="uf-score__thumb" style={{ left: pct }} />
      </span>
      {!hideValue ? (
        <span className="uf-score__value">
          {value.toFixed(1)}
          <span className="uf-score__max">/{max}</span>
        </span>
      ) : null}
    </div>
  );
}

export default ScoreBar;
