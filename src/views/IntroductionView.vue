<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import gsap from 'gsap'
import { useApplicationStore } from '@/stores/application'
import { useCampaignProgressStore } from '@/stores/campaignProgress'
import { useTransitionOverlay } from '@/composables/useTransitionOverlay'
import CloudBackground from '@/components/decorators/CloudBackground.vue'

const route = useRoute()
const router = useRouter()
const applicationStore = useApplicationStore()
const campaignProgress = useCampaignProgressStore()
const { fadeIn, fadeOut } = useTransitionOverlay()

const pageRef = ref(null)
const titleRef = ref(null)
const subtitleRef = ref(null)
const textRef = ref(null)
const buttonRef = ref(null)

const gameType = route.params.gameType
const story = applicationStore.gameStories[gameType]
const difficulty = route.query.difficulty || 'easy'
const mode = route.query.mode || 'campaign'

const startPhase = computed(() => {
  if (mode === 'phase') return 'one'
  return campaignProgress.getNextUnlockedPhase(gameType, difficulty) || 'one'
})

let ctx

onMounted(() => {
  fadeOut(0.4)

  ctx = gsap.context(() => {
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 })

    timeline.from(titleRef.value, { opacity: 0, y: 50, duration: 0.9 })
      .from(subtitleRef.value, { opacity: 0, y: 30, duration: 0.7 }, '-=0.5')
      .from(textRef.value?.children || [], { opacity: 0, y: 25, duration: 0.6, stagger: 0.18 }, '-=0.3')
      .from(buttonRef.value, { opacity: 0, scale: 0.9, duration: 0.5 }, '-=0.2')

  }, pageRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})

function goToGame() {
  fadeIn(0.4).then(() => {
    router.push(`/game/${gameType}/${difficulty}/${startPhase.value}/`)
  })
}
</script>

<template>
  <section
    ref="pageRef"
    class="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 cursor-pointer select-none"
    @click="goToGame"
  >
    <CloudBackground />

    <div class="relative z-10 max-w-2xl w-full">
      <h1
        ref="titleRef"
        class="text-5xl text-center md:text-6xl font-bold tracking-tight text-slate-800  mb-4 leading-[1.1] dark:text-white"
      >
        {{ story?.title }}
      </h1>

      <div ref="textRef" class="space-y-5">
        <p
          v-for="(paragraph, i) in story?.paragraphs"
          :key="i"
          class="text-base md:text-lg text-slate-600 leading-relaxed dark:text-gray-300"
        >
          {{ paragraph }}
        </p>
      </div>

      <div ref="buttonRef" class="mt-12 flex justify-center">
        <button
          class="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/70 backdrop-blur-sm text-slate-700 font-medium shadow-lg shadow-sky-200/50 cursor-pointer hover:bg-white/90 transition-colors duration-300"
        >
          Clique em qualquer lugar para começar
        <span class="mdi mdi-arrow-down"></span>
      </button>
      </div>
    </div>
  </section>
</template>
