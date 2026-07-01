<script setup>
import AppButton from '@/components/buttons/AppButton.vue'
import GameButton from '@/components/buttons/GameButton.vue'
import GameHeader from '@/components/layouts/GameHeader.vue'
import { onMounted, computed, nextTick, ref, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApplicationStore } from '@/stores/application'
import { useSequenceStore } from '@/stores/sequence'
import { useAudioStore } from '@/stores/sounds'
import { useTimeStamp } from '@/stores/timeStamp'
import { usePageTransition } from '@/composables/usePageTransition'
import gsap from 'gsap'

const route = useRoute()
const router = useRouter()
const applicationStore = useApplicationStore()
const audioStore = useAudioStore()
const sequenceStore = useSequenceStore()
const timeStamp = useTimeStamp()

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
    applicationStore.soundResponses >= applicationStore.requiredResponses.sounds
  ) {
    router.push({
      name: 'unlock-view',
      params: {
        mode: 'sounds',
        difficulty: route.params.difficulty,
      },
    })
  } else {
    router.push({
      name: 'feedback-view',
      params: {
        hits: applicationStore.soundResponses,
        required: applicationStore.requiredResponses.sounds,
        mode: 'sounds',
        difficulty: route.params.difficulty,
        phase: route.params.phase,
      },
    })
  }
}

function onAnswer(index) {
  const soundObj = sequenceStore.sequence[index]?.object
  if (soundObj?.path) audioStore.playAudio(soundObj.path)

  const result = sequenceStore.answerObjectSequence(index, 'sounds', tryAgain)
  if (result === 'correct') {
    audioStore.playFeedback('correct')
    if (sequenceRefs.value[index]) playCorrectFeedback(index)
  } else if (result === 'wrong') {
    audioStore.playFeedback('error')
    playWrongFeedback(index)
  }
}

function select(choice, path) {
  audioStore.playAudio(path)
  sequenceStore.selectChoice(choice)
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

function tryAgain() {
  const { phase, difficulty } = route.params
  const params = applicationStore.soundDifficulties[difficulty].params

  sequenceStore.mountObjectSequence(
    params.numberSounds,
    params.size,
    params.discover,
    applicationStore.soundObjects,
  )

  timeStamp.start(true, params.timeLimit[phase], goToFeedBack)
}

onMounted(async () => {
  tryAgain()
  await nextTick()
  enter(1)
})

onUnmounted(() => {
  timeStamp.reset()
  applicationStore.resetSoundResponses()
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
          @on-click="audioStore.playSequence(sequenceStore.sequence)"
        />
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
            color="#44BBFF"
            background="#A0DCFF"
            icon="mdi mdi-music"
            @select="select(choice, choice.path)"
            :selected="sequenceStore.selectedChoice?.id === parseInt(choice.id)"
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
            Acertos: {{ applicationStore.soundResponses }}/{{
              applicationStore.requiredResponses.sounds
            }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
