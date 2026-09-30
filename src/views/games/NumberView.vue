<script setup>
import GameButton from '@/components/buttons/GameButton.vue'
import GameHeader from '@/components/layouts/GameHeader.vue'
import GameDescription from '@/components/cards/GameDescription.vue'
import { useGameView } from '@/composables/useGameView'

const {
  pageRef,
  sequenceRefs,
  difficulty,
  timeStamp,
  phase,
  description,
  audioStore,
  sequenceStore,
  applicationStore,
  handleSelect,
  onAnswer,
} = useGameView('numbers', {
  onTryAgain({ difficulty, phase, goToFeedBack, start }) {
    const { length, amountOperations, maxOperator, maxStart, numberDiscover, timeLimit } =
      applicationStore.numberDifficulties[difficulty].params
    const currentLimit = timeLimit[phase]

    sequenceStore.generateNumberSequence(
      length,
      amountOperations,
      maxOperator,
      maxStart,
      numberDiscover,
    )

    if (start) timeStamp.start(true, currentLimit, goToFeedBack)
  },
  onMount() {
    audioStore.playBackground('numbers')
  },
  onSelect(choice) {
    sequenceStore.selectChoice(choice)
    if (choice.path) audioStore.playAudio(choice.path)
  },
})
</script>

<template>
  <div
    ref="pageRef"
    class="flex flex-col gap-10 p-10 min-h-screen bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.65)),url('/imgs/backgrounds/cyber-background-light.svg')] dark:bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.65)),url('/imgs/backgrounds/cyber-background-dark.svg')] bg-cover bg-center"
  >
    <GameHeader :time="timeStamp.formattedTime" />
    <section class="grid grid-cols-4 gap-20">
      <div class="grid grid-rows-3 justify-center gap-10 col-span-3">
        <div class="grid grid-cols-2 row-span-1 order-2">
          <div class="flex flex-col items-center gap-2">
            <h2 class="text-white text-2xl font-semibold font-sour-gummy">Alternativas</h2>
            <div class="flex w-fit justify-center gap-5 bg-zinc-400/80 p-5 rounded-3xl">
              <GameButton
                v-for="(choice, index) in sequenceStore.finalChoices"
                :key="index"
                color="#D5C359"
                background="#FBE97D"
                :number="choice.value"
                :selected="sequenceStore.selectedChoice?.id === parseInt(choice.id)"
                @select="handleSelect(choice)"
              />
            </div>
          </div>
          <div class="flex flex-col items-center gap-2">
            <h2 class="text-white text-2xl font-semibold font-sour-gummy">Acertos</h2>
            <div class="flex w-fit justify-center gap-5 bg-zinc-400/80 p-5 rounded-3xl">
              <p class="text-white text-4xl font-sour-gummy">
                {{ applicationStore.getResponses('numbers') }}
                /
                {{ applicationStore.requiredResponses.numbers }}
              </p>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-10 items-center flex-wrap row-span-2 gap-5 order-1">
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
      </div>
      <GameDescription mode="numbers" :difficulty="difficulty" :phase="phase" :text="description" />
    </section>
  </div>
</template>
