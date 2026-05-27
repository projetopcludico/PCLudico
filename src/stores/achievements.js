import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import achievementsData from '@/data/achievements.json'

const STORAGE_KEY = 'pcludico-achievements'

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

  function unlockAchievement(mode, difficulty) {
    const achievement = achievements.value?.[mode]?.[difficulty]

    if(!achievement) return

    achievement.unlocked = true
    saveToStorage()
    return achievement
  }

  return {
    achievements,
    unlockAchievement
  }
})
