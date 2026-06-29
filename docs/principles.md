# Princípios do Design System

O Unfold OS não substitui o consultor — ele **amplifica a conversa**, tornando
visível o que já está sendo compreendido em conjunto. Estes princípios guiam
cada decisão de design, do token ao componente.

## 1. Canvas como espaço mental

A interface é uma canvas infinita. Não há fluxos rígidos nem telas sequenciais;
o entendimento se constrói no espaço. Em código: `InfiniteCanvas` provê pan e
zoom contínuos, com um fundo de pontos que se desloca para dar senso de lugar.

> **Implicação de design:** evite navegação por abas/wizards onde a canvas
> bastaria. Prefira posição a hierarquia de telas.

## 2. Cards como unidade fundamental

Toda informação existe como um card. Cards não se conectam por fios; eles se
**aproximam ou se afastam** conforme afinidade semântica. O componente `Card`
(e os cards especializados — `DiagnosisCard`, `PersonCard`, `InfoChip`) é a
peça atômica.

> **Implicação de design:** ao adicionar um novo tipo de dado, pergunte "que
> card é este?" antes de "em que tela isto vai?".

## 3. Unfold progressivo

Cards nunca nascem completos. Eles se expandem, ganham camadas e densidade
conforme novos dados são captados. A animação `--uf-duration-unfold` (520ms,
`UnfoldCard`) é a assinatura do sistema: nada surge pronto, tudo se desdobra.

> **Implicação de design:** projete o estado *incompleto* primeiro. Use
> `forming` (no `Card`, `InfoChip`, `DiagnosisCard`) para mostrar o que ainda
> está chegando — borda tracejada, tom suave, sem ansiedade.

## 4. Diagnóstico emergente

O sistema não declara conclusões fechadas. Diagnósticos surgem **visualmente da
relação entre cards**. O `DiagnosisCard` default é `status="forming"` com o
rótulo "Diagnóstico em formação"; o `ProgressRing` e a `ConfidenceMeter` mostram
o quanto o entendimento amadureceu — sempre "Em evolução".

> **Implicação de design:** evite veredictos binários. Prefira gradientes de
> confiança e linguagem que admite revisão.

## 5. Hierarquia por proximidade, não por destaque

Importância é comunicada por **posição, agrupamento e ritmo** — não por cores
agressivas ou alertas. Não há vermelho de erro. Estados de atenção usam o âmbar
suave; o positivo usa a sálvia; tudo em tons baixos com fundo macio.

> **Implicação de design:** antes de subir o contraste de um elemento,
> pergunte se ele pode simplesmente estar *mais perto* do que importa.

## 6. Human-first

A interface nunca pressiona por dados. O silêncio, a pausa e a incompletude
fazem parte da experiência. `prefers-reduced-motion` é respeitado em todo
movimento. O microfone convida ("Clique para falar"), não exige.

> **Implicação de design:** dê saídas, pausas e estados vazios acolhedores.
> Nunca bloqueie a conversa esperando um campo obrigatório.

---

## Como os princípios viram tokens

| Princípio | Token / mecanismo |
| --- | --- |
| Unfold progressivo | `--uf-duration-unfold`, `--uf-ease-spring`, `.uf-card--forming` |
| Diagnóstico emergente | `--uf-color-forming`, `ProgressRing`, `ConfidenceMeter` |
| Hierarquia por proximidade | sombras macias (`--uf-elevation-*`), acentos sutis |
| Human-first | `prefers-reduced-motion`, foco visível, rótulos ARIA |
| Cor por tom, não alarme | paletas `sage` / `amber` em tons `-soft` para status |

Nada se fecha cedo demais. Tudo pode continuar a se *unfoldar*.
