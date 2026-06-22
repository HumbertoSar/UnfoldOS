# Diagnóstico Canva ao Vivo

Protótipo de **canvas de vida e finanças** montado ao vivo durante a conversa consultor↔cliente.
Reaproveita o motor de captação por voz do *Diagnóstico Financeiro* (STT + extração por IA com
function calling), com **domínio e interface próprios** — foco em coleta de dados (sem score, por enquanto).

## Arquitetura do domínio (schema híbrido)

Pensado para **iterar barato** — a estrutura endurece com o tempo:

- **Núcleo tipado** (`src/domain/registro.ts`) — fonte única dos campos. Cada entrada gera
  automaticamente o enum da IA, a coerção e o cartão na UI. Adicionar/renomear campo = **1 linha**.
- **Lista tipada** — `investimentos` (somados no patrimônio).
- **Balde aberto** (`observacoes`) — tudo exploratório (paixões, sonhos, pets, contexto) sem campo
  fixo. Quando um item vira recorrente, **promove-se** para campo tipado no registro.

## Stack
- React 18 + TS (strict) + Vite + Tailwind · estado em Zustand
- STT: Web Speech API (pt-BR) — **Chrome ou Edge**
- Extração: OpenRouter (compatível com OpenAI) via proxy Express — modelo configurável

## Como rodar
1. `npm install`
2. Copie `.env.example` → `.env` e preencha `OPENROUTER_API_KEY`.
3. `npm run dev:all` (front na 5174 + proxy na 8788).
4. Abra **http://localhost:5174** no **Chrome ou Edge**.

## Seções do canvas
Quem é a pessoa · Dependentes (incl. pets) · Sonhos e objetivos · Finanças (patrimônio) · Suitability

## Deploy
`vps-infra.md` do projeto irmão descreve a VPS. Este app roda na porta **8788** sob
`canva.mvpsardenberg.cloud`. Use `deploy-vps.ps1`.
