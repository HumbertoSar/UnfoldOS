// Tela de início: aviso de consentimento (LGPD) antes de ligar o microfone.
import { useCanvas } from '../store/useCanvas';
import { useSaudeServidor } from '../store/useSaudeServidor';
import { Card } from '@ds/components/Card';
import { Button } from '@ds/components/Button';
import { Icon } from '@ds/components/Icon';

export function TelaInicio() {
  const iniciarSessao = useCanvas((s) => s.iniciarSessao);
  const status = useSaudeServidor((s) => s.status);

  return (
    <div className="start">
      <header className="start__head">
        <p className="uf-overline" style={{ color: 'var(--uf-color-primary)' }}>
          Unfold OS
        </p>
        <h1 className="uf-title-1">Canvas de vida e finanças ao vivo</h1>
        <p className="start__lead">
          Durante a conversa, o app escuta, entende e vai montando o retrato do cliente —
          quem é, sonhos, dependentes e finanças — em tempo real.
        </p>
      </header>

      <Card elevation={1} padding="lg" style={{ width: '100%' }}>
        <h2 className="uf-title-3">Antes de começar</h2>
        <ul className="start__list">
          <li>O áudio é transcrito pelo navegador (Chrome/Edge) e o texto vai à IA de extração.</li>
          <li>Nada é salvo em servidor; os dados ficam só neste navegador.</li>
          <li>Avise o cliente que a conversa será transcrita para montar o diagnóstico.</li>
        </ul>

        {status === 'offline' && (
          <p className="start__note">
            ⚠️ Servidor de extração offline — inicie o proxy (<code>npm run server</code>).
          </p>
        )}
        {status === 'sem-chave' && (
          <p className="start__note">
            ⚠️ Servidor sem <code>OPENROUTER_API_KEY</code> — preencha o <code>.env</code>.
          </p>
        )}

        <div className="start__cta">
          <Button
            block
            size="lg"
            onClick={iniciarSessao}
            trailingIcon={<Icon name="arrow-right" size={18} />}
          >
            Iniciar captação
          </Button>
        </div>
      </Card>
    </div>
  );
}
