<script setup>
import GameButton from '@/components/buttons/GameButton.vue'
import GameHeader from '@/components/layouts/GameHeader.vue'
import GameDescription from '@/components/cards/GameDescription.vue'
import { useGameView } from '@/composables/useGameView'

const {
  pageRef,
  sequenceRefs,
  difficulty,
  phase,
  timeStamp,
  description,
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
      30,
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
    class="flex flex-col gap-10 p-10 min-h-screen bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.65)),url('/imgs/backgrounds/egypt-background-light.svg')] dark:bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.65)),url('/imgs/backgrounds/egypt-background-dark.svg')] bg-cover bg-center"
  >
    <GameHeader :time="timeStamp.formattedTime" />
    <section class="grid grid-cols-4 gap-20">
      <div class="grid grid-rows-3 justify-center gap-10 col-span-3">
        <div class="grid grid-cols-2 row-span-1 order-2">
          <div class="flex flex-col items-center gap-2">
            <h2 class="text-white text-2xl font-semibold font-sour-gummy">Alternativas</h2>
            <div class="flex w-fit justify-center gap-5 bg-zinc-400/80 p-5 rounded-3xl">
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
          </div>
          <div class="flex flex-col items-center gap-2">
            <h2 class="text-white text-2xl font-semibold font-sour-gummy">Acertos</h2>
            <div class="flex w-fit justify-center gap-5 bg-zinc-400/80 p-5 rounded-3xl">
              <p class="text-white text-4xl font-sour-gummy">
                {{ applicationStore.getResponses('forms') }}
                /
                {{ applicationStore.requiredResponses.forms }}
              </p>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-10 justify-center flex-wrap gap-5 row-span-2 order-1">
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
      </div>
      <GameDescription mode="forms" :difficulty="difficulty" :phase="phase" :text="description" />
    </section>
  </div>
</template>
