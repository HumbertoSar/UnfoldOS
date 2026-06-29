import type { CSSProperties, ReactNode } from "react";
import type { Viewport } from "./useCanvasViewport";
import "./InfiniteCanvas.css";

/* =============================================================================
   InfiniteCanvas — o espaço mental. Um fundo de pontos que se desloca com o
   pan/zoom e uma camada de conteúdo em coordenadas próprias da canvas.
   Os filhos se posicionam em absoluto (left/top) no espaço da canvas.
   ============================================================================= */

export interface InfiniteCanvasProps {
  viewport: Viewport;
  containerRef: React.RefObject<HTMLDivElement>;
  bind: {
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
    onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
    onWheel: (e: React.WheelEvent<HTMLDivElement>) => void;
  };
  isPanning?: boolean;
  children?: ReactNode;
  /** Conteúdo fixo na viewport (controles, medidor) — não sofre pan/zoom. */
  overlay?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function InfiniteCanvas({
  viewport,
  containerRef,
  bind,
  isPanning = false,
  children,
  overlay,
  className = "",
  style,
}: InfiniteCanvasProps) {
  const gridSize = `calc(var(--uf-canvas-grid-size) * ${viewport.scale})`;

  return (
    <div
      ref={containerRef}
      className={`uf-canvas${isPanning ? " is-panning" : ""} ${className}`}
      style={style}
      {...bind}
    >
      <div
        className="uf-canvas__grid"
        style={{
          backgroundSize: `${gridSize} ${gridSize}`,
          backgroundPosition: `${viewport.x}px ${viewport.y}px`,
        }}
        aria-hidden="true"
      />
      <div
        className="uf-canvas__content"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
        }}
      >
        {children}
      </div>
      {overlay ? <div className="uf-canvas__overlay">{overlay}</div> : null}
    </div>
  );
}

export default InfiniteCanvas;
