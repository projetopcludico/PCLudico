<script setup>
import { useFontSize } from '@/composables/useFontSize'
const { increment, decrement } = useFontSize()
</script>
<template>
  <header
    class="flex justify-between bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white py-5 px-10"
  >
    <h1 class="flex items-center gap-2">
      <img class="w-8 h-8" src="/imgs/logo.svg" alt="logo" />
      <p class="text-2xl">Trama</p>
    </h1>
    <div class="flex gap-2">
      <button
        class="text-[#D599FF] bg-[#D599FF]/20 border dark:bg-[#9370FF]/20 dark:text-[#9370FF] text-lg w-10 rounded-xl cursor-pointer"
        @click="increment"
      >
        A+
      </button>
      <button
        class="text-[#D599FF] bg-[#D599FF]/20 border dark:bg-[#9370FF]/20 dark:text-[#9370FF] text-sm w-10 rounded-xl cursor-pointer"
        @click="decrement"
      >
        A-
      </button>
    </div>
  </header>
</template>
