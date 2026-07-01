// Toasts: "Captei: ...", "↻ Corrigido", avisos e erros. Com botão desfazer nas capturas.
import { useToasts } from '../store/useToasts';
import { useCanvas } from '../store/useCanvas';

export function Toasts() {
  const toasts = useToasts((s) => s.toasts);
  const remover = useToasts((s) => s.remover);
  const desfazer = useCanvas((s) => s.desfazer);

  return (
    <div className="toasts no-print">
      {toasts.map((t) => {
        const classeBase = `toast${t.saindo ? ' toast--saindo' : ''}`;
        const estilo = { animationDelay: `${t.atrasoEntrada ?? 0}ms` };

        if (t.tipo === 'erro') {
          return (
            <div key={t.id} className={`${classeBase} toast--erro`} style={estilo}>
              {t.mensagem}
            </div>
          );
        }
        if (t.tipo === 'aviso') {
          return (
            <div key={t.id} className={`${classeBase} toast--aviso`} style={estilo}>
              {t.mensagem}
            </div>
          );
        }
        return (
          <div key={t.id} className={`${classeBase} toast--captura`} style={estilo}>
            <span>
              {t.correcao ? '↻ ' : '✓ Captei: '}
              <strong>{t.rotulo}</strong>
              {t.valor ? ` — ${t.valor}` : ''}
            </span>
            {t.logId && (
              <button
                className="toast__undo"
                onClick={() => { desfazer(t.logId!); remover(t.id); }}
              >
                desfazer
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
