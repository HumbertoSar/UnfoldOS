// Toasts: "Captei: ...", "↻ Corrigido", avisos e erros. Com botão desfazer nas capturas.
import { useToasts } from '../store/useToasts';
import { useCanvas } from '../store/useCanvas';

export function Toasts() {
  const toasts = useToasts((s) => s.toasts);
  const remover = useToasts((s) => s.remover);
  const desfazer = useCanvas((s) => s.desfazer);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
      {toasts.map((t) => {
        if (t.tipo === 'erro') {
          return (
            <div key={t.id} className="rounded-lg bg-rose-600 px-4 py-3 text-sm text-white shadow-lg" style={{ animation: 'slidein .2s ease' }}>
              {t.mensagem}
            </div>
          );
        }
        if (t.tipo === 'aviso') {
          return (
            <div key={t.id} className="rounded-lg bg-amber-500 px-4 py-3 text-sm text-white shadow-lg" style={{ animation: 'slidein .2s ease' }}>
              {t.mensagem}
            </div>
          );
        }
        return (
          <div key={t.id} className="flex items-center justify-between gap-2 rounded-lg bg-navy px-4 py-3 text-sm text-white shadow-lg" style={{ animation: 'slidein .2s ease' }}>
            <span>
              {t.correcao ? '↻ ' : '✓ Captei: '}
              <strong>{t.rotulo}</strong>
              {t.valor ? ` — ${t.valor}` : ''}
            </span>
            {t.logId && (
              <button
                onClick={() => { desfazer(t.logId!); remover(t.id); }}
                className="shrink-0 rounded bg-white/15 px-2 py-1 text-xs hover:bg-white/25"
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
