// Canvas ao vivo (Fase 3): barra de status + microfone fixos no topo e uma
// canvas infinita onde cada seção é um nó arrastável que se preenche durante a
// conversa. O motor de extração roda via useOrquestrador.
import { useState, useEffect, useRef } from 'react';
import { useFala } from '../speech/falaStore';
import { useCanvas } from '../store/useCanvas';
import { useOrquestrador } from '../extraction/orquestrador';
import { SECOES, camposDaSecao, type SecaoChave } from '../domain/registro';
import { patrimonioLiquido, completudePorSecao, secaoTemAlgumDado } from '../domain/agregacao';
import type { EstadoCanvas } from '../domain/agregacao';
import { moeda } from './format';
import { Card, CardEyebrow, CardTitle } from '@ds/components/Card';
import { Button } from '@ds/components/Button';
import { Badge } from '@ds/components/Badge';
import { Icon } from '@ds/components/Icon';
import type { IconName } from '@ds/components/Icon';
import { ConfidenceMeter } from '@ds/components/ConfidenceMeter';
import { Minimap } from '@ds/components/Minimap';
import type { MinimapNode } from '@ds/components/Minimap';
import { ZoomControls } from '@ds/components/ZoomControls';
import { InfiniteCanvas } from '@ds/canvas/InfiniteCanvas';
import { UnfoldCard } from '@ds/canvas/UnfoldCard';
import { useCanvasViewport } from '@ds/canvas/useCanvasViewport';

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
  const observacoesTodas = useCanvas((s) => s.observacoes);
  const observacoes = observacoesTodas.filter((o) => o.categoria === secao);
  const destaque = useCanvas((s) => s.campoEmDestaque);
  const campos = camposDaSecao(secao);

  const preenchido = (chave: string) => {
    const v = dados[chave];
    return v !== undefined && v !== '' && v !== null;
  };
  // "Em formação" = a seção ainda não tem nada captado.
  const algumPreenchido = secaoTemAlgumDado(secao, { dados, investimentos, observacoes: observacoesTodas });

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

// --- Canvas infinita ------------------------------------------------------

// "Mundo" lógico onde os nós vivem (usado para projetar o viewport no minimapa).
const WORLD = { w: 1280, h: 1000 };
const VIEW_INICIAL = { scale: 0.85 };
// Centro do card "pessoa" (hub do layout radial) — usado pra centralizar a
// viewport nele assim que o palco é medido, em vez de um pan fixo que só
// funciona pra um tamanho de tela.
const CENTRO_MUNDO = { x: 640, y: 480 };

interface NoPos {
  id: string;
  x: number;
  y: number;
  w: number;
  delay: number; // atraso da animação de desdobramento (cascata)
  tone: MinimapNode['tone'];
}

// "pessoa" é o centro de tudo: fica no meio da canvas, e os outros 6 cards se
// desdobram ao redor dele (layout radial). "pessoa" e "transcricao" entram
// juntos ao apertar Começar; os demais entram cada um no seu momento — quando a
// seção captar o primeiro dado — com um leve atraso crescente entre eles pra
// dar a sensação de cascata se abrindo a partir do centro.
const NOS_INICIAIS: NoPos[] = [
  { id: 'pessoa', x: 490, y: 395, w: 300, delay: 0, tone: 'primary' },
  { id: 'sonhos', x: 490, y: 110, w: 300, delay: 60, tone: 'primary' },
  { id: 'financas', x: 799, y: 200, w: 340, delay: 120, tone: 'positive' },
  { id: 'patrimonio', x: 819, y: 550, w: 300, delay: 240, tone: 'positive' },
  { id: 'transcricao', x: 470, y: 700, w: 340, delay: 120, tone: 'neutral' },
  { id: 'suitability', x: 161, y: 530, w: 300, delay: 180, tone: 'attention' },
  { id: 'dependentes', x: 161, y: 260, w: 300, delay: 0, tone: 'neutral' },
];

function conteudoNo(id: string) {
  if (id === 'patrimonio') return <ResumoFinanceiro />;
  if (id === 'transcricao') return <PainelTranscricao />;
  return <CartaoSecao secao={id as SecaoChave} />;
}

// Revelação progressiva: "pessoa" e "transcricao" entram ao apertar Começar;
// os demais só quando a seção correspondente captar o primeiro dado.
// "patrimonio" segue "financas", já que resume os mesmos campos.
function noVisivel(id: string, capturaIniciada: boolean, estado: EstadoCanvas): boolean {
  if (!capturaIniciada) return false;
  if (id === 'pessoa' || id === 'transcricao') return true;
  const secao = id === 'patrimonio' ? 'financas' : (id as SecaoChave);
  return secaoTemAlgumDado(secao, estado);
}

