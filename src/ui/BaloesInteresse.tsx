// Bolhas de "paixão" (futebol, viagem, filme/série, livro, arte, pet,
// natureza) — nascem do card "Quem é Você?" (ver Canvas.tsx: conteudoNo),
// ficam flutuando logo abaixo dele (cada uma com seu próprio ritmo) e não
// somem sozinhas.
import { useBaloes } from '../store/useBaloes';
import './BaloesInteresse.css';

const N_FAGULHAS = 8;

// Ritmos de flutuação distintos, escolhidos por índice — pra cada balão boiar
// no seu próprio compasso em vez de todos se moverem juntos como um bloco.
const RITMOS_FLUTUAR = [
  { duracao: '3.2s', atraso: '0s' },
  { duracao: '3.8s', atraso: '0.6s' },
  { duracao: '4.2s', atraso: '1.1s' },
  { duracao: '3.5s', atraso: '1.6s' },
  { duracao: '4.0s', atraso: '0.3s' },
];

export function BaloesInteresse() {
  const baloes = useBaloes((s) => s.baloes);
  if (baloes.length === 0) return null;

  return (
    <div className="baloes-da-pessoa no-print">
      {baloes.map((b, i) => {
        const ritmo = RITMOS_FLUTUAR[i % RITMOS_FLUTUAR.length];
        return (
          <div key={b.id} className="balao-interesse">
            {Array.from({ length: N_FAGULHAS }).map((_, f) => (
              <span
                key={f}
                className="balao-interesse__fagulha"
                style={{ '--i': f } as React.CSSProperties}
              />
            ))}
            <div
              className="balao-interesse__corpo"
              style={
                {
                  '--duracao-flutuar': ritmo.duracao,
                  '--atraso-flutuar': ritmo.atraso,
                } as React.CSSProperties
              }
            >
              <span className="balao-interesse__emoji">{b.emoji}</span>
              {b.bandeira && (
                <span
                  className="balao-interesse__bandeira"
                  style={
                    {
                      '--cor-a': b.bandeira.corA,
                      '--cor-b': b.bandeira.corB,
                    } as React.CSSProperties
                  }
                  aria-hidden="true"
                />
              )}
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
