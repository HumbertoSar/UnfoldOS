// Tela de início: aviso de consentimento (LGPD) antes de ligar o microfone.
import { useCanvas } from '../store/useCanvas';
import { useSaudeServidor } from '../store/useSaudeServidor';

export function TelaInicio() {
  const iniciarSessao = useCanvas((s) => s.iniciarSessao);
  const status = useSaudeServidor((s) => s.status);

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-8 px-6">
      <div className="text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-navy/60">
          Diagnóstico Canva
        </p>
        <h1 className="font-grotesk text-4xl font-bold text-navy">
          Canvas de vida e finanças ao vivo
        </h1>
        <p className="mt-4 text-slate-600">
          Durante a conversa, o app escuta, entende e vai montando o retrato do cliente —
          quem é, sonhos, dependentes e finanças — em tempo real.
        </p>
      </div>

      <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-navy">Antes de começar</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>• O áudio é transcrito pelo navegador (Chrome/Edge) e o texto vai à IA de extração.</li>
          <li>• Nada é salvo em servidor; os dados ficam só neste navegador.</li>
          <li>• Avise o cliente que a conversa será transcrita para montar o diagnóstico.</li>
        </ul>

        {status === 'offline' && (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            ⚠️ Servidor de extração offline — inicie o proxy (<code>npm run server</code>).
          </p>
        )}
        {status === 'sem-chave' && (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            ⚠️ Servidor sem <code>OPENROUTER_API_KEY</code> — preencha o <code>.env</code>.
          </p>
        )}

        <button
          onClick={iniciarSessao}
          className="mt-6 w-full rounded-xl bg-navy py-3 font-semibold text-white transition hover:bg-aco"
        >
          Iniciar captação
        </button>
      </div>
    </div>
  );
}
