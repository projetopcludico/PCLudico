<script setup>
import { useFontSize } from '@/composables/useFontSize'
import AppButton from '../buttons/AppButton.vue'
import { onMounted, ref } from 'vue'
import LogoText from '../decorators/LogoText.vue'
const { increment, decrement } = useFontSize()
const isDark = ref(false)

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  document.documentElement.classList.toggle('dark', isDark.value)
})
</script>
<template>
  <header
    class="flex justify-between bg-white text-slate-900 dark:bg-slate-900 dark:text-white py-5 px-10 md:px-20"
  >
    <LogoText text="TRAMA" />
    <ul class="flex gap-4 items-center">
      <li class="gap-2 hidden md:flex">
        <AppButton text="A+" @on-click="increment" :mode="isDark ? 'purple' : 'blue'" />
        <AppButton text="A-" @on-click="decrement" :mode="isDark ? 'purple' : 'blue'" />
      </li>
      <li>
        <button
          class="border-2 rounded-full w-8 h-8 cursor-pointer transition-all duration-200 hover:scale-98 active:scale-97 hover:opacity-80 md:w-10 md:h-10"
        >
          <span class="mdi mdi-human text-xl"></span>
        </button>
      </li>
      <li>
        <button class="py-1 px-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-slate-900/10 hover:dark:bg-white/10" @click="toggleTheme">
          <span :class="['text-3xl', isDark ? 'mdi mdi-white-balance-sunny' : 'mdi mdi-weather-night']"></span>
        </button>
      </li>
    </ul>
  </header>
</template>
