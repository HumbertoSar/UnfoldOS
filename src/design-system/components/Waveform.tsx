import "./Waveform.css";

/* =============================================================================
   Waveform — a fala virando objeto. A conversa flui; a IA escuta em tempo real.
   Decorativo por padrão; passe `label` para anunciar o estado a leitores de tela.
   ============================================================================= */

export interface WaveformProps {
  /** Animando (escutando) ou em repouso. */
  active?: boolean;
  bars?: number;
  /** Altura máxima das barras, em px. */
  height?: number;
  /** Cor do traço (CSS). Padrão: currentColor. */
  color?: string;
  label?: string;
  className?: string;
}

// Alturas-base por barra para um perfil orgânico (fração de `height`).
const profile = [0.35, 0.6, 0.85, 1, 0.7, 0.45, 0.65, 0.9, 0.55, 0.4, 0.75, 0.5];

export function Waveform({
  active = true,
  bars = 9,
  height = 28,
  color = "currentColor",
  label,
  className = "",
}: WaveformProps) {
  const count = Math.max(3, bars);
  return (
    <span
      className={`uf-waveform${active ? " is-active" : ""} ${className}`}
      style={{ height, color }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {Array.from({ length: count }).map((_, i) => {
        const base = profile[i % profile.length];
        return (
          <span
            key={i}
            className="uf-waveform__bar"
            style={{
              height: `${Math.round(base * height)}px`,
              animationDelay: `${(i % count) * 90}ms`,
            }}
          />
        );
      })}
    </span>
  );
}

export default Waveform;
