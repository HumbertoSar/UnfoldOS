// Saúde do proxy de extração (/api/health). Distingue três situações que, sem isso,
// caem todas no mesmo toast genérico de "falha na extração":
//   - online   : servidor no ar e com chave → extração funciona;
//   - offline  : nada respondendo na /api (proxy não está rodando);
//   - sem-chave: servidor no ar, mas sem OPENROUTER_API_KEY no .env.
import { create } from 'zustand';

export type StatusServidor = 'desconhecido' | 'verificando' | 'online' | 'offline' | 'sem-chave';

interface EstadoSaude {
  status: StatusServidor;
  modelo: string | null;
  verificar: () => Promise<void>;
}

const TIMEOUT_MS = 4000;

export const useSaudeServidor = create<EstadoSaude>((set, get) => ({
  status: 'desconhecido',
  modelo: null,

  verificar: async () => {
    if (get().status === 'desconhecido') set({ status: 'verificando' });
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const resp = await fetch('/api/health', { signal: ctrl.signal });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const dados = (await resp.json()) as { ok?: boolean; temChave?: boolean; modelo?: string };
      set({
        status: dados.ok && dados.temChave ? 'online' : 'sem-chave',
        modelo: dados.modelo ?? null,
      });
    } catch {
      // Conexão recusada, timeout ou resposta inválida → proxy fora do ar.
      set({ status: 'offline' });
    } finally {
      clearTimeout(timer);
    }
  },
}));
