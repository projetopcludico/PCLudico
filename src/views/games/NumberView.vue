<script setup>
import GameButton from '@/components/buttons/GameButton.vue'
import GameHeader from '@/components/layouts/GameHeader.vue'
import { useGameView } from '@/composables/useGameView'

const {
  pageRef,
  sequenceRefs,
  difficulty,
  timeStamp,
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
    class="flex flex-col gap-20 p-10 min-h-screen bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.65)),url('/imgs/backgrounds/cyber-background.svg')] bg-cover bg-center"
  >
    <GameHeader :title="`Jogo de Números: Nível ${difficulty}`" />
    <section class="grid grid-cols-4 gap-20">
      <div class="flex flex-col gap-5 col-span-1 px-5 text-white">
        <h2 class="font-bold">Tempo restante: {{ timeStamp.formattedTime }}</h2>
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
            :selected="sequenceStore.selectedChoice?.id === parseInt(choice.id)"
            @select="handleSelect(choice)"
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
            Acertos: {{ applicationStore.getResponses('numbers') }}/{{
              applicationStore.requiredResponses.numbers
            }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
