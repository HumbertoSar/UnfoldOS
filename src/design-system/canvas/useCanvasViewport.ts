import { useCallback, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from "react";

/* =============================================================================
   useCanvasViewport — pan + zoom para a canvas infinita.
   - Arrastar o fundo → pan.
   - ⌘/Ctrl + scroll → zoom em direção ao cursor.
   - Botões (ZoomControls) → zoomIn / zoomOut / reset.
   Nada de scroll sequestrado: scroll simples passa direto para a página.
   ============================================================================= */

export interface Viewport {
  x: number;
  y: number;
  scale: number;
}

const MIN_SCALE = 0.4;
const MAX_SCALE = 2.4;
const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

export interface UseCanvasViewport {
  viewport: Viewport;
  containerRef: React.RefObject<HTMLDivElement>;
  isPanning: boolean;
  bind: {
    onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
    onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => void;
    onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => void;
    onWheel: (e: ReactWheelEvent<HTMLDivElement>) => void;
  };
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
  setViewport: React.Dispatch<React.SetStateAction<Viewport>>;
}

export function useCanvasViewport(
  initial: Partial<Viewport> = {},
): UseCanvasViewport {
  const [viewport, setViewport] = useState<Viewport>({
    x: initial.x ?? 0,
    y: initial.y ?? 0,
    scale: initial.scale ?? 1,
  });
  const [isPanning, setIsPanning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pan = useRef<{ active: boolean; startX: number; startY: number; originX: number; originY: number }>(
    { active: false, startX: 0, startY: 0, originX: 0, originY: 0 },
  );

  const zoomAt = useCallback(
    (factor: number, cx?: number, cy?: number) => {
      setViewport((vp) => {
        const next = clampScale(vp.scale * factor);
        const rect = containerRef.current?.getBoundingClientRect();
        const px = cx ?? (rect ? rect.width / 2 : 0);
        const py = cy ?? (rect ? rect.height / 2 : 0);
        const ratio = next / vp.scale;
        return {
          scale: next,
          x: px - (px - vp.x) * ratio,
          y: py - (py - vp.y) * ratio,
        };
      });
    },
    [],
  );

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    // só inicia pan se o alvo for o fundo da canvas (não um card arrastável)
    const target = e.target as HTMLElement;
    if (target.closest("[data-canvas-draggable]")) return;
    if (e.button !== 0) return;
    pan.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: viewport.x,
      originY: viewport.y,
    };
    setIsPanning(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [viewport.x, viewport.y]);

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!pan.current.active) return;
    const dx = e.clientX - pan.current.startX;
    const dy = e.clientY - pan.current.startY;
    setViewport((vp) => ({
      ...vp,
      x: pan.current.originX + dx,
      y: pan.current.originY + dy,
    }));
  }, []);

  const onPointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!pan.current.active) return;
    pan.current.active = false;
    setIsPanning(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ponteiro já liberado */
    }
  }, []);

  const onWheel = useCallback(
    (e: ReactWheelEvent<HTMLDivElement>) => {
      if (!(e.ctrlKey || e.metaKey)) return; // scroll simples → página
      e.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      const cx = rect ? e.clientX - rect.left : undefined;
      const cy = rect ? e.clientY - rect.top : undefined;
      const factor = e.deltaY < 0 ? 1.08 : 0.92;
      zoomAt(factor, cx, cy);
    },
    [zoomAt],
  );

  return {
    viewport,
    containerRef,
    isPanning,
    bind: { onPointerDown, onPointerMove, onPointerUp, onWheel },
    zoomIn: () => zoomAt(1.15),
    zoomOut: () => zoomAt(1 / 1.15),
    reset: () => setViewport({ x: 0, y: 0, scale: 1 }),
    setViewport,
  };
}

export default useCanvasViewport;
