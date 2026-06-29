/* =============================================================================
   Unfold OS — Design System (ponto de entrada da biblioteca)
   ============================================================================= */

// Estilos base — importe uma vez na raiz do app que consome o design system.
import "./styles/fonts.css";
import "./tokens/tokens.css";
import "./styles/global.css";

export * from "./components";
export * from "./canvas";
export { tokens, default as defaultTokens } from "./tokens/tokens";
export * as tokenValues from "./tokens/tokens";
