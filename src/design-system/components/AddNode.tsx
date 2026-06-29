import type { ButtonHTMLAttributes } from "react";
import { Icon } from "./Icon";
import "./AddNode.css";

/* =============================================================================
   AddNode — "Adicionar nó". O convite aberto da canvas: um espaço tracejado que
   espera um novo tópico. Incompletude como afordância, não como erro.
   ============================================================================= */

export interface AddNodeProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label?: string;
  size?: number;
}

export function AddNode({
  label = "Adicionar tópico",
  size = 88,
  className = "",
  ...rest
}: AddNodeProps) {
  return (
    <span className={`uf-addnode ${className}`}>
      <button
        type="button"
        className="uf-addnode__btn"
        style={{ width: size, height: size }}
        aria-label={label}
        {...rest}
      >
        <Icon name="plus" size={Math.round(size * 0.34)} strokeWidth={1.5} />
      </button>
      {label ? <span className="uf-addnode__label uf-caption">{label}</span> : null}
    </span>
  );
}

export default AddNode;
