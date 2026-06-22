// Logging de sessões em JSONL (uma linha JSON por evento), arquivo diário em logs/.
// Local e gitignored — contém dados financeiros falados. Desligue com LOG_SESSOES=false.
import fs from 'fs';
import path from 'path';

const DIR = path.resolve(process.cwd(), 'logs');

function arquivoDoDia(): string {
  const dia = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return path.join(DIR, `sessoes-${dia}.jsonl`);
}

export function registrar(evento: Record<string, unknown>): void {
  if (process.env.LOG_SESSOES === 'false') return;
  try {
    fs.mkdirSync(DIR, { recursive: true });
    const linha = JSON.stringify({ ts: new Date().toISOString(), ...evento }) + '\n';
    fs.appendFile(arquivoDoDia(), linha, () => {});
  } catch {
    /* logging nunca deve quebrar o fluxo */
  }
}
