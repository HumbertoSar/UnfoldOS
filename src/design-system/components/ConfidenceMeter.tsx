import { Icon } from "./Icon";
import "./ConfidenceMeter.css";

/* =============================================================================
   ConfidenceMeter — "Confiança da IA". O quanto o sistema entende até agora.
   Cresce com a conversa; o rótulo "Em evolução" lembra que nada se fecha cedo.
   ============================================================================= */

export interface ConfidenceMeterProps {
  /** 0–100. */
  value: number;
  label?: string;
  caption?: string;
  segments?: number;
  onInfo?: () => void;
  className?: string;
}

export function ConfidenceMeter({
  value,
  label = "Confiança da IA",
  caption = "Em evolução",
  segments = 5,
  onInfo,
  className = "",
}: ConfidenceMeterProps) {
  const v = Math.max(0, Math.min(100, value));
  const filled = (v / 100) * segments;

  return (
    <div className={`uf-confidence ${className}`}>
      <div className="uf-confidence__head">
        <span className="uf-confidence__label uf-caption">{label}</span>
        {onInfo ? (
          <button
            type="button"
            className="uf-confidence__info"
            onClick={onInfo}
            aria-label={`Sobre ${label}`}
          >
            <Icon name="info" size={14} />
          </button>
        ) : null}
      </div>

      <div className="uf-confidence__value">{Math.round(v)}%</div>

      <div
        className="uf-confidence__track"
        role="progressbar"
        aria-valuenow={Math.round(v)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        {Array.from({ length: segments }).map((_, i) => {
          const fill = Math.max(0, Math.min(1, filled - i));
          return (
            <span key={i} className="uf-confidence__seg">
              <span
                className="uf-confidence__seg-fill"
                style={{ transform: `scaleX(${fill})` }}
              />
            </span>
          );
        })}
      </div>

      {caption ? (
        <div className="uf-confidence__caption uf-caption">{caption}</div>
      ) : null}
    </div>
  );
}

export default ConfidenceMeter;
