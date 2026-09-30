<script setup>
import { useRouter } from 'vue-router'
import { useAudioStore } from '@/stores/sounds'
const router = useRouter()
const audioStore = useAudioStore()

const emits = defineEmits(['openAccessibility'])

const props = defineProps({
  time: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <section class="flex items-center justify-between text-3xl dark:text-zinc-200">
      <button
        class="rounded-xl px-2 py-1 cursor-pointer transition-all duration-200 hover:bg-white/10"
      >
        <span class="mdi mdi-home" @click="router.push('/')"></span>
      </button>
      <h1 class="text-2xl bg-black/50 rounded-xl px-6 text-white">
        {{ props.time }}
      </h1>
      <ul class="flex gap-5">
        <li>
          <button
            class="rounded-xl px-2 py-1 cursor-pointer transition-all duration-200 hover:bg-white/10"
            @click="audioStore.toggleBgmVolume"
          >
            <span :class="audioStore.muted ? 'mdi mdi-volume-off' : 'mdi mdi-volume-high'"></span>
          </button>
        </li>
        <li>
          <button
            class="rounded-xl px-2 py-1 cursor-pointer transition-all duration-200 hover:bg-white/10"
            @click="emits('openAccessibility')"
          >
            <span class="mdi mdi-cog"></span>
          </button>
        </li>
      </ul>
    </section>
</template>
