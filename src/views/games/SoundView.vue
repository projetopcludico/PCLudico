<script setup>
import AppButton from '@/components/buttons/AppButton.vue'
import GameButton from '@/components/buttons/GameButton.vue'
import GameHeader from '@/components/layouts/GameHeader.vue'
import GameDescription from '@/components/cards/GameDescription.vue'
import { useGameView } from '@/composables/useGameView'
import { computed } from 'vue'

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
} = useGameView('sounds', {
  onTryAgain({ difficulty, phase, goToFeedBack, start }) {
    const params = applicationStore.soundDifficulties[difficulty].params

    sequenceStore.mountObjectSequence(
      params.numberSounds,
      30,
      params.discover,
      applicationStore.soundObjects,
    )

    if (start) timeStamp.start(true, params.timeLimit[phase], goToFeedBack)
  },
  onBeforeAnswer(index, soundObj) {
    if (soundObj?.path) audioStore.playAudio(soundObj.path)
  },
  onSelect(choice) {
    audioStore.playAudio(choice.path)
    sequenceStore.selectChoice(choice)
  },
})

const isPlaying = computed(() => audioStore.sequenceIsPlaying)
</script>

<template>
  <div
    ref="pageRef"
    class="flex flex-col gap-10 p-10 min-h-screen bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.65)),url('/imgs/backgrounds/music-background-light.svg')] dark:bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.65)),url('/imgs/backgrounds/music-background-dark.svg')] bg-cover bg-center"
  >
    <GameHeader :time="timeStamp.formattedTime" />
    <section class="grid grid-cols-4 gap-20">
      <div class="grid grid-rows-3 justify-center gap-10 col-span-3">
        <div class="grid grid-cols-3 row-span-1 order-2">
          <div class="flex flex-col items-center gap-2">
            <h2 class="text-white text-2xl font-semibold font-sour-gummy">Alternativas</h2>
            <div class="flex w-fit justify-center gap-5 bg-zinc-400/80 p-5 rounded-3xl">
              <GameButton
                v-for="(choice, index) in sequenceStore.finalChoices"
                :key="index"
                color="#44BBFF"
                background="#A0DCFF"
                icon="mdi mdi-music"
                :selected="sequenceStore.selectedChoice?.id === parseInt(choice.id)"
                @select="handleSelect(choice)"
              />
            </div>
          </div>
          <div class="flex flex-col items-center gap-2">
            <h2 class="text-white text-2xl font-semibold font-sour-gummy">Acertos</h2>
            <div class="flex w-fit justify-center gap-5 bg-zinc-400/80 p-5 rounded-3xl">
              <p class="text-white text-4xl font-sour-gummy">
                {{ applicationStore.getResponses('sounds') }}
                /
                {{ applicationStore.requiredResponses.sounds }}
              </p>
            </div>
          </div>
          <div class="flex flex-col justify-center">
            <AppButton
              :disabled="isPlaying"
              :text="isPlaying ? 'Repetindo sons...' : 'Repetir sons'"
              @click="audioStore.playSequence(sequenceStore.sequence)"
            />
          </div>
        </div>
        <div class="grid grid-cols-10 justify-center flex-wrap gap-5 row-span-2 order-1">
          <GameButton
            v-for="(sound, index) in sequenceStore.sequence"
            :key="index"
            :ref="
              (el) => {
                if (el) sequenceRefs[index] = el.$el || el
              }
            "
            :icon="sound.object.name === 'discover' ? sound.object.icon : 'mdi mdi-music-note'"
            :name="sound.object.name"
            color="#FF6357"
            background="#FF9E97"
            :playing="audioStore.currentIndex === index"
            :class="[
              sequenceStore.selectedChoice && sound.object.name === 'discover' && 'animate-shake',
            ]"
            @select="onAnswer(index)"
          />
        </div>
      </div>
      <GameDescription mode="sounds" :difficulty="difficulty" :phase="phase" :text="description" />
    </section>
  </div>
</template>
