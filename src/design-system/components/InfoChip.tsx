import type { ReactNode } from "react";
import { Icon } from "./Icon";
import type { IconName } from "./Icon";
import "./InfoChip.css";

/* =============================================================================
   InfoChip — "informação vira objeto". Um dado captado da fala, encapsulado:
   ícone + rótulo + valor. O botão (i) abre a proveniência ("de onde veio isto?").
   ============================================================================= */

type Tone = "neutral" | "primary" | "positive" | "attention";

export interface InfoChipProps {
  icon: IconName | ReactNode;
  label: string;
  value: ReactNode;
  /** Tom do azulejo do ícone. */
  tone?: Tone;
  /** Mostra o botão de informação/proveniência. */
  onInfo?: () => void;
  /** Dado ainda chegando — aparência de "em formação". */
  forming?: boolean;
  className?: string;
}

export function InfoChip({
  icon,
  label,
  value,
  tone = "neutral",
  onInfo,
  forming = false,
  className = "",
}: InfoChipProps) {
  const classes = [
    "uf-chip",
    forming ? "uf-chip--forming" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <span className={`uf-chip__tile uf-chip__tile--${tone}`} aria-hidden="true">
        {typeof icon === "string" ? <Icon name={icon as IconName} size={18} /> : icon}
      </span>
      <span className="uf-chip__text">
        <span className="uf-chip__label">{label}</span>
        <span className="uf-chip__value">{value}</span>
      </span>
      {onInfo ? (
        <button
          type="button"
          className="uf-chip__info"
          onClick={onInfo}
          aria-label={`Sobre "${label}": de onde veio este dado`}
        >
          <Icon name="info" size={16} />
        </button>
      ) : null}
    </div>
  );
}

export default InfoChip;
