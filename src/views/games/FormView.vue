<script setup>
import GameButton from '@/components/buttons/GameButton.vue'
import GameHeader from '@/components/layouts/GameHeader.vue'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useApplicationStore } from '@/stores/application'
import { useSequenceStore } from '@/stores/sequence'
import { useTimeStamp } from '@/stores/timeStamp'
import { useAudioStore } from '@/stores/sounds'
import { useFeedbackAnimation } from '@/composables/useFeedbackAnimation'
const applicationStore = useApplicationStore()
const sequenceStore = useSequenceStore()
const timeStamp = useTimeStamp()
const audioStore = useAudioStore()

import { useRoute, useRouter } from 'vue-router'
import { usePageTransition } from '@/composables/usePageTransition'
const route = useRoute()
const router = useRouter()

const pageRef = ref(null)
const { enter } = usePageTransition(pageRef)
const sequenceRefs = ref([])
const { playCorrectFeedback, playWrongFeedback } = useFeedbackAnimation(sequenceRefs)

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

function onAnswer(index) {
  const result = sequenceStore.answerObjectSequence(index, 'forms')
  if (result === 'correct' || result === 'complete') {
    audioStore.playFeedback('correct')
    if (sequenceRefs.value[index]) playCorrectFeedback(index)
    if (result === 'complete') {
      timeStamp.pause()
      setTimeout(() => tryAgain(), 1500)
    }
  } else if (result === 'wrong') {
    audioStore.playFeedback('error')
    playWrongFeedback(index)
  }
}

function handleSelect(choice) {
  sequenceStore.selectChoice(choice)
  audioStore.playAudio(choice.path)
}

onMounted(async () => {
  tryAgain()
  audioStore.playBackground('forms')
  await nextTick()
  enter(1)
})

onUnmounted(() => {
  timeStamp.reset()
  applicationStore.resetFormResponses()
  audioStore.stopBackground()
})
</script>

<template>
  <div
    ref="pageRef"
    class="flex flex-col gap-20 p-10 min-h-screen bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.65)),url('/imgs/backgrounds/egypt-background.svg')] bg-cover bg-center"
  >
    <GameHeader :title="`Jogo de Formas: Nível ${difficulty}`" />
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
            :svg="true"
            @select="handleSelect(symbol)"
            :selected="sequenceStore.selectedChoice?.id === parseInt(symbol.id)"
            class="cursor-pointer"
          />
        </div>
        <div class="flex justify-center flex-wrap gap-5">
          <GameButton
            v-for="(symbol, index) in sequenceStore.sequence"
            :key="index"
            :ref="
              (el) => {
                if (el) sequenceRefs[index] = el.$el || el
              }
            "
            :icon="symbol.object.icon"
            :color="symbol.object.color"
            :background="symbol.object.background"
            :name="symbol.object.name"
            :svg="symbol.object.name !== 'discover'"
            :class="[
              sequenceStore.selectedChoice && symbol.object.name === 'discover' && 'animate-shake',
            ]"
            @select="onAnswer(index)"
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
