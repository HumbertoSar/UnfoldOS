// Efeito de máquina de escrever do bloco "Me diga:" — ver
// design_handoff_me_diga/5a-SPEC.md. Ciclo por card, independente: digita →
// segura → apaga → próxima pergunta. Timing de referência do protótipo de
// design (não é o runtime dele — reimplementado aqui).
import { useEffect, useRef, useState } from 'react';

type Fase = 'typing' | 'hold' | 'deleting';

const ATRASO_DELETAR_MS = 24;
const HOLD_NORMAL_MS = 1500;
const HOLD_LENTO_MS = 6000;
const PAUSA_NORMAL_MS = 450;
const PAUSA_LENTA_MS = 1800;

function atrasoDigitar(): number {
  return 48 + Math.random() * 55;
}

export function useDigitacao(perguntas: string[], atrasoInicialMs: number, lento: boolean): string {
  const [texto, setTexto] = useState('');
  const faseRef = useRef<Fase>('typing');
  const nRef = useRef(0);
  const indiceRef = useRef(0);
  const lentoRef = useRef(lento);
  lentoRef.current = lento;

  useEffect(() => {
    if (perguntas.length === 0) return;
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      const pergunta = perguntas[indiceRef.current % perguntas.length];
      let atraso: number;
      if (faseRef.current === 'typing') {
        nRef.current++;
        setTexto(pergunta.slice(0, nRef.current));
        if (nRef.current >= pergunta.length) {
          faseRef.current = 'hold';
          atraso = lentoRef.current ? HOLD_LENTO_MS : HOLD_NORMAL_MS;
        } else {
          atraso = atrasoDigitar();
        }
      } else if (faseRef.current === 'hold') {
        faseRef.current = 'deleting';
        atraso = ATRASO_DELETAR_MS;
      } else {
        nRef.current--;
        setTexto(pergunta.slice(0, Math.max(0, nRef.current)));
        if (nRef.current <= 0) {
          faseRef.current = 'typing';
          indiceRef.current++;
          atraso = lentoRef.current ? PAUSA_LENTA_MS : PAUSA_NORMAL_MS;
        } else {
          atraso = ATRASO_DELETAR_MS;
        }
      }
      timer = setTimeout(tick, atraso);
    }

    timer = setTimeout(tick, atrasoInicialMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perguntas, atrasoInicialMs]);

  return texto;
}
