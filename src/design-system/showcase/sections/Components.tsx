import { useState } from "react";
import { Icon } from "../../components/Icon";
import { MicButton } from "../../components/MicButton";
import { InfoChip } from "../../components/InfoChip";
import { ConfidenceMeter } from "../../components/ConfidenceMeter";
import { DiagnosisCard } from "../../components/DiagnosisCard";
import { PersonCard } from "../../components/PersonCard";
import { ScoreBar } from "../../components/ScoreBar";
import { ClusterNode } from "../../components/ClusterNode";
import { AddNode } from "../../components/AddNode";
import { ZoomControls } from "../../components/ZoomControls";
import { Minimap } from "../../components/Minimap";
import { Button } from "../../components/Button";
import { Badge, ConfidenceDots } from "../../components/Badge";

function Cell({
  label,
  span,
  stage,
  children,
}: {
  label: string;
  span?: 4 | 6 | 8 | 12;
  stage?: "default" | "column" | "stack";
  children: React.ReactNode;
}) {
  const cls = ["uf-cell", span && span !== 4 ? `uf-cell--${span}` : ""]
    .filter(Boolean)
    .join(" ");
  const stageCls = [
    "uf-cell__stage",
    stage === "column" ? "uf-cell__stage--column" : "",
    stage === "stack" ? "uf-cell__stage--stack" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls}>
      <div className="uf-cell__label">
        <span className="uf-overline">{label}</span>
      </div>
      <div className={stageCls}>{children}</div>
    </div>
  );
}

function MicCell() {
  const [listening, setListening] = useState(false);
  return (
    <Cell label="Botão de microfone" stage="column">
      <MicButton listening={listening} onClick={() => setListening((v) => !v)} />
      <span className="uf-caption">
        {listening ? "Ouvindo…" : "Clique para falar"}
      </span>
    </Cell>
  );
}

export function ComponentsSection() {
  return (
    <div className="uf-gallery">
      <MicCell />

      <Cell label="Chips de informação" stage="stack">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <InfoChip
            icon="wallet"
            tone="positive"
            label="Renda mensal"
            value="R$ 18.500"
            onInfo={() => {}}
          />
          <InfoChip
            icon="heart"
            tone="attention"
            label="Paixão"
            value="Fotografia"
            onInfo={() => {}}
          />
          <InfoChip
            icon="flag"
            tone="primary"
            label="Meta"
            value="Viagem 2026"
            onInfo={() => {}}
          />
        </div>
      </Cell>

      <Cell label="Medidor de confiança" stage="stack">
        <ConfidenceMeter value={78} onInfo={() => {}} />
      </Cell>

      <Cell label="Card de diagnóstico" span={6} stage="stack">
        <DiagnosisCard
          title="Saúde Financeira"
          statusLabel="Boa"
          status="forming"
          score={78}
          description="Você tem disciplina de poupança e baixa exposição a dívidas de alto custo."
          onDetails={() => {}}
        />
      </Cell>

      <Cell label="Card de pessoa" span={6} stage="stack">
        <PersonCard
          name="Mariana"
          relation="Você"
          role="Planejadora"
          onEditRole={() => {}}
          confidence={{ label: "Alta", level: 4, total: 4 }}
        />
      </Cell>

      <Cell label="Dimensões do diagnóstico" span={6} stage="stack">
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
          <ScoreBar label="Organização" value={8.5} />
          <ScoreBar label="Liquidez" value={7.0} />
          <ScoreBar label="Endividamento" value={6.0} />
          <ScoreBar label="Proteção" value={7.5} />
          <ScoreBar label="Planejamento" value={7.5} />
        </div>
      </Cell>

      <Cell label="Primitivos" span={6} stage="stack">
        <div style={{ display: "flex", flexDirection: "column", gap: 18, width: "100%" }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button trailingIcon={<Icon name="arrow-right" size={16} />}>
              Ver recomendações
            </Button>
            <Button variant="secondary">Detalhes</Button>
            <Button variant="ghost" leadingIcon={<Icon name="share" size={16} />}>
              Compartilhar
            </Button>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Badge tone="positive" dot>
              Ativo
            </Badge>
            <Badge tone="attention" dot>
              Atenção
            </Badge>
            <Badge tone="forming" dot>
              Em formação
            </Badge>
            <Badge tone="primary">Planejadora</Badge>
          </div>
          <ConfidenceDots label="Confiança: Alta" level={4} total={4} />
        </div>
      </Cell>

      <Cell label="Nó de cluster" stage="default">
        <ClusterNode label="Finanças" count={12} icon="coins" />
      </Cell>

      <Cell label="Adicionar nó" stage="default">
        <AddNode />
      </Cell>

      <Cell label="Zoom & Minimapa" stage="default">
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <ZoomControls zoom={100} />
          <Minimap
            nodes={[
              { x: 0.08, y: 0.12, w: 0.22, h: 0.18, tone: "primary" },
              { x: 0.4, y: 0.08, w: 0.28, h: 0.2, tone: "positive" },
              { x: 0.72, y: 0.34, w: 0.2, h: 0.22, tone: "attention" },
              { x: 0.16, y: 0.5, w: 0.26, h: 0.2, tone: "neutral" },
            ]}
            viewport={{ x: 0.3, y: 0.22, w: 0.4, h: 0.46 }}
          />
        </div>
      </Cell>
    </div>
  );
}

export default ComponentsSection;
