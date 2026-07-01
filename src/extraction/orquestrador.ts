// Orquestrador de extração: acumula trechos finais, debounce ~2,5s, envia trecho novo
// + snapshot ao /api/extract e aplica updates (confidence ≥ 0,7) + investimentos + balde.
// Detecta "Altere/Corrige" no início da fala → modo correção (trava o campo).
import { useEffect, useRef } from 'react';
import { useFala } from '../speech/falaStore';
import { useCanvas } from '../store/useCanvas';
import { useToasts } from '../store/useToasts';
import { useBaloes } from '../store/useBaloes';
import { useSaudeServidor } from '../store/useSaudeServidor';
import { CHAVES_ESCALARES, ROTULOS } from '../domain/registro';
import { coagirValor } from '../domain/coercao';
import { infoInteresse, detectarTimeCarioca } from '../domain/interesses';
import {
  extrair,
  type ModoExtracao,
  type UpdateExtraido,
  type InvestimentoExtraido,
  type ObservacaoExtraida,
} from './cliente';
import { registrarEvento } from './registroEventos';
import { moeda } from '../ui/format';

const GATILHOS_CORRECAO = ['altere', 'altera', 'corrige', 'corrigir', 'corrija', 'muda', 'mude'];
const LIMIAR_CONFIANCA = 0.7;
const DEBOUNCE_MS = 2500;

export function ehCorrecao(segmento: string): boolean {
  const palavras = segmento.trim().toLowerCase().replace(/[,.;:!?]/g, '').split(/\s+/);
  return palavras.slice(0, 4).some((p) => GATILHOS_CORRECAO.includes(p));
}

function valorLegivel(v: number | string | boolean): string {
  if (typeof v === 'boolean') return v ? 'Sim' : 'Não';
  if (typeof v === 'number') return v.toLocaleString('pt-BR');
  return v;
}

// Snapshot enxuto do estado (só o preenchido) — para a IA não repetir.
function construirSnapshot(): Record<string, unknown> {
  const { dados, investimentos, observacoes } = useCanvas.getState();
  const snap: Record<string, unknown> = {};
  for (const chave of CHAVES_ESCALARES) {
    const v = dados[chave];
    if (v !== undefined && v !== '') snap[chave] = v;
  }
  if (investimentos.length > 0) {
    snap.investimentos = investimentos.map((i) => ({ nome: i.nome, valor: i.valor }));
  }
  if (observacoes.length > 0) {
    snap.observacoes = observacoes.map((o) => ({ categoria: o.categoria, chave: o.chave }));
  }
  return snap;
}

function aplicarUpdates(updates: UpdateExtraido[], modo: ModoExtracao): number {
  const { setCampo } = useCanvas.getState();
  const adicionar = useToasts.getState().adicionar;
  let aplicados = 0;

  for (const u of updates) {
    if (!CHAVES_ESCALARES.includes(u.field)) {
      registrarEvento('update_descartado', { motivo: 'campo_invalido', field: u.field });
      continue;
    }
    if (typeof u.confidence === 'number' && u.confidence < LIMIAR_CONFIANCA) {
      registrarEvento('update_descartado', { motivo: 'baixa_confianca', field: u.field, confidence: u.confidence });
      continue;
    }
    const valor = coagirValor(u.field, u.value);
    if (valor === undefined) {
      registrarEvento('update_descartado', { motivo: 'coercao_falhou', field: u.field, value: u.value });
      continue;
    }
    const origem = modo === 'correcao' ? 'correcao' : 'auto';
    const estavaTravado = Boolean(useCanvas.getState().travados[u.field]);
    const logId = setCampo(u.field, valor, origem);
    if (!logId) {
      if (origem === 'auto' && estavaTravado) {
        registrarEvento('update_bloqueado', { motivo: 'campo_travado', field: u.field, value: valor });
      }
      continue;
    }
    adicionar({
      rotulo: ROTULOS[u.field] ?? u.field,
      valor: valorLegivel(valor),
      campo: u.field,
      logId,
      correcao: modo === 'correcao',
    });
    aplicados++;
  }
  return aplicados;
}

function aplicarInvestimentos(itens: InvestimentoExtraido[]): number {
  const { addInvestimento } = useCanvas.getState();
  const adicionar = useToasts.getState().adicionar;
  let aplicados = 0;
  for (const it of itens) {
    if (!it.nome || typeof it.valor !== 'number') continue;
    if (typeof it.confidence === 'number' && it.confidence < LIMIAR_CONFIANCA) continue;
    addInvestimento({ nome: it.nome, valor: it.valor });
    adicionar({ rotulo: `Investimento — ${it.nome}`, valor: moeda(it.valor), correcao: false });
    registrarEvento('investimento_adicionado', { nome: it.nome, valor: it.valor });
    aplicados++;
  }
  return aplicados;
}

