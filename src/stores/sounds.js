import { defineStore } from 'pinia'
import { ref } from 'vue'

const BGM_MAP = {
  forms: '/sounds/backgrounds/egypt.mp3',
  numbers: '/sounds/backgrounds/futurist.mp3',
}

export const useAudioStore = defineStore('audioStore', () => {
  const sound = ref(new Audio())
  const bgm = ref(new Audio())
  const feedback = ref(new Audio())
  const muted = ref(false)
  const currentSequence = ref(null)
  const currentIndex = ref(0)
  const bgmVolume = ref(0.08)

  const playAudio = (path) => {
    if (currentSequence.value) {
      currentSequence.value = null
    }

    sound.value.src = path
    sound.value.play()
  }

  const playBackground = (mode) => {
    const src = BGM_MAP[mode]
    if (!src) return

    stopBackground()

    bgm.value.src = src
    bgm.value.loop = true
    bgm.value.volume = bgmVolume.value
    bgm.value.play()
  }

  const stopBackground = () => {
    bgm.value.pause()
    bgm.value.src = ''
  }

  const toggleBgmVolume = () => {
    if (muted.value) {
      muted.value = false
      bgm.value.volume = bgmVolume.value
      return
    }

    muted.value = true
    bgm.value.volume = 0
  }

  const playFeedback = (type, volume = 1) => {
    feedback.value.src = `/sounds/feedbacks/${type}.mp3`
    feedback.value.volume = volume
    feedback.value.play()
  }

  const playSequence = (sequence) => {
    if (currentSequence.value) currentSequence.value = null

    currentIndex.value = 0
    currentSequence.value = sequence

    const playNext = () => {
      if (currentIndex.value >= currentSequence.value.length) return

      if (currentSequence.value[currentIndex.value].object.path == '') {
        currentIndex.value++
        setTimeout(playNext, 1000)
        return
      }

      sound.value.src = currentSequence.value[currentIndex.value].object.path
      sound.value.play()

      sound.value.onended = () => {
        currentIndex.value++
        playNext()
      }
    }

    playNext()
  }

  return {
    playAudio,
    playBackground,
    stopBackground,
    playFeedback,
    playSequence,
    toggleBgmVolume,
    sound,
    muted,
    currentIndex,
    bgmVolume,
  }
})
