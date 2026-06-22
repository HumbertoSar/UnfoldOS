// Canvas ao vivo: barra de status + microfone, 5 cartões de seção que se preenchem
// durante a conversa, e o painel de transcrição. O motor de extração roda via useOrquestrador.
import { useFala } from '../speech/falaStore';
import { useCanvas } from '../store/useCanvas';
import { useOrquestrador } from '../extraction/orquestrador';
import { SECOES, camposDaSecao, type SecaoChave } from '../domain/registro';
import { patrimonioLiquido, completudePorSecao } from '../domain/agregacao';
import { moeda } from './format';

function BarraStatus() {
  const statusFase = useCanvas((s) => s.statusFase);
  const ativo = useFala((s) => s.ativo);
  const iniciar = useFala((s) => s.iniciar);
  const parar = useFala((s) => s.parar);
  const limparFala = useFala((s) => s.limpar);
  const limparTudo = useCanvas((s) => s.limparTudo);

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-6 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${ativo ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
          <span className={`h-2 w-2 rounded-full ${ativo ? 'animate-pulse bg-rose-600' : 'bg-slate-400'}`} />
          {ativo ? 'OUVINDO' : 'PAUSADO'}
        </span>
        <span className="text-sm text-slate-600">{statusFase}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => (ativo ? parar() : iniciar())}
          className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-aco"
        >
          {ativo ? 'Pausar' : 'Retomar'} microfone
        </button>
        <button
          onClick={() => { if (confirm('Limpar todos os dados e a transcrição?')) { limparTudo(); limparFala(); } }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          Limpar tudo
        </button>
      </div>
    </div>
  );
}

function CartaoSecao({ secao }: { secao: SecaoChave }) {
  const meta = SECOES.find((s) => s.chave === secao)!;
  const dados = useCanvas((s) => s.dados);
  const investimentos = useCanvas((s) => s.investimentos);
  const observacoes = useCanvas((s) => s.observacoes).filter((o) => o.categoria === secao);
  const destaque = useCanvas((s) => s.campoEmDestaque);
  const campos = camposDaSecao(secao);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-3">
        <h2 className="font-grotesk text-lg font-bold text-navy">{meta.titulo}</h2>
        <p className="text-xs text-slate-400">{meta.descricao}</p>
      </header>

      <dl className="space-y-1.5">
        {campos.map((c) => {
          const v = dados[c.chave];
          const preenchido = v !== undefined && v !== '' && v !== null;
          const txt =
            typeof v === 'boolean' ? (v ? 'Sim' : 'Não')
            : c.tipo === 'moeda' && typeof v === 'number' ? moeda(v)
            : preenchido ? String(v) : '—';
          return (
            <div
              key={c.chave}
              className={`flex justify-between gap-3 rounded px-2 py-1 text-sm transition ${destaque === c.chave ? 'bg-amber-100' : ''}`}
            >
              <dt className="text-slate-500">{c.rotulo}</dt>
              <dd className={preenchido ? 'font-medium text-slate-900' : 'text-slate-300'}>{txt}</dd>
            </div>
          );
        })}
      </dl>

      {/* Investimentos (lista tipada) na seção finanças */}
      {secao === 'financas' && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Investimentos</p>
          {investimentos.length === 0 ? (
            <p className="text-sm text-slate-300">—</p>
          ) : (
            <ul className="space-y-1">
              {investimentos.map((i, n) => (
                <li key={n} className="flex justify-between text-sm">
                  <span className="text-slate-600">{i.nome}</span>
                  <span className="font-medium">{moeda(i.valor)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Balde (observações da seção) */}
      {observacoes.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
          {observacoes.map((o) => (
            <span key={o.id} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
              {o.chave}{o.valor ? `: ${o.valor}` : ''}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

function ResumoFinanceiro() {
  const estado = useCanvas((s) => ({ dados: s.dados, investimentos: s.investimentos, observacoes: s.observacoes }));
  const pl = patrimonioLiquido(estado);
  const completude = completudePorSecao(estado);
  const totalPreench = completude.reduce((s, c) => s + c.preenchidos, 0);
  const totalCampos = completude.reduce((s, c) => s + c.total, 0);

  return (
    <div className="rounded-2xl bg-navy p-5 text-white shadow-sm">
      <p className="text-xs uppercase tracking-widest text-white/60">Patrimônio líquido</p>
      <p className="font-grotesk text-3xl font-bold">{moeda(pl)}</p>
      <p className="mt-1 text-xs text-white/50">investimentos + imóveis + reserva − dívidas</p>
      <div className="mt-4 border-t border-white/15 pt-3">
        <p className="text-xs text-white/60">Coleta: {totalPreench}/{totalCampos} campos</p>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-pulse" style={{ width: `${totalCampos ? (totalPreench / totalCampos) * 100 : 0}%` }} />
        </div>
      </div>
    </div>
  );
}

function PainelTranscricao() {
  const interim = useFala((s) => s.interim);
  const linhas = useFala((s) => s.linhas);
  const ultimas = linhas.slice(-6);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Transcrição</p>
      <div className="space-y-1 text-sm text-slate-500">
        {ultimas.map((l, i) => <p key={i}>{l}</p>)}
        {interim && <p className="italic text-slate-400">{interim}…</p>}
        {ultimas.length === 0 && !interim && <p className="text-slate-300">Aguardando a conversa…</p>}
      </div>
    </div>
  );
}

export function Canvas() {
  useOrquestrador(); // liga o motor de extração à transcrição

  return (
    <div className="pb-12">
      <BarraStatus />
      <div className="mx-auto grid max-w-6xl gap-4 px-6 py-6 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
          {SECOES.map((s) => <CartaoSecao key={s.chave} secao={s.chave} />)}
        </div>
        <div className="space-y-4">
          <ResumoFinanceiro />
          <PainelTranscricao />
        </div>
      </div>
    </div>
  );
}
