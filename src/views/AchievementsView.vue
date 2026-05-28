<script setup>
import AchievementCard from '@/components/cards/AchievementCard.vue'
import { useAchievementStore } from '@/stores/achievements'
import { onMounted } from 'vue'
const achievementStore = useAchievementStore()

onMounted(() => {
  achievementStore.getAchievements()
  if(achievementStore.achievementsView.length > 0) {
    achievementStore.selectAchievement(achievementStore.achievementsView[0])
  }
})
</script>
<template>
  <section class="grid grid-cols-3">
    <aside class="flex flex-col gap-5 items-center col-span-1 dark:bg-slate-900 h-screen p-6">
      <h1 class="">
        Conquistas {{ achievementStore.totalUnlockeds }}/
        {{ achievementStore.achievementsView.length }}
      </h1>
      <ul class="grid grid-cols-2 gap-2 w-full">
        <li
          v-for="(achievement, index) in achievementStore.achievementsView"
          :key="index"
          @click="achievementStore.selectAchievement(achievement)"
        >
          <AchievementCard :name="achievement.name" :type="achievement.type" :unlocked="achievement.unlocked"/>
        </li>
      </ul>
    </aside>
    <div
      class="col-span-2 overflow-y-auto max-h-screen custom-scrollbar p-10 mr-2 pr-5"
    >
      <div v-if="achievementStore.currentAchievement" class="flex flex-col items-center gap-5">
        <h1 class="text-xl font-semibold uppercase tracking-widest">{{ achievementStore.currentAchievement.name }}</h1>
        <p
          class="text-left"
          v-for="(paragraph, index) in achievementStore.currentAchievement.paragraphs"
          :key="index"
        >
          {{ paragraph }}
        </p>
      </div>
    </div>
  </section>
</template>
