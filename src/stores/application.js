import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'

const SOUND_OBJECTS = Object.freeze([
  { id: 1, path: '/sounds/cat.mp3', name: 'som de gato' },
  { id: 2, path: '/sounds/cow.mp3', name: 'som de vaca' },
  { id: 3, path: '/sounds/dog.mp3', name: 'som de cachorro'},
  { id: 4, path: '/sounds/drum.mp3', name: 'som de bateria'},
  { id: 5, path: '/sounds/elephant.mp3', name: 'som de elefante'},
  { id: 6, path: '/sounds/frog.mp3', name: 'som de sapo'},
  { id: 7, path: '/sounds/guitar.mp3', name: 'som de violão'},
  { id: 8, path: '/sounds/horse.mp3', name: 'som de cavalo'},
  { id: 9, path: '/sounds/piano.mp3', name: 'som de piano'},
  { id: 10, path: '/sounds/saxofone.mp3', name: 'som de saxofone'},
])

const SOUND_DIFFICULTIES = Object.freeze({
  easy: Object.freeze({
    id: 1,
    title: 'Fácil',
    description:
      'Você terá 1 minuto e 30 segundos para adivinhar o som que falta na sequência, clique no som que você queira descobrir e responda até acertar todos os 5 padrões',
    howToUse:
      'Na sequência abaixo das opções de resposta você terá um padrão de repetições de 3 sons diferentes, você terá que descobrir o único som que está faltando e que possui um ? e é indicado pelo som semelhante à uma notificação. Selecione ele e responda com as opções que estão abaixo.',
    params: Object.freeze({
      difficulty: 'easy',
      numberSounds: 3,
      size: 9,
      discover: 1,
      timeLimit: {
        one: 90,
        two: 60,
        three: 30,
      },
    }),
  }),
  medium: Object.freeze({
    id: 2,
    title: 'Médio',
    description:
      'Você terá 1 minuto e 30 segundos para adivinhar os 2 sons que faltam na sequência, clique no som que você queira descobrir e responda até acertar todos os 5 padrões',
    howToUse:
      'Na sequência abaixo das opções de resposta você terá um padrão de repetições de 4 sons diferentes, você terá que descobrir os 2 sons que estão faltando, que possuem um ícone ? e são indicados pelo som semelhante à uma notificação. Selecione qual você quer e responda com as opções que estão abaixo.',
    params: Object.freeze({
      difficulty: 'medium',
      numberSounds: 4,
      size: 12,
      discover: 2,
      timeLimit: {
        one: 90,
        two: 60,
        three: 30,
      },
    }),
  }),
  hard: Object.freeze({
    id: 3,
    title: 'Difícil',
    description:
      'Você terá 2 minutos e 30 segundos para adivinhar os 3 sons que faltam na sequência, clique no som que você queira descobrir e responda até acertar todos os 5 padrões',
    howToUse:
      'Na sequência abaixo das opções de resposta você terá um padrão de repetições de 5 sons diferentes, você terá que descobrir os 3 sons que estão faltando, que possuem um ícone ? e são indicados pelo som semelhante à uma notificação. Selecione qual você quer e responda com as opções que estão abaixo.',
    params: Object.freeze({
      difficulty: 'hard',
      numberSounds: 5,
      size: 15,
      discover: 3,
      timeLimit: {
        one: 150,
        two: 120,
        three: 90,
      },
    }),
  }),
})

const NUMBER_DIFFICULTIES = Object.freeze({
  easy: Object.freeze({
    id: 1,
    title: 'Fácil',
    params: Object.freeze({
      difficulty: 'easy',
      length: 6,
      amountOperations: 2,
      maxOperator: 5,
      maxStart: 5,
      numberDiscover: 1,
      timeLimit: {
        one: 90,
        two: 60,
        three: 30,
      },
    }),
  }),
  medium: Object.freeze({
    id: 2,
    title: 'Médio',
    params: Object.freeze({
      difficulty: 'medium',
      length: 8,
      amountOperations: 3,
      maxOperator: 5,
      maxStart: 5,
      numberDiscover: 2,
      timeLimit: {
        one: 120,
        two: 90,
        three: 60,
      },
    }),
  }),
  hard: Object.freeze({
    id: 3,
    title: 'Difícil',
    params: Object.freeze({
      difficulty: 'hard',
      length: 10,
      amountOperations: 4,
      maxOperator: 5,
      maxStart: 5,
      numberDiscover: 3,
      timeLimit: {
        one: 150,
        two: 120,
        three: 90,
      },
    }),
  }),
})

