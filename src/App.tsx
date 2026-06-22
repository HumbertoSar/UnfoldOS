import { useEffect } from 'react';
import { useCanvas } from './store/useCanvas';
import { useSaudeServidor } from './store/useSaudeServidor';
import { TelaInicio } from './ui/TelaInicio';
import { Canvas } from './ui/Canvas';
import { Toasts } from './ui/Toasts';

export default function App() {
  const sessaoIniciada = useCanvas((s) => s.sessaoIniciada);
  const verificar = useSaudeServidor((s) => s.verificar);

  // Checa a saúde do proxy ao abrir (banner de offline / sem-chave).
  useEffect(() => {
    void verificar();
  }, [verificar]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {sessaoIniciada ? <Canvas /> : <TelaInicio />}
      <Toasts />
    </div>
  );
}
