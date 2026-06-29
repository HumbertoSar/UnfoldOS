# Unfold OS

App full-stack que monta uma **canvas de vida e finanças ao vivo** durante a conversa consultor↔cliente: escuta a fala, transcreve, e uma IA extrai dados que preenchem cartões em tempo real. Reaproveita o motor de voz + extração do *Diagnóstico Financeiro*.

## Comandos
- `npm install` — instala dependências.
- `npm run dev:all` — front (Vite, **:5174**) + proxy (Express, **:8788**) juntos. Abra http://localhost:5174.
- `npm run typecheck` — `tsc --noEmit` (cobre `src/` e `server/`).
- `npm run build` — `tsc -b && vite build`. `npm run preview` serve o build.
- `npm test` — Vitest (`src/**/*.test.ts`).

## Arquitetura
- **Frontend**: React 18 + TS strict + Vite + Zustand. STT via Web Speech API (pt-BR) — **só Chrome/Edge, sob HTTPS**.
- **Backend**: `server/index.ts` (Express) faz proxy da extração para o **OpenRouter** (SDK OpenAI) com function calling. Vite faz proxy de `/api` → `:8788`.
- **Domínio compartilhado** front+back: `src/domain/registro.ts` é a **fonte única** dos campos (schema híbrido: núcleo tipado + lista `investimentos` + balde aberto `observacoes`). `server/index.ts` importa de `../src/domain/registro` — **não mova `src/domain`**.
- **Camadas**: `src/speech` (motor de voz), `src/extraction` (orquestração + cliente), `src/store` (Zustand), `src/ui` (telas: `TelaInicio`, `Canvas`, `Toasts`).

## Design system Unfold OS — `src/design-system/`
Biblioteca de tokens `--uf-*` + ~20 componentes + canvas infinita. Alias `@ds` → `src/design-system`. Exports em `src/design-system/index.ts`. Docs em `docs/principles.md` e `docs/tokens.md`. Showcase de referência em `src/design-system/showcase/`.

**Status da migração:**
- ✅ **Fase 1**: design system integrado; tokens e fontes (`@fontsource/inter`) carregados no root (`src/main.tsx`). App roda igual ao anterior.
- ⏳ **Fase 2 (pendente)**: re-skin gradual das telas (`src/ui`) com os componentes/tokens do design system, depois remover o Tailwind. `src/design-system/styles/global.css` só deve ser importado no fim (conflita com o preflight do Tailwind).

## Segredos / ambiente
- Copie `.env.example` → `.env` e preencha `OPENROUTER_API_KEY` (usada **só** no servidor; nunca vai para o git nem para o navegador). Na nuvem/VM, configure a chave no ambiente.

## Deploy
`deploy-vps.ps1` (PowerShell) → VPS com PM2 + Caddy, porta 8788, `canva.mvpsardenberg.cloud`. Front buildado é servido pelo próprio Express.
