# Referência de Tokens

Todos os tokens são **CSS variables** com prefixo `--uf-`, definidos em
[`src/tokens/tokens.css`](../src/tokens/tokens.css). Há também um espelho tipado
em `tokens.ts` (para a matemática da canvas) e um arquivo W3C portável em
`tokens.json` (Figma, Tailwind, Style Dictionary).

> **Regra de ouro:** componentes usam **tokens semânticos** (ex.:
> `--uf-color-primary`), nunca primitivos crus (ex.: `--uf-indigo-500`) nem hex.

## Camadas

1. **Primitivos** — a paleta crua e suas escalas (`--uf-indigo-500`, …). Não
   usar direto na UI.
2. **Semânticos** — o vocabulário da interface (`--uf-color-surface`,
   `--uf-color-ink`, …). **Use estes.**
3. **Componente** — ajustes finos herdados dos semânticos.

## Cor — paleta base (Canvas Vivo)

| Nome | Hex | Token primitivo | Papel semântico |
| --- | --- | --- | --- |
| Azul Profundo | `#0E142B` | `--uf-azul-profundo` | `--uf-color-ink`, fundo escuro |
| Índigo | `#24385A` | `--uf-indigo` | `--uf-color-primary` |
| Cinza Grafite | `#485563` | `--uf-grafite` | `--uf-color-ink-secondary` |
| Cinza Pedra | `#E7EAEE` | `--uf-pedra` | `--uf-color-border` |
| Areia | `#F3F6F8` | `--uf-areia` | `--uf-color-canvas` |
| Verde Sálvia | `#3FA688` | `--uf-salvia` | `--uf-color-positive` |
| Âmbar Suave | `#D4AF37` | `--uf-ambar` | `--uf-color-accent` |

Cada cor de marca (Índigo, Sálvia, Âmbar) e os Neutros têm escala `50`–`900`.

## Cor — semânticos principais

```
Superfícies   --uf-color-canvas, --uf-color-bg, --uf-color-surface,
              --uf-color-surface-sunken, --uf-color-surface-inverse
Tinta         --uf-color-ink, --uf-color-ink-secondary,
              --uf-color-ink-tertiary, --uf-color-ink-on-dark
Bordas        --uf-color-border, --uf-color-border-strong, --uf-color-divider
Primário      --uf-color-primary(-hover/-active/-strong/-soft), --uf-color-on-primary
Status        --uf-color-positive, --uf-color-attention, --uf-color-forming,
              --uf-color-neutral  (cada um com variante -soft e -ink)
Foco          --uf-color-focus-ring, --uf-focus-ring
```

## Tipografia

Família: **Inter** (`--uf-font-sans`), pesos 400 / 500 / 600.

| Token | Tamanho | Uso |
| --- | --- | --- |
| `--uf-text-display` | 56px | Herói |
| `--uf-text-title-1` | 40px | Título 1 |
| `--uf-text-title-2` | 28px | Título 2 |
| `--uf-text-title-3` | 20px | Título 3 |
| `--uf-text-body-lg` | 18px | Corpo destacado |
| `--uf-text-body` | 16px | Texto |
| `--uf-text-label` | 14px | Rótulos, botões |
| `--uf-text-caption` | 12px | Legenda |
| `--uf-text-overline` | 11px | Seções (caixa alta) |

Classes utilitárias prontas: `.uf-display`, `.uf-title-1…3`, `.uf-body(-lg)`,
`.uf-label`, `.uf-caption`, `.uf-overline`.

## Espaçamento (base 4px)

`--uf-space-3xs` (2) · `2xs` (4) · `xs` (8) · `sm` (12) · `md` (16) · `lg` (20) ·
`xl` (24) · `2xl` (32) · `3xl` (40) · `4xl` (48) · `5xl` (64) · `6xl` (80) ·
`7xl` (96)

## Raios

`--uf-radius-xs` (6) · `sm` (8) · `md` (12) · `lg` (16) · `xl` (20) · `2xl` (28) ·
`full` (999)

## Elevação

`--uf-elevation-1…4` (sombras macias de tinta profunda), `--uf-elevation-lift`
(card levantado ao arrastar), `--uf-focus-ring`.

## Movimento

| Token | Valor | Uso |
| --- | --- | --- |
| `--uf-duration-fast` | 140ms | Hovers, botões |
| `--uf-duration-base` | 220ms | Transições padrão |
| `--uf-duration-unfold` | 520ms | **A assinatura:** card se desdobra |
| `--uf-duration-settle` | 720ms | Reposicionamento por afinidade |
| `--uf-ease-entrance` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entradas calmas |
| `--uf-ease-spring` | `cubic-bezier(0.34, 1.4, 0.64, 1)` | Respiro ao abrir |

Todas as durações vão a `0ms` sob `prefers-reduced-motion: reduce`.

## Camadas (z-index)

`--uf-z-canvas` (0) · `cluster` (5) · `card` (10) · `card-active` (20) ·
`minimap` (80) · `controls` (100) · `overlay` (1000) · `popover` (1100) ·
`toast` (1200)
