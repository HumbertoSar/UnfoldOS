import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Bases do design system Unfold OS — fontes (Inter via @fontsource), tokens --uf-*
// e o reset/tipografia global. O Tailwind foi removido na Fase 2; global.css agora
// é a base única de estilos.
import './design-system/styles/fonts.css';
import './design-system/tokens/tokens.css';
import './design-system/styles/global.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
