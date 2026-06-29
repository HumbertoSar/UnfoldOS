import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

/* =============================================================================
   Button — ações calmas. O primário usa índigo profundo; nunca grita.
   ============================================================================= */

type Variant = "primary" | "secondary" | "ghost" | "subtle";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Ícone antes do texto. */
  leadingIcon?: ReactNode;
  /** Ícone depois do texto (ex.: seta "→"). */
  trailingIcon?: ReactNode;
  /** Largura total do container. */
  block?: boolean;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    leadingIcon,
    trailingIcon,
    block = false,
    className = "",
    type = "button",
    children,
    ...rest
  },
  ref,
) {
  const classes = [
    "uf-btn",
    `uf-btn--${variant}`,
    `uf-btn--${size}`,
    block ? "uf-btn--block" : "",
    !children ? "uf-btn--icon" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button ref={ref} type={type} className={classes} {...rest}>
      {leadingIcon ? <span className="uf-btn__icon">{leadingIcon}</span> : null}
      {children ? <span className="uf-btn__label">{children}</span> : null}
      {trailingIcon ? (
        <span className="uf-btn__icon">{trailingIcon}</span>
      ) : null}
    </button>
  );
});

export default Button;
