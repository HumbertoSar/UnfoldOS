// Bolhas de "paixão" (futebol, viagem, filme/série, livro, arte, pet,
// natureza) — nascem do card "Quem é Você?" (ver Canvas.tsx: conteudoNo),
// ficam flutuando logo abaixo dele e não somem sozinhas.
import { useBaloes } from '../store/useBaloes';
import './BaloesInteresse.css';

const N_FAGULHAS = 8;

export function BaloesInteresse() {
  const baloes = useBaloes((s) => s.baloes);
  if (baloes.length === 0) return null;

  return (
    <div className="baloes-da-pessoa no-print">
      {baloes.map((b) => (
        <div key={b.id} className="balao-interesse">
          {Array.from({ length: N_FAGULHAS }).map((_, i) => (
            <span
              key={i}
              className="balao-interesse__fagulha"
              style={{ '--i': i } as React.CSSProperties}
            />
          ))}
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
      ))}
    </div>
  );
}
