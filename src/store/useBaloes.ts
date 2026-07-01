// Balões de interesse: bolhas que celebram uma "paixão" detectada (futebol,
// viagem, filme/série, livro, arte, pet, natureza). Ficam — não somem sozinhas
// — porque fazem parte do retrato da pessoa, junto do card "Quem é Você?".
import { create } from 'zustand';

export interface Balao {
  id: string;
  emoji: string;
  texto: string;
  detalhe?: string; // ex.: nome do time de futebol
  bandeira?: { corA: string; corB: string }; // só futebol — cores do time
}

interface EstadoBaloes {
  baloes: Balao[];
  adicionar: (b: Omit<Balao, 'id'>) => void;
  limpar: () => void;
}

function idUnico(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export const useBaloes = create<EstadoBaloes>((set) => ({
  baloes: [],
  adicionar: (b) => set((s) => ({ baloes: [...s.baloes, { ...b, id: idUnico() }] })),
  limpar: () => set({ baloes: [] }),
}));
