import type { ButtonHTMLAttributes } from "react";
import { Icon } from "./Icon";
import type { IconName } from "./Icon";
import "./ClusterNode.css";

/* =============================================================================
   ClusterNode — "Nó de cluster". Cards que se aproximaram por afinidade
   semântica colapsam em um nó. Importância por agrupamento, não por destaque.
   ============================================================================= */

export interface ClusterNodeProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label: string;
  count: number;
  icon?: IconName;
  /** Texto auxiliar; padrão "N itens conectados". */
  caption?: string;
}

export function ClusterNode({
  label,
  count,
  icon = "cluster",
  caption,
  className = "",
  ...rest
}: ClusterNodeProps) {
  const cap = caption ?? `${count} ${count === 1 ? "item conectado" : "itens conectados"}`;
  return (
    <button type="button" className={`uf-cluster ${className}`} {...rest}>
      <span className="uf-cluster__tile" aria-hidden="true">
        <Icon name={icon} size={20} />
      </span>
      <span className="uf-cluster__text">
        <span className="uf-cluster__label">{label}</span>
        <span className="uf-cluster__caption uf-caption">{cap}</span>
      </span>
      <span className="uf-cluster__count" aria-hidden="true">
        {count}
      </span>
    </button>
  );
}

export default ClusterNode;
