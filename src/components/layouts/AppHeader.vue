<script setup>
import { useFontSize } from '@/composables/useFontSize'
import AppButton from '../buttons/AppButton.vue'
const { increment, decrement } = useFontSize()
</script>
<template>
  <header
    class="flex justify-between bg-white text-slate-950 dark:bg-slate-950 dark:text-white py-5 px-10"
  >
    <h1 class="flex items-center gap-2">
      <img class="w-8 h-8" src="/imgs/logo.svg" alt="logo" />
      <p class="text-2xl font-semibold font-serif">TRAMA</p>
    </h1>
    <ul class="flex gap-4 items-center">
      <li class="flex gap-2">
        <AppButton text="A+" @on-click="increment" />
        <AppButton text="A-" @on-click="decrement" />
      </li>
      <li>
        <button class="border-2 rounded-full w-10 h-10 cursor-pointer transition-all duration-200 hover:scale-98 active:scale-97 hover:opacity-80">
          <span class="mdi mdi-human text-xl"></span>
        </button>
      </li>
    </ul>
  </header>
</template>
