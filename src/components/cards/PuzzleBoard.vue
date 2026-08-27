<script setup>
import AppButton from '../buttons/AppButton.vue'
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { useAchievementStore } from '@/stores/achievements'

const achievementStore = useAchievementStore()

function playReward() {
  gsap.set('.puzzle-piece', { clearProps: 'all' })
  
  gsap.from('.puzzle-piece', {
    duration: 1.4,
    x: () => (Math.random() - 0.5) * 600,
    y: () => (Math.random() - 0.5) * 600,
    rotation: () => (Math.random() - 0.5) * 45,
    opacity: 0,
    stagger: 0.08,
    ease: 'back.out(1.2)'
  })
}

onMounted(() => {
  playReward()
})
</script>

<template>
  <div class="w-full grid justify-center gap-4">
    
    <svg width="400" height="600" viewBox="0 0 400 600" class="overflow-visible bg-black/5"> 
      <!-- passar estilo para ca (tailwind), transformar background em condicional-->
      
      <defs>
        <pattern id="puzzle-image" patternUnits="userSpaceOnUse" width="400" height="600">
          <image href="/imgs/achievements/general.svg" width="400" height="600" />
        </pattern>
      </defs>

      <path v-if="achievementStore.isUnlocked('forms', 'easy')" class="puzzle-piece" fill="url(#puzzle-image)"
        d="M 0,0 L 133.3,0 L 133.3,65 A 20,20 0 0,1 133.3,135 L 133.3,200 L 95,200 A 20,20 0 0,1 35,200 L 0,200 Z" />

      <path v-if="achievementStore.isUnlocked('forms', 'medium')" class="puzzle-piece" fill="url(#puzzle-image)"
        d="M 133.3,0 L 266.6,0 L 266.6,65 A 20,20 0 0,1 266.6,135 L 266.6,200 L 228.3,200 A 20,20 0 0,1 168.3,200 L 133.3,200 L 133.3,135 A 20,20 0 0,1 133.3,65 Z" />

      <path v-if="achievementStore.isUnlocked('forms', 'hard')" class="puzzle-piece" fill="url(#puzzle-image)"
        d="M 266.6,0 L 400,0 L 400,200 L 361.6,200 A 20,20 0 0,1 301.6,200 L 266.6,200 L 266.6,135 A 20,20 0 0,1 266.6,65 Z" />

      <path v-if="achievementStore.isUnlocked('numbers', 'easy')" class="puzzle-piece" fill="url(#puzzle-image)"
        d="M 0,200 L 35,200 A 20,20 0 0,1 95,200 L 133.3,200 L 133.3,265 A 20,20 0 0,1 133.3,335 L 133.3,400 L 95,400 A 20,20 0 0,1 35,400 L 0,400 Z" />

      <path v-if="achievementStore.isUnlocked('numbers', 'medium')" class="puzzle-piece" fill="url(#puzzle-image)"
        d="M 133.3,200 L 168.3,200 A 20,20 0 0,1 228.3,200 L 266.6,200 L 266.6,265 A 20,20 0 0,1 266.6,335 L 266.6,400 L 228.3,400 A 20,20 0 0,1 168.3,400 L 133.3,400 L 133.3,335 A 20,20 0 0,1 133.3,265 Z" />

      <path v-if="achievementStore.isUnlocked('numbers', 'hard')" class="puzzle-piece" fill="url(#puzzle-image)"
        d="M 266.6,200 L 301.6,200 A 20,20 0 0,1 361.6,200 L 400,200 L 400,400 L 361.6,400 A 20,20 0 0,1 301.6,400 L 266.6,400 L 266.6,335 A 20,20 0 0,1 266.6,265 Z" />


      <path v-if="achievementStore.isUnlocked('sounds', 'easy')" class="puzzle-piece" fill="url(#puzzle-image)"
        d="M 0,400 L 35,400 A 20,20 0 0,1 95,400 L 133.3,400 L 133.3,465 A 20,20 0 0,1 133.3,535 L 133.3,600 L 0,600 Z" />

      <path v-if="achievementStore.isUnlocked('sounds', 'medium')" class="puzzle-piece" fill="url(#puzzle-image)"
        d="M 133.3,400 L 168.3,400 A 20,20 0 0,1 228.3,400 L 266.6,400 L 266.6,465 A 20,20 0 0,1 266.6,535 L 266.6,600 L 133.3,600 L 133.3,535 A 20,20 0 0,1 133.3,465 Z" />

      <path v-if="achievementStore.isUnlocked('sounds', 'hard')" class="puzzle-piece" fill="url(#puzzle-image)"
        d="M 266.6,400 L 301.6,400 A 20,20 0 0,1 361.6,400 L 400,400 L 400,600 L 266.6,600 L 266.6,535 A 20,20 0 0,1 266.6,465 Z" />
    </svg>

    <AppButton
      v-if="achievementStore.totalUnlockeds > 0"
      text="Ver efeito novamente"
      @click="playReward"
    />
  </div>
</template>
