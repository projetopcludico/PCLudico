import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import achievementsData from '@/data/achievements.json'

const STORAGE_KEY = import.meta.env.VITE_ACHIEVEMENTS_STORAGE_KEY

export const useAchievementStore = defineStore('achievementStore', () => {
  function loadAchievements() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    return structuredClone(achievementsData)
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements.value))
  }

  const achievements = ref(loadAchievements())

  const totalUnlockeds = computed(() => {
    let total = 0
    for (let mode in achievements.value) {
      for (let difficulty in achievements.value[mode]) {
        if (achievements.value[mode][difficulty].unlocked === true) total++
      }
    }
    return total
  })

  function isUnlocked(mode, difficulty) {
    return achievements.value?.[mode]?.[difficulty]?.unlocked === true
  }

  function unlockAchievement(mode, difficulty) {
    const achievement = achievements.value?.[mode]?.[difficulty]

    if (!achievement) return

    achievement.unlocked = true
    saveToStorage()
    return achievement
  }

  return {
    achievements,
    totalUnlockeds,
    isUnlocked,
    unlockAchievement,
  }
})
