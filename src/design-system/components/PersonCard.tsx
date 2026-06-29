import { Card } from "./Card";
import { Avatar } from "./Avatar";
import { Badge, ConfidenceDots } from "./Badge";
import { Icon } from "./Icon";
import "./PersonCard.css";

/* =============================================================================
   PersonCard — "Card de pessoa". O cliente (ou alguém da vida dele) como objeto
   na canvas: avatar, nome, papel inferido e o quanto a IA confia no que captou.
   ============================================================================= */

export interface PersonCardProps {
  name: string;
  /** Relação/legenda sob o nome, ex.: "Você", "Filha". */
  relation?: string;
  avatarSrc?: string;
  /** Papel inferido (editável), ex.: "Planejadora". */
  role?: string;
  onEditRole?: () => void;
  /** Confiança da captação. */
  confidence?: { label: string; level: number; total?: number };
  className?: string;
}

export function PersonCard({
  name,
  relation,
  avatarSrc,
  role,
  onEditRole,
  confidence,
  className = "",
}: PersonCardProps) {
  return (
    <Card
      elevation={2}
      padding="lg"
      className={`uf-person ${className}`}
    >
      <Avatar name={name} src={avatarSrc} size="xl" ring className="uf-person__avatar" />
      <div className="uf-person__name uf-title-3">{name}</div>
      {relation ? (
        <div className="uf-person__relation uf-caption">{relation}</div>
      ) : null}

      {role ? (
        <button
          type="button"
          className="uf-person__role"
          onClick={onEditRole}
          disabled={!onEditRole}
          aria-label={onEditRole ? `Editar papel: ${role}` : role}
        >
          <Badge tone="primary" soft>
            {role}
          </Badge>
          {onEditRole ? <Icon name="settings" size={13} /> : null}
        </button>
      ) : null}

      {confidence ? (
        <div className="uf-person__confidence">
          <ConfidenceDots
            label={`Confiança: ${confidence.label}`}
            level={confidence.level}
            total={confidence.total ?? 4}
          />
        </div>
      ) : null}
    </Card>
  );
}

export default PersonCard;
