// Proxy de extração — ÚNICO lugar com a OPENROUTER_API_KEY (nunca vai ao navegador).
// POST /api/extract: recebe trecho + estado, chama o modelo com function calling
// (saída estruturada) e devolve { updates, investimentos, observacoes }.
// O schema de campos sai do REGISTRO (fonte única, compartilhada com o front).
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { CHAVES_ESCALARES, CATEGORIAS_BALDE, TIPOS_INTERESSE, guiaCampos } from '../src/domain/registro';
import { registrar } from './log';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static('dist'));

const MODELO = process.env.EXTRACTION_MODEL || 'openai/gpt-4o-mini';

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || 'sk-missing',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5173',
    'X-Title': 'Diagnóstico Canva ao Vivo',
  },
});

function systemPrompt(modo: 'captura' | 'correcao'): string {
  const base = `Você monta, ao vivo, um "canvas de vida e finanças" a partir de uma conversa em
pt-BR entre um consultor e um cliente. Recebe um trecho novo da transcrição (e, às vezes, um
contexto recente já dito) mais o estado atual conhecido. Chame a função "registrar_dados".

Há TRÊS destinos para o que você captar:
1) updates — CAMPOS TIPADOS conhecidos (lista abaixo). Cada um: {field (enum), value já
   normalizado no tipo do campo, confidence 0..1, evidence (frase exata)}.
2) investimentos — cada investimento citado vira um item {nome, valor, confidence, evidence}
   (fundo, previdência, FGTS, ação, CDB, tesouro, poupança, participação em empresa). Item NOVO
   por investimento; nunca some nem sobrescreva.
3) observacoes — o BALDE. Tudo que NÃO tem campo tipado mas é relevante para conhecer a pessoa:
   paixões/gostos (futebol e time, café, leitura, filmes, viagem), família e PETS, sonhos e
   objetivos, contexto de vida. Cada item: {categoria, chave (rótulo curto), valor (detalhe),
   tipoInteresse (opcional), confidence, evidence}. categoria ∈ [${CATEGORIAS_BALDE.join(', ')}].

   tipoInteresse é OPCIONAL: preencha só quando o item for uma PAIXÃO/HOBBY divertido de
   destacar, com um dos valores em [${TIPOS_INTERESSE.join(', ')}]. A maioria das observações
   (sonhos, dependentes, contexto) NÃO tem tipoInteresse — deixe de fora nesses casos.
   Para tipoInteresse:"futebol", o valor DEVE ser o nome do TIME (não "futebol" de novo).

   Exemplos:
   - "torço pro Flamengo" → observacoes:[{categoria:"pessoa", chave:"Futebol", valor:"Flamengo", tipoInteresse:"futebol"}]
   - "sou vascaíno roxo" → observacoes:[{categoria:"pessoa", chave:"Futebol", valor:"Vasco", tipoInteresse:"futebol"}]
   - "adoro viajar" → observacoes:[{categoria:"pessoa", chave:"Viagem", valor:"", tipoInteresse:"viagem"}]
   - "vivo maratonando série" → observacoes:[{categoria:"pessoa", chave:"Séries", valor:"", tipoInteresse:"filme-serie"}]
   - "leio muito, adoro um livro" → observacoes:[{categoria:"pessoa", chave:"Leitura", valor:"", tipoInteresse:"livro"}]
   - "curto museu, pintura" → observacoes:[{categoria:"pessoa", chave:"Arte", valor:"", tipoInteresse:"arte"}]
   - "amo trilha, natureza" → observacoes:[{categoria:"pessoa", chave:"Natureza", valor:"", tipoInteresse:"natureza"}]
   - "tenho um cachorro, o Bob" → observacoes:[{categoria:"dependentes", chave:"Pet", valor:"cachorro Bob", tipoInteresse:"pet"}]
   - "quero comprar uma casa na praia" → observacoes:[{categoria:"sonhos", chave:"Casa na praia", valor:""}]
   - "meu filho Lucas tem 16" → observacoes:[{categoria:"dependentes", chave:"Filho", valor:"Lucas, 16"}]

CAMPOS TIPADOS (para updates):
${guiaCampos()}

Normalize números falados: "trinta mil" → 30000; "quinze por cento" → 0.15; "dois" → 2;
"sessenta e cinco anos" → 65; "tenho seguro" → possuiSeguroVida=true.

REGRAS:
1. Extraia TODOS os dados de uma frase, em qualquer dos três destinos. Uma frase pode preencher
   campo tipado E gerar observação (ex.: "sou médico e adoro viajar" → profissao=médico E
   observacoes:[{categoria:"pessoa", chave:"Viagem"}]). updates é EXCLUSIVO dos campos tipados
   listados; "investimentos" e "observacoes" têm destinos próprios e NUNCA aparecem em updates.
2. PERGUNTAS NÃO SÃO RESPOSTAS. O consultor pergunta; só o cliente responde. Trecho que é só
   pergunta ("você tem seguro?") NÃO gera nada. Pergunta sim/não NUNCA vira false.
3. A fala chega em pedaços. Se o trecho novo COMPLETA algo do contexto recente, junte:
   "minha reserva" + "é de 300 mil" → reservaEmergencia=300000.
4. Valores em R$ são realistas. Número pequeno demais costuma ser partido pela pausa
   ("renda de 32" → 32000). Use o contexto.
5. VALOR vs QUANTIDADE: "um imóvel de 3 milhões" → imoveis=3000000 (não 1).
6. RENDA: "ganho/recebo/salário/faturo X por mês" → rendaMensal já na primeira menção.
7. INVESTIMENTO ≠ CAMPO DE PATRIMÔNIO. Se a frase cita um VEÍCULO de investimento (fundo,
   previdência, FGTS, ação, CDB, tesouro, poupança, participação em empresa), o valor vai SÓ para
   investimentos — NUNCA para imoveis nem outro campo tipado. O campo imoveis é EXCLUSIVO de bens
   imóveis (casa, apartamento, terreno, sala, galpão). Ex.: "1,6 milhão em fundos" → investimentos,
   e imoveis fica intacto.
7b. TER vs QUERER. Campos de patrimônio (imoveis, reservaEmergencia, investimentos) captam só o que
   a pessoa JÁ POSSUI, com valor informado. Desejo/intenção ("quero comprar", "pretendo ter",
   "sonho com") é objetivo → observacoes (categoria sonhos), e NUNCA preenche o campo tipado — em
   especial, NUNCA gere um campo com valor 0.
8. Não repita um valor já presente NAQUELE MESMO campo/observação, a menos que tenha mudado.
   Campos diferentes NUNCA são duplicata um do outro.
9. Se for ambíguo ou conversa fiada, não registre. Prefira o BALDE a forçar um campo tipado:
   se não tem campo certo, mande para observacoes — nunca invente um field fora da lista.`;

  if (modo === 'correcao') {
    return `${base}

O consultor está CORRIGINDO ("Altere/Corrige ..."). Identifique o campo tipado e o NOVO valor,
com confidence alta. Devolva só o(s) campo(s) corrigido(s) em updates.`;
  }
  return base;
}

