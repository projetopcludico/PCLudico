import { defineStore } from 'pinia'
import { ref } from 'vue'

const useExempleStore = defineStore('exempleStore', () => {
  const exemple = ref('Olá Mundo')

  function changeExemple(value) {
    exemple.value = value
  }

  return {
    exemple,
    changeExemple,
  }
})
