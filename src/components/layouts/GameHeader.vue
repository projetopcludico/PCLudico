<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const emits = defineEmits(['openAcessibility'])

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <section>
    <section class="flex items-center justify-between text-4xl text-zinc-200">
      <button class="rounded-xl px-2 py-1 cursor-pointer transition-all duration-200 hover:bg-white/10">
        <span class="mdi mdi-home" @click="router.push('/')"></span>
      </button>
      <h1 class="bg-black/50 rounded-xl px-6 py-2">
        {{ props.title }}
      </h1>
      <button class="rounded-xl px-2 py-1 cursor-pointer transition-all duration-200 hover:bg-white/10" @click="emits('openAcessibility')">
        <span class="mdi mdi-cog"></span>
      </button>
    </section>
  </section>
</template>
