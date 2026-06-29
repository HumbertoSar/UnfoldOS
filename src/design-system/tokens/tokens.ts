/* =============================================================================
   Unfold OS — Design Tokens (TypeScript)
   -----------------------------------------------------------------------------
   Espelho tipado de tokens.css. Use os VALORES crus aqui apenas quando o JS
   precisa calcular (matemática da canvas, animações imperativas). Para estilizar
   componentes, prefira as CSS variables via `cssVar()` ou classes utilitárias.
   ============================================================================= */

export const palette = {
  azulProfundo: "#0e142b",
  indigo: "#24385a",
  grafite: "#485563",
  pedra: "#e7eaee",
  areia: "#f3f6f8",
  salvia: "#3fa688",
  ambar: "#d4af37",
} as const;

export const neutral = {
  0: "#ffffff",
  50: "#f8fafb",
  100: "#f3f6f8",
  150: "#eceff3",
  200: "#e7eaee",
  300: "#d5dae1",
  400: "#aeb6c1",
  500: "#8a94a3",
  600: "#677085",
  700: "#485563",
  800: "#2c3848",
  900: "#1a2233",
  950: "#0e142b",
} as const;

export const indigo = {
  50: "#eef1f7",
  100: "#d8dfec",
  200: "#b3c0da",
  300: "#8093bc",
  400: "#51689b",
  500: "#24385a",
  600: "#1e2f4c",
  700: "#18263d",
  800: "#121c2e",
  900: "#0e142b",
} as const;

export const sage = {
  50: "#ecf6f2",
  100: "#d2ebe2",
  200: "#a6d7c6",
  300: "#79c3a9",
  400: "#56b295",
  500: "#3fa688",
  600: "#348b72",
  700: "#2a6f5b",
  800: "#205445",
  900: "#163a30",
} as const;

export const amber = {
  50: "#faf4e2",
  100: "#f3e6be",
  200: "#e8d08a",
  300: "#ddbc5c",
  400: "#d4af37",
  500: "#be9a2c",
  600: "#9c7e24",
  700: "#7a631c",
  800: "#574716",
  900: "#3a2f0f",
} as const;

export const space = {
  0: 0,
  "3xs": 2,
  "2xs": 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
  "5xl": 64,
  "6xl": 80,
  "7xl": 96,
} as const;

export const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 28,
  full: 999,
} as const;

export const fontSize = {
  display: 56,
  title1: 40,
  title2: 28,
  title3: 20,
  bodyLg: 18,
  body: 16,
  label: 14,
  caption: 12,
  overline: 11,
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
} as const;

export const motion = {
  duration: {
    instant: 80,
    fast: 140,
    base: 220,
    slow: 320,
    unfold: 520,
    settle: 720,
  },
  ease: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    entrance: "cubic-bezier(0.16, 1, 0.3, 1)",
    exit: "cubic-bezier(0.4, 0, 1, 1)",
    spring: "cubic-bezier(0.34, 1.4, 0.64, 1)",
  },
} as const;

export const elevation = {
  1: "0 1px 2px rgba(14,20,43,0.04), 0 1px 3px rgba(14,20,43,0.06)",
  2: "0 2px 6px rgba(14,20,43,0.05), 0 6px 16px rgba(14,20,43,0.06)",
  3: "0 2px 6px rgba(14,20,43,0.04), 0 12px 28px rgba(14,20,43,0.1)",
  4: "0 24px 56px rgba(14,20,43,0.16)",
  lift: "0 18px 40px rgba(14,20,43,0.18)",
} as const;

export const zIndex = {
  canvas: 0,
  cluster: 5,
  card: 10,
  cardActive: 20,
  minimap: 80,
  controls: 100,
  overlay: 1000,
  popover: 1100,
  toast: 1200,
} as const;

/** Referência a uma CSS variable do design system: cssVar("color-primary") */
export function cssVar(name: string, fallback?: string): string {
  const ref = `--uf-${name}`;
  return fallback ? `var(${ref}, ${fallback})` : `var(${ref})`;
}

export const tokens = {
  palette,
  neutral,
  indigo,
  sage,
  amber,
  space,
  radius,
  fontSize,
  fontWeight,
  motion,
  elevation,
  zIndex,
} as const;

export type Tokens = typeof tokens;
export default tokens;
