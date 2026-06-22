// Coerção de valores vindos da IA para o tipo certo do campo (definido no registry).
// Garante número/inteiro/booleano/enum/texto conforme TipoCampo. Devolve undefined
// quando não dá para coagir com segurança (o orquestrador descarta o update).
import { DEF_POR_CHAVE, type TipoCampo } from './registro';

export type ValorCoagido = number | string | boolean;

function paraNumero(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    // Aceita formatos pt-BR: "1.600.000", "1600000,50", "R$ 200 mil" já normalizado pela IA.
    const limpo = v.replace(/[R$\s]/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.');
    const n = Number(limpo);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function paraBooleano(v: unknown): boolean | undefined {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase();
    if (['true', 'sim', 's', 'verdadeiro'].includes(s)) return true;
    if (['false', 'não', 'nao', 'n', 'falso'].includes(s)) return false;
  }
  return undefined;
}

export function coagirValor(chave: string, valor: unknown): ValorCoagido | undefined {
  const def = DEF_POR_CHAVE[chave];
  if (!def) return undefined;
  const tipo: TipoCampo = def.tipo;

  switch (tipo) {
    case 'moeda':
    case 'numero': {
      return paraNumero(valor);
    }
    case 'inteiro': {
      const n = paraNumero(valor);
      return n === undefined ? undefined : Math.round(n);
    }
    case 'booleano': {
      return paraBooleano(valor);
    }
    case 'enum': {
      const s = String(valor).trim().toLowerCase();
      return def.opcoes?.includes(s) ? s : undefined;
    }
    case 'texto':
    default: {
      const s = String(valor).trim();
      return s === '' ? undefined : s;
    }
  }
}
