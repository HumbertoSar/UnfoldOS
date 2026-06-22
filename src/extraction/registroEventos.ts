// Registra eventos de UX no proxy (/api/log) para análise das sessões.
// Fire-and-forget: nunca bloqueia nem quebra a UI.
export function registrarEvento(tipo: string, dados: Record<string, unknown> = {}): void {
  try {
    void fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo, ...dados }),
    }).catch(() => {});
  } catch {
    /* ignora */
  }
}
