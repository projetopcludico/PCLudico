import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";

const BGM_MAP = {
  forms: '/sounds/backgrounds/egypt.mp3',
  numbers: '/sounds/backgrounds/futurist.mp3',
}

export const useAudioStore = defineStore('audioStore', () => {

    const state = reactive({
        currentSequence: null,
        sound: new Audio(),
        bgm: new Audio(),
        feedback: new Audio(),
    });

    const sound = computed(() => state.sound);
    const currentIndex = ref(0)
    const bgmVolume = ref(0.5)

    const playAudio = (path) => {
        if(state.currentSequence) {
            state.currentSequence = null
        }

        state.sound.src = path
        state.sound.play();
    }

    const playBackground = (mode) => {
      const src = BGM_MAP[mode]
      if (!src) return

      stopBackground()

      state.bgm.src = src
      state.bgm.loop = true
      state.bgm.volume = bgmVolume.value
      state.bgm.play()
    }

    const stopBackground = () => {
      state.bgm.pause()
      state.bgm.src = ''
    }

    const playFeedback = (type) => {
      state.feedback.src = `/sounds/feedbacks/${type}.mp3`
      state.feedback.play()
    }

    const playSequence = (sequence) => {
        if(state.currentSequence) state.currentSequence = null

        currentIndex.value = 0
        state.currentSequence = sequence;

        const playNext = () => {

            if(currentIndex.value >= state.currentSequence.length) return;

            if(state.currentSequence[currentIndex.value].object.path == '') {
                currentIndex.value++;
                setTimeout( playNext, 1000 );
                return
            }

            state.sound.src = state.currentSequence[currentIndex.value].object.path
            state.sound.play();

            state.sound.onended = () => {
                currentIndex.value++;
                playNext();
            }

        }

        playNext();

    }

    return{
        playAudio,
        playBackground,
        stopBackground,
        playFeedback,
        playSequence,
        sound,
        currentIndex,
        bgmVolume,
    }

})