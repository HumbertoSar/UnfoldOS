import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Bases do design system Unfold OS — fontes (Inter via @fontsource) e tokens --uf-*.
// global.css fica de fora por enquanto (conflita com o preflight do Tailwind); entra no fim da migração.
import './design-system/styles/fonts.css';
import './design-system/tokens/tokens.css';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
