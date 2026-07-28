<script setup>
import AppButton from '@/components/buttons/AppButton.vue'
import SymbolsBackground from '@/components/decorators/SymbolsBackground.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useApplicationStore } from '@/stores/application'
import { difficultyLabel } from '@/utils/difficultyLabel'
import { phaseLabel } from '@/utils/phaseLabel'

const router = useRouter()
const applicationStore = useApplicationStore()

const hits = computed(() => Number(applicationStore.gameStatus.hits))
const required = computed(() => Number(applicationStore.gameStatus.required))
const mode = computed(() => applicationStore.gameStatus.mode)
const difficulty = computed(() => applicationStore.gameStatus.difficulty)
const phase = computed(() => applicationStore.gameStatus.phase)

const title = computed(() => {
  if (hits.value >= required.value) {
    if (mode.value == 'forms') return 'Parabéns Explorador!'
    if (mode.value == 'numbers') return 'Parabéns Cientista!'
    if (mode.value == 'sounds') return 'Parabéns Banda!'
    return ''
  }

  if (mode.value == 'forms') return 'Que pena Explorador!'
  if (mode.value == 'numbers') return 'Que pena Cientista!'
  if (mode.value == 'sounds') return 'Que pena Banda!'
  return ''
})

const subtitle = computed(() => {
  if (hits.value >= required.value) {
    if (mode.value == 'forms') return ' Você desvendou o mistério!'
    if (mode.value == 'numbers') return 'Você resolveu o código!'
    if (mode.value == 'sounds') return ' Você organizou a sinfonia!'
    return ''
  }

  if (mode.value == 'forms') return 'Você não conseguiu desvendar o mistério.'
  if (mode.value == 'numbers') return 'Você não conseguiu resolver o código.'
  if (mode.value == 'sounds') return 'Você não conseguiu organizar a sinfonia.'
  return ''
})

const image = computed(() => {
  return `/imgs/feedbacks/${mode.value}-feedback.svg`
})

const fontColor = computed(() => {
  if (mode.value == 'forms') return '#976526'
  if (mode.value == 'numbers') return '#03314F'
  return '#6A3F3C'
})

function nextRoute() {
  router.push(
    applicationStore.getNextRoute({
      mode: mode.value,
      difficulty: difficulty.value,
      phase: phase.value,
      success: hits.value >= required.value,
    }),
  )
}

function repeatLevel() {
  router.push(
    applicationStore.repeatLevelRoute({
      mode: mode.value,
      difficulty: difficulty.value,
      phase: phase.value,
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
  ]
}
</script>

<template>
  <div
    class="relative min-h-screen w-screen flex flex-col items-center justify-center gap-5"
    :style="{
      color: fontColor,
    }"
  >
    <SymbolsBackground :templates="templates[mode]" :with-numbers="false" />
    <div :class="['absolute inset-0 -z-10', backgrounds[mode]]"></div>
    <h1 class="text-5xl font-sour-gummy font-bold z-10">{{ title }}</h1>
    <img :src="image" class="z-10"/>
    <p class="font-bold italic text-2xl z-10">{{ subtitle }}</p>
    <p v-if="hits >= required" class="font-bold italic z-10">
      {{ difficultyLabel(difficulty) }} | Fase {{ phaseLabel(phase) }} - Concluído
    </p>
    <div class="w-full flex flex-col gap-2 items-center z-10">
      <p>Continue jogando:</p>
      <ul class="w-full flex justify-center gap-5">
        <li>
          <AppButton
            text="Voltar"
            :mode="mode == 'forms' ? 'orange' : mode == 'numbers' ? 'blue' : 'red'"
            @click="router.push('/')"
          />
        </li>
        <li>
          <AppButton
            text="Tentar novamente"
            :mode="mode == 'forms' ? 'orange' : mode == 'numbers' ? 'blue' : 'red'"
            @click="repeatLevel"
          />
        </li>
        <li v-if="hits >= required">
          <AppButton
            text="Avançar"
            :mode="mode == 'forms' ? 'orange' : mode == 'numbers' ? 'blue' : 'red'"
            @click="nextRoute"
          />
        </li>
      </ul>
    </div>
  </div>
</template>
