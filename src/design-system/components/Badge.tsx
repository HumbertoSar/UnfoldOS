import type { HTMLAttributes, ReactNode } from "react";
import "./Badge.css";

/* =============================================================================
   Badge / Tag / ConfidenceDots
   Status comunicados por tom suave — nunca por vermelho de alarme.
   ============================================================================= */

type Tone = "neutral" | "primary" | "positive" | "attention" | "forming";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  /** Mostra um ponto à esquerda (indicador de status). */
  dot?: boolean;
  /** Variante de baixa ênfase: só texto + ponto, sem fundo. */
  soft?: boolean;
  leadingIcon?: ReactNode;
  children: ReactNode;
}

export function Badge({
  tone = "neutral",
  dot = false,
  soft = false,
  leadingIcon,
  className = "",
  children,
  ...rest
}: BadgeProps) {
  const classes = [
    "uf-badge",
    `uf-badge--${tone}`,
    soft ? "uf-badge--soft" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={classes} {...rest}>
      {dot ? <span className="uf-badge__dot" /> : null}
      {leadingIcon ? (
        <span className="uf-badge__icon">{leadingIcon}</span>
      ) : null}
      {children}
    </span>
  );
}

/* --- ConfidenceDots — o "Confiança: Alta ● ● ● ●" do pôster ---------------- */

export interface ConfidenceDotsProps {
  /** Nível preenchido (0–total). */
  level: number;
  total?: number;
  label?: string;
  size?: number;
}

export function ConfidenceDots({
  level,
  total = 4,
  label,
  size = 8,
}: ConfidenceDotsProps) {
  const safe = Math.max(0, Math.min(total, Math.round(level)));
  return (
    <span
      className="uf-confidence-dots"
      role="img"
      aria-label={label ?? `Confiança ${safe} de ${total}`}
    >
      {label ? <span className="uf-confidence-dots__label">{label}</span> : null}
      <span className="uf-confidence-dots__track" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`uf-confidence-dots__dot${
              i < safe ? " is-on" : ""
            }`}
            style={{ width: size, height: size }}
          />
        ))}
      </span>
    </span>
  );
}

export default Badge;