const FORM_SYMBOLS = Object.freeze([
  {
    id: 1,
    name: 'Abutre',
    icon: '/imgs/icons/abutre.svg',
    color: '#FF6357',
    background: '#FF9E97',
  },
  {
    id: 2,
    name: 'Vaso Canopo',
    icon: '/imgs/icons/canopo.svg',
    color: '#87CE57',
    background: '#BFFF95',
  },
  {
    id: 3,
    name: 'Egípcio',
    icon: '/imgs//icons/egipcio.svg',
    color: '#AC37FF',
    background: '#D599FF',
  },
  {
    id: 4,
    name: 'Esfinge',
    icon: '/imgs//icons/esfinge.svg',
    color: '#D5C359',
    background: '#FBE97D',
  },
  { id: 5, name: 'Pilo', icon: '/imgs//icons/pilo.svg', color: '#44BBFF', background: '#A0DCFF' },
])

const FORM_DIFFICULTIES = Object.freeze({
  easy: Object.freeze({
    id: 1,
    title: 'Fácil',
    timeLimit: {
      one: 90,
      two: 60,
      three: 30,
    },
    params: Object.freeze({ difficulty: 'easy', numberForms: 2, size: 6, discovers: 1 }),
  }),
  medium: Object.freeze({
    id: 2,
    title: 'Médio',
    timeLimit: {
      one: 90,
      two: 60,
      three: 30,
    },
    params: Object.freeze({ difficulty: 'medium', numberForms: 3, size: 12, discovers: 2 }),
  }),
  hard: Object.freeze({
    id: 3,
    title: 'Difícil',
    timeLimit: {
      one: 90,
      two: 60,
      three: 30,
    },
    params: Object.freeze({ difficulty: 'hard', numberForms: 4, size: 18, discovers: 3 }),
  }),
})

const REQUIRED_RESPONSES = Object.freeze({ sounds: 5, numbers: 5, forms: 5 })

const GAME_STORIES = Object.freeze({
  forms: Object.freeze({
    title: 'Mistérios do Egito Antigo',
    subtitle: 'Desvende os enigmas das pirâmides',
    paragraphs: Object.freeze([
      'Há milhares de anos, no coração do deserto egípcio, as grandes pirâmides foram erguidas não apenas como tumbas, mas como guardiãs de um conhecimento sagrado que atravessa os séculos.',
      'Diz a lenda que os deuses egípcios esconderam mensagens nas formas geométricas que adornam templos e monumentos. Cada símbolo — o abutre, o vaso canopo, o egípcio, a esfinge e o pilo — carrega um fragmento de uma verdade ancestral esperando para ser revelada.',
      'O faraó precisa de você para decifrar essas formas e restaurar a harmonia entre o mundo dos vivos e o reino dos deuses. Preste atenção nas sequências sagradas e descubra os padrões ocultos antes que o tempo se esgote.',
    ]),
  }),
  numbers: Object.freeze({
    title: 'O Código da Civilização',
    subtitle: 'Decodifique a mensagem dos deuses',
    paragraphs: Object.freeze([
      'Em uma civilização avançada que existiu muito antes de nós, os números eram considerados a linguagem universal do universo. Para eles, tudo podia ser compreendido através de padrões matemáticos e sequências numéricas.',
      'Quando essa civilização desapareceu, deixou para trás um legado codificado — transmissões de números que, quando decifradas, revelam conhecimentos extraordinários sobre o cosmos e a própria existência.',
      'Você foi selecionado para decodificar essas transmissões. Descubra os números que faltam nas sequências e desvende os segredos que podem transformar nossa compreensão do mundo.',
    ]),
  }),
  sounds: Object.freeze({
    title: 'A Sinfonia Perdida',
    subtitle: 'Ajude a banda a completar a música',
    paragraphs: Object.freeze([
      'No movimentado bairro boêmio da cidade, uma banda de jovens músicos ensaiava sua grande obra — uma sinfonia que misturava sons da natureza com instrumentos modernos. Mas algo misterioso aconteceu: parte da música simplesmente desapareceu.',
      'Dizem que um espírito musical travesso espalhou os sons perdidos pela vizinhança. Agora, a banda precisa de alguém com ouvidos atentos para reconstruir a melodia e encontrar cada nota desaparecida.',
      'Ouça com atenção as sequências de instrumentos e sons da natureza. Identifique o som que falta em cada padrão e ajude a banda a terminar sua obra-prima antes do grande festival de música.',
    ]),
  }),
})

