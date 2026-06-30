// Canvas ao vivo: barra de status + microfone, 5 cartões de seção que se preenchem
// durante a conversa, e o painel de transcrição. O motor de extração roda via useOrquestrador.
import { useFala } from '../speech/falaStore';
import { useCanvas } from '../store/useCanvas';
import { useOrquestrador } from '../extraction/orquestrador';
import { SECOES, camposDaSecao, type SecaoChave } from '../domain/registro';
import { patrimonioLiquido, completudePorSecao } from '../domain/agregacao';
import { moeda } from './format';
import { Card, CardEyebrow, CardTitle } from '@ds/components/Card';
import { Button } from '@ds/components/Button';
import { Badge } from '@ds/components/Badge';
import { Icon } from '@ds/components/Icon';
import type { IconName } from '@ds/components/Icon';

const ICONE_SECAO: Record<SecaoChave, IconName> = {
  pessoa: 'user',
  dependentes: 'users',
  sonhos: 'flag',
  financas: 'coins',
  suitability: 'activity',
};

function BarraStatus() {
  const statusFase = useCanvas((s) => s.statusFase);
  const ativo = useFala((s) => s.ativo);
  const iniciar = useFala((s) => s.iniciar);
  const parar = useFala((s) => s.parar);
  const limparFala = useFala((s) => s.limpar);
  const limparTudo = useCanvas((s) => s.limparTudo);

  return (
    <div className="statusbar no-print">
      <div className="statusbar__group">
        <Badge tone={ativo ? 'attention' : 'neutral'} dot>
          {ativo ? 'OUVINDO' : 'PAUSADO'}
        </Badge>
        <span className="statusbar__fase">{statusFase}</span>
      </div>
      <div className="statusbar__group">
        <Button size="sm" onClick={() => (ativo ? parar() : iniciar())}>
          {ativo ? 'Pausar' : 'Retomar'} microfone
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            if (confirm('Limpar todos os dados e a transcrição?')) {
              limparTudo();
              limparFala();
            }
          }}
        >
          Limpar tudo
        </Button>
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

  const preenchido = (chave: string) => {
    const v = dados[chave];
    return v !== undefined && v !== '' && v !== null;
  };
  // "Em formação" = a seção ainda não tem nada captado. Cada fonte é escopada à
  // seção: campos tipados, investimentos (só em finanças) e observações (já
  // filtradas por seção na linha acima).
  const algumPreenchido =
    campos.some((c) => preenchido(c.chave)) ||
    (secao === 'financas' && investimentos.length > 0) ||
    observacoes.length > 0;

  return (
    <Card as="section" elevation={1} padding="md" forming={!algumPreenchido}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--uf-space-xs)' }}>
        <Icon name={ICONE_SECAO[secao]} size={18} />
        <CardTitle>{meta.titulo}</CardTitle>
      </div>
      <p className="muted" style={{ marginBottom: 'var(--uf-space-sm)' }}>{meta.descricao}</p>

      <dl className="field-list">
        {campos.map((c) => {
          const v = dados[c.chave];
          const ok = preenchido(c.chave);
          const txt =
            typeof v === 'boolean' ? (v ? 'Sim' : 'Não')
            : c.tipo === 'moeda' && typeof v === 'number' ? moeda(v)
            : ok ? String(v) : '—';
          return (
            <div
              key={c.chave}
              className={`field-row${destaque === c.chave ? ' is-highlight' : ''}`}
            >
              <dt className="field-row__label">{c.rotulo}</dt>
              <dd className={`field-row__value${ok ? '' : ' is-empty'}`}>{txt}</dd>
            </div>
          );
        })}
      </dl>

      {/* Investimentos (lista tipada) na seção finanças */}
      {secao === 'financas' && (
        <div className="card-block">
          <p className="uf-overline" style={{ marginBottom: 'var(--uf-space-2xs)' }}>Investimentos</p>
          {investimentos.length === 0 ? (
            <p className="muted">—</p>
          ) : (
            <ul className="invest-list">
              {investimentos.map((i, n) => (
                <li key={n} className="invest-row">
                  <span>{i.nome}</span>
                  <strong>{moeda(i.valor)}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Balde (observações da seção) */}
      {observacoes.length > 0 && (
        <div className="card-block chips">
          {observacoes.map((o) => (
            <Badge key={o.id} tone="neutral">
              {o.chave}{o.valor ? `: ${o.valor}` : ''}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}

function ResumoFinanceiro() {
  const estado = useCanvas((s) => ({ dados: s.dados, investimentos: s.investimentos, observacoes: s.observacoes }));
  const pl = patrimonioLiquido(estado);
  const completude = completudePorSecao(estado);
  const totalPreench = completude.reduce((s, c) => s + c.preenchidos, 0);
  const totalCampos = completude.reduce((s, c) => s + c.total, 0);
  const pct = totalCampos ? (totalPreench / totalCampos) * 100 : 0;

  return (
    <div className="summary">
      <p className="uf-overline">Patrimônio líquido</p>
      <p className="uf-title-2 summary__value">{moeda(pl)}</p>
      <p className="summary__hint">investimentos + imóveis + reserva − dívidas</p>
      <div className="summary__meter">
        <p className="summary__hint" id="coleta-label">Coleta: {totalPreench}/{totalCampos} campos</p>
        <div
          className="summary__track"
          role="progressbar"
          aria-labelledby="coleta-label"
          aria-valuenow={totalPreench}
          aria-valuemin={0}
          aria-valuemax={totalCampos}
        >
          <div className="summary__fill" style={{ width: `${pct}%` }} />
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
    <Card elevation={1} padding="md">
      <CardEyebrow icon={<Icon name="waveform" size={14} />}>Transcrição</CardEyebrow>
      <div className="transcript__lines" style={{ marginTop: 'var(--uf-space-xs)' }}>
        {ultimas.map((l, i) => <p key={i}>{l}</p>)}
        {interim && <p className="is-interim">{interim}…</p>}
        {ultimas.length === 0 && !interim && <p className="is-empty">Aguardando a conversa…</p>}
      </div>
    </Card>
  );
}

export function Canvas() {
  useOrquestrador(); // liga o motor de extração à transcrição

  return (
    <div className="canvas">
      <BarraStatus />
      <div className="canvas__grid">
        <div className="canvas__cards">
          {SECOES.map((s) => <CartaoSecao key={s.chave} secao={s.chave} />)}
        </div>
        <div className="canvas__side">
          <ResumoFinanceiro />
          <PainelTranscricao />
        </div>
      </div>
    </div>
  );
}
