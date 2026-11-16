# AGENTS.md — Contexto para agentes de IA trabalhando no Mosaico (PCLudico)

> **Propósito deste arquivo:** servir como referência principal de contexto para agentes de IA
> (e desenvolvedores humanos) que forem implementar, corrigir ou evoluir o projeto.
> Tudo aqui foi levantado por análise direta do código-fonte e dos arquivos de configuração,
> validado contra a documentação oficial das tecnologias (Vue 3, Vue Router 5, Tailwind CSS v4,
> GSAP 3, pinia-plugin-persistedstate v4).
>
> **Última verificação:** 2026-11-16, na branch `dev` (commit `9205aa8`).
>
> **Leia primeiro:** §14 — *Diretrizes obrigatórias para agentes de IA* (vinculativas).

---

## 1. Contextualização e objetivos educacionais

O **Mosaico: Aventura dos Padrões** (repositório `pcludico`) é um **recurso didático interativo e
gamificado** desenvolvido para exercitar o **Reconhecimento de Padrões**, um dos quatro pilares do
**Pensamento Computacional** (decomposição, reconhecimento de padrões, abstração e algoritmos —
ver `README.md`).

- **Público-alvo:** estudantes da Educação Básica (portanto: linguagem simples, feedback constante,
  acessibilidade e desempenho em máquinas escolares são requisitos, não extras).
- **Proposta:** o aluno configura uma "aventura" (modo, dificuldade e modalidade), recebe uma
  introdução narrativa temática e resolve sequências com posições ocultas, identificando o padrão
  e completando as lacunas.
- **Gamificação:** progressão por dificuldades (Fácil → Médio → Difícil) e fases (1 → 2 → 3),
  metas de acertos por rodada e um **quebra-cabeça de 9 peças** (3 modalidades × 3 dificuldades)
  desbloqueado peça a peça na tela inicial.

Há **três modalidades temáticas** (ver §5):

| Modalidade | Tema narrativo          | Conteúdo da sequência                     |
| ---------- | ----------------------- | ----------------------------------------- |
| `forms`    | Egito Antigo            | Símbolos SVG repetidos com lacunas        |
| `numbers`  | Civilização futurista   | Sequências numéricas geradas por operações (+, −, ×) |
| `sounds`   | Banda de música         | Sons de animais/instrumentos com lacunas  |

Todos os textos da interface estão em **português (PT-BR)** e são mantidos no código
(não há i18n).

---

## 2. Stack tecnológica e versões

Versões **instaladas** (confirmadas em `node_modules`, não presumidas a partir do `package.json`):

| Tecnologia                      | Instalado  | Observações |
| ------------------------------- | ---------- | ----------- |
| Vue                             | **3.5.33** | Composition API + `<script setup>` em todos os SFCs |
| Vue Router                      | **5.0.6**  | Major recente; peers `vue ^3.5.0` e `pinia ^3.0.4` compatíveis |
| Pinia                           | **3.0.4**  | Stores no formato *setup store* |
| pinia-plugin-persistedstate     | **4.7.1**  | Uso de `pick`/`storage` validado contra a doc v4 |
| Tailwind CSS                    | **4.2.4**  | Via plugin `@tailwindcss/vite`, CSS-first (`@theme`, `@custom-variant`) |
| @tailwindcss/vite               | **4.2.4**  | |
| GSAP                            | **3.15.0** | Sem plugins pagos; uso de `gsap.context()` + `revert()` |
| @mdi/font                       | **7.4.47** | Ícones via classes `mdi mdi-*` (webfont completa) |
| Vite                            | **8.0.10** | |
| @vitejs/plugin-vue              | **6.0.6**  | |
| ESLint                          | **10.2.1** | Flat config + `eslint-plugin-vue` (`flat/essential`) + `eslint-plugin-oxlint` |
| oxlint                          | **1.60.0** | Lint rápido com `--fix`, integrado ao ESLint |
| Prettier                        | **3.8.3**  | `semi: false`, `singleQuote: true`, `printWidth: 100` |
| npm-run-all2                    | **8.0.4**  | Composição do script `lint` |

- **Linguagem:** JavaScript puro (ES Modules). **Não há TypeScript**; `jsconfig.json` existe
  apenas para o alias `@/*` → `./src/*`.
- **Engines:** `node ^20.19.0 || >=22.12.0` (verificado Node v26 em ambiente de desenvolvimento).
- **Sem biblioteca de testes** e **sem framework de componentes UI** (todo o design é próprio,
  com Tailwind + componentes nativos `<button>`).
- **Deploy:** Vercel (`vercel.json` reescreve `/(.*)` → `/index.html` — SPA com history mode).

---

## 3. Arquitetura e estrutura de pastas

