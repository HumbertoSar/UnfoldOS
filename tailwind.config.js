/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Linguagem visual da planilha: navy + aço.
        navy: '#1F4E79',
        aco: '#2E5C8A',
        // Semáforos (status de indicador).
        semaforo: {
          verde: '#16A34A',
          amarelo: '#D97706',
          vermelho: '#DC2626',
        },
        // Paleta da v2 ("painel de bordo" — console de instrumento). Não afeta a v1.
        ink: '#0A1A2B',
        painel: '#102A42',
        painel2: '#16334E',
        brass: '#D8B25A',
        pulse: '#5BE6CF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        plex: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      keyframes: {
        traceScroll: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        brassGlow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        traceScroll: 'traceScroll 3.2s linear infinite',
        brassGlow: 'brassGlow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