function aplicarObservacoes(itens: ObservacaoExtraida[]): number {
  const { addObservacao, observacoes } = useCanvas.getState();
  const adicionar = useToasts.getState().adicionar;
  const adicionarBalao = useBaloes.getState().adicionar;
  let aplicados = 0;
  for (const o of itens) {
    if (!o.chave) continue;
    if (typeof o.confidence === 'number' && o.confidence < LIMIAR_CONFIANCA) continue;
    // Dedup leve: não readiciona observação idêntica (mesma categoria+chave+valor).
    const jaExiste = observacoes.some(
      (x) => x.categoria === o.categoria && x.chave === o.chave && x.valor === (o.valor ?? ''),
    );
    if (jaExiste) continue;
    addObservacao({ categoria: o.categoria, chave: o.chave, valor: o.valor ?? '', tipoInteresse: o.tipoInteresse });
    adicionar({ rotulo: o.chave, valor: o.valor ?? '✓', correcao: false });
    registrarEvento('observacao_adicionada', { categoria: o.categoria, chave: o.chave, tipoInteresse: o.tipoInteresse });

    // Paixão detectada (futebol, viagem, filme/série, livro, arte, pet, natureza)
    // → balão que nasce do card "Quem é Você?". Futebol sem time ainda (a fala
    // foi cortada antes do nome do clube) não vira balão — evita um balão
    // "Torcedor(a)" vazio seguido de outro completo quando o resto da frase
    // chega no próximo trecho.
    const futebolSemTime = o.tipoInteresse === 'futebol' && !o.valor;
    if (o.tipoInteresse && !futebolSemTime) {
      const { emoji, texto } = infoInteresse(o.tipoInteresse);
      const time = o.tipoInteresse === 'futebol' ? detectarTimeCarioca(o.valor ?? '') : null;
      adicionarBalao({
        emoji,
        texto,
        detalhe: time?.nome ?? (o.valor || undefined),
        bandeira: time ? { corA: time.corA, corB: time.corB } : undefined,
      });
    }
    aplicados++;
  }
  return aplicados;
}

async function enviar(trecho: string, modo: ModoExtracao, contextoAnterior: string) {
  const { setStatusFase } = useCanvas.getState();
  setStatusFase(modo === 'correcao' ? 'Correção em tempo real…' : 'Analisando o que foi dito…');
  try {
    const { updates, investimentos, observacoes } = await extrair(
      trecho,
      contextoAnterior,
      construirSnapshot(),
      modo,
    );
    const aplicados =
      aplicarUpdates(updates, modo) + aplicarInvestimentos(investimentos) + aplicarObservacoes(observacoes);
    setStatusFase(
      aplicados > 0
        ? modo === 'correcao'
          ? 'Correção aplicada ✓'
          : 'Canvas atualizado ✓'
        : 'Ouvindo a conversa…',
    );
  } catch {
    setStatusFase('Falha na extração — verifique o servidor (/api)');
    useToasts.getState().adicionarErro('Falha na extração. Verifique o servidor.');
    void useSaudeServidor.getState().verificar();
  }
}

export function useOrquestrador() {
  const linhas = useFala((s) => s.linhas);
  const indiceRef = useRef(0);
  const bufferRef = useRef<string[]>([]);
  const contextoFlushRef = useRef('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (linhas.length <= indiceRef.current) {
      if (linhas.length < indiceRef.current) indiceRef.current = linhas.length;
      return;
    }
    const contexto = linhas.slice(Math.max(0, indiceRef.current - 2), indiceRef.current).join(' ');
    const novos = linhas.slice(indiceRef.current);
    indiceRef.current = linhas.length;

    for (const seg of novos) {
      if (ehCorrecao(seg)) {
        void enviar(seg, 'correcao', contexto);
      } else {
        if (bufferRef.current.length === 0) contextoFlushRef.current = contexto;
        bufferRef.current.push(seg);
      }
    }

    if (bufferRef.current.length > 0) {
      useCanvas.getState().setStatusFase('Coletando dados…');
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const trecho = bufferRef.current.join(' ').trim();
        const ctx = contextoFlushRef.current;
        bufferRef.current = [];
        contextoFlushRef.current = '';
        if (trecho) void enviar(trecho, 'captura', ctx);
      }, DEBOUNCE_MS);
    }
  }, [linhas]);
}
