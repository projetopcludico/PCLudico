<script setup>
import { computed } from 'vue'
import { modeLabel } from '@/utils/modeLabel'

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: (value) => ['forms', 'numbers', 'sounds'].includes(value),
  },
  difficulty: {
    type: String,
    required: true,
  },
  phase: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
})

const isForms = computed(() => props.mode === 'forms')
const isNumbers = computed(() => props.mode === 'numbers')
const isSounds = computed(() => props.mode === 'sounds')

function getClassStyle() {
    if(isForms.value) return 'bg-orange border-amber-500'
    if(isNumbers.value) return 'bg-blue border-blue-500'
    if(isSounds.value) return 'bg-red border-red-500'

}
</script>

<template>
  <section class="w-full text-xl font-sour-gummy flex flex-col gap-5">
    <div :class="['w-full h-fit rounded-xl border-2 p-4', getClassStyle()]">
      <h2 class="text-2xl font-semibold mb-2">Jogo de {{ modeLabel(props.mode) }}</h2>
      <p>Dificuldade: {{ props.difficulty }}</p>
      <p>Fase: {{ props.phase }} / 3</p>
    </div>
    <div :class="['w-full h-fit rounded-xl border-2 p-4', getClassStyle()]">
      <h2 class="text-2xl font-semibold mb-2">Como jogar</h2>
      <p>{{ props.text }}</p>
    </div>
  </section>
</template>
