<script setup>
import { computed, ref, watch, onUnmounted } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  svg: {
    type: Boolean,
    default: false,
  },
  number: {
    type: Number,
    default: undefined,
  },
  color: {
    type: String,
    default: '',
  },
  background: {
    type: String,
    default: '',
  },
  selected: {
    type: Boolean,
    default: false,
  },
  playing: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['select'])

const buttonRef = ref(null)
let ctx

const buttonStyle = computed(() => {
  if (props.name === 'discover')
    return {
      color: '#ffffff',
      backgroundColor: '#000000',
    }
  return {
    backgroundColor: props.background,
    borderColor: props.color,
  }
})

watch(
  () => props.playing,
  (isPlaying) => {
    if (!isPlaying || !buttonRef.value) return

    ctx?.revert()
    ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.to(buttonRef.value, {
        y: -40,
        scale: 1.08,
        duration: 0.2,
        ease: 'power2.out',
      })
      tl.to(buttonRef.value, {
        y: 0,
        scale: 1,
        duration: 0.35,
        ease: 'bounce.out',
      })
    })
  },
)

onUnmounted(() => ctx?.revert())
</script>

<template>
  <button
    ref="buttonRef"
    :style="buttonStyle"
    :class="[
      'min-w-20 h-25 flex flex-col items-center justify-center rounded-xl border-3 px-2 transition-all duration-200 focus:scale-105',
      props.selected && 'border-white animate-highlight',
      props.name === 'discover' && 'cursor-pointer',
    ]"
    @click="emits('select')"
  >
    <span v-if="props.icon && props.name === 'discover'" :class="[props.icon, 'text-6xl']"></span>
    <div
      v-else-if="props.icon && props.svg"
      class="w-3/5 h-3/5"
      :style="{
        backgroundColor: props.color,
        mask: `url(${props.icon}) no-repeat center / contain`,
        WebkitMask: `url(${props.icon}) no-repeat center / contain`,
      }"
    ></div>
    <span v-else-if="props.icon" :class="[props.icon, 'text-6xl' ]" :style="{ color: props.color, background: props.background }"></span>
    <div
      v-else
      class="text-3xl font-bold"
      :style="{
        color: props.color,
      }"
    >
      {{ props.number }}
    </div>
  </button>
</template>
