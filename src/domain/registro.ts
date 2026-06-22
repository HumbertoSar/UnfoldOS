// REGISTRO DE CAMPOS — fonte única da verdade do domínio (front + server).
// Filosofia (decisão de arquitetura): schema HÍBRIDO que endurece com o tempo.
//   - Núcleo TIPADO: só o que vamos calcular (finanças + suitability + identidade básica).
//     Adicionar/renomear um campo = 1 linha aqui; o enum da IA, a coerção e a UI saem daqui.
//   - Lista TIPADA: investimentos (precisamos somar para o patrimônio).
//   - BALDE aberto (observacoes): tudo que ainda é exploratório (paixões, sonhos, pets, contexto).
//     A IA joga no balde sem precisar de campo pré-definido. Quando um item do balde virar
//     recorrente e entrar num diagnóstico, PROMOVA-o para um campo tipado abaixo (balde → tipado).

export type TipoCampo = 'texto' | 'numero' | 'moeda' | 'inteiro' | 'booleano' | 'enum';

export type SecaoChave = 'pessoa' | 'dependentes' | 'sonhos' | 'financas' | 'suitability';

export interface Secao {
  chave: SecaoChave;
  titulo: string;
  descricao: string;
}

// As 5 seções do canvas (ordem de exibição).
export const SECOES: Secao[] = [
  { chave: 'pessoa', titulo: 'Quem é a pessoa', descricao: 'Identidade, profissão e paixões' },
  { chave: 'dependentes', titulo: 'Dependentes', descricao: 'Família e pets que dependem dela' },
  { chave: 'sonhos', titulo: 'Sonhos e objetivos', descricao: 'O que ela quer realizar' },
  { chave: 'financas', titulo: 'Finanças', descricao: 'Patrimônio: o que tem e o que deve' },
  { chave: 'suitability', titulo: 'Suitability', descricao: 'Perfil de investidor' },
];

export interface CampoDef {
  chave: string;
  rotulo: string;
  secao: SecaoChave;
  tipo: TipoCampo;
  opcoes?: string[]; // para tipo 'enum'
  dica?: string; // ajuda a IA a desambiguar (entra no guia do prompt)
}

// NÚCLEO TIPADO — os campos escalares. Cada entrada vira automaticamente:
// enum válido da IA, regra de coerção e cartão/linha na UI. Mantenha enxuto.
export const REGISTRO: CampoDef[] = [
  // Pessoa (identidade básica; paixões/interesses ficam no balde por enquanto)
  { chave: 'nome', rotulo: 'Nome', secao: 'pessoa', tipo: 'texto' },
  { chave: 'idade', rotulo: 'Idade', secao: 'pessoa', tipo: 'inteiro' },
  { chave: 'profissao', rotulo: 'Profissão', secao: 'pessoa', tipo: 'texto' },

  // Finanças — patrimônio (o que vamos somar/calcular)
  { chave: 'rendaMensal', rotulo: 'Renda mensal', secao: 'financas', tipo: 'moeda',
    dica: 'Quanto recebe por mês: "ganho/recebo/salário/faturo X por mês".' },
  { chave: 'imoveis', rotulo: 'Imóveis', secao: 'financas', tipo: 'moeda',
    dica: 'VALOR em R$ dos imóveis, nunca a quantidade.' },
  { chave: 'reservaEmergencia', rotulo: 'Reserva de emergência', secao: 'financas', tipo: 'moeda' },
  { chave: 'dividas', rotulo: 'Dívidas', secao: 'financas', tipo: 'moeda',
    dica: 'Saldo devedor total (financiamentos, empréstimos).' },
  { chave: 'possuiSeguroVida', rotulo: 'Possui seguro de vida', secao: 'financas', tipo: 'booleano' },
  { chave: 'coberturaSeguro', rotulo: 'Cobertura do seguro', secao: 'financas', tipo: 'moeda' },

  // Suitability — perfil de investidor
  { chave: 'perfilRisco', rotulo: 'Perfil de risco', secao: 'suitability', tipo: 'enum',
    opcoes: ['conservador', 'moderado', 'arrojado'] },
  { chave: 'horizonteAnos', rotulo: 'Horizonte (anos)', secao: 'suitability', tipo: 'inteiro',
    dica: 'Por quantos anos pretende deixar o dinheiro investido.' },
  { chave: 'experienciaInvestimentos', rotulo: 'Experiência com investimentos', secao: 'suitability', tipo: 'texto' },
  { chave: 'toleranciaPerda', rotulo: 'Tolerância a perdas', secao: 'suitability', tipo: 'texto' },
];

// LISTA TIPADA — investimentos citados (cada um é um item; somados no patrimônio).
export const LISTA_INVESTIMENTOS = {
  chave: 'investimentos',
  rotulo: 'Investimentos',
  secao: 'financas' as SecaoChave,
};

// BALDE — categorias válidas para observações soltas (exploratório).
// Tudo que não tem campo tipado cai aqui, marcado pela seção a que pertence.
export const CATEGORIAS_BALDE: SecaoChave[] = ['pessoa', 'dependentes', 'sonhos', 'financas', 'suitability'];

// ---- Derivados (não editar; saem do REGISTRO) -------------------------------

export type ChaveCampo = string;

export const CHAVES_ESCALARES: string[] = REGISTRO.map((c) => c.chave);

export const DEF_POR_CHAVE: Record<string, CampoDef> = Object.fromEntries(
  REGISTRO.map((c) => [c.chave, c]),
);

export const ROTULOS: Record<string, string> = Object.fromEntries(
  REGISTRO.map((c) => [c.chave, c.rotulo]),
);

export function camposDaSecao(secao: SecaoChave): CampoDef[] {
  return REGISTRO.filter((c) => c.secao === secao);
}

// Guia de campos para o prompt da IA — gerado do registro (sem hardcode duplicado).
export function guiaCampos(): string {
  const linhas = REGISTRO.map((c) => {
    const tipoTxt =
      c.tipo === 'moeda' ? 'número em R$'
      : c.tipo === 'inteiro' ? 'número inteiro'
      : c.tipo === 'numero' ? 'número'
      : c.tipo === 'booleano' ? 'true/false'
      : c.tipo === 'enum' ? `um de [${c.opcoes?.join(', ')}]`
      : 'texto';
    return `- ${c.chave} (${tipoTxt})${c.dica ? ' — ' + c.dica : ''}`;
  });
  return linhas.join('\n');
}
