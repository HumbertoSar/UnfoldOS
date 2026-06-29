import { useEffect, useRef, useState } from "react";
import { InfiniteCanvas } from "../../canvas/InfiniteCanvas";
import { UnfoldCard } from "../../canvas/UnfoldCard";
import { useCanvasViewport } from "../../canvas/useCanvasViewport";
import { Card, CardEyebrow } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { InfoChip } from "../../components/InfoChip";
import { PersonCard } from "../../components/PersonCard";
import { DiagnosisCard } from "../../components/DiagnosisCard";
import { ClusterNode } from "../../components/ClusterNode";
import { AddNode } from "../../components/AddNode";
import { ConfidenceMeter } from "../../components/ConfidenceMeter";
import { ZoomControls } from "../../components/ZoomControls";
import { Minimap } from "../../components/Minimap";
import type { MinimapNode } from "../../components/Minimap";

const WORLD = { w: 1180, h: 760 };
const INITIAL_VIEW = { x: 30, y: 20, scale: 0.86 };

interface NodePos {
  id: string;
  x: number;
  y: number;
  w: number;
  delay: number;
  tone: MinimapNode["tone"];
}

const initialNodes: NodePos[] = [
  { id: "person", x: 40, y: 240, w: 240, delay: 0, tone: "primary" },
  { id: "renda", x: 340, y: 70, w: 260, delay: 120, tone: "positive" },
  { id: "metas", x: 340, y: 350, w: 260, delay: 240, tone: "primary" },
  { id: "diag", x: 700, y: 180, w: 320, delay: 360, tone: "positive" },
  { id: "cluster", x: 60, y: 640, w: 220, delay: 480, tone: "attention" },
  { id: "add", x: 760, y: 560, w: 160, delay: 600, tone: "neutral" },
];

export function CanvasDemoSection() {
  const vp = useCanvasViewport(INITIAL_VIEW);
  const [nodes, setNodes] = useState<NodePos[]>(initialNodes);
  const [size, setSize] = useState({ w: 1000, h: 560 });
  const sizeRef = useRef<HTMLDivElement>(null);

  // mede o container para projetar o viewport no minimapa
  useEffect(() => {
    const el = sizeRef.current;
    if (!el) return;
    const update = () =>
      setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const move = (id: string, x: number, y: number) =>
    setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, x, y } : n)));

  const node = (id: string) => nodes.find((n) => n.id === id)!;

  // viewport projetado em coordenadas normalizadas do "mundo"
  const view = {
    x: -vp.viewport.x / vp.viewport.scale / WORLD.w,
    y: -vp.viewport.y / vp.viewport.scale / WORLD.h,
    w: size.w / vp.viewport.scale / WORLD.w,
    h: size.h / vp.viewport.scale / WORLD.h,
  };

  const miniNodes: MinimapNode[] = nodes.map((n) => ({
    x: n.x / WORLD.w,
    y: n.y / WORLD.h,
    w: n.w / WORLD.w,
    h: 0.16,
    tone: n.tone,
  }));

  return (
    <div className="uf-demo" ref={sizeRef}>
      <InfiniteCanvas
        className="uf-demo__canvas"
        viewport={vp.viewport}
        containerRef={vp.containerRef}
        bind={vp.bind}
        isPanning={vp.isPanning}
      >
        <UnfoldCard
          x={node("person").x}
          y={node("person").y}
          width={node("person").w}
          scale={vp.viewport.scale}
          draggable
          onMove={(x, y) => move("person", x, y)}
          unfoldDelay={node("person").delay}
        >
          <PersonCard
            name="Mariana"
            relation="Você"
            role="Planejadora"
            confidence={{ label: "Alta", level: 4, total: 4 }}
          />
        </UnfoldCard>

        <UnfoldCard
          x={node("renda").x}
          y={node("renda").y}
          width={node("renda").w}
          scale={vp.viewport.scale}
          draggable
          onMove={(x, y) => move("renda", x, y)}
          unfoldDelay={node("renda").delay}
        >
          <Card elevation={2} padding="md" accent="positive">
            <CardEyebrow icon={<Icon name="coins" size={14} />}>
              Finanças hoje
            </CardEyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <InfoChip icon="wallet" tone="positive" label="Renda mensal" value="R$ 18.500" />
              <InfoChip icon="activity" tone="attention" label="Despesas" value="R$ 9.850" />
              <InfoChip icon="layers" tone="primary" label="Investido" value="R$ 45.200" />
            </div>
          </Card>
        </UnfoldCard>

        <UnfoldCard
          x={node("metas").x}
          y={node("metas").y}
          width={node("metas").w}
          scale={vp.viewport.scale}
          draggable
          onMove={(x, y) => move("metas", x, y)}
          unfoldDelay={node("metas").delay}
        >
          <Card elevation={2} padding="md" accent="primary" forming>
            <CardEyebrow icon={<Icon name="flag" size={14} />}>
              Metas e sonhos
            </CardEyebrow>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <InfoChip icon="flag" tone="primary" label="Viagem" value="Europa · 2026" />
              <InfoChip icon="shield" tone="neutral" label="Reserva" value="R$ 28.000" />
            </div>
          </Card>
        </UnfoldCard>

        <UnfoldCard
          x={node("diag").x}
          y={node("diag").y}
          width={node("diag").w}
          scale={vp.viewport.scale}
          draggable
          onMove={(x, y) => move("diag", x, y)}
          unfoldDelay={node("diag").delay}
        >
          <DiagnosisCard
            title="Saúde Financeira"
            statusLabel="Boa"
            status="forming"
            score={78}
            description="Disciplina de poupança e baixa exposição a dívidas de alto custo."
            onDetails={() => {}}
          />
        </UnfoldCard>

        <UnfoldCard
          x={node("cluster").x}
          y={node("cluster").y}
          width={node("cluster").w}
          scale={vp.viewport.scale}
          draggable
          onMove={(x, y) => move("cluster", x, y)}
          unfoldDelay={node("cluster").delay}
        >
          <ClusterNode label="Proteção" count={4} icon="shield" />
        </UnfoldCard>

        <UnfoldCard
          x={node("add").x}
          y={node("add").y}
          width={node("add").w}
          scale={vp.viewport.scale}
          unfoldDelay={node("add").delay}
        >
          <AddNode />
        </UnfoldCard>
      </InfiniteCanvas>

      {/* Overlays fixos na viewport */}
      <div className="uf-demo__confidence">
        <ConfidenceMeter value={78} onInfo={() => {}} />
      </div>

      <div className="uf-demo__minimap">
        <Minimap nodes={miniNodes} viewport={view} />
      </div>

      <div className="uf-demo__zoom">
        <ZoomControls
          zoom={vp.viewport.scale * 100}
          onZoomIn={vp.zoomIn}
          onZoomOut={vp.zoomOut}
          onReset={() => vp.setViewport(INITIAL_VIEW)}
        />
      </div>

      <div className="uf-demo__hint">
        <Icon name="recenter" size={14} />
        Arraste os cards · arraste o fundo para mover · ⌘/Ctrl + scroll para zoom
      </div>
    </div>
  );
}

export default CanvasDemoSection;
