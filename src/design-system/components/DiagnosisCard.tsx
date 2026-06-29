import type { ReactNode } from "react";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { ProgressRing } from "./ProgressRing";
import { Button } from "./Button";
import { Icon } from "./Icon";
import "./DiagnosisCard.css";

/* =============================================================================
   DiagnosisCard — "Card de diagnóstico". Um entendimento que emergiu da relação
   entre cards. Nunca uma conclusão fechada: por padrão está "em formação".
   ============================================================================= */

type Status = "forming" | "good" | "attention" | "neutral";

const statusMeta: Record<
  Status,
  { tone: "forming" | "positive" | "attention" | "neutral"; eyebrow: string }
> = {
  forming: { tone: "forming", eyebrow: "Diagnóstico em formação" },
  good: { tone: "positive", eyebrow: "Diagnóstico" },
  attention: { tone: "attention", eyebrow: "Diagnóstico" },
  neutral: { tone: "neutral", eyebrow: "Diagnóstico" },
};

export interface DiagnosisCardProps {
  title: string;
  /** Rótulo de estado, ex.: "Boa", "Em evolução". */
  statusLabel: string;
  status?: Status;
  description?: ReactNode;
  /** 0–100 — desenha o anel à direita. */
  score?: number;
  onDetails?: () => void;
  detailsLabel?: string;
  className?: string;
}

export function DiagnosisCard({
  title,
  statusLabel,
  status = "forming",
  description,
  score,
  onDetails,
  detailsLabel = "Ver detalhes",
  className = "",
}: DiagnosisCardProps) {
  const meta = statusMeta[status];

  return (
    <Card
      elevation={2}
      padding="lg"
      accent={meta.tone === "neutral" ? "none" : meta.tone}
      className={`uf-diagnosis ${className}`}
    >
      <div className="uf-diagnosis__head">
        <div className="uf-diagnosis__eyebrow uf-overline">
          <BrandMark size={16} forming={status === "forming"} />
          <span>{meta.eyebrow}</span>
        </div>
        {typeof score === "number" ? (
          <ProgressRing
            value={score}
            tone={meta.tone === "neutral" ? "primary" : meta.tone}
            size={56}
            thickness={5}
          >
            <span className="uf-diagnosis__score">{Math.round(score)}%</span>
          </ProgressRing>
        ) : null}
      </div>

      <h3 className="uf-diagnosis__title uf-title-2">{title}</h3>
      <Badge tone={meta.tone} dot className="uf-diagnosis__status">
        {statusLabel}
      </Badge>

      {description ? (
        <p className="uf-diagnosis__desc uf-body">{description}</p>
      ) : null}

      {onDetails ? (
        <Button
          variant="ghost"
          size="sm"
          className="uf-diagnosis__action"
          onClick={onDetails}
          trailingIcon={<Icon name="arrow-right" size={16} />}
        >
          {detailsLabel}
        </Button>
      ) : null}
    </Card>
  );
}

/* --- BrandMark — a marca do Unfold: um anel que se desdobra ----------------- */

export function BrandMark({
  size = 28,
  forming = false,
}: {
  size?: number;
  forming?: boolean;
}) {
  const r = size / 2 - size * 0.09;
  const c = 2 * Math.PI * r;
  // anel quase completo, com uma abertura — algo "ainda se desdobrando"
  const open = forming ? 0.45 : 0.18;
  const dash = (1 - open) * c;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      className="uf-brandmark"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--uf-color-border-strong)"
        strokeWidth={size * 0.09}
        opacity={0.5}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--uf-color-positive)"
        strokeWidth={size * 0.09}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

export default DiagnosisCard;
