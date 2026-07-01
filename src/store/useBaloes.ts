// Balões de interesse: bolhas efêmeras e flutuantes que celebram uma "paixão"
// detectada (futebol, viagem, filme/série, livro, arte, pet, natureza). Somem
// sozinhas — não fazem parte do registro de dados, são só uma reação visual.
import { create } from 'zustand';

export interface Balao {
  id: string;
  emoji: string;
  texto: string;
  detalhe?: string; // ex.: nome do time de futebol
  bg?: string; // cor de fundo (times têm cor própria)
  fg?: string;
  zona: number; // posição pré-definida (ver BaloesInteresse.tsx) — round-robin
}

interface EstadoBaloes {
  baloes: Balao[];
  adicionar: (b: Omit<Balao, 'id' | 'zona'>) => void;
  remover: (id: string) => void;
}

function idUnico(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

const N_ZONAS = 6;
let proximaZona = 0;

export const useBaloes = create<EstadoBaloes>((set) => ({
  baloes: [],
  adicionar: (b) => {
    const id = idUnico();
    const zona = proximaZona % N_ZONAS;
    proximaZona++;
    set((s) => ({ baloes: [...s.baloes, { ...b, id, zona }] }));
    setTimeout(() => set((s) => ({ baloes: s.baloes.filter((x) => x.id !== id) })), 7000);
  },
  remover: (id) => set((s) => ({ baloes: s.baloes.filter((x) => x.id !== id) })),
}));