const GAME_FLOW = [
  Object.freeze({ mode: 'forms', route: '/forms/:difficulty/:phase/' }),
  Object.freeze({ mode: 'sounds', route: '/sounds/:difficulty/:phase/' }),
  Object.freeze({ mode: 'numbers', route: '/numbers/:difficulty/:phase/' }),
]

export const useApplicationStore = defineStore('applicationStore', () => {
  const soundResponses = ref(0)
  const numberResponses = ref(0)
  const formResponses = ref(0)

  const soundProgress = computed(() => `${soundResponses.value}/${REQUIRED_RESPONSES.sounds}`)

  const numberProgress = computed(() => `${numberResponses.value}/${REQUIRED_RESPONSES.numbers}`)

  const formProgress = computed(() => `${formResponses.value}/${REQUIRED_RESPONSES.forms}`)

  const isSoundGoalReached = computed(() => soundResponses.value >= REQUIRED_RESPONSES.sounds)

  const isNumberGoalReached = computed(() => numberResponses.value >= REQUIRED_RESPONSES.numbers)

  const isFormGoalReached = computed(() => formResponses.value >= REQUIRED_RESPONSES.forms)

  function incrementSoundResponses() {
    soundResponses.value++
  }
  function incrementNumberResponses() {
    numberResponses.value++
  }
  function incrementFormResponses() {
    formResponses.value++
  }

  function resetSoundResponses() {
    soundResponses.value = 0
  }
  function resetNumberResponses() {
    numberResponses.value = 0
  }
  function resetFormResponses() {
    formResponses.value = 0
  }

  function getNextRoute({ mode, difficulty, phase, success }) {
    if (!success) {
      return {
        name: `${mode}-view`,
        params: { difficulty, phase },
      }
    }

    const difficultiesOrder = ['easy', 'medium', 'hard']
    const phaseOrder = ['one', 'two', 'three']
    const currentDifficultyIndex = difficultiesOrder.indexOf(difficulty)
    const currentPhaseIndex = phaseOrder.indexOf(phase)

    if(currentPhaseIndex < phaseOrder.length - 1) {
      return {
        name: `${mode}-view`,
        params: { difficulty, phase: phaseOrder[currentPhaseIndex + 1]}
      }
    }

    if (currentDifficultyIndex < difficultiesOrder.length - 1) {
      return {
        name: `${mode}-view`,
        params: { difficulty: difficultiesOrder[currentDifficultyIndex + 1], phase: 'one' },
      }
    }

    const currentModeIndex = GAME_FLOW.findIndex((g) => g.mode === mode)

    if (currentModeIndex < GAME_FLOW.length - 1) {
      return {
        name: `${GAME_FLOW[currentModeIndex + 1].mode}-view`,
        params: {
          difficulty: 'easy',
          phase: 'one'
        },
      }
    }

    return { name: 'home-view' }
  }

  function repeatLevelRoute({ mode, difficulty, phase }) {
    return {
      name: `${mode}-view`,
      params: { difficulty, phase },
    }
  }

  return {
    soundResponses,
    numberResponses,
    formResponses,

    soundObjects: readonly(SOUND_OBJECTS),
    soundDifficulties: readonly(SOUND_DIFFICULTIES),
    numberDifficulties: readonly(NUMBER_DIFFICULTIES),
    formSymbols: readonly(FORM_SYMBOLS),
    formDifficulties: readonly(FORM_DIFFICULTIES),
    requiredResponses: readonly(REQUIRED_RESPONSES),
    gameStories: readonly(GAME_STORIES),

    soundProgress,
    numberProgress,
    formProgress,
    isSoundGoalReached,
    isNumberGoalReached,
    isFormGoalReached,

    incrementSoundResponses,
    incrementNumberResponses,
    incrementFormResponses,
    resetSoundResponses,
    resetNumberResponses,
    resetFormResponses,
    getNextRoute,
    repeatLevelRoute,
  }
})
