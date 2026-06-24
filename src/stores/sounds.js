import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";

export const useAudioStore = defineStore('audioStore', () => {

    const state = reactive({
        currentSequence: null,
        sound: new Audio(),
    });

    const sound = computed(() => state.sound);
    const currentIndex = ref(0)

    const playAudio = (path) => {
        if(state.currentSequence) {
            state.currentSequence = null
        }

        state.sound.src = path
        state.sound.play();
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
        playSequence,
        sound,
        currentIndex
    }

})