```
PCLudico/
├── AGENTS.md                    # Este documento
├── package.json                 # Scripts e dependências
├── vite.config.js               # Plugins (vue + tailwindcss) e alias @
├── vercel.json                  # Rewrite SPA
├── index.html                   # Shell único (título "Mosaico: Aventura dos Padrões")
├── eslint.config.js / .oxlintrc.json / .prettierrc.json
├── .env                         # ⚠ NÃO versionado (ver §11, P-07)
├── public/                      # Assets servidos como estão
│   ├── sounds/                  # 17 sons + backgrounds/ (BGM) + feedbacks/ (acerto/erro)
│   ├── imgs/                    # logo, cards, icons, backgrounds, feedbacks, achievements
│   └── videos/tutorial.mp4      # 14,6 MB — carregado na Home (ver §11, P-04)
├── dist/                        # Build (gitignored)
└── src/
    ├── main.js                  # Boot: CSS → MDI font → Pinia + plugin persist → Router
    ├── App.vue                  # RouterView + overlay global de transição (GSAP)
    ├── router/index.js          # Rotas, layouts aninhados, guard de validação de params
    ├── assets/main.css          # Tailwind v4, fontes, tema (@theme), keyframes, scrollbar
    ├── data/achievements.json   # Estado inicial das 9 peças do quebra-cabeça
    ├── layouts/                 # DefaultLayout (header/footer) | GameLayout (vazio)
    ├── views/
    │   ├── HomeView.vue         # Configuração da aventura + tutorial + quebra-cabeça
    │   ├── IntroductionView.vue # História narrativa por modalidade
    │   └── games/               # FormView, NumberView, SoundView, FeedBackView, UnlockView
    ├── stores/                  # 6 stores Pinia (ver §7)
    ├── composables/             # 5 composables (ver §7)
    ├── utils/                   # sort, shuffle, operation, verifyResponse + labels
    └── components/
        ├── layouts/             # AppHeader, AppFooter, GameHeader
        ├── buttons/             # AppButton, GameButton, SelectButton
        ├── cards/               # GameDescription, AdventureCard, InstructionCard, PuzzleBoard
        └── decorators/          # SymbolsBackground, CloudBackground, LogoText
```

Padrão geral: **code-splitting por rota** (todas as views/layouts são importados dinamicamente),
stores/composables/utils/components/views fisicamente separados, e constantes de configuração
centralizadas na store de aplicação.

---

## 4. Responsabilidades dos principais módulos

### Stores (`src/stores/`)

| Store | Responsabilidade | Persistência |
| ----- | ---------------- | ------------ |
| `application.js` | **Configuração central do jogo**: pools de sons (`SOUND_OBJECTS`, 10 itens), símbolos (`FORM_SYMBOLS`, 5), dificuldades das 3 modalidades (`*_DIFFICULTIES` com params e `timeLimit`), histórias (`GAME_STORIES`), instruções (`GAME_DESCRIPTIONS`), contadores de acertos (`responses`), `gameStatus` (hits/required/mode/difficulty/phase/gameMode) e cálculo de próxima rota (`getNextRoute`, `repeatLevelRoute`) | Plugin (`pick: ['gameStatus']`) |
| `sequence.js` | **Motor do jogo**: monta sequências de objetos com lacunas (`mountObjectSequence`) e numéricas (`generateNumberSequence`), armazena `sequence`, `correctResponses`, `responses`, `finalChoices`, `selectedChoice`; valida respostas (`answerObjectSequence` → `'noop' \| 'wrong' \| 'correct' \| 'complete'`) | Nenhuma |
| `campaignProgress.js` | Progresso da campanha (grade `tipo→dificuldade→fase`) e **gating de acesso** (`canAccessGameType/Difficulty/Phase`, `getNextUnlockedPhase`) | Manual (localStorage) |
| `achievements.js` | Desbloqueio das 9 peças (`unlockAchievement`, `isUnlocked`, `totalUnlockeds`), a partir de `data/achievements.json` | Manual (localStorage) |
| `sounds.js` (`useAudioStore`) | Áudio: SFX (`playAudio`), BGM por tema (`playBackground` — só `forms` e `numbers` têm BGM), feedback acerto/erro (`playFeedback`), repetição encadeada de sequência (`playSequence`), mudo de BGM (`toggleBgmVolume`) | Nenhuma |
| `timeStamp.js` (`useTimeStamp`) | Cronômetro regressivo com `setInterval` de 200 ms recalculado por `Date.now()`; `formattedTime` (HH:MM:SS); dispara callback ao zerar | Nenhuma |

### Composables (`src/composables/`)

| Composable | Responsabilidade |
| ---------- | ---------------- |
| `useGameView.js` | **Orquestrador dos 3 game views**: lê params da rota, monta/valida sequências via callbacks opcionais (`onTryAgain`, `onBeforeAnswer`, `onSelect`), feedback visual/sonoro (`useFeedbackAnimation`), navegação para feedback/unlock (`goToFeedBack`), limpeza em `onUnmounted` (timer, contadores, BGM) |
| `useTransitionOverlay.js` | Overlay preto fullscreen global (módulo singleton) com `fadeIn`/`fadeOut` GSAP; registrado por `App.vue` via função ref |
| `usePageTransition.js` | Envelope sobre o overlay que **respeita `prefers-reduced-motion`** (`exit`/`enter`) |
| `useFeedbackAnimation.js` | Animações de acerto (brilho verde + scale) e erro (brilho vermelho) sobre os botões da sequência |
| `useFontSize.js` | Controle de tamanho de fonte global (14–22 px, padrão 16), aplicado em `html` e persistido manualmente em `localStorage` (`fontSize`) |

### Utils (`src/utils/`)

- `sort.js` — `sortObjects(quantidade, pool)`: sorteia o "molde" do padrão **com reposição**
  (podem haver itens repetidos; garante apenas que não sejam todos iguais). Lança erro se
  `quantidade > pool.length`.
- `shuffle.js` — Fisher-Yates puro (não muta o original).
- `operation.js` — operadores `+`, `-`, `*` e geração aleatória de operações/operandos.
- `verifyResponse.js` — re-checa as respostas armazenadas contra as corretas (redundância
  proposital de segurança).
- `modeLabel.js`, `difficultyLabel.js`, `phaseLabel.js` — rótulos PT-BR.

