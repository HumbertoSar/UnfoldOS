// Cliente do endpoint de extração (/api/extract). Front fala só com /api.
export interface UpdateExtraido {
  field: string; // chave do registry (núcleo tipado)
  value: number | string | boolean;
  confidence: number;
  evidence: string;
}

export interface InvestimentoExtraido {
  nome: string;
  valor: number;
  confidence: number;
  evidence: string;
}

// Item do BALDE — qualquer coisa sem campo tipado (paixões, sonhos, pets, contexto).
export interface ObservacaoExtraida {
  categoria: string; // seção a que pertence
  chave: string; // rótulo curto
  valor: string; // detalhe
  tipoInteresse?: string; // TipoInteresse — só quando é uma "paixão" divertida
  confidence: number;
  evidence: string;
}

export interface ResultadoExtracao {
  updates: UpdateExtraido[];
  investimentos: InvestimentoExtraido[];
  observacoes: ObservacaoExtraida[];
}

export type ModoExtracao = 'captura' | 'correcao';

const TIMEOUT_PADRAO_MS = 15000;

export async function extrair(
  trecho: string,
  contextoAnterior: string,
  estadoAtual: Record<string, unknown>,
  modo: ModoExtracao,
  timeoutMs: number = TIMEOUT_PADRAO_MS,
): Promise<ResultadoExtracao> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const resp = await fetch('/api/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trecho, contextoAnterior, estadoAtual, modo }),
      signal: ctrl.signal,
    });
    if (!resp.ok) throw new Error(`extração falhou: HTTP ${resp.status}`);
    const d = (await resp.json()) as Partial<ResultadoExtracao>;
    return {
      updates: Array.isArray(d.updates) ? d.updates : [],
      investimentos: Array.isArray(d.investimentos) ? d.investimentos : [],
      observacoes: Array.isArray(d.observacoes) ? d.observacoes : [],
    };
  } finally {
    clearTimeout(timer);
  }
}
