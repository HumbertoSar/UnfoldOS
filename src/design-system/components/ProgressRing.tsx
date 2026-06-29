import type { ReactNode } from "react";
import "./ProgressRing.css";

/* =============================================================================
   ProgressRing — diagnóstico em formação. Um anel que se completa conforme a
   conversa avança. Nunca "fecha" de forma dura; o gap restante é a incompletude.
   ============================================================================= */

type Tone = "primary" | "positive" | "attention" | "forming";

export interface ProgressRingProps {
  /** 0–100. */
  value: number;
  size?: number;
  thickness?: number;
  tone?: Tone;
  /** Conteúdo central (ex.: "78%"). */
  children?: ReactNode;
  label?: string;
  className?: string;
}

const toneVar: Record<Tone, string> = {
  primary: "var(--uf-color-primary)",
  positive: "var(--uf-color-positive)",
  attention: "var(--uf-color-attention)",
  forming: "var(--uf-color-forming)",
};

export function ProgressRing({
  value,
  size = 72,
  thickness = 6,
  tone = "positive",
  children,
  label,
  className = "",
}: ProgressRingProps) {
  const v = Math.max(0, Math.min(100, value));
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const dash = (v / 100) * c;

  return (
    <span
      className={`uf-ring ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ?? `${Math.round(v)} por cento`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="uf-ring__track"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={thickness}
        />
        <circle
          className="uf-ring__value"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={thickness}
          stroke={toneVar[tone]}
          strokeDasharray={`${dash} ${c - dash}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {children ? <span className="uf-ring__center">{children}</span> : null}
    </span>
  );
}

export default ProgressRing;
