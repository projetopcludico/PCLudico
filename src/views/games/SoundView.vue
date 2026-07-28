<script setup>
import AppButton from '@/components/buttons/AppButton.vue'
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
} = useGameView('sounds', {
  onTryAgain({ difficulty, phase, goToFeedBack, start }) {
    const params = applicationStore.soundDifficulties[difficulty].params

    sequenceStore.mountObjectSequence(
      params.numberSounds,
      params.size,
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
</script>

<template>
  <div
    ref="pageRef"
    class="flex flex-col gap-20 p-10 min-h-screen bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.65)),url('/imgs/backgrounds/music-background.svg')] bg-cover bg-center"
  >
    <GameHeader :title="`Jogo de Sons: Nível ${difficulty}`" />
    <section class="grid grid-cols-4 gap-20">
      <div class="flex flex-col gap-5 col-span-1 px-5 text-white">
        <AppButton
          text="Repetir sons"
          @click="audioStore.playSequence(sequenceStore.sequence)"
        />
        <h2 class="font-bold">Tempo restante: {{ timeStamp.formattedTime }}</h2>
      </div>
      <div class="flex flex-col items-center gap-10 col-span-3">
        <h2 class="text-white text-2xl font-semibold">Alternativas</h2>
        <div class="flex justify-center gap-5 bg-zinc-400/80 p-5 rounded-3xl">
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
        <div class="flex justify-center flex-wrap gap-5">
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
        <div class="text-white text-2xl">
          <p>
            Acertos: {{ applicationStore.getResponses('sounds') }}/{{
              applicationStore.requiredResponses.sounds
            }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
