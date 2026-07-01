// Balões de interesse: bolhas que celebram uma "paixão" detectada (futebol,
// viagem, filme/série, livro, arte, pet, natureza). Ficam — não somem sozinhas
// — porque fazem parte do retrato da pessoa, junto do card "Quem é Você?".
import { create } from 'zustand';

export interface Balao {
  id: string;
  emoji: string;
  texto: string;
  detalhe?: string; // ex.: nome do time de futebol
  bg?: string; // cor de fundo (times têm cor própria)
  fg?: string;
}

interface EstadoBaloes {
  baloes: Balao[];
  adicionar: (b: Omit<Balao, 'id'>) => void;
}

function idUnico(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export const useBaloes = create<EstadoBaloes>((set) => ({
  baloes: [],
  adicionar: (b) => set((s) => ({ baloes: [...s.baloes, { ...b, id: idUnico() }] })),
}));
