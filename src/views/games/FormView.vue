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
} = useGameView('forms', {
  onTryAgain({ difficulty, phase, goToFeedBack, start }) {
    const params = applicationStore.formDifficulties[difficulty].params
    const timeLimit = applicationStore.formDifficulties[difficulty].timeLimit[phase]

    sequenceStore.mountObjectSequence(
      params.numberForms,
      25,
      params.discovers,
      applicationStore.formSymbols,
    )

    if (start) timeStamp.start(true, timeLimit, goToFeedBack)
  },
  onMount() {
    audioStore.playBackground('forms')
  },
  onSelect(choice) {
    sequenceStore.selectChoice(choice)
    audioStore.playAudio(choice.path)
  },
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
      </div>
      <div class="flex flex-col items-center gap-10 col-span-3">
        <h2 class="text-white text-2xl font-semibold">Alternativas</h2>
        <div class="flex justify-center gap-5 bg-zinc-400/80 p-5 rounded-3xl">
          <GameButton
            v-for="(symbol, index) in sequenceStore.finalChoices"
            :key="index"
            :icon="symbol.icon"
            :color="symbol.color"
            :background="symbol.background"
            :svg="true"
            :selected="sequenceStore.selectedChoice?.id === parseInt(symbol.id)"
            class="cursor-pointer"
            @select="handleSelect(symbol)"
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
            Acertos: {{ applicationStore.getResponses('forms') }}/{{
              applicationStore.requiredResponses.forms
            }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
