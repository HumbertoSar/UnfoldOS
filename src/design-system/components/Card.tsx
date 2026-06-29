import { forwardRef } from "react";
import type { ElementType, HTMLAttributes, ReactNode } from "react";
import "./Card.css";

/* =============================================================================
   Card — a unidade fundamental do Unfold OS.
   Toda informação existe como um card. Cards não nascem completos: o estado
   `forming` mostra a incompletude com honestidade (borda tracejada, tom suave).
   ============================================================================= */

type Elevation = 0 | 1 | 2 | 3;
type Padding = "none" | "sm" | "md" | "lg";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
  elevation?: Elevation;
  padding?: Padding;
  /** Reage a hover/foco como um objeto manipulável na canvas. */
  interactive?: boolean;
  /** "Em formação": o card ainda está se desdobrando, faltam dados. */
  forming?: boolean;
  /** Tinta de acento na borda esquerda (afinidade semântica de um grupo). */
  accent?: "none" | "primary" | "positive" | "attention" | "forming";
  children?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    as: Tag = "div",
    elevation = 1,
    padding = "md",
    interactive = false,
    forming = false,
    accent = "none",
    className = "",
    children,
    ...rest
  },
  ref,
) {
  const classes = [
    "uf-card",
    `uf-card--elev-${elevation}`,
    `uf-card--pad-${padding}`,
    interactive ? "uf-card--interactive" : "",
    forming ? "uf-card--forming" : "",
    accent !== "none" ? `uf-card--accent-${accent}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag ref={ref} className={classes} {...rest}>
      {children}
    </Tag>
  );
});

/* --- Subcomponentes de composição ----------------------------------------- */

export function CardEyebrow({
  icon,
  children,
}: {
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="uf-card__eyebrow uf-overline">
      {icon}
      <span>{children}</span>
    </div>
  );
}

export function CardHeader({
  className = "",
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={`uf-card__header ${className}`} {...rest} />;
}

export function CardTitle({
  className = "",
  ...rest
}: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`uf-card__title uf-title-3 ${className}`} {...rest} />;
}

export function CardRow({
  className = "",
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={`uf-card__row ${className}`} {...rest} />;
}

export function CardDivider() {
  return <hr className="uf-card__divider" />;
}

export default Card;
