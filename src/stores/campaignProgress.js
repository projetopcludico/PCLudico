import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'pcludico-campaign-progress'

const GAME_TYPES = ['forms', 'numbers', 'sounds']
const DIFFICULTIES = ['easy', 'medium', 'hard']
const PHASES = ['one', 'two', 'three']

function createEmptyProgress() {
  const progress = {}
  for (const type of GAME_TYPES) {
    progress[type] = {}
    for (const diff of DIFFICULTIES) {
      progress[type][diff] = { one: false, two: false, three: false }
    }
  }
  return progress
}

function loadProgress() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return createEmptyProgress()
    }
  }
  return createEmptyProgress()
}

export const useCampaignProgressStore = defineStore('campaignProgressStore', () => {
  const progress = ref(loadProgress())

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress.value))
  }

  function markPhaseCompleted(gameType, difficulty, phase) {
    if (!progress.value[gameType]?.[difficulty]) return
    progress.value[gameType][difficulty][phase] = true
    saveToStorage()
  }

  function isPhaseCompleted(gameType, difficulty, phase) {
    return progress.value?.[gameType]?.[difficulty]?.[phase] === true
  }

  function isDifficultyCompleted(gameType, difficulty) {
    return PHASES.every((phase) => isPhaseCompleted(gameType, difficulty, phase))
  }

  function canAccessDifficulty(gameType, difficulty) {
    if (difficulty === 'easy') return true
    if (difficulty === 'medium') return isDifficultyCompleted(gameType, 'easy')
    if (difficulty === 'hard') return isDifficultyCompleted(gameType, 'medium')
    return false
  }

  function canAccessPhase(gameType, difficulty, phase) {
    if (phase === 'one') return true
    if (phase === 'two') return isPhaseCompleted(gameType, difficulty, 'one')
    if (phase === 'three') return isPhaseCompleted(gameType, difficulty, 'two')
    return false
  }

  function getNextUnlockedPhase(gameType, difficulty) {
    for (const phase of PHASES) {
      if (!isPhaseCompleted(gameType, difficulty, phase) && canAccessPhase(gameType, difficulty, phase)) {
        return phase
      }
    }
    return null
  }

  function getNextDifficulty(gameType, difficulty) {
    const diffIndex = DIFFICULTIES.indexOf(difficulty)
    if (diffIndex === -1 || diffIndex >= DIFFICULTIES.length - 1) return null
    if (!isDifficultyCompleted(gameType, difficulty)) return null
    return DIFFICULTIES[diffIndex + 1]
  }

  function getNextGameType(gameType) {
    const typeIndex = GAME_TYPES.indexOf(gameType)
    if (typeIndex === -1 || typeIndex >= GAME_TYPES.length - 1) return null
    const currentType = GAME_TYPES[typeIndex]
    if (!isDifficultyCompleted(currentType, 'hard')) return null
    return GAME_TYPES[typeIndex + 1]
  }

  function reset() {
    progress.value = createEmptyProgress()
    saveToStorage()
  }

  return {
    progress,
    markPhaseCompleted,
    isPhaseCompleted,
    isDifficultyCompleted,
    canAccessDifficulty,
    canAccessPhase,
    getNextUnlockedPhase,
    getNextDifficulty,
    getNextGameType,
    reset,
  }
}, {
  persist: false,
})
