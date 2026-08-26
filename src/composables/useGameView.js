import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApplicationStore } from '@/stores/application'
import { useSequenceStore } from '@/stores/sequence'
import { useTimeStamp } from '@/stores/timeStamp'
import { useAudioStore } from '@/stores/sounds'
import { useCampaignProgressStore } from '@/stores/campaignProgress'
import { usePageTransition } from '@/composables/usePageTransition'
import { useFeedbackAnimation } from '@/composables/useFeedbackAnimation'
import { difficultyLabel } from '@/utils/difficultyLabel'

export function useGameView(mode, { onTryAgain, onBeforeAnswer, onSelect, onMount } = {}) {
  const route = useRoute()
  const router = useRouter()
  const applicationStore = useApplicationStore()
  const sequenceStore = useSequenceStore()
  const timeStamp = useTimeStamp()
  const audioStore = useAudioStore()
  const campaignProgress = useCampaignProgressStore()

  const pageRef = ref(null)
  const { enter } = usePageTransition(pageRef)
  const sequenceRefs = ref([])
  const { playCorrectFeedback, playWrongFeedback } = useFeedbackAnimation(sequenceRefs)

  const difficulty = computed(() => difficultyLabel(route.params.difficulty))

  function goToFeedBack() {
    const responses = applicationStore.getResponses(mode)
    const required = applicationStore.requiredResponses[mode]
    const gameMode = applicationStore.gameStatus.gameMode
    const gameDifficulty = route.params.difficulty
    const gamePhase = route.params.phase

    applicationStore.setHits(responses)
    applicationStore.setRequired(required)
    applicationStore.setMode(mode)
    applicationStore.setDifficulty(gameDifficulty)
    applicationStore.setPhase(gamePhase)

    const success = responses >= required

    if (success && gameMode === 'campaign') {
      campaignProgress.markPhaseCompleted(mode, gameDifficulty, gamePhase)
    }

    if (success && gamePhase === 'three' && gameMode === 'campaign') {
      router.push({
        name: 'unlock-view',
        params: { mode, difficulty: gameDifficulty },
      })
    } else {
      router.push({
        name: 'feedback-view',
      })
    }
  }

  function tryAgain(start = false) {
    onTryAgain({
      difficulty: route.params.difficulty,
      phase: route.params.phase,
      goToFeedBack,
      start,
    })
  }

  function onAnswer(index) {
    if (onBeforeAnswer) {
      onBeforeAnswer(index, sequenceStore.sequence[index]?.object)
    }

    const result = sequenceStore.answerObjectSequence(index, mode)
    if (result === 'correct' || result === 'complete') {
      audioStore.playFeedback('correct')
      if (sequenceRefs.value[index]) playCorrectFeedback(index)
      if (result === 'complete') {
        setTimeout(() => tryAgain(), 1500)
      }
    } else if (result === 'wrong') {
      audioStore.playFeedback('error')
      playWrongFeedback(index)
    }
  }

  function handleSelect(choice) {
    if (onSelect) {
      onSelect(choice)
    } else {
      sequenceStore.selectChoice(choice)
    }
  }

  onMounted(async () => {
    tryAgain(true)
    if (onMount) onMount()
    await nextTick()
    enter(1)
  })

  onUnmounted(() => {
    timeStamp.reset()
    applicationStore.resetResponses(mode)
    audioStore.stopBackground()
  })

  return {
    pageRef,
    sequenceRefs,
    difficulty,
    timeStamp,
    audioStore,
    sequenceStore,
    applicationStore,
    handleSelect,
    onAnswer,
    tryAgain,
  }
}
