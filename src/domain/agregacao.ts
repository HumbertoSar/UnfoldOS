// Agregações simples do canvas. Sem "score" ainda — só coleta de dados (fase atual).
// Quando os diagnósticos forem desenhados, é aqui que entram (e o registry diz quais
// campos existem). Por enquanto: patrimônio líquido + completude por seção.
import { SECOES, camposDaSecao, type SecaoChave } from './registro';
import type { Investimento, Observacao } from '../store/useCanvas';

export interface EstadoCanvas {
  dados: Record<string, unknown>;
  investimentos: Investimento[];
  observacoes: Observacao[];
}

// Patrimônio líquido = investimentos + imóveis + reserva − dívidas.
export function patrimonioLiquido(e: EstadoCanvas): number {
  const num = (chave: string): number => {
    const v = e.dados[chave];
    return typeof v === 'number' ? v : 0;
  };
  const investido = e.investimentos.reduce((s, i) => s + (Number(i.valor) || 0), 0);
  return investido + num('imoveis') + num('reservaEmergencia') - num('dividas');
}

export interface CompletudeSecao {
  secao: SecaoChave;
  titulo: string;
  preenchidos: number;
  total: number;
}

// Quantos campos tipados de cada seção já foram captados (investimentos e o balde
// contam como "+1 preenchido" na sua seção quando têm ao menos um item).
export function completudePorSecao(e: EstadoCanvas): CompletudeSecao[] {
  return SECOES.map((s) => {
    const campos = camposDaSecao(s.chave);
    let preenchidos = campos.filter((c) => {
      const v = e.dados[c.chave];
      return v !== undefined && v !== '' && v !== null;
    }).length;
    let total = campos.length;

    if (s.chave === 'financas') {
      total += 1;
      if (e.investimentos.length > 0) preenchidos += 1;
    }
    // O balde alimenta qualquer seção: se há observação da seção, conta como sinal de coleta.
    const temObs = e.observacoes.some((o) => o.categoria === s.chave);
    if (campos.length === 0) {
      total += 1;
      if (temObs) preenchidos += 1;
    }

    return { secao: s.chave, titulo: s.titulo, preenchidos, total };
  });
}
