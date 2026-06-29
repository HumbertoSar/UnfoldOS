import { Icon } from "./Icon";
import "./ZoomControls.css";

/* =============================================================================
   ZoomControls — "Pan + Zoom". Explore o todo ou o detalhe sem perder contexto.
   ============================================================================= */

export interface ZoomControlsProps {
  /** Percentual de zoom atual (ex.: 100). */
  zoom?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
  /** Mostra o botão de recentralizar. */
  showReset?: boolean;
  className?: string;
}

export function ZoomControls({
  zoom = 100,
  onZoomIn,
  onZoomOut,
  onReset,
  showReset = true,
  className = "",
}: ZoomControlsProps) {
  return (
    <div className={`uf-zoom ${className}`} role="group" aria-label="Controles de zoom">
      <div className="uf-zoom__stack">
        <button
          type="button"
          className="uf-zoom__btn"
          onClick={onZoomIn}
          aria-label="Aproximar"
        >
          <Icon name="plus" size={18} />
        </button>
        <span className="uf-zoom__value" aria-live="polite">
          {Math.round(zoom)}%
        </span>
        <button
          type="button"
          className="uf-zoom__btn"
          onClick={onZoomOut}
          aria-label="Afastar"
        >
          <Icon name="minus" size={18} />
        </button>
      </div>
      {showReset ? (
        <button
          type="button"
          className="uf-zoom__btn uf-zoom__reset"
          onClick={onReset}
          aria-label="Recentralizar a canvas"
        >
          <Icon name="recenter" size={18} />
        </button>
      ) : null}
    </div>
  );
}

export default ZoomControls;
