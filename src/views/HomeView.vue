<script setup>
import { computed, ref } from 'vue'
import AppButton from '@/components/buttons/AppButton.vue'
import SelectButton from '@/components/buttons/SelectButton.vue'
import AdventureCard from '@/components/cards/AdventureCard.vue'
import InstructionCard from '@/components/cards/InstructionCard.vue'
import SimbolsBackground from '@/components/decorators/SimbolsBackground.vue'

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
    <div class="flex flex-col items-center gap-20 bg-linear-to-b px-5 py-2 md:px-20 md:py-10">
      <div class="w-screen relative flex justify-center">
        <SimbolsBackground />
        <video
          controls
          src="/videos/tutorial.mp4"
          class="relative z-20 flex flex-col justify-center w-2/3 h-full items-center bg-white rounded-4xl dark:bg-slate-900 dark:text-white"
        >
          <span class="mdi mdi-play text-6xl"></span>
        </video>
      </div>
      <div class="w-full flex gap-20 dark:bg-slate-900 py-6">
        <div class="flex flex-col gap-5 w-2/5">
          <h2 class="font-sour-gummy font-bold uppercase text-5xl text-gray-500">
            configure sua aventura!
          </h2>
          <InstructionCard step="1" color="purple">
            <template #text>
              <p class="text-gray-500 font-semibold">
                Escolha o <span class="text-purple">modo</span> que você quer jogar:
                <span class="text-purple">fase ou campanha.</span>
              </p>
            </template>
          </InstructionCard>
          <InstructionCard step="2" color="red">
            <template #text>
              <p class="text-gray-500 font-semibold">
                Selecione o nível do jogo: <span class="text-red">fácil, médio ou difícil.</span>
              </p>
            </template>
          </InstructionCard>
          <InstructionCard step="3" color="orange">
            <template #text>
              <p class="text-gray-500 font-semibold">
                Por último, escolha o tipo de jogo:  <span class="text-dark-orange">formas, números ou sons.</span>
              </p>
            </template>
          </InstructionCard>
        </div>
        <div class="flex flex-col gap-5 items-center w-3/5 border-2 border-blue rounded-2xl py-8">
          <ul class="w-full flex justify-center divide-x-2 divide-gray-200">
            <li
              class="w-full flex flex-col gap-4 md:h-full px-8"
              v-for="(config, index) in gameConfig"
              :key="index"
            >
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
          <div class="w-full px-8">
            <AppButton text="Iniciar Jogo" mode="blue" @on-click="goToGame" />
          </div>
        </div>
      </div>
    </div>
    <div class="relative z-10 flex flex-col items-center gap-10 pt-30 border-t-2 border-gray-200 mx-20 mt-20">
      <h1 class="font-sour-gummy uppercase font-bold text-5xl text-gray-500">descubra novas histórias</h1> 
      <div class="flex flex-col gap-10 px-5 py-20 md:py-40 lg:flex-row">
        <AdventureCard
          v-for="(card, index) in cards"
          :key="index"
          :title="card.title"
          :image="card.image"
          :description="card.description"
        />
      </div>
    </div>
  </section>
</template>
