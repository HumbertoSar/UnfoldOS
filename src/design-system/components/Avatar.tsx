import "./Avatar.css";

/* =============================================================================
   Avatar — pessoa como objeto na canvas. Usa imagem ou iniciais.
   ============================================================================= */

type Size = "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  name: string;
  src?: string;
  size?: Size;
  /** Anel sutil ao redor (destaca "você"/foco). */
  ring?: boolean;
  className?: string;
}

const sizePx: Record<Size, number> = { sm: 32, md: 44, lg: 64, xl: 88 };

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  name,
  src,
  size = "md",
  ring = false,
  className = "",
}: AvatarProps) {
  const px = sizePx[size];
  return (
    <span
      className={`uf-avatar uf-avatar--${size}${ring ? " uf-avatar--ring" : ""} ${className}`}
      style={{ width: px, height: px }}
    >
      {src ? (
        <img src={src} alt={name} className="uf-avatar__img" />
      ) : (
        <span className="uf-avatar__initials" aria-label={name}>
          {initials(name)}
        </span>
      )}
    </span>
  );
}

export default Avatar;
