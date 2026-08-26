<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import AppButton from '@/components/buttons/AppButton.vue'
import SymbolsBackground from '@/components/decorators/SymbolsBackground.vue'
import { useAchievementStore } from '@/stores/achievements'
import { useApplicationStore } from '@/stores/application'
import { difficultyLabel } from '@/utils/difficultyLabel'
import { modeLabel } from '@/utils/modeLabel'

const router = useRouter()
const achievementStore = useAchievementStore()
const applicationStore = useApplicationStore()

const pageRef = ref(null)
const titleRef = ref(null)
const pieceRef = ref(null)
const subtitleRef = ref(null)
const statusRef = ref(null)
const actionsRef = ref(null)

let ctx

const mode = computed(
  () => router.currentRoute.value.params.mode || applicationStore.gameStatus.mode,
)
const difficulty = computed(
  () => router.currentRoute.value.params.difficulty || applicationStore.gameStatus.difficulty,
)
const phase = computed(() => applicationStore.gameStatus.phase || 'three')
const gameMode = computed(() => applicationStore.gameStatus.gameMode)

const achievement = ref({})

onMounted(() => {
  if (gameMode.value === 'campaign') {
    achievement.value = achievementStore.unlockAchievement(mode.value, difficulty.value) || {}
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  ctx = gsap.context(() => {
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.1 })

    timeline
      .from(titleRef.value, { opacity: 0, y: 30, duration: 0.7 })
      .from(
        pieceRef.value,
        { opacity: 0, scale: 0.6, rotation: -8, duration: 0.8, ease: 'back.out(1.4)' },
        '-=0.35',
      )
      .from(subtitleRef.value, { opacity: 0, y: 20, duration: 0.6 }, '-=0.5')
      .from(statusRef.value, { opacity: 0, y: 10, duration: 0.5 }, '-=0.35')
      .from(actionsRef.value?.children || [], { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }, '-=0.3')
  }, pageRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})

const storyTitle = computed(() => applicationStore.gameStories[mode.value]?.title || '')

const image = computed(
  () => achievement.value.image || `/imgs/achievements/${mode.value}-${difficulty.value}.svg`,
)

const fontColor = computed(() => {
  if (mode.value == 'forms') return '#976526'
  if (mode.value == 'numbers') return '#03314F'
  return '#6A3F3C'
})

const buttonMode = computed(() => {
  if (mode.value == 'forms') return 'orange'
  if (mode.value == 'numbers') return 'blue'
  return 'red'
})

function nextRoute() {
  router.push(
    applicationStore.getNextRoute({
      mode: mode.value,
      difficulty: difficulty.value,
      phase: phase.value,
      success: true,
      gameMode: gameMode.value,
    }),
  )
}

const backgrounds = {
  forms:
    'bg-[radial-gradient(ellipse_at_center,_rgba(255,216,77,0.9)_0%,_rgba(247,178,74,0.45)_45%,_transparent_80%)]',
  numbers:
    'bg-[radial-gradient(ellipse_at_center,_rgba(124,203,255,0.9)_0%,_rgba(79,174,245,0.45)_45%,_transparent_80%)]',
  sounds:
    'bg-[radial-gradient(ellipse_at_center,_rgba(255,177,177,0.9)_0%,_rgba(255,142,142,0.45)_45%,_transparent_80%)]',
}

const templates = {
  forms: [
    { value: '/imgs/icons/canopo.svg', type: 'svg', color: '#FFB54A' },
    { value: '/imgs/icons/abutre.svg', type: 'svg', color: '#FFB54A' },
    { value: '/imgs/icons/egipcio.svg', type: 'svg', color: '#FFB54A' },
    { value: '/imgs/icons/esfinge.svg', type: 'svg', color: '#FFB54A' },
    { value: '/imgs/icons/pilo.svg', type: 'svg', color: '#FFB54A' },
  ],
  numbers: [
    { value: '1', type: 'number', color: '#39B7FF' },
    { value: '2', type: 'number', color: '#39B7FF' },
    { value: '3', type: 'number', color: '#39B7FF' },
    { value: '4', type: 'number', color: '#39B7FF' },
    { value: '5', type: 'number', color: '#39B7FF' },
    { value: '6', type: 'number', color: '#39B7FF' },
    { value: '7', type: 'number', color: '#39B7FF' },
    { value: '8', type: 'number', color: '#39B7FF' },
    { value: '9', type: 'number', color: '#39B7FF' },
    { value: '10', type: 'number', color: '#39B7FF' },
  ],
  sounds: [
    { value: 'mdi mdi-music', type: 'icon', color: '#FF9E97' },
    { value: 'mdi mdi-music-note', type: 'icon', color: '#FF9E97' },
  ],
}

const templateList = computed(() => templates[mode.value] || templates.forms)
</script>

<template>
  <section
    ref="pageRef"
    class="relative min-h-screen w-full flex flex-col items-center justify-center gap-5 px-6 py-20"
    :style="{ color: fontColor }"
  >
    <SymbolsBackground :templates="templateList" :with-numbers="false" />
    <div :class="['absolute inset-0 -z-10', backgrounds[mode]]"></div>

    <h1 ref="titleRef" class="text-5xl font-sour-gummy font-bold z-10 text-center">
      Você desbloqueou!
    </h1>

    <div
      ref="pieceRef"
      class="z-10 flex items-center justify-center w-56 md:w-72"
    >
      <img :src="image" class="w-full object-contain" alt="Peça do quebra-cabeça desbloqueada" />
    </div>

    <p ref="subtitleRef" class="font-bold italic text-2xl z-10 text-center">{{ storyTitle }}</p>
    <p ref="statusRef" class="font-bold italic z-10">
      Dificuldade {{ difficultyLabel(difficulty) }} - {{ modeLabel(mode) }} - Concluído ·
      Quebra-cabeça {{ achievementStore.totalUnlockeds }}/9
    </p>

    <div ref="actionsRef" class="w-full flex flex-col gap-2 items-center z-10">
      <p>Continue jogando:</p>
      <ul class="w-full flex justify-center gap-5 flex-wrap">
        <li class="w-48">
          <AppButton text="Voltar" :mode="buttonMode" @click="router.push('/')" />
        </li>
        <li class="w-48">
          <AppButton text="Continuar" :mode="buttonMode" @click="nextRoute" />
        </li>
      </ul>
    </div>
  </section>
</template>