const ferramenta: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'registrar_dados',
    description: 'Registra dados do canvas extraídos do trecho da conversa.',
    parameters: {
      type: 'object',
      properties: {
        updates: {
          type: 'array',
          description: 'Campos tipados detectados. Vazia se nenhum.',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string', enum: CHAVES_ESCALARES },
              value: { type: ['number', 'string', 'boolean'], description: 'Valor normalizado no tipo do campo.' },
              confidence: { type: 'number', minimum: 0, maximum: 1 },
              evidence: { type: 'string' },
            },
            required: ['field', 'value', 'confidence', 'evidence'],
          },
        },
        investimentos: {
          type: 'array',
          description: 'Investimentos citados, cada um item NOVO. Vazia se nenhum.',
          items: {
            type: 'object',
            properties: {
              nome: { type: 'string' },
              valor: { type: 'number' },
              confidence: { type: 'number', minimum: 0, maximum: 1 },
              evidence: { type: 'string' },
            },
            required: ['nome', 'valor', 'confidence', 'evidence'],
          },
        },
        observacoes: {
          type: 'array',
          description: 'Balde: paixões, pets, sonhos, contexto — sem campo tipado. Vazia se nenhum.',
          items: {
            type: 'object',
            properties: {
              categoria: { type: 'string', enum: CATEGORIAS_BALDE },
              chave: { type: 'string', description: 'Rótulo curto.' },
              valor: { type: 'string', description: 'Detalhe (pode ser vazio).' },
              tipoInteresse: {
                type: 'string',
                enum: TIPOS_INTERESSE,
                description: 'Opcional: só quando for uma paixão/hobby divertido de destacar.',
              },
              confidence: { type: 'number', minimum: 0, maximum: 1 },
              evidence: { type: 'string' },
            },
            required: ['categoria', 'chave', 'valor', 'confidence', 'evidence'],
          },
        },
      },
      required: ['updates', 'investimentos', 'observacoes'],
    },
  },
};

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    provedor: 'openrouter',
    temChave: Boolean(process.env.OPENROUTER_API_KEY),
    modelo: MODELO,
  });
});

