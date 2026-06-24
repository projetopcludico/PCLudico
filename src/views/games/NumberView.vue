<script setup>
import GameButton from '@/components/buttons/GameButton.vue'
import GameHeader from '@/components/layouts/GameHeader.vue'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePageTransition } from '@/composables/usePageTransition'
import { useApplicationStore } from '@/stores/application'
import { useSequenceStore } from '@/stores/sequence'
import { useTimeStamp } from '@/stores/timeStamp'

const applicationStore = useApplicationStore()
const sequenceStore = useSequenceStore()
const timeStamp = useTimeStamp()

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

onMounted(async () => {
  tryAgain()
  await nextTick()
  enter(1)
})

onUnmounted(() => {
  timeStamp.reset()
  applicationStore.resetNumberResponses()
})
</script>

<template>
  <div
    ref="pageRef"
    class="flex flex-col gap-20 p-10 min-h-screen bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.65)),url('/imgs/backgrounds/cyber-background.svg')] bg-cover bg-center"
  >
    <GameHeader :title="`Jogo de Números: Nível ${difficulty}`"/>
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
            @select="sequenceStore.selectChoice(choice)"
            :selected="sequenceStore.selectedChoice?.id === parseInt(choice.id)"
          />
        </div>
        <div class="flex justify-center flex-wrap gap-5">
          <GameButton
            v-for="(number, index) in sequenceStore.sequence"
            :key="index"
            :icon="number.object.icon"
            :name="number.object.name"
            :number="number.object.value"
            color="#AC37FF"
            background="#D599FF"
            :class="[
              sequenceStore.selectedChoice && number.object.name === 'discover' && 'animate-shake',
            ]"
            @select="sequenceStore.answerObjectSequence(index, 'numbers', tryAgain)"
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
