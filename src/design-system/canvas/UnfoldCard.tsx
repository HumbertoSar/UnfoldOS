import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import "./UnfoldCard.css";

/* =============================================================================
   UnfoldCard — um card posicionado na canvas. Nunca "aparece pronto":
   ele se desdobra (unfold) na entrada. Pode ser arrastado pelo consultor.
   ============================================================================= */

export interface UnfoldCardProps {
  x: number;
  y: number;
  width?: number;
  /** Escala atual da canvas — corrige o delta de arraste. */
  scale?: number;
  draggable?: boolean;
  onMove?: (x: number, y: number) => void;
  /** Atraso da animação de unfold, em ms (cria o efeito de cascata). */
  unfoldDelay?: number;
  zIndex?: number;
  children: ReactNode;
  className?: string;
  /** Altura real do conteúdo, medida ao vivo — pra quem organiza o layout (evita sobreposição). */
  onAltura?: (altura: number) => void;
  /** Avisa início/fim de um arraste manual — quem organiza o layout evita brigar com o usuário. */
  onArrastando?: (arrastando: boolean) => void;
}

export function UnfoldCard({
  x,
  y,
  width,
  scale = 1,
  draggable = false,
  onMove,
  unfoldDelay = 0,
  zIndex,
  children,
  className = "",
  onAltura,
  onArrastando,
}: UnfoldCardProps) {
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ startX: number; startY: number; originX: number; originY: number }>(
    { startX: 0, startY: 0, originX: 0, originY: 0 },
  );
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el || !onAltura) return;
    const medir = () => onAltura(el.offsetHeight);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggable || !onMove || e.button !== 0) return;
    e.stopPropagation();
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: x,
      originY: y,
    };
    setDragging(true);
    onArrastando?.(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging || !onMove) return;
    e.stopPropagation();
    const dx = (e.clientX - drag.current.startX) / scale;
    const dy = (e.clientY - drag.current.startY) / scale;
    onMove(drag.current.originX + dx, drag.current.originY + dy);
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    e.stopPropagation();
    setDragging(false);
    onArrastando?.(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* já liberado */
    }
  };

  return (
    <div
      ref={elRef}
      className={`uf-unfold${dragging ? " is-dragging" : ""}${
        draggable ? " is-draggable" : ""
      } ${className}`}
      data-canvas-draggable={draggable ? "" : undefined}
      style={{
        left: x,
        top: y,
        width: width ?? "var(--uf-card-width)",
        zIndex: dragging ? "var(--uf-z-card-active)" : zIndex,
        animationDelay: `${unfoldDelay}ms`,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {children}
    </div>
  );
}

export default UnfoldCard;