app.post('/api/extract', async (req, res) => {
  const { trecho, contextoAnterior, estadoAtual, modo } = req.body ?? {};
  if (typeof trecho !== 'string' || !trecho.trim()) {
    return res.status(400).json({ erro: 'trecho ausente ou vazio' });
  }
  const modoSeguro: 'captura' | 'correcao' = modo === 'correcao' ? 'correcao' : 'captura';
  const contexto = typeof contextoAnterior === 'string' ? contextoAnterior.trim() : '';

  const conteudoUsuario = `Estado atual conhecido (JSON):
${JSON.stringify(estadoAtual ?? {}, null, 0)}
${contexto ? `\nContexto recente (já dito, use só para resolver referências):\n"${contexto}"\n` : ''}
Trecho novo da transcrição (extraia daqui):
"${trecho}"`;

  const t0 = Date.now();
  try {
    const completion = await client.chat.completions.create({
      model: MODELO,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt(modoSeguro) },
        { role: 'user', content: conteudoUsuario },
      ],
      tools: [ferramenta],
      tool_choice: { type: 'function', function: { name: 'registrar_dados' } },
    });

    const chamada = completion.choices[0]?.message?.tool_calls?.[0];
    let updates: unknown[] = [];
    let investimentos: unknown[] = [];
    let observacoes: unknown[] = [];
    if (chamada && chamada.type === 'function') {
      try {
        const args = JSON.parse(chamada.function.arguments) as {
          updates?: unknown[];
          investimentos?: unknown[];
          observacoes?: unknown[];
        };
        updates = Array.isArray(args.updates) ? args.updates : [];
        investimentos = Array.isArray(args.investimentos) ? args.investimentos : [];
        observacoes = Array.isArray(args.observacoes) ? args.observacoes : [];
      } catch {
        console.warn('[extract] argumentos não-JSON do modelo:', chamada.function.arguments);
      }
    }

    registrar({
      tipo: 'extract',
      modo: modoSeguro,
      modelo: MODELO,
      trecho,
      latenciaMs: Date.now() - t0,
      nUpdates: updates.length,
      nInvestimentos: investimentos.length,
      nObservacoes: observacoes.length,
      updates,
      investimentos,
      observacoes,
    });
    return res.json({ updates, investimentos, observacoes });
  } catch (erro) {
    const detalhe = erro instanceof Error ? erro.message : String(erro);
    const status = erro instanceof OpenAI.APIError ? erro.status : undefined;
    registrar({ tipo: 'extract_erro', modo: modoSeguro, modelo: MODELO, trecho, latenciaMs: Date.now() - t0, status, detalhe });
    if (erro instanceof OpenAI.APIError) {
      console.error(`[extract] erro do OpenRouter ${erro.status}:`, erro.message);
      return res.status(502).json({ erro: 'falha na extração', detalhe });
    }
    console.error('[extract] erro inesperado:', erro);
    return res.status(500).json({ erro: 'erro interno' });
  }
});

app.post('/api/log', (req, res) => {
  const corpo = req.body;
  if (corpo && typeof corpo.tipo === 'string') registrar(corpo as Record<string, unknown>);
  res.json({ ok: true });
});

const PORT = Number(process.env.PORT) || 8788;
app.listen(PORT, () => {
  console.log(`[proxy] ouvindo em http://localhost:${PORT} (OpenRouter · modelo: ${MODELO})`);
});
