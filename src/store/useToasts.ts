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
  atrasoEntrada?: number; // ms — escalona a entrada quando vários chegam juntos
  saindo?: boolean; // true durante o fade-out, antes da remoção de fato
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

// Atraso de entrada cresce com quantos toasts já estão na tela (limitado, pra
// não deixar o último de uma leva grande demorando demais pra aparecer).
const ATRASO_ENTRADA_MS = 150;
const MAX_ESCALONADO = 5;
// Precisa bater com a transição de `.toast--saindo` em app.css.
const DURACAO_SAIDA_MS = 250;

function calcularAtraso(tamanhoAtual: number): number {
  return Math.min(tamanhoAtual, MAX_ESCALONADO) * ATRASO_ENTRADA_MS;
}

export const useToasts = create<EstadoToasts>((set, get) => {
  // Depois do tempo visível, entra em fade-out; só remove de fato ao final da
  // transição — evita que uma leva inteira suma no mesmo instante.
  function agendarSaida(id: string, duracaoVisivelMs: number) {
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.map((t) => (t.id === id ? { ...t, saindo: true } : t)) }));
      setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), DURACAO_SAIDA_MS);
    }, duracaoVisivelMs);
  }

  return {
    toasts: [],
    adicionar: (t) => {
      const id = idUnico();
      const atrasoEntrada = calcularAtraso(get().toasts.length);
      set((s) => ({ toasts: [...s.toasts, { ...t, id, tipo: 'captura', atrasoEntrada }] }));
      agendarSaida(id, 6000);
    },
    adicionarErro: (mensagem) => {
      const id = idUnico();
      const atrasoEntrada = calcularAtraso(get().toasts.length);
      set((s) => ({ toasts: [...s.toasts, { id, tipo: 'erro', mensagem, atrasoEntrada }] }));
      agendarSaida(id, 8000);
    },
    adicionarAviso: (mensagem) => {
      const id = idUnico();
      const atrasoEntrada = calcularAtraso(get().toasts.length);
      set((s) => ({ toasts: [...s.toasts, { id, tipo: 'aviso', mensagem, atrasoEntrada }] }));
      agendarSaida(id, 8000);
    },
    remover: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
  };
});
