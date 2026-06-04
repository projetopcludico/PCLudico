<script setup>
import GameButton from '@/components/buttons/GameButton.vue'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useApplicationStore } from '@/stores/application'
import { useSequenceStore } from '@/stores/sequence'
import { useTimeStamp } from '@/stores/timeStamp'
const applicationStore = useApplicationStore()
const sequenceStore = useSequenceStore()
const timeStamp = useTimeStamp()

import { useRoute, useRouter } from 'vue-router'
import { usePageTransition } from '@/composables/usePageTransition'
const route = useRoute()
const router = useRouter()

const pageRef = ref(null)
const { enter } = usePageTransition(pageRef)

const difficulty = computed(() => {
  if (route.params.difficulty === 'easy') return 'Fácil'
  if (route.params.difficulty === 'medium') return 'Médio'
  if (route.params.difficulty === 'hard') return 'Difícil'

  return ''
})

function goToFeedBack() {
  if (
    route.params.phase === 'three' &&
    applicationStore.formResponses >= applicationStore.requiredResponses.forms
  ) {
    router.push({
      name: 'unlock-view',
      params: {
        mode: 'forms',
        difficulty: route.params.difficulty,
      },
    })
  } else {
    router.push({
      name: 'feedback-view',
      params: {
        hits: applicationStore.formResponses,
        required: applicationStore.requiredResponses.forms,
        mode: 'forms',
        difficulty: route.params.difficulty,
        phase: route.params.phase,
      },
    })
  }
}

function tryAgain() {
  const currentDifficulty = route.params.difficulty
  const currentPhase = route.params.phase
  const params = applicationStore.formDifficulties[currentDifficulty].params
  const timeLimit = applicationStore.formDifficulties[currentDifficulty].timeLimit[currentPhase]

  sequenceStore.mountObjectSequence(
    params.numberForms,
    25,
    params.discovers,
    applicationStore.formSymbols,
  )

  timeStamp.start(true, timeLimit, goToFeedBack)
}

onMounted(async () => {
  tryAgain()
  await nextTick()
  enter(1)
})

onUnmounted(() => {
  timeStamp.reset()
  applicationStore.resetFormResponses()
})
</script>

<template>
  <div
    ref="pageRef"
    class="flex flex-col gap-20 p-10 min-h-screen bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.65)),url('/imgs/backgrounds/egypt-background.svg')] bg-cover bg-center"
  >
    <section class="flex items-center justify-between text-4xl text-zinc-200">
      <span class="mdi mdi-home cursor-pointer" @click="router.push('/')"></span>
      <h1 class="bg-black/50 rounded-xl px-6 py-2">Jogo de Formas: Nível {{ difficulty }}</h1>
      <span class="mdi mdi-cog cursor-pointer"></span>
    </section>
    <section class="grid grid-cols-4 gap-20">
      <div class="flex flex-col gap-5 col-span-1 px-5 text-white">
        <h2 class="font-bold">Tempo restante: {{ timeStamp.formattedTime }}</h2>
        <p class="text-justify">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, dolore facilis?
          Doloremque magnam ex blanditiis minus illo molestias libero accusantium vero eius
          voluptate. Commodi error in autem delectus asperiores et Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Adipisci aliquid consequatur illo voluptatem praesentium
          sequi eum qui temporibus velit, doloremque natus delectus ipsum eligendi. Ipsa ratione
          quis nisi sequi fugiat.
        </p>
      </div>
      <div class="flex flex-col items-center gap-10 col-span-3">
        <h2 class="text-white text-2xl font-semibold">Alternativas</h2>
        <div class="flex justify-center gap-5 bg-zinc-400/80 p-5 rounded-3xl">
          <GameButton
            v-for="(symbol, index) of sequenceStore.finalChoices"
            :key="index"
            :icon="symbol.icon"
            :color="symbol.color"
            :background="symbol.background"
            @select="sequenceStore.selectChoice(symbol)"
            :selected="sequenceStore.selectedChoice?.id === parseInt(symbol.id)"
            class="cursor-pointer"
          />
        </div>
        <div class="flex justify-center flex-wrap gap-5">
          <GameButton
            v-for="(symbol, index) in sequenceStore.sequence"
            :key="index"
            :icon="symbol.object.icon"
            :color="symbol.object.color"
            :background="symbol.object.background"
            :name="symbol.object.name"
            :class="[
              sequenceStore.selectedChoice && symbol.object.name === 'discover' && 'animate-shake',
            ]"
            @select="sequenceStore.answerObjectSequence(index, 'forms', tryAgain)"
          />
        </div>
        <div class="text-white text-2xl">
          <p>
            Acertos: {{ applicationStore.formResponses }}/{{
              applicationStore.requiredResponses.forms
            }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
