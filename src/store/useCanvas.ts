// Estado central (Zustand) do canvas: campos escalares (núcleo tipado), investimentos
// (lista tipada) e observações (balde aberto). Precedência: correção de voz trava o
// campo; auto-fill nunca sobrescreve campo travado. Persistido em localStorage.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ROTULOS } from '../domain/registro';

export type Origem = 'manual' | 'auto' | 'correcao';

export interface Investimento {
  nome: string;
  valor: number;
}

export interface Observacao {
  id: string;
  categoria: string; // SecaoChave (string para não acoplar o balde ao enum rígido)
  chave: string; // rótulo curto do que foi observado ("gosta de futebol", "pet")
  valor: string; // detalhe ("torce pro Flamengo", "cachorro chamado Bob")
}

export interface CapturaLog {
  id: string;
  campo: string;
  rotulo: string;
  valorAnterior: unknown;
  valorNovo: unknown;
  origem: Origem;
  timestamp: number;
}

interface EstadoCanvasStore {
  dados: Record<string, unknown>;
  investimentos: Investimento[];
  observacoes: Observacao[];
  travados: Record<string, boolean>;
  log: CapturaLog[];
  sessaoIniciada: boolean;
  campoEmDestaque: string | null;
  statusFase: string;

  iniciarSessao: () => void;
  encerrarSessao: () => void;
  setStatusFase: (fase: string) => void;

  setCampo: (campo: string, valor: unknown, origem?: Origem) => string | null;
  limparDestaque: () => void;

  addInvestimento: (inv: Investimento) => void;
  addObservacao: (obs: Omit<Observacao, 'id'>) => void;

  desfazer: (id: string) => void;
  limparTudo: () => void;
}

function idUnico(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useCanvas = create<EstadoCanvasStore>()(
  persist(
    (set, get) => ({
      dados: {},
      investimentos: [],
      observacoes: [],
      travados: {},
      log: [],
      sessaoIniciada: false,
      campoEmDestaque: null,
      statusFase: 'Pronto para ouvir',

      iniciarSessao: () => set({ sessaoIniciada: true, statusFase: 'Coletando dados…' }),
      encerrarSessao: () => set({ sessaoIniciada: false, statusFase: 'Sessão encerrada' }),
      setStatusFase: (fase) => set({ statusFase: fase }),

      setCampo: (campo, valor, origem = 'manual') => {
        const { dados, travados, log } = get();
        if (origem === 'auto' && travados[campo]) return null;

        const valorAnterior = dados[campo];
        if (Object.is(valorAnterior, valor)) {
          set({ campoEmDestaque: campo });
          return null;
        }

        const id = idUnico();
        const entrada: CapturaLog = {
          id,
          campo,
          rotulo: ROTULOS[campo] ?? campo,
          valorAnterior,
          valorNovo: valor,
          origem,
          timestamp: Date.now(),
        };
        set({
          dados: { ...dados, [campo]: valor },
          travados: origem === 'correcao' ? { ...travados, [campo]: true } : travados,
          log: [entrada, ...log],
          campoEmDestaque: campo,
        });
        return id;
      },

      limparDestaque: () => set({ campoEmDestaque: null }),

      addInvestimento: (inv) =>
        set((s) => ({ investimentos: [...s.investimentos, inv] })),

      addObservacao: (obs) =>
        set((s) => ({ observacoes: [...s.observacoes, { ...obs, id: idUnico() }] })),

      desfazer: (id) => {
        const { dados, log, travados } = get();
        const entrada = log.find((e) => e.id === id);
        if (!entrada) return;
        const novosTravados = { ...travados };
        if (entrada.origem === 'correcao') delete novosTravados[entrada.campo];
        set({
          dados: { ...dados, [entrada.campo]: entrada.valorAnterior },
          travados: novosTravados,
          log: log.filter((e) => e.id !== id),
          campoEmDestaque: entrada.campo,
        });
      },

      limparTudo: () =>
        set({
          dados: {},
          investimentos: [],
          observacoes: [],
          travados: {},
          log: [],
          campoEmDestaque: null,
          sessaoIniciada: false,
        }),
    }),
    {
      name: 'diagnostico-canva',
      partialize: (s) => ({
        dados: s.dados,
        investimentos: s.investimentos,
        observacoes: s.observacoes,
        travados: s.travados,
        log: s.log,
      }),
    },
  ),
);
