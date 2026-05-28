import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
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
  const achievementsView = ref([])
  const currentAchievement = ref({})
  const totalUnlockeds = computed(() => achievementsView.value.filter(achievement => achievement.unlocked === true).length)

  function getAchievements() {
    achievementsView.value = []
    const achievements = loadAchievements()
    for (let theme in achievements) {
      for (let achievement in achievements[theme]) {
        achievementsView.value.push(achievements[theme][achievement])
      }
    }
  }

  function selectAchievement(achievement) {
    currentAchievement.value = achievement
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
    achievementsView,
    currentAchievement,
    totalUnlockeds,
    getAchievements,
    selectAchievement,
    unlockAchievement,
  }
})