### Componentes

- `buttons/GameButton.vue` — botão central do jogo (símbolo SVG com `mask`, ícone MDI, número ou "?"); estados `selected`, `playing` (animação GSAP de pulo), `name === 'discover'` (estilo especial).
- `buttons/AppButton.vue` / `SelectButton.vue` — botões de ação e de seleção com `mode`/`color` (validadores de prop).
- `cards/PuzzleBoard.vue` — SVG 400×600 com 9 `<path>`s (peças), cada um condicionado a `isUnlocked(modalidade, dificuldade)`; imagem preenchida via `<pattern>` com `/imgs/achievements/general.svg`.
- `decorators/SymbolsBackground.vue` — 50 símbolos flutuantes com timelines GSAP infinitas (ver §12, O-05).
- `layouts/GameHeader.vue` — botão home, cronômetro, mudo e engrenagem (emite `openAccessibility` — **sem listener**, ver §11, P-11).
- `layouts/AppHeader.vue` — logo, A+/A−, botão "humano" (sem handler) e alternância de tema claro/escuro (`localStorage` `theme`).

---

## 5. Funcionamento das modalidades e regras de negócio

### Configurações de dificuldade (fonte: `application.js`)

| Modalidade | Fácil | Médio | Difícil |
| ---------- | ----- | ----- | ------- |
| `forms` | 2 símbolos, `size: 6`, 1 lacuna | 3 símbolos, `size: 12`, 2 lacunas | 4 símbolos, `size: 18`, 3 lacunas |
| `sounds` | 3 sons, `size: 9`, 1 lacuna | 4 sons, `size: 12`, 2 lacunas | 5 sons, `size: 15`, 3 lacunas |
| `numbers` | série de 6, 2 operações, 1 lacuna | série de 8, 3 operações, 2 lacunas | série de 10, 4 operações, 3 lacunas |

⚠ **Atenção:** os campos `size` de `forms` e `sounds` **não são usados** — FormView e SoundView
passam o literal `30` para `mountObjectSequence` (ver §11, P-06).

