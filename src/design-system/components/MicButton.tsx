import type { ButtonHTMLAttributes } from "react";
import { Icon } from "./Icon";
import { Waveform } from "./Waveform";
import "./MicButton.css";

/* =============================================================================
   MicButton — o gesto que inicia tudo. Captação da fala em tempo real.
   `listening` troca o microfone por uma waveform e ativa os anéis de respiro.
   ============================================================================= */

type Size = "md" | "lg";

export interface MicButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  listening?: boolean;
  size?: Size;
  /** Rótulo acessível. Padrão muda conforme o estado. */
  label?: string;
}

export function MicButton({
  listening = false,
  size = "lg",
  label,
  className = "",
  ...rest
}: MicButtonProps) {
  const a11yLabel =
    label ?? (listening ? "Ouvindo. Toque para pausar" : "Toque para falar");
  const classes = [
    "uf-mic",
    `uf-mic--${size}`,
    listening ? "is-listening" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      aria-pressed={listening}
      aria-label={a11yLabel}
      {...rest}
    >
      <span className="uf-mic__ring" aria-hidden="true" />
      <span className="uf-mic__ring uf-mic__ring--2" aria-hidden="true" />
      <span className="uf-mic__core">
        {listening ? (
          <Waveform active height={size === "lg" ? 26 : 20} bars={5} />
        ) : (
          <Icon name="mic" size={size === "lg" ? 28 : 22} strokeWidth={1.6} />
        )}
      </span>
    </button>
  );
}

export default MicButton;
