<script setup>
import AppButton from '@/components/buttons/AppButton.vue'
import { computed, nextTick, onMounted, ref, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePageTransition } from '@/composables/usePageTransition'
import { useApplicationStore } from '@/stores/application'
import { useAudioStore } from '@/stores/sounds'
import gsap from 'gsap'
const route = useRoute()
const router = useRouter()
const applicationStore = useApplicationStore()
const audioStore = useAudioStore()

const pageRef = ref(null)
const { enter } = usePageTransition(pageRef)
const particlesRef = ref(null)
const titleRef = ref(null)
const cardRef = ref(null)
const buttonsRef = ref(null)

let particleCtx

onMounted(async () => {
  await nextTick()
  enter(1)

  if (success.value) {
    audioStore.playFeedback('success')
    playCelebration()
  }
})

onUnmounted(() => {
  particleCtx?.revert()
})

const success = computed(() => parseInt(route.params.hits) >= parseInt(route.params.required))

const mode = computed(() => {
  if (route.params.mode === 'forms') return 'Formas'
  if (route.params.mode === 'sounds') return 'Sons'
  if (route.params.mode === 'numbers') return 'Números'

  return ''
})

const difficulty = computed(() => {
  if (route.params.difficulty === 'easy') return 'Fácil'
  if (route.params.difficulty === 'medium') return 'Médio'
  if (route.params.difficulty === 'hard') return 'Difícil'

  return ''
})

function goNext() {
  const nextRoute = applicationStore.getNextRoute({
    mode: route.params.mode,
    difficulty: route.params.difficulty,
    phase: route.params.phase,
    success: success.value,
  })

  router.push(nextRoute)
}

function repeatLevel() {
  const repeatRoute = applicationStore.repeatLevelRoute({
    mode: route.params.mode,
    difficulty: route.params.difficulty,
  })

  router.push(repeatRoute)
}

function playCelebration() {
  const title = titleRef.value
  const card = cardRef.value

  if (title) {
    gsap.from(title, { scale: 0.3, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' })
  }

  if (card) {
    const items = card.querySelectorAll('[data-stagger]')
    gsap.from(items, {
      y: 30,
      opacity: 0,
      duration: 0.4,
      stagger: 0.12,
      ease: 'power2.out',
      delay: 0.3,
    })
  }

  particleCtx = gsap.context(() => {
    const colors = ['#FF6357', '#FF9E97', '#D599FF', '#44BBFF', '#FBE97D', '#4ade80']
    const container = particlesRef.value
    if (!container) return

    for (let i = 0; i < 40; i++) {
      const dot = document.createElement('div')
      const color = colors[Math.floor(Math.random() * colors.length)]
      const size = 4 + Math.random() * 10
      const startX = Math.random() * innerWidth
      const startY = innerHeight * (0.4 + Math.random() * 0.2)
      const endX = (Math.random() - 0.5) * innerWidth * 1.2
      const endY = -(200 + Math.random() * 500)

      Object.assign(dot.style, {
        position: 'fixed',
        left: `${startX}px`,
        top: `${startY}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: '9999',
        opacity: '0',
      })

      container.appendChild(dot)

      gsap.to(dot, {
        x: endX,
        y: endY,
        opacity: 1,
        scale: 0.2 + Math.random() * 0.8,
        rotation: Math.random() * 720,
        duration: 1.2 + Math.random() * 1,
        ease: 'power2.out',
        delay: Math.random() * 0.5,
        onComplete: () => {
          gsap.to(dot, { opacity: 0, duration: 0.4, delay: 0.5, onComplete: () => dot.remove() })
        },
      })
    }
  }, particlesRef)
}
</script>

<template>
  <div
    ref="pageRef"
    :class="[
      'flex flex-col items-center justify-between w-screen h-screen overflow-hidden p-10',
      success ? 'text-green-400' : 'text-red-400',
    ]"
  >
    <section ref="titleRef" class="flex flex-col items-center gap-5">
      <h1 v-if="success" class="text-5xl font-bold">Parabéns</h1>
      <h1 v-else class="text-5xl font-bold">Quase lá!</h1>
      <p v-if="success" class="text-3xl">Você conseguiu!</p>
      <p v-else class="text-3xl">Você pode melhorar!</p>
      <img src="/imgs/feedback.svg" alt="feedback-image" class="w-48" />
    </section>
    <section ref="cardRef" class="w-1/2 text-2xl border-2 rounded-xl p-10 border-inherit">
      <p data-stagger class="text-blue-300">Modo: {{ mode }}</p>
      <p data-stagger class="text-purple-400">Dificuldade: {{ difficulty }}</p>
      <p data-stagger class="text-yellow-300">
        Desempenho: {{ route.params.hits }}/{{ route.params.required }} padrões completos
      </p>
    </section>
    <section ref="buttonsRef" class="w-1/2 flex gap-5 justify-center">
      <AppButton text="Início" @on-click="router.push({ name: 'home-view' })" />
      <AppButton text="Repetir" color="purple" @on-click="repeatLevel" />
      <AppButton v-if="success" text="Avançar" color="blue" @on-click="goNext" />
    </section>
    <div ref="particlesRef" class="fixed inset-0 pointer-events-none"></div>
  </div>
</template>