Tempos-limite por fase (`timeLimit`, em segundos, chaves `one/two/three`):
`forms` e `sounds` Fácil/Médio: 90/60/30; `numbers`: 90/60/30 → 120/90/60 → 150/120/90;
`sounds` Difícil: 150/120/90; `forms` Difícil: 90/60/**40** (curva inconsistente — §11, P-16).

### Geração e validação das sequências

1. **Objetos (forms/sounds):** `mountObjectSequence(numberItems, timesRepeat, numberDiscover, pool)`
   sorteia o molde com `sortObjects`, repete o ciclo `floor(timesRepeat/numberItems)` vezes e
   oculta `numberDiscover` posições aleatórias (**a posição 0 nunca é ocultada**). A resposta
   correta de cada lacuna é o **id do objeto** que estava lá. As alternativas são os itens do
   molde (deduplicados) embaralhados.
2. **Números:** `generateNumberSequence(length, amountOperations, maxOperator, maxStart, numberDiscover)`
   gera um valor inicial (1–maxStart) e aplica operações aleatórias ciclicamente; alterna
   `+`/`−`/`×` com operandos 1–5. Oculta `numberDiscover` posições e gera até
   `numberDiscover + 3` alternativas (corretas + distratores retirados dos valores visíveis).
   As alternativas numéricas carregam o **id da posição de origem** (não o valor) — a comparação
   é feita por id (ver §11, P-13).
3. **Validação:** `answerObjectSequence(index)` → se não há escolha selecionada ou a posição não
   é lacuna → `'noop'`; id divergente → `'wrong'` (a escolha é desselecionada, nada é gravado);
   id correto → resposta é registrada e a lacuna revelada → `'correct'`; se todas as lacunas
   foram preenchidas corretamente (`verifyResponse`) → `'complete'` e incrementa o contador de
   rodadas da modalidade. **Erros não são armazenados** — o aluno tenta até acertar.

### Rodada, meta e fim de fase

- Meta por rodada: `REQUIRED_RESPONSES = { sounds: 5, numbers: 5, forms: 5 }` (5 sequências
  completas).
- O cronômetro é **iniciado uma vez** (`tryAgain(start=true)` no mount) e **não é reiniciado**
  quando uma nova sequência é gerada após o acerto completo — a rodada inteira compartilha o tempo.
- **O fim de rodada ocorre somente pela expiração do cronômetro** (`goToFeedBack` é passado
  apenas como callback do timer). Ao atingir 5/5 não há navegação imediata — fluxo não
  finalizado (ver §11, P-01).
- No `goToFeedBack`: `success = responses >= required`; com sucesso e modo campanha marca a fase
  concluída; se a fase concluída for a **3** redireciona para `/game/unlock/:mode/:difficulty/`
  (peça do quebra-cabeça), senão para `/game/feedback`.

### Modos de jogo

- **Campanha:** progressão em cascata com gating (`campaignProgress`): Números exige todas as
  9 fases de Formas concluídas; Sons exige todas as de Números. Fases/dificuldades bloqueadas
  exibem cadeado (`SelectButton`).
- **Fase (treino):** qualquer dificuldade/fase livre, sem gating e sem desbloqueio de peças.
  Sempre inicia na fase `one`.

### Regras de desbloqueio de peças

- 1 peça por combinação (modalidade × dificuldade) concluída na campanha → 9 peças no total.
- `UnlockView` desbloqueia em `onMounted` e também chama `markPhaseCompleted` (idempotente).
- ⚠ A rota de unlock é acessível diretamente pela URL e desbloqueia sem jogar (§11, P-05).

---

## 6. Fluxos de navegação e dados

### Rotas (`src/router/index.js`)

```
/                                → DefaultLayout → HomeView                    (name: home-view)
/introduction/:gameType          → IntroductionView                            (name: introduction-view)
/game                            → GameLayout
  /game/forms/:difficulty/:phase/    → FormView     (name: forms-view)   ┐
  /game/numbers/:difficulty/:phase/  → NumberView   (name: numbers-view) ├ beforeEnter: validateGameParams
  /game/sounds/:difficulty/:phase    → SoundView    (name: sounds-view)  ┘ (redireciona / em params inválidos)
  /game/feedback/                    → FeedBackView (name: feedback-view)
  /game/unlock/:mode/:difficulty/    → UnlockView   (name: unlock-view)   (sem guard — §11, P-05)
```

Constantes de validação: `VALID_DIFFICULTIES = ['easy','medium','hard']`,
`VALID_PHASES = ['one','two','three']`.

⚠ **Não há rota catch-all (404)** e `:gameType` da introdução não é validado (§11, P-09).
⚠ Barras finais inconsistentes entre rotas (§11, P-14).

### Fluxo principal de navegação

```
HomeView ──(exit fade)──▶ /introduction/:gameType ──(clique em qualquer lugar)──▶ /game/:tipo/:dif/:fase
   │                                                                              │
   │                                      mount: tryAgain(true) → gera sequência + inicia timer + BGM
   │                                      respostas → feedback GSAP/som → 'complete' → nova sequência
   │                                      timer zera → goToFeedBack ──▶ /game/feedback
   │                                                                          │
   └──◀── "Voltar" (todas as telas voltam para /)                             │
                                              "Avançar" → getNextRoute: próxima fase → próxima
                                              dificuldade → próximo modo → home
                                              fase 3 campanha ──▶ /game/unlock/:modo/:dif
```

### Fluxos de dados principais

1. **Params de rota → config de jogo:** os game views leem `route.params.difficulty/phase` e
   buscam os params em `applicationStore.*Difficulties[difficulty]` (o guard impede valores
   inválidos nas rotas de jogo; a introdução **não valida** `gameType`).
2. **Sequência:** `sequenceStore` é a fonte única da partida; os componentes de view apenas
   renderizam `sequence`, `finalChoices` e `selectedChoice` e chamam as ações.
3. **Acertos:** `applicationStore.responses[mode]` é incrementado em cada `'complete'`;
   exibido como "X / 5" na tela de jogo e transformado em `gameStatus.hits/required` no
   `goToFeedBack`.
4. **Transição de tela:** `usePageTransition.exit()` (fade-in do overlay) é chamado manualmente
   antes de `router.push` a partir da Home e da Introdução; `App.vue` agenda `fadeOut` global em
   cada `router.afterEach`; os game views chamam `enter(1)` no mount.
5. **Progresso/peças:** `campaignProgress` (gating na Home/introdução) e `achievements`
   (PuzzleBoard/UnlockView) são lidos diretamente das stores nos componentes.

---

## 7. Gerenciamento de estado e persistência

- **Padrão Pinia:** todas as stores são *setup stores* (`defineStore('id', () => {...})`).
- `applicationStore` também expõe constantes `readonly()` (pools, dificuldades, histórias) —
  elas **não são estado reativo**, apenas dados estáticos publicados pela store.
- **Persistência — atualmente há 4 mecanismos distintos** (inconsistência conhecida, O-03):
  1. Plugin `pinia-plugin-persistedstate` (registrado em `main.js`): só `applicationStore`,
     com `pick: ['gameStatus']` e `localStorage` — sobrevive a reloads durante o jogo.
  2. `campaignProgress`: `localStorage` manual com chave `import.meta.env.VITE_CAMPAIGN_STORAGE_KEY`
     (`pcludico-campaign-progress` no `.env`), com try/catch no `JSON.parse`.
  3. `achievements`: `localStorage` manual com chave `VITE_ACHIEVEMENTS_STORAGE_KEY`
     (`pcludico-achievements`), **sem try/catch** (§11, P-08).
  4. Ad-hoc: `fontSize` (`useFontSize`) e `theme` (`AppHeader`).
- ⚠ `.env` está no `.gitignore`. Sem ele, ambas as chaves viram `undefined` e **as duas stores
  caem na mesma chave `"undefined"`**, sobrescrevendo-se mutuamente (§11, P-07).
- Dados de progresso **não têm versionamento de schema** — mudar o formato dos dados salvos
  quebrará progressos antigos dos alunos.

---

## 8. Bibliotecas e integrações

| Biblioteca | Onde é usada | Notas de integração |
| ---------- | ------------ | ------------------- |
| GSAP | `App.vue`, todos os componentes animados, `useTransitionOverlay/FeedbackAnimation`, `GameButton` | Padrão oficial: `gsap.context(...)` + `ctx.revert()` em `onUnmounted`. `usePageTransition` respeita `prefers-reduced-motion` |
| Tailwind CSS v4 | `assets/main.css` + todas as views | `@custom-variant dark (&:where(.dark, .dark *))` para dark mode por classe (documentação oficial v4); tema em `@theme` (`--color-purple`, `--font-sour-gummy`, `--animate-highlight`, `--animate-shake`); utilities v4 em uso: `bg-linear-to-b`, `rounded-4xl`, spacing dinâmico (`w-150`, `h-25`), `border-3`, `scale-98/97` |
| Vue Router 5 | rotas com layouts aninhados, guards, navegação por **nome** (`getNextRoute`) | Trailing slashes inconsistentes; sem catch-all |
| Pinia + persistedstate | todas as stores | `pick: ['gameStatus']` — sintaxe validada na doc v4 |
| @mdi/font | ícones `mdi mdi-*` em todos os SFCs | Webfont completa carregada em `main.js` |
| HTML5 Audio API | `stores/sounds.js` | Três instâncias `Audio` (SFX, BGM, feedback); encadeamento de sequência por `onended` |
| Fontes Google (Inter, Sour Gummy) | `@import` no `main.css` | Externas/render-blocking (O-04) |
| Vercel | `vercel.json` (rewrite SPA) | |

Não há chamadas HTTP a APIs externas, nem backend: o projeto é 100% cliente.

---

## 9. Convenções de desenvolvimento identificadas

- **Vue 3 Composition API com `<script setup>` em todos os SFCs** — sem Options API.
- **Props com validadores** (`mode`, `color`) e `defineEmits` explícitos.
- Emits nomeados em inglês, textos de UI em PT-BR, nomes de arquivos em camelCase
  (stores/composables/utils) e PascalCase (componentes/views).
- **Store de domínio + orquestração por composable:** views são quase declarativas; a lógica
  de partida fica em `useGameView` + `sequenceStore`.
- **Constantes de configuração congeladas** (`Object.freeze`) e centralizadas em
  `stores/application.js` — novas modalidades/parâmetros devem nascer ali, não nos views.
- Estilo de código imposto por **Prettier** (sem ponto-e-vírgula, aspas simples, 100 colunas)
  e lint em duas camadas (oxlint → ESLint com `eslint-config-prettier` desligando conflitos).
- Acesso ao alias `@/` em todos os imports internos.
- Idioma dos comentários: português.
- Commit messages em estilo conventional-ish misto (`FEAT:`, `FIX:`, `REFACTOR:` + texto livre).

---

## 10. Comandos disponíveis

```bash
npm run dev       # Vite dev server
npm run build     # Build de produção (vite build)
npm run preview   # Serve o build localmente
npm run lint      # run-s lint:oxlint lint:eslint  →  OXINT: oxlint . --fix  |  eslint . --fix --cache
npm run format    # prettier --write --experimental-cli src/
```

⚠ **Cuidados ao validar sem modificar arquivos:**
- `npm run lint` **modifica arquivos** (ambos os linters rodam com `--fix`). Para apenas
  inspecionar: `npx oxlint .` (sem `--fix`) e `npx eslint .` (sem `--fix`/`--cache`).
- `npx prettier --check src/` é seguro (somente leitura).
- `npm run build` só escreve em `dist/` (gitignored).
- **Não existem scripts de teste nem de verificação de tipos** — qualquer validação de lógica
  precisa ser manual ou introduzir Vitest (ver O-02).

---

## 11. Problemas conhecidos (comprovados no diagnóstico)

> Todos os itens abaixo foram **verificados no código** durante a análise técnica. Ao corrigir,
> reavalie o contexto atual — o projeto pode ter evoluído desde este levantamento.

| # | Prioridade | Problema | Arquivos |
| - | ---------- | -------- | -------- |
| **P-01** | 🔴 Crítica | **A rodada só termina quando o cronômetro zera.** `goToFeedBack` é passado exclusivamente como callback de expiração do timer; ao completar a 5ª sequência nada navega — o aluno fica ocioso até o tempo acabar. `isGoalReached()` e `getProgress()` existem e **nunca são chamados** (fluxo não finalizado) | `src/composables/useGameView.js` (32-61, 79-88); `src/stores/application.js` (279-285) |
| **P-02** | 🔴 Crítica | **Instruções trocadas entre modalidades:** `GAME_DESCRIPTIONS.sounds` descreve "sequência de números" e `GAME_DESCRIPTIONS.numbers` manda "escutar sons" — o card "Como jogar" exibe instrução errada em 2 das 3 modalidades | `src/stores/application.js` (222-226), consumido por `src/components/cards/GameDescription.vue` |
| **P-03** | 🟠 Alta | **Crash de áudio + "Repetir sons" desabilita para sempre:** se o aluno clica numa alternativa durante a repetição, `playAudio` zera `currentSequence`, mas o `onended` órfão dispara `playNext()` sobre `null` → `TypeError`; `sequenceIsPlaying` fica `true` | `src/stores/sounds.js` (62-91), interação com `src/views/games/SoundView.vue` (37-40) |
| **P-04** | 🟠 Alta | **Vídeo de 14,6 MB carregado na Home** sem `preload`/`poster` — download pesado ao abrir a página | `src/views/HomeView.vue` (183-189); `public/videos/tutorial.mp4` |
| **P-05** | 🟠 Alta | **Rota `/game/unlock/:mode/:difficulty/` desprotegida:** acesso direto pela URL desbloqueia peça e marca fase concluída sem jogar | `src/views/games/UnlockView.vue` (38-42); `src/router/index.js` (64-68) |
| **P-06** | 🟠 Alta | **`params.size` é configuração morta:** FormView e SoundView passam o literal `30` como tamanho, ignorando `size` (6/12/18 e 9/12/15); em formas difícil o resultado é 28 (nem 30 é exato). A curva de tamanho/dificuldade não tem efeito | `src/views/games/FormView.vue` (24-29); `src/views/games/SoundView.vue` (25-30); `src/stores/application.js` (params `size`) |
| **P-07** | 🟡 Média | **`.env` não versionado com chaves obrigatórias em build-time:** sem `.env`, `VITE_CAMPAIGN_STORAGE_KEY` e `VITE_ACHIEVEMENTS_STORAGE_KEY` viram `undefined` → **as duas stores caem na mesma chave `"undefined"`** e se sobrescrevem. Não há `.env.example`. Variáveis `VITE_` são embutidas no bundle (não são segredos; commit `ee45188` sugeriu o contrário) | `.env`, `.gitignore`; `src/stores/campaignProgress.js` (4); `src/stores/achievements.js` (5) |
| **P-08** | 🟡 Média | **`JSON.parse` sem try/catch em `loadAchievements`** → JSON corrompido derruba o boot do app. `campaignProgress` já trata isso — inconsistência entre stores irmãs | `src/stores/achievements.js` (8-14) vs `src/stores/campaignProgress.js` (21-31) |
| **P-09** | 🟡 Média | **Sem catch-all (404)** e `:gameType` da introdução não validado: `/introduction/foo` renderiza página vazia e o clique leva a rota inexistente (dead-end silencioso). Padrão oficial: catch-all `/:pathMatch(.*)*` | `src/router/index.js`; `src/views/IntroductionView.vue` (22, 52-56) |
| **P-10** | 🟡 Média | **Jogos não funcionam em telas estreitas:** grade fixa `grid-cols-4` + sequência em `grid-cols-10` com botões `min-w-20` (~800 px só na linha) → overflow horizontal; Home usa `w-2/5`/`w-3/5` sem breakpoint e `w-screen` (scrollbar horizontal no Windows) | `src/views/games/FormView.vue` (49, 79); `NumberView.vue` (51, 79); `SoundView.vue` (52, 87); `src/views/HomeView.vue` (181, 192, 220) |
| **P-11** | 🟡 Média | **Acessibilidade:** `<html lang="">` vazio; introdução navegável apenas por clique (sem `role="button"`, teclado ou foco); botões-ícone sem `aria-label`; vídeo sem legendas; botão "humano" do header sem handler e evento `openAccessibility` emitido **sem listener** (affordances mortas) | `index.html` (2); `src/views/IntroductionView.vue` (60-64); `src/components/layouts/GameHeader.vue` (19-43); `src/components/layouts/AppHeader.vue` (38-43) |
| **P-12** | 🟡 Média | **Números absurdos/negativos no jogo de Números:** operações incluem `*` com operando até 5 em cadeia (valores explodem) e `-` sem teto — sem salvaguardas pedagógicas | `src/utils/operation.js` (1-27); `src/stores/sequence.js` (130-156) |
| **P-13** | 🟢 Baixa | **Empate de valor correto em posições distintas (Números):** alternativas carregam o `id` da posição de origem; dois "5" de posições diferentes são escolhas distintas — o aluno pode "errar" escolhendo o valor certo visualmente | `src/stores/sequence.js` (158-192) |
| **P-14** | 🟢 Baixa | **Barras finais inconsistentes nas rotas** (`forms/:difficulty/:phase/` vs `sounds/:difficulty/:phase` vs `feedback/`) | `src/router/index.js` (42-67) |
| **P-15** | 🟢 Baixa | **Código morto:** `GAME_FLOW[].route` nunca lido; classe `.puzzle-board` sem uso; `usePageTransition(pageRef)` recebe parâmetro ignorado; `parseInt()` sobre ids já numéricos; assets sem referência (`success.mp3`, `grass/metal/plastic/water/wind/wood.mp3`) | `src/stores/application.js` (216-220); `src/assets/main.css` (97-100); `src/composables/useGameView.js` (23); `src/views/games/FormView.vue` (62); `public/sounds/` |
| **P-16** | 🟢 Baixa | **Curva de dificuldade inconsistente entre modalidades** (tempo de formas médio = fácil; fase "três" do difícil de formas = 40 s vs 90 s das demais) | `src/stores/application.js` (17-182) |

---

## 12. Oportunidades de melhoria (sugestões — não são defeitos)

> Itens de evolução levantados no diagnóstico. Nenhum deles foi implementado. Valide cada
> decisão contra o estado atual do código antes de executar.

| # | Prioridade | Oportunidade | Arquivos envolvidos | Impacto esperado |
| - | ---------- | ------------ | ------------------- | ---------------- |
| **O-01** | 🟠 Alta | Extrair um componente `GameBoard`/template compartilhado: FormView, NumberView e SoundView são ~85% idênticos (~100 linhas cada); `FeedBackView` e `UnlockView` duplicam literais de `backgrounds`/`templates` (~50 linhas iguais); triplicação de `disabled` computeds na Home | `src/views/games/*.vue`; `FeedBackView.vue` (80-113) vs `UnlockView.vue` (96-129); `HomeView.vue` (64-142) | Reduz ~250 linhas; um único ponto de mudança |
| **O-02** | 🟠 Alta | Adicionar testes (Vitest + @vue/test-utils + @pinia/testing): a lógica central é pura e ideal para testes (`sequence.js`, `operation.js`, `verifyResponse.js`, gating de `campaignProgress`) | `package.json` (novo script `test`) + novos `*.test.js` | Regressões sob controle; habilita refatorações seguras |
| **O-03** | 🟡 Média | Unificar persistência no plugin Pinia (hoje: 4 mecanismos) e versionar o schema dos dados salvos com migração | `campaignProgress.js` (36-38); `achievements.js` (16-18); `useFontSize.js` (27); `AppHeader.vue` (12) | Consistência; migrações futuras seguras |
| **O-04** | 🟡 Média | Hostear fontes (ex.: Fontsource) em vez de `@import` do Google Fonts — rede externa render-blocking; escolas com proxy/offline perdem a tipografia | `src/assets/main.css` (1-2) | Confiabilidade offline + LCP |
| **O-05** | 🟡 Média | Otimizar fundos animados: `SymbolsBackground` cria **50 elementos com timelines infinitas (≈ 200 tweens permanentes)** na Home e telas de feedback; pausar fora de viewport/aba, reduzir densidade | `src/components/decorators/SymbolsBackground.vue` (55-93) | Menos travamento em máquinas escolares antigas |
| **O-06** | 🟡 Média | Subir ESLint de `flat/essential` para `flat/recommended` e considerar plugin de a11y (`eslint-plugin-vuejs-accessibility`) | `src/../eslint.config.js` (25) | Captura itens do P-11 em CI |
| **O-07** | 🟡 Média | Endurecer o módulo de áudio: catch nas promessas de `play()` (autoplay policy) e limpeza do `onended` ao trocar de fonte | `src/stores/sounds.js` (19-26, 81-87) | Elimina exceções no console e o P-03 por construção |
| **O-08** | 🟢 Baixa | Tipagem mínima com JSDoc (`checkJs`) ou migração para TypeScript — hoje `jsconfig.json` só define o alias | `jsconfig.json` | Segurança em refatorações das configs de jogo |
| **O-09** | 🟢 Baixa | `<video>` com `preload="none"` + `poster` e legendas (`<track>`); carregamento de sons sob demanda | `HomeView.vue` (183-189) | Complementa P-04/P-11 |
| **O-10** | 🟢 Baixa | Rota catch-all 404 + validação de `gameType` na introdução | `src/router/index.js` | UX |

---

## 13. Cuidados técnicos para futuras implementações

1. **Fluxo de fim de rodada (P-01):** qualquer mudança de navegação na partida deve passar pelo
   `getNextRoute` da `applicationStore` — ele codifica a progressão fase → dificuldade → modo.
   Não duplique essa lógica nos views.
2. **IDs das alternativas:** a comparação acerto/erro é feita por `id`, e nos números o id
   codifica a **posição** de origem. Ao mexer na geração de alternativas (`sequence.js`),
   preserve essa invariância ou refatore a comparação para valores com cuidado (P-13).
3. **`mountObjectSequence` + `sortObjects`:** o molde é sorteado **com reposição** (padrões
   podem ter símbolos repetidos — intencional). A posição 0 nunca é ocultada
   (`getRandomIndexes`). Não "corrija" isso sem decisão de design.
4. **Timer:** `useTimeStamp.start` é guardado por `if (intervalId) return` — sempre `pause()`
   ou `reset()` antes de reiniciar. O callback de expiração é disparado **uma única vez**.
5. **Ciclo GSAP:** todo componente que anima deve usar `gsap.context(...)` + `ctx.revert()` no
   `onUnmounted` (padrão já estabelecido). Nunca crie tweens fora de context sem cleanup.
6. **Áudio:** as três instâncias `Audio` da `sounds` store são compartilhadas; trocar `src`
   durante um `playSequence` hoje causa estado órfão (P-03). Qualquer feature nova de som deve
   considerar isso.
7. **Tailwind v4:** a configuração é **CSS-first** (`main.css`), não há `tailwind.config.js`.
   Novas cores/animações devem entrar em `@theme` (e keyframes podem ficar dentro do `@theme`,
   como recomenda a doc). Dark mode por classe exige o `@custom-variant` já presente — não
   remova.
8. **Dark mode:** componentes precisam das variantes `dark:*` explicitamente (não herdam).
   O tema é alternado adicionando/removendo a classe `dark` em `<html>` (`AppHeader`).
9. **Persistência:** ao mudar o shape de `campaignProgress` ou `achievements`, version os dados
   salvos (hoje não há versionamento) — alunos reais têm progresso acumulado no `localStorage`.
10. **`.env`:** não assuma que as chaves de storage existem em novos ambientes (P-07). Valide
    o comportamento com `.env` ausente ou mova as chaves para constantes.
11. **Rotas:** ao adicionar rotas de jogo, reutilize `validateGameParams` (ou generalize-a) e
    navegue **por nome** (`{ name: 'forms-view', params: {...} }`), como faz `getNextRoute`.
    Considere adicionar catch-all 404 (P-09/O-10).
12. **i18n:** textos são hardcoded em PT-BR. Mudanças de copy nas instruções devem ser feitas
    em `GAME_DESCRIPTIONS`/`GAME_STORIES` (`application.js`) — nunca inline nos views
    (o P-02 mostra por quê).
13. **Lint/format:** rode `npm run format` e `npm run lint` **após** suas edições (eles aplicam
    `--fix`), mas atenção: isso modifica arquivos — em sessões read-only use as variantes sem
    `--fix` (§10).
14. **Node/Vite:** engines exigem Node ≥ 20.19 ou ≥ 22.12 (build do Vite 8). Vue Router está
    em major recente (5.x) — ao atualizar, teste guards e redirects.
15. **Acessibilidade:** novas telas devem manter `<button>` nativo (padrão atual), `lang`
    correto no documento, e considerar teclado/aria desde o início (P-11 é a dívida atual).

---

## 14. Diretrizes obrigatórias para agentes de IA

> **Estas diretrizes são vinculativas.** Qualquer agente de IA que trabalhar neste repositório
> deve segui-las em todas as tarefas, sem exceção. Em caso de conflito entre uma sugestão
> automática (ou uma prática genérica) e estas diretrizes, prevalecem as diretrizes.

1. **Preservar as funcionalidades existentes durante refatorações.**
   Refatorar significa mudar a estrutura sem mudar o comportamento. O fluxo de jogo (§5), o
   ciclo de geração/validação de sequências (`sequence.js`) e a progressão de rotas
   (`getNextRoute`) devem continuar funcionando exatamente como antes. Como **não há testes
   automatizados** (ver O-02), valide manualmente as três modalidades (Formas, Números e Sons)
   após qualquer refatoração.

2. **Não remover recursos, componentes ou comportamentos sem autorização explícita do
   mantenedor.**
   Isso vale inclusive para o que o diagnóstico apontou como "código morto" (§11, P-15 — ex.:
   `isGoalReached`, `getProgress`, `getNextDifficulty`, assets de som sem referência): parte
   desses itens evidencia fluxos **planejados mas não finalizados** (ver P-01), e não código
   a descartar. A remoção é decisão do mantenedor, nunca automática.

3. **Não instalar, remover ou atualizar dependências sem aprovação.**
   O `package.json` está em versões de ponta verificadas (§2). Qualquer mudança de dependência
   altera o bundle entregue a máquinas escolares e deve ser proposta e aprovada antes de
   executar `npm install`, `npm uninstall`, `npm update` ou editar o `package.json`.

4. **Consultar Context7 e o Vue Docs MCP para verificar APIs e práticas** relacionadas às
   versões efetivamente instaladas antes de escrever código. Não presuma sintaxe de memória:
   majors recentes (Vue Router 5, Tailwind 4, Vite 8) têm diferenças reais em relação às
   versões anteriores, e a validade de cada API depende da versão em `node_modules` (§2).

5. **Priorizar documentação oficial e soluções compatíveis com Vue 3 e Tailwind CSS 4.**
   Prefira os padrões documentados: Composition API + `<script setup>` (doc oficial do Vue 3),
   configuração CSS-first com `@theme`/`@custom-variant` (doc oficial do Tailwind v4),
   `gsap.context()` + `revert()` (doc do GSAP). Nunca aplique de memória soluções de Vue 2 ou
   Tailwind v3.

6. **Respeitar a arquitetura, as convenções e as regras de negócio existentes** (§3–§9, §13):
   configurações de jogo centralizadas e congeladas em `stores/application.js`, navegação por
   **nome de rota** via `getNextRoute`, stores em formato setup, `gsap.context()` + `revert()`
   em todo componente animado, textos de UI em PT-BR em `GAME_DESCRIPTIONS`/`GAME_STORIES`
   (nunca inline nos views), Prettier/ESLint/oxlint como definição de estilo.

7. **Priorizar componentes reutilizáveis e separação de responsabilidades.**
   O principal débito estrutural identificado é a duplicação (O-01): FormView, NumberView e
   SoundView são ~85% idênticos, e FeedBackView/UnlockView duplicam literais. Qualquer trabalho
   nas telas de jogo deve caminhar na direção de um template compartilhado — nunca replique
   cópias existentes para "resolver rápido".

8. **Considerar responsividade, acessibilidade e desempenho em todas as alterações visuais.**
   Referências do diagnóstico: P-10 (telas estreitas/overflow), P-11 (acessibilidade — `lang`,
   teclado, `aria-label`, legendas), O-05 (fundos animados pesados) e O-04 (fontes externas).
   O público-alvo são estudantes da Educação Básica, em dispositivos e conexões variados; uma
   alteração visual que degrada qualquer um desses três aspectos não deve ser entregue.

9. **Não introduzir bibliotecas ou abstrações desnecessárias.**
   O projeto é deliberadamente minimalista: Vue 3 + Pinia + Tailwind 4 + GSAP, componentes
   próprios e `<button>` nativo (§2). Não traga frameworks de UI, gerenciadores de estado
   alternativos, CSS-in-JS ou utilitários genéricos. Toda nova dependência é exceção e depende
   da diretriz 3.

10. **Atualizar este `AGENTS.md` quando a mudança for relevante.**
    Ao concluir qualquer alteração que mude a arquitetura, as dependências, os comandos, as
    regras de negócio ou as listas de problemas/oportunidades (§11–§12), atualize as seções
    correspondentes (incluindo a data de "Última verificação" no topo). Documentação
    desatualizada invalida o propósito deste arquivo.

---

## 15. Como este documento foi produzido

- Leitura integral de `src/` (todas as stores, composables, utils, views, componentes,
  layouts, router, `main.css`), de `index.html`, `vite.config.js`, `eslint.config.js`,
  `jsconfig.json`, `vercel.json`, `package.json`, `.env`, `.oxlintrc.json`, `.prettierrc.json`,
  `.gitignore`, `README.md` e inventário de `public/`.
- Versões confirmadas lendo os `package.json` de `node_modules` (não inferidas do semver do
  `package.json`).
- Padrões de API validados contra documentação oficial via MCPs: Vue Docs MCP (composables,
  template refs) e Context7 (pinia-plugin-persistedstate, Vue Router, Tailwind CSS v4, GSAP).
- Problemas marcados como **comprovados** foram rastreados até linhas específicas do código;
  itens de **melhoria** são sugestões de evolução e exigem decisão antes da implementação.
