import type { SVGProps } from "react";

/* =============================================================================
   Unfold OS — Icon
   -----------------------------------------------------------------------------
   Conjunto de ícones de linha, finos e arredondados — calmos, nunca alarmantes.
   Traço em `currentColor`, então herdam a cor do texto. 24×24, stroke 1.6.
   ============================================================================= */

export type IconName =
  | "mic"
  | "info"
  | "wallet"
  | "heart"
  | "user"
  | "users"
  | "target"
  | "flag"
  | "calendar"
  | "plus"
  | "minus"
  | "recenter"
  | "cluster"
  | "chevron-right"
  | "chevron-left"
  | "chevron-down"
  | "arrow-right"
  | "arrow-up-right"
  | "search"
  | "bell"
  | "settings"
  | "share"
  | "more"
  | "check"
  | "shield"
  | "trending-up"
  | "sparkle"
  | "eye"
  | "bookmark"
  | "waveform"
  | "home"
  | "grid"
  | "activity"
  | "layers"
  | "coins"
  | "alert-soft";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  /** Tamanho em px (largura = altura). Padrão 20. */
  size?: number;
  /** Espessura do traço. Padrão 1.6. */
  strokeWidth?: number;
  /** Rótulo acessível. Se ausente, o ícone é decorativo (aria-hidden). */
  title?: string;
}

const paths: Record<IconName, JSX.Element> = {
  mic: (
    <>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5.5 10.5a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17v4M8.5 21h7" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 7.75h.01" />
    </>
  ),
  wallet: (
    <>
      <path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h11a1.5 1.5 0 0 1 1.5 1.5V8" />
      <rect x="3.5" y="7.5" width="17" height="12" rx="2.5" />
      <path d="M16.5 12.5h2M16.5 12.5a1.5 1.5 0 0 0 0 3h2v-3z" />
    </>
  ),
  heart: (
    <path d="M12 20s-7-4.35-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5C19 15.65 12 20 12 20z" />
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.75" />
      <path d="M5 19.5a7 7 0 0 1 14 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.25" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M15.5 5.5a3.25 3.25 0 0 1 0 6.4" />
      <path d="M16.5 14.2A5.5 5.5 0 0 1 20.5 19" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  flag: (
    <>
      <path d="M6 21V4" />
      <path d="M6 4.5h11l-2.2 3.5L17 11.5H6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  recenter: (
    <>
      <circle cx="12" cy="12" r="3.25" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" />
    </>
  ),
  cluster: (
    <>
      <circle cx="7" cy="8" r="2.25" />
      <circle cx="16.5" cy="7" r="2.25" />
      <circle cx="12" cy="16.5" r="2.25" />
      <path d="M8.7 9.5l2 4.2M14.8 8.7l-2 4.2M9 8h5.2" />
    </>
  ),
  "chevron-right": <path d="M9 5l7 7-7 7" />,
  "chevron-left": <path d="M15 5l-7 7 7 7" />,
  "chevron-down": <path d="M5 9l7 7 7-7" />,
  "arrow-right": <path d="M4 12h15m0 0l-6-6m6 6l-6 6" />,
  "arrow-up-right": <path d="M7 17L17 7m0 0H8m9 0v9" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </>
  ),
  bell: (
    <>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 1.5 6.5 1.5 6.5h-15S6 14 6 9z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5l1.4 2.3 2.6-.6.4 2.7 2.5 1-.9 2.5 1.7 2.1-2.1 1.7.9 2.5-2.5 1-.4 2.7-2.6-.6L12 21.5l-1.4-2.3-2.6.6-.4-2.7-2.5-1 .9-2.5L4.2 9.8l2.1-1.7-.9-2.5 2.5-1 .4-2.7 2.6.6z" />
    </>
  ),
  share: (
    <>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="17.5" cy="6" r="2.5" />
      <circle cx="17.5" cy="18" r="2.5" />
      <path d="M8.2 10.8l7-3.6M8.2 13.2l7 3.6" />
    </>
  ),
  more: (
    <>
      <circle cx="5.5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18.5" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  check: <path d="M4.5 12.5l4.5 4.5 10.5-11" />,
  shield: (
    <>
      <path d="M12 3l7 2.5v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9v-6L12 3z" />
      <path d="M9 12l2 2 4-4.5" />
    </>
  ),
  "trending-up": (
    <>
      <path d="M3.5 16.5l5-5 3.5 3.5L20 7" />
      <path d="M20 11.5V7h-4.5" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3.5c.6 4 1.5 4.9 5.5 5.5-4 .6-4.9 1.5-5.5 5.5-.6-4-1.5-4.9-5.5-5.5 4-.6 4.9-1.5 5.5-5.5z" />
      <path d="M18 14.5c.3 1.7.7 2.1 2.4 2.4-1.7.3-2.1.7-2.4 2.4-.3-1.7-.7-2.1-2.4-2.4 1.7-.3 2.1-.7 2.4-2.4z" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  bookmark: <path d="M6.5 3.5h11a1 1 0 0 1 1 1v16l-6.5-4-6.5 4v-16a1 1 0 0 1 1-1z" />,
  waveform: (
    <path d="M3 12h2M7 8v8M11 4.5v15M15 7.5v9M19 10v4M21 12h0" />
  ),
  home: (
    <>
      <path d="M4 11l8-6.5 8 6.5" />
      <path d="M6 9.5V20h12V9.5" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
    </>
  ),
  activity: <path d="M3 12.5h4l2.5-7 4 14 2.5-7H21" />,
  layers: (
    <>
      <path d="M12 3.5l8.5 4.5L12 12.5 3.5 8 12 3.5z" />
      <path d="M3.5 12.5L12 17l8.5-4.5" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="9" cy="7" rx="5.5" ry="2.75" />
      <path d="M3.5 7v4c0 1.5 2.5 2.75 5.5 2.75" />
      <ellipse cx="15" cy="14" rx="5.5" ry="2.75" />
      <path d="M9.5 14v3c0 1.5 2.5 2.75 5.5 2.75s5.5-1.25 5.5-2.75v-3" />
    </>
  ),
  "alert-soft": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5" />
      <path d="M12 16h.01" />
    </>
  ),
};

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.6,
  title,
  ...rest
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}

export default Icon;
