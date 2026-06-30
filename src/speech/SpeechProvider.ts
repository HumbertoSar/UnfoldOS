// Abstração de STT, isolada para troca futura (Web Speech API → Deepgram/Whisper).
// Implementação atual: Web Speech API do navegador (Chrome/Edge), pt-BR, contínua.

export interface ResultadoFala {
  texto: string;
  final: boolean; // true = segmento finalizado; false = parcial (interim)
}

export interface SpeechProvider {
  readonly suportado: boolean;
  iniciar(): void;
  parar(): void;
  onResultado(cb: (r: ResultadoFala) => void): void;
  onErro(cb: (mensagem: string) => void): void;
  onStatus(cb: (ativo: boolean) => void): void;
}

// Erros permanentes: tentar reiniciar não resolve (sem permissão/dispositivo/serviço).
// Para esses, encerramos a sessão em vez de entrar em loop de retry.
const ERROS_FATAIS = new Set([
  'not-allowed',
  'service-not-allowed',
  'audio-capture',
  'language-not-supported',
]);

export class WebSpeechProvider implements SpeechProvider {
  private rec: SpeechRecognition | null = null;
  private ativo = false; // intenção do usuário (continuar ouvindo?)
  private cbResultado: (r: ResultadoFala) => void = () => {};
  private cbErro: (m: string) => void = () => {};
  private cbStatus: (a: boolean) => void = () => {};

  readonly suportado: boolean;

  constructor() {
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    this.suportado = Boolean(Ctor);
    if (Ctor) {
      const rec = new Ctor();
      rec.lang = 'pt-BR';
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      rec.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const resultado = event.results[i];
          const texto = resultado[0]?.transcript ?? '';
          if (!texto) continue;
          this.cbResultado({ texto, final: resultado.isFinal });
        }
      };

      rec.onerror = (event) => {
        // 'no-speech' e 'aborted' são esperados; só reportamos os relevantes.
        if (event.error === 'no-speech' || event.error === 'aborted') return;
        if (ERROS_FATAIS.has(event.error)) this.ativo = false;
        this.cbErro(event.error);
      };

      rec.onend = () => {
        // O reconhecimento contínuo às vezes encerra sozinho (silêncio). Se o
        // usuário ainda quer ouvir, reinicia para manter a sessão viva.
        if (this.ativo) {
          try {
            rec.start();
          } catch {
            /* já iniciando; ignora */
          }
        } else {
          this.cbStatus(false);
        }
      };

      rec.onstart = () => this.cbStatus(true);
      this.rec = rec;
    }
  }

  iniciar() {
    if (!this.rec || this.ativo) return;
    this.ativo = true;
    try {
      this.rec.start();
    } catch {
      /* já iniciado */
    }
  }

  parar() {
    if (!this.rec) return;
    this.ativo = false;
    this.rec.stop();
  }

  onResultado(cb: (r: ResultadoFala) => void) {
    this.cbResultado = cb;
  }
  onErro(cb: (m: string) => void) {
    this.cbErro = cb;
  }
  onStatus(cb: (a: boolean) => void) {
    this.cbStatus = cb;
  }
}
