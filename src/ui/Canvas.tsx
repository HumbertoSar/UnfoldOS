// Canvas ao vivo (Fase 3): barra de status + microfone fixos no topo e uma
// canvas infinita onde cada seção é um nó arrastável que se preenche durante a
// conversa. O motor de extração roda via useOrquestrador.
import { useState, useEffect, useRef } from 'react';
import { useFala } from '../speech/falaStore';
import { useCanvas } from '../store/useCanvas';
import { useBaloes } from '../store/useBaloes';
import { useOrquestrador } from '../extraction/orquestrador';
import { SECOES, camposDaSecao, type SecaoChave } from '../domain/registro';
import { patrimonioLiquido, completudePorSecao, secaoTemAlgumDado } from '../domain/agregacao';
import type { EstadoCanvas } from '../domain/agregacao';
import { PERGUNTAS_POR_SECAO } from '../domain/estimulos';
import { moeda } from './format';
import { Card, CardEyebrow, CardTitle } from '@ds/components/Card';
import { Button } from '@ds/components/Button';
import { Badge, ConfidenceDots } from '@ds/components/Badge';
import { Icon } from '@ds/components/Icon';
import type { IconName } from '@ds/components/Icon';
import { ConfidenceMeter } from '@ds/components/ConfidenceMeter';
import { Minimap } from '@ds/components/Minimap';
import type { MinimapNode } from '@ds/components/Minimap';
import { ZoomControls } from '@ds/components/ZoomControls';
import { Waveform } from '@ds/components/Waveform';
import { InfiniteCanvas } from '@ds/canvas/InfiniteCanvas';
import { UnfoldCard } from '@ds/canvas/UnfoldCard';
import { useCanvasViewport } from '@ds/canvas/useCanvasViewport';
import { BaloesInteresse } from './BaloesInteresse';
import { useDigitacao } from './useDigitacao';

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
  const limparBaloes = useBaloes((s) => s.limpar);

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
              limparBaloes();
            }
          }}
        >
          Limpar tudo
        </Button>
      </div>
    </div>
  );
}

// Bloco "Me diga:" (ver design_handoff_me_diga/5a-SPEC.md) — convite de fala
// com a próxima pergunta do tema sendo digitada, no rodapé de cards ainda em
// coleta. `lento` reduz bem o ritmo (Dependentes/Sonhos, quando já têm
// algum dado — não têm "completo" fixo, só desaceleram o convite).
function MeDiga({ secao, lento, ativo }: { secao: SecaoChave; lento: boolean; ativo: boolean }) {
  const indice = Math.max(0, SECOES.findIndex((s) => s.chave === secao));
  const texto = useDigitacao(PERGUNTAS_POR_SECAO[secao], indice * 220, lento);

  return (
    <div className="card-block me-diga">
      <div className="me-diga__rotulo">
        <span className="me-diga__diamante" aria-hidden="true" />
        Me diga:
      </div>
      <p className="me-diga__pergunta">
        {texto}
        <span className="me-diga__cursor" aria-hidden="true">_</span>
      </p>
      {ativo && (
        <div className="me-diga__ouvindo">
          <Waveform active bars={4} height={14} color="var(--uf-color-positive)" />
          ouvindo você…
        </div>
      )}
    </div>
  );
}

function CartaoSecao({ secao }: { secao: SecaoChave }) {
  const meta = SECOES.find((s) => s.chave === secao)!;
  const dados = useCanvas((s) => s.dados);
  const investimentos = useCanvas((s) => s.investimentos);
  const observacoesTodas = useCanvas((s) => s.observacoes);
  const observacoes = observacoesTodas.filter((o) => o.categoria === secao);
  // Em "pessoa", paixões (tipoInteresse) viram balão — não duplicam como chip.
  const observacoesExibidas = secao === 'pessoa' ? observacoes.filter((o) => !o.tipoInteresse) : observacoes;
  const destaque = useCanvas((s) => s.campoEmDestaque);
  const secaoAtiva = useCanvas((s) => s.secaoAtiva);
  const campos = camposDaSecao(secao);

  const preenchido = (chave: string) => {
    const v = dados[chave];
    return v !== undefined && v !== '' && v !== null;
  };
  // "Em formação" = a seção ainda não tem nada captado.
  const algumPreenchido = secaoTemAlgumDado(secao, { dados, investimentos, observacoes: observacoesTodas });

  // Completude só faz sentido pra seções com campos tipados (pessoa, finanças,
  // suitability) — dependentes/sonhos são balde aberto, sem um "total" fixo.
  const completude = completudePorSecao({ dados, investimentos, observacoes: observacoesTodas }).find(
    (c) => c.secao === secao,
  );
  const mostrarCompletude = campos.length > 0 && completude !== undefined;

  // "Me diga:" some quando a seção completa (campos tipados). Dependentes/Sonhos
  // são balde aberto — nunca completam, só desaceleram o convite quando já têm algo.
  const completo = mostrarCompletude ? completude!.preenchidos === completude!.total : false;

  return (
    <Card as="section" elevation={1} padding="md" forming={!algumPreenchido}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--uf-space-xs)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--uf-space-xs)' }}>
          <Icon name={ICONE_SECAO[secao]} size={18} />
          <CardTitle>{meta.titulo}</CardTitle>
        </div>
        {mostrarCompletude && (
          <ConfidenceDots
            level={completude.preenchidos}
            total={completude.total}
            label={`${completude.preenchidos} de ${completude.total} campos`}
            size={6}
          />
        )}
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

      {/* Balde (observações da seção) — em "pessoa", paixões (tipoInteresse) já
          aparecem como balão logo abaixo do card, então não repetimos aqui. */}
      {observacoesExibidas.length > 0 && (
        <div className="card-block chips">
          {observacoesExibidas.map((o) => (
            <Badge key={o.id} tone="neutral">
              {o.chave}{o.valor ? `: ${o.valor}` : ''}
            </Badge>
          ))}
        </div>
      )}

      {!completo && <MeDiga secao={secao} lento={algumPreenchido} ativo={secaoAtiva === secao} />}
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

