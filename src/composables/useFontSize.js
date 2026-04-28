import { ref, watch } from 'vue'

const DEFAULT = 16
const MIN = 14
const MAX = 22

const fontSize = ref(parseFloat(localStorage.getItem('fontSize')) || DEFAULT)

export function useFontSize() {
  const apply = () => {
    document.documentElement.style.fontSize = fontSize.value + 'px'
  }

  const increment = () => {
    if (fontSize.value < MAX) fontSize.value += 1
  }

  const decrement = () => {
    if (fontSize.value > MIN) fontSize.value -= 1
  }

  const reset = () => {
    fontSize.value = DEFAULT
  }

  watch(fontSize, (value) => {
    localStorage.setItem('fontSize', value)
    apply()
  }, { immediate: true })

  return { 
    fontSize,
    increment,
    decrement,
    reset, 
    apply,
  }
}
