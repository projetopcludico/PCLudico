<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  templates: {
    type: Array,
    required: true
  },
  withNumbers: {
    type: Boolean,
    default: true
  }
})

const symbols = ref([])
const elRefs = ref([])

let ctx

const colors = [
  '#D599FF',
  '#A0DCFF',
  '#FBF37D',
  '#FF9E97',
  '#BFFF95',
  '#FFD393',
]

function randomPosition(used) {
  while (true) {
    const x = gsap.utils.random(0, 100)
    const y = gsap.utils.random(0, 100)

    // deixa uma área livre no centro
    if (x > 25 && x < 75 && y > 15 && y < 85) continue

    const valid = used.every((p) => {
      const dx = p.x - x
      const dy = p.y - y

      return Math.sqrt(dx * dx + dy * dy) > 10
    })

    if (valid) {
      used.push({ x, y })
      return { x, y }
    }
  }
}

function createSymbols() {
  const used = []

  symbols.value = Array.from({ length: 50 }, () => {
    const template = props.templates[Math.floor(Math.random() * props.templates.length)]
    const position = randomPosition(used)

    if (Math.random() < 0.2 && props.withNumbers) {
      return {
        type: 'number',
        value: Math.floor(Math.random() * 10),
        color: colors[Math.floor(Math.random() * colors.length)],
        ...position,
      }
    }

    return {
      ...template,
      ...position,
    }
  })
}

function float(el) {
  const tl = gsap.timeline({
    repeat: -1,
    yoyo: true,
    repeatRefresh: true,
    defaults: {
      ease: 'sine.inOut',
    },
  })

  for (let i = 0; i < 4; i++) {
    tl.to(el, {
      x: () => gsap.utils.random(-30, 30),
      y: () => gsap.utils.random(-30, 30),
      rotation: () => gsap.utils.random(-15, 15),
      duration: () => gsap.utils.random(3, 7),
    })
  }
}

onMounted(async () => {
  createSymbols()

  await nextTick()

  ctx = gsap.context(() => {
    elRefs.value.forEach((el) => {
      if (!el) return

      gsap.set(el, {
        scale: gsap.utils.random(0.5, 1.4),
        rotation: gsap.utils.random(0, 360),
      })

      float(el)
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div
      v-for="(symbol, index) in symbols"
      :key="index"
      :ref="(el) => (elRefs[index] = el)"
      class="absolute"
      :style="{
        left: symbol.x + '%',
        top: symbol.y + '%',
      }"
    >
      <span
        v-if="symbol.type === 'icon'"
        :class="[symbol.value, 'text-4xl']"
        :style="{ color: symbol.color }"
      />

      <div
        v-else-if="symbol.type === 'svg'"
        class="w-10 h-10"
        :style="{
          backgroundColor: symbol.color,
          mask: `url(${symbol.value}) center/contain no-repeat`,
          WebkitMask: `url(${symbol.value}) center/contain no-repeat`,
        }"
      />

      <span
        v-else
        class="text-3xl font-bold"
        :style="{ color: symbol.color }"
      >
        {{ symbol.value }}
      </span>
    </div>
  </div>
</template>