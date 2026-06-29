import "./Minimap.css";

/* =============================================================================
   Minimap — orientação no espaço mental. Mostra onde os clusters estão e que
   fração da canvas você vê agora. Coordenadas normalizadas (0–1).
   ============================================================================= */

export interface MinimapNode {
  x: number;
  y: number;
  w: number;
  h: number;
  tone?: "primary" | "positive" | "attention" | "neutral";
}

export interface MinimapProps {
  nodes: MinimapNode[];
  /** Retângulo do viewport atual (0–1). */
  viewport?: { x: number; y: number; w: number; h: number };
  width?: number;
  height?: number;
  className?: string;
}

const toneFill: Record<NonNullable<MinimapNode["tone"]>, string> = {
  primary: "var(--uf-indigo-200)",
  positive: "var(--uf-sage-200)",
  attention: "var(--uf-amber-200)",
  neutral: "var(--uf-neutral-300)",
};

export function Minimap({
  nodes,
  viewport,
  width = 132,
  height = 92,
  className = "",
}: MinimapProps) {
  return (
    <div
      className={`uf-minimap ${className}`}
      style={{ width, height }}
      role="img"
      aria-label="Minimapa da canvas"
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 70"
        preserveAspectRatio="none"
      >
        {nodes.map((n, i) => (
          <rect
            key={i}
            x={n.x * 100}
            y={n.y * 70}
            width={n.w * 100}
            height={n.h * 70}
            rx={2}
            fill={toneFill[n.tone ?? "neutral"]}
          />
        ))}
        {viewport ? (
          <rect
            className="uf-minimap__viewport"
            x={viewport.x * 100}
            y={viewport.y * 70}
            width={viewport.w * 100}
            height={viewport.h * 70}
            rx={2.5}
          />
        ) : null}
      </svg>
    </div>
  );
}

export default Minimap;
