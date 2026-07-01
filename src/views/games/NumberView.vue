<script setup>
import GameButton from '@/components/buttons/GameButton.vue'
import GameHeader from '@/components/layouts/GameHeader.vue'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePageTransition } from '@/composables/usePageTransition'
import { useApplicationStore } from '@/stores/application'
import { useSequenceStore } from '@/stores/sequence'
import { useTimeStamp } from '@/stores/timeStamp'
import { useAudioStore } from '@/stores/sounds'
import gsap from 'gsap'

const applicationStore = useApplicationStore()
const sequenceStore = useSequenceStore()
const timeStamp = useTimeStamp()
const audioStore = useAudioStore()

const route = useRoute()
const router = useRouter()

const pageRef = ref(null)
const { enter } = usePageTransition(pageRef)
const sequenceRefs = ref([])

const difficulty = computed(() => {
  if (route.params.difficulty === 'easy') return 'Fácil'
  if (route.params.difficulty === 'medium') return 'Médio'
  if (route.params.difficulty === 'hard') return 'Difícil'

  return ''
})

function goToFeedBack() {
  if (
    route.params.phase === 'three' &&
    applicationStore.numberResponses >= applicationStore.requiredResponses.numbers
  ) {
    router.push({
      name: 'unlock-view',
      params: {
        mode: 'numbers',
        difficulty: route.params.difficulty,
      },
    })
  } else {
    router.push({
      name: 'feedback-view',
      params: {
        hits: applicationStore.numberResponses,
        required: applicationStore.requiredResponses.numbers,
        mode: 'numbers',
        difficulty: route.params.difficulty,
        phase: route.params.phase,
      },
    })
  }
}

function tryAgain() {
  const currentDifficulty = route.params.difficulty
  const currentPhase = route.params.phase
  const { length, amountOperations, maxOperator, maxStart, numberDiscover, timeLimit } =
    applicationStore.numberDifficulties[currentDifficulty].params
  const currentLimit = timeLimit[currentPhase]

  sequenceStore.generateNumberSequence(
    length,
    amountOperations,
    maxOperator,
    maxStart,
    numberDiscover,
  )

  timeStamp.start(true, currentLimit, goToFeedBack)
}

function onAnswer(index) {
  const result = sequenceStore.answerObjectSequence(index, 'numbers', tryAgain)
  if (result === 'correct') {
    audioStore.playFeedback('correct')
    if (sequenceRefs.value[index]) playCorrectFeedback(index)
  } else if (result === 'wrong') {
    audioStore.playFeedback('error')
    playWrongFeedback(index)
  }
}

function playCorrectFeedback(index) {
  const el = sequenceRefs.value[index]
  if (!el) return
  gsap.fromTo(
    el,
    { boxShadow: '0 0 0 0 rgba(74, 222, 128, 0.4)' },
    {
      boxShadow: '0 0 20px 8px rgba(74, 222, 128, 0.3)',
      scale: 1.12,
      duration: 0.2,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(el, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.in',
          delay: 0.1,
          clearProps: 'boxShadow',
        })
      },
    },
  )
}

function playWrongFeedback(index) {
  const el = sequenceRefs.value[index]
  if (!el) return
  gsap.fromTo(
    el,
    { x: 0 },
    {
      x: -6,
      duration: 0.05,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(el, {
          x: 6,
          duration: 0.05,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: 3,
          clearProps: 'x',
        })
      },
    },
  )
}

function handleSelect(choice) {
  sequenceStore.selectChoice(choice)
  if (choice.path) audioStore.playAudio(choice.path)
}

onMounted(async () => {
  tryAgain()
  audioStore.playBackground('numbers')
  await nextTick()
  enter(1)
})

onUnmounted(() => {
  timeStamp.reset()
  applicationStore.resetNumberResponses()
  audioStore.stopBackground()
})
</script>

<template>
  <div
    ref="pageRef"
    class="flex flex-col gap-20 p-10 min-h-screen bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.65)),url('/imgs/backgrounds/cyber-background.svg')] bg-cover bg-center"
  >
    <GameHeader :title="`Jogo de Números: Nível ${difficulty}`" />
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
            v-for="(choice, index) in sequenceStore.finalChoices"
            :key="index"
            color="#D5C359"
            background="#FBE97D"
            :number="choice.value"
            @select="handleSelect(choice)"
            :selected="sequenceStore.selectedChoice?.id === parseInt(choice.id)"
          />
        </div>
        <div class="flex justify-center flex-wrap gap-5">
          <GameButton
            v-for="(number, index) in sequenceStore.sequence"
            :key="index"
            :ref="
              (el) => {
                if (el) sequenceRefs[index] = el.$el || el
              }
            "
            :icon="number.object.icon"
            :name="number.object.name"
            :number="number.object.value"
            color="#AC37FF"
            background="#D599FF"
            :class="[
              sequenceStore.selectedChoice && number.object.name === 'discover' && 'animate-shake',
            ]"
            @select="onAnswer(index)"
          />
        </div>
        <div class="text-white text-2xl">
          <p>
            Acertos: {{ applicationStore.numberResponses }}/{{
              applicationStore.requiredResponses.numbers
            }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