// Percentual geral de coleta (alimenta o ConfidenceMeter do overlay).
function usePctColeta() {
  const estado = useCanvas((s) => ({ dados: s.dados, investimentos: s.investimentos, observacoes: s.observacoes }));
  const completude = completudePorSecao(estado);
  const preench = completude.reduce((s, c) => s + c.preenchidos, 0);
  const total = completude.reduce((s, c) => s + c.total, 0);
  return total ? Math.round((preench / total) * 100) : 0;
}

export function Canvas() {
  useOrquestrador(); // liga o motor de extração à transcrição
  const vp = useCanvasViewport(VIEW_INICIAL);
  const [nos, setNos] = useState<NoPos[]>(NOS_INICIAIS);
  const [size, setSize] = useState({ w: 1000, h: 600 });
  const pct = usePctColeta();

  const capturaIniciada = useCanvas((s) => s.capturaIniciada);
  const iniciarCaptura = useCanvas((s) => s.iniciarCaptura);
  const iniciarFala = useFala((s) => s.iniciar);
  const estado = useCanvas((s) => ({ dados: s.dados, investimentos: s.investimentos, observacoes: s.observacoes }));
  const nosVisiveis = nos.filter((n) => noVisivel(n.id, capturaIniciada, estado));

  // Mede o palco para projetar o retângulo do viewport no minimapa e, na
  // primeira medição, centraliza a viewport no hub ("pessoa") — funciona pra
  // qualquer tamanho de tela, ao contrário de um pan fixo.
  const centralizouRef = useRef(false);
  useEffect(() => {
    const el = vp.containerRef.current;
    if (!el) return;
    const medir = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      setSize({ w, h });
      if (!centralizouRef.current && w > 0 && h > 0) {
        centralizouRef.current = true;
        vp.setViewport((atual) => ({
          ...atual,
          x: w / 2 - CENTRO_MUNDO.x * atual.scale,
          y: h / 2 - CENTRO_MUNDO.y * atual.scale,
        }));
      }
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [vp.containerRef, vp.setViewport]);

  const mover = (id: string, x: number, y: number) =>
    setNos((ns) => ns.map((n) => (n.id === id ? { ...n, x, y } : n)));

  // Viewport e nós em coordenadas normalizadas (0–1) do "mundo", para o minimapa.
  const view = {
    x: -vp.viewport.x / vp.viewport.scale / WORLD.w,
    y: -vp.viewport.y / vp.viewport.scale / WORLD.h,
    w: size.w / vp.viewport.scale / WORLD.w,
    h: size.h / vp.viewport.scale / WORLD.h,
  };
  const miniNodes: MinimapNode[] = nosVisiveis.map((n) => ({
    x: n.x / WORLD.w,
    y: n.y / WORLD.h,
    w: n.w / WORLD.w,
    h: 0.14,
    tone: n.tone,
  }));

  const overlay = (
    <>
      <div className="canvas-ov-meter">
        <ConfidenceMeter value={pct} label="Coleta da conversa" caption={`${pct}% mapeado`} />
      </div>
      <div className="canvas-ov-minimap">
        <Minimap nodes={miniNodes} viewport={view} />
      </div>
      <div className="canvas-ov-zoom">
        <ZoomControls
          zoom={vp.viewport.scale * 100}
          onZoomIn={vp.zoomIn}
          onZoomOut={vp.zoomOut}
          onReset={vp.reset}
        />
      </div>
      <div className="canvas-ov-hint">
        <Icon name="recenter" size={14} />
        Arraste os cards · arraste o fundo para mover · Ctrl/⌘ + scroll para zoom
      </div>
    </>
  );

  return (
    <div className="canvas-screen">
      <BarraStatus />
      <div className="canvas-stage">
        <InfiniteCanvas
          className="canvas-stage__canvas"
          viewport={vp.viewport}
          containerRef={vp.containerRef}
          bind={vp.bind}
          isPanning={vp.isPanning}
          overlay={capturaIniciada ? overlay : undefined}
        >
          {nosVisiveis.map((n) => (
            <UnfoldCard
              key={n.id}
              x={n.x}
              y={n.y}
              width={n.w}
              scale={vp.viewport.scale}
              draggable
              onMove={(x, y) => mover(n.id, x, y)}
              unfoldDelay={n.delay}
            >
              {conteudoNo(n.id)}
            </UnfoldCard>
          ))}
        </InfiniteCanvas>
        {!capturaIniciada && (
          <div className="canvas-ov-start">
            <Button
              size="lg"
              onClick={() => {
                iniciarCaptura();
                iniciarFala();
              }}
              trailingIcon={<Icon name="arrow-right" size={18} />}
            >
              Começar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
