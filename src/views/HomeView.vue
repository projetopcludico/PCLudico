<script setup>
import { computed, ref } from 'vue'
import AppButton from '@/components/buttons/AppButton.vue'
import CellingWaves from '@/components/decorators/CellingWaves.vue'
import SelectButton from '@/components/buttons/SelectButton.vue'
import AdventureCard from '@/components/cards/AdventureCard.vue'

import { useRouter } from 'vue-router'
import { usePageTransition } from '@/composables/usePageTransition'
const router = useRouter()

const pageRef = ref(null)
const { exit } = usePageTransition(pageRef)

const gameMode = ref('campaign')
const gameDifficulty = ref('easy')
const gameType = ref('forms')

const gameConfig = [
  {
    title: '1. Modo de Jogo',
    titleClass: 'text-purple dark:text-purple-dark',
    buttons: [
      {
        text: 'Campanha',
        icon: 'mdi mdi-trophy',
        color: 'purple',
        selected: computed(() => gameMode.value === 'campaign'),
        click: () => (gameMode.value = 'campaign'),
      },
      {
        text: 'Fase',
        icon: 'mdi mdi-flag',
        color: 'purple',
        selected: computed(() => gameMode.value === 'phase'),
        click: () => (gameMode.value = 'phase'),
      },
    ],
  },
  {
    title: '2. Nível de Dificuldade',
    titleClass: 'text-red',
    buttons: [
      {
        text: 'Fácil',
        icon: 'mdi mdi-emoticon-happy-outline',
        color: 'red',
        selected: computed(() => gameDifficulty.value === 'easy'),
        click: () => (gameDifficulty.value = 'easy'),
      },
      {
        text: 'Médio',
        icon: 'mdi mdi-emoticon-neutral-outline',
        color: 'red',
        selected: computed(() => gameDifficulty.value === 'medium'),
        click: () => (gameDifficulty.value = 'medium'),
      },
      {
        text: 'Difícil',
        icon: 'mdi mdi-emoticon-sad-outline',
        color: 'red',
        selected: computed(() => gameDifficulty.value === 'hard'),
        click: () => (gameDifficulty.value = 'hard'),
      },
    ],
  },
  {
    title: '2. Tipo de Jogo',
    titleClass: 'text-orange',
    buttons: [
      {
        text: 'Formas',
        icon: 'mdi mdi-shape-outline',
        color: 'orange',
        selected: computed(() => gameType.value === 'forms'),
        click: () => (gameType.value = 'forms'),
      },
      {
        text: 'Números',
        icon: 'mdi mdi-calculator-variant-outline',
        color: 'orange',
        selected: computed(() => gameType.value === 'numbers'),
        click: () => (gameType.value = 'numbers'),
      },
      {
        text: 'Sons',
        icon: 'mdi mdi-music-note',
        color: 'orange',
        selected: computed(() => gameType.value === 'sounds'),
        click: () => (gameType.value = 'sounds'),
      },
    ],
  },
]

const cards = [
  {
    title: 'Ajude a desvendar mistérios antigos!',
    image: '/imgs/cards/piramide.svg',
    description:
      'Preste atenção na sequência e desvende enigmas escondidos nas pirâmides do Egito.',
  },
  {
    title: 'Decodifique e descubra a mensagem!',
    image: '/imgs/cards/maquina.svg',
    description:
      'Ajude cientististas a descobrir a transmissão que uma civilização avançada deixou.',
  },
  {
    title: 'Ajude a compor a música da banda',
    image: '/imgs/cards/musica.svg',
    description:
      'Preste atenção na sequência de instrumentos e animais, e ajude a banda a terminar a música',
  },
]

async function goToGame() {
  await exit()
  router.push({
    name: 'introduction-view',
    params: { gameType: gameType.value },
    query: { difficulty: gameDifficulty.value, mode: gameMode.value },
  })
}
</script>
<template>
  <section ref="pageRef" class="h-full w-full">
    <div
      class="flex flex-col items-center gap-20 shadow-lg bg-linear-to-b from-white to-blue px-5 py-2 dark:from-slate-900 dark:to-purple-dark md:px-20 md:py-10"
    >
      <video
        controls
        src="/videos/tutorial.mp4"
        class="flex flex-col justify-center h-full items-center shadow-xl bg-white rounded-4xl dark:bg-slate-900 dark:text-white"
      >
        <span class="mdi mdi-play text-6xl"></span>
      </video>
      <div
        class="w-full flex flex-col items-center gap-10 bg-gray-100 rounded-4xl dark:bg-slate-900 p-8"
      >
        <h1 class="text-2xl font-semibold tracking-widest uppercase">Configure sua aventura</h1>
        <ul
          class="w-full flex flex-col items-center gap-10 md:flex-row md:justify-center md:items-start"
        >
          <li
            class="w-full flex flex-col gap-4 md:w-1/4 md:"
            v-for="(config, index) in gameConfig"
            :key="index"
          >
            <h2 :class="['text-lg font-bold', config.titleClass]">{{ config.title }}</h2>
            <SelectButton
              v-for="(button, index) in config.buttons"
              :key="index"
              :text="button.text"
              :icon="button.icon"
              :selected="button.selected.value"
              :color="button.color"
              @select="button.click"
            />
          </li>
        </ul>
        <div class="w-1/2 flex justify-center">
          <AppButton text="Jogar" mode="blue" @on-click="goToGame" />
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <CellingWaves color-class="fill-blue dark:fill-purple-dark" />
      <div class="flex flex-col gap-10 px-5 py-20 md:py-40 lg:flex-row md:px-20">
        <AdventureCard
          v-for="(card, index) in cards"
          :key="index"
          :title="card.title"
          :image="card.image"
          :description="card.description"
        />
      </div>
    </div>
    <div class="flex flex-col items-center px-5 md:px-20">
      <h1 class="text-2xl font-semibold tracking-widest uppercase">complete todas as conquistas</h1>
      
    </div>
  </section>
</template>
