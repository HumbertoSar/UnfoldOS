import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Atalho para a biblioteca do design system Unfold OS.
      '@ds': fileURLToPath(new URL('./src/design-system', import.meta.url)),
    },
  },
  server: {
    port: 5174,
    proxy: {
      // Encaminha as chamadas de extração para o proxy Express (porta 8788).
      '/api': 'http://localhost:8788',
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