// "pessoa" é o centro de tudo: fica no meio da canvas, e os outros 5 cards se
// desdobram ao redor dele (layout radial — "transcricao" virou overlay fixo,
// ver Canvas()). "pessoa" entra ao apertar Começar; os demais entram cada um
// no seu momento — quando a seção captar o primeiro dado. Os atrasos são bem
// espaçados (250ms+) de propósito: quando a IA capta várias seções de uma vez
// só (uma frase longa), os cards precisam continuar entrando um de cada vez.
const NOS_INICIAIS: NoPos[] = [
  { id: 'pessoa', x: 490, y: 395, w: 300, delay: 0, tone: 'primary' },
  { id: 'dependentes', x: 161, y: 260, w: 300, delay: 0, tone: 'neutral' },
  { id: 'sonhos', x: 490, y: 110, w: 300, delay: 250, tone: 'primary' },
  { id: 'suitability', x: 161, y: 530, w: 300, delay: 500, tone: 'attention' },
  { id: 'financas', x: 799, y: 200, w: 340, delay: 750, tone: 'positive' },
  { id: 'patrimonio', x: 819, y: 550, w: 300, delay: 1000, tone: 'positive' },
];

// Distância mínima entre cards e altura usada pra quem ainda não foi medido
// (primeiro render, antes do ResizeObserver reportar).
const GAP_MINIMO = 24;
const ALTURA_PADRAO = 180;

// Afasta cards que ficaram mais perto que o mínimo (um cresceu, ou um novo
// entrou por cima de outro) — de cima pra baixo, empurrando só pra baixo.
// Não decide QUANDO rodar (isso é do efeito em Canvas()) — só calcula o
// resultado dado o estado atual.
function afastarSobreposicoes(nos: NoPos[], alturas: Record<string, number>): Map<string, number> {
  const alturaDe = (id: string) => alturas[id] ?? ALTURA_PADRAO;
  const ordenados = [...nos].sort((a, b) => a.y - b.y || a.x - b.x);
  const colocados: NoPos[] = [];
  const resultado = new Map<string, number>();

  for (const n of ordenados) {
    let y = n.y;
    for (const outro of colocados) {
      const sobrepoeX = n.x < outro.x + outro.w + GAP_MINIMO && n.x + n.w + GAP_MINIMO > outro.x;
      if (!sobrepoeX) continue;
      const limite = outro.y + alturaDe(outro.id) + GAP_MINIMO;
      if (y < limite) y = limite;
    }
    colocados.push({ ...n, y });
    resultado.set(n.id, y);
  }
  return resultado;
}

function conteudoNo(id: string) {
  if (id === 'patrimonio') return <ResumoFinanceiro />;
  if (id === 'pessoa') {
    return (
      <>
        <CartaoSecao secao="pessoa" />
        <BaloesInteresse />
      </>
    );
  }
  return <CartaoSecao secao={id as SecaoChave} />;
}

// Revelação progressiva: "pessoa" entra ao apertar Começar; os demais só
// quando a seção correspondente captar o primeiro dado. "patrimonio" segue
// "financas", já que resume os mesmos campos.
function noVisivel(id: string, capturaIniciada: boolean, estado: EstadoCanvas): boolean {
  if (!capturaIniciada) return false;
  if (id === 'pessoa') return true;
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

  // Alturas reais (medidas ao vivo por cada UnfoldCard) e se algum está sendo
  // arrastado agora — o reflow abaixo nunca mexe em card sob arraste manual.
  const [alturas, setAlturas] = useState<Record<string, number>>({});
  const [arrastandoId, setArrastandoId] = useState<string | null>(null);
  const registrarAltura = (id: string, altura: number) =>
    setAlturas((atual) => (atual[id] === altura ? atual : { ...atual, [id]: altura }));

  // Reajusta posições só quando um card novo aparece, cresce, ou um arraste
  // termina — nunca continuamente, pra não brigar com um posicionamento manual.
  const idsVisiveis = nosVisiveis.map((n) => n.id).join(',');
  const alturasChave = JSON.stringify(alturas);
  useEffect(() => {
    if (arrastandoId) return;
    const alvo = afastarSobreposicoes(nosVisiveis, alturas);
    setNos((atual) => {
      let mudou = false;
      const proximo = atual.map((n) => {
        const novoY = alvo.get(n.id);
        if (novoY === undefined || Math.abs(novoY - n.y) < 1) return n;
        mudou = true;
        return { ...n, y: novoY };
      });
      return mudou ? proximo : atual;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsVisiveis, alturasChave, arrastandoId]);

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
      <div className="canvas-ov-meter-stack">
        <div className="canvas-ov-meter">
          <ConfidenceMeter value={pct} label="Coleta da conversa" caption={`${pct}% mapeado`} />
        </div>
        <div className="canvas-ov-transcricao">
          <PainelTranscricao />
        </div>
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
              onAltura={(altura) => registrarAltura(n.id, altura)}
              onArrastando={(arrastando) => setArrastandoId(arrastando ? n.id : null)}
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
