// Mapeamento de exibição pros TIPOS_INTERESSE (registro.ts): emoji + rótulo
// curto pro balão flutuante, e cores dos times cariocas principais quando o
// interesse é futebol. Puramente apresentação — não faz parte do domínio
// compartilhado com o servidor.
import type { TipoInteresse } from './registro';

const EMOJI_POR_TIPO: Record<TipoInteresse, string> = {
  futebol: '⚽',
  viagem: '✈️',
  'filme-serie': '🎬',
  livro: '📚',
  arte: '🎨',
  pet: '🐾',
  natureza: '🌿',
};

const TEXTO_POR_TIPO: Record<TipoInteresse, string> = {
  futebol: 'Torcedor(a)',
  viagem: 'Ama viajar',
  'filme-serie': 'Fã de filmes e séries',
  livro: 'Leitor(a)',
  arte: 'Curte arte',
  pet: 'Tem pet',
  natureza: 'Ama natureza',
};

export function infoInteresse(tipo: string): { emoji: string; texto: string } {
  const t = tipo as TipoInteresse;
  return { emoji: EMOJI_POR_TIPO[t] ?? '✨', texto: TEXTO_POR_TIPO[t] ?? tipo };
}

export interface CoresTime {
  nome: string;
  bg: string;
  fg: string;
}

// Times cariocas principais — pra este teste, só os quatro grandes do Rio.
const TIMES_CARIOCAS: Record<string, CoresTime> = {
  flamengo: { nome: 'Flamengo', bg: '#E30613', fg: '#FFFFFF' },
  vasco: { nome: 'Vasco da Gama', bg: '#0D0D0D', fg: '#FFFFFF' },
  fluminense: { nome: 'Fluminense', bg: '#9F2042', fg: '#FFFFFF' },
  botafogo: { nome: 'Botafogo', bg: '#1A1A1A', fg: '#FFFFFF' },
};

const ALIAS_TIME: Record<string, keyof typeof TIMES_CARIOCAS> = {
  flamengo: 'flamengo',
  mengao: 'flamengo',
  fla: 'flamengo',
  'rubro-negro': 'flamengo',
  vasco: 'vasco',
  'vasco da gama': 'vasco',
  cruzmaltino: 'vasco',
  vascaino: 'vasco',
  vascaina: 'vasco',
  fluminense: 'fluminense',
  flu: 'fluminense',
  tricolor: 'fluminense',
  botafogo: 'botafogo',
  fogao: 'botafogo',
  glorioso: 'botafogo',
  alvinegro: 'botafogo',
};

const REGEX_ACENTOS = new RegExp(String.fromCharCode(0x5b, 0x5c, 0x75, 0x30, 0x33, 0x30, 0x30, 0x2d, 0x5c, 0x75, 0x30, 0x33, 0x36, 0x66, 0x5d), 'g');

function normalizar(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(REGEX_ACENTOS, '').trim();
}

export function detectarTimeCarioca(texto: string): CoresTime | null {
  const n = normalizar(texto);
  for (const [alias, chave] of Object.entries(ALIAS_TIME)) {
    if (n.includes(normalizar(alias))) return TIMES_CARIOCAS[chave];
  }
  return null;
}
