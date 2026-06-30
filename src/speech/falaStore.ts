// Estado de transcrição (Zustand) + controle do provider de STT (singleton).
// Mantém os segmentos finais (linhas) e o parcial (interim). O orquestrador de
// extração observa `linhas` para processar cada novo trecho.
import { create } from 'zustand';
import { WebSpeechProvider, type SpeechProvider } from './SpeechProvider';
import { useCanvas } from '../store/useCanvas';
import { useToasts } from '../store/useToasts';

// Mensagens amigáveis pros códigos de erro do Web Speech API (ver SpeechProvider).
const MENSAGENS_ERRO_MIC: Record<string, string> = {
  'not-allowed': 'Permissão de microfone negada — libere o acesso nas configurações do navegador e clique em "Retomar microfone".',
  'service-not-allowed': 'O navegador bloqueou o serviço de reconhecimento de voz.',
  'audio-capture': 'Nenhum microfone encontrado.',
  network: 'Falha de rede no reconhecimento de voz. Verifique sua conexão e tente de novo.',
  'language-not-supported': 'Reconhecimento em pt-BR não suportado neste navegador.',
};

interface EstadoFala {
  suportado: boolean;
  ativo: boolean;
  interim: string;
  linhas: string[];
  erro: string | null;
  iniciar: () => void;
  parar: () => void;
  limpar: () => void;
}

let provider: SpeechProvider | null = null;

function obterProvider(set: (p: Partial<EstadoFala>) => void): SpeechProvider {
  if (provider) return provider;
  const p = new WebSpeechProvider();

  p.onResultado((r) => {
    if (r.final) {
      const trecho = r.texto.trim();
      if (!trecho) return;
      set({ interim: '' });
      useFala.setState((s) => ({ linhas: [...s.linhas, trecho] }));
    } else {
      set({ interim: r.texto });
    }
  });

  p.onErro((mensagem) => {
    set({ erro: mensagem });
    useToasts.getState().adicionarErro(MENSAGENS_ERRO_MIC[mensagem] ?? `Erro no microfone: ${mensagem}`);
  });

  p.onStatus((ativo) => {
    set({ ativo });
    useCanvas.getState().setStatusFase(ativo ? 'Ouvindo a conversa…' : 'Microfone pausado');
  });

  provider = p;
  return p;
}

export const useFala = create<EstadoFala>((set) => ({
  suportado:
    typeof window !== 'undefined' &&
    Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition),
  ativo: false,
  interim: '',
  linhas: [],
  erro: null,

  iniciar: () => {
    const p = obterProvider(set);
    if (!p.suportado) {
      const mensagem = 'Web Speech API não suportada neste navegador. Use Chrome ou Edge.';
      set({ erro: mensagem });
      useToasts.getState().adicionarErro(mensagem);
      return;
    }
    set({ erro: null });
    p.iniciar();
  },

  parar: () => {
    provider?.parar();
  },

  limpar: () => set({ linhas: [], interim: '' }),
}));
