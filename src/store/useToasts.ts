// Toasts efêmeros: "Captei: ...", "↻ Corrigido", avisos e erros. Somem sozinhos.
import { create } from 'zustand';

export interface Toast {
  id: string;
  tipo: 'captura' | 'erro' | 'aviso';
  rotulo?: string;
  valor?: string;
  campo?: string;
  logId?: string;
  correcao?: boolean;
  mensagem?: string;
}

interface EstadoToasts {
  toasts: Toast[];
  adicionar: (t: Omit<Toast, 'id' | 'tipo'>) => void;
  adicionarErro: (mensagem: string) => void;
  adicionarAviso: (mensagem: string) => void;
  remover: (id: string) => void;
}

function idUnico(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export const useToasts = create<EstadoToasts>((set) => ({
  toasts: [],
  adicionar: (t) => {
    const id = idUnico();
    set((s) => ({ toasts: [...s.toasts, { ...t, id, tipo: 'captura' }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })), 6000);
  },
  adicionarErro: (mensagem) => {
    const id = idUnico();
    set((s) => ({ toasts: [...s.toasts, { id, tipo: 'erro', mensagem }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })), 8000);
  },
  adicionarAviso: (mensagem) => {
    const id = idUnico();
    set((s) => ({ toasts: [...s.toasts, { id, tipo: 'aviso', mensagem }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })), 8000);
  },
  remover: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));
