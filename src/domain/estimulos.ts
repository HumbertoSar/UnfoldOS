// Perguntas do bloco "Me diga:" (ver design_handoff_me_diga/5a-SPEC.md) — convite
// de fala com efeito de digitação, mostrado no rodapé de cards ainda em coleta.
// Copy exata do protótipo de design.
import type { SecaoChave } from './registro';

export const PERGUNTAS_POR_SECAO: Record<SecaoChave, string[]> = {
  pessoa: [
    'Como você gosta de ser chamado?',
    'No que você trabalha hoje?',
    'O que te faz levantar da cama?',
  ],
  dependentes: [
    'Quem depende de você financeiramente?',
    'Seus filhos ainda estudam?',
    'Tem mais alguém que você cuida?',
  ],
  sonhos: [
    'O que você mais sonha em realizar?',
    'Tem algum plano pros próximos 10 anos?',
    'Onde você se imagina no futuro?',
  ],
  financas: [
    'Você já tem uma reserva de emergência?',
    'Possui algum seguro de vida hoje?',
    'Tem imóveis ou financiamentos no seu nome?',
  ],
  suitability: [
    'Como você reage quando um investimento cai?',
    'Prefere mais segurança ou mais crescimento?',
    'Já investiu em algo mais arrojado?',
  ],
};
