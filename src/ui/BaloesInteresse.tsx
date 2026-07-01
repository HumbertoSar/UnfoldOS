// Bolhas flutuantes de "paixão" (futebol, viagem, filme/série, livro, arte,
// pet, natureza) — aparecem longe dos cards, não competem com o conteúdo
// principal da canvas, e somem sozinhas (ver store/useBaloes.ts).
import { useBaloes } from '../store/useBaloes';
import './BaloesInteresse.css';

// Posições fixas (% da tela), escolhidas pra não cair em cima dos overlays
// fixos (medidor, minimapa, controles de zoom, dica de rodapé) nem do miolo
// onde os cards ficam.
const ZONAS = [
  { top: '10%', left: '46%' },
  { top: '32%', left: '90%' },
  { top: '80%', left: '80%' },
  { top: '88%', left: '30%' },
  { top: '52%', left: '4%' },
  { top: '64%', left: '94%' },
];

export function BaloesInteresse() {
  const baloes = useBaloes((s) => s.baloes);
  if (baloes.length === 0) return null;

  return (
    <div className="baloes-interesse no-print" aria-hidden="true">
      {baloes.map((b) => {
        const zona = ZONAS[b.zona % ZONAS.length];
        return (
          <div key={b.id} className="balao-interesse" style={{ top: zona.top, left: zona.left }}>
            <div
              className="balao-interesse__corpo"
              style={b.bg ? { background: b.bg, color: b.fg } : undefined}
            >
              <span className="balao-interesse__emoji">{b.emoji}</span>
              <span>
                {b.texto}
                {b.detalhe ? ` — ${b.detalhe}` : ''}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
